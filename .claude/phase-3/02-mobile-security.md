# Phase 3.2: Mobile App Security

You are performing a security audit of the mobile app. Work through items ONE AT A TIME.

## Context

The mobile app (`apps/mobile/`) is built with:
- Expo 51 + Expo Router 3.5 (file-based routing)
- React Native 0.74
- AsyncStorage for persistent data (offline cache)
- Fetches data from a BFF server over HTTP/HTTPS
- Has a demo auth session system in `src/auth/`
- Uses `EXPO_PUBLIC_*` environment variables (compiled into JS bundle)

## Audit Scope

### 1. Sensitive Data Storage
- Review `data/persistedCache.ts`: what data is stored in AsyncStorage?
- AsyncStorage is NOT encrypted on Android — verify no auth tokens, passwords, or PII are stored
- Check if any sensitive data is cached that shouldn't survive app restart
- Verify cache expiration (24h) is appropriate for the data types stored

### 2. Environment Variable Exposure
- `EXPO_PUBLIC_*` vars are compiled into the JavaScript bundle — verify none contain secrets
- Review `utils/env.ts` and `utils/bffConfig.ts` for what environment vars are used
- Check `app.config.ts` for any sensitive configuration
- Review `.env.example` — does it clearly mark which values are public vs secret?
- Check `eas.json` for any exposed secrets or insecure build profiles

### 3. Network Security
- Review `api/client.ts`: does it enforce HTTPS in production?
- Check if certificate pinning is implemented or documented as a future requirement
- Verify Zod validation of BFF responses in the mobile client (defense in depth)
- Check `api/retry.ts`: does retry logic safely handle auth errors (don't retry 401s)?
- Verify no sensitive data in URL query parameters (should be in headers/body)

### 4. Deep Link & Navigation Security
- Check Expo Router deep link configuration in `app/_layout.tsx`
- Verify no open redirect vulnerabilities via deep links
- Check if deep links can navigate to auth-protected screens without authentication
- Verify URL scheme configuration in `app.config.ts`

### 5. Session Management
- Review `src/auth/session.ts` — how is the demo session managed?
- Check what happens when a session expires mid-request
- Verify session data is cleared on logout
- Document what must change for production auth (this is a starter template)

### 6. Production Build Safety
- Check for `console.log` statements that might leak data in production
- Verify `__DEV__` checks gate debug-only code
- Check if React DevTools are disabled in production builds
- Verify source maps are not included in production bundles
- Check `app.config.ts` for debug flags that should be off in production

## Key Files

- `apps/mobile/src/auth/session.ts`
- `apps/mobile/src/data/persistedCache.ts`
- `apps/mobile/src/api/client.ts`, `retry.ts`, `errors.ts`
- `apps/mobile/src/utils/env.ts`, `bffConfig.ts`
- `apps/mobile/app.config.ts`, `eas.json`
- `apps/mobile/app/_layout.tsx`
- `apps/mobile/.env`, `.env.example`
- `apps/mobile/src/hooks/usePublicResource.ts`

## Rules

- Read actual code and trace actual code paths. Never guess about security.
- Rate every finding: CRITICAL / HIGH / MEDIUM / LOW
- Fix issues directly when the fix is clear, safe, and does not change behavior
- For complex fixes, document the vulnerability and recommended remediation
- Update `progress.md` under `## Phase 3.2: Mobile App Security` after each item
- Work on ONLY ONE item per invocation

## Completion

When all client-side security vectors have been reviewed:

<promise>COMPLETE</promise>
