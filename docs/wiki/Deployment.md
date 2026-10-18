# Deployment

## Netlify

The repository configuration runs `npm run build` and publishes `dist`. The build copies only public pages and assets, then exits. Keep `npm run dev` for local development; it starts a persistent Express server and cannot serve as a deployment build command.

Netlify serves the static pages with clean URLs and runs `/api/agent` as a serverless function using the shared agent handler. Configure the existing Anthropic credentials in the site's runtime environment for live replies; without credentials, the browser uses its built-in answers. No Express server is required in production.

## Option A: Vercel (recommended)

1. Import `JawadulHadi/juh_Bukhari_Portfolio` in the Vercel dashboard.
2. Framework preset: **Other**. No build command and no output directory. Vercel serves the repo root.
3. Under _Project Settings → Environment Variables_, add `ANTHROPIC_API_KEY` for Production (and Preview if you want the agent live there).
4. Deploy.

What `vercel.json` does:

| Setting                                   | Effect                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/agent.js`                            | Serves the agent at `/api/agent`; unknown API paths keep Vercel's normal 404 response                                                                                 |
| `cleanUrls: true`, `trailingSlash: false` | Serves `index.html` at `/`, `case1.html` at `/case1` and `credentials.html` at `/credentials`. `.html` URLs 308-redirect to the clean form                            |
| `redirects`                               | `/Portfolio.dc*` → `/`, `/Case*Study.dc*` → `/case1` (301), `/resume` → `/resume.pdf`                                                                                 |
| `headers`                                 | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(self), geolocation=(), payment=()` |

> `microphone=(self)` is required for voice input. An older config sent `microphone=()`, which silently blocks the mic.

## Option B: any Node host

Works on Render, Railway, Fly.io, a VPS and similar.

| Setting       | Value                                                             |
| ------------- | ----------------------------------------------------------------- |
| Build command | `npm ci`                                                          |
| Start command | `npm start`                                                       |
| Node version  | 20+                                                               |
| Env vars      | `ANTHROPIC_API_KEY`, and `PORT` if the platform doesn't inject it |

`server.js` binds `0.0.0.0`, sets the same security headers, serves the project-root site files at the clean URLs (`/`, `/case1`) and redirects, and returns JSON 404s for unknown `/api/*` paths.

## After deploying

- [ ] `/` shows the portfolio, `/case1` shows the case study and `/credentials` shows the certifications
- [ ] Old links like `/Portfolio.dc` redirect to `/`
- [ ] The agent answers with Claude, not the built-in fallback (ask something the fallback table wouldn't know)
- [ ] The voice mic prompt appears in Chrome
- [ ] Response headers include `Permissions-Policy` with `microphone=(self)`
- [ ] Set a **monthly spend limit** in the Anthropic Console, because the endpoint is public

## Legacy URL redirects

The old `projects.html`, `certifications.html` and `agent.html` pages were removed. (`/case1.html` still works, because `cleanUrls` redirects it to `/case1`.) If the removed pages have inbound links, add these to the `redirects` array in `vercel.json`:

```json
{ "source": "/projects.html",       "destination": "/#projects",    "permanent": true },
{ "source": "/certifications.html", "destination": "/credentials", "permanent": true },
{ "source": "/agent.html",          "destination": "/",             "permanent": true }
```

## Rollback

On Vercel, open _Deployments_, pick the previous deployment and choose **Promote to Production**. On other hosts, redeploy the previous git tag.
