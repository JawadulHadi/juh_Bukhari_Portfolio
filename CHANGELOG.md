# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `/credentials`: a separate, filterable certifications page (`credentials.html`). Certification data moved to `certs.js`, shared with the main page, which now shows only the certifications on the résumé.
- "Ask Jawad": more general quick-prompt chips (who, services, achievements, relocation, timezone, AI workflow, leadership, education, résumé) with a *More / Fewer* toggle, and matching offline answers.
- Project documentation: README, LICENSE (MIT), NOTICE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG.
- Wiki under `docs/wiki/`.
- GitHub issue/PR templates, CODEOWNERS, Dependabot and a CI smoke-test workflow.
- `.gitignore`, `.env.example`, `.editorconfig`, `.nvmrc`.

### Changed

- Main page order: intro, experience, selected work, stack & credentials, projects & open source, case study, services & contact. The case study is a teaser at the end, linking to `/case-study`.
- Selected work now covers the projects named on the résumé (Talentnix, internal ATS, APAC Management System, iAgility, AgileBrains, serverless gateway). iAgility and AgileBrains are described from the résumé, and AgileBrains is a single product.
- Experience text, roles and dates now match the résumé: 8+ years, Backend Lead Engineer, Market Icon from Aug 2018, and "zero AI failures during live LLM outages".
- Stack groups mirror the résumé's skills section.
- The project now lives at the repository root instead of `juh-portfolio/`.
- `node_modules/` is no longer tracked in git.
- Short URLs: the portfolio is served at `/` (was `/Portfolio.dc.html`) and the case study at `/case-study` (was `/Case Study.dc.html`). The old URLs 301-redirect, and `/resume` goes to `resume.pdf`.
- Pages now have their own `<title>`, meta description and JUH-LOGO.

### Fixed

- "Ask Jawad": the greeting bubble no longer shows a blank first line and a large indent (the template's whitespace was preserved by `pre-wrap`), and the quick-prompt row wraps instead of clipping chips.
- "Ask Jawad": `componentDidUpdate` read a second argument the dc-runtime never passes, which threw on every update and broke auto-scroll.
- Removed duplicate and unverifiable project cards: the Chrome extension pack appeared twice (now only the linked *Extension suite*), the "Idempotent queue spine" had no repository or evidence, and the "Enterprise agile collaboration suite" card contradicted the résumé's iAgility description.
- `vercel.json`: removed `outputDirectory: "public"` (the folder doesn't exist) and the `/resume` redirect to a missing `/source/` path, and restored `microphone=(self)` so voice input works.

## [2.0.0] - 2026-09-26

### Added

- `Portfolio.dc.html`: the main page (work, projects, experience, credentials, services & contact).
- `Case Study.dc.html`: *Designing for AI Failure*, with figures and a failure simulator.
- `Agent.dc.html`: the floating "Ask Jawad" agent, with voice input, read-aloud and site navigation.
- `theme.js`: Horizon / Paper / Mono themes, persisted and synced across tabs.
- `api/_agent.js`: Claude-backed agent endpoint with validation, a per-IP rate limit and prompt caching.

### Changed

- `Permissions-Policy` now sends `microphone=(self)` so voice input works on the live site.
- The contact channel is consolidated to gravatar.com/juhbukhari.

### Removed

- The legacy `projects.html`, `certifications.html`, `agent.html` and `case-study.html` pages.

[Unreleased]: https://github.com/JawadulHadi/juh_Bukhari_Portfolio/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/JawadulHadi/juh_Bukhari_Portfolio/releases/tag/v2.0.0
