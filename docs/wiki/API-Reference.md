# API Reference

## `POST /api/agent`

Sends a conversation to the portfolio agent and returns its next reply.

### Request

```http
POST /api/agent
Content-Type: application/json
```

```json
{
  "messages": [
    { "role": "user", "content": "What's your backend stack?" },
    { "role": "assistant", "content": "Mostly Node.js and NestJS with TypeScript..." },
    { "role": "user", "content": "And for AI?" }
  ]
}
```

### Validation rules

| Rule | Detail |
| --- | --- |
| `messages` | A non-empty array of **at most 20** items |
| `role` | `"user"` or `"assistant"` only |
| `content` | A string, trimmed and **truncated to 2,000 characters**. It can't be empty after trimming |
| Order | The first **and** last message must be `user` |
| Body size | 64 KB max (Express adapter) |

Any violation returns `400 invalid_request`.

### Responses

| Status | Body | When |
| --- | --- | --- |
| `200` | `{ "reply": "..." }` | Success. The reply is plain text |
| `200` | `{ "reply": "I can't help with that one — ..." }` | The model declined (`stop_reason: refusal`) |
| `400` | `{ "error": "invalid_request" }` | Failed validation |
| `404` | `{ "error": "not_found" }` | Unknown `/api/*` path (Vercel adapter) |
| `405` | `{ "error": "method_not_allowed" }` | Method other than POST (Vercel adapter) |
| `429` | `{ "error": "rate_limited" }` | More than 30 requests from this IP in 10 minutes |
| `429` | `{ "error": "upstream_rate_limited" }` | The Anthropic API rate-limited the request |
| `502` | `{ "error": "upstream_error" }` | Any other Claude or network error (logged server-side) |
| `503` | `{ "error": "not_configured" }` | No `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` set |

Checks run in this order: configured → rate limit → validation. An unconfigured server returns 503 even for invalid bodies.

### Client IP

| Adapter | Source |
| --- | --- |
| Vercel | First entry in `X-Forwarded-For` |
| Express | `req.ip` |

### Example

```bash
curl -s -X POST https://jawadulhadi-portfolio.vercel.app/api/agent \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"How does your AI fallback ladder work?"}]}'
```

The endpoint is meant for the site's own agent. Please don't build on it. It's rate-limited and may change without notice.
