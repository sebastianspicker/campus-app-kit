/** Placeholder: Strukturiertes Logging für BFF */

export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  // TODO: Strukturierte Logs (z. B. RequestId, path, duration) implementieren.
  // - Keine sensiblen Daten (Tokens, IPs) loggen.
  // - Optional: X-Request-ID aus Headers injizieren.
  throw new Error("TODO: Logger implementieren");
}
