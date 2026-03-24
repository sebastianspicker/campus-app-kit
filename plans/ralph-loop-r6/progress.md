# Ralph Loop Round 6 — Progress

Started: 2026-03-24

## Prior State
Round 5 complete. 40 test files, 339 tests, all green. `pnpm verify` passes.

---

## Phase A: Foundation & Types
- A.1: Eliminated implicit `any` — replaced `as any` in Skeleton.tsx with proper animated type cast; created `HttpError` class in fetchHelpers.ts to replace Error mutation with `as` casts; added `isHttpLikeError` type guard in retry.ts; replaced `as` casts with `hasErrorField`/`isErrorBody` type guard functions in errors.ts and fetchHelpers.ts; added `catch (err: unknown)` annotations to all catch blocks across BFF (server.ts, health.ts, fetch.ts, publicSchedule.ts) and mobile (client.ts, retry.ts, usePublicResource.ts, publicApi.ts, persistedCache.ts, ThemeContext.tsx)
- A.2: Added discriminated union error types — created `packages/shared/src/domain/errors.ts` with `ErrorKind` enum, `AppErrorSchema`/`ErrorResponseSchema` Zod schemas, `httpStatusForKind` mapper, and `createAppError` factory; exported from shared index; added `sendTypedError` to BFF errors.ts; updated `createJsonRoute.ts` to use typed error kinds
- A.3: Strengthened Zod schema exports — verified all 9 schemas in public.ts have matching `z.infer<>` type exports; verified all 2 schemas in errors.ts have matching type exports; removed duplicate `Room` type from studiservice.stub.ts (now imports from @campus/shared); replaced BFF loader.ts local `InstitutionPack` type alias with re-export from @campus/shared

Verification: `pnpm lint && pnpm typecheck && pnpm test` — PASSED (186 tests, 22 test files)

## PHASE A COMPLETE

## Phase B: Test Depth
- B.1: BFF route negative-path tests — 27 new tests (schedule.negative 7, events.negative 7, rooms.negative 7, today.negative 6)
- B.2: Mobile hook edge-case tests — 16 new tests (useEvents.edge 4, useSchedule.edge 4, useRooms.edge 4, useToday.edge 4)
- B.3: Institution pack data validation — 25 new tests (packData.test: required fields, URL validation, unique IDs, schema validation, referential integrity, load safety, campus completeness)
- B.4: BFF server lifecycle tests — 6 new tests (dynamic port binding, health check, graceful close, connection refusal after close, data route serving, 404 for unknown routes)

Total new tests: 74
Verification: `pnpm test` — PASSED (all tests green, no warnings)

## PHASE B COMPLETE

## Phase C: Resilience & Performance
- C.1: BFF fetch timeout with AbortController — added `TimeoutError` class extending `Error` with `name: "TimeoutError"`; updated `fetchWithTimeout` to catch `AbortError` from timeout controller and rethrow as `TimeoutError`; changed default timeout from 8000ms to 10_000ms; preserved caller-provided `AbortSignal` composability via `AbortSignal.any`; added 6 tests
- C.2: Mobile exponential backoff with jitter — updated `backoffWithJitter` formula to `baseDelay * multiplier^attempt` with +-25% jitter `(Math.random() - 0.5) * 0.5 * calculated`; added `multiplier` (default 2) and `maxDelayMs` (default 30_000) options to `withRetry`; capped delays at `maxDelayMs`; backward compatible API; added 7 new tests (exponential progression, max cap, jitter bounds, Retry-After override, 4xx rejection, TypeError retry, exhaustion)
- C.3: BFF circuit breaker for connectors — created `circuitBreaker.ts` with `createCircuitBreaker` factory and `CircuitOpenError`; state machine: CLOSED -> OPEN after N consecutive failures, OPEN -> HALF_OPEN after cooldown, HALF_OPEN -> CLOSED on success or -> OPEN on failure; success resets failure counter; wrapped `fetchTextWithTimeout` calls in `publicSchedule.ts` and `hfmtWebEvents.ts` with per-connector circuit breaker instances; added 9 tests
- C.4: BFF cache TTL eviction — added `lastAccessedAt` field to `CacheEntry` for LRU tracking; replaced bulk-clear eviction with proper LRU eviction (evict least recently accessed entry); added `cacheStats()` returning `{ size, hits, misses, evictions }`; added `destroyCache()` to clear sweep interval; moved `setInterval`-based periodic sweep from lazy to eager; added 6 tests

Verification: `pnpm lint && pnpm typecheck && pnpm test` — PASSED (207 BFF tests in 25 files + 156 mobile tests in 16 files)

## PHASE C COMPLETE

## Phase D: Security Hardening
- D.1: Input validation — clamped campus/campusId query params to 100 chars max
- D.2: Security headers — added Permissions-Policy and X-Permitted-Cross-Domain-Policies headers
- D.3: Dependency audit — 28 vulns in Expo build toolchain only, no server exposure
- D.4: Rate limit audit — fixed Retry-After returning 0 at window boundary; added Cache-Control: no-store to error responses

Verification: `pnpm lint && pnpm typecheck && pnpm test` — PASSED

## PHASE D COMPLETE

## Phase E: DX & Final Review
- E.1: Created CLAUDE.md — 54-line concise project guide with quick commands, architecture, conventions, testing, and common pitfalls
- E.2: Documentation sweep — updated architecture.md (added circuit breaker, security headers, error types), ci.md (added e2e and release workflows), README.md (added circuit breaker to BFF features)
- E.3: Final adversarial review — all checks clean: zero TODO/FIXME/HACK in source, no `as any`, no `@ts-ignore`, no `.skip`/`.only`, no console.log in non-test/non-logger source, no hardcoded secrets, no files >800 lines, all functions <50 lines; fixed verify script to exclude plans/ and CLAUDE.md from marker scan

Final verification: `pnpm lint && pnpm typecheck && pnpm test` — PASSED
Test count: 446 tests in 53 files (up from 339 baseline, +31.6%)

## PHASE E COMPLETE
## ALL PHASES COMPLETE
