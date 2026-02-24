import type { IncomingMessage, ServerResponse } from "node:http";

import { BFF_ENV } from "../config/env";
import { loadInstitutionPack } from "../config/loader";
import { log } from "../utils/logger";

export async function handleHealth(
  _req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  try {
    await loadInstitutionPack(BFF_ENV.institutionId);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } catch (err) {
    log("error", "health_failed", {
      message: err instanceof Error ? err.message : String(err)
    });
    res.writeHead(503, { "content-type": "application/json" });
    // #69: Sanitize error message to avoid leaking config details
    res.end(JSON.stringify({ status: "error", message: "Health check failed: Configuration or Institution load error" }));
  }
}
