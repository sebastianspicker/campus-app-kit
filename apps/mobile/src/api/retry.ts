export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { retries?: number; baseDelayMs?: number }
): Promise<T> {
  const retries = options?.retries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 250;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(err)) {
        throw err;
      }

      const retryAfterSeconds = isHttpLikeError(err) ? err.retryAfterInSeconds : undefined;
      const delay = typeof retryAfterSeconds === "number"
        ? retryAfterSeconds * 1000
        : backoffWithJitter(baseDelayMs, attempt);
      await sleep(delay);
    }
  }
}

function isHttpLikeError(err: unknown): err is { status: number; retryAfterInSeconds?: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as Record<string, unknown>).status === "number"
  );
}

function shouldRetry(err: unknown): boolean {
  if (err instanceof Error && err.name === "AbortError") return false;

  if (isHttpLikeError(err)) {
    if (err.status === 429) return true;
    return err.status >= 500;
  }

  // Network errors often surface as TypeError in fetch.
  return err instanceof TypeError;
}

function backoffWithJitter(baseDelayMs: number, attempt: number): number {
  const exp = Math.min(6, attempt);
  const max = baseDelayMs * Math.pow(2, exp);
  return Math.floor(Math.random() * max);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
