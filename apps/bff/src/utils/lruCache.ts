// Placeholder: LRU cache for production (server-cache-lru)
// TODO:
// - Replace Map-based cache with LRU (bounded size)
// - Add TTL per entry
// - Consider cross-instance cache (Redis) if needed

export type LruOptions = {
  maxEntries: number;
};

export function createLruCache(_options: LruOptions) {
  throw new Error("TODO: createLruCache implementieren");
}

