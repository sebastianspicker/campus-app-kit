# Sub-Phase D.2: HTTP Security Headers Review

## Context
You are working on campus-app-kit's BFF. Your task is to audit and strengthen HTTP security headers.

## Files to Inspect/Modify
- `apps/bff/src/middleware/securityHeaders.ts`
- `apps/bff/src/utils/cors.ts`

## Files to Create
- `apps/bff/src/middleware/__tests__/securityHeaders.audit.test.ts`

## Required Headers
| Header | Expected Value |
|--------|---------------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | `default-src 'none'; frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

## Headers to Verify Absent
- `X-Powered-By` — must NOT be present
- `Server` — should not reveal implementation details

## Test Cases
1. Each required header present in response
2. `X-Powered-By` absent
3. CORS headers correct for allowed origins
4. CORS rejects disallowed origins

## Rules
- Only add missing headers — don't change existing correct ones
- Run `pnpm typecheck && pnpm test` after changes

## Acceptance Criteria
- [ ] All security headers present and correctly configured
- [ ] Tests verify header presence
- [ ] No behavior regressions
