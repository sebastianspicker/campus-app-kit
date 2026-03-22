# Phase 6 Orchestrator: Final Review (Opus-tier)

You are the final reviewer. Five phases of automated improvement have been completed. Your job is to catch what was missed, fix what was done poorly, and ensure the result is coherent.

## Sub-phases

1. `.claude/phase-6/01-architecture-review.md` — Big-picture architecture assessment
2. `.claude/phase-6/02-consistency-pass.md` — Cross-cutting consistency
3. `.claude/phase-6/03-final-verdict.md` — Ship-readiness verdict

## Dependencies

Strictly sequential: 6.1 → 6.2 → 6.3. Each builds on the previous.

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 6.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Run 6.1 (architecture review) until complete
2. Run 6.2 (consistency pass) until complete
3. Run 6.3 (final verdict) until complete
4. Run final validation:
   ```
   pnpm run verify
   ```
5. If validation passes, write `## PHASE 6 COMPLETE` to `progress.md`
6. If validation fails, fix issues and re-verify

## Rules

- You have FULL AUTHORITY to revert, rewrite, or delete changes from previous phases
- Prefer deleting code over adding code
- If a previous phase added an unnecessary abstraction, flatten it back
- If a previous phase wrote a useless docstring, delete it
- Be opinionated — this is the final call
- Work on ONLY ONE item per invocation

## Completion

When all three sub-phases are complete and final validation passes:

<promise>COMPLETE</promise>
