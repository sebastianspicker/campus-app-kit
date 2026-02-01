import type { IncomingMessage, ServerResponse } from "node:http";
import type { InstitutionPack } from "../config/loader";
import { RoomsResponseSchema } from "@campus/shared";
import { sendJsonWithCache } from "../utils/httpCache";

export async function handleRooms(
  req: IncomingMessage,
  res: ServerResponse,
  institution: InstitutionPack
): Promise<void> {
  const response = RoomsResponseSchema.parse({
    rooms: institution.publicRooms ?? []
  });
  sendJsonWithCache(req, res, response, { maxAgeSeconds: 300 });
}
