import { getErrorType, type ErrorType } from "./ErrorState";
import type { UiError } from "../api/uiError";

export function detectResourceErrorType(error: string | UiError): ErrorType {
  if (typeof error !== "string") {
    return getErrorType(error);
  }
  const lower = error.toLowerCase();
  if (isNetworkErrorText(lower)) {
    return "network";
  }
  if (lower.includes("not found") || lower.includes("404")) {
    return "notFound";
  }
  return "generic";
}

function isNetworkErrorText(lower: string): boolean {
  return [
    "network",
    "connection",
    "offline",
    "timeout",
    "fetch",
    "request failed"
  ].some((needle) => lower.includes(needle));
}
