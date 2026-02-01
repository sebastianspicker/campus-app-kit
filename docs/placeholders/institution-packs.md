# Institution packs

Public packs are bundled as code in `@campus/institutions`.

## Where they live

- `packages/institutions/src/packs/*.public.ts`

## How to add a pack

1. Add a new `*.public.ts` file exporting a pack object.
2. Register it in `packages/institutions/src/packs.ts`.
3. Validate locally via `pnpm -r test`.
