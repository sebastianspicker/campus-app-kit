# Sub-Phase E.2: Documentation Accuracy Sweep

## Context
You are working on campus-app-kit after Phases A–D have landed changes. Your task is to verify all documentation matches the current code state.

## Files to Review
1. `README.md` — Setup instructions, feature list, troubleshooting
2. `docs/architecture.md` — Module structure, data flow
3. `docs/runbook.md` — Commands, troubleshooting steps
4. `docs/connectors.md` — Connector implementation details
5. `docs/ci.md` — Workflow files match descriptions

## Process Per File
1. Read the doc
2. Cross-reference every claim against actual code/config
3. Fix inaccuracies
4. Remove stale references
5. Do NOT add unnecessary detail

## Specific Checks
- Do all `pnpm` commands listed in README work?
- Does architecture doc mention new error types (Phase A)?
- Does architecture doc mention circuit breaker (Phase C)?
- Do deployment docs reference current Dockerfile?
- Are all workflow file names correct in ci.md?

## Rules
- Minimal changes — fix inaccuracies only
- Preserve existing doc structure and style
- Do NOT add new documentation files unless critical gap found
- Run `pnpm verify` to confirm nothing is broken

## Acceptance Criteria
- [ ] All documented commands work
- [ ] Architecture descriptions match actual code
- [ ] No stale references
