import {
  useCssElement,
  useNativeVariable as useFunctionalVariable
} from "react-native-css";
import { Link as RouterLink } from "expo-router";
import React from "react";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableHighlight as RNTouchableHighlight
} from "react-native";
import Animated from "react-native-reanimated";

type LinkProps = React.ComponentProps<typeof RouterLink> & { className?: string };

export const Link = (props: LinkProps) => {
  return useCssElement(RouterLink, props, { className: "style" });
};

export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

export type ViewProps = React.ComponentProps<typeof RNView> & { className?: string };

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, { className: "style" });
};
View.displayName = "CSS(View)";

export const Text = (
  props: React.ComponentProps<typeof RNText> & { className?: string }
) => {
  return useCssElement(RNText, props, { className: "style" });
};
Text.displayName = "CSS(Text)";

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNScrollView, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle"
  });
};
ScrollView.displayName = "CSS(ScrollView)";

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string }
): React.ReactElement => {
  return useCssElement(RNPressable, props, { className: "style" }) as React.ReactElement;
};
Pressable.displayName = "CSS(Pressable)";

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string }
) => {
  return useCssElement(RNTextInput, props, { className: "style" });
};
TextInput.displayName = "CSS(TextInput)";

export const AnimatedScrollView = (
  props: React.ComponentProps<typeof Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
    contentContainerClassName?: string;
  }
): React.ReactElement => {
  return useCssElement(Animated.ScrollView, props, {
    className: "style",
    contentClassName: "contentContainerStyle",
    contentContainerClassName: "contentContainerStyle"
  }) as React.ReactElement;
};

function TouchableHighlightInner(
  props: React.ComponentProps<typeof RNTouchableHighlight>
) {
  const flat = StyleSheet.flatten(props.style) as Record<string, unknown> | undefined;
  const { underlayColor, ...style } = flat ?? {};
  return (
    <RNTouchableHighlight
      underlayColor={underlayColor as string}
      {...props}
      style={style as React.ComponentProps<typeof RNTouchableHighlight>["style"]}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight> & { className?: string }
) => {
  return useCssElement(TouchableHighlightInner, props, { className: "style" });
};
TouchableHighlight.displayName = "CSS(TouchableHighlight)";

export { Image } from "./image";
