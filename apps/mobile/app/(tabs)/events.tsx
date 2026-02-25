import React, { useCallback, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { SearchBar } from "@/components/SearchBar";
import { ResourceListSection } from "@/ui/ResourceListSection";
import { Screen } from "@/ui/Screen";
import type { PublicEvent } from "@campus/shared";

export default function EventsScreen(): JSX.Element {
  const [search, setSearch] = useState("");
  const { data, error, loading, refreshing, refresh } = useEvents({ search: search || undefined });
  const events = data?.events ?? [];

  const keyExtractor = useCallback((e: PublicEvent) => e.id, []);
  const href = useCallback(
    (e: PublicEvent) => ({ pathname: "/events/[id]" as const, params: { id: e.id } }),
    []
  );
  const renderCard = useCallback(
    (e: PublicEvent) => ({
      title: e.title,
      subtitle: new Date(e.date).toLocaleString()
    }),
    []
  );
  const accessibilityLabel = useCallback(
    (e: PublicEvent) => `${e.title}. ${new Date(e.date).toLocaleString()}.`,
    []
  );

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search events..."
      />
      <ResourceListSection
        title="Stage"
        loading={loading}
        error={error}
        items={events}
        emptyMessage={search ? `No events matching "${search}"` : "No public events."}
        keyExtractor={keyExtractor}
        href={href}
        renderCard={renderCard}
        accessibilityLabel={accessibilityLabel}
      />
    </Screen>
  );
}
