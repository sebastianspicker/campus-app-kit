import { getBffBaseUrl } from "../utils/env";
import { fetchJsonWithTimeout } from "../utils/fetchHelpers";
import { ApiErrorException, parseApiError } from "./errors";
import { withRetry } from "./retry";

const DEFAULT_TIMEOUT_MS = 10_000;

export async function getJson<T>(
  path: string,
  parse?: (data: unknown) => T,
  options?: { signal?: AbortSignal }
): Promise<T> {
  const url = `${getBffBaseUrl()}${path}`;
  const data = await withRetry(async () => {
    try {
      return await fetchJsonWithTimeout<unknown>(url, { signal: options?.signal });
    } catch (err) {
      const anyErr = err as { status?: number; code?: string };
      if (typeof anyErr?.status === "number") {
        throw new ApiErrorException({
          status: anyErr.status,
          code: typeof anyErr.code === "string" ? anyErr.code : "unknown_error",
          message: err instanceof Error ? err.message : "Request failed"
        });
      }
      throw err;
    }
  });

  return parse ? parse(data) : (data as T);
}

export async function getJsonResponse<T>(
  path: string,
  parse?: (data: unknown) => T,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<{ data: T; response: Response }> {
  const url = `${getBffBaseUrl()}${path}`;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const { data, response } = await withRetry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    if (options?.signal) {
      options.signal.addEventListener("abort", () => controller.abort(), {
        once: true
      });
    }

    try {
      const response = await fetch(url, { signal: controller.signal });
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = undefined;
      }
      if (!response.ok) {
        throw new ApiErrorException(parseApiError(response, body));
      }
      return { data: parse ? parse(body) : (body as T), response };
    } finally {
      clearTimeout(timeoutId);
    }
  });

  return { data, response };
}
