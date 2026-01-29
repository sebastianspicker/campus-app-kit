// Placeholder: retry/backoff strategy for mobile API calls
// TODO:
// - Exponential backoff with jitter
// - AbortController integration
// - Do not retry on 4xx (except 429)

export async function withRetry<T>(
  _fn: () => Promise<T>,
  _options?: { retries?: number; baseDelayMs?: number }
): Promise<T> {
  throw new Error("TODO: withRetry implementieren");
}
