# Placeholder: BFF Dockerfile / Deployment

**Why this is missing**
- `apps/bff/Dockerfile` currently runs `tsx src/server.ts` without a build step, which is a dev runner, not a production image.

**TODO**
- Add a multi-stage Docker build (install + `tsc` → `dist/`).
- Final image should run `node dist/server.js` (no global `tsx` install).
- Document required env vars and deployment steps.
