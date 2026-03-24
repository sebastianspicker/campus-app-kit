# Sub-Phase C.3: BFF Circuit Breaker for Connectors

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). Connectors in `src/connectors/public/` call external services. Your task is to add a lightweight circuit breaker to prevent cascading failures.

## Files to Create
- `apps/bff/src/utils/circuitBreaker.ts`
- `apps/bff/src/utils/__tests__/circuitBreaker.test.ts`

## Files to Modify
- `apps/bff/src/connectors/public/icsParser.ts` — Wrap fetch calls
- `apps/bff/src/connectors/public/hfmtWebEvents.ts` — Wrap fetch calls

## Implementation
```typescript
type CircuitState = 'closed' | 'open' | 'half_open';

interface CircuitBreakerConfig {
  readonly failureThreshold: number;  // default: 5
  readonly cooldownMs: number;        // default: 30_000
  readonly name: string;              // for logging
}

// State machine:
// CLOSED: normal operation, count consecutive failures
// OPEN: reject immediately, return CircuitOpenError or stale cache
// HALF_OPEN: allow one probe request through
//   - success → CLOSED (reset failure count)
//   - failure → OPEN (restart cooldown)
```

## Test Cases
1. CLOSED → stays CLOSED on success
2. CLOSED → OPEN after `failureThreshold` consecutive failures
3. OPEN → rejects immediately with `CircuitOpenError`
4. OPEN → HALF_OPEN after cooldown expires
5. HALF_OPEN → CLOSED on success
6. HALF_OPEN → OPEN on failure
7. Success resets failure counter
8. Non-consecutive failures don't trip the breaker

## Rules
- Circuit breaker is a pure utility — no side effects beyond state tracking
- Immutable config, mutable state is encapsulated
- Each connector gets its own circuit breaker instance
- Do NOT change connector logic beyond wrapping calls
- Run `pnpm typecheck && pnpm test` after changes

## Acceptance Criteria
- [ ] All state transitions work correctly
- [ ] Existing connector tests still pass
- [ ] New circuit breaker tests pass
- [ ] No behavior change when upstreams are healthy
