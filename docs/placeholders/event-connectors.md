# Connector quality (events and schedule)

Public connectors aim to be deterministic and safe:

## Events

- IDs are stable hashes of `{sourceUrl, title, date}`.
- Results are deduplicated and sorted for deterministic output.

Implementation: `apps/bff/src/connectors/public/hfmtWebEvents.ts` and `apps/bff/src/connectors/public/eventId.ts`.

## Schedule

- ICS parsing supports unfolded lines and basic VEVENT fields.
- Date-only values are interpreted as midnight UTC for deterministic output.

Implementation: `apps/bff/src/connectors/public/publicSchedule.ts` and `apps/bff/src/connectors/public/icsParser.ts`.
