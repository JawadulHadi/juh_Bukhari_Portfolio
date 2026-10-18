import agent from "../../api/_agent.js";

export default async (request: Request, context: { ip: string }) => {
  const headers = { "Cache-Control": "no-store" };
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (request.method === "GET") {
    const result = agent.health();
    return Response.json(result.body, { status: result.status, headers });
  }
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405, headers });
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > 64 * 1024) {
    return Response.json({ error: "payload_too_large" }, { status: 413, headers });
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400, headers });
  }
  try {
    const result = await agent.handleAgentRequest(body, context.ip);
    return Response.json(result.body, { status: result.status, headers });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500, headers });
  }
};

export const config = { path: "/api/agent" };
