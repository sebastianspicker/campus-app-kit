import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { TodayResponseSchema } from "@campus/shared";
import { sendJsonWithCache } from "../utils/httpCache";

export async function handleToday(
  req: IncomingMessage,
  res: ServerResponse,
  institution: InstitutionPack
): Promise<void> {
  const events = await fetchPublicEvents(institution);
  const response = TodayResponseSchema.parse({
    events,
    rooms: institution.publicRooms ?? []
  });
  sendJsonWithCache(req, res, response, { maxAgeSeconds: 300 });
}
