import React from "react";
import { Text } from "react-native";
import { listScreenStyles } from "./listScreenStyles";

export type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps): JSX.Element {
  return (
    <Text selectable style={listScreenStyles.muted} accessibilityRole="text">
      {message}
    </Text>
  );
}
