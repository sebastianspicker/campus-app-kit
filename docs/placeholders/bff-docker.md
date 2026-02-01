# BFF containers

This repo ships:

- `apps/bff/Dockerfile` for a simple dev container
- `apps/bff/Dockerfile.prod` for a production build (TypeScript → `dist/` → `node`)

Required environment variables:

- `INSTITUTION_ID`
- `BFF_PORT` (optional, default `4000`)
- `CORS_ORIGINS` (optional)

For commands, see `docs/deploy/bff.md`.
