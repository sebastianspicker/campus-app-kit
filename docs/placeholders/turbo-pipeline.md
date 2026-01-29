# Placeholder: Turbo build pipeline

**Why this is missing**
- Root `build` looks like a production target, but no workspaces actually implement `build`.

**TODO**
- Decide per workspace whether it needs a build artifact.
- `apps/bff`: `tsc` build → `dist/`.
- `packages/shared`: `tsc` build → `dist/`, configure `exports`.
- `apps/mobile`: define Expo/EAS build workflow.
- Update Turbo config so `turbo run build` is only used when all relevant packages have `build`.
