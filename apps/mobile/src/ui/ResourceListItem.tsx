import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Card } from "./Card";
import { useTheme } from "./ThemeContext";
import { spacing } from "./theme";

export type ResourceListItemProps<T> = {
  item: T;
  href: (item: T) => { pathname: string; params: Record<string, string> };
  renderCard: (item: T) => { title: string; subtitle?: string };
  accessibilityLabel: (item: T) => string;
};

// SVG Chevron for 2026 native feel
const ChevronRight = ({ color }: { color: string }) => (
  <View style={styles.chevronContainer}>
    {/* Minimalistic Chevron Implementation */}
    <View style={[styles.chevronLine, styles.chevronTop, { backgroundColor: color }]} />
    <View style={[styles.chevronLine, styles.chevronBottom, { backgroundColor: color }]} />
  </View>
);

function ResourceListItemInner<T>({
  item,
  href,
  renderCard,
  accessibilityLabel
}: ResourceListItemProps<T>): JSX.Element {
  const card = renderCard(item);
  const linkHref = href(item);
  const label = accessibilityLabel(item);
  const theme = useTheme();

  // Reanimated press scale effect for tactile feedback
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 20,
      stiffness: 300,
      mass: 0.8
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
      mass: 0.8
    });
  };

  return (
    <Link href={linkHref} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={label}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableContainer}
      >
        <Animated.View style={[animatedStyle, styles.cardWrapper]}>
          <Card title={card.title} subtitle={card.subtitle} />
          {/* Chevron overlay to indicate it's navigatable */}
          <View style={styles.chevronOverlay}>
            <ChevronRight color={theme.colors.muted} />
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    width: "100%",
  },
  cardWrapper: {
    width: "100%",
  },
  chevronOverlay: {
    position: "absolute",
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  chevronContainer: {
    width: 8,
    height: 14,
    justifyContent: "center",
  },
  chevronLine: {
    width: 2,
    height: 8,
    borderRadius: 1,
    position: "absolute",
  },
  chevronTop: {
    top: 1,
    transform: [{ rotate: "-45deg" }],
  },
  chevronBottom: {
    bottom: 1,
    transform: [{ rotate: "45deg" }],
  },
});

export const ResourceListItem = React.memo(
  ResourceListItemInner
) as typeof ResourceListItemInner;
