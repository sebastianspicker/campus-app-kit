import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scaled, scaledFont, spacing, typography } from "./theme";
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
    <View style={[styles.section, { marginBottom: scaled(spacing.xl, ui) }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.muted,
            marginBottom: scaled(spacing.md, ui),
            fontSize: scaledFont(typography.small.fontSize, ui),
            letterSpacing: typography.small.letterSpacing,
            textTransform: "uppercase",
            fontWeight: "700",
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
    ...typography.small,
  },
  body: {
    gap: spacing.md
  }
});
