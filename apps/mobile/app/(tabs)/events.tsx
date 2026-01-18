import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../src/hooks/useEvents";
import { Card } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function EventsScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useEvents();

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Section title="Stage">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {data?.events.map((event) => (
          <Link
            key={event.id}
            href={{ pathname: "/events/[id]", params: { id: event.id } }}
          >
            <View>
              <Card
                title={event.title}
                subtitle={new Date(event.date).toLocaleString()}
              />
            </View>
          </Link>
        ))}
        {!loading && !error && data?.events.length === 0 ? (
          <Text style={styles.muted}>No public events.</Text>
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
