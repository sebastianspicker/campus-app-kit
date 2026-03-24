# Phase B: Test Depth

> Expand test coverage to catch regressions in under-tested areas.
> Runs in PARALLEL with Phase C (no shared file edits).

## Context Brief

Round 5 reached 40 test files / 339 tests. The adversarial pass covered ICS parsing and query params. Remaining gaps:
- Mobile hooks have tests but coverage is shallow (happy path only)
- BFF route handlers lack negative-path tests (malformed requests, timeouts)
- Institution packs have basic loading tests but no data validation tests
- Mobile UI components need accessibility and edge-case tests
- No test for the BFF server startup / graceful shutdown

## Sub-Phases

### B.1: BFF Route Negative-Path Tests

**Scope:** Add tests for error paths in each BFF route.

**Files to create/modify:**
- `apps/bff/src/routes/__tests__/schedule.negative.test.ts` — New
- `apps/bff/src/routes/__tests__/events.negative.test.ts` — New
- `apps/bff/src/routes/__tests__/rooms.negative.test.ts` — New
- `apps/bff/src/routes/__tests__/today.negative.test.ts` — New

**Test cases per route:**
- Invalid query parameters (wrong types, out of range)
- Missing required parameters
- Upstream connector failure (mock timeout / error)
- Unsupported HTTP methods (should return 405)
- Response shape matches Zod schema

**Acceptance criteria:**
- [ ] Each route has at least 5 negative-path tests
- [ ] All tests pass
- [ ] No changes to source code (test-only changes)

### B.2: Mobile Hook Edge-Case Tests

**Scope:** Expand hook tests beyond happy path.

**Files to modify:**
- `apps/mobile/src/hooks/__tests__/useSchedule.test.ts`
- `apps/mobile/src/hooks/__tests__/useEvents.test.ts`
- `apps/mobile/src/hooks/__tests__/useRooms.test.ts`
- `apps/mobile/src/hooks/__tests__/useToday.test.ts` (create if missing)

**Test cases per hook:**
- Network error handling
- Empty response arrays
- Stale cache behavior
- Concurrent refetch deduplication
- Unmount during pending fetch (no state update after unmount)

**Acceptance criteria:**
- [ ] Each hook has at least 3 new edge-case tests
- [ ] All tests pass with no warnings about state updates on unmounted components

### B.3: Institution Pack Data Validation Tests

**Scope:** Validate institution pack data integrity beyond loading.

**Files to create/modify:**
- `packages/institutions/src/__tests__/packData.test.ts` — New

**Test cases:**
- Every pack has required fields (name, url, connectors config)
- URLs are valid and use HTTPS
- Connector config references match available connectors
- No duplicate institution IDs
- Pack exports match the expected TypeScript interface

**Acceptance criteria:**
- [ ] All 3 institution packs validated
- [ ] Tests catch structural issues in pack data

### B.4: BFF Server Lifecycle Test

**Scope:** Test server startup and graceful shutdown.

**Files to create/modify:**
- `apps/bff/src/__tests__/lifecycle.test.ts` — New

**Test cases:**
- Server starts and listens on configured port
- Health endpoint responds during startup
- Graceful shutdown closes connections
- Server handles SIGTERM correctly

**Acceptance criteria:**
- [ ] Lifecycle tests pass
- [ ] No port conflicts with other tests (use dynamic port)

## Validation Gate

```bash
pnpm test
```

On success, append to `plans/ralph-loop-r6/progress.md`:
```
## PHASE B COMPLETE
```
