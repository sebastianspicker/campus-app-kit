import { useCallback, useEffect, useState } from "react";
import type { RoomsResponse } from "../api/types";
import { fetchRooms } from "../data/publicApi";

export function useRooms(): {
  data: RoomsResponse | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
} {
  const [data, setData] = useState<RoomsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = useCallback(async (force = false) => {
    try {
      const response = await fetchRooms({ force });
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    load()
      .catch(() => undefined)
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  }, [load]);

  return { data, error, loading, refreshing, refresh };
}
