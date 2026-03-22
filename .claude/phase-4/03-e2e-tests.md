# Phase 4.3: E2E Test Review

You are reviewing the end-to-end test setup for the mobile app. Work through items ONE AT A TIME.

## Context

The mobile app uses Detox 20.18 for E2E testing on iOS and Android simulators/emulators. Tests are in `apps/mobile/e2e/`. The E2E workflow runs in `.github/workflows/e2e.yml`.

## Audit Scope

### 1. Detox Configuration
- Review `apps/mobile/detox.config.js`:
  - Are iOS and Android device configs correct?
  - Are build configurations (debug, release) properly set up?
  - Is the app binary path correct for both platforms?
- Review `apps/mobile/e2e/jest.config.js`:
  - Is the test runner correctly configured?
  - Is the setup file properly referenced?

### 2. Existing E2E Tests
Review each test file in `apps/mobile/e2e/`:
- `init.ts` — device setup and app launch
- `events.test.ts` — events screen tests
- `navigation.test.ts` — navigation flow tests
- `schedule.test.ts` — schedule screen tests

For each test:
- Can it run independently (no order dependency)?
- Does it use stable selectors (`testID` props, not text content)?
- Does it handle async operations correctly (proper `waitFor`)?
- Does it clean up after itself?

### 3. testID Coverage
- Verify `testID` props exist on all elements referenced by E2E tests
- Check mobile source files for missing `testID` on interactive elements:
  - Tab bar items
  - List items (events, rooms, schedule)
  - Search bar, filter panel
  - Buttons, links, cards
  - Error states, empty states, loading states
- Add missing `testID` props where needed

### 4. E2E Workflow Review
Review `.github/workflows/e2e.yml`:
- Does the conditional logic for platform selection work on push/PR triggers?
  - `github.event.inputs.platform` is only set for `workflow_dispatch`
  - On push/PR, this is undefined — do the `if` conditions handle this?
- Is the iOS build command correct? (`xcodebuild` invocation)
- Is the Android emulator setup correct? (API level, device name)
- Are artifacts (videos, logs) captured on failure?
- Does the summary job correctly aggregate results?

### 5. Missing E2E Scenarios
Document (don't necessarily implement) missing E2E test scenarios:
- Login/auth flow
- Offline behavior (disable network, verify cached data)
- Pull-to-refresh
- Deep link navigation
- Error state recovery
- Dark mode rendering

## Key Files

- `apps/mobile/e2e/*.ts` (all E2E test files)
- `apps/mobile/e2e/jest.config.js`
- `apps/mobile/detox.config.js`
- `.github/workflows/e2e.yml`
- Mobile source files (check for `testID` props)

## Rules

- Read actual test files before making any judgment
- E2E tests are expensive to run — focus on review and documentation
- Fix broken or incorrect test code directly
- For missing scenarios, document what should be tested without writing the tests
- Add missing `testID` props to source components
- Update `progress.md` under `## Phase 4.3: E2E Test Review` after each item
- Work on ONLY ONE item per invocation

## Completion

When E2E test setup has been reviewed and documented:

<promise>COMPLETE</promise>
