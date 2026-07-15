import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

export { ChoiceRow } from "./ChoiceRow";

export function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  const theme = useTheme();
  return (
    <View style={styles.group} accessibilityRole="summary">
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={[styles.rows, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  title: { ...typography.subheading },
  rows: { borderWidth: 1, borderRadius: 8, overflow: "hidden" },
});
