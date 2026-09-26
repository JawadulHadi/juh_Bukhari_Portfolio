# Security Policy

## Supported versions

Only the latest deployment of the `main` branch is supported.

| Version | Supported |
| --- | --- |
| 2.x (`main`) | ✅ |
| < 2.0 | ❌ |

## Reporting a vulnerability

**Don't open a public issue.** Report privately through GitHub:

1. Open the repository's **Security** tab.
2. Click **Report a vulnerability** (GitHub private vulnerability reporting).
3. Describe the issue, how to reproduce it, and its impact.

If that option isn't available, get in touch through [gravatar.com/juhbukhari](https://gravatar.com/juhbukhari) and ask for a private channel. Don't include exploit details in the first message.

**What to expect:** an acknowledgement within 5 business days, an assessment within 14 days, and credit in the changelog if you'd like it.

## In scope

- The `/api/agent` endpoint: input validation bypass, rate-limit bypass, leaking the API key or the system prompt, or prompt injection that makes the agent disclose personal contact details
- Cross-site scripting or HTML injection in the pages or the agent's rendering of replies
- Misconfigured security headers in `vercel.json` / `server.js`
- Vulnerable dependencies with a practical exploit path

## Out of scope

- Getting the agent to say something off-topic or silly without a security impact
- Denial of service through volumetric traffic
- Findings that need a compromised browser or device
- Missing headers with no demonstrable impact

## How the project protects itself

| Control | Where |
| --- | --- |
| The API key is server-side only and never sent to the browser | `api/_agent.js` |
| Request validation: roles, types, 20 messages max, 2,000 characters per message | `api/_agent.js` → `validate()` |
| Per-IP rate limit: 30 requests per 10 minutes, per instance | `api/_agent.js` → `rateLimited()` |
| 64 KB JSON body limit (Express) | `server.js` |
| `X-Content-Type-Options`, `Referrer-Policy`, a restrictive `Permissions-Policy` | `vercel.json`, `server.js` |
| Dependabot updates for npm and GitHub Actions | `.github/dependabot.yml` |

> **Note:** the rate limiter is in-memory, so each serverless instance keeps its own count. For stronger guarantees, put a shared store (such as Upstash Redis) or a platform firewall rule in front of the endpoint, and set a spend limit in the Anthropic Console.
