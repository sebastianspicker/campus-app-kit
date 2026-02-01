# Observability (BFF)

The BFF emits structured JSON logs and supports request id propagation.

## Request id

- Incoming: `x-request-id` (if present)
- Outgoing: always sets `x-request-id` on the response

## Logging

Implementation: `apps/bff/src/utils/logger.ts`

Avoid logging secrets; authorization and cookie-like keys are filtered.
