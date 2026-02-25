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

function getPublicCacheKey(suffix: string, queryParams?: Record<string, string>): string {
  try {
    const base = `public:${getBffBaseUrl()}:${suffix}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const sortedParams = Object.entries(queryParams)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
      return `${base}?${sortedParams}`;
    }
    return base;
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
  options?: { force?: boolean; signal?: AbortSignal; queryParams?: Record<string, string> }
): Promise<T> {
  const cacheKey = getPublicCacheKey(keySuffix, options?.queryParams);
  const queryString = options?.queryParams 
    ? `?${new URLSearchParams(options.queryParams).toString()}`
    : "";
  return getCached(
    cacheKey,
    () =>
      getJson<T>(`${path}${queryString}`, (data) => safeParse(data, schema), { signal: options?.signal }),
    DEFAULT_TTL_MS,
    options?.force ?? false
  );
}

export type EventsFilterOptions = {
  force?: boolean;
  signal?: AbortSignal;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export function fetchEvents(options?: EventsFilterOptions): Promise<EventsResponse> {
  const queryParams: Record<string, string> = {};
  if (options?.search) queryParams.search = options.search;
  if (options?.from) queryParams.from = options.from;
  if (options?.to) queryParams.to = options.to;
  if (options?.limit !== undefined) queryParams.limit = String(options.limit);
  if (options?.offset !== undefined) queryParams.offset = String(options.offset);
  
  return getCachedJson("/events", EventsResponseSchema, "events", {
    force: options?.force,
    signal: options?.signal,
    queryParams
  });
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
