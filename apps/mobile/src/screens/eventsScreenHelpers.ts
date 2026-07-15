import { formatEventDate } from "@/utils/dateFormat";
import type { PublicEvent } from "@campus/shared";
import type { TranslationKey } from "@/i18n/dictionaries";

export type SortDirection = "asc" | "desc";

export function sortEventsByDate(events: PublicEvent[], direction: SortDirection): PublicEvent[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return direction === "asc" ? dateA - dateB : dateB - dateA;
  });
}

export function getEventHref(event: PublicEvent): { pathname: "/events/[id]"; params: { id: string } } {
  return { pathname: "/events/[id]", params: { id: event.id } };
}

export function getEventCard(event: PublicEvent, locale: string, timeZone: string): { title: string; subtitle: string } {
  return {
    title: event.title,
    subtitle: formatEventDate(event.date, locale, timeZone)
  };
}

export function getEventAccessibilityLabel(event: PublicEvent, locale: string, timeZone: string): string {
  return `${event.title}. ${formatEventDate(event.date, locale, timeZone)}.`;
}

export function getEventsEmptyMessage(search: string, t: (key: TranslationKey, values?: Record<string, string | number>) => string): string {
  return search ? t("noMatchingEvents", { search }) : t("noEvents");
}

export function getEventsEmptyHint(search: string, t: (key: TranslationKey) => string): string {
  return t(search ? "searchEmptyHint" : "eventsEmptyHint");
}
