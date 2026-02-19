import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useEvents } from "@/hooks/useEvents";
import { MetaRow } from "@/ui/MetaRow";
import { ResourceDetailScreen } from "@/ui/ResourceDetailScreen";

export default function EventDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useEvents();
  const event = data?.events.find((entry) => entry.id === id);

  return (
    <ResourceDetailScreen
      title="Event Details"
      loading={loading}
      error={error}
      item={event ?? null}
      notFoundMessage="Event not found."
      cardTitle={event ? event.title : `Event ID: ${id}`}
      cardSubtitle={event ? new Date(event.date).toLocaleString() : undefined}
      renderMeta={
        event
          ? () => (
              <>
                <MetaRow
                  label="Date"
                  value={new Date(event.date).toLocaleString()}
                />
                <MetaRow label="Source" value={event.sourceUrl} />
              </>
            )
          : undefined
      }
      footnote="This detail view uses public data only."
    />
  );
}
