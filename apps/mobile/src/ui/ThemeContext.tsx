import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeColors, ThemeUi, ColorScheme, colorSchemes, uiSchemes, darkColors, getThemeColors, getThemeUi } from "./theme";

// ============================================
// Theme Types
// ============================================

export type ThemePreference = "light" | "dark" | "accessibility" | "system";

export type Theme = {
  colors: ThemeColors;
  ui: ThemeUi;
  isDark: boolean;
  colorScheme: ColorScheme;
};

// ============================================
// Theme Context
// ============================================

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "@campus-app/theme-preference";

// ============================================
// Theme Provider
// ============================================

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
      AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved && ["light", "dark", "accessibility", "system"].includes(saved)) {
          setPreferenceState(saved as ThemePreference);
        }
      })
      .catch((error) => {
        console.warn("Failed to load theme preference:", error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Resolve the actual color scheme based on preference
  const resolvedScheme: ColorScheme = 
    preference === "system" 
      ? (systemColorScheme === "dark" ? "dark" : "light")
      : preference;

  const theme: Theme = {
    colors: colorSchemes[resolvedScheme],
    ui: uiSchemes[resolvedScheme],
    isDark: resolvedScheme !== "light",
    colorScheme: resolvedScheme,
  };

  const setPreference = async (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  };

  const toggleTheme = () => {
    // Toggle between light and dark (not system)
    const newPreference: ThemePreference = resolvedScheme === "dark" ? "light" : "dark";
    setPreference(newPreference);
  };

  // Provide default theme during initial load
  const value: ThemeContextValue = {
    theme: isLoaded ? theme : {
      colors: darkColors,
      ui: uiSchemes.dark,
      isDark: true,
      colorScheme: "dark",
    },
    preference,
    setPreference,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// Theme Hooks
// ============================================

/**
 * Hook to access the current theme
 */
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context.theme;
}

/**
 * Hook to access theme preference controls
 */
export function useThemePreference(): {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
} {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemePreference must be used within a ThemeProvider");
  }
  return {
    preference: context.preference,
    setPreference: context.setPreference,
    toggleTheme: context.toggleTheme,
  };
}

/**
 * Hook to get theme colors directly
 */
export function useThemeColors(): ThemeColors {
  const theme = useTheme();
  return theme.colors;
}

/**
 * Hook to get theme UI tokens directly
 */
export function useThemeUi(): ThemeUi {
  const theme = useTheme();
  return theme.ui;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const theme = useTheme();
  return theme.isDark;
}

/**
 * Hook to get theme data from system color scheme only
 */
export function useSystemTheme(): Theme {
  const systemColorScheme = useColorScheme();
  const colorScheme: ColorScheme = systemColorScheme === "dark" ? "dark" : "light";

  return {
    colors: getThemeColors(colorScheme),
    ui: getThemeUi(colorScheme),
    isDark: colorScheme !== "light",
    colorScheme,
  };
}
