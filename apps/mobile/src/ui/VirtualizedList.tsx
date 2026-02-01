import React from "react";
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle
} from "react-native";

export function VirtualizedList<T>({
  data,
  renderItem,
  keyExtractor,
  contentContainerStyle,
  emptyText
}: {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  emptyText?: string;
}): JSX.Element {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={
        emptyText ? <Text style={styles.empty}>{emptyText}</Text> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 12,
    opacity: 0.7
  }
});
