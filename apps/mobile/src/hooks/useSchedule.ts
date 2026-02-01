import type { ScheduleResponse } from "../api/types";
import { fetchSchedule } from "../data/publicApi";
import { usePublicResource } from "./usePublicResource";

export function useSchedule(): {
  data: ScheduleResponse | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
} {
  return usePublicResource<ScheduleResponse>((options) =>
    fetchSchedule({ force: options.force, signal: options.signal })
  );
}
