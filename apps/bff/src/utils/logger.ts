/** Placeholder: Strukturiertes Logging für BFF */

export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): void {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...sanitizeContext(context)
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

const BLOCKED_KEYS = new Set(
  [
    "authorization",
    "cookie",
    "set-cookie",
    "password",
    "token",
    "accesstoken",
    "refreshtoken"
  ].map((k) => k.toLowerCase())
);

function isBlocked(key: string): boolean {
  return BLOCKED_KEYS.has(key.toLowerCase());
}

function sanitizeContext(
  context: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!context) return {};

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (isBlocked(key)) continue;
    result[key] = sanitizeValue(value);
  }
  return result;
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (isBlocked(k)) continue;
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return value;
}
