# Campus App Kit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node 20](https://img.shields.io/badge/node-20.x-green.svg)](.nvmrc)
[![pnpm 9](https://img.shields.io/badge/pnpm-9-orange.svg)](package.json)

A public, privacy-safe starter for building a university campus app with **React Native + Expo** and an optional **Backend-for-Frontend (BFF)**. Includes public institution packs and connector stubs so you can extend with private integrations in a separate codebase.

---

## Features

- **Mobile app** – Expo (SDK 51) with Expo Router; tabs for Today, Events, Rooms, Schedule; shared UI components and theme.
- **BFF** – Optional Node.js API: public connectors (events, schedule), rate limiting, HTTP caching, CORS. No secrets; private logic stays in your fork.
- **Shared** – Zod schemas and domain types used by both BFF and mobile.
- **Institution packs** – Public config per institution (e.g. `hfmt`); easy to add more.

---

## Quick start

```bash
pnpm install --frozen-lockfile
INSTITUTION_ID=hfmt pnpm dev
```

Then open the mobile app (Expo Go or dev client) and point it at the BFF. For step-by-step commands and env vars, see [Runbook](docs/runbook.md).

---

## Repository structure

```
apps/
  mobile/         Expo React Native app (Expo Router)
  bff/            Optional BFF API (public connectors + private stubs)
packages/
  shared/         Domain types + Zod schemas
  institutions/   Public institution packs
docs/             Architecture, runbook, CI, deployment
scripts/          verify-production-ready, ci-local, build
```

High-level data flow and public vs private split are described with diagrams in [Architecture](docs/architecture.md).

---

## Requirements

- **Node.js 20** (see `.nvmrc`)
- **pnpm 9** (see `package.json` → `packageManager`)
- Expo Go or a dev client for device testing (optional)

---

## Configuration

| Context | Key variables |
|--------|----------------|
| **BFF** | `INSTITUTION_ID` (required), `BFF_PORT`, `CORS_ORIGINS`, `BFF_TRUST_PROXY` |
| **Mobile** | `EXPO_PUBLIC_BFF_BASE_URL` (required for production) |

Full list and semantics: [Runbook → Configuration](docs/runbook.md#configuration).

---

## Development

| Command | Description |
|--------|-------------|
| `pnpm verify` | Full CI-style check (lint, typecheck, test, build, marker scan) |
| `pnpm lint`   | Lint |
| `pnpm typecheck` | TypeScript |
| `pnpm test`   | Tests |
| `pnpm build`  | Build all (Turbo) |
| `pnpm dev`    | Run BFF + mobile in parallel (set `INSTITUTION_ID` for BFF) |

---

## Security and privacy

- No secrets or private endpoints in this repo.
- Public connectors only; private connectors belong in a separate (private) repo.
- See [SECURITY.md](SECURITY.md) and [Threat model](docs/threat-model-lite.md).

---

## Troubleshooting

- **Mobile can’t reach BFF** – Set `EXPO_PUBLIC_BFF_BASE_URL`.
- **BFF won’t start** – Set `INSTITUTION_ID` (e.g. `hfmt`) and check `BFF_PORT`.
- **Lockfile errors** – Run `pnpm install --frozen-lockfile` from repo root.
- **Empty events/rooms/schedule** – See [Empty or missing data](docs/runbook.md#empty-or-missing-data).
- **Known issues** – [BUGS_AND_FIXES.md](BUGS_AND_FIXES.md) (with quick reference table).

---

## Documentation index

| Doc | Description |
|-----|-------------|
| [docs/runbook.md](docs/runbook.md) | Local setup, config, commands, BFF endpoints |
| [docs/architecture.md](docs/architecture.md) | Design overview and Mermaid diagrams |
| [docs/ci.md](docs/ci.md) | CI workflows and scripts |
| [docs/connectors.md](docs/connectors.md) | BFF connectors and stubs |
| [docs/institutions.md](docs/institutions.md) | Institution packs |
| [docs/deploy/](docs/deploy/) | Deployment (BFF, mobile) |
| [docs/faq.md](docs/faq.md) | FAQ |
| [docs/OPEN_IMPROVEMENTS_AND_PLAN.md](docs/OPEN_IMPROVEMENTS_AND_PLAN.md) | Open improvements and implementation plan |
| [docs/threat-model-lite.md](docs/threat-model-lite.md) | Threat model |
| [BUGS_AND_FIXES.md](BUGS_AND_FIXES.md) | Known bugs and required fixes |

Expo-related: [expo-api-routes](docs/expo-api-routes.md), [expo-tailwind-setup](docs/expo-tailwind-setup.md), [expo-ota-code-signing](docs/expo-ota-code-signing.md).

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and keep the repo safe to publish (no secrets, no private endpoints). Run `pnpm verify` before opening a PR.

---

## License

MIT. See [LICENSE](LICENSE).
