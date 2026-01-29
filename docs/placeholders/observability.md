# Placeholder: BFF Observability & Tracing

**Why this is missing**
- Production needs structured logs and a request id to diagnose connector failures. `server.ts` currently only logs via `console.log`.

**TODO**
- Implement `apps/bff/src/utils/logger.ts` (JSON logs, levels, requestId).
- Derive/propagate request id (`x-request-id`) and include it in response headers.
- Do not log sensitive data; document how to integrate with monitoring.
