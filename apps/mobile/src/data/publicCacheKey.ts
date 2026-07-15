import { getBffBaseUrl } from "../utils/env";
import { getConfiguredInstitutionId } from "../config/institution";

export const PUBLIC_CACHE_SCHEMA_VERSION = 1;

function getSortedQueryString(queryParams?: Record<string, string>): string {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return "";
  }

  const sortedParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams).sort(([a], [b]) => a.localeCompare(b))) {
    sortedParams.append(key, value);
  }
  return sortedParams.toString();
}

export function getPublicCacheKey(suffix: string, queryParams?: Record<string, string>): string {
  try {
    // Include the BFF base URL so preview/prod/dev endpoints do not share
    // persisted responses when a tester switches environments.
    const base = `public:v${PUBLIC_CACHE_SCHEMA_VERSION}:${getBffBaseUrl()}:${getConfiguredInstitutionId()}:${suffix}`;
    const queryString = getSortedQueryString(queryParams);
    return queryString ? `${base}?${queryString}` : base;
  } catch {
    return `public:v${PUBLIC_CACHE_SCHEMA_VERSION}:${getConfiguredInstitutionId()}:${suffix}`;
  }
}
