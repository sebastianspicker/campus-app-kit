# Phase D: Security Hardening

> Deep security review building on Round 5's security pass.
> Runs AFTER Phases B and C (depends on their changes).

## Context Brief

Round 5 addressed critical security findings. This phase targets defense-in-depth:
- Input validation at every BFF route entry point
- HTTP header hardening review
- Dependency audit for known vulnerabilities
- Rate limiting edge cases

## Sub-Phases

### D.1: Route Input Validation Audit

**Scope:** Ensure every BFF route validates ALL inputs via Zod before processing.

**Files to inspect and harden:**
- `apps/bff/src/routes/schedule.ts`
- `apps/bff/src/routes/events.ts`
- `apps/bff/src/routes/rooms.ts`
- `apps/bff/src/routes/today.ts`
- `apps/bff/src/utils/queryParams.ts`

**Checklist per route:**
- [ ] All query params parsed through Zod schemas (not raw `req.url` parsing)
- [ ] Invalid params return 400 with safe error message (no internal details)
- [ ] Path params validated and sanitized
- [ ] No string interpolation into downstream URLs/queries without encoding
- [ ] Content-Type checking on any POST/PUT routes

**Acceptance criteria:**
- [ ] Every route entry point validates inputs via Zod
- [ ] Error responses don't leak stack traces or internal paths
- [ ] Existing tests still pass

### D.2: HTTP Security Headers Review

**Scope:** Audit and strengthen security headers middleware.

**Files to inspect:**
- `apps/bff/src/middleware/securityHeaders.ts`
- `apps/bff/src/utils/cors.ts`

**Headers to verify:**
- [ ] `Strict-Transport-Security` (HSTS) — present with appropriate max-age
- [ ] `Content-Security-Policy` — restrictive default-src
- [ ] `X-Content-Type-Options: nosniff` — present
- [ ] `X-Frame-Options: DENY` — present
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` — present
- [ ] `Permissions-Policy` — restrictive
- [ ] CORS: `Access-Control-Allow-Origin` not set to `*` in production config
- [ ] No `X-Powered-By` header leaking server info

**Tests to add:**
- `apps/bff/src/middleware/__tests__/securityHeaders.audit.test.ts` — New
  - Verify each security header is present in responses
  - Verify no information-leaking headers

**Acceptance criteria:**
- [ ] All security headers present and correctly configured
- [ ] Tests verify header presence
- [ ] No behavior regressions

### D.3: Dependency Vulnerability Audit

**Scope:** Check all dependencies for known vulnerabilities.

**Process:**
1. Run `pnpm audit --audit-level moderate`
2. Check for outdated critical dependencies: `pnpm outdated`
3. Review any pinned/overridden versions (lightningcss override in root package.json)

**Acceptance criteria:**
- [ ] No high/critical vulnerabilities in `pnpm audit`
- [ ] Overridden versions documented with reason
- [ ] Any new patches applied don't break tests

### D.4: Rate Limiting Edge Cases

**Scope:** Verify rate limiting can't be bypassed.

**Files to inspect:**
- `apps/bff/src/utils/rateLimiter.ts`

**Test cases to add:**
- `apps/bff/src/utils/__tests__/rateLimiter.bypass.test.ts` — New
  - Rate limit applies regardless of `X-Forwarded-For` header manipulation
  - Rate limit state isn't shared across different client keys
  - Rate limit resets correctly after window expires
  - Burst requests at window boundary
  - Rate limit response includes `Retry-After` header

**Acceptance criteria:**
- [ ] No bypass vectors found
- [ ] Rate limit tests pass
- [ ] `pnpm verify` passes

## Validation Gate

```bash
pnpm verify
```

Plus: no CRITICAL/HIGH findings from manual security review.

On success, append to `plans/ralph-loop-r6/progress.md`:
```
## PHASE D COMPLETE
```
