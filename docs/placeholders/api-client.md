# Placeholder: API client hardening (mobile)

**Why this is missing**
- `apps/mobile/src/api/client.ts` only throws generic errors and has no timeout/abort or structured error parsing for the BFF error envelope.

**TODO**
- Implement `fetchJsonWithTimeout()` with `AbortController`.
- Parse BFF errors (`{ error: { code, message } }`) and surface meaningful UI messages.
- Add reusable helpers (`parseBffError`, `withRetry`).
