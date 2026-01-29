# Placeholder: Expo / EAS production configuration

**Why this is missing**
- `app.json`/`eas.json` currently contain minimal defaults and do not define production profiles, bundle identifiers, icons, or deep links.

**TODO**
- Use `app.config.ts` (recommended) to set iOS/Android identifiers, icons/splash, versions/build numbers.
- Expand `eas.json` with `preview` + `production` profiles (channels, env, caching).
- Document release commands (`eas build --profile production`, etc.).
