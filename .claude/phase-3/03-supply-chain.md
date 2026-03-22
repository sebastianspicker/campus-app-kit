# Phase 3.3: Supply Chain & CI Security

You are auditing the supply chain and CI/CD security of campus-app-kit. Work through items ONE AT A TIME.

## Context

This repo uses:
- GitHub Actions for CI/CD (6 workflows)
- pnpm 9 with corepack for package management
- Dependabot for dependency updates
- Gitleaks for secret detection
- CodeQL for code security analysis
- CODEOWNERS for review requirements

## Audit Scope

### 1. GitHub Actions Security
- Verify ALL actions use SHA pinning, not mutable tags (e.g., `actions/checkout@<sha>`, not `@v4`)
- Check each workflow for minimal `permissions` blocks (principle of least privilege)
- Verify no secrets are exposed in workflow logs (`echo $SECRET`, debug output)
- Check for `pull_request_target` trigger misuse (code execution from untrusted forks)
- Verify `persist-credentials: false` on checkout where appropriate
- Check workflow concurrency settings (prevent parallel runs on same branch)

### 2. Workflow-Specific Checks

**ci.yml:**
- Verify caching strategy (Turbo + pnpm) doesn't cache across untrusted PRs
- Check if the workflow would pass on a completely fresh clone

**e2e.yml:**
- Check conditional logic for `github.event.inputs.platform` — does it work for push/PR triggers (not just workflow_dispatch)?
- Verify build secrets (signing certs, etc.) are not required for PR builds

**release.yml:**
- Verify tag-triggered workflow validates the tag format
- Check Docker image push credentials scope
- Verify CHANGELOG extraction regex handles edge cases

**codeql.yml:**
- Verify JavaScript/TypeScript analysis is sufficient (no other languages need scanning)
- Check schedule frequency

**gitleaks.yml:**
- Verify the license key conditional logic (two steps with opposite conditions) works
- Check if `.gitleaks.toml` allowlist is too permissive

**dependency-review.yml:**
- Verify it only runs on PRs (not push to main)
- Check if it blocks merge on vulnerable dependencies

### 3. Dependency Supply Chain
- Check `pnpm-lock.yaml` for integrity hash presence on all packages
- Verify no `postinstall` scripts from untrusted packages
- Check for typosquatting risk on package names
- Verify `pnpm install --frozen-lockfile` is used in CI (prevents lockfile modification)

### 4. Secret Management
- Verify `.gitignore` excludes `.env`, `*.pem`, `*.key`, `credentials*`
- Check for any committed secrets (API keys, tokens, passwords) via search
- Verify `.env.example` contains only placeholder values
- Check if any test fixtures contain real credentials or URLs

### 5. Code Ownership & Review
- Verify `CODEOWNERS` covers security-sensitive paths:
  - `.github/` (CI/CD configs)
  - `SECURITY.md`
  - `Dockerfile*`
  - `.gitleaks.toml`
  - `.env*`
- Check if branch protection rules are documented (can't enforce from repo alone)
- Verify Dependabot config covers both `npm` and `github-actions` ecosystems

## Key Files

- `.github/workflows/ci.yml`, `e2e.yml`, `release.yml`, `codeql.yml`, `gitleaks.yml`, `dependency-review.yml`
- `.github/dependabot.yml`, `.github/CODEOWNERS`
- `.gitleaks.toml`
- `.gitignore`
- `pnpm-lock.yaml` (spot check, not full read)
- `.env.example` (root and per-app)

## Rules

- Read actual workflow files and trace the logic. Never guess about CI behavior.
- Rate every finding: CRITICAL / HIGH / MEDIUM / LOW
- Fix issues directly when the fix is clear and safe (e.g., adding SHA pinning)
- For complex changes, document the issue and recommended fix
- Update `progress.md` under `## Phase 3.3: Supply Chain & CI Security` after each item
- Work on ONLY ONE item per invocation

## Completion

When all supply chain and CI security aspects have been reviewed:

<promise>COMPLETE</promise>
