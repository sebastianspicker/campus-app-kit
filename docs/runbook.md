# Runbook (Campus App Kit)

## TODO

- Document exact local commands:
  - `pnpm install`
  - `pnpm --filter @campus/bff dev`
  - `pnpm --filter @campus/mobile start`
- Document production configuration:
  - `INSTITUTION_ID`
  - BFF base URL injection for mobile (no `localhost` fallback in release)
- Document deployments:
  - BFF container deployment (`Dockerfile.prod`)
  - Mobile EAS build (`preview`/`production`)
  - Optional: Expo API Routes deployment (`eas deploy`)

