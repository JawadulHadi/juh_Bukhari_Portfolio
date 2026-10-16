import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import agent from "./api/_agent.js";
const { handleAgentRequest, health } = agent;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get("/api/agent", (req, res) => {
  const result = health();
  res.status(result.status).json(result.body);
});

app.options("/api/agent", (req, res) => res.status(204).end());

app.all("/api/agent", (req, res) => {
  res.status(405).json({ error: "method_not_allowed" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "not_found" });
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

// Only expose the site pages and their public assets from the project root.
// This prevents the static server from publishing source, docs, or package files.
const PUBLIC_ROOT_FILES = new Set([
  "/index.html",
  "/case-study.html",
  "/credentials.html",
  "/agent.dc.html",
  "/support.js",
  "/theme.js",
  "/certs.js",
  "/favicon.svg",
  "/resume.pdf",
]);
const PUBLIC_ROUTES = new Set(["/", "/case-study", "/credentials"]);
const PUBLIC_DIRECTORIES = ["/assets/", "/_ds/"];
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const requestPath = req.path.toLowerCase();
  if (
    PUBLIC_ROOT_FILES.has(requestPath) ||
    PUBLIC_ROUTES.has(requestPath) ||
    PUBLIC_DIRECTORIES.some((prefix) => requestPath.startsWith(prefix))
  ) {
    return next();
  }
  if (path.extname(requestPath)) return res.status(404).send("Not found");
  return res.sendFile(path.join(__dirname, "index.html"));
});

// Static assets (with html extension fallback for clean URLs)
app.use(
  express.static(__dirname, {
    index: "index.html",
    extensions: ["html"],
  }),
);

// SPA fallback — only for GET, and only for non-file, non-api routes.
// Express 4 syntax:
app.get("*", (req, res, next) => {
  // Don't return HTML for requests that look like file requests
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

// Final 404 for anything else
app.use((req, res) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
  if (req.path !== "/api/agent") return next(err);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "payload_too_large" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "invalid_request" });
  }
  return next(err);
});

app.listen(PORT, "0.0.0.0", () =>
  console.log("Portfolio on http://localhost:" + PORT),
);
