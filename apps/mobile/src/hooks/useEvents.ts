import type { EventsResponse } from "../api/types";
import { fetchEvents } from "../data/publicApi";
import { usePublicResource } from "./usePublicResource";

export function useEvents(): {
  data: EventsResponse | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
} {
  return usePublicResource<EventsResponse>((options) =>
    fetchEvents({ force: options.force, signal: options.signal })
  );
}
