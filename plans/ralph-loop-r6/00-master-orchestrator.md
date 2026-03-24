# Ralph Loop Round 6 — Master Orchestrator

> Autonomous, phased improvement of campus-app-kit.
> Each phase has its own orchestrator. Sub-phases within a phase run sequentially.
> Independent phases run in parallel via DevFleet worktrees.

## Repo Context

pnpm + Turbo monorepo (Node 20, TS 5.5, strict mode):
- `apps/bff/` — Node.js HTTP server, Zod validation, ICS/web connectors
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind, Expo Router
- `packages/shared/` — Zod schemas & domain types
- `packages/institutions/` — Institution configuration packs

**Prior state:** Round 5 complete. 40 test files, 339 tests, all green. `pnpm verify` passes.

## Phase DAG

```
Phase A: Foundation (type safety, error types, schema hardening)
    ↓
Phase B: Test Depth ──────────┐
Phase C: Resilience & Perf ───┤  (parallel — no file overlap)
    ↓                         ↓
Phase D: Security Hardening (depends on B + C)
    ↓
Phase E: DX & Final Review
```

| Phase | Name | Orchestrator | Parallel Group |
|-------|------|-------------|----------------|
| A | Foundation & Types | `phase-a/orchestrator.md` | — (runs first) |
| B | Test Depth | `phase-b/orchestrator.md` | Group 1 |
| C | Resilience & Performance | `phase-c/orchestrator.md` | Group 1 |
| D | Security Hardening | `phase-d/orchestrator.md` | — (after B+C) |
| E | DX & Final Review | `phase-e/orchestrator.md` | — (runs last) |

## Execution Model

Each phase orchestrator:
1. Reads its sub-phase files in order
2. Executes each sub-phase (research → implement → test → verify)
3. Runs validation gate: `pnpm lint && pnpm typecheck && pnpm test`
4. Writes `## PHASE X COMPLETE` to `plans/ralph-loop-r6/progress.md`

### Ralph Loop Rules
- **Max 3 passes** per sub-phase. If still failing after 3, log issue and move on.
- **Author ≠ Reviewer:** Implementation and review happen in separate context windows.
- **No regressions:** Validation gate must pass before advancing.
- **Immutability:** Create new objects, never mutate existing ones.
- **Minimal diff:** Only change what's necessary. No drive-by refactors.

## Validation Gates

- **After Phase A:** `pnpm lint && pnpm typecheck && pnpm test`
- **After Phase B:** `pnpm test` (all tests pass including new ones)
- **After Phase C:** `pnpm verify` (full build + test + lint + typecheck)
- **After Phase D:** `pnpm verify` + no CRITICAL/HIGH security findings
- **After Phase E:** `pnpm verify` (final)

## Completion

When all 5 phases pass their gates, write `## ALL PHASES COMPLETE` to progress.md.
