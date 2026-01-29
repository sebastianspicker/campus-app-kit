import { EventsResponseSchema } from "@campus/shared";
import { jsonError, jsonOk, OPTIONS } from "./_utils";
import { loadInstitutionPackForApi } from "./_institution";

export { OPTIONS };

// Placeholder: GET /api/events
// TODO:
// - Implement public events fetching in Workers runtime
//   - either port logic from `apps/bff/src/connectors/public/hfmtWebEvents.ts`
//   - or move shared connector code into a runtime-agnostic package
// - Add caching (edge cache / KV) and stable IDs

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("institutionId") ?? "hfmt";

  try {
    await loadInstitutionPackForApi(institutionId);
    // TODO: fetch + normalize events
    const response = EventsResponseSchema.parse({ events: [] });
    return jsonOk(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonError(500, "events_failed", message);
  }
}

