import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

export function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;

  return (
    <View style={[styles.section, { marginBottom: Math.round(spacing.lg * ui.controlScale) }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            marginBottom: Math.round(spacing.sm * ui.controlScale),
            fontSize: Math.round(typography.subheading.fontSize * ui.fontScale),
            lineHeight: Math.round(typography.subheading.lineHeight * ui.fontScale),
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {},
  title: {
    ...typography.subheading,
  },
  body: {
    gap: spacing.sm
  }
});
