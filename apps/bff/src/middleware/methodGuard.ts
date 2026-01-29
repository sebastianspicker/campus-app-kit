import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError } from "../utils/errors";

// Placeholder: Allow only GET/OPTIONS for public endpoints
// TODO:
// - Enforce allowed methods per route
// - Return 405 with Allow header

export function guardMethods(
  _req: IncomingMessage,
  _res: ServerResponse,
  _allowed: string[] = ["GET", "OPTIONS"]
): boolean {
  // return true if allowed, false if responded with error
  return true;
}
