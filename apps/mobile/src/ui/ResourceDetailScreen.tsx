import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { LoadingBlock } from "./LoadingBlock";
import { Screen } from "./Screen";
import { Section } from "./Section";
import { typography } from "./theme";
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
  const theme = useTheme();
  const ui = theme.ui;

  return (
    <Screen>
      <Section title={title}>
        {loading ? <LoadingBlock /> : null}
        {error ? (
          <Text
            selectable
            style={[
              styles.error,
              {
                color: theme.colors.accent,
                fontSize: Math.round(typography.body.fontSize * ui.fontScale),
                lineHeight: Math.round(typography.body.lineHeight * ui.fontScale),
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
                borderRadius: Math.round(12 * ui.borderRadiusScale),
                padding: Math.round(12 * ui.controlScale),
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
                fontSize: Math.round(typography.caption.fontSize * ui.fontScale),
                lineHeight: Math.round(typography.caption.lineHeight * ui.fontScale),
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
