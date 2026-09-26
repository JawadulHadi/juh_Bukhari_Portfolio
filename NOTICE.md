# Notice

## What the MIT License covers

The [MIT License](LICENSE) applies to the **source code** in this repository: the HTML/CSS/JS structure of the pages, `theme.js`, `server.js`, `api/`, and configuration files. You're welcome to fork it as a starting point for your own portfolio.

## What it does not cover

The following is **personal content** and is © 2026 Jawad Ul Hadi, all rights reserved. It may not be reused, republished or presented as your own:

| Content | Where |
| --- | --- |
| Portrait photograph | `assets/portrait.jpg` |
| Résumé | `resume.pdf` |
| Biography, work history, project write-ups and credentials text | `index.html` |
| The case study "Designing for AI Failure" (text and figures) | `case-study.html` |
| The agent's persona and facts in the system prompt | `api/_agent.js` (`SYSTEM_PROMPT`) |
| Name, logo mark and favicon | `favicon.svg` |

If you fork this project, replace all of the above with your own content before publishing.

## Third-party components

| Component | License | Notes |
| --- | --- | --- |
| [`@anthropic-ai/sdk`](https://github.com/anthropics/anthropic-sdk-typescript) | MIT | Installed via npm |
| [Express](https://expressjs.com/) | MIT | Installed via npm |
| [React / ReactDOM 18](https://react.dev/) | MIT | Loaded from unpkg by `support.js` at runtime |
| [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), [Lora](https://fonts.google.com/specimen/Lora) | SIL Open Font License 1.1 | Loaded from Google Fonts |
| `support.js` (dc-runtime) and `_ds/` (Classical design system) | Generated build output | Do not edit by hand |
