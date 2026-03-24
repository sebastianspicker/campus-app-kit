# Sub-Phase C.4: BFF Cache TTL Eviction

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). The in-memory cache in `src/utils/cache.ts` has no TTL or size limits. Your task is to add bounded caching.

## Files to Modify
- `apps/bff/src/utils/cache.ts`

## Files to Create
- `apps/bff/src/utils/__tests__/cache.ttl.test.ts`

## Implementation
```typescript
interface CacheConfig {
  readonly defaultTtlMs: number;   // default: 300_000 (5 min)
  readonly maxEntries: number;     // default: 1000
  readonly sweepIntervalMs: number; // default: 60_000 (1 min)
}

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;      // Date.now() + ttlMs
  lastAccessedAt: number;          // for LRU eviction
}
```

Key behaviors:
- **TTL**: Entries expire after `defaultTtlMs`. Check on read (lazy).
- **Max entries**: When at capacity, evict LRU entry before inserting.
- **Periodic sweep**: Every `sweepIntervalMs`, remove all expired entries.
- **Stats**: Expose `cache.stats()` returning `{ size, hits, misses, evictions }`.
- **Cleanup**: Expose `cache.destroy()` to clear sweep interval (for tests).

## Test Cases
1. Fresh entry is readable
2. Entry becomes unreadable after TTL expires
3. LRU eviction when max entries reached
4. Periodic sweep removes expired entries
5. `stats()` reports correct hit/miss/eviction counts
6. `destroy()` clears sweep interval

## Rules
- Use `vi.useFakeTimers()` for TTL and sweep tests
- Immutability: config is readonly, internal state encapsulated
- Backward compatible: existing `get`/`set` API preserved
- TTL and max entries are optional config (defaults provided)
- Run `pnpm typecheck && pnpm test` after changes

## Acceptance Criteria
- [ ] Cache respects TTL
- [ ] LRU eviction works
- [ ] All existing cache tests still pass
- [ ] New tests pass
- [ ] `pnpm verify` passes
