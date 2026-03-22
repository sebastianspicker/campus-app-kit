# Phase 4.1: Unit Test Gaps

You are improving unit test coverage across the monorepo. Work through items ONE AT A TIME.

## Context

Test framework: Vitest 2.1.8. Tests use `describe`/`it`/`expect` from Vitest.
Test files are in `__tests__/` directories adjacent to source.

Current test inventory:
- BFF: 11 test files (connectors: 3, routes: 4, utils: 3, integration: 1)
- Mobile: 12+ test files (hooks: 4, UI: 6, utils: 2)
- Shared: 1 test file (publicSchemas)
- Institutions: 1 test file (packs)

## Audit Scope

### 1. BFF Missing Tests (Priority Order)
Write tests for these untested modules:

1. `apps/bff/src/middleware/authGuard.ts` — security-critical
   - Test: guard allows valid key, rejects invalid key, handles missing key
2. `apps/bff/src/utils/cors.ts` — security-critical
   - Test: correct headers for allowed origins, wildcard, preflight
3. `apps/bff/src/config/env.ts` — startup-critical
   - Test: default values, env var parsing, validation
4. `apps/bff/src/middleware/securityHeaders.ts`
   - Test: all headers are set, headers on error responses
5. `apps/bff/src/middleware/methodGuard.ts`
   - Test: allows GET, rejects POST/PUT/DELETE, handles OPTIONS
6. `apps/bff/src/utils/httpCache.ts`
   - Test: ETag generation, 304 responses, Cache-Control headers
7. `apps/bff/src/utils/errors.ts`
   - Test: error response format, status codes, no stack trace leakage
8. `apps/bff/src/connectors/public/eventId.ts`
   - Test: deterministic ID generation, edge cases

### 2. Mobile Missing Tests (Priority Order)
Write tests for these untested modules:

1. `apps/mobile/src/data/publicApi.ts` — data layer
   - Test: fetch functions, query parameter construction, error handling
2. `apps/mobile/src/api/retry.ts` — network resilience
   - Test: retry behavior, backoff, max retries, non-retryable errors
3. `apps/mobile/src/utils/dateFormat.ts` — user-facing
   - Test: format functions, locale handling, edge cases (midnight, year boundaries)
4. `apps/mobile/src/api/client.ts`
   - Test: getJson, error parsing, timeout handling
5. `apps/mobile/src/api/errors.ts`
   - Test: ApiErrorException construction and properties
6. `apps/mobile/src/data/cache.ts`
   - Test: cache hit/miss, TTL, eviction, in-flight dedup

### 3. Existing Test Quality
- Review existing tests for assertion quality (not just "doesn't throw")
- Check for missing edge cases (empty input, error conditions, boundary values)
- Verify tests are isolated (no shared state between tests)
- Check for flaky test patterns (timing-dependent, order-dependent)
- Verify mock patterns are consistent across the codebase

### 4. Test Infrastructure
- Check vitest config at root and per-workspace for consistency
- Verify test setup files properly initialize environment
- Check that test fixtures match current schema versions
- Verify coverage is configured (even if not enforced yet)

## Rules

- Follow existing test patterns in the codebase (check a working test file first)
- Use Vitest (`describe`, `it`, `expect`, `vi.fn()`, `vi.mock()`)
- Place tests in `__tests__/` directories next to the source file
- Name test files `[module].test.ts` or `[module].test.tsx`
- Test behavior, not implementation details
- Run `pnpm test` after adding each test file to verify it passes
- Update `progress.md` under `## Phase 4.1: Unit Test Gaps` after each item
- Work on ONLY ONE item per invocation

## Completion

When priority test gaps have been filled and all tests pass:

<promise>COMPLETE</promise>
