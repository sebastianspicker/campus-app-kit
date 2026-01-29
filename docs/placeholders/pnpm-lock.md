# Placeholder: `pnpm-lock.yaml`

**Why this is missing**
- Without a lockfile, `pnpm install` is not deterministic on CI or locally.

**TODO**
- Run `pnpm install` with the intended Node/pnpm versions, commit the generated `pnpm-lock.yaml`, and use `--frozen-lockfile` in CI.
- Optionally add `engines` in `package.json` to reduce drift.
