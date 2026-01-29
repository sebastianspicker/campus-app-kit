/** Placeholder: Persistierter Cache für Offline-Resilienz */

export async function getPersistedCache<T>(key: string): Promise<T | null> {
  // TODO: AsyncStorage/SQLite o.ä. verwenden.
  throw new Error("TODO: Persistierten Cache implementieren");
}

export async function setPersistedCache<T>(key: string, value: T): Promise<void> {
  throw new Error("TODO: Persistierten Cache speichern");
}

export async function clearPersistedCache(key?: string): Promise<void> {
  throw new Error("TODO: Persistierten Cache löschen");
}
