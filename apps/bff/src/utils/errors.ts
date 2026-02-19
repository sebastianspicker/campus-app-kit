import type { ServerResponse } from "node:http";

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
    try {
      res.end();
    } catch {
      // Ignore if stream already closed
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
