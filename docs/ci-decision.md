# CI Decision

## Decision
**FULL CI**

## Why this repo benefits from FULL CI
- The repo contains executable application code (mobile app, BFF, shared packages).
- There are deterministic build, test, and typecheck steps that run quickly in CI.
- No production secrets or live infrastructure are required for core checks.
- The build is reproducible on GitHub-hosted runners (Node + pnpm + Turbo).

## What runs where

**On all PRs**
- `ci`: lint, typecheck, tests, build, marker check
- `dependency-review`: dependency diff analysis
- `gitleaks`: secret scan (OSS mode on fork PRs)
- `codeql`: static analysis

**On push to `main`**
- Same as PRs

**Scheduled (weekly)**
- `codeql`

## Threat model for CI

- **Fork PRs are untrusted.**
  - Secrets are not exposed to fork PRs.
  - `gitleaks` runs in OSS mode when `GITLEAKS_LICENSE` is unavailable.
  - No workflow uses `pull_request_target`.
- **Least privilege**
  - Workflows use minimal `permissions`.
  - No write access is required for core checks.
- **Dependency/scan tools**
  - `dependency-review` and `codeql` run with read-only permissions (plus `security-events: write` for CodeQL results).

## Limits / assumptions
- CI assumes a standard Node + pnpm toolchain on GitHub-hosted runners.
- No integration tests requiring external services are included in core CI.

## If we later want even broader FULL CI
- Add:
  - End-to-end tests (possibly nightly or on a self-hosted runner).
  - Expo/EAS build validation on `workflow_dispatch` with required secrets.
  - Container validation for `infra/docker-compose.dev.yml`.
