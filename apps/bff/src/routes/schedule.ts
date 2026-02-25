import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { ScheduleResponseSchema } from "@campus/shared";
import { fetchPublicSchedule } from "../connectors/public/publicSchedule";
import { parseQueryParams, parseScheduleFilter } from "../utils/queryParams";
import { createJsonRoute } from "./createJsonRoute";

export const handleSchedule = createJsonRoute(
  async (institution, req) => {
    const schedules = institution.publicSources?.schedules ?? [];
    if (schedules.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No schedules configured");
    }
    
    const schedule = await fetchPublicSchedule(institution);
    
    // Apply filters from query parameters
    const params = parseQueryParams(req);
    const filter = parseScheduleFilter(params);
    
    let filteredSchedule = schedule;
    
    // Date range filters
    if (filter.fromDate) {
      filteredSchedule = filteredSchedule.filter(item => 
        new Date(item.startsAt) >= filter.fromDate!
      );
    }
    if (filter.toDate) {
      filteredSchedule = filteredSchedule.filter(item => 
        new Date(item.startsAt) <= filter.toDate!
      );
    }
    
    // Campus filter
    if (filter.campusId) {
      filteredSchedule = filteredSchedule.filter(item => 
        item.campusId === filter.campusId
      );
    }
    
    // Search filter (case-insensitive partial match on title)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredSchedule = filteredSchedule.filter(item => 
        item.title.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const offset = filter.offset ?? 0;
    const limit = filter.limit;
    if (limit !== undefined) {
      filteredSchedule = filteredSchedule.slice(offset, offset + limit);
    } else if (offset > 0) {
      filteredSchedule = filteredSchedule.slice(offset);
    }
    
    return {
      schedule: filteredSchedule,
      _sourcesConfigured: true
    };
  },
  ScheduleResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
