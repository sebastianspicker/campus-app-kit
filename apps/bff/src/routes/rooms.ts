import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { RoomsResponseSchema } from "@campus/shared";
import { createJsonRoute } from "./createJsonRoute";

export const handleRooms = createJsonRoute(
  async (institution) => {
    const rooms = institution.publicRooms ?? [];
    if (rooms.length === 0) {
      throw new Error("NO_CONFIG_SOURCES: No rooms configured");
    }
    return {
      rooms,
      _sourcesConfigured: true
    };
  },
  RoomsResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
