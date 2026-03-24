# Phase C: Resilience & Performance

> Harden runtime resilience and optimize performance bottlenecks.
> Runs in PARALLEL with Phase B (no shared file edits).

## Context Brief

The BFF uses hand-rolled HTTP caching, rate limiting, and fetch utilities. The mobile app has retry logic and an async-storage cache layer. Round 5 confirmed these work, but there are resilience gaps:
- BFF fetch utility lacks timeout enforcement
- Mobile retry logic doesn't implement exponential backoff
- No circuit breaker pattern for upstream connector failures
- BFF cache has no TTL-based eviction under memory pressure

## Sub-Phases

### C.1: BFF Fetch Timeout & Abort

**Scope:** Add AbortController-based timeouts to BFF fetch utility.

**Files to modify:**
- `apps/bff/src/utils/fetch.ts` — Add configurable timeout with AbortController

**Implementation:**
- Default timeout: 10 seconds (configurable per-call)
- Use `AbortController` + `setTimeout` pattern
- On timeout: throw typed `TimeoutError` (not generic Error)
- Clean up timer on success/failure

**Tests to add:**
- `apps/bff/src/utils/__tests__/fetch.timeout.test.ts` — New
  - Successful fetch within timeout
  - Fetch exceeding timeout throws TimeoutError
  - Abort signal propagation
  - Cleanup on success

**Acceptance criteria:**
- [ ] All existing fetch tests still pass
- [ ] Timeout tests pass
- [ ] `pnpm typecheck` passes

### C.2: Mobile Exponential Backoff

**Scope:** Upgrade mobile retry logic to exponential backoff with jitter.

**Files to modify:**
- `apps/mobile/src/api/retry.ts` — Implement exponential backoff

**Implementation:**
- Base delay: 1s, multiplier: 2x, max delay: 30s
- Add jitter (±25%) to prevent thundering herd
- Respect `Retry-After` header if present
- Max retries: 3 (configurable)
- Only retry on 5xx and network errors (not 4xx)

**Tests to modify:**
- `apps/mobile/src/api/__tests__/retry.test.ts` — Add backoff timing tests

**Acceptance criteria:**
- [ ] Backoff delays are exponential with jitter
- [ ] 4xx errors are NOT retried
- [ ] Retry-After header is respected
- [ ] All tests pass

### C.3: BFF Circuit Breaker for Connectors

**Scope:** Add a lightweight circuit breaker to prevent cascading failures when upstream connectors are down.

**Files to create:**
- `apps/bff/src/utils/circuitBreaker.ts` — New

**Files to modify:**
- `apps/bff/src/connectors/public/icsParser.ts` — Wrap in circuit breaker
- `apps/bff/src/connectors/public/hfmtWebEvents.ts` — Wrap in circuit breaker

**Implementation:**
- States: CLOSED (normal) → OPEN (failing) → HALF_OPEN (probing)
- Open after 5 consecutive failures
- Half-open after 30s cooldown
- Close after 1 successful probe
- When open: return cached stale data or typed `CircuitOpenError`

**Tests to create:**
- `apps/bff/src/utils/__tests__/circuitBreaker.test.ts` — New
  - State transitions: closed → open → half-open → closed
  - Failure counting and threshold
  - Cooldown timer behavior
  - Stale cache fallback

**Acceptance criteria:**
- [ ] Circuit breaker transitions work correctly
- [ ] Existing connector tests still pass
- [ ] No behavior change when upstreams are healthy

### C.4: BFF Cache TTL Eviction

**Scope:** Add TTL-based eviction to BFF in-memory cache to prevent unbounded growth.

**Files to modify:**
- `apps/bff/src/utils/cache.ts` — Add TTL and max-entries eviction

**Implementation:**
- Default TTL: 5 minutes (configurable)
- Max entries: 1000 (configurable)
- Eviction strategy: LRU when at max entries
- Lazy eviction: check TTL on read, periodic sweep every 60s
- Expose `cache.stats()` for monitoring

**Tests to create/modify:**
- `apps/bff/src/utils/__tests__/cache.ttl.test.ts` — New
  - Entries expire after TTL
  - LRU eviction at max entries
  - Stats reporting
  - Periodic sweep cleanup

**Acceptance criteria:**
- [ ] Cache respects TTL
- [ ] Memory stays bounded
- [ ] All existing cache tests still pass
- [ ] `pnpm verify` passes

## Validation Gate

```bash
pnpm verify
```

On success, append to `plans/ralph-loop-r6/progress.md`:
```
## PHASE C COMPLETE
```
