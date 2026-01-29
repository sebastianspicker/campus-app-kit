# Deploy: Mobile (EAS)

## TODO

- Create EAS profiles in `apps/mobile/eas.json`:
  - `development` (dev client if needed)
  - `preview`
  - `production`
- Configure `apps/mobile/app.config.ts`:
  - iOS/Android identifiers
  - versions/build numbers
  - `extra.BFF_BASE_URL`
- Document commands:
  - `npx expo start`
  - `npx expo start --dev-client` (if dev client)
  - `eas build -p ios --profile production`
  - `eas build -p android --profile production`

