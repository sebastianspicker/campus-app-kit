import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { LoadingBlock } from "./LoadingBlock";
import { Screen } from "./Screen";
import { Section } from "./Section";
import { scaled, scaledFont, scaledRadius, typography } from "./theme";
import { useTheme } from "./ThemeContext";

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
  refreshing?: boolean;
  onRefresh?: () => void;
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
  footnote,
  refreshing,
  onRefresh
}: ResourceDetailScreenProps<T>): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <Section title={title}>
        {loading ? <LoadingBlock /> : null}
        {error ? (
          <Text
            selectable
            style={[
              styles.error,
              {
                color: theme.colors.accent,
                fontSize: scaledFont(typography.body.fontSize, ui),
                lineHeight: scaledFont(typography.body.lineHeight, ui),
              },
            ]}
          >
            {error}
          </Text>
        ) : null}
        <Card title={cardTitle} subtitle={cardSubtitle} />
        {item && renderMeta ? (
          <View
            style={[
              styles.metaCard,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                borderWidth: ui.borderWidth,
                borderRadius: scaledRadius(12, ui),
                padding: scaled(12, ui),
              },
            ]}
          >
            {renderMeta()}
          </View>
        ) : null}
        {!loading && !error && !item ? (
          <EmptyState message={notFoundMessage} />
        ) : null}
        {footnote ? (
          <Text
            selectable
            style={[
              styles.muted,
              {
                color: theme.colors.muted,
                fontSize: scaledFont(typography.caption.fontSize, ui),
                lineHeight: scaledFont(typography.caption.lineHeight, ui),
              },
            ]}
          >
            {footnote}
          </Text>
        ) : null}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    ...typography.body,
  },
  muted: {
    ...typography.caption,
  },
  metaCard: {
    borderCurve: "continuous",
  },
});
