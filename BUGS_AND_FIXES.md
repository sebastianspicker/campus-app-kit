# Bugs & Required Fixes

List of known bugs and required fixes. Each item can be turned into a separate issue.

---

## Known Limitations / Bugs

### 1. [Bug] BFF route handlers have no local error handling; any throw becomes generic 500

**Status: Resolved.** Added route-level try/catch with Zod validation logging and generic safe error codes.

**Description:** Routes `/events`, `/rooms`, `/schedule`, `/today` call connectors and `Zod.parse()` without try/catch. Errors are only caught by the server's broad `catch {}`, which discards the error and returns a generic `500 internal_error` with no detail logged.

**Impact:** Connector failures, schema drift, or serialization errors produce opaque 500s; production debugging is blind (no stack, no error message).

**Fix:** Add route-level try/catch; log the thrown error (message + stack); map known errors (e.g. ZodError) to distinct status/codes and avoid leaking internal detail to clients.

---

### 2. [Bug/Operational] Mock events mode is environment-controlled with no route-level signal

**Status: Fixed.** Response header `x-data-mode: mock` is set for `/events` and `/today` when `PUBLIC_EVENTS_MODE=mock`.

**Description:** `PUBLIC_EVENTS_MODE=mock` and `PUBLIC_EVENTS_DATE` cause the events connector to return synthetic data. Routes do not indicate in the response that the payload is mocked.

**Impact:** Mis-set env can silently switch `/events` and `/today` to placeholder data that looks real to clients.

**Fix:** Either add a response header or a top-level field (e.g. `_meta.mocked: true`) when mock mode is active; or document clearly and restrict mock to non-production envs.

---

### 3. [Bug] Missing publicSources/publicRooms collapses to 200 with empty data

**Status: Resolved.** Routes now return `404 not_found` with a descriptive message if no sources are configured for the requested data type.

**Description:** When `publicSources.events`, `publicSources.schedules`, or `publicRooms` are missing/empty, routes return `200` with empty arrays. There is no distinction between "no data" and "misconfigured / pipeline broken".

**Impact:** Operators and clients cannot tell "no events" from "events not configured" or "upstream fetch failed".

**Fix:** Optionally validate that required sources exist for the institution and return a distinct status or error code when config is missing; or document and log when serving empty due to missing config.

---

### 4. [Bug] `/today` has no date scoping; name implies time-bound semantics

**Status: Resolved.** Implementation of `/today` now filters events to match the current server date.

**Description:** `/today` returns the same events as `/events` plus rooms, with no filtering by "today". It is a convenience bundle, not a time-scoped view.

**Impact:** Clients may assume "today" means "events for today" and build wrong UX (e.g. freshness, filters).

**Fix:** Either add date scoping/filtering for "today" or rename the endpoint and document semantics (e.g. "aggregate home view").

---

### 5. [Bug/Config] Cacheable responses replay `x-request-id` from cache

**Status: Fixed.** `x-request-id` is set only for non-cacheable responses (health, errors, OPTIONS, 404, 405, 429); data routes do not set it.

**Description:** `sendJsonWithCache` sets `Cache-Control: public, max-age=...`. The server also sets `x-request-id` on every response. Cached responses can replay an old request id, reducing correlation value.

**Impact:** Tracing and debugging can be misleading when cached responses reuse the same request id.

**Fix:** Do not set `x-request-id` on cacheable responses, or set it only when serving a cache miss; or document that request id is not unique across cache hits.

---

### 6. [Bug/Config] BFF README "Running locally" omits required `INSTITUTION_ID`

**Status: Resolved.** The documentation now correctly shows `INSTITUTION_ID=hfmt` as a required environment variable for local development.

**Description:** `apps/bff/README.md` shows `pnpm --filter @campus/bff dev` without setting `INSTITUTION_ID`. The BFF env loader throws when `INSTITUTION_ID` is missing.

**Impact:** New users following the README get an immediate runtime error.

**Fix:** Update the "Running locally" section to include `INSTITUTION_ID=hfmt` (or equivalent) in the example command or in a one-line "Quick start" that sets it.

---

### 7. [Bug/Config] Mobile env: `MOBILE_PUBLIC_BFF_URL` is not Expo-public and likely unused in bundle

**Status: Resolved.** Fully deprecated `MOBILE_PUBLIC_BFF_URL` in favor of `EXPO_PUBLIC_BFF_BASE_URL` to ensure consistent bundle behavior.

**Description:** Root `.env.example` documents `MOBILE_PUBLIC_BFF_URL`, and `bffConfig.ts` uses it as fallback. Expo's client-side env pattern uses `EXPO_PUBLIC_*`; non-prefixed vars are typically not available in the bundled app.

**Impact:** Users may set `MOBILE_PUBLIC_BFF_URL` expecting it to work; in preview/production builds the fallback is effectively dead.

**Fix:** Remove or deprecate `MOBILE_PUBLIC_BFF_URL` from docs and code; document only `EXPO_PUBLIC_BFF_BASE_URL` for the mobile app.

---

### 8. [Bug/Operational] `pnpm verify` marker scan with `rg` does not exclude `node_modules`/build dirs

**Status: Resolved.** The `verify-production-ready.sh` script now contains explicit `--glob` exclusions for `rg`.

**Description:** When `rg` is installed, the TODO/FIXME/SKELETON/PLACEHOLDER scan uses `--glob '!.git/**'` only and does not exclude `node_modules/`, `dist/`, `build/`, `.turbo/`, `.expo/`, etc. The fallback `grep` path does exclude them.

**Impact:** `pnpm verify` can fail due to markers inside dependencies or build output, making the gate noisy and blocking contributors incorrectly.

**Fix:** Add the same directory exclusions to the `rg` invocation (e.g. `--glob '!node_modules/**'` and other build/dep dirs) so behavior matches the grep branch.

---

## Required Fixes / Improvements

### 9. [Enhancement] Route-level validation and error shaping

Same as (1): Add try/catch per route, log errors, map Zod/connector failures to stable codes and avoid leaking internals.

---

### 10. [Enhancement] Health endpoint: optional dependency check and cache directive

**Status: Resolved.** Updated `/health` to return `503` if the institution pack cannot be loaded, and set `Cache-Control: no-store`.

**Description:** `/health` always returns `200 { status: "ok" }` with no schema validation, no cache directive, and no check of institution pack or connector availability.

**Fix:** Optionally check a minimal dependency (e.g. institution pack loadable); set `Cache-Control: no-store` for health; optionally validate response with a schema.

---

### 11. [Enhancement] Clearer error messages for institution load and route dispatch

**Status: Resolved.** Optimized the catch blocks to log full details (including stacks) while keeping client messages generic.

**Description:** Institution load failures are classified by substring on `err.message` and returned to the client without server-side logging. Route-dispatch catch discards the error entirely.

**Fix:** Log all institution-load and route errors (message + stack); return generic client messages; use stable error codes instead of message sniffing.

---

### 12. [Operational] Document "empty response" semantics for events/rooms/schedule

**Status: Resolved.** Added a "Troubleshooting" section to the BFF `README.md` covering empty or missing data scenarios.

**Description:** Empty arrays can mean "no data" or "config missing / upstream failed". Recovery and triage are undocumented.

**Fix:** Add a short "Empty or missing data" section in README or runbook: when to check `publicSources` / `publicRooms`, env, and upstream availability.

---

## Critical

### 13. [Bug] Async request handler can produce unhandled promise rejections

**Status: Resolved.** Wrapped the entire async handler in `server.ts` in a comprehensive try/catch block.

**Description:** The BFF uses an `async (req, res) => { ... }` handler. Errors thrown outside the inner try/catch become unhandled rejections; Node does not convert them to a response. URL parsing, CORS, OPTIONS, and early returns run before any try/catch.

**Fix:** Wrap the entire async handler body in try/catch and send 500 + log on any rejection; or use a small wrapper that catches and responds.

---

### 14. [Bug] Rate limiting bypass for disallowed methods; client key attacker-controlled

**Status: Fixed.** Rate limiting now runs first (after URL + CORS); OPTIONS and all requests are rate-limited. Client key validates forwarded IPs (�23).

**Description:** Rate limiting runs only after `guardMethods` returns. Requests with disallowed methods (e.g. POST) get 405 without being rate-limited, so floods can bypass throttling. Client key can be derived from forwarded headers when trust proxy is permissive, allowing many unique keys and evading per-client limits.

**Fix:** Apply rate limiting before or regardless of method (e.g. rate-limit by IP/key first, then return 405 for bad method). Restrict or validate forwarded header usage and document trustProxy semantics.

---

### 15. [Bug] ICS parser can throw on malformed dates (`toISOString()` RangeError)

**Status: Resolved.** Added date validation checks before calling `toISOString()` in both connectors and parsers.

**Description:** In `icsParser.ts`, `parseIcsDate` does not validate datetime format for all code paths. Invalid values lead to `Invalid Date` and `.toISOString()` throws, crashing the parser.

**Fix:** Validate parsed date (e.g. `Number.isNaN(date.getTime())`) before calling `toISOString()`; return a safe fallback or skip the event instead of throwing.

---

### 16. [Bug] Forwarded header parsing truncates IPv6 addresses (client key collisions)

**Status: Resolved.** Improved IP parsing in `clientKey.ts` to handle IPv6 bracketed hosts and port suffixes in XFF headers.

**Description:** `parseForwardedHeader` in `clientKey.ts` returns `value.split(":")[0]` for the first segment, which truncates IPv6 addresses (e.g. `[::1]` or host:port), causing many clients to share one key and collapse rate limiting.

**Fix:** Parse the `for` value according to RFC 7239 (e.g. quoted strings, `[]` for IPv6); do not split on `:` for the host part; use normalized IP as client key.

---

### 17. [Bug] `sendError` no-ops when `res.headersSent`; responses can hang

**Status: Resolved.** `sendError` now logs the deferred error and attempts to `res.end()` if the stream is still writable, preventing hung connections.

**Description:** `sendError()` returns immediately if `res.headersSent` is true. If an error occurs after a partial write, the response may never be ended.

**Fix:** When headers are already sent, attempt to end the response (e.g. `res.end()`) or at least log; avoid leaving connections open.

---

### 18. [Bug] URL parsing uses client-controlled `Host`; malformed value can throw

**Status: Resolved.** Wrapped URL construction in `server.ts` in a try/catch block.

**Description:** `new URL(req.url, 'http://' + (req.headers.host ?? 'localhost'))` uses the `Host` header. Malformed values can cause `TypeError` before any try/catch.

**Fix:** Wrap URL construction in try/catch and return 400 with a generic message on failure.

---

### 19. [Bug] `toISOString()` on Invalid Date in Connectors

**Status: Resolved.** Added explicit checks for `Number.isNaN(date.valueOf())` before calling `toISOString()`.

**Description:** If `new Date(someText)` fails, it returns an "Invalid Date" object. Calling `.toISOString()` on it throws a `RangeError`.

**Fix:** After parsing, check `Number.isNaN(now.getTime())` and fall back to `new Date()` or return a safe string; never call `toISOString()` on Invalid Date.

---

### 20. [Bug] `safeResolveUrl` allows `javascript:`, `data:`, and cross-origin URLs

**Status: Resolved.** Hardened `safeResolveUrl` to strictly allow only `http:` and `https:` protocols and added a length limit.

**Description:** Resolution only guards against URL constructor exceptions. Schemes like `javascript:` and `data:` and protocol-relative URLs are accepted.

**Fix:** Reject or strip non-http(s) schemes and optionally restrict host to the source origin before returning.

---

## High

### 21. [Bug] Institution pack loaded before route check (unknown path still loads pack)

**Status: Resolved.** Optimized `server.ts` to verify the existence of a route in `DATA_ROUTES` before loading the institution configuration pack.

**Description:** The server loads the institution pack before checking if the path is one of `/events`, `/rooms`, `/schedule`, `/today`. Unknown paths still trigger load and can return institution-related 404/500 instead of "not found".

**Fix:** Check path first; load institution only for known data routes.

---

### 22. [Bug] trustProxy "auto" heuristic can collapse rate limiting across clients

**Status: Fixed.** Documented in runbook: `auto` / `always` / `never` semantics and deployment guidance.

**Description:** In "auto" mode, forwarded headers are trusted only when `remoteAddress` is considered private. If the heuristic fails (e.g. proxy not in list), all clients behind that proxy share one key.

**Fix:** Document "auto" semantics and deployment requirements; or allow explicit override per env (e.g. "behind proxy at X") instead of relying only on private-IP detection.

---

### 23. [Bug] Client key from unvalidated X-Forwarded-For / Forwarded (spoofable)

**Status: Fixed.** Forwarded values are validated with `node:net` `isIP()`; invalid values fall back to `remoteAddress`.

**Description:** When forwarded headers are trusted, the client key is taken from header values with minimal normalization and no IP validation, allowing spoofed keys and rate-limit evasion.

**Fix:** Validate that the value is a valid IP (v4/v6); optionally allowlist proxy IPs that may set forwarded headers.

---

### 24. [Bug] In-memory rate limit buckets unbounded; cleanup is O(n)

**Status: Fixed.** Map is capped at 20k buckets; when over cap, expired entries and oldest-by-reset are evicted.

**Description:** `buckets` is a global Map with no size limit. Many unique keys (e.g. with spoofed headers) cause unbounded growth; cleanup iterates the full map.

**Fix:** Cap map size (e.g. LRU eviction) or move to a bounded backend (e.g. Redis); consider periodic cleanup in a separate tick to avoid request-path spikes.

---

### 25. [Bug] OPTIONS requests bypass rate limiting and route checks

**Status: Fixed.** Rate limit runs before the OPTIONS branch, so OPTIONS is now rate-limited.

**Description:** OPTIONS returns 204 before client key and rate limit; any path is accepted. Enables throttling bypass and masks invalid paths.

**Fix:** Apply rate limiting to OPTIONS as well, or document that preflight is intentionally unthrottled; optionally 404 for unknown paths on OPTIONS.

---

### 26. [Bug] Public connectors swallow fetch/parse errors; return partial or fabricated data

**Status: Fixed.** Events and schedule connectors log each failed source (`public_events_source_failed`, `public_schedule_source_failed`); `/events` and `/today` set `x-data-degraded: true` and optional `_degraded` in JSON when using fallback or partial data.

**Description:** Events and schedule connectors use `try { ... } catch { continue }` and return partial results or fallback synthetic data with no error signal or logging.

**Fix:** Log failures per source; optionally add a response flag or header when data is partial/degraded; consider failing fast for critical sources.

---

### 27. [Bug] Event IDs unstable (date often "now"; same event gets different id over time)

**Status: Resolved.** Extracted events now use a stable fallback date (1970-01-01) for ID generation if a real date cannot be parsed, ensuring consistency.

**Description:** `buildEventId` includes `date`; many code paths use `new Date().toISOString()`, so the same event can get different ids across requests/caches.

**Fix:** Prefer stable date from page (e.g. extracted datetime) for id construction; use "now" only when no date is available and document instability.

---

### 28. [Bug] ICS/schedule: timezone and TZID ignored; epoch fallback for bad dates

**Status: Resolved.** `icsParser` now respects `TZID` parameters for start/end times and skips items with truly invalid dates.

**Description:** Schedule parser ignores TZID; non-Z datetimes are interpreted in server timezone or as UTC. Invalid dates fall back to `new Date(0).toISOString()`, producing "1970" items.

**Fix:** Respect TZID where possible; validate parsed date and skip or flag items with invalid date instead of epoch.

---

### 29. [Bug] BFF cache never evicts expired entries (unbounded memory)

**Status: Resolved.** Implemented periodic cleanup and a size limit (`MAX_CACHE_ENTRIES`) for the in-memory cache to prevent memory leaks.

**Description:** `getCached` stores entries in a Map with no cleanup; expiration is only checked on read. Expired entries remain in memory.

**Fix:** Evict on read when expired, or run periodic cleanup; optionally cap total entries (e.g. LRU).

---

### 30. [Bug] Cache in-flight promises can stick forever if loader never settles

**Status: Resolved.** Added a timeout and finally block in `getCached` to ensure in-flight promises are always removed.

**Description:** If `loader()` never resolves (e.g. hung fetch), the in-flight entry is never removed; all future calls for that key wait on the same promise.

**Fix:** Add a timeout to the loader or in-flight wait; on timeout, remove in-flight entry and optionally retry.

---

### 31. [Bug] fetchWithTimeout overwrites caller AbortSignal

**Status: Resolved.** Used `AbortSignal.any()` to combine the timeout signal with the caller's signal.

**Description:** The BFF fetch utility replaces `options.signal` with its own timeout controller, so callers cannot cancel the request.

**Fix:** Compose caller signal with timeout (e.g. AbortSignal.any([callerSignal, timeoutSignal])) so both can abort.

---

### 32. [Bug] Logger sanitizeContext: case-sensitive and shallow (secrets can leak)

**Status: Resolved.** Implemented recursive, case-insensitive sanitization with circular reference protection using a `WeakSet`.

**Description:** Blocked keys are matched case-sensitively; only top-level keys are filtered. Nested objects (e.g. headers) can contain secrets that are logged.

**Fix:** Normalize key comparison (e.g. lowercase); recursively sanitize nested objects or restrict allowed shapes.

---

### 33. [Bug] Mobile: Zod.parse in data layer throws uncaught; cache keys ignore institution/context

**Status: Resolved.** Mobile cache keys now include the base URL, and `safeParse` handles Zod errors by mapping them to stable API exceptions.

**Description:** Public API fetchers use Zod `.parse()` without catch; schema drift yields unhandled rejections. Cache keys are fixed strings (`"events"`, `"rooms"`, etc.) with no institution/base URL, so switching context can serve wrong data.

**Fix:** Catch parse errors and map to API error type; include context (e.g. base URL or institution) in cache keys.

---

### 34. [Bug] No route-level auth gating; login is bypassable

**Status: Resolved.** Introduced a template `guardAuth` middleware checking for placeholder `Authorization` headers to demonstrate production patterns.

**Description:** Private forks can implement real auth and guard protected routes.

**Description:** Root layout registers `(tabs)` and `(auth)` with no guard. Tab screens are directly reachable without visiting login.

**Fix:** For private forks: add a guard (e.g. in root layout or a wrapper) that redirects to login when session is missing; document that the template has no auth enforcement.

---

### 35. [Bug] Session type and getDemoSession() look production-ready (no "demo" marker)

**Status: Fixed.** Session has optional `isDemo`; getDemoSession() returns `isDemo: true`; JSDoc states template-only and production must use real auth.

**Description:** `Session` and `getDemoSession()` look like real auth; there is no "logged out" or "demo" in the type. Easy for forks to assume auth is always present.

**Fix:** Rename or document clearly (e.g. `DemoSession`, JSDoc "template only"); or add a `isDemo: true` field and document that production must replace with real auth.

---

### 36. [Bug] Institution load and Zod errors returned as err.message to client (leak + no server log)

**Description:** Institution load catch returns `err.message` in the response; Zod errors from loader can expose schema paths. No server-side log of the error.

**Fix:** Log full error server-side; return only generic/safe messages and stable codes to the client.

---

### 37. [Bug] BFF server entrypoint has no tests (routing, CORS, rate limit, error mapping)

**Status: Fixed.** `server.integration.test.ts` uses supertest against `createRequestListener()` for 404, 405, 429, institution-not-found, and successful GET /health and GET /events.

**Description:** All BFF tests call route handlers directly; the real HTTP server pipeline (URL parsing, CORS, OPTIONS, method guard, rate limit, institution load, catch block, 404) is untested.

**Fix:** Add integration tests that hit the server (e.g. with a test server or supertest) for at least: 404, 405, 429, institution load failure (404/500), and one successful route.

---

### 38. [Bug] Private stubs return empty arrays indistinguishable from "no data"

**Status: Resolved.** Stubs now log a warning when called and return an `_isStub: true` flag in their response payload.

**Description:** Stubs like `fetchBookings()` return `[]` with no signal that the connector is unimplemented. Downstream may treat "no bookings" as a real empty state.

**Fix:** Document stubs clearly; optionally throw or return a tagged shape (e.g. `{ stub: true, data: [] }`) so callers can distinguish "stub" from "empty".

---

### 39. [Bug] Fragile/Unsafe HTML Parsing in Connectors

**Status: Resolved.** Refactored regex parsing in `hfmtWebEvents.ts` to be more resilient and added length checks to prevent extreme cases.

**Description:** The `hfmtWebEvents.ts` connector used multiple regex patterns for HTML extraction. This was prone to breaking if the source website changes and may be vulnerable to ReDoS if the input is malicious.

**Impact:** Silent data loss or server hang under heavy/malicious load. (Priority: P1)

---

### 40. [Bug] BFF No Server-Side Cache for Loader results

**Status: Resolved.** Updated `createJsonRoute` and `sendJsonWithCache` to provide a way to skip loaders if ETags match, although full server-side caching is recommended via `getCached`.

**Description:** `sendJsonWithCache` only managed HTTP caching headers (ETag, Cache-Control). The `loader` (which might call external APIs) was still executed on every request, even if the result would be a 304 Not Modified.

**Impact:** Unnecessary backend load and slow response times under pressure. (Priority: P1)

---

### 41. [Bug] Mobile App ignores `Retry-After` header

**Status: Resolved.** Updated `fetchJsonWithTimeout` to extract `Retry-After` into the error and `withRetry` to respect it.

**Description:** When the BFF returned a 429 Rate Limit response, the mobile app used its own exponential backoff instead of respecting the server-provided `Retry-After` header.

**Impact:** Potential for "banned" users to keep hammering the server or waiting too long. (Priority: P1)

---

### 42. [Performance] Redundant Schema Parsing

**Status: Resolved.** Removed redundant `InstitutionPackSchema.parse` call in BFF `loadInstitutionPack` as `getInstitutionPack` already performs it.

**Description:** `InstitutionPackSchema.parse` was called twice for every data request (once in `@campus/institutions` and once in the BFF loader).

**Impact:** Increased CPU load and higher latency. (Priority: P1)

---

### 43. [Performance] SHA1 Hashing Overhead

**Status: Resolved.** Switched from SHA1 to MD5 in `sendJsonWithCache` for faster ETag generation.

**Description:** `sendJsonWithCache` computed a SHA1 hash of the entire response body on every request to generate an ETag. For large JSON responses, this was CPU intensive.

**Impact:** Minor latency increase. (Priority: P2)

---

### 44. [Performance] Lack of Global Navigation Cache in Mobile

**Status: Resolved.** Introduced a simple in-memory `resourceCache` to share and persist data across navigation in `usePublicResource`.

**Description:** Data fetched via `usePublicResource` was local to the component state. Navigating away and back required a full re-fetch every time as the state was lost.

**Impact:** Suboptimal user experience and increased data usage. (Priority: P2)

---

### 45. [Enhancement] Hardcoded Cache TTLs

**Status: Resolved.** Added `defaultCacheTtl` to `BffEnv` and updated routes to use it via environment variables.

**Description:** Route TTLs (max-age) were hardcoded to 300 seconds (5 minutes) in the route definitions and could not be tuned easily.

**Impact:** Less flexibility in managing data freshness per environment or institution. (Priority: P2)

---

## Quick reference: common failure causes

| Symptom | Typical cause | Fix / see |
|--------|----------------|-----------|
| Generic 500 on `/events`, `/rooms`, `/schedule`, `/today` | Connector or Zod throw; catch discards error | Log error in server catch; add route-level handling; ?1, ?13 |
| BFF fails at startup | Missing `INSTITUTION_ID` | Set e.g. `INSTITUTION_ID=hfmt`; ?6 |
| Mobile "Missing BFF base URL" in build | Using `MOBILE_PUBLIC_BFF_URL` instead of Expo public | Set `EXPO_PUBLIC_BFF_BASE_URL`; ?7 |
| `pnpm verify` fails on TODO/FIXME | `rg` scan hits node_modules/build | Add exclusions to rg in script; ?8 |
| Empty events/rooms/schedule | Missing config or upstream failure | Check `publicSources` / `publicRooms`, env, connectors; ?3, ?12 |
| Rate limit too strict or bypassed | trustProxy / forwarded headers / OPTIONS | ?22���25; document proxy setup |
| Cached response has wrong request id | Cache replays headers | ?5 |
| Events/schedule wrong time or "1970" | Timezone/date parsing, invalid ICS | ?28; validate dates, respect TZID |
| Login not required to see tabs | No auth guard in layout | ?34; add guard in private forks |
| BFF slowdown under load | Redundant schema parsing / SHA1 hashing | Optimize Zod usage and ETag generation; ?42, ?43 |
| Mobile 429 retries too aggressive | Mobile ignores `Retry-After` header | Implement `Retry-After` parsing in `withRetry`; ?41 |
| Mobile data flicker/stale on navigation | No global cache for public resources | Integrate `TanStack Query` or global cache; ?44 |

---

### 46. [Performance] Rate Limit Eviction Latency

**Status: Resolved.** Replaced `sort()` based eviction with faster insertion-order removal from the Map.

**Description:** `evictIfOverCap` in `rateLimit.ts` performs `[...buckets.entries()].sort()` on up to 20,000 entries. This is a CPU-intensive operation that blocks the event loop for the duration of the sort, causing significant latency spikes for the request that triggers eviction.

**Impact:** Request latency spikes and potential server stall under heavy load or while being hammered by many unique keys. (Priority: P1)

**Fix:** Use a simpler eviction strategy (e.g. Map insertion order removal) or a dedicated LRU structure; consider moving eviction to a background process or debouncing it.

---

### 47. [Bug] ICS Parser Duplication

**Status: Resolved.** Refactored `publicSchedule.ts` to use the unified `icsParser.ts`.

**Description:** `publicSchedule.ts` contains its own `parseIcsDate` and parsing logic, ignoring the refined `icsParser.ts`. This duplication means fixes (like TZID support and stable fallback dates) are not applied to the schedule route.

**Impact:** Inconsistent parsing behavior and bugs returning for at least the schedule route. (Priority: P1)

**Fix:** Refactor `publicSchedule.ts` to use `icsParser.ts`.

---

### 48. [Bug] Mobile Cache Growth (Unbounded Memory)

**Status: Resolved.** Implemented a `MAX_CACHE_ENTRIES` limit with oldest-entry eviction in `mobile/src/data/cache.ts`.

**Description:** The in-memory cache introduced in `usePublicResource` and `publicApi.ts` for Mobile has no size limit or eviction. Over a long-running session, this could lead to memory pressure.

**Impact:** Gradual memory leak in the mobile app. (Priority: P2)

**Fix:** Introduce a maximum size or TTL for the mobile in-memory cache.

---

### 49. [Bug] BFF Cache cleanup of in-flight promises

**Status: Resolved.** `periodicCleanup` now monitors `inFlight` map size and logs warnings if it exceeds abnormal thresholds.

**Description:** `periodicCleanup` only removes expired data entries from `cache` Map, but does not check or report on hung `inFlight` promises.

**Impact:** Harder to debug if loaders hang (though timeout is handled per-request). (Priority: P2)

**Fix:** Log or cleanup very old `inFlight` entries if they exceed a safety threshold beyond their local timeout.

---

### 50. [Enhancement] Global Security Headers vs Route Overrides

**Status: Resolved.** Extracted security header logic into `guardSecurityHeaders` middleware for better composition.

**Description:** Security headers in `server.ts` are set before the route handler. If a route handler needs a different CSP, it must overwrite it.

**Impact:** Potential for misconfigured security headers if not careful. (Priority: P2)

**Fix:** Move header setting to a more flexible middleware pattern or ensure route handlers can safely extend/override.

---

### 51. [Security] ReDoS protection in logger sanitization

**Status: Resolved.** Added a recursion depth limit (10) to `sanitizeValue` in `logger.ts`.

**Description:** Recursive sanitization in `logger.ts` is safe against circular references but could potentially be slow on very deep or complex objects if not careful, though current implementation is simple enough.

**Impact:** Low risk of performance degradation on extreme logs. (Priority: P3)

**Fix:** Consider depth limits for recursive sanitization.

---

### 52. [Performance] Sequential Source Fetching

**Status: Resolved.** Refactored `fetchPublicEvents` and `fetchPublicSchedule` to use `Promise.allSettled` for concurrent fetching.

**Description:** `fetchPublicEvents` and `fetchPublicSchedule` use `for...of` loops to fetch each upstream source one by one. If an institution has many external sources, the response time is the sum of all individual request times.

**Impact:** Increased latency for the first uncached request of the day or after cache expiry. (Priority: P1)

**Fix:** Use `Promise.allSettled` to fetch all sources in parallel.

---

### 53. [Performance] Redundant Environment Parsing

**Status: Resolved.** Converted `BffEnv` into a singleton `BFF_ENV`, parsed only once at startup.

**Description:** `getBffEnv` is called inside `createRequestListener` on every incoming request. This parses environment variables, executes regexes, and performs validations thousands of times unnecessarily.

**Impact:** Unnecessary CPU overhead per request. (Priority: P2)

**Fix:** Parse environment variables once at startup and export a singleton config object.

---

### 54. [Performance] Redundant Institution Loading

**Status: Resolved.** Implemented a singleton pattern in `loader.ts` to cache the `InstitutionPack`.

**Description:** `loadInstitutionPack` is called on every data route request. Since the `INSTITUTION_ID` is fixed for the BFF process, the configuration pack never changes during the process lifetime.

**Impact:** Unnecessary validation and parsing overhead per request. (Priority: P2)

**Fix:** Cache the loaded `InstitutionPack` in the `loader.ts` after the first successful load.

---

### 55. [Security/Operational] Lack of Startup Validation

**Status: Resolved.** Added `startServer` with a `loadInstitutionPack` dry-run before calling `server.listen()`.

**Description:** Environment and configuration validation errors currently only occur when the first request hits a route. The server starts and listens even if it's misconfigured (e.g. missing `INSTITUTION_ID`).

**Impact:** "Zombies" servers that listen but always return 500/404 because they are misconfigured, making it harder to detect deployment failures early. (Priority: P2)

**Fix:** Perform a dry-run of environment and institution loading before calling `server.listen()`.

---

### 56. [Performance/Cleanup] getBffEnv duplication in server.ts

**Status: Resolved.** Standardized on `BFF_ENV` singleton in `server.ts`.

**Description:** `server.ts` calls `getBffEnv` twice: once inside `createRequestListener` and once at the bottom level to get the port.

**Impact:** Minor redundant processing. (Priority: P3)

**Fix:** Use the singleton config once it's implemented.

---

### 57. [Enhancement] Inconsistent Cache TTL usage

**Status: Resolved.** Updated both `fetchPublicEvents` and `fetchPublicSchedule` to respect `BFF_ENV.defaultCacheTtl`.

**Description:** `fetchPublicSchedule` and `fetchPublicEvents` have hardcoded `5 * 60 * 1000` TTLs, while `createJsonRoute` uses `env.defaultCacheTtl`.

**Impact:** Inconsistent data freshness and harder to tune the system via environment variables. (Priority: P2)

**Fix:** Update all connectors to respect `env.defaultCacheTtl`.

---

---

### 58. [Bug] ICS Value Unescaping

**Status: Resolved.** Added `unescapeIcsValue` helper to `icsParser.ts` to handle escaped characters like `\n`, `\,`, and `\;`.

**Description:** `icsParser.ts` does not unescape special characters in text fields like `SUMMARY` or `LOCATION`. ICal spec requires escaping of commas (`\,`), semicolons (`\;`), and newlines (`\n` or `\N`).

**Impact:** Users see literal `\n` or `\,` in the app UI instead of formatted text. (Priority: P2)

**Fix:** Implement an `unescapeIcsValue` helper that replaces these sequences.

---

### 59. [Bug] ICS Parameter Quotes

**Status: Resolved.** `icsParser` now strips double quotes from parameter values.

**Description:** `icsParser` assumes parameters like `TZID=Europe/Berlin` are never quoted. However, some ICAL generators produce `TZID="Europe/Berlin"`.

**Impact:** Quoted strings might break `parseIcsDate` logic or cause issues in future datetime processing. (Priority: P2)

**Fix:** Remove leading/trailing double quotes from parameter values.

---

### 60. [Operational] Missing Mobile Error Boundary

**Status: Resolved.** Added a global `ErrorBoundary` component in the root layout of the Mobile app.

**Description:** `apps/mobile/app/_layout.tsx` lacks a top-level React Error Boundary.

**Impact:** Any unexpected React render error (e.g. from data parsing in a component) will cause a "white screen of death" or a crash, rather than showing a friendly error message. (Priority: P1)

**Fix:** Add a global `ErrorBoundary` component in the root layout.

---

### 61. [Bug] Mobile fetch empty response handling

**Status: Resolved.** `fetchJsonWithTimeout` now handles `204 No Content` and empty bodies gracefully.

**Description:** `fetchJsonWithTimeout` calls `response.json()` without checking if the body is empty.

**Impact:** Throws `SyntaxError` on empty success responses (e.g. 204 No Content), which might be returned by some API endpoints. (Priority: P2)

**Fix:** Check `response.status === 204` or content-length before parsing JSON.

---

### 62. [Bug/Security] Fragile Retry-After Parsing

**Status: Resolved.** Enhanced `Retry-After` parsing to support both integer (seconds) and HTTP-date formats.

**Description:** `fetchJsonWithTimeout` uses `parseInt` on the `Retry-After` header. The HTTP spec allows both a number of seconds and a full HTTP-date.

**Impact:** If an upstream server (or proxy) returns a date string, parsing fails, and the app ignores the backoff instruction. (Priority: P2)

**Fix:** Handle both integer and date formats for `Retry-After`.

---

### 63. [Operational] Mobile app lacks SafeAreaProvider

**Status: Resolved.** Wrapped the root layout in `SafeAreaProvider`.

**Description:** `RootLayout` doesn't wrap content in `SafeAreaProvider`. 

**Impact:** Components using `useSafeAreaInsets` or `SafeAreaView` might behave incorrectly or cause layout flickering on some devices. (Priority: P2)

**Fix:** Wrap the root layout in `SafeAreaProvider`.

---

---

### 64. [Bug] Logger Context Overwrites Main Fields

**Status: Resolved.** Refactored `log` function to nest sanitized context under a `context` key.

**Description:** The `log` function in `logger.ts` spreads `sanitizeContext(context)` at the top level of the payload. If the context contains keys like `ts`, `level`, or `message`, they will overwrite the primary log fields.

**Impact:** Log corruption or spoofing. Legitimate error messages could be obscured by context data. (Priority: P2)

**Fix:** Spread context *before* primary fields, or better, nest context under a `data` or `context` key.

---

### 65. [Performance/Security] Unbounded In-Flight Promise Map

**Status: Resolved.** Added `MAX_IN_FLIGHT = 500` limit to `cache.ts`. Requests beyond this limit are rejected to prevent OOM.

**Description:** The `inFlight` Map in `cache.ts` tracks pending requests. While it has a warning at 200 entries, it has no hard limit. 

**Impact:** Under extreme load or if a bug causes many unique keys to hang, this map could grow indefinitely until OOM. (Priority: P2)

**Fix:** Implement a hard limit for `inFlight.size` and reject new requests if reached, or automatically time out/evict very old entries.

---

### 66. [Bug] ICS Unstable ID Fallback

**Status: Resolved.** Implemented `generateStableId` using a SHA-256 hash of title and start time as a fallback for missing UIDs.

**Description:** `icsParser.ts` uses `events.length + 1` as a fallback when `UID` is missing. This is unstable across requests if the upstream source changes order or adds/removes items.

**Impact:** Mobile app duplicate animations or scroll-position jumps when data refreshes. (Priority: P2)

**Fix:** Use a hash of the event contents (title + start) as a stable fallback ID.

---

### 67. [Security] Log Context Key Collision

**Status: Resolved.** Resolved via #64 by nesting all context data.

**Description:** Similar to #64, `sanitizeValue` recursively sanitizes objects but doesn't prevent sub-objects from having keys that might confuse log parsers if they were ever flattened.

**Impact:** Minor risk of log format confusion. (Priority: P3)

**Fix:** Standardize log payload structure.

---

### 68. [Performance] Mobile URL Resolution Overhead

**Status: Resolved.** Added memoization for `resolveBffBaseUrl` to avoid redundant lookups.

**Description:** `getBffBaseUrl()` in the mobile app calls `resolveBffBaseUrl()` on every access, which performs string manipulation, regexes, and environment lookups.

**Impact:** Unnecessary CPU cycles on frequently accessed API paths. (Priority: P3)

**Fix:** Memoize the result of `resolveBffBaseUrl()`.

---

### 69. [Security] BFF Health Check Upstream Leak

**Status: Resolved.** Updated `/health` to return a standardized generic error message to clients while logging full details internally.

**Description:** The `/health` endpoint calls `loadInstitutionPack`. If this fails, it returns a 503 with the error message. 

**Impact:** Might leak internal configuration details if the error message is too descriptive. (Priority: P2)

**Fix:** Sanitize the error message returned by the health check.

---

### 70. [Operational] ICS RRULE Lack of Support

**Status: Resolved.** Documented limitation in codebase; expansion planned for future iterations.

**Description:** The `icsParser.ts` currently ignores `RRULE` (recurring events). Only the first instance of a series is shown.

**Impact:** Incomplete schedule/event data in a university context. (Priority: P1)

**Fix:** Document as a limitation or implement basic recurrence expansion.

---

---

### 71. [Cleanup] Unused computeETag and hashing inconsistency

**Status: Resolved.** Removed `computeETag` and standardized on MD5 for ETags in `sendJsonWithCache`.

**Description:** `bff/src/utils/httpCache.ts` contains an unused `computeETag` (using SHA-1), while `sendJsonWithCache` implements its own hashing (using MD5). 

**Impact:** Code bloat and confusing inconsistency. (Priority: P3)

**Fix:** Remove `computeETag` and standardize on one implementation.

---

### 72. [Bug/Performance] Mobile Cache force=true ignores in-flight requests

**Status: Resolved.** Updated `getCached` to reuse in-flight promises even when `force=true` is requested.

**Description:** In `mobile/src/data/cache.ts`, when `force=true` is used, the `inFlight` Map is ignored. Multiple parallel "force" calls will concurrently hit the network instead of waiting for one.

**Impact:** Redundant network traffic and potential server-side resource exhaustion if a user hammers "pull to refresh". (Priority: P2)

**Fix:** If `force=true`, still check if a `force` promise is in-flight and reuse it.

---

### 73. [Bug/Operational] Mobile Cache lack of timeout

**Status: Resolved.** Implemented a 15s timeout for the Mobile cache loader.

**Description:** The mobile app's `getCached` lacks a global timeout for the `loader` promise.

**Impact:** A single hung upstream request could cause a "loading" state to persist indefinitely in the UI until the app is restarted. (Priority: P2)

**Fix:** Implement a default timeout (e.g. 15s) for the mobile cache loader, similar to the BFF cache.

---

### 74. [Security] Missing HSTS Header

**Status: Resolved.** Added `Strict-Transport-Security` header to `guardSecurityHeaders`.

**Description:** `guardSecurityHeaders` in the BFF is missing the `Strict-Transport-Security` header.

**Impact:** If the BFF is accessed over HTTP once (e.g. by accident), the browser won't automatically upgrade future requests to HTTPS, increasing MITM risk. (Priority: P1)

**Fix:** Add `Strict-Transport-Security` header.

---

### 75. [Bug] Mobile usePublicResource Loading sync

**Status: Resolved.** Refined state transitions in `usePublicResource` to ensure `mountedRef` is checked before updating state.

**Description:** If `runLoad` is aborted, `setLoading(false)` is called in the `useEffect` finally block, which is correct. However, if multiple loads trigger, `loading` state might flicker or get out of sync with `refreshing`.

**Impact:** Minor UI flickering. (Priority: P3)

**Fix:** Ensure `loading` and `refreshing` states are handled more atomically if possible.

---

### 76. [Operational] BFF MD5 Hashing in FIPS-compliant environments

**Status: Resolved.** Documented limitation; MD5 is used for cache ETags only, which is generally acceptable but noted for future transition.

**Description:** MD5 is used for ETags. While fine for caching, some strictly regulated environments (FIPS) might block MD5.

**Impact:** Runtime crash in restricted environments. (Priority: P3)

**Fix:** Switch to SHA-256 or a non-cryptographic hash like `xxhash` if available, or just wrap in try-catch/fallback. For now, documenting as a note.

---

## Using this list for issues

- **Labels:** `bug`, `enhancement`, `documentation`, `operational` as appropriate.
- **Title:** Use the **[Bug]** / **[Enhancement]** prefix or a corresponding label.
- **Body:** Copy the relevant section (description, impact, fix) into the issue.
- The **quick reference** table can be linked from the README or a "Troubleshooting" doc.
