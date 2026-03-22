# Phase 5.3: Developer Experience Polish

You are auditing the developer experience for this monorepo. Work through items ONE AT A TIME.

## Context

This is a pnpm + Turbo monorepo. Developers need to:
1. Clone the repo
2. Install dependencies
3. Set up environment variables
4. Run the BFF and mobile app
5. Run tests, linting, type checking

## Audit Scope

### 1. Clone-to-Running Path
Verify this path works from a completely fresh clone:
```bash
git clone <repo>
cd campus-app-kit
pnpm install
cp .env.example .env  # if needed
INSTITUTION_ID=hfmt pnpm dev
```
- Does `pnpm install` work without errors?
- Are all required env vars documented?
- Does `pnpm dev` start both BFF and mobile successfully?
- How long does the first install + build take?

### 2. Setup Script
Review `scripts/setup-dev.sh`:
- Does it check for correct Node.js version (20+)?
- Does it check for pnpm installation?
- Does it create `.env` files from examples?
- Does it run the initial build?
- Are error messages helpful when something is missing?

### 3. Makefile & Task Runner
Review `Makefile`:
- Are all common tasks represented? (ci, verify, lint, typecheck, test, build, dev)
- Does `make ci` run the same checks as GitHub CI?
- Are targets documented (help target or comments)?
- Do targets use the correct commands?

### 4. Environment Configuration
- Review `.env.example` at root and in each app
- Are all required env vars listed with example/default values?
- Is it clear which vars are required vs optional?
- Is it clear which vars go where (BFF vs mobile)?
- Does the env var documentation match what `config/env.ts` and `utils/env.ts` actually read?

### 5. Editor Configuration
- `.editorconfig`: do settings match actual codebase formatting?
  - Indent style and size (2 spaces for TS/JS)
  - End of line, charset, trailing whitespace
- `.nvmrc`: does it match the CI and `package.json#engines` Node version?
- Check for VSCode settings in `.vscode/` or Cursor settings in `.cursor/`
- Are there recommended extensions documented?

### 6. Error Messages & Diagnostics
- What happens when you run `pnpm dev` without `INSTITUTION_ID` set?
- What happens when you run `pnpm build` with a TypeScript error?
- Are error messages from the BFF startup actionable?
- Does the verify script give clear output on failure?

## Key Files

- `scripts/setup-dev.sh`, `scripts/verify-production-ready.sh`, `scripts/ci-local.sh`
- `Makefile`
- `.editorconfig`, `.nvmrc`
- `.env.example` (root and per-app)
- `apps/bff/src/config/env.ts`, `apps/mobile/src/utils/env.ts`
- `README.md` (setup section)

## Rules

- Actually trace the setup path — don't assume it works
- Fix issues directly when they're in config files or scripts
- Document any gaps between README claims and actual experience
- Update `progress.md` under `## Phase 5.3: Developer Experience Polish` after each item
- Work on ONLY ONE item per invocation

## Completion

When a new developer could clone and run the project following only the README:

<promise>COMPLETE</promise>
