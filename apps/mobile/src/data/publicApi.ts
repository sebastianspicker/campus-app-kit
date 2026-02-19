import type { z } from "zod";
import { ZodError } from "zod";
import { getJson } from "../api/client";
import { ApiErrorException } from "../api/errors";
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
import { getBffBaseUrl } from "../utils/env";
import { getCached } from "./cache";

const DEFAULT_TTL_MS = 60_000;

function getPublicCacheKey(suffix: string): string {
  try {
    return `public:${getBffBaseUrl()}:${suffix}`;
  } catch {
    return `public:${suffix}`;
  }
}

function safeParse<T>(data: unknown, schema: z.ZodType<T>): T {
  try {
    return schema.parse(data) as T;
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ApiErrorException({
        status: 502,
        code: "validation_error",
        message: "Invalid response format"
      });
    }
    throw err;
  }
}

async function getCachedJson<T>(
  path: string,
  schema: z.ZodType<T>,
  keySuffix: string,
  options?: { force?: boolean; signal?: AbortSignal }
): Promise<T> {
  const cacheKey = getPublicCacheKey(keySuffix);
  return getCached(
    cacheKey,
    () =>
      getJson<T>(path, (data) => safeParse(data, schema), { signal: options?.signal }),
    DEFAULT_TTL_MS,
    options?.force ?? false
  );
}

export function fetchEvents(options?: {
  force?: boolean;
  signal?: AbortSignal;
}): Promise<EventsResponse> {
  return getCachedJson("/events", EventsResponseSchema, "events", options);
}

export function fetchRooms(options?: { force?: boolean; signal?: AbortSignal }): Promise<RoomsResponse> {
  return getCachedJson("/rooms", RoomsResponseSchema, "rooms", options);
}

export function fetchToday(options?: { force?: boolean; signal?: AbortSignal }): Promise<TodayResponse> {
  return getCachedJson("/today", TodayResponseSchema, "today", options);
}

export function fetchSchedule(
  options?: { force?: boolean; signal?: AbortSignal }
): Promise<ScheduleResponse> {
  return getCachedJson("/schedule", ScheduleResponseSchema, "schedule", options);
}
