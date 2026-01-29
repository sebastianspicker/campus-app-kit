// Placeholder: Robust ICS parser
// TODO:
// - Handle TZID and DTSTART;VALUE=DATE
// - Support EXDATE/RRULE if needed
// - Provide deterministic sorting and filtering

export type ParsedIcsEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  campusId?: string;
};

export function parseIcs(_ics: string): ParsedIcsEvent[] {
  throw new Error("TODO: parseIcs implementieren");
}
