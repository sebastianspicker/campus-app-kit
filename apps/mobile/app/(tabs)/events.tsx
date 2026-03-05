import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEvents } from "@/hooks/useEvents";
import { SearchBar } from "@/components/SearchBar";
import { ResourceListSection } from "@/ui/ResourceListSection";
import { Screen } from "@/ui/Screen";
import { spacing, typography } from "@/ui/theme";
import { useTheme } from "@/ui/ThemeContext";
import { formatEventDate } from "@/utils/dateFormat";
import type { PublicEvent } from "@campus/shared";

type SortDirection = "asc" | "desc";

export default function EventsScreen(): JSX.Element {
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { data, error, loading, refreshing, refresh } = useEvents({ search: search || undefined });
  const events = data?.events ?? [];
  const theme = useTheme();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [events, sortDirection]);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const keyExtractor = useCallback((e: PublicEvent) => e.id, []);
  const href = useCallback(
    (e: PublicEvent) => ({ pathname: "/events/[id]" as const, params: { id: e.id } }),
    []
  );
  const renderCard = useCallback(
    (e: PublicEvent) => ({
      title: e.title,
      subtitle: formatEventDate(e.date)
    }),
    []
  );
  const accessibilityLabel = useCallback(
    (e: PublicEvent) => `${e.title}. ${formatEventDate(e.date)}.`,
    []
  );

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search events..."
          />
        </View>
        <Pressable
          onPress={toggleSort}
          style={({ pressed }) => [
            styles.sortButton,
            {
              borderColor: theme.colors.border,
              borderWidth: theme.ui.borderWidth,
            },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Sort by date ${sortDirection === "asc" ? "descending" : "ascending"}`}
        >
          <Text style={[styles.sortText, { color: theme.colors.text }]}>
            {sortDirection === "asc" ? "Oldest first" : "Newest first"}
          </Text>
        </Pressable>
      </View>
      <ResourceListSection
        title="Stage"
        loading={loading}
        error={error}
        items={sortedEvents}
        emptyMessage={search ? `No events matching "${search}"` : "No public events."}
        emptyIcon={"📅"}
        keyExtractor={keyExtractor}
        href={href}
        renderCard={renderCard}
        accessibilityLabel={accessibilityLabel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
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
