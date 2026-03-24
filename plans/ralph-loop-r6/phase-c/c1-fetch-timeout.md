# Sub-Phase C.1: BFF Fetch Timeout & Abort

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). The fetch utility in `src/utils/fetch.ts` lacks timeout enforcement. Your task is to add AbortController-based timeouts.

## Files to Modify
- `apps/bff/src/utils/fetch.ts`

## Files to Create
- `apps/bff/src/utils/__tests__/fetch.timeout.test.ts`

## Implementation
```typescript
// Pattern: AbortController with configurable timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
try {
  const response = await fetch(url, { ...options, signal: controller.signal });
  return response;
} finally {
  clearTimeout(timeoutId);
}
```

- Default timeout: 10_000ms (configurable via options parameter)
- Throw a specific `TimeoutError` (not generic `Error`) when abort fires
- Clean up the timer in all code paths (success, error, abort)
- Preserve existing function signature — timeout is an optional addition

## Test Cases
1. Successful fetch completes within timeout
2. Slow fetch exceeding timeout throws `TimeoutError`
3. Caller-provided AbortSignal still works (compose signals if needed)
4. Timer is cleaned up on success (no dangling timeouts)

## Rules
- Use `AbortController` (built into Node 20)
- Immutability: return new options object, don't mutate the input
- `TimeoutError` should extend `Error` with a `name` property
- Run `pnpm typecheck && pnpm test` after changes

## Acceptance Criteria
- [ ] All existing fetch tests still pass
- [ ] New timeout tests pass
- [ ] `pnpm typecheck` passes
