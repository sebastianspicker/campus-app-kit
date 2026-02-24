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
  const cleanup = linkAbortSignals(controller, init?.signal);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });

    if (!response.ok) {
      const bffError = await parseBffError(response);
      const message =
        bffError.code === "unknown_error"
          ? `Request failed (${response.status})`
          : bffError.message;
      const retryAfter = response.headers.get("retry-after");
      const err = new Error(message);
      (err as { status?: number; code?: string; retryAfterInSeconds?: number }).status = response.status;
      (err as { status?: number; code?: string; retryAfterInSeconds?: number }).code = bffError.code;
      if (retryAfter) {
        // #62: Support both seconds and HTTP-date
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds)) {
          (err as { retryAfterInSeconds?: number }).retryAfterInSeconds = seconds;
        } else {
          const date = new Date(retryAfter);
          if (!isNaN(date.getTime())) {
            const diff = Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
            (err as { retryAfterInSeconds?: number }).retryAfterInSeconds = diff;
          }
        }
      }
      throw err;
    }

    // #61: Handle 204 No Content or empty bodies
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } finally {
    cleanup();
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

function linkAbortSignals(
  controller: AbortController,
  external?: AbortSignal | null
): () => void {
  if (!external) {
    return () => undefined;
  }

  if (external.aborted) {
    controller.abort();
    return () => undefined;
  }

  const onAbort = () => controller.abort();
  external.addEventListener("abort", onAbort, { once: true });

  return () => external.removeEventListener("abort", onAbort);
}
