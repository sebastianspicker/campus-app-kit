import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocale } from "../i18n/LocaleContext";
import { formatCacheAge } from "../components/cacheAge";
import { spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

type StatusBannerProps = {
  kind: "cached" | "degraded" | "info";
  cacheAge?: number | null;
  message?: string;
};

const WARNING_BANNER_KINDS = new Set<StatusBannerProps["kind"]>(["cached", "degraded"]);

type MessageContext = {
  cacheAge: StatusBannerProps["cacheAge"];
  locale: ReturnType<typeof useLocale>["locale"];
  t: ReturnType<typeof useLocale>["t"];
};

function getDefaultMessage(kind: StatusBannerProps["kind"], context: MessageContext): string {
  const messages: Record<StatusBannerProps["kind"], string> = {
    cached: context.t("cachedDataAge", { age: formatCacheAge(context.cacheAge ?? 0, context.locale) }),
    degraded: context.t("degradedData"),
    info: context.t("loading")
  };
  return messages[kind];
}

export function StatusBanner({ kind, cacheAge, message }: StatusBannerProps): JSX.Element {
  const theme = useTheme();
  const { locale, t } = useLocale();
  const isWarning = WARNING_BANNER_KINDS.has(kind);
  const backgroundColor = isWarning ? theme.colors.warningSurface : theme.colors.infoSurface;
  const color = isWarning ? theme.colors.warning : theme.colors.info;
  const defaultMessage = getDefaultMessage(kind, { cacheAge, locale, t });

  return (
    <View
      accessibilityRole={isWarning ? "alert" : undefined}
      accessibilityLiveRegion="polite"
      style={[styles.container, { backgroundColor, borderColor: color }]}
    >
      <Text style={[styles.text, { color }]}>{message ?? defaultMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { ...typography.caption, fontWeight: "600" },
});
