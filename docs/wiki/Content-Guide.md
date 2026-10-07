# Content Guide

Where each piece of content lives, and what else to update when it changes.

| Content | File | Anchor / location | Also update |
| --- | --- | --- | --- |
| Name, headline, intro | `index.html` | hero `<h1>` | `<title>` and meta description in the same file |
| Experience | `index.html` | `#experience` | `SYSTEM_PROMPT` "Role" and "Experience" lines, `resume.pdf` |
| Selected work (projects named on the résumé) | `index.html` | `#work` | `SYSTEM_PROMPT` "At MicroAgility" line. Keep it consistent with the résumé: iAgility and AgileBrains are two products, and AgileBrains is one product |
| Stack & credential highlights | `index.html` | `#stack` | `SYSTEM_PROMPT` "Stack" and "Credentials" lines |
| Projects & open source | `index.html` | `#projects` | `SYSTEM_PROMPT` "Projects" line |
| Case study teaser | `index.html` | `#case-study` | Links to `case-study.html` |
| Services & contact | `index.html` | `#contact` | `SYSTEM_PROMPT` "Services" line |
| Case study | `case-study.html` | whole page | Agent fallback answer for "fallback / resilience" |
| Certifications | `certs.js` | `JUH_CERTS` | The résumé ones are listed in `JUH_CERT_HIGHLIGHTS`. Shown on `/credentials` and as highlights in `#stack` |
| Agent facts & rules | `api/_agent.js` | `SYSTEM_PROMPT` | Fallback table in `Agent.dc.html` |
| Offline agent answers | `Agent.dc.html` | regex → answer table | |
| Portrait | `assets/portrait.jpg` | | Keep it under ~200 KB, and square or 4:5 |
| Résumé | `resume.pdf` | | Links on the portfolio page |
| JUH-LOGO | `JUH-LOGO.svg` | | |

## Rules of thumb

- **One source of truth per fact.** When a number changes (such as "8+ years" or "12s → under 2s"), search the repo for it and update every hit:

  ```bash
  grep -rn "8+ years" --include=*.html --include=*.js .
  ```

- **Credentials need verification links.** Add new ones to `certs.js` only. Don't quote a total count. The agent is told not to either.
- **Contact:** Gravatar only. No email, phone or WhatsApp, anywhere.
- **Tokens, not colours.** Use `var(--…)` so all three themes keep working.
- **Accessibility:** give every image alt text, give icon-only buttons an `aria-label`, and keep heading levels in order.

## Checklist for a content update

- [ ] Page text updated
- [ ] `SYSTEM_PROMPT` updated if the fact is agent-visible
- [ ] Fallback answers updated
- [ ] `resume.pdf` still consistent
- [ ] Checked in all three themes
