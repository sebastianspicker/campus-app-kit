import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getDemoSession } from "../../src/auth/session";
import { Card } from "@/ui/Card";
import { Screen } from "@/ui/Screen";
import { Section } from "@/ui/Section";
import { useTheme, useThemePreference, ThemePreference } from "@/ui/ThemeContext";
import { borderRadius, typography, spacing } from "@/ui/theme";
import { a11yButton } from "@/ui/a11y";

export default function ProfileScreen(): JSX.Element {
  const session = getDemoSession();
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const ui = theme.ui;

  const themeOptions: { label: string; value: ThemePreference }[] = [
    { label: "System", value: "system" },
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
    { label: "Accessibility", value: "accessibility" },
  ];

  const buttonPaddingHorizontal = Math.round(spacing.md * ui.controlScale);
  const buttonPaddingVertical = Math.round(spacing.sm * ui.controlScale);
  const buttonRadius = Math.round(borderRadius.md * ui.borderRadiusScale);
  const buttonFontSize = Math.round(typography.body.fontSize * ui.fontScale);
  const buttonLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);
  const labelFontSize = Math.round(typography.body.fontSize * ui.fontScale);
  const labelLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);

  return (
    <Screen>
      <Section title="Profile">
        <Card title={session.displayName} subtitle={session.userId} />
        <Text style={[styles.note, { color: theme.colors.muted }]}>
          Demo session only. Replace with private auth.
        </Text>
      </Section>

      <Section title="Appearance">
        <View style={styles.themeContainer}>
          <Text
            style={[
              styles.themeLabel,
              {
                color: theme.colors.text,
                fontSize: labelFontSize,
                lineHeight: labelLineHeight,
              },
            ]}
          >
            Theme
          </Text>
          <View style={styles.themeOptions}>
            {themeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: preference === option.value
                      ? theme.colors.accent
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: preference === option.value ? ui.emphasisBorderWidth : ui.borderWidth,
                    borderRadius: buttonRadius,
                    paddingHorizontal: buttonPaddingHorizontal,
                    paddingVertical: buttonPaddingVertical,
                  },
                ]}
                {...a11yButton(
                  `${option.label} theme`,
                  preference === option.value
                    ? "Currently selected"
                    : `Select ${option.label.toLowerCase()} theme`
                )}
                accessibilityState={{ selected: preference === option.value }}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color: preference === option.value
                        ? theme.colors.accentText
                        : theme.colors.text,
                      fontSize: buttonFontSize,
                      lineHeight: buttonLineHeight,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  themeContainer: {
    marginTop: spacing.sm,
  },
  themeLabel: {
    ...typography.body,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },
  themeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  themeButton: {},
  themeButtonText: {
    ...typography.body,
    fontWeight: "500",
  },
});
