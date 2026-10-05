// Vercel serverless entry for /api/agent (file-based route, no rewrite needed).
// GET  -> secret-free health check (is the key configured? which model?)
// POST -> chat
const { handleAgentRequest, health } = require('./_agent');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method === 'GET') { const h = health(); res.status(h.status).json(h.body); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const result = await handleAgentRequest(req.body, ip);
  res.status(result.status).json(result.body);
};
