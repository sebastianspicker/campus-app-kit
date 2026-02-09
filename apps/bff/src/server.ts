import http from "node:http";
import { getBffEnv } from "./config/env";
import { loadInstitutionPack } from "./config/loader";
import { guardMethods } from "./middleware/methodGuard";
import { handleEvents } from "./routes/events";
import { handleHealth } from "./routes/health";
import { handleRooms } from "./routes/rooms";
import { handleSchedule } from "./routes/schedule";
import { handleToday } from "./routes/today";
import { getCorsHeaders } from "./utils/cors";
import { getClientKey } from "./utils/clientKey";
import { checkRateLimit } from "./utils/rateLimit";
import { sendError } from "./utils/errors";
import { log } from "./utils/logger";
import { getRequestId, setRequestIdHeader } from "./utils/requestId";

const env = getBffEnv();

const server = http.createServer(async (req, res) => {
  const startedAt = Date.now();
  const requestId = getRequestId(req);
  setRequestIdHeader(res, requestId);

  if (!req.url) {
    sendError(res, 400, "bad_request", "Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  const cors = getCorsHeaders(req.headers.origin, env.corsOrigins);
  for (const [key, value] of Object.entries(cors)) {
    res.setHeader(key, value);
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.writeHead(204);
    res.end();
    return;
  }

  if (!guardMethods(req, res, ["GET", "OPTIONS"])) {
    log("info", "method_not_allowed", {
      requestId,
      method: req.method,
      path: url.pathname
    });
    return;
  }

  const clientKey = getClientKey(req, { trustProxy: env.trustProxy });
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    res.setHeader("retry-after", String(rate.retryAfter));
    sendError(res, 429, "rate_limited", "Too many requests");
    log("warn", "rate_limited", {
      requestId,
      path: url.pathname,
      retryAfterSeconds: rate.retryAfter
    });
    return;
  }

  if (url.pathname === "/health") {
    await handleHealth(req, res);
    log("info", "health_ok", { requestId, durationMs: Date.now() - startedAt });
    return;
  }

  let institution;
  try {
    institution = await loadInstitutionPack(env.institutionId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load institution";
    if (message.includes("Unknown institutionId")) {
      sendError(res, 404, "institution_not_found", message);
      return;
    }
    sendError(res, 500, "institution_load_failed", message);
    return;
  }

  try {
    if (url.pathname === "/events") {
      await handleEvents(req, res, institution);
      log("info", "events_ok", { requestId, durationMs: Date.now() - startedAt });
      return;
    }

    if (url.pathname === "/rooms") {
      await handleRooms(req, res, institution);
      log("info", "rooms_ok", { requestId, durationMs: Date.now() - startedAt });
      return;
    }

    if (url.pathname === "/schedule") {
      await handleSchedule(req, res, institution);
      log("info", "schedule_ok", { requestId, durationMs: Date.now() - startedAt });
      return;
    }

    if (url.pathname === "/today") {
      await handleToday(req, res, institution);
      log("info", "today_ok", { requestId, durationMs: Date.now() - startedAt });
      return;
    }
  } catch {
    sendError(res, 500, "internal_error", "Unexpected server error");
    log("error", "internal_error", { requestId, durationMs: Date.now() - startedAt });
    return;
  }

  sendError(res, 404, "not_found", "Route not found");
  log("info", "not_found", { requestId, durationMs: Date.now() - startedAt });
});

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`BFF listening on http://localhost:${env.port}`);
});
