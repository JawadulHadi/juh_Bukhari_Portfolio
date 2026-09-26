# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Project documentation: README, LICENSE (MIT), NOTICE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG.
- Wiki under `docs/wiki/`.
- GitHub issue/PR templates, CODEOWNERS, Dependabot and a CI smoke-test workflow.
- `.gitignore`, `.env.example`, `.editorconfig`, `.nvmrc`.

### Changed

- The project now lives at the repository root instead of `juh-portfolio/`.
- `node_modules/` is no longer tracked in git.

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
