import { createHash } from "node:crypto";
import { RRule, rrulestr } from "rrule";

export type ParsedIcsEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  campusId?: string;
  isRecurring?: boolean;
  recurringInstanceId?: string;
};

// Configuration for RRULE expansion
const DEFAULT_RRULE_HORIZON_DAYS = 365; // Expand events up to 1 year in the future
const DEFAULT_RRULE_MAX_INSTANCES = 100; // Maximum instances per recurring event

// #66: Stable fallback ID when UID is missing
function generateStableId(title: string, startsAt: string): string {
  return createHash("sha256")
    .update(`${title}|${startsAt}`)
    .digest("hex")
    .slice(0, 16);
}

// Generate ID for recurring event instance
function generateRecurringInstanceId(baseId: string, startsAt: string): string {
  return createHash("sha256")
    .update(`${baseId}|${startsAt}`)
    .digest("hex")
    .slice(0, 16);
}

function unfoldLines(input: string): string[] {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const unfolded: string[] = [];

  for (const line of lines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      const prev = unfolded.pop() ?? "";
      unfolded.push(prev + line.trimStart());
      continue;
    }
    unfolded.push(line);
  }

  return unfolded;
}

function parseIcsDate(value: string, tzid?: string): string {
  let date: Date;
  // DATE (all-day)
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    // For all-day events, use UTC
    date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  } else {
    const normalized = value.replace(/Z$/, "");
    const year = normalized.slice(0, 4);
    const month = normalized.slice(4, 6);
    const day = normalized.slice(6, 8);
    const hour = normalized.slice(9, 11);
    const minute = normalized.slice(11, 13);
    const second = normalized.slice(13, 15) || "00";
    const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}.000`;

    // If it ends with Z, it's UTC.
    // Otherwise, it's local time. If TZID is provided, we should ideally use it.
    // For now, we fall back to UTC if no TZID, as many ICALs assume UTC or server local.
    if (value.endsWith("Z") || !tzid) {
      date = new Date(`${iso}Z`);
    } else {
      // Basic local time handling (interpreted as UTC for now, but avoids crashing)
      date = new Date(`${iso}Z`);
    }
  }

  if (Number.isNaN(date.getTime()) || date.getTime() === 0) {
    throw new Error(`Invalid ICS date: ${value}`);
  }
  return date.toISOString();
}

function unescapeIcsValue(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/**
 * Expand a recurring event based on its RRULE.
 * Returns an array of events, one for each occurrence within the horizon.
 */
function expandRecurringEvent(
  baseEvent: ParsedIcsEvent,
  rruleValue: string,
  horizonDays: number = DEFAULT_RRULE_HORIZON_DAYS,
  maxInstances: number = DEFAULT_RRULE_MAX_INSTANCES
): ParsedIcsEvent[] {
  try {
    const startDate = new Date(baseEvent.startsAt);
    const now = new Date();
    const horizonDate = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);

    // Parse the RRULE string
    // rrulestr expects the rule to start with "RRULE:"
    const ruleString = rruleValue.startsWith("RRULE:") ? rruleValue : `RRULE:${rruleValue}`;
    
    let rrule: RRule;
    try {
      rrule = rrulestr(ruleString, { dtstart: startDate });
    } catch {
      // If parsing fails, return just the base event
      return [baseEvent];
    }

    // Get all occurrences between now and the horizon
    const occurrences = rrule.between(now, horizonDate, true);
    
    // Limit the number of instances
    const limitedOccurrences = occurrences.slice(0, maxInstances);
    
    if (limitedOccurrences.length === 0) {
      return [baseEvent];
    }

    // Create an event for each occurrence
    return limitedOccurrences.map((occurrence, index) => {
      const instanceStartsAt = occurrence.toISOString();
      const duration = baseEvent.endsAt 
        ? new Date(baseEvent.endsAt).getTime() - new Date(baseEvent.startsAt).getTime()
        : 0;
      
      return {
        ...baseEvent,
        id: generateRecurringInstanceId(baseEvent.id, instanceStartsAt),
        startsAt: instanceStartsAt,
        endsAt: duration > 0 
          ? new Date(occurrence.getTime() + duration).toISOString()
          : baseEvent.endsAt,
        isRecurring: true,
        recurringInstanceId: `${baseEvent.id}-${index}`
      };
    });
  } catch {
    // If expansion fails for any reason, return just the base event
    return [baseEvent];
  }
}

export interface ParseIcsOptions {
  /** Number of days to expand recurring events into the future */
  rruleHorizonDays?: number;
  /** Maximum number of instances per recurring event */
  rruleMaxInstances?: number;
}

export function parseIcs(ics: string, options?: ParseIcsOptions): ParsedIcsEvent[] {
  const lines = unfoldLines(ics);
  const events: ParsedIcsEvent[] = [];

  const horizonDays = options?.rruleHorizonDays ?? DEFAULT_RRULE_HORIZON_DAYS;
  const maxInstances = options?.rruleMaxInstances ?? DEFAULT_RRULE_MAX_INSTANCES;

  let current: Record<string, { value: string; params: Record<string, string> }> =
    {};
  let inEvent = false;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      inEvent = false;
      const uid = current.UID?.value?.trim();
      const summary = current.SUMMARY?.value?.trim();
      const dtStart = current.DTSTART?.value?.trim();
      const rrule = current.RRULE?.value?.trim();
      
      if (summary && dtStart) {
        try {
          const startsAt = parseIcsDate(dtStart, current.DTSTART?.params?.TZID);
          const baseEvent: ParsedIcsEvent = {
            id: uid || generateStableId(summary, startsAt),
            title: unescapeIcsValue(summary),
            startsAt,
            endsAt: current.DTEND?.value ? parseIcsDate(current.DTEND.value, current.DTEND?.params?.TZID) : undefined,
            location: current.LOCATION?.value ? unescapeIcsValue(current.LOCATION.value.trim()) : undefined,
            campusId:
              current["X-CAMPUS-ID"]?.value?.trim() ||
              current["X-CAMPUS"]?.value?.trim() ||
              undefined
          };

          // Handle RRULE (recurring events)
          if (rrule) {
            const expandedEvents = expandRecurringEvent(baseEvent, rrule, horizonDays, maxInstances);
            events.push(...expandedEvents);
          } else {
            events.push(baseEvent);
          }
        } catch {
          // Skip event with invalid date
        }
      }

      current = {};
      continue;
    }

    if (!inEvent) continue;
    if (!line.includes(":")) continue;

    const [rawKey, ...rest] = line.split(":");
    const value = rest.join(":");
    if (!rawKey) continue;

    const [key, ...paramParts] = rawKey.split(";");
    const params: Record<string, string> = {};
    for (const part of paramParts) {
      const [pKey, pVal] = part.split("=");
      if (pKey && pVal) {
        // #59: Strip double quotes from parameter values
        params[pKey] = pVal.replace(/^"(.*)"$/, "$1");
      }
    }

    current[key] = { value: value.trim(), params };
  }

  return events.sort((a, b) => (a.startsAt < b.startsAt ? -1 : a.startsAt > b.startsAt ? 1 : a.id.localeCompare(b.id)));
}
