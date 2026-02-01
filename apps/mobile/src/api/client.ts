import { getBffBaseUrl } from "../utils/env";
import { fetchJsonWithTimeout } from "../utils/fetchHelpers";
import { ApiErrorException, parseApiError } from "./errors";
import { withRetry } from "./retry";

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
  options?: { signal?: AbortSignal }
): Promise<{ data: T; response: Response }> {
  const url = `${getBffBaseUrl()}${path}`;
  const response = await fetch(url, { signal: options?.signal });

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
}
