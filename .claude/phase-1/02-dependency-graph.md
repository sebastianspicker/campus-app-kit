# Phase 1.2: Dependency Graph Audit

You are auditing the dependency graph of campus-app-kit. This is READ-ONLY — document findings in `progress.md`, do not change code.

## Context

This is a pnpm + Turbo monorepo with 4 workspace packages:
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind 4.2, Expo Router 3.5
- `apps/bff/` — Node.js HTTP server, Zod 3.23, rrule 2.8
- `packages/shared/` — Zod 3.23
- `packages/institutions/` — depends on `@campus/shared`

## Audit Scope

### 1. Outdated Dependencies
- Run `pnpm outdated` across all workspaces
- Flag critically outdated packages: Expo SDK, React Native, TypeScript, Zod
- Check if Expo 51 → 52+ migration is available and what it would entail
- Check React Native 0.74 → newer version availability
- Check TypeScript 5.5 → current version

### 2. Vulnerability Scan
- Run `pnpm audit` for all workspaces
- Separate production vulnerabilities (BFF `dependencies`) from dev-only
- Check for known CVEs in key dependencies (Expo, React Native, Zod, rrule)

### 3. Version Consistency
- Verify Zod version is identical in `@campus/shared`, `@campus/bff`, and `@campus/mobile`
- Check for the same package at different versions across workspaces
- Check `pnpm-lock.yaml` for multiple resolved versions of the same package

### 4. Dependency Hygiene
- Identify packages in `dependencies` that should be `devDependencies`
- Identify unused dependencies (installed but not imported anywhere)
- Check for unnecessary polyfills or compatibility packages
- Verify `peerDependencies` are correctly specified (especially in shared packages)

### 5. Compatibility Matrix
- NativeWind 4.x + Tailwind CSS version compatibility
- Expo Router 3.5 + React Navigation version compatibility
- React Native Reanimated 3.x + React Native 0.74 compatibility
- Check `apps/mobile/metro.config.js` and `postcss.config.mjs` for NativeWind toolchain correctness
- Check if the `lightningcss` override in mobile workspace is still needed

### 6. Lock File Integrity
- Verify `pnpm install --frozen-lockfile` succeeds
- Check `pnpm-lock.yaml` is committed and up to date
- Verify no integrity hash mismatches

## Key Files

- All 4 `package.json` files (root + workspaces)
- `pnpm-lock.yaml`
- `apps/mobile/metro.config.js`, `apps/mobile/postcss.config.mjs`
- `apps/mobile/babel.config.js`

## Rules

- Run actual commands (`pnpm outdated`, `pnpm audit`) — do not guess
- Document findings with package names, current versions, and available versions
- Do NOT change any code — document only
- Update `progress.md` under `## Phase 1.2: Dependency Graph` after each item
- Work on ONLY ONE item per invocation

## Completion

When all dependency aspects have been audited and findings documented:

<promise>COMPLETE</promise>
