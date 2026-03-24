# Sub-Phase A.3: Strengthen Zod Schema Exports

## Context
You are working on campus-app-kit. The `packages/shared` package exports Zod schemas. Your task is to ensure every schema has a matching inferred TypeScript type export, and BFF routes use those types.

## Files to Inspect
1. `packages/shared/src/domain/public.ts` — All Zod schemas
2. `packages/shared/src/index.ts` — All exports
3. `apps/bff/src/routes/*.ts` — Response types should use `z.infer<>`
4. `apps/mobile/src/hooks/*.ts` — Data types should use shared types

## Implementation
For every `export const fooSchema = z.object({...})`, ensure there is:
```typescript
export type Foo = z.infer<typeof fooSchema>;
```

Then update consumers to import `Foo` from `@campus/shared` instead of defining local types.

## Rules
- Type names: PascalCase, matching schema name without "Schema" suffix
- Export both schema and type from index.ts
- Do NOT duplicate types — single source of truth is the Zod schema
- Run `pnpm build` after changes (packages build types for consumers)
- Run `pnpm typecheck && pnpm test` to verify

## Acceptance Criteria
- [ ] Every Zod schema has a `z.infer<>` type export
- [ ] No hand-written type duplicates in BFF or mobile
- [ ] `pnpm build && pnpm typecheck && pnpm test` passes
