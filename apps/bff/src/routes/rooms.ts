import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { RoomsResponseSchema } from "@campus/shared";
import { createJsonRoute } from "./createJsonRoute";

export const handleRooms = createJsonRoute(
  async (institution) => {
    const rooms = institution.publicRooms ?? [];
    const sourcesConfigured = rooms.length > 0;
    return {
      rooms,
      _sourcesConfigured: sourcesConfigured ? undefined : false
    };
  },
  RoomsResponseSchema,
  { maxAgeSeconds: 300 }
) as (req: IncomingMessage, res: ServerResponse, institution: InstitutionPack) => Promise<void>;
