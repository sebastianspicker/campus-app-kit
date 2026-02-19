import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import type { TodayResponse } from "@campus/shared";
import { TodayResponseSchema } from "@campus/shared";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { createJsonRoute } from "./createJsonRoute";

export const handleToday = createJsonRoute(
  async (institution) => {
    const { events, degraded } = await fetchPublicEvents(institution);
    const eventsConfigured =
      (institution.publicSources?.events?.length ?? 0) > 0;
    const roomsConfigured = (institution.publicRooms?.length ?? 0) > 0;
    const sourcesConfigured = eventsConfigured || roomsConfigured;
    return {
      events,
      rooms: institution.publicRooms ?? [],
      _degraded: degraded,
      _sourcesConfigured: sourcesConfigured ? undefined : false
    };
  },
  TodayResponseSchema,
  {
    maxAgeSeconds: 300,
    getExtraHeaders: (data: TodayResponse) => ({
      ...(data._degraded ? { "x-data-degraded": "true" } : {}),
      ...(process.env.PUBLIC_EVENTS_MODE === "mock" ? { "x-data-mode": "mock" } : {})
    })
  }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
