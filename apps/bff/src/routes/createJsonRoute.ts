import type { IncomingMessage, ServerResponse } from "node:http";
import type { z } from "zod";
import { ZodError } from "zod";
import type { InstitutionPack } from "../config/loader";
import { sendJsonWithCache } from "../utils/httpCache";
import { sendError } from "../utils/errors";
import { log } from "../utils/logger";
import { getRequestId } from "../utils/requestId";

type JsonRouteLoader = (institution: InstitutionPack) => Promise<unknown>;

export function createJsonRoute<T>(
  loader: JsonRouteLoader,
  schema: z.ZodType<T>,
  options: { maxAgeSeconds?: number; getExtraHeaders?: (data: T) => Record<string, string> } = {}
): (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void> {
  const maxAgeSeconds = options.maxAgeSeconds ?? 300;
  const getExtraHeaders = options.getExtraHeaders;

  return async (req, res, institution): Promise<void> => {
    const requestId = getRequestId(req);
    try {
      const data = await loader(institution);
      const response = schema.parse(data);
      if (getExtraHeaders) {
        const extra = getExtraHeaders(response);
        for (const [key, value] of Object.entries(extra)) {
          res.setHeader(key, value);
        }
      }
      sendJsonWithCache(req, res, response, { maxAgeSeconds });
    } catch (err) {
      if (err instanceof ZodError) {
        log("warn", "validation_error", { requestId, issues: err.issues });
        sendError(res, 500, "validation_error", "Response validation failed");
        return;
      }
      log("error", "route_error", {
        requestId,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
      sendError(res, 500, "internal_error", "Unexpected server error");
    }
  };
}
