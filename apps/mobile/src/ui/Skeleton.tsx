import React from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "./theme";

export type SkeletonProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
};

export function Skeleton({ width = 300, height = 16, borderRadius = 4 }: SkeletonProps): JSX.Element {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const animatedStyle: Animated.WithAnimatedValue<ViewStyle> = {
    width,
    height,
    borderRadius,
    opacity,
    backgroundColor: colors.muted,
  };

  return <Animated.View style={animatedStyle} />;
}

export function SkeletonCard(): JSX.Element {
  return (
    <View style={styles.card}>
      <Skeleton width={200} height={16} />
      <View style={styles.subtitleContainer}>
        <Skeleton width={150} height={12} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }): JSX.Element {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <SkeletonCard />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderCurve: "continuous",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subtitleContainer: {
    marginTop: spacing.xs,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
});
