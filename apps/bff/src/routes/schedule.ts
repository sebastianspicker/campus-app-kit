import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { ScheduleResponseSchema } from "@campus/shared";
import { fetchPublicSchedule } from "../connectors/public/publicSchedule";
import { createJsonRoute } from "./createJsonRoute";

export const handleSchedule = createJsonRoute(
  async (institution) => {
    const schedules = institution.publicSources?.schedules ?? [];
    if (schedules.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No schedules configured");
    }
    const schedule = await fetchPublicSchedule(institution);
    return {
      schedule,
      _sourcesConfigured: true
    };
  },
  ScheduleResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
