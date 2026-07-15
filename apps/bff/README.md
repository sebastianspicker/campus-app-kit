# BFF

Public backend-for-frontend for the Campus App Kit. It exposes only public data sources and stubbed connectors.

## Endpoints

- `GET /health` - process, institution-pack, and memory status
- `GET /events` - public events from the institution pack
- `GET /rooms` - public rooms from the institution pack
- `GET /schedule` - public schedule (ICS) if configured
- `GET /today` - combined events + rooms

## Running locally

```bash
INSTITUTION_ID=hfmt pnpm --filter @campus/bff dev
```

When running from `apps/bff`, copy `.env.example` to `.env` instead of relying on the root example.

Environment variables:

- `INSTITUTION_ID` (required, e.g. `hfmt`)
- `BFF_PORT` (optional, default `4000`)
- `BFF_REQUIRE_AUTH` (optional; unset/`0`/`false`/`no`/`off` disables bearer auth, `1`/`true`/`yes`/`on` requires it; invalid non-empty values fail startup and fail closed per request)
- `BFF_AUTH_TOKEN` (required when `BFF_REQUIRE_AUTH` enables bearer auth)
- `CORS_ORIGINS` (optional, comma-separated; use `*` for development)
- `BFF_TRUSTED_PROXIES` (optional, comma-separated IP addresses or CIDR ranges, for example `127.0.0.1,10.24.0.0/16,2001:db8:feed::/48`). When set and `BFF_TRUST_PROXY` is unset, forwarded identities are honored only if the immediate socket peer matches this allowlist. For multi-hop chains, the BFF walks `X-Forwarded-For` or `Forwarded` from right to left across allowlisted proxy hops and uses the first non-proxy address. Invalid chains and untrusted peers use the socket address. Set `BFF_TRUST_PROXY=never` to explicitly disable forwarding even when this list is present.
- `BFF_TRUST_PROXY` (optional, default `never`). `auto` is rejected at startup. `always` remains a legacy escape hatch and trusts forwarded identities from every direct peer; it is unsafe unless the BFF is network-isolated behind a proxy that overwrites forwarded headers. Prefer `BFF_TRUSTED_PROXIES`.

## Connector model

Public connectors live in `src/connectors/public/`.
Private connectors are defined as interfaces and stubs in `src/connectors/private-stubs/`.
Real implementations belong in a private repo.

## Tests

From the repo root:

```bash
pnpm --filter @campus/bff test
```

## Troubleshooting

### Empty or missing data
If an endpoint returns an empty array or a 404/not_found for data routes:
1. Check `INSTITUTION_ID` and ensure the corresponding institution pack in `@campus/institutions` has `publicSources` (for events/schedules) or `publicRooms` configured.
2. Check the logs for `public_events_source_failed` or `public_schedule_source_failed` warnings.
3. Verify that the upstream HTML or ICS sources are accessible from the BFF.
4. For `/today`, ensure there are events occurring on the current server date.

For more details, see `docs/runbook.md`.
