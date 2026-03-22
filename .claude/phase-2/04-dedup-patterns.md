# Phase 2.4: Cross-Package Deduplication

You are identifying and resolving code duplication across workspace packages. Work through items ONE AT A TIME.

## Context

This monorepo has 4 workspace packages. Patterns that appear in multiple packages may represent:
- Genuine duplication that should be extracted to `@campus/shared`
- Intentional divergence (different requirements per package)
- Accidental drift (started the same, evolved separately)

## Audit Scope

### 1. Cache Implementations
Compare:
- `apps/bff/src/utils/cache.ts` (server-side in-memory cache)
- `apps/mobile/src/data/cache.ts` (client-side in-memory cache)

Both likely use `Map<string, CacheEntry>` with TTL and eviction. Determine:
- Are they structurally similar enough to share a base from `@campus/shared`?
- Or do server vs client constraints justify separate implementations?
- Document the decision with rationale

### 2. Error Types
Compare:
- `apps/bff/src/utils/errors.ts` (server error formatting)
- `apps/mobile/src/api/errors.ts` (client error handling)

Check: are error shapes aligned? Could a shared error type improve type safety across the HTTP boundary?

### 3. Fetch Helpers
Compare:
- `apps/bff/src/utils/fetch.ts` (server-side fetch with timeout)
- `apps/mobile/src/utils/fetchHelpers.ts` (client-side fetch with timeout)

Both likely implement abort/timeout patterns. Is there a shared utility worth extracting?

### 4. Type Duplication
- Check if `PublicEvent` in `apps/bff/src/connectors/public/hfmtWebEvents.ts` duplicates `@campus/shared`
- Check if `apps/mobile/src/api/types.ts` re-exports or duplicates shared types
- Look for any `interface` or `type` defined locally that matches a Zod-inferred type from shared
- Verify BFF route handlers use types from `@campus/shared`, not local definitions

### 5. Filter/Query Patterns
Compare:
- BFF filter parsers in `apps/bff/src/utils/filterHelpers.ts` and `queryParams.ts`
- Mobile filter option types used in hooks and components

Are the filter shapes (search, date range, campus, pagination) aligned between server and client?

### 6. Configuration Patterns
- Compare environment loading between BFF (`config/env.ts`) and mobile (`utils/env.ts`, `utils/bffConfig.ts`)
- Check for duplicated validation logic

## Decision Framework

For each duplication found, choose one:

| Decision | When to use |
|----------|-------------|
| **Extract to `@campus/shared`** | Both sides need the exact same logic; no platform-specific behavior |
| **Keep separate with justification** | Platform constraints differ (Node.js vs React Native); document why |
| **Consolidate in one package** | One side's implementation is clearly better; the other should import it |
| **Align interfaces only** | Implementations differ but should share type contracts |

## Rules

- Read both implementations side by side before deciding
- Prefer keeping things separate over premature abstraction
- If extracting to shared, verify both consumers can use the shared code
- If keeping separate, add a comment explaining why duplication is intentional
- Update `progress.md` under `## Phase 2.4: Cross-Package Deduplication` after each item
- Work on ONLY ONE item per invocation

## Completion

When all cross-package duplication has been analyzed and decisions made:

<promise>COMPLETE</promise>
