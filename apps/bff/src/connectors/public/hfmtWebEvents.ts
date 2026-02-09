import type { InstitutionPack } from "../../config/loader";
import { getCached } from "../../utils/cache";
import { fetchWithTimeout } from "../../utils/fetch";
import { buildEventId } from "./eventId";

export type PublicEvent = {
  id: string;
  title: string;
  date: string;
  sourceUrl: string;
};

export async function fetchPublicEvents(
  institution: InstitutionPack
): Promise<PublicEvent[]> {
  const sources = institution.publicSources?.events ?? [];
  const envDate = process.env.PUBLIC_EVENTS_DATE;
  const now = envDate ? new Date(envDate) : new Date();
  const cacheKey = `public-events:${institution.id}`;
  const ttlMs = 5 * 60 * 1000;
  const mode = process.env.PUBLIC_EVENTS_MODE ?? "auto";

  return getCached(
    cacheKey,
    async () => {
      if (mode === "mock") {
        const mockEvents = sources.map((source) => {
          const date = now.toISOString();
          return {
            id: buildEventId({ sourceUrl: source.url, title: source.label, date }),
            title: source.label,
            date,
            sourceUrl: source.url
          };
        });

        return mockEvents;
      }

      const parsedEvents: PublicEvent[] = [];

      for (const source of sources) {
        try {
          const response = await fetchWithTimeout(source.url);

          if (!response.ok) {
            continue;
          }

          const html = await response.text();
          parsedEvents.push(
            ...extractEventsFromHtml(html, source.url)
          );
        } catch {
          // Ignore failed sources and return partial results.
        }
      }

      const deduped = dedupeAndSortEvents(parsedEvents);
      if (deduped.length > 0) {
        return deduped.slice(0, 8);
      }

      const fallbackEvents = sources.map((source) => {
        const date = now.toISOString();
        return {
          id: buildEventId({ sourceUrl: source.url, title: source.label, date }),
          title: source.label,
          date,
          sourceUrl: source.url
        };
      });

      return fallbackEvents;
    },
    ttlMs
  );
}

function extractEventsFromHtml(
  html: string,
  sourceUrl: string,
): PublicEvent[] {
  if (sourceUrl.includes("hfmt-koeln.de")) {
    return extractHfmtEvents(html, sourceUrl);
  }

  return extractGenericEvents(html, sourceUrl);
}

function extractHfmtEvents(
  html: string,
  sourceUrl: string,
): PublicEvent[] {
  const events: PublicEvent[] = [];
  const blocks = html.match(/<article[\s\S]*?<\/article>/gi) ?? [];

  for (const block of blocks) {
    const title = extractTitle(block);
    if (!title) {
      continue;
    }

    const date = extractDate(block) ?? new Date().toISOString();
    const url = extractHref(block, sourceUrl);

    if (!url) {
      continue;
    }

    events.push({
      id: buildEventId({ sourceUrl: url, title, date }),
      title,
      date,
      sourceUrl: url
    });

    if (events.length >= 8) {
      break;
    }
  }

  if (events.length > 0) {
    return events;
  }

  const tiles =
    html.match(/<div[^>]*class="[^"]*event[^"]*"[\s\S]*?<\/div>/gi) ?? [];
  for (const block of tiles) {
    const title = extractTitle(block);
    const date = extractDate(block) ?? new Date().toISOString();
    const url = extractHref(block, sourceUrl);

    if (!title || !url) {
      continue;
    }

    events.push({
      id: buildEventId({ sourceUrl: url, title, date }),
      title,
      date,
      sourceUrl: url
    });

    if (events.length >= 8) {
      break;
    }
  }

  if (events.length > 0) {
    return events;
  }

  return extractGenericEvents(html, sourceUrl);
}

function extractGenericEvents(
  html: string,
  sourceUrl: string
): PublicEvent[] {
  const events: PublicEvent[] = [];
  const anchorRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1];
    const rawTitle = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (rawTitle.length < 4 || rawTitle.length > 120) {
      continue;
    }

    const date = new Date().toISOString();
    const resolvedUrl = safeResolveUrl(href, sourceUrl);

    if (!resolvedUrl) {
      continue;
    }

    events.push({
      id: buildEventId({ sourceUrl: resolvedUrl, title: rawTitle, date }),
      title: rawTitle,
      date,
      sourceUrl: resolvedUrl
    });

    if (events.length >= 8) {
      break;
    }
  }

  return events;
}

function dedupeAndSortEvents(events: PublicEvent[]): PublicEvent[] {
  const byId = new Map<string, PublicEvent>();
  for (const e of events) {
    byId.set(e.id, e);
  }

  return [...byId.values()].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.id.localeCompare(b.id);
  });
}

function extractTitle(block: string): string | null {
  const dataTitleMatch = block.match(/data-event-title="([^"]+)"/i);
  if (dataTitleMatch) {
    const cleaned = dataTitleMatch[1].trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  const headingMatch = block.match(/<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/i);
  if (headingMatch) {
    const cleaned = headingMatch[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  const anchorTextMatch = block.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
  if (anchorTextMatch) {
    const cleaned = anchorTextMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  return null;
}

function extractDate(block: string): string | null {
  const datetimeMatch = block.match(/datetime="([^"]+)"/i);
  if (datetimeMatch) {
    const parsed = new Date(datetimeMatch[1]);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString();
    }
  }

  const dateTimeMatch =
    block.match(/(\d{2})\.(\d{2})\.(\d{4})\s*(\d{2}):(\d{2})/);
  if (dateTimeMatch) {
    const iso = `${dateTimeMatch[3]}-${dateTimeMatch[2]}-${dateTimeMatch[1]}T${dateTimeMatch[4]}:${dateTimeMatch[5]}:00.000Z`;
    const date = new Date(iso);
    if (!Number.isNaN(date.valueOf())) return date.toISOString();
  }

  const dateMatch = block.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (dateMatch) {
    const iso = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T00:00:00.000Z`;
    const date = new Date(iso);
    if (!Number.isNaN(date.valueOf())) return date.toISOString();
  }

  return null;
}

function extractHref(block: string, sourceUrl: string): string | null {
  const dataUrlMatch = block.match(/data-event-url="([^"]+)"/i);
  if (dataUrlMatch) {
    return safeResolveUrl(dataUrlMatch[1], sourceUrl);
  }

  const hrefMatch = block.match(/href="([^"]+)"/i);
  if (!hrefMatch) {
    return null;
  }

  return safeResolveUrl(hrefMatch[1], sourceUrl);
}

function safeResolveUrl(href: string, sourceUrl: string): string | null {
  try {
    return new URL(href, sourceUrl).toString();
  } catch {
    return null;
  }
}
