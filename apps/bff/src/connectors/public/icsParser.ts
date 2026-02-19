export type ParsedIcsEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  campusId?: string;
};

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

function parseIcsDate(value: string): string {
  let date: Date;
  // DATE (all-day)
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
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
    date = value.endsWith("Z") ? new Date(`${iso}Z`) : new Date(`${iso}Z`);
  }
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ICS date: ${value}`);
  }
  return date.toISOString();
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
          events.push({
            id: uid || `${events.length + 1}`,
            title: summary,
            startsAt: parseIcsDate(dtStart),
            endsAt: current.DTEND?.value ? parseIcsDate(current.DTEND.value) : undefined,
            location: current.LOCATION?.value?.trim() || undefined,
            campusId:
              current["X-CAMPUS-ID"]?.value?.trim() ||
              current["X-CAMPUS"]?.value?.trim() ||
              undefined
          });
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
      if (pKey && pVal) params[pKey] = pVal;
    }

    current[key] = { value: value.trim(), params };
  }

  return events.sort((a, b) => (a.startsAt < b.startsAt ? -1 : a.startsAt > b.startsAt ? 1 : a.id.localeCompare(b.id)));
}
