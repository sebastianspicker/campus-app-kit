import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

export function MetaRow({
  label,
  value
}: {
  label: string;
  value: string;
}): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;

  const captionSize = Math.round(typography.caption.fontSize * ui.fontScale);
  const captionLineHeight = Math.round(typography.caption.lineHeight * ui.fontScale);
  const bodySize = Math.round(typography.body.fontSize * ui.fontScale);
  const bodyLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: ui.borderWidth,
          paddingVertical: Math.round(spacing.xs * ui.controlScale),
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.muted,
            fontSize: captionSize,
            lineHeight: captionLineHeight,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        selectable
        style={[
          styles.value,
          {
            color: theme.colors.text,
            fontSize: bodySize,
            lineHeight: bodyLineHeight,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    ...typography.caption,
  },
  value: {
    ...typography.body,
  }
});
