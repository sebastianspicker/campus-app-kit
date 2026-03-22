# Phase 2.2: Mobile App Code Quality

You are auditing the mobile app code for quality issues. Work through items ONE AT A TIME.

## Context

The mobile app (`apps/mobile/`) is built with:
- Expo 51 + Expo Router 3.5 (file-based routing in `app/`)
- React Native 0.74 + React 18.2
- NativeWind 4.2 (Tailwind CSS for React Native)
- @shopify/flash-list for virtualized lists
- AsyncStorage for offline persistence
- Source code in `src/` (api, auth, components, data, hooks, ui, utils, tw)

## Audit Scope

### 1. React Hook Correctness
- Verify all `useCallback`, `useMemo`, `useEffect` have correct dependency arrays
- Check `usePublicResource` hook for race conditions between mount/unmount and async operations
- Verify AbortController usage: signal propagation from hooks → publicApi → client → fetch
- Check for missing cleanup in `useEffect` return functions
- Look for stale closure bugs (referencing outer state that changes)

### 2. Memory Leak Prevention
- Check for event listeners not cleaned up on unmount
- Check for intervals/timeouts not cleared on unmount
- Verify async operations check mounted state before calling setState
- Look for subscription patterns that don't unsubscribe
- Check if `FlashList`/`FlatList` keyExtractor functions are stable

### 3. Data Layer Quality
- Review `data/publicApi.ts`: are all fetch functions properly typed and handle errors?
- Review `data/persistedCache.ts`: is the offline-first strategy correct? Edge cases?
- Review `data/cache.ts`: in-memory cache eviction and TTL handling
- Check `api/client.ts`: does `getJson()` handle all HTTP error codes?
- Check `api/retry.ts`: does `withRetry` handle edge cases (0 retries, negative delay)?

### 4. UI Component Quality
- Review NativeWind integration in `src/tw/*.tsx` — are all `cssInterop` wrappers needed?
- Check for mixed styling approaches (StyleSheet.create vs NativeWind `className`)
- Verify `FlashList` from `@shopify/flash-list` is used over `FlatList` where performance matters
- Check for hardcoded colors/sizes that should use theme tokens from `ui/theme.ts`
- Verify loading/error/empty states are handled in all screens

### 5. Accessibility
- Check interactive elements for `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`
- Verify touch targets are at least 44x44pt
- Check color contrast ratios (especially in dark mode)
- Verify screen reader navigation order makes sense
- Check that `ErrorBoundary.tsx` and error states are accessible

### 6. Navigation & Routing
- Check Expo Router type safety: are `pathname` and `params` correctly typed?
- Verify deep link handling for all routes
- Check tab navigation accessibility labels
- Verify back navigation works correctly from all detail screens
- Check for navigation state persistence/restoration

## Key Files

- `apps/mobile/src/hooks/usePublicResource.ts` (core data hook)
- `apps/mobile/src/hooks/useToday.ts`, `useEvents.ts`, `useRooms.ts`, `useSchedule.ts`
- `apps/mobile/src/data/publicApi.ts`, `cache.ts`, `persistedCache.ts`
- `apps/mobile/src/api/client.ts`, `retry.ts`, `errors.ts`, `types.ts`
- `apps/mobile/app/(tabs)/*.tsx` (all tab screens)
- `apps/mobile/app/_layout.tsx`, `app/(tabs)/_layout.tsx`
- `apps/mobile/src/ui/*.tsx` (all UI primitives)
- `apps/mobile/src/components/*.tsx` (SearchBar, FilterPanel, ErrorBoundary, OfflineIndicator)
- `apps/mobile/src/tw/*.tsx` (NativeWind wrappers)
- `apps/mobile/src/utils/dateFormat.ts`, `bffConfig.ts`, `fetchHelpers.ts`, `env.ts`

## Rules

- Read actual files before making any judgment
- Fix issues directly when the fix is clear and safe
- For risky changes (especially hook dependency changes), document as a finding
- Update `progress.md` under `## Phase 2.2: Mobile App Code Quality` after each item
- Work on ONLY ONE item per invocation

## Completion

When all mobile source files have been reviewed and issues addressed:

<promise>COMPLETE</promise>
