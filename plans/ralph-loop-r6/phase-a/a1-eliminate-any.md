# Sub-Phase A.1: Eliminate Implicit `any` and Unsafe Type Assertions

## Context
You are working on a pnpm+Turbo TypeScript monorepo (campus-app-kit). Your task is to eliminate all implicit and explicit `any` types from source code.

## Files to Inspect and Fix
1. `apps/mobile/src/api/client.ts` — `anyErr.status` pattern on line ~19
2. `apps/bff/src/connectors/public/hfmtWebEvents.ts` — `anyFailed` variable on line ~70
3. `apps/bff/src/utils/fetch.ts` — check all error handling for untyped catches
4. `apps/bff/src/utils/cache.ts` — check generic type parameters
5. `apps/mobile/src/hooks/usePublicResource.ts` — check return type inference
6. `apps/mobile/src/ui/Skeleton.tsx` — check prop types
7. `apps/bff/src/server.ts` — check error handling
8. `apps/bff/src/__tests__/setup.ts` — allowed (test infrastructure)

## Rules
- Replace `: any` with proper types or `unknown` + type narrowing
- Replace `as any` with proper type assertions or generics
- All `catch (e)` blocks should use `catch (e: unknown)` with narrowing
- Test setup files (`.test.ts`, `__tests__/setup.ts`) may use `any` if unavoidable
- Do NOT change runtime behavior — type-only changes
- Run `pnpm typecheck` after every file change

## Acceptance Criteria
- Zero `: any` or `as any` in source code (excluding test infrastructure)
- All catch blocks use `unknown` and narrow properly
- `pnpm lint && pnpm typecheck && pnpm test` passes

## Verification
```bash
# Check for remaining any usage
grep -rn ": any\|as any" --include="*.ts" --include="*.tsx" apps/ packages/ | grep -v node_modules | grep -v __tests__ | grep -v ".test."
# Must return empty

pnpm lint && pnpm typecheck && pnpm test
```
