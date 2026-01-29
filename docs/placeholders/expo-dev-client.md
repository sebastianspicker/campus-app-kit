# Placeholder: Expo Dev Client (EAS)

**Why this is missing**
- The repo originally had a very minimal `apps/mobile/eas.json` without full dev-client guidance.
- A dev client is **only required** when you ship custom native code or native modules not available in Expo Go.

**TODO**
- Keep `apps/mobile/eas.json` aligned with EAS recommendations (`cli.version`, `appVersionSource`, `developmentClient: true`).
- Document when a dev client is needed and how to build/distribute it (local/TestFlight).
- Add standard commands:
  - `npx expo start --dev-client`
  - `eas build -p ios --profile development --submit`
  - `eas build -p android --profile development --local`
