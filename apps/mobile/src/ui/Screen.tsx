import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { spacing } from "./theme";
import { useTheme } from "./ThemeContext";

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
  const theme = useTheme();
  const ui = theme.ui;

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.accent}
      colors={[theme.colors.accent]}
      progressBackgroundColor={theme.colors.surface}
    />
  ) : undefined;

  // Modernized looser padding for breathing room
  const contentPadding = Math.round(spacing.xl * ui.controlScale);
  const contentGap = Math.round(spacing.lg * ui.controlScale);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: contentPadding,
            gap: contentGap,
          },
        ]}
        refreshControl={refreshControl}
        scrollEnabled={scroll}
        showsVerticalScrollIndicator={false} // Cleaner look
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl * 2, // Extra bottom padding for floating tab bars / modern bottom bounds
  },
});
