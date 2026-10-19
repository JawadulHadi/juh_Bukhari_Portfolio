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
  case1: "/case1",
  "case1-2": "/case2",
  "case-study-2": "/case2",
  case2: "/case2",
  credentials: "/credentials",
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
app.get(/^\/Case(%20| )Study\.dc/, (req, res) => res.redirect(301, "/case1"));
app.get("/resume", (req, res) => res.redirect(307, "/resume.pdf"));

// .html extension → clean URL redirect.
app.get(/^\/(index)?(\.html)?$/, (req, res, next) =>
  req.path === "/" ? next() : res.redirect(301, "/"),
);
app.get(/^\/([\w-]+)\.html$/, (req, res) => {
  const page = req.params[0];
  const target = LEGACY_HTML_REDIRECTS[page] || "/";
  res.redirect(301, target);
});

// Favicon lives in assets/ on this branch.
app.get("/favicon.svg", (req, res) =>
  res.sendFile(path.join(__dirname, "assets/favicon.svg")),
);

// Page routes — HTML files live under lib/ now.
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "lib/public/index.html")),
);
app.get("/credentials", (req, res) =>
  res.sendFile(path.join(__dirname, "lib/public/credentials.html")),
);
app.get("/case1", (req, res) =>
  res.sendFile(path.join(__dirname, "lib/cases/case1.html")),
);
app.get("/case2", (req, res) =>
  res.sendFile(path.join(__dirname, "lib/cases/case2.html")),
);
app.get("/case1-2", (req, res) => res.redirect(301, "/case2"));

// Static assets — only expose safe root-level files plus asset directories.
const PUBLIC_ROOT_FILES = new Set([
  "/index.html",
  "/case-study.html",
  "/case-study-2.html",
  "/credentials.html",
  "/agent.dc.html",
  "/support.js",
  "/theme.js",
  "/certs.js",
  "/resume.pdf",
]);
const PUBLIC_ROUTES = new Set(["/", "/case-study", "/case-study-2", "/credentials"]);
const PUBLIC_DIRECTORIES = ["/assets/", "/_ds/"];
const PUBLIC_DIRECTORIES = ["/assets/", "/_ds/", "/lib/"];
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const requestPath = req.path.toLowerCase();
  if (
    PUBLIC_ROOT_FILES.has(requestPath) ||
    PUBLIC_DIRECTORIES.some((prefix) => requestPath.startsWith(prefix))
  ) {
    return next();
  }
  if (path.extname(requestPath)) return res.status(404).send("Not found");
  return res.sendFile(path.join(__dirname, "lib/public/index.html"));
});

app.use(express.static(path.join(__dirname, "lib/public"), { index: false }));

// SPA fallback for unknown clean routes.
app.get("*", (req, res, next) => {
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(__dirname, "lib/public/index.html"));
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
