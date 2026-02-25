import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { RoomsResponseSchema } from "@campus/shared";
import { parseQueryParams, parseRoomsFilter } from "../utils/queryParams";
import { createJsonRoute } from "./createJsonRoute";

export const handleRooms = createJsonRoute(
  async (institution, req) => {
    const rooms = institution.publicRooms ?? [];
    if (rooms.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No rooms configured");
    }
    
    // Apply filters from query parameters
    const params = parseQueryParams(req);
    const filter = parseRoomsFilter(params);
    
    let filteredRooms = rooms;
    
    // Campus filter
    if (filter.campus) {
      filteredRooms = filteredRooms.filter(r => r.campusId === filter.campus);
    }
    
    // Search filter (case-insensitive partial match on name)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredRooms = filteredRooms.filter(r => 
        r.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const offset = filter.offset ?? 0;
    const limit = filter.limit;
    if (limit !== undefined) {
      filteredRooms = filteredRooms.slice(offset, offset + limit);
    } else if (offset > 0) {
      filteredRooms = filteredRooms.slice(offset);
    }
    
    return {
      rooms: filteredRooms,
      _sourcesConfigured: true
    };
  },
  RoomsResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
