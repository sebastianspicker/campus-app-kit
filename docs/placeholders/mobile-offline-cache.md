# Offline cache and resilience

The mobile app ships:

- In-memory cache for short-lived data (`apps/mobile/src/data/cache.ts`)
- Optional persisted cache layer using AsyncStorage (`apps/mobile/src/data/persistedCache.ts`)
- Shared resource hook with cancellation + refresh (`apps/mobile/src/hooks/usePublicResource.ts`)
