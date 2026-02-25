import type { ScheduleResponse } from "../api/types";
import { fetchSchedule, type ScheduleFilterOptions } from "../data/publicApi";
import { usePublicResource } from "./usePublicResource";

export function useSchedule(options?: ScheduleFilterOptions): {
  data: ScheduleResponse | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
} {
  return usePublicResource<ScheduleResponse>((fetchOptions) =>
    fetchSchedule({ 
      force: fetchOptions.force, 
      signal: fetchOptions.signal,
      search: options?.search,
      from: options?.from,
      to: options?.to,
      campus: options?.campus,
      limit: options?.limit,
      offset: options?.offset
    })
  );
}
