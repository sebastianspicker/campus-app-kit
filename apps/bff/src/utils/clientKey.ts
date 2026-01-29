import type { IncomingMessage } from "node:http";

// Placeholder: Proxy-aware client key derivation
// TODO:
// - Parse `x-forwarded-for` / `forwarded`
// - Fallback to `req.socket.remoteAddress`
// - Normalize/validate IP format

export function getClientKey(_req: IncomingMessage): string {
  return "unknown";
}
