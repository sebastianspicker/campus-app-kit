# Phase 4.2: Integration Tests

You are improving integration test coverage. Work through items ONE AT A TIME.

## Context

The BFF has an integration test at `apps/bff/src/server.integration.test.ts` that tests the full HTTP request/response cycle. The mobile app currently has no integration-level tests for the data pipeline.

## Audit Scope

### 1. BFF Integration Test Review
Review `apps/bff/src/server.integration.test.ts`:
- Does it cover all routes? (`/health`, `/events`, `/rooms`, `/schedule`, `/today`)
- Does it test error paths? (invalid routes, bad query params, server errors)
- Does it test middleware behavior? (CORS headers, security headers, rate limiting)
- Does it test cache behavior? (ETag, 304 responses, Cache-Control)
- Does it test with a real institution pack loaded?

### 2. Missing BFF Integration Tests
Add integration tests for untested scenarios:
- Rate limiting: verify requests are throttled after limit
- CORS: verify correct headers on preflight and actual requests
- Security headers: verify all headers present on every response type
- Auth guard: verify rejection of unauthorized requests (when enabled)
- Query parameter edge cases: empty search, invalid dates, negative offset
- Connector failure: verify graceful degradation when upstream sources fail
- Concurrent requests: verify no state corruption

### 3. Test Fixture Accuracy
- Check `apps/bff/src/__fixtures__/` for stale test data
- Verify fixture schemas match current Zod schemas in `@campus/shared`
- Check ICS fixtures for valid RFC 5545 format
- Check HTML fixtures match the actual format of target websites

### 4. Mobile Data Pipeline Integration
Consider adding integration tests for the mobile data path:
- Hook → publicApi → client → (mocked BFF server) cycle
- Verify Zod validation at the client boundary catches schema mismatches
- Test offline cache fallback when network is unavailable
- Test retry behavior on transient failures

Document what makes sense to test at the integration level vs what's covered by unit tests.

## Key Files

- `apps/bff/src/server.integration.test.ts`
- `apps/bff/src/__tests__/setup.ts`
- `apps/bff/src/__fixtures__/` (ICS, JSON, HTML samples)
- `apps/mobile/src/hooks/__tests__/testUtils.tsx`

## Rules

- Read existing integration tests before writing new ones
- Integration tests should test the full request/response cycle, not individual functions
- Use actual HTTP requests against the server listener (not mocked handlers)
- Clean up state between tests (reset caches, rate limiters)
- Run `pnpm test` after each new test to verify it passes
- Update `progress.md` under `## Phase 4.2: Integration Tests` after each item
- Work on ONLY ONE item per invocation

## Completion

When integration test coverage is comprehensive and all tests pass:

<promise>COMPLETE</promise>
