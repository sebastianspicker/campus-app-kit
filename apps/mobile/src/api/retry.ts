export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { retries?: number; baseDelayMs?: number; multiplier?: number; maxDelayMs?: number }
): Promise<T> {
  const retries = options?.retries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 250;
  const multiplier = options?.multiplier ?? 2;
  const maxDelayMs = options?.maxDelayMs ?? 30_000;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(err)) {
        throw err;
      }

      const retryAfterSeconds = (err as { retryAfterInSeconds?: number }).retryAfterInSeconds;
      const delay = typeof retryAfterSeconds === "number"
        ? retryAfterSeconds * 1000
        : backoffWithJitter(baseDelayMs, attempt, multiplier, maxDelayMs);
      await sleep(delay);
    }
  }
}

function shouldRetry(err: unknown): boolean {
  const anyErr = err as { name?: unknown; status?: unknown };
  if (anyErr && anyErr.name === "AbortError") return false;

  const status = typeof anyErr?.status === "number" ? anyErr.status : null;
  if (status === 429) return true;
  if (status !== null) return status >= 500;

  // Network errors often surface as TypeError in fetch.
  return err instanceof TypeError;
}

function backoffWithJitter(
  baseDelayMs: number,
  attempt: number,
  multiplier: number,
  maxDelayMs: number
): number {
  const exp = Math.min(6, attempt);
  const calculated = baseDelayMs * Math.pow(multiplier, exp);
  // +-25% jitter: random in [-0.25, +0.25]
  const jitterFactor = (Math.random() - 0.5) * 0.5;
  const withJitter = calculated + jitterFactor * calculated;
  return Math.min(Math.floor(withJitter), maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
