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
| `cleanUrls: true`, `trailingSlash: false` | Serves `index.html` at `/` and `case-study.html` at `/case-study`. `.html` URLs 308-redirect to the clean form |
| `redirects` | `/Portfolio.dc*` → `/`, `/Case*Study.dc*` → `/case-study` (301), `/resume` → `/resume.pdf` |
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

`server.js` mirrors `vercel.json`: it binds `0.0.0.0`, sets the same security headers, serves the same clean URLs (`/`, `/case-study`) and redirects, and falls back to `index.html` for unknown paths.

## After deploying

- [ ] `/` shows the portfolio and `/case-study` shows the case study
- [ ] Old links like `/Portfolio.dc` redirect to `/`
- [ ] The agent answers with Claude, not the built-in fallback (ask something the fallback table wouldn't know)
- [ ] The voice mic prompt appears in Chrome
- [ ] Response headers include `Permissions-Policy` with `microphone=(self)`
- [ ] Set a **monthly spend limit** in the Anthropic Console, because the endpoint is public

## Legacy URL redirects

The old `projects.html`, `certifications.html` and `agent.html` pages were removed. (`/case-study.html` still works, because `cleanUrls` redirects it to `/case-study`.) If the removed pages have inbound links, add these to the `redirects` array in `vercel.json`:

```json
{ "source": "/projects.html",       "destination": "/#projects",    "permanent": true },
{ "source": "/certifications.html", "destination": "/#credentials", "permanent": true },
{ "source": "/agent.html",          "destination": "/",             "permanent": true }
```

## Rollback

On Vercel, open *Deployments*, pick the previous deployment and choose **Promote to Production**. On other hosts, redeploy the previous git tag.
