import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRooms } from "../../../src/hooks/useRooms";
import { Card } from "../../../src/ui/Card";
import { MetaRow } from "../../../src/ui/MetaRow";
import { Screen } from "../../../src/ui/Screen";
import { Section } from "../../../src/ui/Section";
import { colors, typography } from "../../../src/ui/theme";

export default function RoomDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useRooms();
  const room = data?.rooms.find((entry) => entry.id === id);

  return (
    <Screen>
      <Section title="Room Details">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Card title={room ? room.name : `Room ID: ${id}`} subtitle={room?.campusId} />
        {room ? (
          <View style={styles.metaCard}>
            <MetaRow label="Campus" value={room.campusId} />
            <MetaRow label="Availability" value="Private connector required" />
          </View>
        ) : null}
        {!loading && !error && !room ? (
          <Text style={styles.muted}>Room not found.</Text>
        ) : null}
        <Text style={styles.muted}>
          Availability comes from private connectors.
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
