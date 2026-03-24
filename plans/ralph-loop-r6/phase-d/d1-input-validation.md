# Sub-Phase D.1: Route Input Validation Audit

## Context
You are working on campus-app-kit's BFF (`apps/bff/`). Your task is to audit every route for input validation completeness.

## Files to Inspect
- `apps/bff/src/routes/schedule.ts`
- `apps/bff/src/routes/events.ts`
- `apps/bff/src/routes/rooms.ts`
- `apps/bff/src/routes/today.ts`
- `apps/bff/src/utils/queryParams.ts`

## Audit Checklist Per Route
1. [ ] All query params parsed through Zod (not raw string extraction)
2. [ ] Invalid params return 400 with safe error message
3. [ ] Error messages don't include stack traces, file paths, or internal details
4. [ ] No string interpolation into downstream URLs without `encodeURIComponent`
5. [ ] All numeric params have bounds (min/max)
6. [ ] All string params have max length

## Rules
- If validation is missing, add it using Zod `.parse()` or `.safeParse()`
- Error responses must be JSON: `{ error: "descriptive message" }`
- Do NOT leak internal details in error messages
- Preserve existing valid behavior
- Run `pnpm typecheck && pnpm test` after changes

## Acceptance Criteria
- [ ] Every route validates ALL inputs via Zod before processing
- [ ] Error responses are safe (no internal detail leakage)
- [ ] Existing tests still pass
