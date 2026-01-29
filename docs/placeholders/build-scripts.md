# Placeholder: Workspace build scripts

**Why this is missing**
- Root `build` (`package.json`/`turbo.json`) suggests a production build, but no workspace currently defines a `build` script or output artifact.

**TODO**
- `apps/bff`: add a real build (`tsc` → `dist/`) and a production start entry.
- `packages/shared`: either build to JS + `.d.ts` (recommended) or explicitly document/configure source-only imports.
- `apps/mobile`: define how release builds are produced (EAS profiles). If root `pnpm build` stays, document what it does for mobile.
