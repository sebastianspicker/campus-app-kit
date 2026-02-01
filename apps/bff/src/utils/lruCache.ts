export type LruOptions = {
  maxEntries: number;
};

type Entry<T> = {
  value: T;
  expiresAt?: number;
};

export function createLruCache(options: LruOptions): {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T, ttlMs?: number) => void;
  delete: (key: string) => void;
  clear: () => void;
} {
  const maxEntries = Math.max(1, options.maxEntries);
  const store = new Map<string, Entry<unknown>>();

  function touch(key: string, entry: Entry<unknown>): void {
    store.delete(key);
    store.set(key, entry);
  }

  function evictIfNeeded(): void {
    while (store.size > maxEntries) {
      const oldestKey = store.keys().next().value as string | undefined;
      if (!oldestKey) return;
      store.delete(oldestKey);
    }
  }

  return {
    get: <T>(key: string): T | undefined => {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        store.delete(key);
        return undefined;
      }
      touch(key, entry);
      return entry.value as T;
    },
    set: <T>(key: string, value: T, ttlMs?: number): void => {
      const expiresAt =
        typeof ttlMs === "number" && ttlMs > 0 ? Date.now() + ttlMs : undefined;
      store.set(key, { value, expiresAt });
      evictIfNeeded();
    },
    delete: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    }
  };
}
