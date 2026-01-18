import http from "node:http";
import { loadInstitutionPack } from "./config/loader";
import { handleEvents } from "./routes/events";
import { handleHealth } from "./routes/health";
import { handleRooms } from "./routes/rooms";
import { handleSchedule } from "./routes/schedule";
import { handleToday } from "./routes/today";
import { checkRateLimit } from "./utils/rateLimit";
import { sendError } from "./utils/errors";

const port = Number(process.env.BFF_PORT ?? 4000);
const institutionId = process.env.INSTITUTION_ID ?? "hfmt";

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "missing url" }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  const clientKey = req.socket.remoteAddress ?? "unknown";
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    res.setHeader("retry-after", String(rate.retryAfter));
    sendError(res, 429, "rate_limited", "Too many requests");
    return;
  }

  if (url.pathname === "/health") {
    await handleHealth(req, res);
    return;
  }

  let institution;
  try {
    institution = await loadInstitutionPack(institutionId);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      sendError(res, 404, "institution_not_found", "Institution pack not found");
      return;
    }
    sendError(res, 500, "institution_load_failed", "Failed to load institution");
    return;
  }

  try {
    if (url.pathname === "/events") {
      await handleEvents(req, res, institution);
      return;
    }

    if (url.pathname === "/rooms") {
      await handleRooms(req, res, institution);
      return;
    }

    if (url.pathname === "/schedule") {
      await handleSchedule(req, res, institution);
      return;
    }

    if (url.pathname === "/today") {
      await handleToday(req, res, institution);
      return;
    }
  } catch {
    sendError(res, 500, "internal_error", "Unexpected server error");
    return;
  }

  sendError(res, 404, "not_found", "Route not found");
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`BFF listening on http://localhost:${port}`);
});
