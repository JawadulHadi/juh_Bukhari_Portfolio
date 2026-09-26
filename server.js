// Local dev / Render / any Node host: static site + /api/agent.
const express = require('express');
const path = require('path');
const { handleAgentRequest } = require('./api/_agent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(), payment=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.post('/api/agent', express.json({ limit: '64kb' }), async (req, res) => {
  const result = await handleAgentRequest(req.body, req.ip);
  res.status(result.status).json(result.body);
});
app.use(express.static(__dirname, { index: 'index.html' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log('Portfolio on http://localhost:' + PORT));
