import "dotenv/config";

const express = require("express");
const path = require("path");
const { handleAgentRequest } = require("./api/_agent");

const app = express();
const PORT = process.env.PORT || 3000;
const LEGACY_HTML_REDIRECTS = {
  index: "/",
  "case-study": "/case-study",
  resume: "/resume",
};

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=()",
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.post("/api/agent", express.json({ limit: "64kb" }), async (req, res) => {
  try {
    const result = await handleAgentRequest(req.body, req.ip);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Agent error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Old long URLs → short ones.
app.get(/^\/Portfolio\.dc/, (req, res) => res.redirect(301, "/"));
app.get(/^\/Case(%20| )Study\.dc/, (req, res) =>
  res.redirect(301, "/case-study"),
);
app.get("/resume", (req, res) => res.redirect(307, "/resume.pdf"));

// cleanUrls: /index → /, /case-study.html → /case-study
app.get(/^\/(index)?(\.html)?$/, (req, res, next) =>
  req.path === "/" ? next() : res.redirect(301, "/"),
);
app.get(/^\/([\w-]+)\.html$/, (req, res) => {
  const page = req.params[0];
  const target = LEGACY_HTML_REDIRECTS[page] || "/";
  res.redirect(301, target);
});

// Static assets (with html extension fallback for clean URLs)
app.use(
  express.static(__dirname, { index: "index.html", extensions: ["html"] }),
);

// SPA fallback — only for GET, and only for non-file, non-api routes.
// Express 4 syntax:
app.get("*", (req, res, next) => {
  // Let unmatched /api/* 404 instead of returning HTML
  if (req.path.startsWith("/api/")) return next();
  // Don't return HTML for requests that look like file requests
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

// Final 404 for anything else
app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, "0.0.0.0", () =>
  console.log("Portfolio on http://localhost:" + PORT),
);
