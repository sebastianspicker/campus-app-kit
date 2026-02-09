type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const cleanupIntervalMs = 60_000;
let lastCleanup = 0;

export function checkRateLimit(
  key: string,
  options?: { limit?: number; windowMs?: number }
): { allowed: boolean; retryAfter: number } {
  const limit = options?.limit ?? 60;
  const windowMs = options?.windowMs ?? 60_000;
  const now = Date.now();
  maybeCleanup(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  const currentCount = existing.count;
  if (currentCount >= limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  buckets.set(key, { count: currentCount + 1, resetAt: existing.resetAt });
  return { allowed: true, retryAfter: 0 };
}

export function clearRateLimitBuckets(): void {
  buckets.clear();
  lastCleanup = 0;
}

export function getRateLimitSize(): number {
  return buckets.size;
}

function maybeCleanup(now: number): void {
  if (now - lastCleanup < cleanupIntervalMs) {
    return;
  }

  lastCleanup = now;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}
