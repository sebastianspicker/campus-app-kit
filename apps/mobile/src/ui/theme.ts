import { Platform } from "react-native";

export const colors = {
  background: "#f7f5f2",
  surface: "#ffffff",
  text: "#1b1a17",
  muted: "#4a4a4a",
  accent: "#d6542b",
  border: "#e2ddd5"
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia"
    })
  },
  subheading: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia"
    })
  },
  body: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Avenir Next",
      android: "sans-serif",
      default: "Avenir Next"
    })
  },
  caption: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: Platform.select({
      ios: "Avenir Next",
      android: "sans-serif",
      default: "Avenir Next"
    })
  }
};
