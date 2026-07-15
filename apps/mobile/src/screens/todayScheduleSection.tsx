import React, { useCallback } from "react";
import {
  getScheduleAccessibilityLabel,
  getScheduleCard,
  getScheduleHref
} from "@/screens/todayScreenHelpers";
import type { SortDirection } from "@/screens/todayScreenHelpers";
import { ScheduleSortHeader } from "@/screens/scheduleSortHeader";
import { ResourceListSection } from "@/ui/ResourceListSection";
import type { ScheduleItem } from "@campus/shared";
import type { UiError } from "@/api/uiError";
import { useLocale } from "@/i18n/LocaleContext";
import { getInstitutionTimeZone } from "@/config/institution";
import { selectedScheduleDetails, type DetailSource } from "@/data/selectedDetailRecords";

export function ScheduleSection({
  sortDirection,
  onToggleSort,
  loading,
  error,
  items,
  source,
  onRetry
}: {
  sortDirection: SortDirection;
  onToggleSort: () => void;
  loading: boolean;
  error: UiError | null;
  items: ScheduleItem[];
  source: DetailSource;
  onRetry: () => void;
}): JSX.Element {
  const { locale, t } = useLocale();
  const timeZone = getInstitutionTimeZone();
  const keyExtractor = useCallback((item: ScheduleItem) => item.id, []);
  const href = useCallback((item: ScheduleItem) => getScheduleHref(item), []);
  const renderCard = useCallback((item: ScheduleItem) => getScheduleCard(item, locale, timeZone, t("toBeAnnounced")), [locale, t, timeZone]);
  const accessibilityLabel = useCallback((item: ScheduleItem) => getScheduleAccessibilityLabel(item, locale, timeZone, t("location"), t("toBeAnnounced")), [locale, t, timeZone]);
  const onNavigate = useCallback((item: ScheduleItem) => {
    selectedScheduleDetails.remember(item, { authoritative: source === "network" });
  }, [source]);

  return (
    <>
      <ScheduleSortHeader sortDirection={sortDirection} onToggleSort={onToggleSort} />
      <ResourceListSection
        title={t("schedule")}
        loading={loading}
        error={error}
        items={items}
        emptyMessage={t("noSchedule")}
        emptyHint={t("scheduleEmptyHint")}
        keyExtractor={keyExtractor}
        href={href}
        renderCard={renderCard}
        accessibilityLabel={accessibilityLabel}
        onNavigate={onNavigate}
        onRetry={onRetry}
      />
    </>
  );
}
