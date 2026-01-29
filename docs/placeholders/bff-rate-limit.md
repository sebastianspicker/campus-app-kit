# Placeholder: BFF Rate-Limit & Proxy-Awareness

**Why this is missing**
- `apps/bff/src/utils/rateLimit.ts` relies on `req.socket.remoteAddress`, which is unreliable behind proxies/load balancers.

**TODO**
- Derive a proxy-aware client key using `X-Forwarded-For`/`Forwarded`.
- Optionally move rate limit state to an external store (Redis) or make it configurable.
- Document proxy expectations for production deployments.
