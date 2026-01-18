import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "./theme";

export function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.sm
  },
  body: {
    gap: spacing.sm
  }
});
