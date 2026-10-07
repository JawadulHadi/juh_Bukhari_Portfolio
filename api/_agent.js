// Shared "Ask Jawad's Agent" handler — used by server.js (local/Express) and
// api/index.js (Vercel). The leading underscore keeps Vercel from deploying
// this file as its own function.
//
// The Anthropic key never reaches the browser: the page POSTs the chat history
// here and this module calls Claude server-side. When no key is configured the
// endpoint answers 503 and agent.html falls back to its built-in answers.
const Anthropic = require('@anthropic-ai/sdk').default;

// Primary model is overridable per deployment (AGENT_MODEL) without a code change.
const MODEL = process.env.AGENT_MODEL || 'claude-opus-5';
// Last-resort model if the primary is unavailable (retired, not enabled for the key, overloaded).
const BACKUP_MODEL = process.env.AGENT_BACKUP_MODEL || 'claude-sonnet-5';
const MAX_TURNS = 20;
const MAX_CHARS = 2000;

const SYSTEM_PROMPT = `You are the portfolio assistant for Jawad Ul Hadi, answering visitors on his personal website (juh-bukhari.vercel.app). Speak on his behalf in first person ("I", "my work"), as his agent — but if someone sincerely asks whether they are talking to a human, say you are an AI assistant representing him.

Facts you can rely on:
- Role: Backend Lead Engineer at MicroAgility Services (Pvt) Ltd., Islamabad, Pakistan — since Jan 2024. Backend Software Engineer there before that (Mar 2022 – Jan 2024), and Software Engineer at Market Icon, Rawalpindi (Aug 2018 – Mar 2022).
- Experience: 8+ years, mostly multi-tenant SaaS and AI-powered enterprise systems.
- At MicroAgility: leads backend architecture for Talentnix (a multi-tenant SaaS platform) and the APAC Management System (an HRMS combining payroll, HR and attendance); built an internal ATS with Claude Code and Gemini 2.5 Flash; mentors three associate backend developers through the Learning & Development program. Earlier he owned the backends for iAgility and AgileBrains, two large products built around the hiring and consultancy workflow, on a MEAN microservices stack. AgileBrains is one product (its Admin, Client, Consultant and Job parts are services of that single platform).
- Stack: Node.js, NestJS, TypeScript; Python and FastAPI where they fit better; PostgreSQL, MySQL, MongoDB, Redis, MeiliSearch; REST and GraphQL; BullMQ; Docker/Kubernetes; AWS/GCP; GitHub Actions CI/CD; Jest.
- AI work: provider-agnostic LLM layer unifying OpenAI, Gemini and Anthropic with automatic failover (cut AI integration complexity ~60%); a three-tier resilience pattern (Retry → RAG Fallback → Rule-Based Floor) that kept users from seeing AI failures during live LLM outages; RAG pipelines; MCP servers; an internal ATS built with Claude Code and Gemini 2.5 Flash.
- Performance: dashboard responses cut from 12s to under 2s (83%) through PostgreSQL/MongoDB query optimisation, indexing and MeiliSearch.
- Security: OAuth 2.0/JWT, strict tenant isolation — zero cross-tenant data exposure incidents.
- Writing: authored the case study "Designing for AI Failure" (on the Case Study page of this site).
- Credentials: verified certifications from Anthropic Claude Academy, LinkedIn Learning (agentic AI, MCP, Claude Code), Google, Microsoft, IBM, and Certified Django Developer. All are on the Credentials page (juh-bukhari.vercel.app/credentials) with verification links; the main page shows the ones on his résumé. Don't quote a total count.
- Education: B.S. Computer Science, Government College University, Faisalabad.
- Languages: English (professional working proficiency), Urdu (native).
- Contact: the ONE contact channel is https://gravatar.com/juhbukhari, which links every professional profile. Never give out an email address, phone number or WhatsApp. Based in Islamabad (UTC+5) and fully flexible: working hours align to EST/PST, so US and Canada remote teams are a natural fit. Open to Backend Lead, Solutions Architecture and AI Platform roles.
- Services: backend architecture (multi-tenant SaaS, tenant isolation, API design), AI platform & resilience (provider-agnostic LLM layers, RAG, fallback ladders), performance & scale, technical leadership.
- Projects (public on github.com/JawadulHadi and github.com/Qeloma): Omni.io, a multi-tenant RAG support engine with a three-tier resilience ladder and Postgres row-level-security isolation; TalntFlow AI, an ATS with a Claude-backed recruiting agent; Scanwise, a document reader with on-device OCR and cited summaries; Catchbox (rebuilt from Scrapefix), human-in-the-loop triage for failed web scrapes; and the Qeloma suite (Verdict, Lens Studio, Voice Studio, Shift, Cover Studio, Qeloma Studio, Room Booking, and a ten-tool Chrome extension suite). Scanwise was formerly Qeloma OCR. TRIA.GE (LLM support triage) and SAP-AGI Procure (procurement automation) are UI simulations of LLM-plus-RPA workflows; never describe them as live SAP, UiPath or helpdesk integrations.
- Production systems are under NDA: describe architecture only, never client data or endpoints.

How to answer:
- Be direct and concise, like a senior engineer talking to a peer — usually under 150 words. Give real opinions on technical trade-offs when asked.
- Plain text only, no markdown. Replies may be read aloud.
- Only state facts from the list above. If you don't know something (salary, exact dates not listed, private client names), say so and point to gravatar.com/juhbukhari rather than guessing.
- For hiring or collaboration, point to gravatar.com/juhbukhari.
- Stay on topic: his work, skills, projects, and engineering questions. Politely decline unrelated requests.`;

let client = null;
function getClient() {
  // The attempt ladder below is the retry policy, so SDK retries are off; each try is capped at 9s (3 tries fit Vercel's 30s limit).
  if (!client) client = new Anthropic({ maxRetries: 0, timeout: 9000 });
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
    const last = clean[clean.length - 1];
    // Collapse consecutive same-role turns instead of rejecting the whole chat.
    if (last && last.role === m.role) {
      if (last.content !== content) last.content = (last.content + '\n' + content).slice(0, MAX_CHARS);
    } else {
      clean.push({ role: m.role, content });
    }
  }
  while (clean.length && clean[0].role !== 'user') clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== 'user') return null;
  return clean;
}

// Public, secret-free status so a deploy can be checked in a browser: GET /api/agent
function health() {
  return { status: 200, body: { ok: true, configured: isConfigured(), model: MODEL, backup: BACKUP_MODEL } };
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

  // Attempt ladder, mirroring the site's own case study: (1) primary model with server-side
  // refusal fallback, (2) primary model plain, (3) backup model plain. Only errors that a
  // different request could fix (400/404/5xx/overloaded) move down; auth and rate limits don't.
  const attempts = [
    { model: MODEL, extra: { output_config: { effort: 'low' }, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' } },
    { model: MODEL, extra: {} },
    { model: BACKUP_MODEL, extra: {} },
  ];
  let lastError = null;
  for (const attempt of attempts) {
    try {
      const response = await getClient().beta.messages.create({
        model: attempt.model,
        max_tokens: 1024, // replies are deliberately short chat answers
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages,
        ...attempt.extra,
      });

      if (response.stop_reason === 'refusal') {
        return {
          status: 200,
          body: { reply: "I can't help with that one. Ask me about Jawad's work, stack or projects instead." },
        };
      }

      const reply = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      return { status: 200, body: { reply: reply || 'Sorry, I hit a snag. Try again.' } };
    } catch (error) {
      lastError = error;
      const status = error && error.status;
      if (status === 401 || status === 403) {
        console.error('[agent] Claude API rejected the key (' + status + '). Check ANTHROPIC_API_KEY.');
        return { status: 502, body: { error: 'auth_error' } };
      }
      if (status === 429) return { status: 429, body: { error: 'upstream_rate_limited' } };
      console.error('[agent] attempt failed (' + attempt.model + ', ' + (attempt.extra.fallbacks ? 'with fallback beta' : 'plain') + '):',
        status || '', error && error.message);
    }
  }
  console.error('[agent] all attempts failed:', lastError && lastError.message);
  return { status: 502, body: { error: 'upstream_error' } };
}

module.exports = { handleAgentRequest, health };
