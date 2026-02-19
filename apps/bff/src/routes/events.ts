import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { EventsResponseSchema } from "@campus/shared";
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
    getExtraHeaders: (data) => ({
      ...(data._degraded ? { "x-data-degraded": "true" } : {}),
      ...(process.env.PUBLIC_EVENTS_MODE === "mock" ? { "x-data-mode": "mock" } : {})
    })
  }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
