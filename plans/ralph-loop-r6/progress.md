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
