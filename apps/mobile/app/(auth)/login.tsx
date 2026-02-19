import React from "react";
import { Button, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/ui/Screen";
import { Section } from "@/ui/Section";
import { colors, typography } from "@/ui/theme";

export default function LoginScreen(): JSX.Element {
  return (
    <Screen>
      <Section title="Login">
        <Text style={styles.note}>
          This public template does not include real authentication. Private auth
          belongs in a private repo.
        </Text>
        <Button
          title="Continue as Guest"
          onPress={() => router.replace("/(tabs)")}
          accessibilityLabel="Continue as Guest"
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    ...typography.body,
    color: colors.text
  }
});
