import { StyleSheet } from "react-native";
import { darkColors, ThemeColors, typography } from "./theme";

type ListScreenStyles = {
  error: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  muted: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
};

export function createListScreenStyles(themeColors: ThemeColors): ListScreenStyles {
  return StyleSheet.create({
    error: {
      ...typography.body,
      color: themeColors.accent,
    },
    muted: {
      ...typography.body,
      color: themeColors.muted,
    },
  });
}

export const listScreenStyles = createListScreenStyles(darkColors);
