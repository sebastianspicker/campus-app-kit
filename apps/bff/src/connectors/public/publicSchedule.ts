import type { InstitutionPack } from "../../config/loader";
import { getCached } from "../../utils/cache";
import { fetchWithTimeout } from "../../utils/fetch";
import { log } from "../../utils/logger";
import type { ScheduleItem } from "@campus/shared";

import { parseIcs } from "./icsParser";

import { BFF_ENV } from "../../config/env";

export async function fetchPublicSchedule(
  institution: InstitutionPack
): Promise<ScheduleItem[]> {
  const sources = institution.publicSources?.schedules ?? [];
  const cacheKey = `public-schedule:${institution.id}`;
  const ttlMs = BFF_ENV.defaultCacheTtl * 1000;

  return getCached(
    cacheKey,
    async () => {
      const results: ScheduleItem[] = [];

      const settlement = await Promise.allSettled(
        sources.map(async (source: { url: string }) => {
          const response = await fetchWithTimeout(source.url);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const text = await response.text();
          return parseIcs(text);
        })
      );

      settlement.forEach((result: PromiseSettledResult<any[]>, index: number) => {
        if (result.status === "fulfilled") {
          results.push(...result.value.map((p: any) => ({
            id: p.id,
            title: p.title,
            startsAt: p.startsAt,
            endsAt: p.endsAt,
            location: p.location,
            campusId: p.campusId
          })));
        } else {
          log("warn", "public_schedule_source_failed", {
            sourceUrl: sources[index].url,
            reason: result.reason instanceof Error ? result.reason.message : String(result.reason)
          });
        }
      });

      return results;
    },
    ttlMs
  );
}
