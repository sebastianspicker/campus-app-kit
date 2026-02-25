import React from "react";
import { Text } from "react-native";
import { createListScreenStyles } from "./listScreenStyles";
import { useTheme } from "./ThemeContext";

export type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps): JSX.Element {
  const theme = useTheme();
  const styles = createListScreenStyles(theme.colors);

  return (
    <Text selectable style={styles.muted} accessibilityRole="text">
      {message}
    </Text>
  );
}
