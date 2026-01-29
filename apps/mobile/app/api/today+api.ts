import { TodayResponseSchema } from "@campus/shared";
import { jsonError, jsonOk, OPTIONS } from "./_utils";
import { loadInstitutionPackForApi } from "./_institution";

export { OPTIONS };

// Placeholder: GET /api/today
// TODO:
// - Combine events + rooms (rooms from public pack)
// - Add caching
// - Parallelize fetching (Promise.all) when implemented

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("institutionId") ?? "hfmt";

  try {
    await loadInstitutionPackForApi(institutionId);
    const response = TodayResponseSchema.parse({ events: [], rooms: [] });
    return jsonOk(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonError(500, "today_failed", message);
  }
}

