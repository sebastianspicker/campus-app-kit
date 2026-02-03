# Log

- 2026-02-03 (Phase 0): Created `docs/RUNBOOK.md` and `docs/REPO_MAP.md` based on repository inventory. Verification not run.
- 2026-02-03 (Phase 1): Completed read-only scan and created `docs/FINDINGS.md`. Verification not run.
- 2026-02-03 (Phase 2 / Iteration 1): Aligned CI with `scripts/verify-production-ready.sh` and added CI least-privilege permissions; updated `docs/ci.md`. Verification not run.
- 2026-02-03 (Phase 2 / Iteration 2): Added least-privilege permissions to gitleaks workflow and expanded `.gitignore` for Expo shared cache and TS build info. Verification pending.
- 2026-02-03 (Phase 2 / Iteration 3): Added Dependabot configuration for npm and GitHub Actions updates. Verification pending.
- 2026-02-03 (Phase 3 / Iteration 1): Fixed timeout abort handling when caller provides a signal; added unit test. Verified with `pnpm lint`, `pnpm typecheck`, `pnpm --filter @campus/mobile test`.
- 2026-02-03 (Phase 3 / Iteration 2): Added trusted-proxy handling for rate-limit client keys, updated docs/env example, added unit tests. Verified with `pnpm --filter @campus/bff lint`, `pnpm --filter @campus/bff typecheck`, `pnpm --filter @campus/bff test`.
- 2026-02-03 (Phase 3 / Iteration 3): Added periodic cleanup for rate-limit buckets and tests for eviction. Verified with `pnpm --filter @campus/bff lint`, `pnpm --filter @campus/bff typecheck`, `pnpm --filter @campus/bff test`.
- 2026-02-03 (Phase 3 / Iteration 4): Added unit tests for mobile BFF base URL resolution. Verified with `pnpm --filter @campus/mobile lint`, `pnpm --filter @campus/mobile typecheck`, `pnpm --filter @campus/mobile test`.
- 2026-02-03 (Phase 4 / Iteration 1): Rewrote README to a 10-section, GitHub-ready structure (EN, academic tone). Verification pending.
- 2026-02-03 (Phase 4 / Iteration 2): Improved mobile list accessibility by using Pressable links with accessibility labels. Verified with `pnpm --filter @campus/mobile lint`, `pnpm --filter @campus/mobile typecheck`, `pnpm --filter @campus/mobile test`.
- 2026-02-03 (Phase 5 / Iteration 1): Updated marker scan fallback and docs wording; full `pnpm verify` passed.
- 2026-02-03 (Phase 5 / Iteration 2): Updated `.gitignore` to include build artifacts, caches, and env patterns. Cleanup of local artifacts blocked by policy.
