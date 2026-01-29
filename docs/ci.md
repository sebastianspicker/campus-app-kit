# CI Checklist

## TODO

- Add deterministic installs:
  - Commit `pnpm-lock.yaml`
  - Use `pnpm install --frozen-lockfile` in CI
- Add `pnpm build` to CI once build scripts exist across workspaces.
- Add test coverage for:
  - Mobile API client error parsing & env config
  - BFF method guards, 404/429, institution-not-found
- Make `gitleaks` workflow fork-safe (no required secret for PRs).

