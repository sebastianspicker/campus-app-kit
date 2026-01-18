import { getBffBaseUrl } from "../utils/env";

export async function getJson<T>(
  path: string,
  parse?: (data: unknown) => T
): Promise<T> {
  const url = `${getBffBaseUrl()}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  return parse ? parse(data) : (data as T);
}
