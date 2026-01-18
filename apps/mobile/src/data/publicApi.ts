import { getJson } from "../api/client";
import type {
  EventsResponse,
  RoomsResponse,
  TodayResponse,
  ScheduleResponse
} from "../api/types";
import {
  EventsResponseSchema,
  RoomsResponseSchema,
  TodayResponseSchema,
  ScheduleResponseSchema
} from "@campus/shared";
import { getCached } from "./cache";

const DEFAULT_TTL_MS = 60_000;

export function fetchEvents(options?: { force?: boolean }): Promise<EventsResponse> {
  return getCached(
    "events",
    () => getJson<EventsResponse>("/events", (data) => EventsResponseSchema.parse(data)),
    DEFAULT_TTL_MS,
    options?.force
  );
}

export function fetchRooms(options?: { force?: boolean }): Promise<RoomsResponse> {
  return getCached(
    "rooms",
    () => getJson<RoomsResponse>("/rooms", (data) => RoomsResponseSchema.parse(data)),
    DEFAULT_TTL_MS,
    options?.force
  );
}

export function fetchToday(options?: { force?: boolean }): Promise<TodayResponse> {
  return getCached(
    "today",
    () => getJson<TodayResponse>("/today", (data) => TodayResponseSchema.parse(data)),
    DEFAULT_TTL_MS,
    options?.force
  );
}

export function fetchSchedule(
  options?: { force?: boolean }
): Promise<ScheduleResponse> {
  return getCached(
    "schedule",
    () =>
      getJson<ScheduleResponse>("/schedule", (data) =>
        ScheduleResponseSchema.parse(data)
      ),
    DEFAULT_TTL_MS,
    options?.force
  );
}
