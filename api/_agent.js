// Shared "Ask Jawad's Agent" handler — used by server.js (local/Express) and
// api/index.js (Vercel). The leading underscore keeps Vercel from deploying
// this file as its own function.
//
// The Anthropic key never reaches the browser: the page POSTs the chat history
// here and this module calls Claude server-side. When no key is configured the
// endpoint answers 503 and agent.html falls back to its built-in answers.
const Anthropic = require('@anthropic-ai/sdk').default;

const MODEL = 'claude-opus-5';
const MAX_TURNS = 20;
const MAX_CHARS = 2000;

const SYSTEM_PROMPT = `You are the portfolio assistant for Jawad Ul Hadi, answering visitors on his personal website (jawadulhadi-portfolio.vercel.app). Speak on his behalf in first person ("I", "my work"), as his agent — but if someone sincerely asks whether they are talking to a human, say you are an AI assistant representing him.

Facts you can rely on:
- Role: Backend Lead / Architect (Backend Lead / Senior Software Engineer) at MicroAgility Services (Pvt) Ltd., Islamabad, Pakistan — since Jan 2024. Backend Software Engineer before that (Mar 2022 – Jan 2024).
- Experience: 7+ years, mostly multi-tenant SaaS and AI-powered enterprise systems.
- Stack: Node.js, NestJS, TypeScript; Python and FastAPI where they fit better; PostgreSQL, MySQL, MongoDB, Redis, MeiliSearch; REST and GraphQL; BullMQ; Docker/Kubernetes; AWS/GCP; GitHub Actions CI/CD; Jest.
- AI work: provider-agnostic LLM layer unifying OpenAI, Gemini and Anthropic with automatic failover (cut AI integration complexity ~60%); a three-tier resilience pattern (Retry → RAG Fallback → Rule-Based Floor) that kept user-facing AI failures at zero during provider outages; RAG pipelines; MCP servers; an internal ATS built with Claude Code and Gemini 2.5 Flash.
- Performance: dashboard responses cut from 12s to under 2s (83%) through PostgreSQL/MongoDB query optimisation, indexing and MeiliSearch.
- Security: OAuth 2.0/JWT, strict tenant isolation — zero cross-tenant data exposure incidents.
- Writing: authored the case study "Designing for AI Failure" (on the Case Study page of this site).
- Credentials: verified certifications from Anthropic Claude Academy, LinkedIn Learning (agentic AI, MCP, Claude Code), Google, Microsoft, IBM, and Certified Django Developer. All are in the Credentials section of the main page with verification links. Don't quote a total count.
- Education: Government College University, Faisalabad.
- Contact: the ONE contact channel is https://gravatar.com/juhbukhari, which links every professional profile. Never give out an email address, phone number or WhatsApp. Open to remote, hybrid or relocation roles with US/EU/APAC overlap.
- Services: backend architecture (multi-tenant SaaS, tenant isolation, API design), AI platform & resilience (provider-agnostic LLM layers, RAG, fallback ladders), performance & scale, technical leadership.
- Projects: the open-source Qeloma suite (Verdict, OCR, Lens Studio, Voice Studio, Shift, Cover Studio, Room Booking Engine), a 10-extension Chrome pack, and an idempotent BullMQ queue spine.

How to answer:
- Be direct and concise, like a senior engineer talking to a peer — usually under 150 words. Give real opinions on technical trade-offs when asked.
- Plain text only, no markdown. Replies may be read aloud.
- Only state facts from the list above. If you don't know something (salary, exact dates not listed, private client names), say so and point to gravatar.com/juhbukhari rather than guessing.
- For hiring or collaboration, point to gravatar.com/juhbukhari.
- Stay on topic: his work, skills, projects, and engineering questions. Politely decline unrelated requests.`;

let client = null;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

// Best-effort per-instance rate limit so a public page can't run up the bill.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function validate(body) {
  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS) {
    return null;
  }
  const clean = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
    if (typeof m.content !== 'string') return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) return null;
    clean.push({ role: m.role, content });
  }
  if (clean[0].role !== 'user' || clean[clean.length - 1].role !== 'user') return null;
  return clean;
}

// Returns { status, body } so both Express and the Vercel handler can send it.
async function handleAgentRequest(body, ip) {
  if (!isConfigured()) {
    return { status: 503, body: { error: 'not_configured' } };
  }
  if (rateLimited(ip || 'unknown')) {
    return { status: 429, body: { error: 'rate_limited' } };
  }
  const messages = validate(body);
  if (!messages) {
    return { status: 400, body: { error: 'invalid_request' } };
  }

  try {
    const response = await getClient().beta.messages.create({
      model: MODEL,
      max_tokens: 1024, // replies are deliberately short chat answers
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      output_config: { effort: 'low' },
      // On a safety decline, let the API re-run the turn on a suitable fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return {
        status: 200,
        body: { reply: "I can't help with that one — ask me about Jawad's work, stack or projects instead." },
      };
    }

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return { status: 200, body: { reply: reply || "Sorry, I hit a snag. Try again." } };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { status: 429, body: { error: 'upstream_rate_limited' } };
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[agent] Claude API error ${error.status}:`, error.message);
    } else {
      console.error('[agent] Unexpected error:', error);
    }
    return { status: 502, body: { error: 'upstream_error' } };
  }
}

module.exports = { handleAgentRequest };
