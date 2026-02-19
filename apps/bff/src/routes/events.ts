import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import type { EventsResponse } from "@campus/shared";
import { EventsResponseSchema } from "@campus/shared";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { createJsonRoute } from "./createJsonRoute";

export const handleEvents = createJsonRoute(
  async (institution) => {
    const { events, degraded } = await fetchPublicEvents(institution);
    const sourcesConfigured =
      (institution.publicSources?.events?.length ?? 0) > 0;
    return {
      events,
      _degraded: degraded,
      _sourcesConfigured: sourcesConfigured ? undefined : false
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
