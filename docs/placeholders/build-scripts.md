# Workspace build scripts

`pnpm build` runs `turbo run build` at the repo root.

Outputs:

- `apps/bff`: `dist/` (compiled server)
- `packages/shared`: `dist/` (`.js` + `.d.ts`)
- `packages/institutions`: `dist/` (`.js` + `.d.ts`)
- `apps/mobile`: typecheck build (`tsc`) without emitting artifacts
