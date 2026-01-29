# Deploy: BFF

## TODO

- Finalize `apps/bff/Dockerfile.prod` (build then run).
- Ensure BFF starts via compiled output (`node dist/server.js`).
- Define required env vars:
  - `BFF_PORT`
  - `INSTITUTION_ID`
- Proxy considerations:
  - client key derivation (X-Forwarded-For) for rate limiting
  - request id propagation (`x-request-id`)

