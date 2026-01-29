import { RoomsResponseSchema } from "@campus/shared";
import { jsonError, jsonOk, OPTIONS } from "./_utils";
import { loadInstitutionPackForApi } from "./_institution";

export { OPTIONS };

// Placeholder: GET /api/rooms
// TODO:
// - Extend InstitutionPack schema with `publicRooms`
// - Return room list from institution pack

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("institutionId") ?? "hfmt";

  try {
    await loadInstitutionPackForApi(institutionId);
    const response = RoomsResponseSchema.parse({ rooms: [] });
    return jsonOk(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonError(500, "rooms_failed", message);
  }
}

