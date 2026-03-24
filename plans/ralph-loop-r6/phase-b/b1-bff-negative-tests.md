# Sub-Phase B.1: BFF Route Negative-Path Tests

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). Routes exist at `src/routes/`. Your task is to add negative-path tests for each route — invalid inputs, upstream failures, wrong HTTP methods.

## Files to Create
- `apps/bff/src/routes/__tests__/schedule.negative.test.ts`
- `apps/bff/src/routes/__tests__/events.negative.test.ts`
- `apps/bff/src/routes/__tests__/rooms.negative.test.ts`
- `apps/bff/src/routes/__tests__/today.negative.test.ts`

## Test Cases Per Route
1. Invalid query params (wrong type: `?limit=abc`, negative: `?offset=-1`)
2. Missing required params (if any)
3. Upstream connector timeout/error (mock the connector to throw)
4. Unsupported HTTP method (POST to a GET-only route → 405)
5. Response shape validation (response body matches Zod schema)

## Rules
- Use `supertest` for HTTP testing (already a dev dependency)
- Import the server/app from existing test setup patterns
- Mock connectors — do NOT hit real external services
- Each test file should be independent (no shared state between files)
- Do NOT modify source code — test-only changes
- Run `pnpm test` after creating each file

## Acceptance Criteria
- [ ] 4 new test files created
- [ ] At least 5 tests per file
- [ ] All tests pass
- [ ] `pnpm test` passes with no warnings
