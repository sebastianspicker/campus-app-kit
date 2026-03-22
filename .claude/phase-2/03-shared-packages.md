# Phase 2.3: Shared Packages Quality

You are auditing the shared packages for quality issues. Work through items ONE AT A TIME.

## Context

Two shared packages in this monorepo:
- `packages/shared/` — Zod schemas and domain types (the source of truth for the entire system)
- `packages/institutions/` — Institution configuration packs consumed by the BFF

## Audit Scope

### 1. Zod Schema Design (`packages/shared/`)
- Review `src/domain/public.ts` for schema strictness:
  - Is the `date` field `z.string()` or `z.string().datetime()`? Should it enforce ISO 8601?
  - Are optional fields correctly marked `.optional()` vs `.nullable()` vs `.nullish()`?
  - Are string fields bounded (`.max()`) to prevent unbounded data?
  - Are array fields bounded (`.max()`) to prevent unbounded responses?
  - Is `id` field just `z.string()` or should it enforce format (uuid, slug, etc.)?
- Check if any schema should use `.strict()` to reject unknown keys
- Verify `z.infer<typeof Schema>` is used consistently (no manual type definitions that drift from schemas)
- Check if schemas handle forward compatibility (`.passthrough()` vs `.strip()` vs `.strict()`)

### 2. Schema Completeness
- Verify all exports from `packages/shared/src/index.ts` are actually used by consumers
- Check if any BFF route handler or mobile component defines inline types that should be in `@campus/shared`
- Look for response envelope types (pagination, error responses) that could be standardized
- Verify test coverage in `__tests__/publicSchemas.test.ts` — does it test edge cases, not just happy paths?

### 3. Institution Packs (`packages/institutions/`)
- Review `src/packs.ts` — is the `as Record<string, unknown>` type assertion the safest approach?
- Verify `getInstitutionPack` handles edge cases: empty string, `undefined`, numeric IDs
- Check all institution pack data for accuracy:
  - `packs/hfmt.public.ts`: are URLs, campus info, and source configs current?
  - `packs/mockuni.public.ts`: is test data reasonable?
  - `packs/example.public.ts`: is the example useful for onboarding?
- Verify all institution packs validate against `InstitutionPackSchema`
- Check `__tests__/packs.test.ts` coverage

### 4. Package Configuration
- Verify `package.json` `main`, `types`, and `exports` fields match actual build output
- Check `tsconfig.build.json` include/exclude patterns
- Verify build output in `dist/` matches expectations
- Check if source maps are generated (useful for debugging, but should be excluded from production)

## Key Files

- `packages/shared/src/domain/public.ts` — all Zod schemas
- `packages/shared/src/index.ts` — exports barrel
- `packages/shared/src/__tests__/publicSchemas.test.ts`
- `packages/shared/package.json`, `tsconfig.json`, `tsconfig.build.json`
- `packages/institutions/src/packs.ts` — pack registry
- `packages/institutions/src/index.ts`
- `packages/institutions/src/packs/hfmt.public.ts`, `mockuni.public.ts`, `example.public.ts`
- `packages/institutions/src/__tests__/packs.test.ts`
- `packages/institutions/package.json`, `tsconfig.json`, `tsconfig.build.json`

## Rules

- Read actual files before making any judgment
- Fix issues directly when the fix is clear and safe
- Schema changes affect the entire system — be careful and document impact
- Update `progress.md` under `## Phase 2.3: Shared Packages Quality` after each item
- Work on ONLY ONE item per invocation

## Completion

When all shared package files have been reviewed and issues addressed:

<promise>COMPLETE</promise>
