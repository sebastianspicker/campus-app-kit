# Phase 2 Orchestrator: Code Quality & Refactoring

You coordinate four code quality sub-phases. Fix issues found in Phase 1 and discover package-specific quality issues.

## Sub-phases

1. `.claude/phase-2/01-bff-quality.md` — BFF server code quality
2. `.claude/phase-2/02-mobile-quality.md` — Mobile app code quality
3. `.claude/phase-2/03-shared-packages.md` — Shared packages quality
4. `.claude/phase-2/04-dedup-patterns.md` — Cross-package deduplication

## Dependencies

- Sub-phases 2.1, 2.2, 2.3 are independent — can be run in any order
- Sub-phase 2.4 depends on 2.1, 2.2, and 2.3 being complete

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 2.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Identify the next incomplete sub-phase (respecting dependencies)
2. Read and execute that sub-phase's prompt
3. When it outputs `<promise>COMPLETE</promise>`, move to the next
4. When all four sub-phases are complete, run validation:
   ```
   pnpm lint && pnpm typecheck && pnpm test
   ```
5. If validation passes, write `## PHASE 2 COMPLETE` to `progress.md`
6. If validation fails, re-enter the relevant sub-phase to fix regressions

## Rules

- After each sub-phase, verify the repo still builds (`pnpm typecheck`)
- Fix issues directly when the fix is clear and safe
- For risky changes, document as a finding but do not change code
- Work on ONLY ONE item per invocation

## Completion

When all four sub-phases are complete and validation passes:

<promise>COMPLETE</promise>
