# Phase A: Foundation & Types

> Strengthen the type system foundation before any other improvements.
> This phase runs FIRST — all other phases depend on it.

## Context Brief

The codebase uses strict TypeScript with Zod schemas in `packages/shared`. Round 5 left the codebase green, but there are opportunities to:
- Eliminate remaining implicit `any` usage
- Add discriminated union error types
- Strengthen Zod schema exports with branded types
- Improve type narrowing in connector code

## Sub-Phases

### A.1: Eliminate Implicit `any` and Unsafe Type Assertions

**Files to inspect:**
- `apps/mobile/src/api/client.ts` — `anyErr.status` pattern
- `apps/bff/src/connectors/public/hfmtWebEvents.ts` — `anyFailed` variable
- `apps/bff/src/utils/fetch.ts` — check error handling types
- `apps/bff/src/utils/cache.ts` — check generic types
- `apps/mobile/src/hooks/usePublicResource.ts` — check return types
- `apps/mobile/src/ui/Skeleton.tsx` — check prop types

**Acceptance criteria:**
- [ ] Zero `as any` or `: any` in source code (excluding test setup files)
- [ ] All catch blocks use `unknown` and narrow properly
- [ ] `pnpm typecheck` passes

### A.2: Discriminated Union Error Types

**Scope:** Create typed error responses for the BFF API layer.

**Files to create/modify:**
- `packages/shared/src/domain/errors.ts` — New: discriminated union error types
- `packages/shared/src/index.ts` — Export new error types
- `apps/bff/src/utils/errorHandler.ts` — Use new error types
- `apps/bff/src/routes/*.ts` — Type route error responses

**Acceptance criteria:**
- [ ] Error types use discriminated unions (e.g., `{ kind: 'not_found' } | { kind: 'validation', issues: ZodIssue[] }`)
- [ ] BFF error handler produces typed responses
- [ ] No runtime behavior changes — types only
- [ ] `pnpm typecheck && pnpm test` passes

### A.3: Strengthen Zod Schema Exports

**Scope:** Add `z.infer` type exports alongside schemas, ensure all public API types flow from Zod.

**Files to inspect:**
- `packages/shared/src/domain/public.ts` — Existing schemas
- `packages/shared/src/index.ts` — Exports
- `apps/bff/src/routes/*.ts` — Ensure response types match schema

**Acceptance criteria:**
- [ ] Every Zod schema has a matching `type X = z.infer<typeof xSchema>` export
- [ ] BFF routes use inferred types (not hand-written duplicates)
- [ ] `pnpm typecheck && pnpm test` passes

## Validation Gate

```bash
pnpm lint && pnpm typecheck && pnpm test
```

On success, append to `plans/ralph-loop-r6/progress.md`:
```
## PHASE A COMPLETE
```
