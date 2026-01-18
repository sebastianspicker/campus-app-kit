# BFF

Public backend-for-frontend for the Campus App Kit. It exposes only public data sources and stubbed connectors.

## Endpoints

- `GET /health` - liveness check
- `GET /events` - public events from the institution pack
- `GET /rooms` - stub response (private connector required)
- `GET /schedule` - public schedule (ICS) if configured
- `GET /today` - combined events + rooms (rooms stubbed)

## Running locally

```bash
pnpm --filter @campus/bff dev
```

Environment variables:

- `BFF_PORT` (default 4000)
- `INSTITUTION_ID` (default hfmt)

## Connector model

Public connectors live in `src/connectors/public/`.
Private connectors are defined as interfaces and stubs in `src/connectors/private-stubs/`.
Real implementations belong in a private repo.

## Tests

Run all tests from the repo root:

```bash
pnpm --filter @campus/bff test
```
