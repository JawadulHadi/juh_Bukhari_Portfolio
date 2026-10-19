import { cp, mkdir, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const output = new URL("dist/", root);
// Publish only public pages and assets, never server code or environment files.
const publicFiles = [
  "index.html",
  "case-study.html",
  "case-study-2.html",
  "credentials.html",
  "Agent.dc.html",
  "support.js",
  "theme.js",
  "certs.js",
  "favicon.svg",
  "assets",
  "_ds",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) {
  await cp(new URL(file, root), new URL(file, output), { recursive: true });
}
// Some checkouts omit the resume; include it whenever it is supplied.
try {
  await stat(new URL("resume.pdf", root));
  await cp(new URL("resume.pdf", root), new URL("resume.pdf", output));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
console.log(`Static site prepared in ${fileURLToPath(output)}`);
