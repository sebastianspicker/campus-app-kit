# Placeholder: BFF Server Hardening

**Why this is missing**
- `apps/bff/src/server.ts` is minimal (no method guards, inline defaults, limited structured error handling).

**TODO**
- Use `getBffEnv()` (no hardcoded production defaults).
- Allow only `GET` (and `OPTIONS` if needed), return `405` with `Allow` header.
- Use `sendError` consistently across all error paths.
- Make rate limiting proxy-aware and document expected proxy headers.
