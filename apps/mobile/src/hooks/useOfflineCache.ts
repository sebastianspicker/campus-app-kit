import { useState, useEffect, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { getCacheStats } from "../data/persistedCache";

type OfflineCacheState = {
  isOffline: boolean;
  hasOfflineData: boolean;
  cacheAge: number | null;
  checkOfflineStatus: () => Promise<void>;
};

export function useOfflineCache(): OfflineCacheState {
  const [isOffline, setIsOffline] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [cacheAge, setCacheAge] = useState<number | null>(null);
  
  const checkOfflineStatus = useCallback(async () => {
    try {
      const stats = await getCacheStats();
      setHasOfflineData(stats.offlineKeys.length > 0);
      
      if (stats.offlineKeys.length > 0 && stats.newestEntry) {
        setCacheAge(Date.now() - stats.newestEntry);
      }
    } catch (error) {
      console.error("Failed to check offline status:", error);
    }
  }, []);
  
  useEffect(() => {
    // Check initial connection state
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });
    
    // Subscribe to connection changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    
    // Check offline data status
    checkOfflineStatus();
    
    return () => {
      unsubscribe();
    };
  }, [checkOfflineStatus]);
  
  return {
    isOffline,
    hasOfflineData,
    cacheAge,
    checkOfflineStatus
  };
}