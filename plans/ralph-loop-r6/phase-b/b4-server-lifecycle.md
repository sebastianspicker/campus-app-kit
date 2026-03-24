# Sub-Phase B.4: BFF Server Lifecycle Test

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). The server is a plain Node.js HTTP server in `src/server.ts`. Your task is to test startup and shutdown behavior.

## Files to Create
- `apps/bff/src/__tests__/lifecycle.test.ts`

## Test Cases
1. Server starts and listens on a dynamic port (port 0)
2. Health endpoint responds 200 during normal operation
3. Server closes gracefully on `server.close()`
4. After close, new connections are refused
5. Pending requests complete before shutdown (if applicable)

## Rules
- Use dynamic port (port 0) to avoid conflicts with other tests
- Use `supertest` or raw `http.request` for connection testing
- Clean up server in `afterEach` to prevent test leaks
- Do NOT modify `server.ts` — test-only changes
- Run `pnpm test` after creation

## Acceptance Criteria
- [ ] Lifecycle tests pass
- [ ] No port conflicts with parallel tests
- [ ] `pnpm test` passes
