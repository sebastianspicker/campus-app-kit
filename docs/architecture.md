# Architecture

This repo ships a public Campus App template with a small BFF (backend-for-frontend).
The BFF exposes only public data sources and stubbed connectors.

## Why a BFF

- Shield the app from scraping logic and rate limits.
- Normalize data into a shared domain model.
- Keep sensitive connectors out of the public repo.

## Core pieces

- Mobile app (Expo + Expo Router)
- BFF (public connectors + private stubs)
- Shared domain types and schemas
- Institution packs (public data only)

## Public vs Private

Public repo:
- Public website data.
- Institution packs with only public info.
- Interfaces and stubs for private connectors.

Private repo:
- Real connectors (SSO/OIDC, sessions, scraping).
- Private endpoints and ops.
- Caching, rate limits, monitoring.

## Data flow

1. Mobile app requests `/today` or `/events` from the BFF.
2. BFF reads the institution pack and calls public connectors.
3. Responses are normalized into domain models.
4. Mobile app renders the data and caches briefly.
