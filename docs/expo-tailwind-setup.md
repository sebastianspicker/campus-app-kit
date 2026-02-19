# Tailwind CSS in the Mobile App

The mobile app uses **Tailwind CSS v4** with **NativeWind v5** and **react-native-css** for optional utility-based styling alongside the existing theme and StyleSheet components.

## Setup

- **Tailwind v4** + **@tailwindcss/postcss** — theme and utilities
- **NativeWind v5** — Metro transformer for `className` in React Native
- **react-native-css** — CSS runtime; components must be wrapped with `useCssElement` for `className` support
- **global.css** — imported in the root layout; includes Tailwind layers and platform-specific font variables

No Babel config is required for Tailwind with this setup.

## Using Tailwind

Import the CSS-wrapped components from `@/tw` and use `className`:

```tsx
import { View, Text, ScrollView } from "@/tw";

export default function MyScreen() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4 gap-4">
      <View className="p-4 gap-4">
        <Text className="text-xl font-bold text-gray-900">Hello Tailwind!</Text>
      </View>
    </ScrollView>
  );
}
```

Available from `@/tw`:

- **index:** `View`, `Text`, `ScrollView`, `Pressable`, `TextInput`, `Link`, `AnimatedScrollView`, `TouchableHighlight`, `useCSSVariable`
- **image:** `Image` (expo-image with `className`; use `contentFit`/`contentPosition` for object-fit/position)
- **animated:** `Animated` (reanimated with `Animated.View` etc.)

## Existing UI

Screens and components in `src/ui/` (e.g. `Screen`, `Card`, `Section`, `ResourceListSection`) still use the **theme** and **StyleSheet** from `@/ui/theme`. You can:

- Keep using them as-is.
- Gradually add new screens or components with `@/tw` and `className`.
- Mix: use `@/tw` for layout and `@/ui` for shared pieces like `Card` and `Section`.

## Config Files

- **metro.config.js** — `withNativewind(config, { inlineVariables: false, globalClassNamePolyfill: false })`
- **postcss.config.mjs** — `@tailwindcss/postcss` plugin
- **src/global.css** — `@import` Tailwind theme, preflight, utilities; `@media ios` / `@media android` for font variables

## Custom Theme

Add custom theme variables in `src/global.css` using `@layer theme` and `@theme`:

```css
@layer theme {
  @theme {
    --font-rounded: "SF Pro Rounded", sans-serif;
  }
}
```

## Troubleshooting

- **Styles not applying:** Ensure `@/global.css` is imported in the root layout and you use components from `@/tw` (not raw React Native components) when using `className`.
- **Platform fonts:** `global.css` sets `--font-sans`, `--font-serif`, etc. per platform; use them in Tailwind or via `useCSSVariable("--font-sans")`.

See the **expo-tailwind-setup** skill for the full reference.
