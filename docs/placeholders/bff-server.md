# BFF server hardening

The public BFF provides:

- Env validation
- Method guards (`GET` and `OPTIONS`)
- CORS support
- Request id propagation
- Structured JSON logs
- Simple in-memory rate limiting

Implementation: `apps/bff/src/server.ts`
