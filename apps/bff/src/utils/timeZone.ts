export type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  formatterCache.set(timeZone, formatter);
  return formatter;
}

function toPartsRecord(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  return parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
}

export function getDateTimePartsInTimeZone(date: Date, timeZone: string): DateTimeParts {
  const parts = toPartsRecord(getFormatter(timeZone).formatToParts(date));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

function pad(value: number, size = 2): string {
  return String(value).padStart(size, "0");
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = getDateTimePartsInTimeZone(date, timeZone);
  const asUtc = utcMillisecondsFromParts(parts);
  return asUtc - date.getTime();
}

export function getDateKeyInTimeZone(input: Date | string, timeZone: string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${String(input)}`);
  }

  const parts = getDateTimePartsInTimeZone(date, timeZone);
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function parseDateTimeInTimeZone(
  parts: DateTimeParts,
  timeZone: string
): string {
  const targetWallTime = validatedUtcMillisecondsFromParts(parts);
  const candidates = getLocalTimeCandidates(targetWallTime, timeZone);
  const exactMatches = candidates
    .filter((candidate) => candidate.wallTime === targetWallTime)
    .sort((first, second) => first.instant - second.instant);

  if (exactMatches.length > 0) {
    // RFC 5545 requires the first occurrence when a local time is repeated
    // during a backward offset transition.
    return new Date(exactMatches[0].instant).toISOString();
  }

  const postGapCandidates = candidates
    .filter((candidate) => candidate.wallTime > targetWallTime)
    .sort((first, second) => first.wallTime - second.wallTime);
  if (postGapCandidates.length > 0) {
    // For a local time skipped by a forward transition, RFC 5545 applies the
    // offset from before the gap. That candidate is the nearest wall time
    // after the requested one.
    return new Date(postGapCandidates[0].instant).toISOString();
  }

  throw new Error(`Invalid ${timeZone} local datetime`);
}

const OFFSET_PROBE_WINDOW_MS = 48 * 60 * 60 * 1000;

type LocalTimeCandidate = {
  instant: number;
  wallTime: number;
};

function getLocalTimeCandidates(targetWallTime: number, timeZone: string): LocalTimeCandidate[] {
  const offsets = new Set<number>();
  for (const delta of [-OFFSET_PROBE_WINDOW_MS, 0, OFFSET_PROBE_WINDOW_MS]) {
    offsets.add(getTimeZoneOffsetMs(new Date(targetWallTime + delta), timeZone));
  }

  return [...offsets].map((offset) => {
    const instant = targetWallTime - offset;
    return {
      instant,
      wallTime: utcMillisecondsFromParts(getDateTimePartsInTimeZone(new Date(instant), timeZone))
    };
  });
}

function comparableParts(parts: DateTimeParts): string {
  return [
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  ].join(":");
}

function utcMillisecondsFromParts(parts: DateTimeParts): number {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second, 0);
  return date.getTime();
}

function validatedUtcMillisecondsFromParts(parts: DateTimeParts): number {
  const values = [parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second];
  const date = new Date(utcMillisecondsFromParts(parts));
  const normalized: DateTimeParts = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds()
  };
  if (!values.every(Number.isInteger) || Number.isNaN(date.getTime()) || comparableParts(normalized) !== comparableParts(parts)) {
    throw new Error("Invalid calendar datetime");
  }
  return date.getTime();
}
