import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { ScheduleResponseSchema } from "@campus/shared";
import { fetchPublicSchedule } from "../connectors/public/publicSchedule";
import { sendJsonWithCache } from "../utils/httpCache";

export async function handleSchedule(
  req: IncomingMessage,
  res: ServerResponse,
  institution: InstitutionPack
): Promise<void> {
  const schedule = await fetchPublicSchedule(institution);
  const response = ScheduleResponseSchema.parse({ schedule });
  sendJsonWithCache(req, res, response, { maxAgeSeconds: 300 });
}
