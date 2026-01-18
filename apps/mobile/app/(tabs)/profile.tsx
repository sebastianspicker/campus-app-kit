import React from "react";
import { StyleSheet, Text } from "react-native";
import { getDemoSession } from "../../src/auth/session";
import { Card } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function ProfileScreen(): JSX.Element {
  const session = getDemoSession();

  return (
    <Screen>
      <Section title="Profile">
        <Card title={session.displayName} subtitle={session.userId} />
        <Text style={styles.note}>
          Demo session only. Replace with private auth.
        </Text>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    ...typography.caption,
    color: colors.muted
  }
});
