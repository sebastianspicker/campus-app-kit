import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import type { EventsResponse } from "@campus/shared";
import { EventsResponseSchema } from "@campus/shared";
import { fetchPublicEvents } from "../connectors/public/hfmtWebEvents";
import { parseQueryParams, parseEventsFilter } from "../utils/queryParams";
import { createJsonRoute } from "./createJsonRoute";

export const handleEvents = createJsonRoute(
  async (institution, req) => {
    const sources = institution.publicSources?.events ?? [];
    if (sources.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No event sources configured");
    }
    
    const { events, degraded } = await fetchPublicEvents(institution);
    
    // Apply filters from query parameters
    const params = parseQueryParams(req);
    const filter = parseEventsFilter(params);
    
    let filteredEvents = events;
    
    // Search filter (case-insensitive partial match on title)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(searchLower)
      );
    }
    
    // Date range filters
    if (filter.fromDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.date) >= filter.fromDate!
      );
    }
    if (filter.toDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.date) <= filter.toDate!
      );
    }
    
    // Pagination
    const offset = filter.offset ?? 0;
    const limit = filter.limit;
    if (limit !== undefined) {
      filteredEvents = filteredEvents.slice(offset, offset + limit);
    } else if (offset > 0) {
      filteredEvents = filteredEvents.slice(offset);
    }
    
    return {
      events: filteredEvents,
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
