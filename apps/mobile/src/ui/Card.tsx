import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "./theme";

export function Card({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600"
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs
  }
});
