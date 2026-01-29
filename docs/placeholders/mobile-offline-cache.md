# Placeholder: Offline cache & resilience

**Why this is missing**
- Hooks and `publicApi` use only in-memory cache; there is no persisted offline cache or stale-while-revalidate behavior.

**TODO**
- Implement a persisted cache layer (AsyncStorage/SQLite) (`apps/mobile/src/data/persistedCache.ts`).
- Consolidate resource hooks on `usePublicResource()` (abort, refresh, offline).
- Add clear offline/retry UI states to screens.
