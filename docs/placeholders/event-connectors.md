# Placeholder: Connector-Quality (Events + Schedule)

**Why this is missing**
- `fetchPublicEvents` generates position-based IDs and `/schedule` parsing is intentionally minimal.

**TODO**
- Generate stable IDs per source (hash title+date+url), add dedupe + sorting.
- Add explicit limits/timeouts and deterministic ordering.
- Harden ICS parsing for `TZID`, `DTSTART;VALUE=DATE`, etc.
- Expand fixtures and update tests.
