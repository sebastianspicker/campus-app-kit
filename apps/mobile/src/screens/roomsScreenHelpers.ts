import { formatCampusId } from "@/utils/dateFormat";
import type { Room } from "@campus/shared";
import type { TranslationKey } from "@/i18n/dictionaries";

export function getRoomHref(room: Room): {
  pathname: "/rooms/[id]";
  params: { id: string };
} {
  return { pathname: "/rooms/[id]", params: { id: room.id } };
}

export function getRoomCard(room: Room): { title: string; subtitle?: string } {
  return {
    title: room.name,
    subtitle: room.campusId ? formatCampusId(room.campusId) : undefined,
  };
}

export function getRoomAccessibilityLabel(room: Room, campusLabel: string): string {
  return `${room.name}. ${room.campusId ? `${campusLabel} ${room.campusId}.` : ""}`;
}

export function getRoomsEmptyMessage(search: string, t: (key: TranslationKey, values?: Record<string, string | number>) => string): string {
  return search ? t("noMatchingRooms", { search }) : t("noRooms");
}

export function getRoomsEmptyHint(search: string, t: (key: TranslationKey) => string): string {
  return t(search ? "searchEmptyHint" : "roomsEmptyHint");
}
