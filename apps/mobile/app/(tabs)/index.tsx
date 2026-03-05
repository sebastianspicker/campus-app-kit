import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useToday } from "@/hooks/useToday";
import { useSchedule } from "@/hooks/useSchedule";
import { ResourceListSection } from "@/ui/ResourceListSection";
import { Screen } from "@/ui/Screen";
import { spacing, typography } from "@/ui/theme";
import { useTheme } from "@/ui/ThemeContext";
import { formatEventDate, formatRelativeTime, formatScheduleTime, formatTimeRange } from "@/utils/dateFormat";
import type { PublicEvent } from "@campus/shared";
import type { ScheduleItem } from "@campus/shared";

type SortDirection = "asc" | "desc";

export default function TodayScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useToday();
  const scheduleState = useSchedule();
  const events = data?.events ?? [];
  const scheduleItems = scheduleState.data?.schedule ?? [];
  const [scheduleSortDirection, setScheduleSortDirection] = useState<SortDirection>("asc");
  const theme = useTheme();

  const refreshingAll = refreshing || scheduleState.refreshing;
  const refreshAll = useCallback(async () => {
    await Promise.all([refresh(), scheduleState.refresh()]);
  }, [refresh, scheduleState.refresh]);

  const sortedSchedule = useMemo(() => {
    return [...scheduleItems].sort((a, b) => {
      const dateA = new Date(a.startsAt).getTime();
      const dateB = new Date(b.startsAt).getTime();
      return scheduleSortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [scheduleItems, scheduleSortDirection]);

  const toggleScheduleSort = useCallback(() => {
    setScheduleSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const eventsKeyExtractor = useCallback((e: PublicEvent) => e.id, []);
  const eventsHref = useCallback(
    (e: PublicEvent) => ({ pathname: "/events/[id]" as const, params: { id: e.id } }),
    []
  );
  const eventsRenderCard = useCallback(
    (e: PublicEvent) => ({
      title: e.title,
      subtitle: `${formatEventDate(e.date)} · ${formatRelativeTime(e.date)}`
    }),
    []
  );
  const eventsAccessibilityLabel = useCallback(
    (e: PublicEvent) => `${e.title}. ${formatEventDate(e.date)}. ${formatRelativeTime(e.date)}.`,
    []
  );

  const scheduleKeyExtractor = useCallback((s: ScheduleItem) => s.id, []);
  const scheduleHref = useCallback(
    (s: ScheduleItem) => ({ pathname: "/schedule/[id]" as const, params: { id: s.id } }),
    []
  );
  const scheduleRenderCard = useCallback(
    (s: ScheduleItem) => ({
      title: s.title,
      subtitle: `${formatTimeRange(s.startsAt, s.endsAt)} · ${s.location ?? "TBA"}`
    }),
    []
  );
  const scheduleAccessibilityLabel = useCallback(
    (s: ScheduleItem) =>
      `${s.title}. ${formatScheduleTime(s.startsAt)}. Location: ${s.location ?? "TBA"}.`,
    []
  );

  return (
    <Screen refreshing={refreshingAll} onRefresh={refreshAll}>
      <ResourceListSection
        title="Today"
        loading={loading}
        error={error}
        items={events}
        emptyMessage="No public events today."
        emptyIcon={"📅"}
        keyExtractor={eventsKeyExtractor}
        href={eventsHref}
        renderCard={eventsRenderCard}
        accessibilityLabel={eventsAccessibilityLabel}
      />
      <View style={styles.scheduleHeader}>
        <Pressable
          onPress={toggleScheduleSort}
          style={({ pressed }) => [
            styles.sortButton,
            {
              borderColor: theme.colors.border,
              borderWidth: theme.ui.borderWidth,
            },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Sort schedule ${scheduleSortDirection === "asc" ? "latest first" : "earliest first"}`}
        >
          <Text style={[styles.sortText, { color: theme.colors.text }]}>
            {scheduleSortDirection === "asc" ? "Earliest first" : "Latest first"}
          </Text>
        </Pressable>
      </View>
      <ResourceListSection
        title="Schedule"
        loading={scheduleState.loading}
        error={scheduleState.error}
        items={sortedSchedule}
        emptyMessage="No public schedule items."
        emptyIcon={"📋"}
        keyExtractor={scheduleKeyExtractor}
        href={scheduleHref}
        renderCard={scheduleRenderCard}
        accessibilityLabel={scheduleAccessibilityLabel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  sortText: {
    ...typography.caption,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
