import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useToday } from "../../src/hooks/useToday";
import { useSchedule } from "../../src/hooks/useSchedule";
import { Card } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function TodayScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useToday();
  const scheduleState = useSchedule();
  const scheduleItems = scheduleState.data?.schedule ?? [];
  const refreshingAll = refreshing || scheduleState.refreshing;
  const refreshAll = async () => {
    await Promise.all([refresh(), scheduleState.refresh()]);
  };

  return (
    <Screen refreshing={refreshingAll} onRefresh={refreshAll}>
      <Section title="Today">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {data?.events.map((event) => (
          <Link
            key={event.id}
            href={{ pathname: "/events/[id]", params: { id: event.id } }}
            asChild
          >
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${event.title}. ${new Date(
                event.date
              ).toLocaleString()}.`}
            >
              <Card
                title={event.title}
                subtitle={new Date(event.date).toLocaleString()}
              />
            </Pressable>
          </Link>
        ))}
        {!loading && !error && data?.events.length === 0 ? (
          <Text style={styles.muted}>No public events today.</Text>
        ) : null}
      </Section>
      <Section title="Schedule">
        {scheduleState.loading ? <ActivityIndicator /> : null}
        {scheduleState.error ? (
          <Text style={styles.error}>{scheduleState.error}</Text>
        ) : null}
        {scheduleItems.map((item) => (
          <Link
            key={item.id}
            href={{ pathname: "/schedule/[id]", params: { id: item.id } }}
            asChild
          >
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${item.title}. ${new Date(
                item.startsAt
              ).toLocaleTimeString()}. Location: ${item.location ?? "TBA"}.`}
            >
              <Card
                title={item.title}
                subtitle={`${new Date(item.startsAt).toLocaleTimeString()} - ${
                  item.location ?? "TBA"
                }`}
              />
            </Pressable>
          </Link>
        ))}
        {!scheduleState.loading && scheduleItems.length === 0 ? (
          <Text style={styles.muted}>No public schedule items.</Text>
        ) : null}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    ...typography.body,
    color: colors.accent
  },
  muted: {
    ...typography.body,
    color: colors.muted
  }
});
