# Phase 5.2: CI/CD Workflow Audit

You are auditing the CI/CD workflows for correctness and maintainability. Work through items ONE AT A TIME.

## Context

Six GitHub Actions workflows exist in `.github/workflows/`:
1. `ci.yml` — main CI (lint, typecheck, test, build)
2. `e2e.yml` — Detox E2E tests (iOS + Android)
3. `release.yml` — tag-triggered release (GitHub Release + Docker push)
4. `codeql.yml` — CodeQL security analysis
5. `gitleaks.yml` — secret detection
6. `dependency-review.yml` — dependency vulnerability review

## Audit Scope

### 1. ci.yml Correctness
- Would this workflow pass on a completely fresh clone? Trace every step.
- Verify corepack + pnpm setup matches `package.json#packageManager`
- Check caching: Turbo cache key, pnpm store path
- Verify all four jobs (lint, typecheck, test, build) run the correct commands
- Check artifact upload: are test results and coverage reports correctly captured?
- Verify concurrency: does `cancel-in-progress: true` work correctly for PRs?

### 2. e2e.yml Conditional Logic
- `github.event.inputs.platform` is only set for `workflow_dispatch` trigger
- On `push` or `pull_request` triggers, this value is undefined
- Check: do the `if` conditions on iOS/Android jobs handle undefined input correctly?
- The intent is: on push/PR run both platforms, on workflow_dispatch respect the platform choice
- Fix any broken conditional logic

### 3. release.yml Validation
- Verify tag format validation (`v*` pattern)
- Check CHANGELOG extraction: does the regex/script correctly extract the section for the current version?
- Verify Docker image build and push: correct registry, correct tags, correct Dockerfile
- Check if the release workflow depends on CI passing (should it?)

### 4. Security Workflows
- `codeql.yml`: verify schedule cron, language config, and analysis steps
- `gitleaks.yml`: verify the two-step license conditional (licensed vs OSS fallback)
- `dependency-review.yml`: verify it runs only on PRs, not pushes

### 5. Workflow Maintainability
- Check for duplicated steps across workflows (checkout, corepack, pnpm install)
- Could these be extracted into a reusable composite action?
- Estimate total CI time — is it under 10 minutes for the main CI workflow?
- Check if any workflow has unnecessary steps or overly complex conditions

### 6. Templates & Automation
- Review `.github/ISSUE_TEMPLATE/bug_report.yml` and `feature_request.yml`
- Review `.github/pull_request_template.md`
- Are templates practical and concise, or bureaucratic?
- Check Dependabot config: correct ecosystems, sensible update frequency

## Key Files

- `.github/workflows/ci.yml`, `e2e.yml`, `release.yml`, `codeql.yml`, `gitleaks.yml`, `dependency-review.yml`
- `.github/ISSUE_TEMPLATE/*.yml`
- `.github/pull_request_template.md`
- `.github/dependabot.yml`
- `scripts/verify-production-ready.sh`, `scripts/ci-local.sh`

## Rules

- Read actual workflow files and trace the step-by-step logic
- Fix broken conditional logic or incorrect commands directly
- For speculative improvements, document as a suggestion
- Update `progress.md` under `## Phase 5.2: CI/CD Workflow Audit` after each item
- Work on ONLY ONE item per invocation

## Completion

When all workflows have been reviewed and issues fixed:

<promise>COMPLETE</promise>
