# Campus App Kit (Expo + RN)

A public, privacy-safe starter for building a university Campus App with React Native + Expo and an optional Backend-for-Frontend (BFF).

This repository ships with a public institution pack tailored to a University for Music and Dance and aligned with the HfMT Cologne campus structure. No internal systems, credentials, or private endpoints are included.

## Goals

- Ship a reusable public template with a clean security boundary.
- Offer a strong product baseline for music and dance universities: rooms, schedules, and a public stage/events feed.
- Provide a safe connector pattern that keeps sensitive integrations in a private repo.

## Repository structure

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

## Getting started

### Prerequisites

- Node.js 20 (see `.nvmrc`)
- pnpm 9 (see `package.json#packageManager`)
- Expo Go app (for quick device testing)

### Install

```bash
pnpm install --frozen-lockfile
```

### Verify (recommended)

```bash
pnpm verify
```

### Run the BFF (optional, recommended)

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
```

### Run the mobile app

```bash
pnpm --filter @campus/mobile start
```

If you want the mobile app to call a running BFF, set:

- `EXPO_PUBLIC_BFF_BASE_URL`

## Institution packs

This repo includes public institution packs:

- `packages/institutions/src/packs/example.public.ts`
- `packages/institutions/src/packs/hfmt.public.ts`

The BFF loads the institution pack via environment variable:

```bash
INSTITUTION_ID=hfmt
```

To adapt to another university, copy `example.public.ts` and adjust campuses, public rooms, and public sources.

## Connector pattern and private extensions

To integrate protected systems (SSO, Studierendenservice, Asimut, ILIAS):

1. Create a private repo (e.g. `campus-app-private-connectors`).
2. Implement connectors based on the interfaces in `apps/bff/src/connectors/private-stubs/`.
3. Run a private BFF that imports this public kit and wires real connectors.
4. Point the mobile app to your private BFF base URL.

This keeps the public project safe while enabling full institution integration.

## Security

- No secrets or private endpoints in this repo.
- Public connectors only; private connectors live elsewhere.
- See `SECURITY.md` and `docs/threat-model-lite.md`.

## Contributing

See `CONTRIBUTING.md`. Please keep sample data anonymized and synthetic.

## License

MIT. See `LICENSE`.
