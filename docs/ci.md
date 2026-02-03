# CI Checklist

This repo’s CI contract is:

- Deterministic install: `pnpm install --frozen-lockfile`
- Monorepo checks: `./scripts/verify-production-ready.sh` (lint, typecheck, test, build, marker check)
- Secret scanning: `gitleaks` (runs without requiring secrets)

See `.github/workflows/ci.yml` and `.github/workflows/gitleaks.yml`.
