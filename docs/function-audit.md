# Function Audit

Generated: 2026-04-16

## Scope

- Covers first-party executable functions in `apps/*` and `packages/*`.
- Includes production code, test helpers, e2e helpers, and small config factories where they are part of the repo's authored behavior.
- Excludes dependencies, build output, declaration files, and schema/data-only modules with no executable function bodies.
- Line references are approximate and meant for navigation, not as immutable anchors.

## Repo Familiarization Summary

| Area | What it does |
| --- | --- |
| BFF | Node `http.createServer` API that dispatches public campus data routes and wraps them with CORS, rate limiting, request IDs, security headers, caching, and error handling. |
| Mobile | Expo Router app with public-data screens, reusable UI, offline-aware fetch/cache flows, theming, accessibility helpers, and animation wrappers. |
| Shared | Zod-backed domain contracts and error helpers shared by BFF and mobile. |
| Institutions | Public institution-pack registry and data packs that parameterize the app per campus. |

## Category Taxonomy

| Category | Meaning |
| --- | --- |
| route handler | HTTP or Expo route entrypoint that serves a request |
| route factory | Higher-order route builder used by multiple handlers |
| middleware | Request guard or header mutator in the BFF pipeline |
| connector | Boundary function that fetches or synthesizes external/public data |
| parser / transform helper | Function that parses HTML/ICS/query input or reshapes data |
| resilience / cache helper | Utility for retry, offline mode, caching, rate limiting, timeout, circuit breaker, request IDs, or logging |
| data client | Mobile-side function that calls the BFF and validates payloads |
| hook | React hook for data access, UI state, theming, or animation behavior |
| screen / component | React or Expo Router UI surface |
| theme / a11y / style helper | UI support function for color, accessibility, or styling concerns |
| schema / pack helper | Shared helper tied to contracts or institution-pack lookup |
| test / e2e / config helper | Non-production helper used in tests or runtime configuration |

## BFF Source Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/bff/src/routes/createJsonRoute.ts` | `createJsonRoute` (L13) | route factory |
| `apps/bff/src/routes/events.ts` | `handleEvents` (L8) | route handler |
| `apps/bff/src/routes/events.ts` | `(anonymous loader callback)` (L9) | connector |
| `apps/bff/src/routes/events.ts` | `(anonymous getExtraHeaders callback)` (L33) | resilience / cache helper |
| `apps/bff/src/routes/rooms.ts` | `handleRooms` (L6) | route handler |
| `apps/bff/src/routes/rooms.ts` | `(anonymous loader callback)` (L7) | connector |
| `apps/bff/src/routes/schedule.ts` | `handleSchedule` (L7) | route handler |
| `apps/bff/src/routes/schedule.ts` | `(anonymous loader callback)` (L8) | connector |
| `apps/bff/src/routes/today.ts` | `isValidDateParam` (L8) | parser / transform helper |
| `apps/bff/src/routes/today.ts` | `handleToday` (L12) | route handler |
| `apps/bff/src/routes/today.ts` | `(anonymous loader callback)` (L13) | connector |
| `apps/bff/src/routes/today.ts` | `(anonymous getExtraHeaders callback)` (L56) | resilience / cache helper |
| `apps/bff/src/routes/health.ts` | `formatUptime` (L10) | parser / transform helper |
| `apps/bff/src/routes/health.ts` | `getMemoryStatus` (L22) | parser / transform helper |
| `apps/bff/src/routes/health.ts` | `handleHealth` (L33) | route handler |
| `apps/bff/src/server.ts` | `createRequestListener` (L27) | route handler |
| `apps/bff/src/server.ts` | `(returned request listener)` (L28) | route handler |
| `apps/bff/src/server.ts` | `startServer` (L129) | test / e2e / config helper |
| `apps/bff/src/config/env.ts` | `parsePort` (L21) | test / e2e / config helper |
| `apps/bff/src/config/env.ts` | `parseCsv` (L30) | test / e2e / config helper |
| `apps/bff/src/config/env.ts` | `requireNonEmpty` (L38) | test / e2e / config helper |
| `apps/bff/src/config/env.ts` | `parseIntOrThrow` (L46) | test / e2e / config helper |
| `apps/bff/src/config/env.ts` | `parseTrustProxy` (L52) | test / e2e / config helper |
| `apps/bff/src/config/loader.ts` | `loadInstitutionPack` (L8) | schema / pack helper |
| `apps/bff/src/middleware/authGuard.ts` | `guardAuth` (L10) | middleware |
| `apps/bff/src/middleware/methodGuard.ts` | `guardMethods` (L5) | middleware |
| `apps/bff/src/middleware/securityHeaders.ts` | `guardSecurityHeaders` (L3) | middleware |
| `apps/bff/src/connectors/public/publicSchedule.ts` | `getScheduleBreaker` (L14) | resilience / cache helper |
| `apps/bff/src/connectors/public/publicSchedule.ts` | `resolveFixturePath` (L20) | parser / transform helper |
| `apps/bff/src/connectors/public/publicSchedule.ts` | `toScheduleItem` (L30) | parser / transform helper |
| `apps/bff/src/connectors/public/publicSchedule.ts` | `fetchPublicSchedule` (L41) | connector |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `fetchPublicEvents` (L21) | connector |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractEventsFromHtml` (L99) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractHfmtEvents` (L110) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractGenericEvents` (L176) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `dedupeAndSortEvents` (L217) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractTitle` (L230) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractDate` (L258) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `extractHref` (L288) | parser / transform helper |
| `apps/bff/src/connectors/public/hfmtWebEvents.ts` | `safeResolveUrl` (L302) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `generateStableId` (L20) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `generateRecurringInstanceId` (L28) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `unfoldLines` (L35) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `parseIcsDate` (L57) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `unescapeIcsValue` (L88) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `expandRecurringEvent` (L100) | parser / transform helper |
| `apps/bff/src/connectors/public/icsParser.ts` | `parseIcs` (L185) | parser / transform helper |
| `apps/bff/src/connectors/public/eventId.ts` | `buildEventId` (L15) | parser / transform helper |
| `apps/bff/src/connectors/private-stubs/studiservice.stub.ts` | `fetchRooms` (L4) | connector |
| `apps/bff/src/connectors/private-stubs/studiservice.stub.ts` | `fetchStatus` (L18) | connector |
| `apps/bff/src/connectors/private-stubs/ilias.stub.ts` | `fetchCourses` (L13) | connector |
| `apps/bff/src/connectors/private-stubs/asimut.stub.ts` | `fetchBookings` (L15) | connector |
| `apps/bff/src/utils/queryParams.ts` | `parseQueryParams` (L6) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `getStringParam` (L20) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `getNumberParam` (L32) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `getDateParam` (L48) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `parseEventsFilter` (L78) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `parseScheduleFilter` (L110) | parser / transform helper |
| `apps/bff/src/utils/queryParams.ts` | `parseRoomsFilter` (L139) | parser / transform helper |
| `apps/bff/src/utils/filterHelpers.ts` | `applySearch` (L8) | parser / transform helper |
| `apps/bff/src/utils/filterHelpers.ts` | `applyDateRange` (L21) | parser / transform helper |
| `apps/bff/src/utils/filterHelpers.ts` | `applyPagination` (L48) | parser / transform helper |
| `apps/bff/src/utils/cache.ts` | `evictLru` (L49) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `evictIfOverCap` (L73) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `timeoutPromise` (L79) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `getCached` (L87) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `clearCache` (L145) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `cacheStats` (L159) | resilience / cache helper |
| `apps/bff/src/utils/cache.ts` | `destroyCache` (L168) | resilience / cache helper |
| `apps/bff/src/utils/httpCache.ts` | `sendJsonWithCache` (L4) | resilience / cache helper |
| `apps/bff/src/utils/rateLimit.ts` | `evictIfOverCap` (L11) | resilience / cache helper |
| `apps/bff/src/utils/rateLimit.ts` | `checkRateLimit` (L26) | resilience / cache helper |
| `apps/bff/src/utils/rateLimit.ts` | `clearRateLimitBuckets` (L56) | resilience / cache helper |
| `apps/bff/src/utils/rateLimit.ts` | `getRateLimitSize` (L61) | resilience / cache helper |
| `apps/bff/src/utils/rateLimit.ts` | `maybeCleanup` (L65) | resilience / cache helper |
| `apps/bff/src/utils/cors.ts` | `getCorsHeaders` (L1) | resilience / cache helper |
| `apps/bff/src/utils/errors.ts` | `sendError` (L13) | resilience / cache helper |
| `apps/bff/src/utils/errors.ts` | `sendTypedError` (L43) | resilience / cache helper |
| `apps/bff/src/utils/requestId.ts` | `normalizeRequestId` (L4) | resilience / cache helper |
| `apps/bff/src/utils/requestId.ts` | `getRequestId` (L12) | resilience / cache helper |
| `apps/bff/src/utils/requestId.ts` | `setRequestIdHeader` (L18) | resilience / cache helper |
| `apps/bff/src/utils/logger.ts` | `log` (L3) | resilience / cache helper |
| `apps/bff/src/utils/logger.ts` | `isBlocked` (L31) | resilience / cache helper |
| `apps/bff/src/utils/logger.ts` | `sanitizeContext` (L35) | resilience / cache helper |
| `apps/bff/src/utils/logger.ts` | `sanitizeValue` (L48) | resilience / cache helper |
| `apps/bff/src/utils/fetch.ts` | `fetchWithTimeout` (L8) | resilience / cache helper |
| `apps/bff/src/utils/fetch.ts` | `fetchTextWithTimeout` (L42) | resilience / cache helper |
| `apps/bff/src/utils/circuitBreaker.ts` | `createCircuitBreaker` (L21) | resilience / cache helper |
| `apps/bff/src/utils/circuitBreaker.ts` | `transitionToOpen` (L26) | resilience / cache helper |
| `apps/bff/src/utils/circuitBreaker.ts` | `transitionToClosed` (L31) | resilience / cache helper |
| `apps/bff/src/utils/circuitBreaker.ts` | `shouldAttemptProbe` (L36) | resilience / cache helper |
| `apps/bff/src/utils/circuitBreaker.ts` | `call` (L40) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `normalizeIp` (L5) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `parseForwardedHeader` (L17) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `getClientKey` (L44) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `isPrivateAddress` (L83) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `isPrivateIpv4` (L94) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `isPrivateIpv6` (L109) | resilience / cache helper |
| `apps/bff/src/utils/clientKey.ts` | `isValidIp` (L117) | resilience / cache helper |
| `apps/bff/src/utils/timeZone.ts` | `getFormatter` (L14) | resilience / cache helper |
| `apps/bff/src/utils/timeZone.ts` | `toPartsRecord` (L30) | parser / transform helper |
| `apps/bff/src/utils/timeZone.ts` | `getDateTimeParts` (L38) | parser / transform helper |
| `apps/bff/src/utils/timeZone.ts` | `pad` (L50) | parser / transform helper |
| `apps/bff/src/utils/timeZone.ts` | `getTimeZoneOffsetMs` (L54) | parser / transform helper |
| `apps/bff/src/utils/timeZone.ts` | `getDateKeyInTimeZone` (L71) | parser / transform helper |
| `apps/bff/src/utils/timeZone.ts` | `parseDateTimeInTimeZone` (L81) | parser / transform helper |

## BFF Test Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/bff/src/__tests__/lifecycle.test.ts` | `createMinimalListener` (L9) | test / e2e / config helper |
| `apps/bff/src/__tests__/lifecycle.test.ts` | `listenOnDynamicPort` (L30) | test / e2e / config helper |
| `apps/bff/src/__tests__/lifecycle.test.ts` | `closeServer` (L44) | test / e2e / config helper |
| `apps/bff/src/__tests__/lifecycle.test.ts` | `httpGet` (L53) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/rooms.test.ts` | `createMockResponse` (L7) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/rooms.negative.test.ts` | `createMockResponse` (L6) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/rooms.negative.test.ts` | `createMockRequest` (L36) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/events.test.ts` | `createMockResponse` (L8) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/events.negative.test.ts` | `createMockResponse` (L7) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/events.negative.test.ts` | `createMockRequest` (L37) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/schedule.test.ts` | `createMockResponse` (L9) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/schedule.negative.test.ts` | `createMockResponse` (L8) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/schedule.negative.test.ts` | `createMockRequest` (L42) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/today.test.ts` | `createMockResponse` (L8) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/today.negative.test.ts` | `createMockResponse` (L7) | test / e2e / config helper |
| `apps/bff/src/routes/__tests__/today.negative.test.ts` | `createMockRequest` (L37) | test / e2e / config helper |
| `apps/bff/src/middleware/__tests__/methodGuard.test.ts` | `createMockReqRes` (L5) | test / e2e / config helper |
| `apps/bff/src/middleware/__tests__/securityHeaders.test.ts` | `createMockResponse` (L5) | test / e2e / config helper |
| `apps/bff/src/utils/__tests__/errors.test.ts` | `createMockResponse` (L4) | test / e2e / config helper |
| `apps/bff/src/utils/__tests__/queryParams.test.ts` | `mockReq` (L13) | test / e2e / config helper |
| `apps/bff/src/utils/__tests__/httpCache.test.ts` | `createMockReqRes` (L4) | test / e2e / config helper |
| `apps/bff/src/utils/__tests__/clientKey.test.ts` | `createRequest` (L5) | test / e2e / config helper |

## Mobile App Surface Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/mobile/app/_layout.tsx` | `RootLayout` (L9) | screen / component |
| `apps/mobile/app/(tabs)/_layout.tsx` | `TabIcon` (L13) | screen / component |
| `apps/mobile/app/(tabs)/_layout.tsx` | `TabsLayout` (L23) | screen / component |
| `apps/mobile/app/(tabs)/index.tsx` | `getGreeting` (L16) | theme / a11y / style helper |
| `apps/mobile/app/(tabs)/index.tsx` | `getFormattedDate` (L23) | theme / a11y / style helper |
| `apps/mobile/app/(tabs)/index.tsx` | `TodayScreen` (L31) | screen / component |
| `apps/mobile/app/(tabs)/events.tsx` | `EventsScreen` (L15) | screen / component |
| `apps/mobile/app/(tabs)/rooms.tsx` | `RoomsScreen` (L11) | screen / component |
| `apps/mobile/app/(tabs)/profile.tsx` | `ProfileScreen` (L10) | screen / component |
| `apps/mobile/app/events/[id].tsx` | `EventDetailScreen` (L11) | screen / component |
| `apps/mobile/app/rooms/[id]/index.tsx` | `RoomDetailScreen` (L7) | screen / component |
| `apps/mobile/app/schedule/[id].tsx` | `ScheduleDetailScreen` (L8) | screen / component |
| `apps/mobile/app/(auth)/_layout.tsx` | `AuthLayout` (L4) | screen / component |
| `apps/mobile/app/(auth)/login.tsx` | `LoginScreen` (L9) | screen / component |
| `apps/mobile/app/api/hello+api.ts` | `GET` (L5) | route handler |
| `apps/mobile/app/api/health+api.ts` | `GET` (L5) | route handler |

## Mobile Data And Hooks Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/mobile/src/data/publicApi.ts` | `getPublicCacheKey` (L23) | data client |
| `apps/mobile/src/data/publicApi.ts` | `safeParse` (L39) | data client |
| `apps/mobile/src/data/publicApi.ts` | `getCachedJson` (L54) | data client |
| `apps/mobile/src/data/publicApi.ts` | `fetchEvents` (L93) | data client |
| `apps/mobile/src/data/publicApi.ts` | `fetchRooms` (L119) | data client |
| `apps/mobile/src/data/publicApi.ts` | `fetchToday` (L134) | data client |
| `apps/mobile/src/data/publicApi.ts` | `fetchSchedule` (L150) | data client |
| `apps/mobile/src/data/cache.ts` | `timeoutPromise` (L11) | resilience / cache helper |
| `apps/mobile/src/data/cache.ts` | `evictIfNeeded` (L19) | resilience / cache helper |
| `apps/mobile/src/data/cache.ts` | `getCached` (L30) | resilience / cache helper |
| `apps/mobile/src/data/cache.ts` | `clearCache` (L68) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `getStorage` (L22) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `getPersistedCache` (L48) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `getPersistedCacheEntry` (L53) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `setPersistedCache` (L64) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `markCacheAsOffline` (L73) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `getCacheAge` (L85) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `isCacheStale` (L91) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `clearPersistedCache` (L97) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `fetchWithOfflineSupport` (L137) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `isOfflineData` (L176) | resilience / cache helper |
| `apps/mobile/src/data/persistedCache.ts` | `getCacheStats` (L184) | resilience / cache helper |
| `apps/mobile/src/api/client.ts` | `getJson` (L6) | data client |
| `apps/mobile/src/api/retry.ts` | `withRetry` (L1) | resilience / cache helper |
| `apps/mobile/src/api/retry.ts` | `createAbortError` (L30) | resilience / cache helper |
| `apps/mobile/src/api/retry.ts` | `isHttpLikeError` (L36) | resilience / cache helper |
| `apps/mobile/src/api/retry.ts` | `shouldRetry` (L45) | resilience / cache helper |
| `apps/mobile/src/api/retry.ts` | `backoffWithJitter` (L57) | resilience / cache helper |
| `apps/mobile/src/api/retry.ts` | `sleep` (L71) | resilience / cache helper |
| `apps/mobile/src/api/errors.ts` | `hasErrorField` (L19) | resilience / cache helper |
| `apps/mobile/src/api/errors.ts` | `parseApiError` (L29) | resilience / cache helper |
| `apps/mobile/src/hooks/useSchedule.ts` | `useSchedule` (L6) | hook |
| `apps/mobile/src/hooks/useRooms.ts` | `useRooms` (L6) | hook |
| `apps/mobile/src/hooks/useToday.ts` | `useToday` (L5) | hook |
| `apps/mobile/src/hooks/useEvents.ts` | `useEvents` (L6) | hook |
| `apps/mobile/src/hooks/usePublicResource.ts` | `usePublicResource` (L11) | hook |
| `apps/mobile/src/hooks/useOfflineCache.ts` | `useOfflineCache` (L12) | hook |
| `apps/mobile/src/auth/session.ts` | `getDemoSession` (L16) | test / e2e / config helper |

## Mobile UI Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/mobile/src/components/DegradedBanner.tsx` | `DegradedBanner` (L16) | screen / component |
| `apps/mobile/src/components/FilterPanel.tsx` | `FilterPanel` (L21) | screen / component |
| `apps/mobile/src/components/SearchBar.tsx` | `SearchBar` (L16) | screen / component |
| `apps/mobile/src/components/OfflineIndicator.tsx` | `OfflineIndicator` (L12) | screen / component |
| `apps/mobile/src/components/OfflineIndicator.tsx` | `formatCacheAge` (L69) | theme / a11y / style helper |
| `apps/mobile/src/components/ErrorBoundary.tsx` | `ErrorFallback` (L15) | screen / component |
| `apps/mobile/src/components/ErrorBoundary.tsx` | `ErrorBoundary.getDerivedStateFromError` (L57) | screen / component |
| `apps/mobile/src/components/ErrorBoundary.tsx` | `ErrorBoundary.componentDidCatch` (L61) | screen / component |
| `apps/mobile/src/components/ErrorBoundary.tsx` | `ErrorBoundary.handleReset` (L70) | screen / component |
| `apps/mobile/src/components/ErrorBoundary.tsx` | `ErrorBoundary.render` (L74) | screen / component |
| `apps/mobile/src/ui/ResourceListSection.tsx` | `detectErrorType` (L9) | theme / a11y / style helper |
| `apps/mobile/src/ui/ResourceListSection.tsx` | `ResourceListSection` (L42) | screen / component |
| `apps/mobile/src/ui/ResourceDetailScreen.tsx` | `detectErrorType` (L13) | theme / a11y / style helper |
| `apps/mobile/src/ui/ResourceDetailScreen.tsx` | `ResourceDetailScreen` (L45) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `ChevronRight` (L17) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `ResourceListItemInner` (L25) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `handlePressIn` (L44) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `handlePressOut` (L53) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `handlePress` (L62) | screen / component |
| `apps/mobile/src/ui/ResourceListItem.tsx` | `ResourceListItem` (L128) | screen / component |
| `apps/mobile/src/ui/EmptyState.tsx` | `EmptyState` (L13) | screen / component |
| `apps/mobile/src/ui/Screen.tsx` | `Screen` (L11) | screen / component |
| `apps/mobile/src/ui/LoadingBlock.tsx` | `LoadingBlock` (L4) | screen / component |
| `apps/mobile/src/ui/MetaRow.tsx` | `MetaRow` (L6) | screen / component |
| `apps/mobile/src/ui/Section.tsx` | `Section` (L6) | screen / component |
| `apps/mobile/src/ui/Card.tsx` | `Card` (L7) | screen / component |
| `apps/mobile/src/ui/VirtualizedList.tsx` | `VirtualizedList` (L11) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `Skeleton` (L13) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `SkeletonCard` (L68) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `SkeletonList` (L104) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `SkeletonDetail` (L116) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `SkeletonScheduleItem` (L175) | screen / component |
| `apps/mobile/src/ui/Skeleton.tsx` | `SkeletonSchedule` (L212) | screen / component |
| `apps/mobile/src/ui/ErrorState.tsx` | `getErrorConfig` (L17) | theme / a11y / style helper |
| `apps/mobile/src/ui/ErrorState.tsx` | `ErrorState` (L29) | screen / component |
| `apps/mobile/src/ui/ErrorState.tsx` | `handleGoBack` (L50) | screen / component |
| `apps/mobile/src/ui/ErrorState.tsx` | `NetworkError` (L181) | screen / component |
| `apps/mobile/src/ui/ErrorState.tsx` | `NotFoundError` (L197) | screen / component |
| `apps/mobile/src/ui/ErrorState.tsx` | `GenericError` (L213) | screen / component |
| `apps/mobile/src/ui/ThemeContext.tsx` | `ThemeProvider` (L40) | screen / component |
| `apps/mobile/src/ui/ThemeContext.tsx` | `setPreference` (L74) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `toggleTheme` (L83) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useTheme` (L113) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useThemePreference` (L121) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useThemeColors` (L137) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useThemeUi` (L142) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useIsDarkMode` (L147) | hook |
| `apps/mobile/src/ui/ThemeContext.tsx` | `useSystemTheme` (L153) | hook |
| `apps/mobile/src/ui/theme.ts` | `getThemeColors` (L292) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `getThemeUi` (L296) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `getContrastTextColor` (L300) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `withOpacity` (L310) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `scaled` (L321) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `scaledRadius` (L325) | theme / a11y / style helper |
| `apps/mobile/src/ui/theme.ts` | `scaledFont` (L329) | theme / a11y / style helper |
| `apps/mobile/src/ui/listScreenStyles.ts` | `createListScreenStyles` (L13) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yLabel` (L31) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yButton` (L35) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yLink` (L46) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yImage` (L57) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yHeader` (L66) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yText` (L75) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11ySearch` (L84) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yTab` (L95) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yCheckbox` (L108) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11ySwitch` (L121) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yMenuItem` (L134) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yList` (L145) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yListItem` (L154) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yProgress` (L165) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yAdjustable` (L183) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yDisabled` (L196) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yExpanded` (L208) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yLiveRegion` (L222) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yHidden` (L230) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yFocusable` (L239) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `announceForAccessibility` (L248) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `announceForAccessibilityPolite` (L253) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `isScreenReaderEnabled` (L261) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `isReduceMotionEnabled` (L267) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `isBoldTextEnabled` (L274) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `isGrayscaleEnabled` (L283) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `setAccessibilityFocus` (L293) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yFocusableElement` (L299) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `mergeA11yProps` (L310) | theme / a11y / style helper |
| `apps/mobile/src/ui/a11y.ts` | `a11yActions` (L325) | theme / a11y / style helper |
| `apps/mobile/src/tw/index.tsx` | `useCSSVariable` (L18) | theme / a11y / style helper |
| `apps/mobile/src/tw/index.tsx` | `TouchableHighlightInner` (L47) | screen / component |
| `apps/mobile/src/tw/image.tsx` | `CSSImage` (L8) | screen / component |
| `apps/mobile/src/tw/animated.tsx` | `useReduceMotion` (L15) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useAnimationDuration` (L58) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useAnimationConfig` (L67) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useFadeIn` (L81) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useScaleAnimation` (L99) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useSlideAnimation` (L121) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useFadeSlideAnimation` (L143) | hook |
| `apps/mobile/src/tw/animated.tsx` | `useReducedMotionValue` (L172) | hook |
| `apps/mobile/src/tw/animated.tsx` | `getPlatformAnimation` (L218) | theme / a11y / style helper |
| `apps/mobile/src/utils/env.ts` | `getBffBaseUrl` (L3) | test / e2e / config helper |
| `apps/mobile/src/utils/bffConfig.ts` | `_resetBffBaseUrlMemoForTests` (L4) | test / e2e / config helper |
| `apps/mobile/src/utils/bffConfig.ts` | `resolveBffBaseUrl` (L8) | test / e2e / config helper |
| `apps/mobile/src/utils/bffConfig.ts` | `normalizeBaseUrl` (L34) | theme / a11y / style helper |
| `apps/mobile/src/utils/fetchHelpers.ts` | `parseRetryAfterSeconds` (L20) | resilience / cache helper |
| `apps/mobile/src/utils/fetchHelpers.ts` | `fetchJsonWithTimeout` (L32) | data client |
| `apps/mobile/src/utils/fetchHelpers.ts` | `isErrorBody` (L78) | resilience / cache helper |
| `apps/mobile/src/utils/fetchHelpers.ts` | `parseBffError` (L88) | resilience / cache helper |
| `apps/mobile/src/utils/fetchHelpers.ts` | `linkAbortSignals` (L104) | resilience / cache helper |
| `apps/mobile/src/utils/dateFormat.ts` | `getRelativeTimeFormatter` (L5) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `getShortRelativeTimeFormatter` (L12) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `getRelativeTimeUnit` (L25) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatEventDate` (L78) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatScheduleTime` (L90) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatDateOnly` (L105) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatDateWithWeekday` (L121) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatRelativeTime` (L138) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatShortRelativeTime` (L162) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `isToday` (L178) | theme / a11y / style helper |
| `apps/mobile/src/utils/dateFormat.ts` | `formatTimeRange` (L191) | theme / a11y / style helper |
| `apps/mobile/src/utils/routeItem.ts` | `serializeRouteItem` (L1) | parser / transform helper |
| `apps/mobile/src/utils/routeItem.ts` | `parseRouteItem` (L5) | parser / transform helper |

## Mobile Test And Config Audit

| File | Function | Category |
| --- | --- | --- |
| `apps/mobile/e2e/init.ts` | `waitForElement` (L14) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `waitForElementToExist` (L26) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `tapElement` (L38) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `typeText` (L45) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `clearText` (L55) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `replaceText` (L62) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `scrollToElement` (L72) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `swipeElement` (L86) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementToBeVisible` (L98) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementToExist` (L107) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementToHaveText` (L114) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementToHaveLabel` (L124) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementToHaveValue` (L134) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementNotToBeVisible` (L144) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `expectElementNotToExist` (L153) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `navigateBack` (L162) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `launchAppFresh` (L179) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `relaunchApp` (L186) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `sendAppToBackground` (L193) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `bringAppToForeground` (L200) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `toggleAirplaneMode` (L207) | test / e2e / config helper |
| `apps/mobile/e2e/init.ts` | `wait` (L218) | test / e2e / config helper |
| `apps/mobile/src/hooks/__tests__/testUtils.tsx` | `renderHook` (L4) | test / e2e / config helper |
| `apps/mobile/src/hooks/__tests__/testUtils.tsx` | `TestComponent` (L11) | test / e2e / config helper |
| `apps/mobile/src/hooks/__tests__/testUtils.tsx` | `flush` (L18) | test / e2e / config helper |
| `apps/mobile/src/ui/__tests__/ThemeContext.test.tsx` | `TestComponent` (L29) | test / e2e / config helper |
| `apps/mobile/src/ui/__tests__/ThemeContext.test.tsx` | `flushAsync` (L52) | test / e2e / config helper |
| `apps/mobile/src/api/__tests__/retry.test.ts` | `mockSetTimeoutImmediate` (L5) | test / e2e / config helper |
| `apps/mobile/src/utils/__tests__/bffConfig.test.ts` | `setEnv` (L9) | test / e2e / config helper |
| `apps/mobile/app.config.ts` | `(default config factory)` (L3) | test / e2e / config helper |
| `apps/mobile/babel.config.js` | `(module.exports config factory)` (L1) | test / e2e / config helper |

## Shared And Institutions Audit

| File | Function | Category |
| --- | --- | --- |
| `packages/shared/src/domain/errors.ts` | `httpStatusForKind` (L46) | schema / pack helper |
| `packages/shared/src/domain/errors.ts` | `createAppError` (L50) | schema / pack helper |
| `packages/institutions/src/packs.ts` | `getInstitutionPack` (L14) | schema / pack helper |

## Data-Only Modules

These modules are part of the repo surface but do not define first-party executable functions:

| File | Role |
| --- | --- |
| `packages/shared/src/domain/public.ts` | Shared Zod schemas and inferred types |
| `packages/shared/src/index.ts` | Shared package re-exports |
| `packages/institutions/src/index.ts` | Institution package re-exports |
| `packages/institutions/src/packs/example.public.ts` | Institution pack data |
| `packages/institutions/src/packs/hfmt.public.ts` | Institution pack data |
| `packages/institutions/src/packs/mockuni.public.ts` | Institution pack data |

## Audit Notes

| Observation | Detail |
| --- | --- |
| Functional center of gravity | The repo is dominated by BFF route/util plumbing and mobile UI/data orchestration rather than business-rule-heavy domain logic. |
| Resilience emphasis | Both BFF and mobile invest heavily in timeouts, caching, rate limiting, offline support, and error normalization. |
| Contract shape | `packages/shared` stays intentionally small and executable-light; schemas are data-first and helpers are minimal. |
| Institution model | `packages/institutions` is mostly configuration/data; executable behavior is concentrated in pack lookup. |
| Test structure | Tests mostly use local helper factories rather than a large shared test framework, which keeps coupling low but duplicates mock builders across files. |
