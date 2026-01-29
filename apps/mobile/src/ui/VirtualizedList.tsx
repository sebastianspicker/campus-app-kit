import React from "react";
import { FlatList, ListRenderItem } from "react-native";

// Placeholder: Virtualized list wrapper for performance
// TODO:
// - Provide consistent spacing/header/footer for sections
// - Memoize item renderers where possible
// - Add empty/loading states
// - Use keyExtractor with stable IDs

export function VirtualizedList<T>({
  data,
  renderItem,
  keyExtractor
}: {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
}): JSX.Element {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}
