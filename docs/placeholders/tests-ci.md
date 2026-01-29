# Placeholder: Tests & CI expansion

**Why this is missing**
- CI runs lint/typecheck/test, but `pnpm build` is not wired, and several error paths are untested. `gitleaks` can fail on forks.

**TODO**
- Add `pnpm build` to CI once workspace build scripts exist.
- Add tests for: mobile API client error parsing & env resolution; BFF 404/429/method guards/institution-not-found.
- Keep `gitleaks` fork-safe (no secret required for PR runs).
