import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { LoadingBlock } from "./LoadingBlock";
import { Screen } from "./Screen";
import { Section } from "./Section";
import { colors, typography } from "./theme";

const detailStyles = StyleSheet.create({
  error: {
    ...typography.body,
    color: colors.accent
  },
  muted: {
    ...typography.caption,
    color: colors.muted
  },
  metaCard: {
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  }
});

export type ResourceDetailScreenProps<T> = {
  title: string;
  loading: boolean;
  error: string | null;
  item: T | null;
  notFoundMessage: string;
  cardTitle: string;
  cardSubtitle?: string;
  renderMeta?: () => React.ReactNode;
  footnote?: string;
};

export function ResourceDetailScreen<T>({
  title,
  loading,
  error,
  item,
  notFoundMessage,
  cardTitle,
  cardSubtitle,
  renderMeta,
  footnote
}: ResourceDetailScreenProps<T>): JSX.Element {
  return (
    <Screen>
      <Section title={title}>
        {loading ? <LoadingBlock /> : null}
        {error ? <Text selectable style={detailStyles.error}>{error}</Text> : null}
        <Card title={cardTitle} subtitle={cardSubtitle} />
        {item && renderMeta ? (
          <View style={detailStyles.metaCard}>{renderMeta()}</View>
        ) : null}
        {!loading && !error && !item ? (
          <EmptyState message={notFoundMessage} />
        ) : null}
        {footnote ? <Text selectable style={detailStyles.muted}>{footnote}</Text> : null}
      </Section>
    </Screen>
  );
}
