import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { spacing, typography } from "./theme";
import { useTheme } from "./ThemeContext";

export type ErrorType = "network" | "notFound" | "generic";

export type ErrorStateProps = {
  message: string;
  errorType?: ErrorType;
  onRetry?: () => void;
  onGoBack?: () => void;
  showGoBack?: boolean;
};

/**
 * Get error icon and title based on error type
 */
function getErrorConfig(errorType: ErrorType): { icon: string; title: string } {
  switch (errorType) {
    case "network":
      return {
        icon: "wifi-off",
        title: "Connection Error",
      };
    case "notFound":
      return {
        icon: "search-off",
        title: "Not Found",
      };
    case "generic":
    default:
      return {
        icon: "error-outline",
        title: "Something Went Wrong",
      };
  }
}

/**
 * Improved error state component with retry and go back options
 */
export function ErrorState({ 
  message, 
  errorType = "generic",
  onRetry, 
  onGoBack,
  showGoBack = false 
}: ErrorStateProps): JSX.Element {
  const theme = useTheme();
  const ui = theme.ui;
  const navigation = useNavigation();
  const errorConfig = getErrorConfig(errorType);

  const titleSize = Math.round(typography.subheading.fontSize * ui.fontScale);
  const titleLineHeight = Math.round(typography.subheading.lineHeight * ui.fontScale);
  const bodySize = Math.round(typography.body.fontSize * ui.fontScale);
  const bodyLineHeight = Math.round(typography.body.lineHeight * ui.fontScale);
  const retryPaddingHorizontal = Math.round(spacing.lg * ui.controlScale);
  const retryPaddingVertical = Math.round(spacing.sm * ui.controlScale);
  const buttonRadius = Math.round(8 * ui.borderRadiusScale);
  const iconCircleSize = Math.round(80 * ui.controlScale);

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            {
              borderColor: theme.colors.accent,
              borderWidth: ui.emphasisBorderWidth,
              width: iconCircleSize,
              height: iconCircleSize,
              borderRadius: Math.round(iconCircleSize / 2),
            },
          ]}
        >
          <Text style={styles.iconText}>
            {errorType === "network" ? " antenn" : errorType === "notFound" ? " magnifying glass" : " warning"}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: titleSize,
            lineHeight: titleLineHeight,
          },
        ]}
      >
        {errorConfig.title}
      </Text>

      {/* Message */}
      <Text
        selectable
        style={[
          styles.message,
          {
            color: theme.colors.muted,
            fontSize: bodySize,
            lineHeight: bodyLineHeight,
          },
        ]}
      >
        {message}
      </Text>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        {onRetry && (
          <Pressable 
            onPress={onRetry} 
            style={({ pressed }) => [
              styles.retryButton,
              {
                backgroundColor: theme.colors.accent,
                paddingHorizontal: retryPaddingHorizontal,
                paddingVertical: retryPaddingVertical,
                borderRadius: buttonRadius,
              },
              pressed && styles.buttonPressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Retry"
            accessibilityHint="Attempts to load the content again"
          >
            <Text style={styles.retryIcon}> retry</Text>
            <Text
              style={[
                styles.retryText,
                {
                  color: theme.colors.accentText,
                  fontSize: bodySize,
                  lineHeight: bodyLineHeight,
                },
              ]}
            >
              Retry
            </Text>
          </Pressable>
        )}

        {(showGoBack || navigation.canGoBack()) && (
          <Pressable 
            onPress={handleGoBack} 
            style={({ pressed }) => [
              styles.goBackButton,
              {
                borderColor: theme.colors.border,
                borderWidth: ui.borderWidth,
                paddingHorizontal: retryPaddingHorizontal,
                paddingVertical: retryPaddingVertical,
                borderRadius: buttonRadius,
              },
              pressed && styles.buttonPressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the previous screen"
          >
            <Text
              style={[
                styles.goBackText,
                {
                  color: theme.colors.text,
                  fontSize: bodySize,
                  lineHeight: bodyLineHeight,
                },
              ]}
            >
              Go Back
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/**
 * Network error state component - convenience wrapper
 */
export function NetworkError({ 
  message = "Please check your internet connection and try again.",
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}): JSX.Element {
  return (
    <ErrorState 
      message={message} 
      errorType="network" 
      onRetry={onRetry} 
    />
  );
}

/**
 * Not found error state component - convenience wrapper
 */
export function NotFoundError({ 
  message = "The item you're looking for doesn't exist or has been removed.",
  showGoBack = true 
}: { 
  message?: string;
  showGoBack?: boolean;
}): JSX.Element {
  return (
    <ErrorState 
      message={message} 
      errorType="notFound" 
      showGoBack={showGoBack} 
    />
  );
}

/**
 * Generic error state component - convenience wrapper
 */
export function GenericError({ 
  message = "An unexpected error occurred. Please try again.",
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}): JSX.Element {
  return (
    <ErrorState 
      message={message} 
      errorType="generic" 
      onRetry={onRetry} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.lg,
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 36,
  },
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    ...typography.subheading,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    textAlign: "center",
    marginBottom: spacing.lg,
    maxWidth: 300,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  retryIcon: {
    fontSize: 16,
  },
  retryText: {
    ...typography.body,
    fontWeight: "600",
  },
  goBackButton: {
  },
  goBackText: {
    ...typography.body,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
