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

function sanitizeContext(
  context: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!context) return {};

  const blockedKeys = new Set([
    "authorization",
    "cookie",
    "set-cookie",
    "password",
    "token",
    "accessToken",
    "refreshToken"
  ]);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (blockedKeys.has(key)) continue;
    result[key] = value;
  }
  return result;
}
