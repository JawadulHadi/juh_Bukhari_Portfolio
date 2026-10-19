# 🧱 ADR-002: Three-Tier Resilience for a Provider-Agnostic LLM Gateway

**Status:** Accepted
**Date:** 2024
**Context:** Talentrix, multi-tenant HRMS SaaS
**Supersedes:** ADR-001 (Single-provider OpenAI integration)

---

## 1. Context & Problem

> _"You cut AI integration complexity 60%. What did the before graph look like, and what's the one design decision that made the biggest dent?"_

**Before ADR-002:**

```markdown
Feature A ──► OpenAI SDK
Feature B ──► OpenAI SDK (different retry logic)
Feature C ──► Gemini SDK (added later, copy-pasted)
Feature D ──► Anthropic SDK (added later, yet another copy)
```

Four features, four integration paths, three providers, zero shared failure semantics. When OpenAI had an outage in Q1, three features broke differently — one retried forever, one surfaced a 500 to the user, one silently returned empty strings. **Zero shared contract.**

**The one decision that made the biggest dent:** a **single `LlmGateway` interface** that every feature calls, with provider selection, retry, fallback, and observability _inside_ the boundary — never in the caller.

```ts
interface LlmGateway {
  complete(req: LlmRequest): Promise<LlmResponse>;
}

// Callers only ever see this. They never import openai, @google/generative-ai,
// or @anthropic-ai/sdk. Ever.
```

Everything else in this ADR is downstream of that constraint.

---

### 2. Decision

Adopt a **three-tier resilience pattern** behind the gateway:

```markdown
┌─────────────────────────────────────────────────┐
│ Tier 1: RETRY (same provider, backoff) │
│ ─ transient 429/5xx/network ──────────────────►│
├─────────────────────────────────────────────────┤
│ Tier 2: RAG FALLBACK (different provider, │
│ retrieved context, cheaper model) │
│ ─ provider down OR schema violation ──────────►│
├─────────────────────────────────────────────────┤
│ Tier 3: RULE-BASED FLOOR (no LLM at all) │
│ ─ all providers degraded OR budget exhausted ─►│
└─────────────────────────────────────────────────┘
```

Each tier is **strictly worse in quality, strictly better in availability**. The gateway always returns _something_ — the caller never sees an AI failure as a 5xx.

---

### 3. The Failure Taxonomy (Q4)

> _"Walk me through the failure taxonomy — which failures were caught by retry, which by RAG, which by the rule floor — and which one almost slipped through?"_

This is the **heart** of the ADR. The tiers exist because failures aren't one thing:

| Failure class           | Example                                                | Caught by                               | Why not the tier above                      |
| ----------------------- | ------------------------------------------------------ | --------------------------------------- | ------------------------------------------- |
| **Transient**           | 429 rate limit, 503, TCP reset                         | **Tier 1 (Retry)**                      | It'll likely succeed on the 2nd/3rd try     |
| **Provider-wide**       | OpenAI status page red, all 5xx                        | **Tier 2 (RAG)**                        | Retry burns time and budget for nothing     |
| **Schema violation**    | Model returns malformed JSON for structured output     | **Tier 2 (RAG)**                        | Same provider will likely fail the same way |
| **Capability miss**     | Task needs 200k context, provider max is 128k          | **Tier 2 (RAG)**                        | Not a failure — a mismatch; route elsewhere |
| **Budget exhausted**    | Tenant hit their monthly token cap                     | **Tier 3 (Floor)**                      | No provider call is allowed                 |
| **Total degradation**   | All 3 providers down simultaneously                    | **Tier 3 (Floor)**                      | Nothing left to try                         |
| **Semantic failure** ⚠️ | Model confidently returns wrong-but-well-formed answer | **Nothing — escalated to human review** | _This almost slipped through_               |

**The one that almost slipped through:** a _semantically wrong but structurally perfect_ response during a Gemini degradation window. Every tier above said "success." We caught it because a downstream payroll validation rejected the number — but only by luck of having a validator there.

**The fix (now part of the pattern):** Tier 3 isn't just a fallback — it's also a **validator**. If the LLM response fails a domain invariant (e.g., "salary change > 50% requires approval"), we _downgrade_ to the rule floor and flag for review, even if the LLM call "succeeded."

This is the **most important lesson in the ADR**: _availability ≠ correctness._ The three tiers protect availability. A fourth, orthogonal concept — **invariant validation** — protects correctness. Don't conflate them.

---

### 4. Escalation Logic (Q1)

> _"How do you decide when to escalate a tier vs retry — and what's the observable signal that tells you the LLM is degraded vs just slow?"_

**The rule:**

```ts
escalate(from: Tier, signal: Signal): Tier {
  if (from === RETRY) {
    if (signal.type === 'TRANSIENT' && signal.attempts < 3) return RETRY;
    if (signal.type === 'PROVIDER_DOWN') return RAG;
    if (signal.type === 'SCHEMA_VIOLATION') return RAG;      // retry won't help
    if (signal.type === 'BUDGET_EXHAUSTED') return FLOOR;
    return RAG;                                               // default
  }
  if (from === RAG) {
    if (signal.type === 'PROVIDER_DOWN' && allProvidersDown()) return FLOOR;
    if (signal.type === 'BUDGET_EXHAUSTED') return FLOOR;
    return FLOOR;                                             // RAG has no retry budget
  }
  return FLOOR;
}
```

**Degraded vs slow — the observable signal:**

- **Slow** = latency p95 up, error rate flat. → _Retry, don't escalate._
- **Degraded** = error rate up, _or_ schema violation rate up, _or_ provider status webhook flips. → _Escalate immediately._

We track a **rolling 60-second degradation score** per provider:

```
degradation = (5xx_rate × 3) + (schema_violation_rate × 5) + (timeout_rate × 2)
```

Threshold crossing flips that provider into "degraded" for the next 60s — meaning requests **skip Tier 1 for that provider** and go straight to RAG. This is what let us hit zero failures during the outage: we weren't retrying a dead provider, we were already routing around it.

---

### 5. The Abstraction Leak Problem (Q2)

> _"Provider-agnostic gateways leak. Where does the abstraction break, and how do you hide that from callers?"_

**Where it leaks:**

| Capability        | OpenAI                   | Gemini                 | Anthropic                  | Leak                                    |
| ----------------- | ------------------------ | ---------------------- | -------------------------- | --------------------------------------- |
| Structured output | `response_format`        | `responseSchema`       | Tool-use only              | **Different semantics for "JSON mode"** |
| Tool calling      | `tools` + `tool_choice`  | `functionDeclarations` | `tools`                    | **Different argument shapes**           |
| Streaming         | SSE, `delta`             | SSE, `candidates`      | SSE, `content_block_delta` | **Different chunk shapes**              |
| Token accounting  | `usage` on last chunk    | `usageMetadata`        | `usage` on message_stop    | **Different timing**                    |
| Context window    | 128k / 200k (model dep.) | 1M                     | 200k                       | **Routing constraint**                  |

**How we hide it:**

1. **Normalize at the boundary, not at the caller.** Every provider adapter emits a canonical `LlmResponse` with `content`, `usage`, `stopReason`, `providerMeta`. Callers never see the raw shape.
2. **Structured output is a first-class gateway concern.** We don't rely on any provider's native JSON mode. We validate with **Zod schemas**, retry once with a corrective prompt, then escalate to RAG. _This is why schema violation is a first-class failure class._
3. **Tool calling is the leaky one we accepted.** We expose a common `tools` interface but document that **argument fidelity varies** — the rule floor has hardcoded tool handlers as the safety net.
4. **Streaming is opt-in.** Most Talentrix features don't stream. For the ones that do, we expose a normalized SSE envelope and eat the complexity internally.

**Honest answer:** the abstraction _does_ leak — the win is that it leaks **in one place** (the gateway) instead of **in every feature.**

---

### 6. Versioning Prompts & Routing Without Deploy (Q5)

> _"How do you version prompts and routing rules so a rollback doesn't require a deploy?"_

Everything that affects LLM behavior is **data, not code**:

```markdown
prompts/
talent-screening/
v1.md
v2.md ← current
v3-candidate.md ← testing

routing/
default.yaml
payroll.yaml ← stricter, prefers Anthropic
```

- Loaded at gateway startup **and** re-loaded via a Redis pub/sub invalidation.
- Each `LlmRequest` carries a `promptVersion` and `routingPolicy` — both **tenant-overridable** for enterprise customers.
- Rollback = flip a pointer in Redis, not a deploy. **Mean time to rollback: <5 seconds.**
- Every response logs `(promptVersion, routingPolicy, provider, tier)` — so a bad output is traceable to a specific config tuple.

---

### 7. Cost & Latency Attribution Per Tenant (Q6)

> _"How do you attribute cost and latency per tenant when 3 providers are in the mix and one silently retries internally?"_

This is the trap: **provider-side retries are invisible to you.** OpenAI can internally retry and you'll only see one call — but you pay for one call, so cost is fine. The issue is **latency** attribution.

**Our model:**

```ts
interface LlmCallRecord {
  tenantId: string;
  requestId: string;
  providerAttempts: Array<{
    provider: "openai" | "gemini" | "anthropic";
    model: string;
    tier: "retry" | "rag" | "floor";
    latencyMs: number;
    tokensIn: number;
    tokensOut: number;
    costUsd: number; // computed from our own price table, NOT provider-reported
    outcome: "success" | "transient" | "schema_violation" | "provider_down";
  }>;
}
```

- **Cost** is computed from _our_ price table (token count × our rates), not provider-reported usage — because provider-reported usage is unreliable across retries.
- **Latency** is wall-clock per attempt, and we report **p50/p95 per tier** to tenants. When OpenAI silently retried, our p95 went up but our error rate stayed flat — that's the tell.
- **Tenant dashboards** show cost _and_ tier distribution. A tenant whose requests are 40% Tier 3 gets a nudge — they're probably hitting the rule floor too often.

---

### 8. Contract with Downstream Callers (Q7)

> _"What's your contract with downstream callers when the rule-based floor answers — do they know it's a fallback, or is it indistinguishable?"_

**They always know.** Every `LlmResponse` carries:

```ts
interface LlmResponse {
  content: string;
  tier: "retry" | "rag" | "floor"; // ← always present
  degraded: boolean; // tier !== 'retry'
  confidence: "high" | "medium" | "low"; // derived from tier + validation
  providerMeta: { provider: string; model: string };
}
```

**Why we made it visible instead of indistinguishable:**

1. **Payroll and HR features must not silently degrade.** A rule-based payroll adjustment is _different_ from an LLM-suggested one. Downstream validators need to know.
2. **UX can adapt.** A "low confidence" badge on a screening result is honest; hiding it isn't.
3. **Observability.** When a tenant complains about quality, the first question is "what tier answered?" — and we already have the answer.

**The tradeoff we accepted:** some callers _ignore_ the tier and treat everything as Tier 1. We solved this with a **lint rule + interface design**: `LlmResponse` is a discriminated union, and `degraded: true` responses require an explicit `acceptDegraded()` call or they throw at runtime. You can't accidentally ignore it.

---

## 🔁 Parallel Answer Index (Staff-Tier Q → ADR Section)

| Q   | Topic                     | ADR Section |
| --- | ------------------------- | ----------- |
| Q1  | Escalation signal         | §4          |
| Q2  | Abstraction leaks         | §5          |
| Q3  | Complexity 60%            | §1          |
| Q4  | Failure taxonomy          | §3          |
| Q5  | Prompt/routing versioning | §6          |
| Q6  | Cost/latency attribution  | §7          |
| Q7  | Downstream contract       | §8          |

---

## ✅ What This ADR Establishes (Your Moat)

1. **You think in taxonomies**, not features. (Failure classes, tier escalation.)
2. **You separate availability from correctness.** (Tier 3 + invariant validation.)
3. **You make failure observable.** (Degradation score, tier in every response.)
4. **You make config data, not code.** (Prompts/routing in Redis.)
5. **You know abstractions leak — and you contain the leak.** (One place, not everywhere.)
6. **You design contracts that can't be ignored.** (Discriminated union + runtime throw.)

That's the difference between a **senior engineer** and a **staff architect** in one document.
