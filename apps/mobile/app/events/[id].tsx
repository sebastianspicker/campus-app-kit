import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../src/hooks/useEvents";
import { Card } from "../../src/ui/Card";
import { MetaRow } from "../../src/ui/MetaRow";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function EventDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useEvents();
  const event = data?.events.find((entry) => entry.id === id);

  return (
    <Screen>
      <Section title="Event Details">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Card
          title={event ? event.title : `Event ID: ${id}`}
          subtitle={event ? new Date(event.date).toLocaleString() : undefined}
        />
        {event ? (
          <View style={styles.metaCard}>
            <MetaRow
              label="Date"
              value={new Date(event.date).toLocaleString()}
            />
            <MetaRow label="Source" value={event.sourceUrl} />
          </View>
        ) : null}
        {!loading && !error && !event ? (
          <Text style={styles.muted}>Event not found.</Text>
        ) : null}
        <Text style={styles.muted}>
          This detail view uses public data only.
        </Text>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.text
  },
  error: {
    ...typography.body,
    color: colors.accent
  },
  metaCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  muted: {
    ...typography.caption,
    color: colors.muted
  }
});
