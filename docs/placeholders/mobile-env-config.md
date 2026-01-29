# Placeholder: Expo env config for BFF URL

**Why this is missing**
- `apps/mobile/src/utils/env.ts` reads `process.env.MOBILE_PUBLIC_BFF_URL` and falls back to `http://localhost:4000`, which is unreliable/incorrect for release builds.

**TODO**
- Use `app.config.ts` + `extra` (or `EXPO_PUBLIC_*`) to inject a production-safe BFF base URL.
- Ensure `getBffBaseUrl()` resolves correctly in release builds (no localhost).
- Document env variables and expected values.
