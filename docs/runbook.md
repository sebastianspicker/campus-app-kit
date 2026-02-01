# Runbook (Campus App Kit)

## Local setup

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Run the BFF:

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
```

Run the mobile app:

```bash
pnpm --filter @campus/mobile start
```

## Local verification

```bash
./scripts/verify-production-ready.sh
```

## Configuration

BFF:
- `INSTITUTION_ID` (required; available ids live in `packages/institutions/src/packs/`)
- `BFF_PORT` (default `4000`)
- `CORS_ORIGINS` (optional; comma-separated; use `*` for development)

Mobile:
- `EXPO_PUBLIC_BFF_BASE_URL` (required for production builds; defaults to `http://localhost:4000` in development)
