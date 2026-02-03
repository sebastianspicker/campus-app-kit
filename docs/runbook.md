# RUNBOOK

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- pnpm 9 (see `package.json#packageManager`)
- Expo Go or a dev client for mobile testing (optional)

## Install

```bash
pnpm install --frozen-lockfile
```

## Local development

Run the BFF (public API):

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
```

Run the mobile app:

```bash
pnpm --filter @campus/mobile start
```

Run the mobile app with a dev client:

```bash
pnpm --filter @campus/mobile dev
```

## Configuration

BFF:
- `INSTITUTION_ID` (required; available ids live in `packages/institutions/src/packs/`)
- `BFF_PORT` (optional; default `4000`)
- `CORS_ORIGINS` (optional; comma-separated; use `*` for development)
- `BFF_TRUST_PROXY` (optional; `auto` by default; `auto` trusts forwarded headers only for private/loopback peers, `always` always trusts, `never` never trusts)

Mobile:
- `EXPO_PUBLIC_BFF_BASE_URL` (required for production builds; defaults to `http://localhost:4000` in development)

## Format and lint

Formatting is enforced via ESLint (no separate formatter configured).

```bash
pnpm lint
```

## Typecheck

```bash
pnpm typecheck
```

## Build

```bash
pnpm build
```

## Tests

```bash
pnpm test
```

## Verification (full loop)

```bash
pnpm verify
```

`pnpm verify` runs install, lint, typecheck, tests, build, and a placeholder-marker scan.

## Security checks (minimum baseline)

Secret scan (local, if `gitleaks` is installed):

```bash
gitleaks detect --config .gitleaks.toml
```

SAST (CI-only):
- GitHub Actions runs CodeQL in `.github/workflows/codeql.yml`.

SCA / dependency review:
- GitHub Actions runs dependency review in `.github/workflows/dependency-review.yml`.
- Optional local audit (uses the npm registry):

```bash
pnpm audit --prod
```

## Fast loop

Use this for quick local checks during development:

```bash
pnpm lint
pnpm typecheck
```

## Troubleshooting

- If the mobile app cannot reach the BFF, set `EXPO_PUBLIC_BFF_BASE_URL` to the BFF URL.
- If `pnpm` fails due to lockfile drift, re-run `pnpm install --frozen-lockfile` from the repo root.
- If TypeScript builds fail, ensure each package is built in dependency order by running `pnpm build` from the repo root.
