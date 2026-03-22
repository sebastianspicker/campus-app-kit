# Phase 1.3: Type Architecture Audit

You are auditing the TypeScript type system usage across campus-app-kit. This is READ-ONLY — document findings in `progress.md`, do not change code.

## Context

This is a pnpm + Turbo monorepo with 4 workspace packages:
- `apps/mobile/` — Expo 51, React Native 0.74, NativeWind, Expo Router
- `apps/bff/` — Node.js HTTP server (no framework), Zod validation
- `packages/shared/` — Zod schemas and domain types (source of truth)
- `packages/institutions/` — Institution configuration packs

## Audit Scope

### 1. Type Flow Tracing
Trace the full type flow through the system:
```
@campus/shared (Zod schemas)
  → @campus/institutions (InstitutionPack configs)
  → @campus/bff (route handlers, connectors)
  → HTTP response (JSON)
  → @campus/mobile (API client, Zod parse)
  → React hooks
  → UI components
```
- Verify types are consistent at each boundary
- Check if Zod `.parse()` or `.safeParse()` is used at the BFF→mobile boundary
- Verify the mobile API client validates responses against shared schemas

### 2. Type Safety Issues
- Search for `any` types across all workspaces (`grep -r ": any" --include="*.ts" --include="*.tsx"`)
- Search for `as` type assertions that bypass safety (especially `as Record<string, unknown>`)
- Search for `@ts-ignore` and `@ts-expect-error` comments
- Check for implicit `any` (functions without parameter types)
- Verify all public API function signatures have explicit return types

### 3. Type Duplication
- Check if `PublicEvent` in `apps/bff/src/connectors/public/hfmtWebEvents.ts` duplicates the one from `@campus/shared`
- Check `apps/mobile/src/api/types.ts` — does it re-export or duplicate shared types?
- Look for any manual TypeScript `interface` or `type` that duplicates a Zod-inferred type
- Verify `InstitutionPack` type used in `apps/bff/src/config/loader.ts` comes from `@campus/shared`

### 4. Zod Schema Design
- Review `packages/shared/src/domain/public.ts` for schema strictness:
  - Is `date` field `z.string()` or `z.string().datetime()`? Should it enforce ISO format?
  - Are optional fields correctly marked with `.optional()` vs `.nullable()`?
  - Are array fields bounded (`.max()`) to prevent unbounded responses?
- Check if any BFF route handler defines inline Zod schemas that should be in `@campus/shared`
- Verify schema exports from `packages/shared/src/index.ts` are complete

### 5. Strict Mode Enforcement
- Verify `strict: true` is in `tsconfig.base.json` and inherited by all workspaces
- Check for any per-file `// @ts-nocheck` directives
- Check if `noUncheckedIndexedAccess` is enabled (catches `array[i]` being possibly undefined)
- Check if `exactOptionalPropertyTypes` is enabled

## Key Files

- `packages/shared/src/domain/public.ts` — source of truth for all domain types
- `packages/shared/src/index.ts` — export barrel
- `packages/institutions/src/packs.ts` — institution pack registry (has `as Record<string, unknown>` cast)
- `apps/bff/src/connectors/public/hfmtWebEvents.ts` — may have duplicate `PublicEvent` type
- `apps/bff/src/config/loader.ts` — institution pack loader
- `apps/mobile/src/api/types.ts` — mobile type re-exports
- `apps/mobile/src/data/publicApi.ts` — Zod parse at the mobile boundary
- All `tsconfig.json` files

## Rules

- Read actual source files and trace actual imports before making any judgment
- Document findings with exact file paths, line numbers, and code snippets
- Do NOT change any code — document only
- Update `progress.md` under `## Phase 1.3: Type Architecture` after each item
- Work on ONLY ONE item per invocation

## Completion

When all type system aspects have been audited and findings documented:

<promise>COMPLETE</promise>
