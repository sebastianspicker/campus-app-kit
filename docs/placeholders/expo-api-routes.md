# Placeholder: Expo API Routes (EAS Hosting)

**Why this is missing**
- There are currently **no** `app/api/*+api.ts` routes in `apps/mobile`. If you want to run the public API on **EAS Hosting** (Cloudflare Workers) instead of a separate BFF, the API route layer is missing.

**TODO**
- Decide: keep a separate BFF (Node/HTTP) or replace it with Expo API routes.
- If using Expo API routes:
  - Implement `apps/mobile/app/api/{health,events,schedule,rooms,today}+api.ts`.
- Use Web APIs only (no `node:http`, `fs`, Node crypto).
  - Load institution packs via bundling or remote JSON.
  - Add caching (Workers cache / KV).
  - Keep error envelope consistent with the mobile client.
  - Define CORS/rate limits.
- Document EAS Hosting deployment (`eas deploy`) and server-side env vars/secrets.
