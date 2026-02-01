import type { RoomsResponse } from "../api/types";
import { fetchRooms } from "../data/publicApi";
import { usePublicResource } from "./usePublicResource";

export function useRooms(): {
  data: RoomsResponse | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
} {
  return usePublicResource<RoomsResponse>((options) =>
    fetchRooms({ force: options.force, signal: options.signal })
  );
}
