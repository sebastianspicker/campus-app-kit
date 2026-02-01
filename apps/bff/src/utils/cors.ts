export function getCorsHeaders(
  requestOrigin: string | undefined,
  allowedOrigins: string[]
): Record<string, string> {
  if (allowedOrigins.length === 0) {
    return {};
  }

  const origin =
    allowedOrigins.includes("*")
      ? "*"
      : requestOrigin && allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : null;

  if (!origin) {
    return {};
  }

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    ...(origin === "*" ? {} : { vary: "origin" })
  };
}
