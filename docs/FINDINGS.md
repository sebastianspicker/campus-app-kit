# Findings

## P1 - Mobile fetch timeout is bypassed when a caller provides a signal

Location: `apps/mobile/src/utils/fetchHelpers.ts`

Expected vs actual: The timeout should abort long-running requests even when callers pass an `AbortSignal`. Currently, when `init.signal` is provided, the fetch uses the caller signal and ignores the internal timeout controller, so timeouts do not abort the request.

Fix strategy: Combine the caller signal with the timeout signal (for example via `AbortSignal.any` or a small helper) and always pass a signal that will abort on timeout.

Verification: Add a unit test that passes a custom signal and asserts the request is aborted after `timeoutMs`.

Status: Resolved in Phase 3, Iteration 1 (combined abort signals + unit test).

## P2 - Rate limiting trusts forwarded headers without a trusted-proxy policy

Location: `apps/bff/src/utils/clientKey.ts`

Expected vs actual: Client identity for rate limiting should not be derived from spoofable headers unless the server is behind a trusted proxy. Currently `x-forwarded-for` and `forwarded` are used unconditionally, allowing clients to spoof identities and bypass the limiter.

Fix strategy: Add a trusted-proxy configuration and only honor forwarded headers when enabled. Otherwise fall back to `req.socket.remoteAddress`.

Verification: Unit tests for `getClientKey` with and without trusted-proxy enabled.

Status: Resolved in Phase 3, Iteration 2 (trust proxy config + tests).

## P2 - In-memory rate-limit buckets are never evicted

Location: `apps/bff/src/utils/rateLimit.ts`

Expected vs actual: The rate-limit store should expire old buckets to avoid unbounded growth. The current `Map` keeps all client keys forever.

Fix strategy: Remove expired buckets on access and add a periodic cleanup or size cap to the map.

Verification: Unit test that expired entries are removed; optional load test to ensure memory remains stable.

Status: Resolved in Phase 3, Iteration 3 (periodic cleanup + tests).

## P3 - Missing tests for mobile BFF base URL resolution

Location: `apps/mobile/src/utils/bffConfig.ts`

Expected vs actual: Environment resolution logic should be covered by tests to prevent regressions (env overrides, protocol validation, and production default behavior). There are no dedicated tests for this module.

Fix strategy: Add unit tests covering env precedence, URL normalization, and production error paths.

Verification: New unit tests in `apps/mobile/src/utils/__tests__/` (or existing test folder) passing in CI.

Status: Resolved in Phase 3, Iteration 4 (unit tests added).
