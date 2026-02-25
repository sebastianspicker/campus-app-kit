import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, AppState, AppStateStatus } from "react-native";
import { useOfflineCache } from "../hooks/useOfflineCache";

type Props = {
  showCacheAge?: boolean;
};

export function OfflineIndicator({ showCacheAge = true }: Props): JSX.Element | null {
  const { isOffline, hasOfflineData, cacheAge } = useOfflineCache();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);
  
  // Don't show when app is in background
  if (appState !== "active") return null;
  
  // Show when device is offline
  if (isOffline) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are offline</Text>
        {hasOfflineData && showCacheAge && (
          <Text style={styles.subtext}>Showing cached data</Text>
        )}
      </View>
    );
  }
  
  // Show when displaying cached offline data
  if (hasOfflineData) {
    const ageText = cacheAge ? formatCacheAge(cacheAge) : "";
    return (
      <View style={[styles.container, styles.warningContainer]}>
        <Text style={styles.text}>Offline data{ageText ? ` (${ageText})` : ""}</Text>
      </View>
    );
  }
  
  return null;
}

function formatCacheAge(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d old`;
  if (hours > 0) return `${hours}h old`;
  if (minutes > 0) return `${minutes}m old`;
  return "just now";
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  warningContainer: {
    backgroundColor: "#f59e0b",
  },
  text: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  subtext: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 2,
  },
});