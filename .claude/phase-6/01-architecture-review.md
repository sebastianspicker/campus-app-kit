# Phase 6.1: Architecture Review

You are performing a final architectural assessment of campus-app-kit. Work through items ONE AT A TIME.

Five phases of automated improvement have already been completed (code quality, security, testing, docs, CI). Your job is to step back and assess the big picture.

## Context

This is a pnpm + Turbo monorepo:
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind, Expo Router
- `apps/bff/` — Node.js HTTP server (no framework), Zod validation
- `packages/shared/` — Zod schemas and domain types
- `packages/institutions/` — Institution configuration packs

## Audit Scope

### 1. Structural Sanity
- Does the 4-package structure make sense? Could any package be removed or merged?
- Is `@campus/shared` doing too little or too much?
- Does `@campus/institutions` justify its existence as a separate package?
- Are package boundaries clean (no circular dependencies, no awkward coupling)?

### 2. Abstraction Assessment
- Were any unnecessary abstractions added by previous phases? Remove them.
- Are there missing abstractions where raw code is doing too much?
- Is the BFF's "no framework" approach still appropriate, or has it accumulated enough middleware that Hono/Express would be simpler?
- Check: does every file/module do ONE thing?

### 3. Previous Phase Damage Assessment
Check if previous phases introduced problems:
- Over-engineered type hierarchies (Union types that complicate instead of clarify)
- Premature abstractions (BaseHandler, AbstractProcessor patterns where a function suffices)
- Boilerplate docstrings that say nothing useful
- Over-corrected security (validation where input is already trusted)
- Tests that test implementation details instead of behavior

Read the git diff since the start of the improvement process and review every change.

### 4. Scalability Assessment
- Can a new institution be added by only creating a new pack file?
- Can a new data source type be added without modifying existing code?
- Can the BFF be deployed without the mobile app and vice versa?
- Does the monorepo structure scale for additional apps (web app, admin panel)?

### 5. Caching Strategy Review
Three cache layers exist:
1. BFF server-side cache (`apps/bff/src/utils/cache.ts`)
2. Mobile in-memory cache (`apps/mobile/src/data/cache.ts`)
3. Mobile persistent cache (`apps/mobile/src/data/persistedCache.ts`)

- Is this layering appropriate?
- Are TTLs and eviction policies documented and reasonable?
- Could any cache layer be removed without user-visible impact?

## Key Files

- All `package.json` files (package boundaries)
- `apps/bff/src/server.ts` (BFF architecture)
- `apps/mobile/app/_layout.tsx` (mobile architecture)
- `packages/shared/src/domain/public.ts` (shared contracts)
- Cache files: `apps/bff/src/utils/cache.ts`, `apps/mobile/src/data/cache.ts`, `apps/mobile/src/data/persistedCache.ts`

## Rules

- You have full authority to revert changes from previous phases
- Prefer simplicity over cleverness
- If something was made worse by earlier phases, fix it
- Update `progress.md` under `## Phase 6.1: Architecture Review` after each item
- Work on ONLY ONE item per invocation

## Completion

When the architecture assessment is complete:

<promise>COMPLETE</promise>
