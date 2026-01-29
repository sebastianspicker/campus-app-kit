# Placeholder: `@campus/shared` Runtime-Entry

**Why this is missing**
- `packages/shared/package.json` only declares `types: "src/index.ts"` and does not define `main`/`exports`. The code is imported at runtime by both BFF and mobile.

**TODO**
- Preferred: build with `tsc` to `dist/` and set `main`/`exports` to compiled output.
- Alternative: explicitly support source-only imports and configure Metro/Node resolution accordingly.
- Verify imports work in both contexts (BFF + mobile) via CI.
