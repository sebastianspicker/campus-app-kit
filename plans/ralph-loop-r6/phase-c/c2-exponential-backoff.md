# Sub-Phase C.2: Mobile Exponential Backoff

## Context
You are working on campus-app-kit's mobile app (`apps/mobile/`). The retry utility in `src/api/retry.ts` needs exponential backoff with jitter.

## Files to Modify
- `apps/mobile/src/api/retry.ts`
- `apps/mobile/src/api/__tests__/retry.test.ts`

## Implementation
```typescript
// Exponential backoff formula:
// delay = min(baseDelay * (multiplier ^ attempt) + jitter, maxDelay)
// jitter = random(-0.25, +0.25) * calculatedDelay

interface RetryConfig {
  readonly maxRetries: number;    // default: 3
  readonly baseDelayMs: number;   // default: 1000
  readonly multiplier: number;    // default: 2
  readonly maxDelayMs: number;    // default: 30000
}
```

Key behaviors:
- Only retry on 5xx status codes and network errors (TypeError)
- Do NOT retry on 4xx (client errors are not transient)
- Respect `Retry-After` header (parse as seconds or HTTP-date)
- Add ±25% jitter to prevent thundering herd
- Return the last error if all retries exhausted

## Test Cases to Add
1. Exponential delay progression: 1s → 2s → 4s (±jitter)
2. Max delay cap: never exceeds 30s
3. 4xx responses are NOT retried
4. 5xx responses ARE retried
5. Network errors (TypeError) ARE retried
6. `Retry-After` header respected (overrides calculated delay)
7. All retries exhausted → throws last error

## Rules
- Use `vi.useFakeTimers()` for timing tests
- Immutability: config object is readonly, create new state per retry
- Do NOT change the public API of the retry function (backward compatible)
- Run `pnpm test` after changes

## Acceptance Criteria
- [ ] Backoff is exponential with jitter
- [ ] 4xx not retried, 5xx + network errors retried
- [ ] Retry-After header respected
- [ ] All tests pass
