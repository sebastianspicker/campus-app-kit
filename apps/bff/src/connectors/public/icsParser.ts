import { createHash } from "node:crypto";

export type ParsedIcsEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  campusId?: string;
};

// #66: Stable fallback ID when UID is missing
function generateStableId(title: string, startsAt: string): string {
  return createHash("sha256")
    .update(`${title}|${startsAt}`)
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

export function parseIcs(ics: string): ParsedIcsEvent[] {
  const lines = unfoldLines(ics);
  const events: ParsedIcsEvent[] = [];

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
      if (summary && dtStart) {
        try {
          const startsAt = parseIcsDate(dtStart, current.DTSTART?.params?.TZID);
          events.push({
            id: uid || generateStableId(summary, startsAt),
            title: unescapeIcsValue(summary),
            startsAt,
            endsAt: current.DTEND?.value ? parseIcsDate(current.DTEND.value, current.DTEND?.params?.TZID) : undefined,
            location: current.LOCATION?.value ? unescapeIcsValue(current.LOCATION.value.trim()) : undefined,
            campusId:
              current["X-CAMPUS-ID"]?.value?.trim() ||
              current["X-CAMPUS"]?.value?.trim() ||
              undefined
          });
        } catch {
          // Skip event with invalid date
        }
      }

      // #70: Note: RRULE (recurring events) are not supported yet. 
      // Only the first instance is parsed.

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
