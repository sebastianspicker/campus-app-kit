# Campus App Kit (Expo + RN) 

A modern (2025/2026) open-source starter for building a university Campus App with React Native + Expo and an optional Backend-for-Frontend (BFF).

This repository ships with a public, privacy-safe configuration pack tailored to the needs of an University for Music and Dacne: campus structure (Köln/Aachen/Wuppertal) and public events (“Bühne”) — without exposing any internal systems, credentials, or operational details.

## Why this exists

Campus apps often fail because the hard part is not the UI — it’s integration, identity, and governance.  
This kit focuses on what works in practice:

- Expo + React Native for fast delivery and great developer experience
- File-based routing via Expo Router
- An adapter/connector architecture so each institution can plug in its own systems safely
- A recommended BFF pattern to keep sessions/cookies/tokens off the device and provide clean JSON APIs

For a music & dance university, the biggest daily pain is usually rooms, changes, and schedules — plus a strong public-facing events (“Bühne”) experience. This repo is built around that product reality.

## Repository structure

```

apps/
mobile/   Expo React Native app (Expo Router)
bff/      Optional BFF API (public connectors only + private stubs)
packages/
shared/   Domain types + Zod schemas + API contracts
ui/       UI components / theme tokens (optional design system)
docs/       Architecture, security, accessibility notes
infra/      Dev-only docker compose for local BFF (no prod ops)

```

## Getting started

### Prerequisites
- Node.js (LTS recommended)
- pnpm (recommended) or npm/yarn
- Expo Go app (for quick device testing)

### Install
```bash
pnpm install
```

### Run the BFF (optional, but recommended)

```bash
pnpm --filter @campus/bff dev
```

### Run the mobile app

```bash
pnpm --filter @campus/mobile start
```

Open the Expo dev tools and run on iOS/Android simulator or scan the QR code with Expo Go.


## Choosing the institution pack

This repo includes a public institution pack:

* `apps/bff/config/institutions/example.public.json`

The BFF loads the institution pack via environment variable:

```bash
INSTITUTION_ID=example
```

If you want to adapt to another university, copy `example.public.json` and adjust labels, campuses, and public sources.


## Extending with private connectors (recommended approach)

To integrate protected systems (SSO, Studierendenservice, Asimut, ILIAS):

1. Create a private repo (e.g. `campus-app-private-connectors`)
2. Implement connectors based on the interfaces in:

   * `apps/bff/src/connectors/private-stubs/*`
3. Run a private BFF that:

   * imports this public kit as a dependency or submodule
   * registers the real connectors instead of stubs
4. Point the mobile app to your private BFF base URL

This keeps the public project safe while still enabling full institution integration.



## Accessibility

If this is used by public institutions, plan for accessibility early (screen reader support, focus management, contrast, dynamic text, reduced motion).
See `docs/accessibility-en301549.md`.


## Contributing

PRs are welcome — especially:

* UI polish & UX improvements for “Heute / Räume / Bühne”
* Better test coverage and CI hardening
* Generic improvements to the connector interface pattern

Please:

* avoid adding institution-specific secrets or internal endpoints
* keep sample data anonymized and synthetic


## License

MIT. See `LICENSE`.


## Credits

* Built with Expo + React Native
* Inspired by real-world campus integration patterns (BFF + connector adapters)

If you deploy this for an institution: please add a visible disclaimer and follow your local IT, privacy, and accessibility policies.


