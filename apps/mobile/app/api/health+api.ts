import { jsonOk, OPTIONS } from "./_utils";

export { OPTIONS };

// Placeholder: GET /api/health
// TODO:
// - Add build/version info
// - Add request-id in headers (if implemented)

export function GET(): Response {
  return jsonOk({ status: "ok" });
}

