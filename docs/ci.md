# CI Overview

This repo uses GitHub Actions with a deterministic, least-privilege CI setup focused on fast feedback and stable results.

## Workflows and triggers

- `ci` (push to `main`, all PRs)
  - Runs `./scripts/verify-production-ready.sh` (lint, typecheck, tests, build, marker check).
  - Uploads test artifacts if present (e.g., `coverage/`, `test-results/`).
- `dependency-review` (PRs only)
  - Checks new/changed dependencies for known vulnerabilities.
- `gitleaks` (push to `main`, all PRs)
  - Secret scanning with `gitleaks` using `.gitleaks.toml`.
- `codeql` (push to `main`, all PRs, weekly schedule)
  - Static analysis for JavaScript/TypeScript.

Each workflow has:
- Minimal `permissions`
- `concurrency` to cancel stale runs
- `timeout-minutes` to prevent hanging
- Caching for `pnpm` and Turbo build metadata

## Local reproduction

Primary entry points:

- Full CI equivalent:

```bash
./scripts/ci-local.sh
```

- Individual tasks (when iterating locally):

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Secrets and repo settings

- `GITLEAKS_LICENSE` (optional)
  - If set, `gitleaks` runs with the license on trusted contexts.
  - If not set (or for fork PRs), CI falls back to OSS mode and still scans.

No other secrets are required for CI to pass.

## How to extend CI

- Add new checks to `./scripts/verify-production-ready.sh` if they must run on every PR.
- If a job needs secrets, run it only on `push` to `main` or via `workflow_dispatch`.
- Keep workflows deterministic:
  - Pin tool versions (e.g., `corepack prepare pnpm@9.0.0 --activate`).
  - Use `--frozen-lockfile`/equivalent.
- Prefer quick PR checks; schedule heavier checks (nightly/weekly) if needed.

## Optional: run with act

If you use `act`, run it without secrets for PR workflows and only add secrets for `push` or `workflow_dispatch` runs.
