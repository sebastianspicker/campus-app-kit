import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, typography } from "./theme";
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

  const cardRadius = Math.round(12 * ui.borderRadiusScale);
  const cardPadding = Math.round(spacing.md * ui.controlScale);
  const titleFontSize = Math.round(typography.body.fontSize * ui.fontScale);
  const titleLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);
  const subtitleFontSize = Math.round(typography.caption.fontSize * ui.fontScale);
  const subtitleLineHeight = Math.round(typography.caption.lineHeight * ui.fontScale);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: ui.borderWidth,
          borderRadius: cardRadius,
          padding: cardPadding,
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: "continuous",
  },
  title: {
    ...typography.body,
    fontWeight: "600"
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs
  }
});
