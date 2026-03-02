import { useColorScheme } from "react-native";

const expoOs = process.env.EXPO_OS;
const isIos = expoOs === "ios";
const isAndroid = expoOs === "android";

export type ColorScheme = "light" | "dark" | "accessibility";

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  overlay: string;
  disabled: string;
  placeholder: string;
};

export type ThemeUi = {
  fontScale: number;
  controlScale: number;
  borderWidth: number;
  emphasisBorderWidth: number;
  borderRadiusScale: number;
};

// ============================================
// WCAG AA Contrast Ratio Compliance
// ============================================
// Text contrast ratios:
// - Normal text (< 18pt): 4.5:1 minimum
// - Large text (>= 18pt or 14pt bold): 3:1 minimum
// - UI components: 3:1 minimum

// Light theme colors - Sophisticated, clean, airy 2026 aesthetic
const lightColors: ThemeColors = {
  background: "#fdfdfc",      // Crisp warm white
  surface: "#ffffff",         // Pure white for elevated surfaces
  text: "#1a1a1a",            // Softened jet black
  muted: "#737373",           // Neutral balanced gray
  accent: "#ea580c",          // Deeper, vibrant tactile orange
  accentText: "#ffffff",      // Contrast for accent
  border: "#efede8",          // Very faint warm gray border
  error: "#dc2626",
  success: "#16a34a",
  warning: "#d97706",
  info: "#2563eb",
  overlay: "rgba(0, 0, 0, 0.25)", // Softer translucent overlay
  disabled: "#a3a3a3",
  placeholder: "#a3a3a3",
};

// Dark theme colors - "Deep Space Glass" 2026 premium aesthetic
const darkColors: ThemeColors = {
  background: "#050505",      // Near OLED black
  surface: "#121212",         // Elevated very dark gray, high quality
  text: "#ededed",            // Crisp but not stark white
  muted: "#a1a1aa",           // Cool visible gray
  accent: "#f97316",          // Neonic vibrant orange
  accentText: "#ffffff",      // For buttons with orange backgrounds
  border: "#262626",          // Barely-there structural line
  error: "#f87171",
  success: "#4ade80",
  warning: "#fbbf24",
  info: "#60a5fa",
  overlay: "rgba(0, 0, 0, 0.45)", // Tinted cinematic blur backdrop
  disabled: "#525252",
  placeholder: "#525252",
};

// High-contrast accessibility theme with larger visual affordances
const accessibilityColors: ThemeColors = {
  background: "#000000",
  surface: "#0a0a0a",
  text: "#ffffff",
  muted: "#f2f2f2",
  accent: "#00d7ff",
  accentText: "#000000",
  border: "#ffffff",
  error: "#ff6b6b",
  success: "#68ff9a",
  warning: "#ffd84d",
  info: "#7dd3ff",
  overlay: "rgba(0, 0, 0, 0.88)",
  disabled: "#8a8a8a",
  placeholder: "#d8d8d8",
};

const standardUi: ThemeUi = {
  fontScale: 1,
  controlScale: 1,
  // Thinner borders for elegance (React Native supports sub-pixel values like StyleSheet.hairlineWidth, but we'll use a precise thin stroke)
  borderWidth: 0.5,
  emphasisBorderWidth: 1.5,
  // Larger, softer curves matching Apple/Google 2026 fluid design guidelines
  borderRadiusScale: 1.5, 
};

const accessibilityUi: ThemeUi = {
  fontScale: 1.15,
  controlScale: 1.2,
  borderWidth: 2,
  emphasisBorderWidth: 2.5,
  borderRadiusScale: 1.08,
};

// ============================================
// Legacy Exports (for backward compatibility)
// ============================================

// Default legacy palette now follows the default product direction (dark)
export const colors = darkColors;

// Export both color schemes for dynamic switching
export const colorSchemes: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
  accessibility: accessibilityColors,
};

export const uiSchemes: Record<ColorScheme, ThemeUi> = {
  light: standardUi,
  dark: standardUi,
  accessibility: accessibilityUi,
};

// Export key palettes for ThemeContext
export { lightColors, darkColors, accessibilityColors };

// ============================================
// Spacing
// ============================================

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

// ============================================
// Typography
// ============================================

const fontFamily = {
  serif: isIos ? "Georgia" : isAndroid ? "serif" : "Georgia",
  sans: isIos ? "Avenir Next" : isAndroid ? "sans-serif" : "Avenir Next",
  mono: isIos ? "Menlo" : isAndroid ? "monospace" : "monospace",
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: fontFamily.serif,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: fontFamily.serif,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamily.sans,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontFamily: fontFamily.sans,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontFamily: fontFamily.sans,
    lineHeight: 16,
  },
  // Relative font sizes for accessibility scaling
  relative: {
    heading: {
      fontSize: 24,
      fontWeight: "700" as const,
      fontFamily: fontFamily.serif,
      allowFontScaling: true,
    },
    subheading: {
      fontSize: 18,
      fontWeight: "700" as const,
      fontFamily: fontFamily.serif,
      allowFontScaling: true,
    },
    body: {
      fontSize: 16,
      fontFamily: fontFamily.sans,
      allowFontScaling: true,
    },
    caption: {
      fontSize: 13,
      fontFamily: fontFamily.sans,
      allowFontScaling: true,
    },
  },
} as const;

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ============================================
// Shadows
// ============================================

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 12,
  },
} as const;

// ============================================
// Animation Durations
// ============================================

export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// ============================================
// Z-Index Scale
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// ============================================
// Helper Functions
// ============================================

/**
 * Get theme colors based on color scheme
 */
export function getThemeColors(colorScheme: ColorScheme): ThemeColors {
  return colorSchemes[colorScheme];
}

/**
 * Get UI scaling tokens based on color scheme
 */
export function getThemeUi(colorScheme: ColorScheme): ThemeUi {
  return uiSchemes[colorScheme];
}

/**
 * Get contrasting text color for a given background
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Simple luminance-based contrast calculation
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1b1a17" : "#f5f5f5";
}

/**
 * Create a semi-transparent version of a color
 */
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Hook to get current theme colors based on system preference
 */
export function useThemeColors(): ThemeColors {
  const systemColorScheme = useColorScheme();
  const colorScheme: ColorScheme = systemColorScheme === "light" ? "light" : "dark";
  return colorSchemes[colorScheme];
}

/**
 * Hook to get current color scheme
 */
export function useColorSchemeTheme(): ColorScheme {
  const systemColorScheme = useColorScheme();
  return systemColorScheme === "light" ? "light" : "dark";
}
