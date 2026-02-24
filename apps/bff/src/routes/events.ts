import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import type { EventsResponse } from "@campus/shared";
import { EventsResponseSchema } from "@campus/shared";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { createJsonRoute } from "./createJsonRoute";

export const handleEvents = createJsonRoute(
  async (institution) => {
    const sources = institution.publicSources?.events ?? [];
    if (sources.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No event sources configured");
    }
    const { events, degraded } = await fetchPublicEvents(institution);
    return {
      events,
      _degraded: degraded,
      _sourcesConfigured: true
    };
  },
  EventsResponseSchema,
  {
    maxAgeSeconds: 300,
    getExtraHeaders: (data: EventsResponse) => ({
      ...(data._degraded ? { "x-data-degraded": "true" } : {}),
      ...(process.env.PUBLIC_EVENTS_MODE === "mock" ? { "x-data-mode": "mock" } : {})
    })
  }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
