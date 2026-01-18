import React from "react";
import { Button, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/ui/Screen";
import { Section } from "../../src/ui/Section";
import { colors, typography } from "../../src/ui/theme";

export default function LoginScreen(): JSX.Element {
  return (
    <Screen>
      <Section title="Login">
        <Text style={styles.note}>Public repo ships a demo login screen.</Text>
        <Button title="Continue as Guest" onPress={() => {}} />
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
