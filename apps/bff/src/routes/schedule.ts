import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { ScheduleResponseSchema } from "@campus/shared";
import { fetchPublicSchedule } from "../connectors/public/publicSchedule";
import { createJsonRoute } from "./createJsonRoute";

export const handleSchedule = createJsonRoute(
  async (institution) => {
    const schedule = await fetchPublicSchedule(institution);
    const sourcesConfigured =
      (institution.publicSources?.schedules?.length ?? 0) > 0;
    return {
      schedule,
      _sourcesConfigured: sourcesConfigured ? undefined : false
    };
  },
  ScheduleResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
