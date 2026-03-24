# Phase E: DX & Final Review

> Polish developer experience and run final verification.
> Runs LAST — after all other phases are merged.

## Context Brief

This is the final phase. All functional changes from Phases A–D are landed.
Focus: DX improvements, documentation accuracy, and a final adversarial review.

## Sub-Phases

### E.1: CLAUDE.md Creation

**Scope:** Create a root-level CLAUDE.md capturing project conventions for AI-assisted development.

**File to create:**
- `CLAUDE.md` — Project conventions, architecture summary, common commands

**Content should include:**
- Monorepo structure overview
- Build/test/lint commands
- Key conventions (Zod schemas as source of truth, no framework in BFF, NativeWind in mobile)
- Testing strategy and minimum coverage expectations
- Institution pack pattern
- Common pitfalls and gotchas

**Acceptance criteria:**
- [ ] CLAUDE.md exists and is accurate
- [ ] All commands listed actually work

### E.2: Documentation Accuracy Sweep

**Scope:** Verify all docs match current code state after Round 6 changes.

**Files to review:**
- `README.md` — Setup instructions, feature list
- `docs/architecture.md` — Matches actual module structure
- `docs/runbook.md` — Commands and troubleshooting steps work
- `docs/connectors.md` — Matches connector implementation
- `docs/ci.md` — Matches workflow files

**Process:**
1. Read each doc
2. Cross-reference against actual code/config
3. Fix any inaccuracies or missing information
4. Do NOT add unnecessary detail — keep docs concise

**Acceptance criteria:**
- [ ] All documented commands work
- [ ] Architecture diagrams match actual structure
- [ ] No stale references to removed/renamed code

### E.3: Final Adversarial Review

**Scope:** Full-repo adversarial pass as a separate review agent.

**Checklist:**
- [ ] Run `pnpm verify` — must pass clean
- [ ] Grep for `TODO`, `FIXME`, `HACK` — log any outstanding items
- [ ] Grep for `console.log` in source (not test) files — should be logger only
- [ ] Verify no test files import from `dist/` (should use `src/`)
- [ ] Check all `*.test.ts` files actually run (not orphaned)
- [ ] Spot-check 5 random source files for code quality
- [ ] Verify `pnpm build` produces clean output (no warnings)

**Acceptance criteria:**
- [ ] `pnpm verify` passes
- [ ] No critical issues found
- [ ] All findings logged in progress.md

## Validation Gate

```bash
pnpm verify
```

On success, append to `plans/ralph-loop-r6/progress.md`:
```
## PHASE E COMPLETE
## ALL PHASES COMPLETE
```
