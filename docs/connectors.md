# Connectors

Connectors provide data to the BFF.

## Public connectors

- Use only public sources (websites, RSS, open APIs).
- Safe to publish and run locally.

## Private stubs

The public repo ships interfaces and stubs only.
Private repos implement the real connectors and wire them in.

## Pattern

- `apps/bff/src/connectors/public/` for public sources.
- `apps/bff/src/connectors/private-stubs/` for interfaces and mock outputs.

## Testing

Public connectors should be tested with fixtures and deterministic dates.
Private connectors should be tested in the private repo.
