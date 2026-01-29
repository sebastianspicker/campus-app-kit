import { ScheduleResponseSchema } from "@campus/shared";
import { jsonError, jsonOk, OPTIONS } from "./_utils";
import { loadInstitutionPackForApi } from "./_institution";

export { OPTIONS };

// Placeholder: GET /api/schedule
// TODO:
// - Implement ICS fetching/parsing in Workers runtime
// - Use robust parser (TZID, VALUE=DATE)
// - Add caching

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("institutionId") ?? "hfmt";

  try {
    await loadInstitutionPackForApi(institutionId);
    const response = ScheduleResponseSchema.parse({ schedule: [] });
    return jsonOk(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonError(500, "schedule_failed", message);
  }
}

