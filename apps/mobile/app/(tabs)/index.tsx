import React, { useCallback } from "react";
import { useToday } from "@/hooks/useToday";
import { useSchedule } from "@/hooks/useSchedule";
import { ResourceListSection } from "@/ui/ResourceListSection";
import { Screen } from "@/ui/Screen";
import type { PublicEvent } from "@campus/shared";
import type { ScheduleItem } from "@campus/shared";

export default function TodayScreen(): JSX.Element {
  const { data, error, loading, refreshing, refresh } = useToday();
  const scheduleState = useSchedule();
  const events = data?.events ?? [];
  const scheduleItems = scheduleState.data?.schedule ?? [];
  const refreshingAll = refreshing || scheduleState.refreshing;
  const refreshAll = useCallback(async () => {
    await Promise.all([refresh(), scheduleState.refresh()]);
  }, [refresh, scheduleState.refresh]);

  const eventsKeyExtractor = useCallback((e: PublicEvent) => e.id, []);
  const eventsHref = useCallback(
    (e: PublicEvent) => ({ pathname: "/events/[id]" as const, params: { id: e.id } }),
    []
  );
  const eventsRenderCard = useCallback(
    (e: PublicEvent) => ({
      title: e.title,
      subtitle: new Date(e.date).toLocaleString()
    }),
    []
  );
  const eventsAccessibilityLabel = useCallback(
    (e: PublicEvent) => `${e.title}. ${new Date(e.date).toLocaleString()}.`,
    []
  );

  const scheduleKeyExtractor = useCallback((s: ScheduleItem) => s.id, []);
  const scheduleHref = useCallback(
    (s: ScheduleItem) => ({ pathname: "/schedule/[id]" as const, params: { id: s.id } }),
    []
  );
  const scheduleRenderCard = useCallback(
    (s: ScheduleItem) => ({
      title: s.title,
      subtitle: `${new Date(s.startsAt).toLocaleTimeString()} - ${s.location ?? "TBA"}`
    }),
    []
  );
  const scheduleAccessibilityLabel = useCallback(
    (s: ScheduleItem) =>
      `${s.title}. ${new Date(s.startsAt).toLocaleTimeString()}. Location: ${s.location ?? "TBA"}.`,
    []
  );

  return (
    <Screen refreshing={refreshingAll} onRefresh={refreshAll}>
      <ResourceListSection
        title="Today"
        loading={loading}
        error={error}
        items={events}
        emptyMessage="No public events today."
        keyExtractor={eventsKeyExtractor}
        href={eventsHref}
        renderCard={eventsRenderCard}
        accessibilityLabel={eventsAccessibilityLabel}
      />
      <ResourceListSection
        title="Schedule"
        loading={scheduleState.loading}
        error={scheduleState.error}
        items={scheduleItems}
        emptyMessage="No public schedule items."
        keyExtractor={scheduleKeyExtractor}
        href={scheduleHref}
        renderCard={scheduleRenderCard}
        accessibilityLabel={scheduleAccessibilityLabel}
      />
    </Screen>
  );
}
