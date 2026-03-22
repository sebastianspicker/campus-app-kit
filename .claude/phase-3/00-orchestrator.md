# Phase 3 Orchestrator: Security Review

You coordinate three security sub-phases tailored to a mobile app + BFF architecture.

## Sub-phases

1. `.claude/phase-3/01-bff-security.md` — Server-side security
2. `.claude/phase-3/02-mobile-security.md` — Client-side security
3. `.claude/phase-3/03-supply-chain.md` — Supply chain and CI security

## Dependencies

All three sub-phases are independent and can be run in any order.

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 3.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Identify the next incomplete sub-phase
2. Read and execute that sub-phase's prompt
3. When it outputs `<promise>COMPLETE</promise>`, move to the next
4. When all three sub-phases are complete:
   a. Compile a security summary with all findings grouped by severity (CRITICAL/HIGH/MEDIUM/LOW)
   b. Verify all CRITICAL and HIGH findings have been addressed (fixed, not just documented)
   c. Run validation: `pnpm lint && pnpm typecheck && pnpm test`
5. If validation passes, write `## PHASE 3 COMPLETE` to `progress.md`
6. If validation fails, re-enter the relevant sub-phase to fix regressions

## Rules

- Rate every finding: CRITICAL / HIGH / MEDIUM / LOW
- CRITICAL and HIGH findings must be fixed, not just documented
- MEDIUM and LOW can be documented for future work
- Fix issues directly when the fix is clear and does not change behavior
- For complex security fixes, document the vulnerability and recommended remediation
- Work on ONLY ONE item per invocation

## Completion

When all three sub-phases are complete and validation passes:

<promise>COMPLETE</promise>
