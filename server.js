Summary
- CI failed because the test script could not connect to the running server: "curl: (7) Failed to connect to localhost port 3000".
- That means node server.js exited (or never started listening) before the curl checks. The logs did not include server.log contents, so the exact runtime error isn’t visible from the job output. Likely causes: a thrown exception during module load (require('./api/_agent')), an uncaught exception/unhandled rejection, or a crash at startup (syntax or runtime error). Also your SPA fallback route uses an unusual path string '/{*splat}' which should be corrected (this won’t usually crash server but should be fixed).

Immediate actions to get a reproducible failure and fix
1) Make startup errors visible in CI
- Ensure server.log is printed and contains node stderr. The workflow already redirects node output to server.log, but CI output shows no server.log content. Re-run locally or print server.log contents early. Add defensive logging and handlers in server.js so startup errors are written to console (and thus server.log).

2) Add robust error handling around requires and global exception handlers
- If require('./api/_agent') throws, the process exits before listening. Wrap the require in try/catch and provide a fallback so server can still start and expose a failing health endpoint. Also register handlers for uncaughtException and unhandledRejection to capture errors to logs.

3) Fix the SPA fallback route
- Replace app.get('/{*splat}', ...) with app.get('*', ...) (or app.get('/*', ...)). The current pattern looks like a literal string and won’t behave as intended.

4) Improve CI wait for server
- Increase retries or use a reliable tool (wait-on) to await http://localhost:$PORT rather than a short loop.

Suggested code changes (patch for server.js)
- Replace your top-of-file require and route area with the following (small, focused edits). This will:
  - safely load ./api/_agent
  - log startup progress and errors
  - handle uncaught exceptions/rejections
  - fix the wildcard route

Insert / replace in server.js:

```javascript
const express = require('express');
const path = require('path');

let handleAgentRequest = async () => ({ status: 500, body: { error: 'agent unavailable' } });
let health = () => ({ status: 500, body: { ok: false } });

try {
  const mod = require('./api/_agent');
  if (mod && typeof mod.handleAgentRequest === 'function') handleAgentRequest = mod.handleAgentRequest;
  if (mod && typeof mod.health === 'function') health = mod.health;
} catch (err) {
  console.error('Warning: failed to load ./api/_agent — agent endpoints will return 500. Error:', err);
}

// global error handlers so startup crashes are logged to server.log in CI
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
  // allow process to exit after logging so CI can fail fast if needed
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(), payment=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/api/agent', (req, res) => { const h = health(); res.status(h.status).json(h.body); });
app.post('/api/agent', express.json({ limit: '64kb' }), async (req, res) => {
  try {
    const result = await handleAgentRequest(req.body, req.ip);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Error handling /api/agent request:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// ... your other redirects & static config unchanged ...

app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));
// fix fallback route to catch all (SPA)
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log('Portfolio on http://localhost:' + PORT));
```

Notes on these changes
- Wrapping require('./api/_agent') prevents startup crashing if that module throws or has missing dependencies. The health endpoint will reflect module load failure (status 500) so CI can still start the server and you can see the failure in server.log.
- The global error handlers make sure unexpected startup-time exceptions get logged to server.log (CI will then show them).
- Fixing the fallback route ensures SPA routing works consistently.
- Consider adding more granular logs (console.log at start of server.js) so CI logs show "server starting" before the curl attempts.

CI adjustments (optional but recommended)
- Increase the wait loop timeout (e.g., 60s) or use wait-on to wait for the http endpoint:
  - npm: npm install --no-save wait-on
  - Use: npx wait-on http://localhost:$PORT --timeout 60000
- If you keep the curl loop, increase retries and sleep duration.

How to reproduce locally
- Run with same environment as CI:
  - NODE_ENV=test PORT=3000 node server.js
- If it exits, inspect the console output for the thrown error. That output maps to server.log in CI.

Next step for you
- Apply the code changes above (wrap the require, add global handlers, fix wildcard route) and re-run the CI. If it still fails, capture the server.log output (or paste here) and I’ll point to the exact runtime error and a precise fix.