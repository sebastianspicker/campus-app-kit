import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSchedule } from "../../src/hooks/useSchedule";
import { Card } from "../../src/ui/Card";
import { MetaRow } from "../../src/ui/MetaRow";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function ScheduleDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useSchedule();
  const item = data?.schedule.find((entry) => entry.id === id);

  return (
    <Screen>
      <Section title="Schedule Entry">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Card
          title={item ? item.title : "Schedule item"}
          subtitle={
            item
              ? new Date(item.startsAt).toLocaleString()
              : `Schedule ID: ${id}`
          }
        />
        {item ? (
          <View style={styles.metaCard}>
            <MetaRow
              label="Starts"
              value={new Date(item.startsAt).toLocaleString()}
            />
            <MetaRow
              label="Ends"
              value={item.endsAt ? new Date(item.endsAt).toLocaleString() : "TBA"}
            />
            <MetaRow label="Location" value={item.location ?? "TBA"} />
            {item.campusId ? (
              <MetaRow label="Campus" value={item.campusId} />
            ) : null}
          </View>
        ) : null}
        {!loading && !error && !item ? (
          <Text style={styles.muted}>Schedule entry not found.</Text>
        ) : null}
        <Text style={styles.muted}>
          Connect a private schedule feed to enrich this view.
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
