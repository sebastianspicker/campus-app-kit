# Mobile environment configuration

The mobile app resolves the BFF base URL via:

- `EXPO_PUBLIC_BFF_BASE_URL` (preferred)
- Development fallback: `http://localhost:4000`

Implementation: `apps/mobile/src/utils/bffConfig.ts`
