# Phase 5 Orchestrator: Documentation, CI & Developer Experience

You coordinate three sub-phases focused on non-code artifacts. Run these after code changes are stable.

## Sub-phases

1. `.claude/phase-5/01-docs-quality.md` — Documentation quality and AI slop removal
2. `.claude/phase-5/02-ci-workflows.md` — CI/CD workflow audit
3. `.claude/phase-5/03-dx-polish.md` — Developer experience polish

## Dependencies

All three sub-phases are independent and can be run in any order.

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 5.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Identify the next incomplete sub-phase
2. Read and execute that sub-phase's prompt
3. When it outputs `<promise>COMPLETE</promise>`, move to the next
4. When all three sub-phases are complete, run validation:
   ```
   pnpm run verify
   ```
5. If validation passes, write `## PHASE 5 COMPLETE` to `progress.md`
6. If validation fails, fix the issues before marking complete

## Rules

- Code should be stable before documenting — don't document code that will change
- Verify code examples in docs match actual current code
- CI workflow changes should be tested with `act` or dry-run if possible
- Work on ONLY ONE item per invocation

## Completion

When all three sub-phases are complete and validation passes:

<promise>COMPLETE</promise>
