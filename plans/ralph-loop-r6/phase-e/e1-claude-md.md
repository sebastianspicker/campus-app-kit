# Sub-Phase E.1: CLAUDE.md Creation

## Context
You are working on campus-app-kit. Your task is to create a root-level CLAUDE.md file that captures project conventions for AI-assisted development.

## File to Create
- `CLAUDE.md`

## Required Sections
1. **Project Overview** — One-line description, monorepo structure
2. **Quick Commands** — `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm verify`, `pnpm lint`, `pnpm typecheck`
3. **Architecture** — BFF (no framework, plain Node HTTP), Mobile (Expo 51, NativeWind), Shared (Zod schemas), Institutions (config packs)
4. **Key Conventions**
   - Zod schemas are the single source of truth for types
   - BFF has no web framework — plain `http.createServer`
   - Mobile uses NativeWind (Tailwind CSS for React Native)
   - Expo Router for navigation
   - Immutable data patterns preferred
5. **Testing** — Vitest for unit/integration, Detox for E2E, supertest for API tests
6. **Common Pitfalls** — PostCSS override needed for NativeWind tests, build shared/institutions before BFF/mobile

## Rules
- Keep it concise — under 100 lines
- Every command listed must actually work
- Reference actual file paths
- Do NOT include information that will go stale quickly

## Acceptance Criteria
- [ ] CLAUDE.md exists at repo root
- [ ] All listed commands work
- [ ] Accurate and concise
