import React, { useCallback } from "react";
import {
  getEventAccessibilityLabel,
  getEventCard,
  getEventHref
} from "@/screens/todayScreenHelpers";
import { ResourceListSection } from "@/ui/ResourceListSection";
import type { PublicEvent } from "@campus/shared";
import type { UiError } from "@/api/uiError";
import { useLocale } from "@/i18n/LocaleContext";
import { getInstitutionTimeZone } from "@/config/institution";
import { selectedEventDetails, type DetailSource } from "@/data/selectedDetailRecords";

export function TodayEventsSection({
  loading,
  error,
  events,
  source,
  onRetry
}: {
  loading: boolean;
  error: UiError | null;
  events: PublicEvent[];
  source: DetailSource;
  onRetry: () => void;
}): JSX.Element {
  const { locale, t } = useLocale();
  const timeZone = getInstitutionTimeZone();
  const keyExtractor = useCallback((event: PublicEvent) => event.id, []);
  const href = useCallback((event: PublicEvent) => getEventHref(event), []);
  const renderCard = useCallback((event: PublicEvent) => getEventCard(event, locale, timeZone), [locale, timeZone]);
  const accessibilityLabel = useCallback((event: PublicEvent) => getEventAccessibilityLabel(event, locale, timeZone), [locale, timeZone]);
  const onNavigate = useCallback((event: PublicEvent) => {
    selectedEventDetails.remember(event, { authoritative: source === "network" });
  }, [source]);

  return (
    <ResourceListSection
      title={t("events")}
      loading={loading}
      error={error}
      items={events}
      emptyMessage={t("noEvents")}
      emptyHint={t("eventsEmptyHint")}
      keyExtractor={keyExtractor}
      href={href}
      renderCard={renderCard}
      accessibilityLabel={accessibilityLabel}
      onNavigate={onNavigate}
      onRetry={onRetry}
    />
  );
}
