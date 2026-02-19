import { StyleSheet } from "react-native";
import { colors, typography } from "./theme";

export const listScreenStyles = StyleSheet.create({
  error: {
    ...typography.body,
    color: colors.accent
  },
  muted: {
    ...typography.body,
    color: colors.muted
  }
});
