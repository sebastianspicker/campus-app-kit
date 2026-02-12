# Campus App Kit

A public, privacy-safe starter for building a university Campus App with React Native + Expo and an optional Backend-for-Frontend (BFF). The repository includes public institution packs and connector stubs to enable private extensions in a separate codebase.

## 1) Overview

Campus App Kit provides a reusable foundation for mobile campus apps that serve public data (rooms, schedules, events). It includes an optional BFF that aggregates public sources and a connector boundary that keeps sensitive integrations in a private repository. License: MIT (see `LICENSE`).

## 2) Scope and Non-Goals

- Status: early alpha, best-effort maintenance.
- Public data only; no private backend or credentials are included.
- Not production-ready without a real backend and private connector implementations.
- Not a full campus ERP or identity system; integrations must be added externally.

## 3) Repository Structure

```
apps/
  mobile/         Expo React Native app (Expo Router)
  bff/            Optional BFF API (public connectors only + private stubs)
packages/
  shared/         Domain types + Zod schemas
  institutions/   Public institution packs (bundleable)
docs/             Architecture and security notes
infra/            Dev-only docker compose for local BFF
```

## 4) Requirements

- Node.js 20 (see `.nvmrc`)
- pnpm 9 (see `package.json#packageManager`)
- Expo Go or a dev client for device testing (optional)

## 5) Quickstart

1. Install dependencies:

```bash
pnpm install --frozen-lockfile
```

2. Run the BFF (optional, recommended for local data):

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
```

3. Run the mobile app:

```bash
pnpm --filter @campus/mobile start
```

4. For production builds, set `EXPO_PUBLIC_BFF_BASE_URL` to your BFF base URL.

## 6) Configuration

BFF environment variables:
- `INSTITUTION_ID` (required; available ids live in `packages/institutions/src/packs/`)
- `BFF_PORT` (optional; default `4000`)
- `CORS_ORIGINS` (optional; comma-separated; use `*` for development)
- `BFF_TRUST_PROXY` (optional; default `auto`; `auto` trusts forwarded headers only for private/loopback peers, `always` always trusts, `never` never trusts)

Mobile environment variables:
- `EXPO_PUBLIC_BFF_BASE_URL` (required for production builds; defaults to `http://localhost:4000` in development)

## 7) Development Workflow

- Full verification (CI-aligned):

```bash
pnpm verify
```

- Individual commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- Run all apps in parallel:

```bash
pnpm dev
```

## 8) Security and Privacy

- No secrets or private endpoints are included in this repository.
- Public connectors only; private connectors live in a separate repo.
- See `SECURITY.md` and `docs/threat-model-lite.md` for the current threat model.

## 9) Troubleshooting

- Mobile app cannot reach the BFF: set `EXPO_PUBLIC_BFF_BASE_URL`.
- BFF fails to start: verify `INSTITUTION_ID` and `BFF_PORT`.
- Lockfile drift: re-run `pnpm install --frozen-lockfile`.
- TypeScript build errors: run `pnpm build` from the repo root to respect build order.
- Known bugs and required fixes: see `BUGS_AND_FIXES.md`.

## 10) Validation (build / run / test)

From the repo root:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm verify
```

Optional run (BFF + mobile):

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
pnpm --filter @campus/mobile start
```

- **build:** `pnpm build` — builds all packages and apps (Turbo).
- **test:** `pnpm test` — runs all tests.
- **verify:** `pnpm verify` — full CI-style check (lint, typecheck, test, build, marker scan).

## 11) Docs Index

- `BUGS_AND_FIXES.md` — known bugs and required fixes (issue source).
- `docs/runbook.md` — local commands and configuration.
- `docs/architecture.md` — design overview.
- `docs/ci.md` — CI workflows and local reproduction.
- `docs/connectors.md` — BFF connectors and stubs.
- `docs/institutions.md` — institution packs.
- `docs/deploy/` — deployment (BFF, mobile).
- `docs/faq.md` — frequently asked questions.
- `docs/expo-ota-code-signing.md` — Expo OTA and code signing.
- `docs/threat-model-lite.md` — threat model.
