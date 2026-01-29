// Placeholder: shared helpers for Expo API routes (EAS Hosting / Workers runtime)
// TODO:
// - Define consistent error envelope (match BFF sendError shape)
// - Add CORS headers for web
// - Add simple rate-limit (edge-friendly) if needed

export const corsHeaders: Record<string, string> = {
  // TODO: Restrict origins in production
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export function jsonOk(body: unknown, init?: ResponseInit): Response {
  return Response.json(body, { ...init, headers: { ...corsHeaders, ...(init?.headers ?? {}) } });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  init?: ResponseInit
): Response {
  return Response.json(
    { error: { code, message } },
    { status, ...init, headers: { ...corsHeaders, ...(init?.headers ?? {}) } }
  );
}

export function OPTIONS(): Response {
  return new Response(null, { headers: corsHeaders });
}

