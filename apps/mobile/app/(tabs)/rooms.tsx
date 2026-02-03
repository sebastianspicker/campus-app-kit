import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useRooms } from "../../src/hooks/useRooms";
import { Card } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function RoomsScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useRooms();

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Section title="Rooms">
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {data?.rooms.map((room) => (
          <Link
            key={room.id}
            href={{ pathname: "/rooms/[id]", params: { id: room.id } }}
            asChild
          >
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${room.name}. ${
                room.campusId ? `Campus ${room.campusId}.` : ""
              }`}
            >
              <Card title={room.name} subtitle={room.campusId} />
            </Pressable>
          </Link>
        ))}
        {!loading && !error && data?.rooms.length === 0 ? (
          <Text style={styles.muted}>No rooms available.</Text>
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
