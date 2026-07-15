import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { SortDirection } from "@/screens/eventsScreenHelpers";
import { scaledRadius, spacing, typography } from "@/ui/theme";
import { useTheme } from "@/ui/ThemeContext";
import { useLocale } from "@/i18n/LocaleContext";

const styles = StyleSheet.create({
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sortText: {
    ...typography.caption,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});

export function EventSortButton({
  sortDirection,
  onToggleSort
}: {
  sortDirection: SortDirection;
  onToggleSort: () => void;
}): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;
  const { t } = useLocale();
  const direction = sortDirection === "asc" ? t("sortDescending") : t("sortAscending");

  return (
    <Pressable
      onPress={onToggleSort}
      style={({ pressed }) => [
        styles.sortButton,
        {
          borderColor: theme.colors.border,
          borderWidth: ui.borderWidth,
          borderRadius: scaledRadius(8, ui),
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={t("sortEventsAccessibility", { direction })}
    >
      <Text style={[styles.sortText, { color: theme.colors.text }]}>
        {sortDirection === "asc" ? t("sortEventsAscending") : t("sortEventsDescending")}
      </Text>
    </Pressable>
  );
}
