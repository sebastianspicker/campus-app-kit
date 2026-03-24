# Sub-Phase B.3: Institution Pack Data Validation Tests

## Context
You are working on campus-app-kit's `packages/institutions/`. There are 3 institution packs: `hfmt`, `example`, `mockuni`. Your task is to validate their data integrity.

## Files to Create
- `packages/institutions/src/__tests__/packData.test.ts`

## Test Cases
1. Every registered pack has required fields: `id`, `name`, `bffBaseUrl` (or equivalent)
2. All URL fields use HTTPS (not HTTP)
3. No duplicate institution IDs across packs
4. Connector config keys match available connector types
5. Pack type exports match the expected interface from `@campus/shared`
6. All packs load without throwing

## Rules
- Import packs through the public API (`@campus/institutions`)
- Do NOT test internal implementation details
- Run `pnpm test` after creation

## Acceptance Criteria
- [ ] All 3 institution packs validated
- [ ] Tests catch any structural issues
- [ ] `pnpm test` passes
