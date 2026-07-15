import { formatEventDate, formatRelativeTime, formatScheduleTime, formatTimeRange } from "@/utils/dateFormat";
import type { PublicEvent, ScheduleItem } from "@campus/shared";
import type { UiError } from "@/api/uiError";
import { getCampusDayRange } from "@/utils/campusTime";

export type SortDirection = "asc" | "desc";

export function getLocalDayRange(date: Date, timeZone: string): { from: string; to: string } {
  return getCampusDayRange(date, timeZone);
}

export function isScheduleUnavailable(error: UiError | null): boolean {
  return error?.kind === "unavailableSource" || error?.kind === "notFound";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function sortScheduleItems(items: ScheduleItem[], direction: SortDirection): ScheduleItem[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.startsAt).getTime();
    const dateB = new Date(b.startsAt).getTime();
    return direction === "asc" ? dateA - dateB : dateB - dateA;
  });
}

export function getEventCard(event: PublicEvent, locale: string, timeZone: string): { title: string; subtitle: string } {
  return {
    title: event.title,
    subtitle: `${formatEventDate(event.date, locale, timeZone)} · ${formatRelativeTime(event.date, locale)}`
  };
}

export function getEventAccessibilityLabel(event: PublicEvent, locale: string, timeZone: string): string {
  return `${event.title}. ${formatEventDate(event.date, locale, timeZone)}. ${formatRelativeTime(event.date, locale)}.`;
}

export function getEventHref(event: PublicEvent): { pathname: "/events/[id]"; params: { id: string } } {
  return { pathname: "/events/[id]", params: { id: event.id } };
}

export function getScheduleCard(item: ScheduleItem, locale: string, timeZone: string, toBeAnnounced: string): { title: string; subtitle: string } {
  return {
    title: item.title,
    subtitle: `${formatTimeRange(item.startsAt, item.endsAt, locale, timeZone)} · ${item.location ?? toBeAnnounced}`
  };
}

export function getScheduleAccessibilityLabel(item: ScheduleItem, locale: string, timeZone: string, location: string, toBeAnnounced: string): string {
  return `${item.title}. ${formatScheduleTime(item.startsAt, locale, timeZone)}. ${location}: ${item.location ?? toBeAnnounced}.`;
}

export function getScheduleHref(item: ScheduleItem): {
  pathname: "/schedule/[id]";
  params: { id: string };
} {
  return { pathname: "/schedule/[id]", params: { id: item.id } };
}
