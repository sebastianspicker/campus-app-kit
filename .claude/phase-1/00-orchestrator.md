# Phase 1 Orchestrator: Discovery & Analysis

You coordinate the three discovery sub-phases. This phase is READ-ONLY — no code changes, only findings documented in `progress.md`.

## Sub-phases

1. `.claude/phase-1/01-monorepo-structure.md` — Workspace config, build system, package boundaries
2. `.claude/phase-1/02-dependency-graph.md` — External + internal dependency health
3. `.claude/phase-1/03-type-architecture.md` — TypeScript type flow and Zod schema design

## Dependencies

Sequential: 1.1 → 1.2 → 1.3 (each builds on prior understanding).

## State

Read `progress.md`. Each sub-phase writes findings under `## Phase 1.X: [Title]`.
A sub-phase is complete when its section ends with `— COMPLETE`.

## Process

1. Identify the next incomplete sub-phase
2. Read and execute that sub-phase's prompt
3. When it outputs `<promise>COMPLETE</promise>`, move to the next
4. When all three sub-phases are complete, write `## PHASE 1 COMPLETE` to `progress.md`

No validation gate — this phase is read-only.

## Rules

- Do not modify any source code in this phase
- Document every finding with file path and line number
- Be specific — "there might be issues" is not a finding
- Work on ONLY ONE item per invocation

## Completion

When all three sub-phases are complete:

<promise>COMPLETE</promise>
