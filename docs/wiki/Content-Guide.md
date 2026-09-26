# Content Guide

Where each piece of content lives, and what else to update when it changes.

| Content | File | Anchor / location | Also update |
| --- | --- | --- | --- |
| Name, headline, intro | `Portfolio.dc.html` | hero `<h1>` | `index.html` `<title>` and meta description |
| Selected work | `Portfolio.dc.html` | `#work` | Agent prompt, if the facts change |
| Projects & open source | `Portfolio.dc.html` | `#projects` | `SYSTEM_PROMPT` "Projects" line |
| Experience | `Portfolio.dc.html` | `#experience` | `SYSTEM_PROMPT` "Role" and "Experience" lines, `resume.pdf` |
| Stack & credentials | `Portfolio.dc.html` | `#credentials` | `SYSTEM_PROMPT` "Stack" and "Credentials" lines |
| Services & contact | `Portfolio.dc.html` | `#contact` | `SYSTEM_PROMPT` "Services" line |
| Case study | `Case Study.dc.html` | whole page | Agent fallback answer for "fallback / resilience" |
| Agent facts & rules | `api/_agent.js` | `SYSTEM_PROMPT` | Fallback table in `Agent.dc.html` |
| Offline agent answers | `Agent.dc.html` | regex → answer table | |
| Portrait | `assets/portrait.jpg` | | Keep it under ~200 KB, and square or 4:5 |
| Résumé | `resume.pdf` | | Links on the portfolio page |
| Favicon | `favicon.svg` | | |

## Rules of thumb

- **One source of truth per fact.** When a number changes (such as "7+ years" or "12s → under 2s"), search the repo for it and update every hit:

  ```bash
  grep -rn "7+ years" --include=*.html --include=*.js .
  ```

- **Credentials need verification links.** Don't quote a total count. The agent is told not to either.
- **Contact:** Gravatar only. No email, phone or WhatsApp, anywhere.
- **Tokens, not colours.** Use `var(--…)` so all three themes keep working.
- **Accessibility:** give every image alt text, give icon-only buttons an `aria-label`, and keep heading levels in order.

## Checklist for a content update

- [ ] Page text updated
- [ ] `SYSTEM_PROMPT` updated if the fact is agent-visible
- [ ] Fallback answers updated
- [ ] `resume.pdf` still consistent
- [ ] Checked in all three themes
