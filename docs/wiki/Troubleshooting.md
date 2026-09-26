# Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| The agent only gives generic or canned answers | No API key, so the endpoint returns 503 and the browser uses its fallbacks | Set `ANTHROPIC_API_KEY` on the host and redeploy. Locally, use `node --env-file=.env server.js` |
| `POST /api/agent` → 400 `invalid_request` | Empty history, a non-string `content`, a bad `role`, more than 20 messages, or history that doesn't start and end with `user` | See [API Reference](API-Reference.md#validation-rules) |
| `429 rate_limited` | More than 30 requests from this IP in 10 minutes | Wait. For local testing, restart the server, which clears the in-memory counter |
| `429 upstream_rate_limited` | Anthropic account limits | Check usage and limits in the Anthropic Console |
| `502 upstream_error` | Invalid key, an unknown `MODEL`, or a network error | Check the server logs for `[agent] Claude API error …`. Verify the key and the model ID |
| Mic button missing | The browser has no Web Speech API (Firefox) | Use Chrome, Edge or Safari |
| Mic blocked on the live site | `Permissions-Policy` has `microphone=()` | Make sure `vercel.json` and `server.js` both send `microphone=(self)` |
| Mic blocked on a custom host | Not a secure context | Serve over HTTPS (`localhost` is exempt) |
| Blank page | Opened from `file://`, or unpkg (React) blocked | Run through `npm run dev`. Check the network tab for `react.production.min.js` |
| Theme resets on reload | `localStorage` blocked (private mode or strict settings) | Expected. The theme falls back to Horizon |
| Old `/Portfolio.dc` link 404s | Redirects missing from `vercel.json` | Keep the `redirects` block: `/Portfolio.dc*` → `/`, `/Case*Study.dc*` → `/case-study` |
| `/case-study` 404s locally | Old `server.js` without `extensions: ["html"]` | Pull the latest `server.js` |
| Vercel: `/api/agent` → 404 | The rewrite is missing, or `api/index.js` was renamed | Check `vercel.json` `rewrites` |
| `EADDRINUSE :3000` | Port already in use | `PORT=3001 npm run dev` |

Still stuck? [Open an issue](https://github.com/JawadulHadi/juh_Bukhari_Portfolio/issues/new/choose).
