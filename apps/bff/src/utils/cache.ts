type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

const DEFAULT_IN_FLIGHT_TIMEOUT_MS = 25_000;

function timeoutPromise<T>(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Cache loader timeout")), ms);
  });
}

export async function getCached<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs: number,
  options?: { inFlightTimeoutMs?: number }
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (entry) {
    if (entry.expiresAt > now) return entry.value;
    cache.delete(key);
  }

  const existing = inFlight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const inFlightTimeoutMs = options?.inFlightTimeoutMs ?? DEFAULT_IN_FLIGHT_TIMEOUT_MS;
  const promiseRef: { current: Promise<unknown> | null } = { current: null };
  const promise = (async (): Promise<T> => {
    try {
      const value = await Promise.race([
        loader(),
        timeoutPromise<T>(inFlightTimeoutMs)
      ]);
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    } finally {
      if (inFlight.get(key) === promiseRef.current) inFlight.delete(key);
    }
  })();
  promiseRef.current = promise;
  inFlight.set(key, promise);
  return promise as Promise<T>;
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
    inFlight.delete(key);
    return;
  }

  cache.clear();
  inFlight.clear();
}
