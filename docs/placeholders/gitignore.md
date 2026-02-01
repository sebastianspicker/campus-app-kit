# `.gitignore` and repo hygiene

This repo ignores common local artifacts and build outputs, including:

- `node_modules/`, `dist/`, `build/`, `coverage/`
- `.expo/`, `.turbo/`
- local env files (`.env*` except `.env.example`)

The lockfile (`pnpm-lock.yaml`) is committed for deterministic installs.
