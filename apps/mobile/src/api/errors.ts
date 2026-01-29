// Placeholder: API error parsing for BFF responses
// TODO:
// - Parse `{ error: { code, message } }` shape
// - Map to user-friendly messages
// - Provide typed error class for UI

export type ApiError = {
  code: string;
  message: string;
  status: number;
};

export function parseApiError(_response: Response, _body?: unknown): ApiError {
  throw new Error("TODO: parseApiError implementieren");
}
