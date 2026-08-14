/** Fetches typed BFF JSON with institution headers, timeouts, retries, and response metadata. */
import { getBffBaseUrl } from "../utils/env";
import { fetchJsonResponseWithTimeout } from "../utils/fetchHelpers";
import { getConfiguredInstitutionId } from "../config/institution";
import { ApiErrorException } from "./errors";
import { withRetry } from "./retry";

/** Delegates request, retry, validation, and institution checks, then unwraps the response payload. */
export async function getJson<T>(
  path: string,
  parse?: (data: unknown) => T,
  options?: { signal?: AbortSignal }
): Promise<T> {
  const result = await getJsonResult(path, parse, options);
  return result.data;
}

export type ApiJsonResult<T> = {
  data: T;
  institutionId: string | null;
};

/** Converts HTTP-shaped transport failures to the API exception used by retry and UI layers. */
function toApiErrorException(error: unknown): ApiErrorException | undefined {
  if (
    typeof error !== "object" ||
    error === null ||
    !("status" in error) ||
    typeof (error as Record<string, unknown>).status !== "number"
  ) {
    return undefined;
  }

  const details = error as Record<string, unknown>;
  return new ApiErrorException({
    status: details.status as number,
    code: typeof details.code === "string" ? details.code : "unknown_error",
    message: error instanceof Error ? error.message : "Request failed"
  });
}

/** Checks that a response belongs to the configured institution before exposing its data. */
function getResponseInstitutionId(response: { headers: Headers }): string | null {
  const institutionId = response.headers.get("x-institution-id");
  if (institutionId !== null && institutionId !== getConfiguredInstitutionId()) {
    throw new ApiErrorException({
      status: 409,
      code: "institution_mismatch",
      message: "App and data service institution IDs do not match"
    });
  }

  return institutionId;
}

/** Wraps the parsed payload with response metadata needed by callers. */
export async function getJsonResult<T>(
  path: string,
  parse?: (data: unknown) => T,
  options?: { signal?: AbortSignal }
): Promise<ApiJsonResult<T>> {
  const url = `${getBffBaseUrl()}${path}`;
  const response = await withRetry(
    () => fetchJsonResponseWithTimeout<unknown>(url, { signal: options?.signal })
      .catch((error: unknown) => {
        throw toApiErrorException(error) ?? error;
      }),
    { signal: options?.signal }
  );
  const institutionId = getResponseInstitutionId(response);

  return {
    data: parse ? parse(response.data) : (response.data as T),
    institutionId
  };
}
