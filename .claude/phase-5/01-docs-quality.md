# Phase 5.1: Documentation Quality

You are auditing all documentation for quality and AI-generated writing artifacts. Work through items ONE AT A TIME.

## Context

Documentation exists in:
- `README.md` — project overview and quickstart
- `docs/` — architecture, runbook, connectors, institutions, CI, release, FAQ, threat model
- `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`
- `apps/bff/README.md`, `apps/mobile/e2e/README.md` (if they exist)
- Inline JSDoc comments and code comments throughout the source

## Audit Scope

### 1. AI Slop Detection
Scan ALL markdown files for these patterns and rewrite them:
- Overuse of: "robust", "comprehensive", "seamless", "leverage", "harness", "empower", "cutting-edge", "delve", "it's important to note", "in today's world"
- Unnecessary hedging: "This might be useful for...", "You may want to consider..."
- Filler sentences: "This section covers...", "In this guide, we will..."
- Overly enthusiastic tone: "Amazing!", "Super easy!"
- Lists of three with escalating adjectives ("fast, reliable, and incredibly powerful")
- **Bold** or *italic* used mid-sentence for emphasis (acceptable only in headings and definition terms)

### 2. Writing Style
Apply these principles:
- Direct, matter-of-fact tone — like a colleague explaining at a whiteboard
- Vary sentence length. Mix short and long.
- Use "you" and "your" naturally. Active voice over passive.
- Contractions are fine ("don't", "it's", "you'll")
- If something is obvious, don't explain it
- Code comments: explain WHY, not WHAT

### 3. Documentation Accuracy
- Verify README quickstart works from a fresh clone
- Verify `docs/architecture.md` matches the actual current architecture
- Verify `docs/runbook.md` commands are current and correct
- Verify `docs/connectors.md` matches the actual connector interface
- Verify `docs/institutions.md` matches the actual institution pack structure
- Check all code examples against the current source — are they copy-pasteable?

### 4. Documentation Consistency
- Do README, runbook, and architecture docs tell the same story?
- Are there contradictions between different documentation sources?
- Is terminology consistent? (e.g., "institution pack" vs "institution config" vs "institution bundle")

### 5. Inline Code Comments
- Remove comments that restate the code (`// Initialize the database` above `db.init()`)
- Keep comments that explain non-obvious decisions, workarounds, or tradeoffs
- Verify JSDoc adds information beyond what the function name and types already convey
- If a JSDoc comment says nothing useful, remove it entirely (no docstring > bad docstring)

## Key Files

- `README.md`
- `docs/architecture.md`, `docs/runbook.md`, `docs/connectors.md`, `docs/institutions.md`
- `docs/ci.md`, `docs/release.md`, `docs/faq.md`, `docs/threat-model-lite.md`
- `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`
- All source files with JSDoc (focus on heavily-commented files)

## Rules

- Read every documentation file before making changes
- When rewriting, preserve ALL technical information — change style, not substance
- Do not add new sections or features to documentation
- Verify code examples against current source before claiming they're correct
- Update `progress.md` under `## Phase 5.1: Documentation Quality` after each item
- Work on ONLY ONE item per invocation

## Completion

When all documentation has been reviewed and improved:

<promise>COMPLETE</promise>
