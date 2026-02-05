# CI Audit

## Inventory (current workflows)

- `ci.yml` → `ci`
  - Trigger: `push` to `main`, all `pull_request`
  - Jobs: `build` (lint/typecheck/test/build)
  - Tools: pnpm + Turbo
- `dependency-review.yml` → `dependency-review`
  - Trigger: `pull_request`
  - Jobs: `review` (GitHub dependency review)
- `gitleaks.yml` → `gitleaks`
  - Trigger: `push` to `main`, all `pull_request`
  - Jobs: `scan` (gitleaks)
- `codeql.yml` → `codeql`
  - Trigger: `push` to `main`, all `pull_request`, weekly schedule
  - Jobs: `analyze` (CodeQL JS)

## Failure analysis

Notes:
- The public GitHub REST API provides step-level status, but log downloads require admin access and are blocked with HTTP 403 from this environment.
- Root causes below are derived from step-level failures and local reproduction.

| Workflow | Failure(s) | Root Cause | Fix Plan | Risk | How to verify |
| --- | --- | --- | --- | --- | --- |
| `ci` | `pnpm/action-setup@v4` step fails; downstream steps skipped | `pnpm/action-setup@v4` fails on runner before Node setup; no install executed | Remove `pnpm/action-setup`, use `actions/setup-node@v4` + Corepack to pin pnpm | Low | Re-run CI; locally run `./scripts/ci-local.sh` |
| `dependency-review` | `actions/dependency-review-action@v4` step fails on PRs | Missing `pull-requests: read` permission for PR diff | Add `pull-requests: read` permission | Low | Re-run CI on a PR |
| `gitleaks` | `gitleaks/gitleaks-action@v2` step fails on PRs | PRs from forks don’t get secrets; action likely fails when `GITLEAKS_LICENSE` missing | Add licensed + OSS fallback steps and keep scanning without secrets | Low | Re-run CI on a PR; locally run gitleaks in Docker |
| `codeql` | Green in recent runs | No change required | Keep current setup with timeouts + concurrency | Low | Scheduled run stays green |

## Status

- `ci`: fixed in workflow update (pending CI re-run)
- `dependency-review`: fixed in workflow update (pending CI re-run)
- `gitleaks`: fixed in workflow update (pending CI re-run)
- `codeql`: unchanged (already green)
