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
  "case-study": "/case1",
  "case1-2": "/case2",
  "case-study-2": "/case2",
  case2: "/case2",
  credentials: "/credentials",
  resume: "/resume.pdf",
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

// Drop trailing slashes so relative asset paths (theme.js, _ds/…) resolve.
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, "") + query);
  }
  next();
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
app.get("/case-study", (req, res) => res.redirect(301, "/case1"));
app.get("/case-study-2", (req, res) => res.redirect(301, "/case2"));

// Static assets — only these root files and directories are public. Paths are
// literal so Vercel's file tracing bundles them into the function.
app.get("/support.js", (req, res) =>
  res.sendFile(path.join(__dirname, "support.js")),
);
app.get("/theme.js", (req, res) =>
  res.sendFile(path.join(__dirname, "theme.js")),
);
app.get("/certs.js", (req, res) =>
  res.sendFile(path.join(__dirname, "certs.js")),
);
app.get("/Agent.dc.html", (req, res) =>
  res.sendFile(path.join(__dirname, "Agent.dc.html")),
);
app.get("/resume.pdf", (req, res) =>
  res.sendFile(path.join(__dirname, "resume.pdf")),
);
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/_ds", express.static(path.join(__dirname, "_ds")));

// Unknown clean routes → home page; unknown files → 404.
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
