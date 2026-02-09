import type { IncomingMessage, ServerResponse } from "node:http";
import { createHash } from "node:crypto";

export function sendJsonWithCache(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
  options?: { status?: number; maxAgeSeconds?: number }
): void {
  let json: string;
  try {
    json = JSON.stringify(body);
  } catch {
    throw new Error("Response body is not JSON-serializable");
  }

  const status = options?.status ?? 200;
  const maxAgeSeconds = options?.maxAgeSeconds ?? 300;
  const etag = `"${createHash("sha1").update(json).digest("hex")}"`;

  if (res.headersSent) return;

  res.setHeader("ETag", etag);
  res.setHeader("Cache-Control", `public, max-age=${maxAgeSeconds}`);

  if (req.headers?.["if-none-match"] === etag) {
    res.writeHead(304);
    res.end();
    return;
  }

  res.writeHead(status, { "content-type": "application/json" });
  res.end(json);
}
