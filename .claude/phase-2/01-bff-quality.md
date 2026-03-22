# Phase 2.1: BFF Code Quality

You are auditing the BFF server code for quality issues. Work through items ONE AT A TIME.

## Context

The BFF (`apps/bff/`) is a raw Node.js HTTP server (no Express/Hono) with:
- Request routing in `server.ts`
- Route handlers in `routes/`
- Public data connectors in `connectors/public/`
- Private connector stubs in `connectors/private-stubs/`
- Middleware: CORS, auth guard, security headers, method guard
- Utilities: cache, rate limiting, fetch, query params, logging

## Audit Scope

### 1. Function Complexity
- `createRequestListener` in `server.ts` is ~100 lines — can route dispatch be extracted?
- Check all route handler functions for length (>40 lines is a flag)
- Look for deeply nested conditionals that can be flattened with early returns
- Check `hfmtWebEvents.ts` HTML parsing — is the function doing too much?

### 2. Magic Numbers & Constants
- `8` (max events per source), `200` (title length cap), `1000` (max cache entries), `20_000` (rate limit buckets) — should these be named constants?
- Check timeout values in `fetch.ts` — are they documented?
- Check pagination defaults in `queryParams.ts`
- Look for any unlabeled numeric literals in route handlers

### 3. Error Handling Consistency
- Verify all error paths use `sendError()` from `utils/errors.ts`
- Check that `requestId` header is set on all responses (including errors)
- Verify error responses never leak stack traces or internal details
- Check for swallowed errors (empty `catch {}` blocks)
- Verify `fetchTextWithTimeout` properly cleans up AbortController timer on all paths

### 4. Node.js Patterns
- Check for proper stream/response cleanup in error paths (no leaked sockets)
- Verify `cache.ts` and `rateLimit.ts` memory management under load (eviction thresholds)
- Check if `setInterval` or `setTimeout` is used and properly cleaned up
- Verify no event listener leaks (`.on()` without `.off()`)

### 5. HTML Parsing Robustness
- `hfmtWebEvents.ts` uses regex for HTML extraction — document fragility
- Check regex patterns for ReDoS vulnerability (catastrophic backtracking)
- Verify defensive checks for malformed HTML input
- Check if the date/time extraction handles timezone edge cases

### 6. Query Parameter Edge Cases
- `queryParams.ts` filter parsing: empty strings, whitespace-only values, special characters
- Verify `limit` and `offset` handle negative values, NaN, Infinity
- Check `search` parameter for injection vectors (used in `filterHelpers.ts`)
- Verify date range parameters handle invalid date strings

## Key Files

- `apps/bff/src/server.ts`
- `apps/bff/src/routes/events.ts`, `rooms.ts`, `schedule.ts`, `today.ts`, `health.ts`
- `apps/bff/src/connectors/public/hfmtWebEvents.ts`, `icsParser.ts`, `publicSchedule.ts`
- `apps/bff/src/utils/cache.ts`, `rateLimit.ts`, `fetch.ts`, `queryParams.ts`, `filterHelpers.ts`
- `apps/bff/src/utils/errors.ts`, `logger.ts`, `requestId.ts`, `cors.ts`, `httpCache.ts`
- `apps/bff/src/middleware/authGuard.ts`, `methodGuard.ts`, `securityHeaders.ts`
- `apps/bff/src/config/env.ts`, `loader.ts`

## Rules

- Read actual files before making any judgment
- Fix issues directly when the fix is clear and safe
- For risky or ambiguous changes, document as a finding
- Update `progress.md` under `## Phase 2.1: BFF Code Quality` after each item
- Work on ONLY ONE item per invocation

## Completion

When all BFF source files have been reviewed and issues addressed:

<promise>COMPLETE</promise>
