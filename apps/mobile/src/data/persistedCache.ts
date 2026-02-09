type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  getAllKeys?: () => Promise<readonly string[]>;
  multiRemove?: (keys: readonly string[]) => Promise<void>;
};

const KEY_PREFIX = "campus-app-kit:";
const memory = new Map<string, string>();

async function getStorage(): Promise<StorageLike> {
  try {
    const mod = await import("@react-native-async-storage/async-storage");
    const candidate = (mod as { default?: unknown }).default ?? mod;
    if (
      candidate &&
      typeof candidate === "object" &&
      typeof (candidate as StorageLike).getItem === "function"
    ) {
      return candidate as StorageLike;
    }
  } catch {
    // fall back to in-memory storage (useful for tests and web)
  }

  return {
    getItem: async (key) => memory.get(key) ?? null,
    setItem: async (key, value) => {
      memory.set(key, value);
    },
    removeItem: async (key) => {
      memory.delete(key);
    },
    getAllKeys: async () => [...memory.keys()],
    multiRemove: async (keys) => {
      for (const key of keys) memory.delete(key);
    }
  };
}

export async function getPersistedCache<T>(key: string): Promise<T | null> {
  const storage = await getStorage();
  const raw = await storage.getItem(KEY_PREFIX + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setPersistedCache<T>(key: string, value: T): Promise<void> {
  const storage = await getStorage();
  await storage.setItem(KEY_PREFIX + key, JSON.stringify(value));
}

export async function clearPersistedCache(key?: string): Promise<void> {
  const storage = await getStorage();

  if (key) {
    await storage.removeItem(KEY_PREFIX + key);
    return;
  }

  const allKeys = await storage.getAllKeys?.();
  if (!allKeys || allKeys.length === 0) return;

  const ours = allKeys.filter((k) => k.startsWith(KEY_PREFIX));
  if (ours.length === 0) return;

  if (storage.multiRemove) {
    await storage.multiRemove(ours);
    return;
  }

  await Promise.all(ours.map((k) => storage.removeItem(k)));
}
