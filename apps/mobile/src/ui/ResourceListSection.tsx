import React from "react";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { ResourceListItem } from "./ResourceListItem";
import { Section } from "./Section";
import { SkeletonList } from "./Skeleton";

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
  onRetry?: () => void;
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
  accessibilityLabel,
  onRetry
}: ResourceListSectionProps<T>): JSX.Element {
  return (
    <Section title={title}>
      {loading ? <SkeletonList count={3} /> : null}
      {error ? <ErrorState message={error} onRetry={onRetry} /> : null}
      {!loading && !error
        ? items.map((item) => (
            <ResourceListItem
              key={keyExtractor(item)}
              item={item}
              href={href}
              renderCard={renderCard}
              accessibilityLabel={accessibilityLabel}
            />
          ))
        : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : null}
    </Section>
  );
}
