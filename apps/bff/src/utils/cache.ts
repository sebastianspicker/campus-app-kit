import { log } from "./logger";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

const DEFAULT_IN_FLIGHT_TIMEOUT_MS = 25_000;
const MAX_CACHE_ENTRIES = 1000;
const MAX_IN_FLIGHT = 500; // #65: Hard limit for memory safety
const CLEANUP_INTERVAL_MS = 60_000;

let lastCleanup = Date.now();

function evictIfOverCap(): void {
  if (cache.size <= MAX_CACHE_ENTRIES) return;
  const now = Date.now();
  // Simple strategy: remove expired first, then oldest entries if still over cap
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
    if (cache.size <= MAX_CACHE_ENTRIES * 0.8) break;
  }

  if (cache.size > MAX_CACHE_ENTRIES) {
    // If still over cap, just clear everything (simple and safe for memory)
    cache.clear();
  }
}

function periodicCleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) cache.delete(key);
  }

  // Safety check for stuck in-flight promises (leaked or hung upstream)
  if (inFlight.size > 0) {
    // If inFlight has 10x the max concurrent capacity, we might have a leak
    if (inFlight.size > 200) {
      log("warn", "cache_inflight_potentially_leaked", { count: inFlight.size });
    }
  }
}

function timeoutPromise(ms: number): Promise<never> {
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
  periodicCleanup();
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

  // #65: Enforce hard limit on concurrent loaders
  if (inFlight.size >= MAX_IN_FLIGHT) {
    log("error", "cache_inflight_limit_reached", { count: inFlight.size, key });
    throw new Error("Server busy: too many concurrent data requests");
  }

  const inFlightTimeoutMs = options?.inFlightTimeoutMs ?? DEFAULT_IN_FLIGHT_TIMEOUT_MS;
  const promiseRef: { current: Promise<unknown> | null } = { current: null };
  const promise = (async (): Promise<T> => {
    try {
      const value = await Promise.race([
        loader(),
        timeoutPromise(inFlightTimeoutMs)
      ]);
      evictIfOverCap();
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
