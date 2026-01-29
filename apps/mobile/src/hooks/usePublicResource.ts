import { useCallback, useEffect, useState } from "react";

type PublicResource<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

export function usePublicResource<T>(loader: (force?: boolean) => Promise<T>): PublicResource<T> {
  // TODO: Basis-Hook für Today/Events/Rooms/Schedule.
  // - Gemeinsame Cancelation (AbortController).
  // - „stale-while-revalidate“-Logik.
  // - Fehler und Loading-States vereinheitlichen.
  throw new Error("TODO: usePublicResource implementieren");
}
