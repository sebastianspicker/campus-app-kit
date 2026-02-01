# Turbo build pipeline

Turbo is configured in `turbo.json` using `tasks`.

Key tasks:

- `lint`, `typecheck`, `test`, `build`
- `build` runs before `typecheck`/`test` for runtime packages
