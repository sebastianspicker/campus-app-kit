export type ApiError = {
  code: string;
  message: string;
  status: number;
};

export class ApiErrorException extends Error {
  readonly code: string;
  readonly status: number;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.status = error.status;
  }
}

export function parseApiError(response: Response, body?: unknown): ApiError {
  const status = response.status;

  if (body && typeof body === "object") {
    const maybeError = (body as { error?: unknown }).error;
    if (maybeError && typeof maybeError === "object") {
      const code =
        typeof (maybeError as { code?: unknown }).code === "string"
          ? (maybeError as { code: string }).code
          : "unknown_error";
      const message =
        typeof (maybeError as { message?: unknown }).message === "string"
          ? (maybeError as { message: string }).message
          : `Request failed (${status})`;
      return { code, message, status };
    }
  }

  return { code: "unknown_error", message: `Request failed (${status})`, status };
}
