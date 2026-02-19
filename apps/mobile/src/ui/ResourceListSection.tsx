import React from "react";
import { Text } from "react-native";
import { EmptyState } from "./EmptyState";
import { LoadingBlock } from "./LoadingBlock";
import { ResourceListItem } from "./ResourceListItem";
import { Section } from "./Section";
import { listScreenStyles } from "./listScreenStyles";

export type ResourceListSectionProps<T> = {
  title: string;
  loading: boolean;
  error: string | null;
  items: T[];
  emptyMessage: string;
  keyExtractor: (item: T) => string;
  href: (item: T) => { pathname: string; params: Record<string, string> };
  renderCard: (item: T) => { title: string; subtitle?: string };
  accessibilityLabel: (item: T) => string;
};

export function ResourceListSection<T>({
  title,
  loading,
  error,
  items,
  emptyMessage,
  keyExtractor,
  href,
  renderCard,
  accessibilityLabel
}: ResourceListSectionProps<T>): JSX.Element {
  return (
    <Section title={title}>
      {loading ? <LoadingBlock /> : null}
      {error ? <Text selectable style={listScreenStyles.error}>{error}</Text> : null}
      {items.map((item) => (
        <ResourceListItem
          key={keyExtractor(item)}
          item={item}
          href={href}
          renderCard={renderCard}
          accessibilityLabel={accessibilityLabel}
        />
      ))}
      {!loading && !error && items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : null}
    </Section>
  );
}
