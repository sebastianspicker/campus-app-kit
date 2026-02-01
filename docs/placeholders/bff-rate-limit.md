# BFF rate limiting and proxy awareness

The BFF applies a basic in-memory rate limit keyed by a proxy-aware client key.

## Client key

- Primary: `X-Forwarded-For` (first entry)
- Fallback: `Forwarded` (`for=...`)
- Final fallback: `req.socket.remoteAddress`

Implementation: `apps/bff/src/utils/clientKey.ts`

## Rate limit behavior

Implementation: `apps/bff/src/utils/rateLimit.ts`

This is per-process and resets on restart. For multi-instance deployments, use a shared store in your private ops repo.
