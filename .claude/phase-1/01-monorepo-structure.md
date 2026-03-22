# Phase 1.1: Monorepo Structure Audit

You are auditing the monorepo configuration of campus-app-kit. This is READ-ONLY — document findings in `progress.md`, do not change code.

## Context

This is a pnpm + Turbo monorepo with 4 workspace packages:
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind, Expo Router
- `apps/bff/` — Node.js HTTP server (no framework), Zod validation
- `packages/shared/` — Zod schemas and domain types
- `packages/institutions/` — Institution configuration packs

## Audit Scope

### 1. Workspace Configuration
- Verify `pnpm-workspace.yaml` covers all packages under `apps/*` and `packages/*`
- Check each `package.json` for correct `workspace:*` references to internal packages
- Verify `pnpm install --frozen-lockfile` succeeds without errors
- Check for orphaned packages (directories in `apps/` or `packages/` not listed in workspace)

### 2. Turbo Pipeline
- Verify `turbo.json` task dependencies — does `build` correctly depend on `^build`?
- Check that `dev` task has `cache: false` and `persistent: true`
- Verify task outputs (`dist/**`, `build/**`) match actual build output directories
- Check that `lint`, `typecheck`, and `test` tasks are correctly configured
- Verify `turbo.json` environment variable passthrough for BFF and mobile

### 3. TypeScript Configuration
- Check `tsconfig.base.json` settings: `strict: true`, `target: ES2022`, `moduleResolution: Bundler`
- Verify each workspace's `tsconfig.json` extends `tsconfig.base.json` correctly
- Check `tsconfig.build.json` files for correct `include`/`exclude` patterns
- Verify path aliases (`@/*` in mobile) resolve correctly
- Check for conflicting compiler options between workspaces

### 4. ESLint Configuration
- Verify `.eslintrc.cjs` rules apply correctly to both Node.js (BFF) and React Native (mobile) code
- Check for missing React/React Native specific lint rules in mobile workspace
- Verify ESLint ignorePatterns cover `dist/`, `build/`, `node_modules/`
- Check if each workspace needs its own ESLint config or if root config suffices

### 5. Build System Integrity
- Run `pnpm build` from root — does every package build successfully?
- Check build order: `packages/shared` → `packages/institutions` → `apps/bff` + `apps/mobile`
- Verify `dist/` output format matches `package.json` main/exports fields
- Check for any workspace that fails `pnpm typecheck` independently

## Key Files

- `/package.json`, `/turbo.json`, `/pnpm-workspace.yaml`, `/tsconfig.base.json`
- `apps/bff/package.json`, `apps/bff/tsconfig.json`, `apps/bff/tsconfig.build.json`
- `apps/mobile/package.json`, `apps/mobile/tsconfig.json`
- `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/tsconfig.build.json`
- `packages/institutions/package.json`, `packages/institutions/tsconfig.json`, `packages/institutions/tsconfig.build.json`
- `.eslintrc.cjs`

## Rules

- Read every file listed above before making any judgment
- Document findings with exact file paths and line numbers
- Do NOT change any code — document only
- Update `progress.md` under `## Phase 1.1: Monorepo Structure` after each item
- Work on ONLY ONE item per invocation

## Completion

When all workspace configuration has been audited and findings documented:

<promise>COMPLETE</promise>
