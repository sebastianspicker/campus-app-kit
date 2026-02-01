# Mobile API client

The mobile app uses a small fetch wrapper that standardizes timeouts, retries, and error parsing.

## Error envelope

The BFF returns errors in the shape:

- `{ "error": { "code": string, "message": string } }`

## Implementation

- Timeout + abort: `apps/mobile/src/utils/fetchHelpers.ts`
- Retry/backoff: `apps/mobile/src/api/retry.ts`
- Typed error: `apps/mobile/src/api/errors.ts`
- API client: `apps/mobile/src/api/client.ts`
