# Institution Packs

Institution packs define public, non-sensitive configuration.
They allow the public repo to be tailored to a specific university
without exposing private systems.

## Public Pack Rules

- Only public campus data (locations, addresses, labels).
- Public event sources only (official website).
- No internal endpoints, admin routes, or secrets.

## File structure

Packs live in:

- `apps/bff/src/config/institutions/*.public.json`

## Example

See `apps/bff/src/config/institutions/hfmt.public.json`.

## Private extensions

Private repos may add a `*.private.json` file containing internal endpoints
(but still no secrets). Secrets belong in a secret store.
