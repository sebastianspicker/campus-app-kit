import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import type { TodayResponse } from "@campus/shared";
import { TodayResponseSchema } from "@campus/shared";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { createJsonRoute } from "./createJsonRoute";

export const handleToday = createJsonRoute(
  async (institution) => {
    const eventsConfigured = (institution.publicSources?.events?.length ?? 0) > 0;
    const roomsConfigured = (institution.publicRooms?.length ?? 0) > 0;

    if (!eventsConfigured && !roomsConfigured) {
      throw new Error("NO_CONFIG_SOURCES: No event or room sources configured for today view");
    }

    const { events, degraded } = await fetchPublicEvents(institution);

    // Date scoping: Filter events to only show those for today
    const todayStr = new Date().toISOString().split("T")[0];
    const todayEvents = events.filter(e => e.date.startsWith(todayStr));

    return {
      events: todayEvents,
      rooms: institution.publicRooms ?? [],
      _degraded: degraded,
      _sourcesConfigured: true
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
