import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { EventsResponseSchema } from "@campus/shared";
import { sendJsonWithCache } from "../utils/httpCache";

export async function handleEvents(
  req: IncomingMessage,
  res: ServerResponse,
  institution: InstitutionPack
): Promise<void> {
  const events = await fetchPublicEvents(institution);
  const response = EventsResponseSchema.parse({ events });
  sendJsonWithCache(req, res, response, { maxAgeSeconds: 300 });
}
