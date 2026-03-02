import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { shadows, spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

export function Card({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;

  const cardRadius = Math.round(16 * ui.borderRadiusScale);
  const cardPadding = Math.round(spacing.lg * ui.controlScale);
  const titleFontSize = Math.round(typography.body.fontSize * ui.fontScale);
  const titleLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);
  const subtitleFontSize = Math.round(typography.caption.fontSize * ui.fontScale);
  const subtitleLineHeight = Math.round(typography.caption.lineHeight * ui.fontScale);

  const isDark = theme.colors.background === "#050505";

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(50)}
      style={[
        styles.card,
        isDark ? shadows.md : shadows.sm,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: ui.borderWidth,
          borderRadius: cardRadius,
          padding: cardPadding,
          shadowColor: isDark ? "#000" : theme.colors.muted,
        },
      ]}
    >
      <Text
        selectable
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: titleFontSize,
            lineHeight: titleLineHeight,
          },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          selectable
          style={[
            styles.subtitle,
            {
              color: theme.colors.muted,
              fontSize: subtitleFontSize,
              lineHeight: subtitleLineHeight,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: "continuous",
    overflow: "hidden", // Ensures content stays within continuous curve
  },
  title: {
    ...typography.body,
    fontWeight: "700", // Polished bold
    letterSpacing: -0.3, // Modern tight tracking
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontWeight: "400",
    letterSpacing: 0.1,
  }
});
