// Vercel serverless entry: routes /api/agent to the shared Claude handler.
const { handleAgentRequest } = require('./_agent');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if ((req.url || '').startsWith('/api/agent')) {
    if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const result = await handleAgentRequest(req.body, ip);
    res.status(result.status).json(result.body);
    return;
  }
  res.status(404).json({ error: 'not_found' });
};
