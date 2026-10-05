// Local dev / Render / any Node host: static site + /api/agent.
// Mirrors vercel.json: clean URLs (/, /case-study), legacy redirects, same headers.
const express = require('express');
const path = require('path');
const { handleAgentRequest, health } = require('./api/_agent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(), payment=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.get('/api/agent', (req, res) => { const h = health(); res.status(h.status).json(h.body); });
app.post('/api/agent', express.json({ limit: '64kb' }), async (req, res) => {
  const result = await handleAgentRequest(req.body, req.ip);
  res.status(result.status).json(result.body);
});

// Old long URLs → short ones.
app.get(/^\/Portfolio\.dc/, (req, res) => res.redirect(301, '/'));
app.get(/^\/Case(%20| )Study\.dc/, (req, res) => res.redirect(301, '/case-study'));
app.get('/resume', (req, res) => res.redirect(307, '/resume.pdf'));
// cleanUrls: /index → /, /case-study.html → /case-study
app.get(/^\/(index)?(\.html)?$/, (req, res, next) => (req.path === '/' ? next() : res.redirect(301, '/')));
app.get(/^\/([\w-]+)\.html$/, (req, res) => res.redirect(301, '/' + req.params[0]));

app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));
app.get('/{*splat}', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log('Portfolio on http://localhost:' + PORT));
