import type { ServerResponse } from "node:http";
import { log } from "./logger";

export type ErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export function sendError(
  res: ServerResponse,
  status: number,
  code: string,
  message: string
): void {
  if (res.headersSent) {
    log("warn", "send_error_after_headers", { status, code, message });
    try {
      if (!res.writableEnded) res.end();
    } catch {
      // Ignore
    }
    return;
  }

  const body: ErrorBody = {
    error: {
      code,
      message
    }
  };

  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}
