import type { IncomingMessage, ServerResponse } from "node:http";
import { createHash } from "node:crypto";

export function sendJsonWithCache(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
  options?: { status?: number; maxAgeSeconds?: number }
): void {
  const status = options?.status ?? 200;
  const maxAgeSeconds = options?.maxAgeSeconds ?? 300;
  const json = JSON.stringify(body);
  const etag = `"${createHash("sha1").update(json).digest("hex")}"`;

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
