# Local Development

## Prerequisites

- Node.js **20+** (`nvm use` reads `.nvmrc`)
- npm
- Optional: an [Anthropic API key](https://console.anthropic.com/) to test the live agent

## Setup

```bash
git clone https://github.com/JawadulHadi/juh_Bukhari_Portfolio.git
cd juh_Bukhari_Portfolio
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Script | Command | Notes |
| --- | --- | --- |
| `npm run dev` | `node server.js` | Local server on `PORT` (default 3000) |
| `npm start` | `node server.js` | Same thing, used by Node hosts in production |

There's no build step. Edit a file and refresh.

## Running with the live agent

`server.js` doesn't read `.env` on its own. Pick one:

```bash
# Node 20+ built-in env-file loader (recommended)
cp .env.example .env    # then fill in ANTHROPIC_API_KEY
node --env-file=.env server.js
```

```bash
# bash / zsh
ANTHROPIC_API_KEY=sk-ant-... npm run dev
```

```powershell
# PowerShell
$env:ANTHROPIC_API_KEY = "sk-ant-..."; npm run dev
```

## Testing the endpoint

```bash
# Without a key: expect 503 {"error":"not_configured"}
curl -i -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is your stack?"}]}'

# Invalid body: expect 400 {"error":"invalid_request"}
curl -i -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}'
```

## Opening pages directly

Don't open the `.dc.html` files straight from disk (`file://`). The runtime loads sibling files, and the agent needs `/api/agent`, so always go through the server.

## Voice

Use Chrome, Edge or Safari. `localhost` counts as a secure context, so the microphone prompt appears. On other hosts, voice needs HTTPS.

## CI

`.github/workflows/ci.yml` runs on every PR. It installs dependencies, runs `node --check` on the JS, starts the server, checks that pages return 200, checks the security headers, and checks that `/api/agent` returns 503 with no key. You can reproduce it locally with the same `curl` commands.
