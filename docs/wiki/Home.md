# Jawad Ul Hadi · Portfolio Wiki

Welcome. This wiki covers how the portfolio is built, run, deployed and maintained.

The site is a set of static pages (`.dc.html`) plus one serverless endpoint, `POST /api/agent`, that lets visitors chat with a Claude-backed agent speaking on Jawad's behalf.

## Start here

| If you want to… | Read |
| --- | --- |
| Understand the moving parts | [Architecture](Architecture.md) |
| Run it on your machine | [Local Development](Local-Development.md) |
| Ship it | [Deployment](Deployment.md) |
| Change what the agent knows or how it behaves | [Portfolio Agent](Portfolio-Agent.md) |
| Call the API directly | [API Reference](API-Reference.md) |
| Tweak colours, fonts or add a theme | [Theming & Design System](Theming-and-Design-System.md) |
| Update work, projects or credentials | [Content Guide](Content-Guide.md) |
| Fix something that broke | [Troubleshooting](Troubleshooting.md) |

## At a glance

| | |
| --- | --- |
| **Pages** | Portfolio, Case Study (*Designing for AI Failure*), Agent (imported into both) |
| **Runtime** | Node.js ≥ 20 |
| **Hosting** | Vercel (serverless) or any Node host via Express |
| **AI** | Anthropic Claude via `@anthropic-ai/sdk`, server-side only |
| **Themes** | Horizon · Paper · Mono |
| **Contact** | [gravatar.com/juhbukhari](https://gravatar.com/juhbukhari), the only public channel |

## Publishing this wiki to GitHub

These pages are GitHub-wiki compatible (`_Sidebar.md` and `_Footer.md` included). To mirror them into the repo's wiki tab:

```bash
# One-time: create the first wiki page in the GitHub UI so the wiki repo exists
git clone https://github.com/JawadulHadi/juh_Bukhari_Portfolio.wiki.git
cp docs/wiki/*.md juh_Bukhari_Portfolio.wiki/
cd juh_Bukhari_Portfolio.wiki
git add . && git commit -m "docs: sync wiki from docs/wiki" && git push
```

GitHub wikis link pages without the `.md` extension. Links written as `Page.md` still work in the repo view, and GitHub resolves them in the wiki too.
