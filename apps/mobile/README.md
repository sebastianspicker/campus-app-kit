# Mobile (Campus App Kit)

This is the public Expo app for the Campus App Kit.

## TODO (production readiness)

- Replace placeholder scripts in `apps/mobile/package.json` with real Expo commands.
- Configure production-ready Expo settings in `apps/mobile/app.config.ts`:
  - `ios.bundleIdentifier`, `android.package`
  - icons/splash
  - version/build numbers
  - `extra.BFF_BASE_URL` (no `localhost` default in release builds)
- Expand `apps/mobile/eas.json` with `preview` + `production` profiles (and document Dev Client usage if needed).
- Decide whether to use:
  - a separate BFF (`apps/bff`), or
  - Expo API Routes (`apps/mobile/app/api/*+api.ts`) on EAS Hosting.

