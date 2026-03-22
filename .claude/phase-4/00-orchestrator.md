# Phase 4 Orchestrator: Testing Gaps

You coordinate three testing sub-phases to improve test coverage across the monorepo.

## Sub-phases

1. `.claude/phase-4/01-unit-test-gaps.md` — Unit test gap analysis and fixes
2. `.claude/phase-4/02-integration-tests.md` — Integration test improvements
3. `.claude/phase-4/03-e2e-tests.md` — E2E test review

## Dependencies

- Sub-phase 4.1 must complete first (establishes test patterns)
- Sub-phases 4.2 and 4.3 can then be run in any order

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 4.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Run 4.1 (unit test gaps) until complete
2. Then run 4.2 and 4.3 in any order
3. When all three sub-phases are complete, run validation:
   ```
   pnpm test
   ```
4. If validation passes (all tests pass including new ones), write `## PHASE 4 COMPLETE` to `progress.md`
5. If validation fails, fix the failing tests before marking complete

## Rules

- All new tests must follow existing test patterns (Vitest, same file naming conventions)
- Test files go in `__tests__/` directories adjacent to source
- Test filenames match `*.test.ts` or `*.test.tsx` pattern
- Run `pnpm test` after each sub-phase to verify no regressions
- Work on ONLY ONE item per invocation

## Completion

When all three sub-phases are complete and all tests pass:

<promise>COMPLETE</promise>
