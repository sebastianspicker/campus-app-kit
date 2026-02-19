# Expo API Routes

The mobile app can expose server-side API routes using Expo Router’s `+api.ts` convention. These run on the **dev server** in development and on **EAS Hosting** (or another server adapter) in production.

## When to Use Expo API Routes

Use Expo API routes when you need:

- **Server-side secrets** — API keys, tokens, or credentials that must never reach the client
- **Third-party API proxies** — Hiding API keys when calling external services
- **Server-side validation** — Validating or transforming data before use
- **Webhooks** — Receiving callbacks from external services
- **Rate limiting or auth** — Enforcing access at the server level

## When to Use the BFF Instead

This repo also includes a **BFF** (`apps/bff/`) — a separate Node.js server. Prefer the BFF when:

- You need **institution-specific public data** (events, rooms, schedule) — the BFF loads institution packs and runs public connectors
- You want **one backend** for many clients (web, mobile, third-party)
- You need **Node.js APIs** (filesystem, long-lived processes, custom native modules)
- You deploy the backend **independently** from the Expo app (e.g. Docker, Kubernetes)

Use **Expo API routes** when the logic belongs with the app (e.g. serverless, same deployment as the app, or EAS Hosting).

## File Structure

API routes live under `apps/mobile/app/` with the `+api.ts` suffix:

```
app/
  api/
    hello+api.ts    → GET /api/hello
    health+api.ts   → GET /api/health
  (tabs)/
    ...
```

## Provided Routes

- **GET /api/hello** — Demo endpoint; returns `{ message: "Hello from Expo API route!" }`
- **GET /api/health** — Health check; returns `{ status: "ok", source: "expo-api-route" }`

## Running and Calling API Routes

- **Development:** With `npx expo start`, the dev server serves API routes. Call them at the same origin (e.g. `http://localhost:8081/api/hello` when using web).
- **Production:** Deploy with EAS Hosting (`eas deploy`) so API routes run on the server; set env vars with `eas env:create`.
- **From the app:** Use relative URLs when the app is served from the same host (e.g. `fetch('/api/hello')` on web). On native, you must call a full URL (e.g. your EAS Hosting URL + `/api/hello`).

## EAS Hosting Notes

API routes run on **Cloudflare Workers** when using EAS Hosting. Use Web APIs (`fetch`, `crypto.subtle`, etc.); Node.js `fs` and native modules are not available. See the expo-api-routes skill and [Expo docs](https://docs.expo.dev/eas/hosting/api-routes/) for details.

## Configuration

The app enables API routes by setting `web.output: "server"` in `app.config.ts`. This is required for API routes to be built and served.
