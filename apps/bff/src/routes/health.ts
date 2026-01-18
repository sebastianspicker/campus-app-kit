import type { IncomingMessage, ServerResponse } from "node:http";

export async function handleHealth(
  _req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
}
