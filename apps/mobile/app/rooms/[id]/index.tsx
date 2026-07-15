import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useRooms } from "@/hooks/useRooms";
import { MetaRow } from "@/ui/MetaRow";
import { ResourceDetailScreen } from "@/ui/ResourceDetailScreen";
import { useLocale } from "@/i18n/LocaleContext";
import { reconcileSelectedDetailRecord, selectDetailRecord, selectedRoomDetails } from "@/data/selectedDetailRecords";

export default function RoomDetailScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useRooms();
  const collection = state.data?.rooms ?? null;
  const room = selectDetailRecord(
    id,
    collection,
    state.source,
    selectedRoomDetails.get(id)
  );
  const { t } = useLocale();

  useEffect(() => {
    reconcileSelectedDetailRecord(selectedRoomDetails, id, collection, state.source);
  }, [collection, id, state.source]);

  return (
    <ResourceDetailScreen
      title={t("rooms")}
      loading={state.loading}
      error={state.error}
      item={room ?? null}
      notFoundMessage={t("errorNotFound")}
      cardTitle={room ? room.name : `Room ID: ${id}`}
      cardSubtitle={room?.campusId}
      renderMeta={
        room
          ? () => (
              <>
                <MetaRow label={t("campus")} value={room.campusId} />
              </>
            )
          : undefined
      }
      refreshing={state.refreshing}
      onRefresh={state.refresh}
    />
  );
}
