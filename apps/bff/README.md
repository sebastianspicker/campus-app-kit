# BFF

Public backend-for-frontend for the Campus App Kit. It exposes only public data sources and stubbed connectors.

## Endpoints

- `GET /health` - liveness check
- `GET /events` - public events from the institution pack
- `GET /rooms` - public rooms from the institution pack
- `GET /schedule` - public schedule (ICS) if configured
- `GET /today` - combined events + rooms

## Running locally

```bash
pnpm --filter @campus/bff dev
```

Environment variables:

- `INSTITUTION_ID` (required, e.g. `hfmt`)
- `BFF_PORT` (optional, default `4000`)
- `CORS_ORIGINS` (optional, comma-separated; use `*` for development)

## Connector model

Public connectors live in `src/connectors/public/`.
Private connectors are defined as interfaces and stubs in `src/connectors/private-stubs/`.
Real implementations belong in a private repo.

## Tests

Run all tests from the repo root:

```bash
pnpm --filter @campus/bff test
```
