import {
  PublicEventSchema,
  RoomSchema,
  ScheduleItemSchema,
  type PublicEvent,
  type Room,
  type ScheduleItem
} from "@campus/shared";
import type { z } from "zod";

type RecordWithId = { id: string };
export type DetailSource = "network" | "memory-cache" | "persisted-cache" | null;
const MAX_SELECTED_RECORDS_PER_RESOURCE = 50;

export type SelectedRecordStore<T extends RecordWithId> = {
  remember: (value: unknown, options?: { authoritative?: boolean }) => boolean;
  get: (id: string | undefined) => T | null;
  markMissing: (id: string | undefined) => void;
  clear: () => void;
};

function createSelectedRecordStore<T extends RecordWithId>(schema: z.ZodType<T>): SelectedRecordStore<T> {
  const records = new Map<string, T>();
  const missingIds = new Map<string, true>();
  return {
    remember(value: unknown, options: { authoritative?: boolean } = {}): boolean {
      const parsed = schema.safeParse(value);
      if (!parsed.success) return false;
      if (missingIds.has(parsed.data.id) && !options.authoritative) return false;
      if (options.authoritative) missingIds.delete(parsed.data.id);
      records.delete(parsed.data.id);
      records.set(parsed.data.id, parsed.data);
      if (records.size > MAX_SELECTED_RECORDS_PER_RESOURCE) {
        const oldestId = records.keys().next().value;
        if (oldestId !== undefined) records.delete(oldestId);
      }
      return true;
    },
    get(id: string | undefined): T | null {
      return id && !missingIds.has(id) ? records.get(id) ?? null : null;
    },
    markMissing(id: string | undefined): void {
      if (!id) return;
      records.delete(id);
      missingIds.delete(id);
      missingIds.set(id, true);
      if (missingIds.size > MAX_SELECTED_RECORDS_PER_RESOURCE) {
        const oldestId = missingIds.keys().next().value;
        if (oldestId !== undefined) missingIds.delete(oldestId);
      }
    },
    clear(): void {
      records.clear();
      missingIds.clear();
    }
  };
}

export const selectedEventDetails = createSelectedRecordStore<PublicEvent>(PublicEventSchema);
export const selectedRoomDetails = createSelectedRecordStore<Room>(RoomSchema);
export const selectedScheduleDetails = createSelectedRecordStore<ScheduleItem>(ScheduleItemSchema);

export function selectDetailRecord<T extends RecordWithId>(
  id: string | undefined,
  collection: T[] | null,
  source: DetailSource,
  selected: T | null,
  degraded = false
): T | null {
  const current = id ? collection?.find((record) => record.id === id) : undefined;
  if (current) return current;
  // Only a fresh network response is authoritative evidence that the selected
  // record is absent. Query-specific, offline, and degraded responses may be
  // incomplete.
  if (collection && source === "network" && !degraded) return null;
  return selected?.id === id ? selected : null;
}

export function reconcileSelectedDetailRecord<T extends RecordWithId>(
  store: SelectedRecordStore<T>,
  id: string | undefined,
  collection: T[] | null,
  source: DetailSource,
  degraded = false
): void {
  if (!id || !collection || source !== "network") return;
  const current = collection.find((record) => record.id === id);
  if (current) store.remember(current, { authoritative: true });
  else if (!degraded) store.markMissing(id);
}

export function clearSelectedDetailRecords(): void {
  selectedEventDetails.clear();
  selectedRoomDetails.clear();
  selectedScheduleDetails.clear();
}
