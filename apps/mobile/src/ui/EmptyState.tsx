import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createListScreenStyles } from "./listScreenStyles";
import { scaled, spacing } from "./theme";
import { useTheme } from "./ThemeContext";

export type EmptyStateProps = {
  message: string;
  icon?: string;
};

export function EmptyState({ message, icon }: EmptyStateProps): JSX.Element {
  const theme = useTheme();
  const textStyles = createListScreenStyles(theme.colors);
  const iconSize = scaled(48, theme.ui);

  if (icon) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: iconSize }}>{icon}</Text>
        <Text selectable style={textStyles.muted} accessibilityRole="text">
          {message}
        </Text>
      </View>
    );
  }

  return (
    <Text selectable style={textStyles.muted} accessibilityRole="text">
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
});
