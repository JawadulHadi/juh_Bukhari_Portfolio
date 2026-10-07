# Architecture

## Components

```mermaid
flowchart TB
    subgraph Browser
        P[index.html<br/>served at /]
        P -.->|link| CS[case-study.html<br/>served at /case-study]
        P -.->|link| CR[credentials.html<br/>served at /credentials]
        CE[certs.js<br/>shared cert data] --- P & CR
        P -->|dc-import| AG[Agent.dc.html]
        CS -->|dc-import| AG
        CR -->|dc-import| AG
        RT[support.js<br/>dc-runtime + React 18] --- P & CS & CR & AG
        TH[theme.js<br/>JUHTheme] --- P & CS & CR & AG
        DS[_ds/ Classical tokens] --- P & CS & CR & AG
    end
    AG -- POST /api/agent --> EP
    subgraph Server
        EP{Entry}
        EP -->|Vercel| VI[api/index.js]
        EP -->|Express| SJ[server.js]
        VI --> AH[api/_agent.js]
        SJ --> AH
    end
    AH --> CL[(Anthropic Claude API)]
```

| Component | Responsibility |
| --- | --- |
| `index.html`, `case-study.html`, `credentials.html` | The three pages, served at `/`, `/case-study` and `/credentials` via `cleanUrls`. Old `/Portfolio.dc*` and `/Case Study.dc*` URLs 301-redirect to them |
| `certs.js` | Certification data (`window.JUH_CERTS`) shared by `index.html` (résumé highlights) and `credentials.html` (full list) |
| `*.dc.html` | Page templates inside `<x-dc>`. `<helmet>` injects head tags, `<sc-if>` handles conditionals, `<dc-import>` embeds another dc page |
| `support.js` | **Generated** dc-runtime. Parses `<x-dc>` and renders it with React 18 (UMD from unpkg) |
| `_ds/classical-…/` | **Generated** Classical design system: CSS custom properties (colour ramps, spacing, fonts) and a namespace bundle |
| `theme.js` | Theme switching (overrides CSS variables), scroll-reveal via `IntersectionObserver`, cursor effects |
| `api/_agent.js` | The only backend logic: config check → rate limit → validation → Claude call → reply shaping |
| `api/index.js` | Vercel function adapter. `vercel.json` rewrites `/api/*` here |
| `server.js` | Express adapter for local dev and non-Vercel hosts. Also serves the static files |

## Request lifecycle: `POST /api/agent`

```mermaid
sequenceDiagram
    participant U as Visitor
    participant A as Agent.dc.html
    participant H as api/_agent.js
    participant C as Claude
    U->>A: types or speaks a question
    A->>A: navigation intent? ("take me to projects") → scroll, done
    A->>H: POST { messages: history }
    alt no API key
        H-->>A: 503 not_configured
        A->>A: answer from built-in regex table
    else rate limited
        H-->>A: 429 rate_limited
    else invalid body
        H-->>A: 400 invalid_request
    else ok
        H->>C: messages.create(system prompt [cached], history)
        C-->>H: text / refusal
        H-->>A: 200 { reply }
    end
    A->>U: renders reply (and speaks it if read-aloud is on)
```

## Design decisions

| Decision | Why |
| --- | --- |
| **One shared handler, two thin adapters** | The same `handleAgentRequest(body, ip)` returns `{ status, body }`, so Express and Vercel stay in lockstep with no duplicated logic |
| **`_agent.js` underscore prefix** | Vercel treats files in `api/` as functions. The underscore marks this one as a private module |
| **Key stays on the server** | The browser only ever talks to `/api/agent`, so the Anthropic key can't leak via DevTools |
| **Graceful degradation** | With no key, a network error or any non-200 response, the agent answers from a built-in table. The site never shows a broken chat |
| **Prompt caching** | The system prompt is sent with `cache_control: ephemeral`, which cuts cost and latency on repeat turns |
| **Low effort, short replies** | `output_config.effort: 'low'` and `max_tokens: 1024`. Chat answers are meant to be short and speakable |
| **Plain-text replies** | The prompt forbids markdown so replies read well aloud and need no HTML rendering, which removes an XSS vector |
| **Server-side fallback beta** | `server-side-fallback-2026-07-01` with `fallbacks: 'default'` lets the API re-run a declined turn on a suitable fallback model |
| **In-memory rate limit** | Simple and dependency-free. The trade-off is that the limit is per instance (see [Security](../../SECURITY.md)) |

## Known limitations

- The rate-limit `Map` is never pruned of idle IPs. That's fine for serverless (instances recycle) but grows slowly on a long-lived Express process.
- Rejected requests still count toward the rate-limit window.
- Voice input depends on the Web Speech API, which Chrome, Edge and Safari support and Firefox doesn't.
