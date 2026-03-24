# Sub-Phase D.4: Rate Limiting Edge Cases

## Context
You are working on campus-app-kit's BFF. Your task is to verify the rate limiter can't be bypassed.

## Files to Inspect
- `apps/bff/src/utils/rateLimiter.ts`

## Files to Create
- `apps/bff/src/utils/__tests__/rateLimiter.bypass.test.ts`

## Test Cases
1. Rate limit applies regardless of `X-Forwarded-For` manipulation
2. Different client keys have independent rate limit counters
3. Rate limit resets after window expires
4. Burst of requests at window boundary handled correctly
5. Response includes `Retry-After` header when rate limited
6. Rate limit applies to all routes (not just some)

## Bypass Vectors to Check
- Spoofed `X-Forwarded-For` header
- Missing `X-Forwarded-For` header
- Multiple `X-Forwarded-For` values
- IPv4 vs IPv6 same client

## Rules
- Use `vi.useFakeTimers()` for window-related tests
- Do NOT weaken existing rate limiting to make tests pass
- If a bypass is found, fix the rate limiter and add a regression test
- Run `pnpm test` after changes

## Acceptance Criteria
- [ ] No bypass vectors found (or all found vectors fixed)
- [ ] Rate limit tests pass
- [ ] `pnpm verify` passes
