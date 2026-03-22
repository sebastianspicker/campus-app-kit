# Phase 3.1: BFF Security

You are performing a security audit of the BFF server. Work through items ONE AT A TIME.

## Context

The BFF (`apps/bff/`) is a raw Node.js HTTP server that:
- Accepts HTTP requests with query parameters (search, date range, pagination)
- Makes outbound HTTP requests to public data sources (URLs from institution pack config)
- Parses HTML (regex-based) and ICS files from external sources
- Serves JSON responses to the mobile app
- Uses in-memory caching and rate limiting
- Has middleware: CORS, security headers, auth guard, method guard

## Audit Scope

### 1. Input Validation & Injection
- Verify every query parameter through `parseQueryParams` is bounded and sanitized
- Check for template literal injection in log messages (user input interpolated into logs)
- Check for regex injection in search parameter handling
- Check for header injection in CORS response headers
- Verify URL path routing cannot be tricked with path traversal (`/../`, `%2e%2e`)
- Check `queryParams.ts`: what happens with arrays, objects, or deeply nested params?

### 2. SSRF (Server-Side Request Forgery)
- Verify ALL outbound HTTP requests use URLs from static config only (institution packs)
- Check if any user input influences outbound request URLs
- Verify `fetchTextWithTimeout` does not follow redirects to internal networks
- Check if DNS rebinding attacks are relevant for the external fetch patterns

### 3. Rate Limiting & DoS
- Verify rate limit cannot be bypassed via X-Forwarded-For spoofing when `trustProxy` is enabled
- Check what happens when rate limit buckets exhaust memory (20,000 bucket limit)
- Verify response body size limits on `fetchTextWithTimeout`
- Check for algorithmic complexity attacks (ReDoS in regex patterns, especially `hfmtWebEvents.ts`)
- Verify the cache cannot be used as a memory exhaustion vector

### 4. Security Headers
- Verify CSP, HSTS, X-Frame-Options, X-Content-Type-Options are set on ALL responses
- Check if security headers are set on error responses (not just success)
- Check if security headers are set on CORS preflight (OPTIONS) responses
- Verify `X-Request-Id` does not leak internal information

### 5. Error Information Leakage
- Verify stack traces never reach the client
- Check that error messages are generic (not exposing file paths, internal URLs, or config)
- Verify that failed connector requests don't leak the upstream URL in the response
- Check logging output for sensitive data (auth tokens, full URLs with params)

### 6. Authentication & Authorization
- Review `authGuard.ts` — is the comparison timing-safe? (`crypto.timingSafeEqual`)
- Check if auth can be bypassed by sending no auth header (does the guard reject or skip?)
- Verify CORS with wildcard origin is documented as dev-only

### 7. Dockerfile Security
- Verify non-root user in `Dockerfile.prod`
- Check for unnecessary packages in the image
- Verify no secrets baked into Docker layers
- Check multi-stage build: does the final image contain only production artifacts?
- Verify `dumb-init` for signal handling

## Key Files

- `apps/bff/src/server.ts`
- `apps/bff/src/middleware/authGuard.ts`, `methodGuard.ts`, `securityHeaders.ts`
- `apps/bff/src/utils/cors.ts`, `rateLimit.ts`, `fetch.ts`, `queryParams.ts`
- `apps/bff/src/utils/errors.ts`, `logger.ts`, `requestId.ts`
- `apps/bff/src/connectors/public/hfmtWebEvents.ts` (HTML regex patterns)
- `apps/bff/src/connectors/public/icsParser.ts`
- `apps/bff/src/config/env.ts`
- `apps/bff/Dockerfile`, `apps/bff/Dockerfile.prod`
- `.gitignore` (verify `.env` is excluded)

## Rules

- Read actual code and trace actual code paths. Never guess about security.
- Rate every finding: CRITICAL / HIGH / MEDIUM / LOW
- Fix issues directly when the fix is clear, safe, and does not change behavior
- For complex fixes, document the vulnerability and recommended remediation
- Update `progress.md` under `## Phase 3.1: BFF Security` after each item
- Work on ONLY ONE item per invocation

## Completion

When all server-side security vectors have been reviewed:

<promise>COMPLETE</promise>
