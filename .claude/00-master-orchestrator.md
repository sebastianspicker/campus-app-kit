# Master Orchestrator: campus-app-kit Full Repo Improvement

You are orchestrating a 6-phase improvement of the campus-app-kit TypeScript monorepo. Each phase has its own orchestrator that manages sub-phases. Your job is to sequence the phases, enforce validation gates, and track overall progress.

## Repo Context

This is a pnpm + Turbo monorepo:
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind, Expo Router
- `apps/bff/` — Node.js HTTP server (no framework), Zod validation
- `packages/shared/` — Zod schemas and domain types
- `packages/institutions/` — Institution configuration packs

## Phase Sequence

| Phase | Name | Orchestrator | Depends on |
|-------|------|-------------|------------|
| 1 | Discovery & Analysis (read-only) | `.claude/phase-1/00-orchestrator.md` | — |
| 2 | Code Quality & Refactoring | `.claude/phase-2/00-orchestrator.md` | Phase 1 |
| 3 | Security Review | `.claude/phase-3/00-orchestrator.md` | Phase 2 |
| 4 | Testing Gaps | `.claude/phase-4/00-orchestrator.md` | Phase 2 |
| 5 | Documentation, CI & DX | `.claude/phase-5/00-orchestrator.md` | Phases 2, 3, 4 |
| 6 | Final Review (Opus) | `.claude/phase-6/00-orchestrator.md` | Phases 1–5 |

## Process

1. Read `progress.md`
2. Find the first phase without a `## PHASE N COMPLETE` marker
3. Read that phase's orchestrator file
4. Follow its instructions to execute each sub-phase in order
5. When all sub-phases in the phase are done, run the validation gate
6. If the gate passes, write `## PHASE N COMPLETE` to `progress.md` and advance
7. If the gate fails, re-enter the current phase to fix regressions
8. After Phase 6, write `## ALL PHASES COMPLETE` to `progress.md`

## Validation Gates

- **After Phase 1:** None (read-only phase)
- **After Phase 2:** `pnpm lint && pnpm typecheck && pnpm test`
- **After Phase 3:** `pnpm lint && pnpm typecheck && pnpm test` + all CRITICAL/HIGH security findings addressed
- **After Phase 4:** `pnpm test` (all tests pass, including new ones)
- **After Phase 5:** `pnpm run verify` (full production readiness check)
- **After Phase 6:** `pnpm run verify` (final)

## Rules

- Never skip a phase
- Never advance if a validation gate fails
- One sub-phase at a time within each phase
- Update `progress.md` after every item within a sub-phase
- Work on ONLY ONE item per invocation
- If a previous phase's changes break something, fix it before advancing

## Completion

When all 6 phases are complete and the final validation gate passes:

<promise>ALL PHASES COMPLETE</promise>
