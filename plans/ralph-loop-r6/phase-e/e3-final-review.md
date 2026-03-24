# Sub-Phase E.3: Final Adversarial Review

## Context
You are the final reviewer for campus-app-kit's Ralph Loop Round 6. All phases A–D are complete. Your job is adversarial: try to find problems.

## Checklist

### Build Verification
- [ ] `pnpm verify` passes clean (zero warnings, zero errors)
- [ ] `pnpm build` produces clean output

### Code Hygiene
- [ ] Grep for `TODO`, `FIXME`, `HACK` — log any found
- [ ] Grep for `console.log` in source (not test) files — should use logger utility
- [ ] No test files import from `dist/` (must use `src/`)
- [ ] All `*.test.ts` files are actually discovered by vitest

### Type Safety
- [ ] `pnpm typecheck` passes
- [ ] No `as any` in source files (excluding test setup)
- [ ] No `@ts-ignore` or `@ts-expect-error` without justification

### Test Health
- [ ] All tests pass
- [ ] No skipped tests (`.skip`)
- [ ] No focused tests (`.only`)
- [ ] Test count increased from baseline (339)

### Spot Checks
Pick 5 random source files and verify:
- [ ] Functions under 50 lines
- [ ] Files under 800 lines
- [ ] Proper error handling
- [ ] No hardcoded secrets or URLs
- [ ] Consistent naming conventions

## Verification Commands
```bash
pnpm verify
grep -rn "TODO\|FIXME\|HACK" --include="*.ts" --include="*.tsx" apps/ packages/ | grep -v node_modules
grep -rn "console\.log" --include="*.ts" --include="*.tsx" apps/ packages/ | grep -v node_modules | grep -v __tests__ | grep -v ".test."
grep -rn "\.skip\|\.only" --include="*.test.ts" --include="*.test.tsx" apps/ packages/
grep -rn "@ts-ignore\|@ts-expect-error" --include="*.ts" --include="*.tsx" apps/ packages/ | grep -v node_modules
```

## Outcome
Log all findings in `plans/ralph-loop-r6/progress.md`.

If clean, append:
```
## PHASE E COMPLETE
## ALL PHASES COMPLETE
```
