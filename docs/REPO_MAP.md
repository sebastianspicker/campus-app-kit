# REPO MAP

## Overview

Monorepo (pnpm + Turborepo) with two apps and shared packages.

- Apps: `apps/bff`, `apps/mobile`
- Packages: `packages/shared`, `packages/institutions`, `packages/ui`
- Tooling: `turbo.json`, `pnpm-workspace.yaml`, `vitest.config.ts`, `tsconfig.base.json`

## Entry points

- BFF server: `apps/bff/src/server.ts`
- Mobile app (Expo Router): `apps/mobile/app/_layout.tsx`
- Shared exports: `packages/shared/src/index.ts`
- Institution packs: `packages/institutions/src/packs/*.public.ts`

## Apps

`apps/bff` (Backend-for-Frontend)
- Source: `apps/bff/src/`
- Routes: `apps/bff/src/routes/`
- Connectors:
  - Public connectors: `apps/bff/src/connectors/public/`
  - Private stubs: `apps/bff/src/connectors/private-stubs/`
- Domain and config: `apps/bff/src/domain/`, `apps/bff/src/config/`

`apps/mobile` (Expo React Native)
- Expo Router routes: `apps/mobile/app/`
- App logic: `apps/mobile/src/` (`api/`, `data/`, `hooks/`, `ui/`, `utils/`)
- Expo config: `apps/mobile/app.config.ts`, `apps/mobile/app.json`

## Packages

`packages/shared`
- Domain types and Zod schemas: `packages/shared/src/domain/`
- Public exports: `packages/shared/src/index.ts`

`packages/institutions`
- Institution packs: `packages/institutions/src/packs/`
- Pack registry: `packages/institutions/src/packs.ts`

`packages/ui`
- Currently contains tests only: `packages/ui/src/__tests__/`

## Infra and scripts

- Local BFF docker compose: `infra/docker-compose.dev.yml`
- Production readiness script: `scripts/verify-production-ready.sh`

## High-level data flow

- Mobile app calls the BFF (`EXPO_PUBLIC_BFF_BASE_URL`).
- BFF loads the institution pack via `INSTITUTION_ID` and serves public endpoints.
- Shared domain types and schemas live in `packages/shared` and are consumed across apps.

## Hot spots / risk areas

- Connector boundaries between public and private implementations (`apps/bff/src/connectors/`).
- Institution pack data validity (`packages/institutions/src/packs/`).
- API contracts shared between BFF and mobile (`packages/shared/src/domain/`).
