# Placeholder: Node/pnpm versions & `engines`

**Why this is missing**
- `packageManager` is set, but without `engines` (and optionally `.nvmrc`) installs can drift across environments.

**TODO**
- Add `engines.node` and `engines.pnpm` to the root (and packages if needed).
- Document the expected Node/pnpm versions (README + `.nvmrc`).
