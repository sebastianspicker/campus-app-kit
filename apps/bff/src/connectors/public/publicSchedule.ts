import type { InstitutionPack } from "../../config/loader";
import { getCached } from "../../utils/cache";
import { fetchWithTimeout } from "../../utils/fetch";
import type { ScheduleItem } from "@campus/shared";

function unfoldIcsLines(input: string): string[] {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const unfolded: string[] = [];

  for (const line of lines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      const previous = unfolded.pop() ?? "";
      unfolded.push(previous + line.trimStart());
    } else {
      unfolded.push(line);
    }
  }

  return unfolded;
}

function parseIcsDate(value: string): string {
  if (!value || typeof value !== "string") {
    return new Date(0).toISOString();
  }
  const trimmed = value.trim();
  if (trimmed.length === 8) {
    const year = trimmed.slice(0, 4);
    const month = trimmed.slice(4, 6);
    const day = trimmed.slice(6, 8);
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
    return new Date(0).toISOString();
  }

  const normalized = trimmed.replace(/Z$/, "");
  if (normalized.length < 15) return new Date(0).toISOString();

  const year = normalized.slice(0, 4);
  const month = normalized.slice(4, 6);
  const day = normalized.slice(6, 8);
  const hour = normalized.slice(9, 11) || "00";
  const minute = normalized.slice(11, 13) || "00";
  const second = normalized.slice(13, 15) || "00";
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  const date = value.endsWith("Z") ? new Date(`${iso}Z`) : new Date(iso);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  return new Date(0).toISOString();
}

function parseIcsSchedule(ics: string, institutionId: string): ScheduleItem[] {
  const lines = unfoldIcsLines(ics);
  const items: ScheduleItem[] = [];
  let current: Record<string, string> = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }

    if (line === "END:VEVENT") {
      if (current.SUMMARY && current.DTSTART) {
        items.push({
          id: current.UID ?? `${institutionId}-${items.length + 1}`,
          title: current.SUMMARY,
          startsAt: parseIcsDate(current.DTSTART),
          endsAt: current.DTEND ? parseIcsDate(current.DTEND) : undefined,
          location: current.LOCATION,
          campusId: current["X-CAMPUS-ID"] ?? current["X-CAMPUS"]
        });
      }
      continue;
    }

    const [rawKey, ...rest] = line.split(":");
    const value = rest.join(":");
    const key = rawKey.split(";")[0];

    if (key && value) {
      current[key] = value.trim();
    }
  }

  return items;
}

export async function fetchPublicSchedule(
  institution: InstitutionPack
): Promise<ScheduleItem[]> {
  const sources = institution.publicSources?.schedules ?? [];
  const cacheKey = `public-schedule:${institution.id}`;
  const ttlMs = 5 * 60 * 1000;

  return getCached(
    cacheKey,
    async () => {
      const results: ScheduleItem[] = [];

      for (const source of sources) {
        try {
          const response = await fetchWithTimeout(source.url);

          if (!response.ok) {
            continue;
          }

          const text = await response.text();
          results.push(...parseIcsSchedule(text, institution.id));
        } catch {
          // Ignore failed sources and return partial results.
        }
      }

      return results;
    },
    ttlMs
  );
}
