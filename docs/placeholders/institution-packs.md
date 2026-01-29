# Placeholder: Institution packs as a package

**Why this is missing**
- Public packs currently live in `apps/bff/src/config/institutions/*.public.json`.
- Mobile / Expo API routes on EAS Hosting cannot rely on `fs`, so packs should be bundleable values.

**TODO**
- Move (or mirror) public packs into `packages/institutions` and implement `getInstitutionPack()`.
- Validate via `InstitutionPackSchema`.
- Document how to add a new institution (ids, files, tests).
