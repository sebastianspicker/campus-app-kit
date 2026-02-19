import type { InstitutionPack } from "../../config/loader";
import { getCached } from "../../utils/cache";
import { fetchWithTimeout } from "../../utils/fetch";
import { log } from "../../utils/logger";
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

/**
 * Parses an ICS date value (e.g. 20240310 or 20240310T180000Z).
 * Returns null for invalid or missing values so callers can skip the event
 * instead of emitting 1970-01-01. TZID from the property key is not yet
 * applied; non-Z times are interpreted as UTC.
 */
function parseIcsDate(value: string): string | null {
  if (!value || typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 8) {
    const year = trimmed.slice(0, 4);
    const month = trimmed.slice(4, 6);
    const day = trimmed.slice(6, 8);
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
    return null;
  }

  const normalized = trimmed.replace(/Z$/, "");
  if (normalized.length < 15) return null;

  const year = normalized.slice(0, 4);
  const month = normalized.slice(4, 6);
  const day = normalized.slice(6, 8);
  const hour = normalized.slice(9, 11) || "00";
  const minute = normalized.slice(11, 13) || "00";
  const second = normalized.slice(13, 15) || "00";
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  const date = value.endsWith("Z") ? new Date(`${iso}Z`) : new Date(iso);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  return null;
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
        const startsAt = parseIcsDate(current.DTSTART);
        if (startsAt === null) continue;
        const endsAt = current.DTEND ? parseIcsDate(current.DTEND) ?? undefined : undefined;
        items.push({
          id: current.UID ?? `${institutionId}-${items.length + 1}`,
          title: current.SUMMARY,
          startsAt,
          endsAt,
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
            log("warn", "public_schedule_source_failed", {
              sourceUrl: source.url,
              reason: `HTTP ${response.status}`
            });
            continue;
          }

          const text = await response.text();
          results.push(...parseIcsSchedule(text, institution.id));
        } catch (err) {
          log("warn", "public_schedule_source_failed", {
            sourceUrl: source.url,
            reason: err instanceof Error ? err.message : String(err)
          });
        }
      }

      return results;
    },
    ttlMs
  );
}
