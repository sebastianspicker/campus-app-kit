/** Placeholder für API-Fetch-Helpers */

export type BffError = {
  code: string;
  message: string;
};

export async function fetchJsonWithTimeout<T>(
  url: string,
  init?: RequestInit,
  timeoutMs = 10_000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: init?.signal ?? controller.signal
    });

    if (!response.ok) {
      const bffError = await parseBffError(response);
      const message =
        bffError.code === "unknown_error"
          ? `Request failed (${response.status})`
          : bffError.message;
      const err = new Error(message);
      (err as { status?: number; code?: string }).status = response.status;
      (err as { status?: number; code?: string }).code = bffError.code;
      throw err;
    }

    const data = (await response.json()) as T;
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function parseBffError(response: Response): Promise<BffError> {
  try {
    const body = (await response.json()) as unknown;
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof (body as { error?: unknown }).error === "object" &&
      (body as { error?: unknown }).error !== null
    ) {
      const error = (body as { error: { code?: unknown; message?: unknown } }).error;
      const code = typeof error.code === "string" ? error.code : "unknown_error";
      const message =
        typeof error.message === "string" ? error.message : "Unknown error";
      return { code, message };
    }
  } catch {
    // ignore
  }

  return { code: "unknown_error", message: "Unknown error" };
}
