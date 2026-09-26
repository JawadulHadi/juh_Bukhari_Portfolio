# Deployment

## Option A: Vercel (recommended)

1. Import `JawadulHadi/juh_Bukhari_Portfolio` in the Vercel dashboard.
2. Framework preset: **Other**. No build command and no output directory. Vercel serves the repo root.
3. Under *Project Settings → Environment Variables*, add `ANTHROPIC_API_KEY` for Production (and Preview if you want the agent live there).
4. Deploy.

What `vercel.json` does:

| Setting | Effect |
| --- | --- |
| `rewrites: /api/(.*) → /api/index.js` | Every API path goes to the single function, which routes `/api/agent` and returns 404 otherwise |
| `cleanUrls: false` | Keeps `.html` in URLs, so `Portfolio.dc.html` links stay valid |
| `headers` | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(self), geolocation=(), payment=()` |

> `microphone=(self)` is required for voice input. An older config sent `microphone=()`, which silently blocks the mic.

## Option B: any Node host

Works on Render, Railway, Fly.io, a VPS and similar.

| Setting | Value |
| --- | --- |
| Build command | `npm ci` |
| Start command | `npm start` |
| Node version | 20+ |
| Env vars | `ANTHROPIC_API_KEY`, and `PORT` if the platform doesn't inject it |

`server.js` binds `0.0.0.0`, sets the same security headers as `vercel.json`, serves static files, and falls back to `index.html` for unknown paths.

## After deploying

- [ ] `/` redirects to `/Portfolio.dc.html`
- [ ] The agent answers with Claude, not the built-in fallback (ask something the fallback table wouldn't know)
- [ ] The voice mic prompt appears in Chrome
- [ ] Response headers include `Permissions-Policy` with `microphone=(self)`
- [ ] Set a **monthly spend limit** in the Anthropic Console, because the endpoint is public

## Legacy URL redirects

The old `projects.html`, `certifications.html`, `agent.html` and `case-study.html` were removed. If they have inbound links, add redirects to `vercel.json`:

```json
"redirects": [
  { "source": "/projects.html",       "destination": "/Portfolio.dc.html#projects",    "permanent": true },
  { "source": "/certifications.html", "destination": "/Portfolio.dc.html#credentials", "permanent": true },
  { "source": "/agent.html",          "destination": "/Portfolio.dc.html",             "permanent": true },
  { "source": "/case-study.html",     "destination": "/Case%20Study.dc.html",          "permanent": true }
]
```

## Rollback

On Vercel, open *Deployments*, pick the previous deployment and choose **Promote to Production**. On other hosts, redeploy the previous git tag.
