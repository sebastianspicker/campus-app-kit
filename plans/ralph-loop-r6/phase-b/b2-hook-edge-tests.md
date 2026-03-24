# Sub-Phase B.2: Mobile Hook Edge-Case Tests

## Context
You are working on campus-app-kit's mobile app (`apps/mobile/`). Custom hooks in `src/hooks/` handle data fetching. Your task is to add edge-case tests.

## Files to Modify/Create
- `apps/mobile/src/hooks/__tests__/useSchedule.test.ts` — Add edge cases
- `apps/mobile/src/hooks/__tests__/useEvents.test.ts` — Add edge cases
- `apps/mobile/src/hooks/__tests__/useRooms.test.ts` — Add edge cases
- `apps/mobile/src/hooks/__tests__/useToday.test.ts` — Create if missing

## Test Cases Per Hook
1. **Network error**: Mock fetch to reject → hook returns error state
2. **Empty response**: API returns `[]` → hook returns empty array, no crash
3. **Stale cache**: Cache has data, API fails → hook returns stale data with flag
4. **Concurrent calls**: Multiple rapid invocations → only one fetch in flight
5. **Unmount safety**: Unmount component while fetch pending → no state update warning

## Rules
- Use `@testing-library/react-hooks` or `renderHook` from `@testing-library/react`
- Mock `fetch` globally per test, clean up in `afterEach`
- Use `vi.useFakeTimers()` for timing-dependent tests
- Do NOT modify hook source code — test-only changes
- Run `pnpm test` after modifications

## Acceptance Criteria
- [ ] At least 3 new edge-case tests per hook
- [ ] All tests pass with no warnings
- [ ] No "state update on unmounted component" warnings
