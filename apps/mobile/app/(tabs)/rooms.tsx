import React, { useCallback } from "react";
import { useRooms } from "@/hooks/useRooms";
import { ResourceListSection } from "@/ui/ResourceListSection";
import { Screen } from "@/ui/Screen";
import type { Room } from "@campus/shared";

export default function RoomsScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useRooms();
  const rooms = data?.rooms ?? [];

  const keyExtractor = useCallback((r: Room) => r.id, []);
  const href = useCallback(
    (r: Room) => ({ pathname: "/rooms/[id]" as const, params: { id: r.id } }),
    []
  );
  const renderCard = useCallback((r: Room) => ({ title: r.name, subtitle: r.campusId }), []);
  const accessibilityLabel = useCallback(
    (r: Room) => `${r.name}. ${r.campusId ? `Campus ${r.campusId}.` : ""}`,
    []
  );

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <ResourceListSection
        title="Rooms"
        loading={loading}
        error={error}
        items={rooms}
        emptyMessage="No rooms available."
        keyExtractor={keyExtractor}
        href={href}
        renderCard={renderCard}
        accessibilityLabel={accessibilityLabel}
      />
    </Screen>
  );
}
