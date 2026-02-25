# Bugs & Fixes Archive

This file contains all resolved bugs and fixes from the Campus App Kit development history. These items are kept for reference and historical context.

**Total Resolved Items: 76**

---

## Quick Reference: All Resolved Items

| # | Category | Summary | Resolution |
|---|----------|---------|------------|
| 1 | Bug | BFF route handlers have no local error handling | Added route-level try/catch with Zod validation logging |
| 2 | Operational | Mock events mode with no route-level signal | Response header `x-data-mode: mock` added |
| 3 | Bug | Missing publicSources/publicRooms returns 200 with empty data | Routes now return 404 with descriptive message |
| 4 | Bug | `/today` has no date scoping | Implementation now filters events to current server date |
| 5 | Config | Cacheable responses replay `x-request-id` | Set only for non-cacheable responses |
| 6 | Config | BFF README omits required `INSTITUTION_ID` | Documentation updated |
| 7 | Config | Mobile env `MOBILE_PUBLIC_BFF_URL` not Expo-public | Deprecated in favor of `EXPO_PUBLIC_BFF_BASE_URL` |
| 8 | Operational | `pnpm verify` marker scan doesn't exclude node_modules | Added explicit `--glob` exclusions |
| 9 | Enhancement | Route-level validation and error shaping | Implemented via createJsonRoute |
| 10 | Enhancement | Health endpoint lacks dependency check | Returns 503 if institution pack cannot be loaded |
| 11 | Enhancement | Clearer error messages for institution load | Optimized catch blocks with full logging |
| 12 | Operational | Document "empty response" semantics | Added Troubleshooting section to BFF README |
| 13 | Critical | Async request handler unhandled rejections | Wrapped entire async handler in try/catch |
| 14 | Bug | Rate limiting bypass for disallowed methods | Rate limiting runs first |
| 15 | Bug | ICS parser throws on malformed dates | Added date validation checks |
| 16 | Bug | Forwarded header parsing truncates IPv6 | Improved IP parsing for IPv6 |
| 17 | Bug | `sendError` no-ops when headers sent | Logs error and attempts `res.end()` |
| 18 | Bug | URL parsing uses client-controlled Host | Wrapped in try/catch |
| 19 | Bug | `toISOString()` on Invalid Date | Added explicit NaN checks |
| 20 | Bug | `safeResolveUrl` allows javascript:/data: | Hardened to allow only http/https |
| 21 | Bug | Institution pack loaded before route check | Check path first, then load |
| 22 | Bug | trustProxy "auto" heuristic issues | Documented semantics in runbook |
| 23 | Bug | Client key from unvalidated X-Forwarded-For | Validated with `isIP()` |
| 24 | Bug | In-memory rate limit buckets unbounded | Map capped at 20k buckets |
| 25 | Bug | OPTIONS requests bypass rate limiting | Rate limit runs before OPTIONS branch |
| 26 | Bug | Public connectors swallow fetch/parse errors | Log failures, set `x-data-degraded` |
| 27 | Bug | Event IDs unstable | Use stable fallback date for ID generation |
| 28 | Bug | ICS/schedule timezone and TZID ignored | TZID parameters now respected |
| 29 | Bug | BFF cache never evicts expired entries | Periodic cleanup and size limit |
| 30 | Bug | Cache in-flight promises can stick forever | Added timeout and finally block |
| 31 | Bug | fetchWithTimeout overwrites caller AbortSignal | Used `AbortSignal.any()` |
| 32 | Bug | Logger sanitizeContext case-sensitive and shallow | Recursive, case-insensitive sanitization |
| 33 | Bug | Mobile Zod.parse throws uncaught | safeParse handles Zod errors |
| 34 | Bug | No route-level auth gating | Template guardAuth middleware added |
| 35 | Bug | Session type looks production-ready | Added `isDemo` field and JSDoc |
| 36 | Bug | Institution load errors returned to client | Generic messages, full server logging |
| 37 | Bug | BFF server entrypoint has no tests | Integration tests with supertest |
| 38 | Bug | Private stubs return empty arrays | Stubs return `_isStub: true` flag |
| 39 | Bug | Fragile HTML parsing in connectors | Refactored regex, added length checks |
| 40 | Bug | BFF no server-side cache for loader results | Loader skip on ETag match |
| 41 | Bug | Mobile ignores `Retry-After` header | Parse and respect Retry-After |
| 42 | Performance | Redundant schema parsing | Removed duplicate parse call |
| 43 | Performance | SHA1 hashing overhead | Switched to MD5 for ETags |
| 44 | Performance | Lack of global navigation cache | In-memory resourceCache added |
| 45 | Enhancement | Hardcoded cache TTLs | Configurable via environment |
| 46 | Performance | Rate limit eviction latency | Insertion-order removal |
| 47 | Bug | ICS parser duplication | Unified in icsParser.ts |
| 48 | Bug | Mobile cache growth unbounded | MAX_CACHE_ENTRIES limit |
| 49 | Bug | BFF cache cleanup of in-flight promises | Monitor and warn on abnormal size |
| 50 | Enhancement | Global security headers vs route overrides | Extracted to middleware |
| 51 | Security | ReDoS protection in logger | Added recursion depth limit |
| 52 | Performance | Sequential source fetching | Parallel with Promise.allSettled |
| 53 | Performance | Redundant environment parsing | Singleton BFF_ENV |
| 54 | Performance | Redundant institution loading | Singleton InstitutionPack |
| 55 | Security | Lack of startup validation | Dry-run before server.listen() |
| 56 | Performance | getBffEnv duplication in server.ts | Standardized on singleton |
| 57 | Enhancement | Inconsistent cache TTL usage | All connectors use defaultCacheTtl |
| 58 | Bug | ICS value unescaping | Added unescapeIcsValue helper |
| 59 | Bug | ICS parameter quotes | Strip quotes from parameter values |
| 60 | Operational | Missing mobile error boundary | Global ErrorBoundary added |
| 61 | Bug | Mobile fetch empty response handling | Handle 204 and empty bodies |
| 62 | Security | Fragile Retry-After parsing | Support integer and HTTP-date formats |
| 63 | Operational | Mobile lacks SafeAreaProvider | Wrapped root layout |
| 64 | Bug | Logger context overwrites main fields | Nest context under `context` key |
| 65 | Security | Unbounded in-flight promise map | MAX_IN_FLIGHT = 500 limit |
| 66 | Bug | ICS unstable ID fallback | SHA-256 hash for stable IDs |
| 67 | Security | Log context key collision | Resolved via nesting |
| 68 | Performance | Mobile URL resolution overhead | Memoized resolveBffBaseUrl |
| 69 | Security | BFF health check upstream leak | Generic error to client |
| 70 | Operational | ICS RRULE lack of support | Documented as limitation |
| 71 | Cleanup | Unused computeETag | Removed, standardized on MD5 |
| 72 | Bug | Mobile cache force=true ignores in-flight | Reuse in-flight promises |
| 73 | Bug | Mobile cache lack of timeout | 15s timeout implemented |
| 74 | Security | Missing HSTS header | Added Strict-Transport-Security |
| 75 | Bug | Mobile usePublicResource loading sync | Refined state transitions |
| 76 | Operational | BFF MD5 hashing in FIPS environments | Documented limitation |

---

## Detailed Archive

The detailed descriptions, impacts, and fixes for each item have been removed from the active `BUGS_AND_FIXES.md` file to keep it focused on current issues. This archive serves as historical reference.

For the full history, see the git commit history or the original detailed descriptions in version control.

---

## Key Patterns Identified

During the resolution of these 76 items, several patterns emerged:

### Error Handling
- Route-level try/catch with generic client messages
- Full server-side logging with stack traces
- Stable error codes for client handling

### Security
- Input validation at all entry points
- Rate limiting before method checks
- Security headers via middleware
- No internal details leaked to clients

### Performance
- Singleton patterns for config
- Parallel fetching with Promise.allSettled
- Bounded caches with eviction
- Memoization for repeated operations

### Mobile Best Practices
- SafeAreaProvider wrapper
- ErrorBoundary at root
- Proper abort signal handling
- Cache with timeout and size limits

---

*Archive created: 2026-02-24*
*All items resolved as of this date*
