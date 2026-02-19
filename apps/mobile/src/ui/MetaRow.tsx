import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "./theme";

export function MetaRow({
  label,
  value
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  label: {
    ...typography.caption,
    color: colors.muted
  },
  value: {
    ...typography.body,
    color: colors.text
  }
});
