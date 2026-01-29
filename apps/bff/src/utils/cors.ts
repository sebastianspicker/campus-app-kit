// Placeholder: CORS headers for public API responses
// TODO:
// - Define allowed origins based on env
// - Add OPTIONS handler for preflight
// - Attach headers to all responses

export function getCorsHeaders(): Record<string, string> {
  return {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET, OPTIONS",
    // "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
