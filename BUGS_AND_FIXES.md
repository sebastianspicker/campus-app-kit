# Bugs & Required Fixes

List of known bugs and required fixes. Each item can be turned into a separate issue.

---

## Known Limitations / Bugs

### 1. [Bug] BFF route handlers have no local error handling; any throw becomes generic 500

**Description:** Routes `/events`, `/rooms`, `/schedule`, `/today` call connectors and `Zod.parse()` without try/catch. Errors are only caught by the server's broad `catch {}`, which discards the error and returns a generic `500 internal_error` with no detail logged.

**Impact:** Connector failures, schema drift, or serialization errors produce opaque 500s; production debugging is blind (no stack, no error message).

**Fix:** Add route-level try/catch; log the thrown error (message + stack); map known errors (e.g. ZodError) to distinct status/codes and avoid leaking internal detail to clients.

---

### 2. [Bug/Operational] Mock events mode is environment-controlled with no route-level signal

**Description:** `PUBLIC_EVENTS_MODE=mock` and `PUBLIC_EVENTS_DATE` cause the events connector to return synthetic data. Routes do not indicate in the response that the payload is mocked.

**Impact:** Mis-set env can silently switch `/events` and `/today` to placeholder data that looks real to clients.

**Fix:** Either add a response header or a top-level field (e.g. `_meta.mocked: true`) when mock mode is active; or document clearly and restrict mock to non-production envs.

---

### 3. [Bug] Missing publicSources/publicRooms collapses to 200 with empty data

**Description:** When `publicSources.events`, `publicSources.schedules`, or `publicRooms` are missing/empty, routes return `200` with empty arrays. There is no distinction between "no data" and "misconfigured / pipeline broken".

**Impact:** Operators and clients cannot tell "no events" from "events not configured" or "upstream fetch failed".

**Fix:** Optionally validate that required sources exist for the institution and return a distinct status or error code when config is missing; or document and log when serving empty due to missing config.

---

### 4. [Bug] `/today` has no date scoping; name implies time-bound semantics

**Description:** `/today` returns the same events as `/events` plus rooms, with no filtering by "today". It is a convenience bundle, not a time-scoped view.

**Impact:** Clients may assume "today" means "events for today" and build wrong UX (e.g. freshness, filters).

**Fix:** Either add date scoping/filtering for "today" or rename the endpoint and document semantics (e.g. "aggregate home view").

---

### 5. [Bug/Config] Cacheable responses replay `x-request-id` from cache

**Description:** `sendJsonWithCache` sets `Cache-Control: public, max-age=...`. The server also sets `x-request-id` on every response. Cached responses can replay an old request id, reducing correlation value.

**Impact:** Tracing and debugging can be misleading when cached responses reuse the same request id.

**Fix:** Do not set `x-request-id` on cacheable responses, or set it only when serving a cache miss; or document that request id is not unique across cache hits.

---

### 6. [Bug/Config] BFF README "Running locally" omits required `INSTITUTION_ID`

**Description:** `apps/bff/README.md` shows `pnpm --filter @campus/bff dev` without setting `INSTITUTION_ID`. The BFF env loader throws when `INSTITUTION_ID` is missing.

**Impact:** New users following the README get an immediate runtime error.

**Fix:** Update the "Running locally" section to include `INSTITUTION_ID=hfmt` (or equivalent) in the example command or in a one-line "Quick start" that sets it.

---

### 7. [Bug/Config] Mobile env: `MOBILE_PUBLIC_BFF_URL` is not Expo-public and likely unused in bundle

**Description:** Root `.env.example` documents `MOBILE_PUBLIC_BFF_URL`, and `bffConfig.ts` uses it as fallback. Expo's client-side env pattern uses `EXPO_PUBLIC_*`; non-prefixed vars are typically not available in the bundled app.

**Impact:** Users may set `MOBILE_PUBLIC_BFF_URL` expecting it to work; in preview/production builds the fallback is effectively dead.

**Fix:** Remove or deprecate `MOBILE_PUBLIC_BFF_URL` from docs and code; document only `EXPO_PUBLIC_BFF_BASE_URL` for the mobile app.

---

### 8. [Bug/Operational] `pnpm verify` marker scan with `rg` does not exclude `node_modules`/build dirs

**Description:** When `rg` is installed, the TODO/FIXME/SKELETON/PLACEHOLDER scan uses `--glob '!.git/**'` only and does not exclude `node_modules/`, `dist/`, `build/`, `.turbo/`, `.expo/`, etc. The fallback `grep` path does exclude them.

**Impact:** `pnpm verify` can fail due to markers inside dependencies or build output, making the gate noisy and blocking contributors incorrectly.

**Fix:** Add the same directory exclusions to the `rg` invocation (e.g. `--glob '!node_modules/**'` and other build/dep dirs) so behavior matches the grep branch.

---

## Required Fixes / Improvements

### 9. [Enhancement] Route-level validation and error shaping

Same as (1): Add try/catch per route, log errors, map Zod/connector failures to stable codes and avoid leaking internals.

---

### 10. [Enhancement] Health endpoint: optional dependency check and cache directive

**Description:** `/health` always returns `200 { status: "ok" }` with no schema validation, no cache directive, and no check of institution pack or connector availability.

**Fix:** Optionally check a minimal dependency (e.g. institution pack loadable); set `Cache-Control: no-store` for health; optionally validate response with a schema.

---

### 11. [Enhancement] Clearer error messages for institution load and route dispatch

**Description:** Institution load failures are classified by substring on `err.message` and returned to the client without server-side logging. Route-dispatch catch discards the error entirely.

**Fix:** Log all institution-load and route errors (message + stack); return generic client messages; use stable error codes instead of message sniffing.

---

### 12. [Operational] Document "empty response" semantics for events/rooms/schedule

**Description:** Empty arrays can mean "no data" or "config missing / upstream failed". Recovery and triage are undocumented.

**Fix:** Add a short "Empty or missing data" section in README or runbook: when to check `publicSources` / `publicRooms`, env, and upstream availability.

---

## Critical

### 13. [Bug] Async request handler can produce unhandled promise rejections

**Description:** The BFF uses an `async (req, res) => { ... }` handler. Errors thrown outside the inner try/catch become unhandled rejections; Node does not convert them to a response. URL parsing, CORS, OPTIONS, and early returns run before any try/catch.

**Fix:** Wrap the entire async handler body in try/catch and send 500 + log on any rejection; or use a small wrapper that catches and responds.

---

### 14. [Bug] Rate limiting bypass for disallowed methods; client key attacker-controlled

**Description:** Rate limiting runs only after `guardMethods` returns. Requests with disallowed methods (e.g. POST) get 405 without being rate-limited, so floods can bypass throttling. Client key can be derived from forwarded headers when trust proxy is permissive, allowing many unique keys and evading per-client limits.

**Fix:** Apply rate limiting before or regardless of method (e.g. rate-limit by IP/key first, then return 405 for bad method). Restrict or validate forwarded header usage and document trustProxy semantics.

---

### 15. [Bug] ICS parser can throw on malformed dates (`toISOString()` RangeError)

**Description:** In `icsParser.ts`, `parseIcsDate` does not validate datetime format for all code paths. Invalid values lead to `Invalid Date` and `.toISOString()` throws, crashing the parser.

**Fix:** Validate parsed date (e.g. `Number.isNaN(date.getTime())`) before calling `toISOString()`; return a safe fallback or skip the event instead of throwing.

---

### 16. [Bug] Forwarded header parsing truncates IPv6 addresses (client key collisions)

**Description:** `parseForwardedHeader` in `clientKey.ts` returns `value.split(":")[0]` for the first segment, which truncates IPv6 addresses (e.g. `[::1]` or host:port), causing many clients to share one key and collapse rate limiting.

**Fix:** Parse the `for` value according to RFC 7239 (e.g. quoted strings, `[]` for IPv6); do not split on `:` for the host part; use normalized IP as client key.

---

### 17. [Bug] `sendError` no-ops when `res.headersSent`; responses can hang

**Description:** `sendError()` returns immediately if `res.headersSent` is true. If an error occurs after a partial write, the response may never be ended.

**Fix:** When headers are already sent, attempt to end the response (e.g. `res.end()`) or at least log; avoid leaving connections open.

---

### 18. [Bug] URL parsing uses client-controlled `Host`; malformed value can throw

**Description:** `new URL(req.url, 'http://' + (req.headers.host ?? 'localhost'))` uses the `Host` header. Malformed values can cause `TypeError` before any try/catch.

**Fix:** Wrap URL construction in try/catch and return 400 with a generic message on failure.

---

### 19. [Bug] Invalid `PUBLIC_EVENTS_DATE` can crash events connector via `toISOString()`

**Description:** `new Date(envDate)` for invalid env yields Invalid Date; `now.toISOString()` then throws and crashes the connector.

**Fix:** After parsing, check `Number.isNaN(now.getTime())` and fall back to `new Date()` or return a safe string; never call `toISOString()` on Invalid Date.

---

### 20. [Bug] `safeResolveUrl` allows `javascript:`, `data:`, and cross-origin URLs

**Description:** Resolution only guards against URL constructor exceptions. Schemes like `javascript:` and `data:` and protocol-relative URLs are accepted.

**Fix:** Reject or strip non-http(s) schemes and optionally restrict host to the source origin before returning.

---

## High

### 21. [Bug] Institution pack loaded before route check (unknown path still loads pack)

**Description:** The server loads the institution pack before checking if the path is one of `/events`, `/rooms`, `/schedule`, `/today`. Unknown paths still trigger load and can return institution-related 404/500 instead of "not found".

**Fix:** Check path first; load institution only for known data routes.

---

### 22. [Bug] trustProxy "auto" heuristic can collapse rate limiting across clients

**Description:** In "auto" mode, forwarded headers are trusted only when `remoteAddress` is considered private. If the heuristic fails (e.g. proxy not in list), all clients behind that proxy share one key.

**Fix:** Document "auto" semantics and deployment requirements; or allow explicit override per env (e.g. "behind proxy at X") instead of relying only on private-IP detection.

---

### 23. [Bug] Client key from unvalidated X-Forwarded-For / Forwarded (spoofable)

**Description:** When forwarded headers are trusted, the client key is taken from header values with minimal normalization and no IP validation, allowing spoofed keys and rate-limit evasion.

**Fix:** Validate that the value is a valid IP (v4/v6); optionally allowlist proxy IPs that may set forwarded headers.

---

### 24. [Bug] In-memory rate limit buckets unbounded; cleanup is O(n)

**Description:** `buckets` is a global Map with no size limit. Many unique keys (e.g. with spoofed headers) cause unbounded growth; cleanup iterates the full map.

**Fix:** Cap map size (e.g. LRU eviction) or move to a bounded backend (e.g. Redis); consider periodic cleanup in a separate tick to avoid request-path spikes.

---

### 25. [Bug] OPTIONS requests bypass rate limiting and route checks

**Description:** OPTIONS returns 204 before client key and rate limit; any path is accepted. Enables throttling bypass and masks invalid paths.

**Fix:** Apply rate limiting to OPTIONS as well, or document that preflight is intentionally unthrottled; optionally 404 for unknown paths on OPTIONS.

---

### 26. [Bug] Public connectors swallow fetch/parse errors; return partial or fabricated data

**Description:** Events and schedule connectors use `try { ... } catch { continue }` and return partial results or fallback synthetic data with no error signal or logging.

**Fix:** Log failures per source; optionally add a response flag or header when data is partial/degraded; consider failing fast for critical sources.

---

### 27. [Bug] Event IDs unstable (date often "now"; same event gets different id over time)

**Description:** `buildEventId` includes `date`; many code paths use `new Date().toISOString()`, so the same event can get different ids across requests/caches.

**Fix:** Prefer stable date from page (e.g. extracted datetime) for id construction; use "now" only when no date is available and document instability.

---

### 28. [Bug] ICS/schedule: timezone and TZID ignored; epoch fallback for bad dates

**Description:** Schedule parser ignores TZID; non-Z datetimes are interpreted in server timezone or as UTC. Invalid dates fall back to `new Date(0).toISOString()`, producing "1970" items.

**Fix:** Respect TZID where possible; validate parsed date and skip or flag items with invalid date instead of epoch.

---

### 29. [Bug] BFF cache never evicts expired entries (unbounded memory)

**Description:** `getCached` stores entries in a Map with no cleanup; expiration is only checked on read. Expired entries remain in memory.

**Fix:** Evict on read when expired, or run periodic cleanup; optionally cap total entries (e.g. LRU).

---

### 30. [Bug] Cache in-flight promises can stick forever if loader never settles

**Description:** If `loader()` never resolves (e.g. hung fetch), the in-flight entry is never removed; all future calls for that key wait on the same promise.

**Fix:** Add a timeout to the loader or in-flight wait; on timeout, remove in-flight entry and optionally retry.

---

### 31. [Bug] fetchWithTimeout overwrites caller AbortSignal

**Description:** The BFF fetch utility replaces `options.signal` with its own timeout controller, so callers cannot cancel the request.

**Fix:** Compose caller signal with timeout (e.g. AbortSignal.any([callerSignal, timeoutSignal])) so both can abort.

---

### 32. [Bug] Logger sanitizeContext: case-sensitive and shallow (secrets can leak)

**Description:** Blocked keys are matched case-sensitively; only top-level keys are filtered. Nested objects (e.g. headers) can contain secrets that are logged.

**Fix:** Normalize key comparison (e.g. lowercase); recursively sanitize nested objects or restrict allowed shapes.

---

### 33. [Bug] Mobile: Zod.parse in data layer throws uncaught; cache keys ignore institution/context

**Description:** Public API fetchers use Zod `.parse()` without catch; schema drift yields unhandled rejections. Cache keys are fixed strings (`"events"`, `"rooms"`, etc.) with no institution/base URL, so switching context can serve wrong data.

**Fix:** Catch parse errors and map to API error type; include context (e.g. base URL or institution) in cache keys.

---

### 34. [Bug] No route-level auth gating; login is bypassable

**Description:** Root layout registers `(tabs)` and `(auth)` with no guard. Tab screens are directly reachable without visiting login.

**Fix:** For private forks: add a guard (e.g. in root layout or a wrapper) that redirects to login when session is missing; document that the template has no auth enforcement.

---

### 35. [Bug] Session type and getDemoSession() look production-ready (no "demo" marker)

**Description:** `Session` and `getDemoSession()` look like real auth; there is no "logged out" or "demo" in the type. Easy for forks to assume auth is always present.

**Fix:** Rename or document clearly (e.g. `DemoSession`, JSDoc "template only"); or add a `isDemo: true` field and document that production must replace with real auth.

---

### 36. [Bug] Institution load and Zod errors returned as err.message to client (leak + no server log)

**Description:** Institution load catch returns `err.message` in the response; Zod errors from loader can expose schema paths. No server-side log of the error.

**Fix:** Log full error server-side; return only generic/safe messages and stable codes to the client.

---

### 37. [Bug] BFF server entrypoint has no tests (routing, CORS, rate limit, error mapping)

**Description:** All BFF tests call route handlers directly; the real HTTP server pipeline (URL parsing, CORS, OPTIONS, method guard, rate limit, institution load, catch block, 404) is untested.

**Fix:** Add integration tests that hit the server (e.g. with a test server or supertest) for at least: 404, 405, 429, institution load failure (404/500), and one successful route.

---

### 38. [Bug] Private stubs return empty arrays indistinguishable from "no data"

**Description:** Stubs like `fetchBookings()` return `[]` with no signal that the connector is unimplemented. Downstream may treat "no bookings" as a real empty state.

**Fix:** Document stubs clearly; optionally throw or return a tagged shape (e.g. `{ stub: true, data: [] }`) so callers can distinguish "stub" from "empty".

---

## Quick reference: common failure causes

| Symptom | Typical cause | Fix / see |
|--------|----------------|-----------|
| Generic 500 on `/events`, `/rooms`, `/schedule`, `/today` | Connector or Zod throw; catch discards error | Log error in server catch; add route-level handling; §1, §13 |
| BFF fails at startup | Missing `INSTITUTION_ID` | Set e.g. `INSTITUTION_ID=hfmt`; §6 |
| Mobile "Missing BFF base URL" in build | Using `MOBILE_PUBLIC_BFF_URL` instead of Expo public | Set `EXPO_PUBLIC_BFF_BASE_URL`; §7 |
| `pnpm verify` fails on TODO/FIXME | `rg` scan hits node_modules/build | Add exclusions to rg in script; §8 |
| Empty events/rooms/schedule | Missing config or upstream failure | Check `publicSources` / `publicRooms`, env, connectors; §3, §12 |
| Rate limit too strict or bypassed | trustProxy / forwarded headers / OPTIONS | §22–25; document proxy setup |
| Cached response has wrong request id | Cache replays headers | §5 |
| Events/schedule wrong time or "1970" | Timezone/date parsing, invalid ICS | §28; validate dates, respect TZID |
| Login not required to see tabs | No auth guard in layout | §34; add guard in private forks |

---

## Using this list for issues

- **Labels:** `bug`, `enhancement`, `documentation`, `operational` as appropriate.
- **Title:** Use the **[Bug]** / **[Enhancement]** prefix or a corresponding label.
- **Body:** Copy the relevant section (description, impact, fix) into the issue.
- The **quick reference** table can be linked from the README or a "Troubleshooting" doc.
