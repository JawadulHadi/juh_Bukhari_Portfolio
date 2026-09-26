# Contributing

Thanks for taking the time to help. This is a personal portfolio, so the most useful contributions are bug fixes, accessibility and performance improvements, and fixes to the agent backend. Content changes (bio, work history, credentials) are made by the owner only.

## Ground rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Report security issues privately. See [SECURITY.md](SECURITY.md). Don't open a public issue for them.
- Keep the [contact policy](README.md#contact-policy): no email addresses or phone numbers anywhere in the pages, the agent or the prompt.

## Getting set up

```bash
git clone https://github.com/JawadulHadi/juh_Bukhari_Portfolio.git
cd juh_Bukhari_Portfolio
nvm use            # Node 20, from .nvmrc
npm install
npm run dev        # http://localhost:3000
```

See [Local Development](docs/wiki/Local-Development.md) for testing the agent with and without an API key.

## Workflow

1. Open an issue first for anything bigger than a small fix, so we can agree on the approach.
2. Branch from `main` with a descriptive name: `fix/agent-voice-safari`, `feat/case-study-figure`, `docs/deployment`.
3. Keep PRs focused, one concern each.
4. Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md), including screenshots for visual changes in **all three themes**.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(agent): add keyboard shortcut to open chat
fix(theme): keep Mono theme after reload in Safari
docs(wiki): document rate-limit behaviour
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`, `ci`.

## Code guidelines

| Area | Guideline |
| --- | --- |
| `support.js`, `_ds/` | Generated. **Don't edit by hand.** |
| `.dc.html` pages | Use design tokens (`var(--color-*)`, `var(--space-*)`) instead of hard-coded colours so all three themes keep working |
| `theme.js` | Plain ES5-style IIFE with no build step. Keep it dependency-free |
| `api/` | CommonJS, Node ≥ 20. Shared logic goes in `_agent.js`. The underscore stops Vercel from deploying it as a separate function |
| Secrets | Never commit keys. Use `.env` locally (git-ignored) and host env vars in production |
| Motion | Respect `prefers-reduced-motion` for any new animation |
| Formatting | Follow `.editorconfig`: 2 spaces, LF, UTF-8 |

## Before you open a PR

- [ ] `npm run dev` starts and the pages load without console errors
- [ ] The agent works with no key (built-in answers) and, if you have a key, with Claude
- [ ] Visual changes checked in Horizon, Paper and Mono, on desktop and mobile widths
- [ ] Keyboard navigation and screen-reader labels still work
- [ ] `CHANGELOG.md` updated under **Unreleased** if the change is user-visible
