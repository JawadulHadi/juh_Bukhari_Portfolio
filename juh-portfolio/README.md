# Jawad Ul Hadi · Portfolio v2

Static pages plus one serverless endpoint for the portfolio agent.

## Pages

- `Portfolio.dc.html`: the main page (work, projects, experience, credentials, services & contact)
- `Case Study.dc.html`: Designing for AI Failure, with figures and a failure simulator
- `Agent.dc.html`: the floating "Ask Jawad" agent, loaded by both pages
- `theme.js`: shared Horizon / Paper / Mono theme (saved in localStorage, synced across tabs), scroll reveals and cursor effects
- `index.html` redirects to `Portfolio.dc.html`

The old `projects.html`, `certifications.html`, `agent.html` and `case-study.html` are replaced by these pages. Add redirects for them if they have inbound links.

## Contact policy

The only contact channel is <https://gravatar.com/juhbukhari>. The pages, the agent and the server prompt (`api/_agent.js`) all point there, and the agent is told never to share an email or phone number.

## AI agent setup

1. `npm install`
2. Set `ANTHROPIC_API_KEY` in the host's environment (Vercel: Project Settings, Environment Variables).
3. Deploy. The page calls `POST /api/agent`; without a key it answers 503 and the agent falls back to built-in answers.

The model is set in `api/_agent.js` (`MODEL`). Rate limit: 30 requests per IP per 10 minutes.

## Voice

Voice input uses the browser's Speech Recognition API (Chrome, Edge, Safari). The old `vercel.json` sent `Permissions-Policy: microphone=()`, which blocks the mic on the live site. This version sends `microphone=(self)`. Both `vercel.json` and `server.js` set it.

## Run locally

`npm run dev`, then open <http://localhost:3000>
