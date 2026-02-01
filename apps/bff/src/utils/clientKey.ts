import type { IncomingMessage } from "node:http";

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withoutMappedV6 = trimmed.startsWith("::ffff:")
    ? trimmed.slice("::ffff:".length)
    : trimmed;
  return withoutMappedV6;
}

function parseForwardedHeader(header: string): string | null {
  // Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43
  const match = header.match(/for=([^;,\s]+)/i);
  if (!match) return null;
  let value = match[1].trim();
  if (value.startsWith("\"") && value.endsWith("\"")) {
    value = value.slice(1, -1);
  }
  if (value.startsWith("[")) {
    const end = value.indexOf("]");
    if (end > 1) {
      return value.slice(1, end);
    }
  }
  return value.split(":")[0];
}

export function getClientKey(req: IncomingMessage): string {
  const xff = req.headers["x-forwarded-for"];
  const xffValue = Array.isArray(xff) ? xff[0] : xff;
  if (typeof xffValue === "string" && xffValue.trim()) {
    const first = xffValue.split(",")[0];
    return normalizeIp(first) ?? "unknown";
  }

  const forwarded = req.headers["forwarded"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof forwardedValue === "string") {
    const parsed = parseForwardedHeader(forwardedValue);
    return normalizeIp(parsed) ?? "unknown";
  }

  return normalizeIp(req.socket.remoteAddress) ?? "unknown";
}
