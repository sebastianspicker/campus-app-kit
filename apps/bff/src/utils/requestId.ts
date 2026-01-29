import type { IncomingMessage, ServerResponse } from "node:http";

// Placeholder: Request-ID handling for observability
// TODO:
// - Read from `x-request-id` header or generate UUID
// - Attach to response headers
// - Provide to logger context

export function getRequestId(_req: IncomingMessage): string {
  throw new Error("TODO: getRequestId implementieren");
}

export function setRequestIdHeader(
  _res: ServerResponse,
  _requestId: string
): void {
  // TODO: set `x-request-id` response header
}
