const expoOs = process.env.EXPO_OS;
const isIos = expoOs === "ios";
const isAndroid = expoOs === "android";

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

const fontFamily = {
  serif: isIos ? "Georgia" : isAndroid ? "serif" : "Georgia",
  sans: isIos ? "Avenir Next" : isAndroid ? "sans-serif" : "Avenir Next"
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: fontFamily.serif
  },
  subheading: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: fontFamily.serif
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamily.sans
  },
  caption: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: fontFamily.sans
  }
};
