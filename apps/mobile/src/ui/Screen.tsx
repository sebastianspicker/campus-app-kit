import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { colors, spacing } from "./theme";

export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh
}: {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}): JSX.Element {
  const refreshControl = onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ) : undefined;

  return (
    <View style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        refreshControl={refreshControl}
        scrollEnabled={scroll}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md
  }
});
