import { useEffect, useState } from "react";
import type { TodayResponse } from "../api/types";
import { getInstitutionTimeZone } from "../config/institution";
import { fetchToday } from "../data/publicApi";
import { usePublicResource, type PublicResource } from "./usePublicResource";
import { getCampusDate, millisecondsUntilNextCampusDay } from "../utils/campusTime";

export function useCampusDate(timeZone = getInstitutionTimeZone()): string {
  const [currentInstant, setCurrentInstant] = useState(() => new Date());

  useEffect(() => {
    const refreshDate = () => setCurrentInstant(new Date());
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNextRefresh = () => {
      const now = new Date();
      timeout = setTimeout(() => {
        refreshDate();
        scheduleNextRefresh();
      }, millisecondsUntilNextCampusDay(now, timeZone));
    };
    refreshDate();
    scheduleNextRefresh();
    return () => clearTimeout(timeout);
  }, [timeZone]);

  return getCampusDate(currentInstant, timeZone);
}

export function useToday(): PublicResource<TodayResponse> {
  const campusDate = useCampusDate();
  return usePublicResource<TodayResponse>((options) =>
    fetchToday({
      force: options.force,
      signal: options.signal,
      offlineMode: true,
      date: campusDate
    })
  , campusDate);
}
