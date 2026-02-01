# CI Checklist

This repo’s CI contract is:

- Deterministic install: `pnpm install --frozen-lockfile`
- Monorepo checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- Secret scanning: `gitleaks` (runs without requiring secrets)

See `.github/workflows/ci.yml` and `.github/workflows/gitleaks.yml`.
