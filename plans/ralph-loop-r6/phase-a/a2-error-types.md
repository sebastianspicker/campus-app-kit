# Sub-Phase A.2: Discriminated Union Error Types

## Context
You are working on campus-app-kit, a pnpm+Turbo monorepo. The BFF uses hand-rolled error handling. Your task is to create typed error responses using discriminated unions.

## Implementation Plan

### Step 1: Create error types in shared package
Create `packages/shared/src/domain/errors.ts`:
```typescript
import { z } from 'zod';

export const ErrorKind = {
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  UPSTREAM: 'upstream',
  RATE_LIMITED: 'rate_limited',
  INTERNAL: 'internal',
  TIMEOUT: 'timeout',
} as const;

// Define Zod schemas for each error kind, then infer types
// Use discriminated union on 'kind' field
```

### Step 2: Export from shared index
Update `packages/shared/src/index.ts` to export error types.

### Step 3: Use in BFF error handler
Update `apps/bff/src/utils/errorHandler.ts` to produce typed error responses.

### Step 4: Type route error paths
Update `apps/bff/src/routes/*.ts` to use the new error types.

## Rules
- All error types must use Zod schemas with `z.infer<>` for type derivation
- Discriminated on `kind` field (string literal union)
- HTTP status codes mapped per error kind
- NO runtime behavior changes in this sub-phase
- Preserve all existing error messages
- Run `pnpm typecheck` after each file change

## Acceptance Criteria
- [ ] `packages/shared/src/domain/errors.ts` exists with discriminated union
- [ ] BFF error handler produces typed responses
- [ ] `pnpm lint && pnpm typecheck && pnpm test` passes
