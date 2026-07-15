import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { spacing } from "./theme";
import {
  ErrorStateActions,
  ErrorStateIcon,
  ErrorStateMessage,
  ErrorStateTitle,
} from "./ErrorStateParts";
import type { UiError } from "../api/uiError";
import { useLocale } from "../i18n/LocaleContext";
import {
  getErrorMessage,
  getErrorTitleKey,
  getErrorType,
  type ErrorType,
} from "./errorStatePresentation";

export { getErrorType } from "./errorStatePresentation";
export type { ErrorType } from "./errorStatePresentation";

export type ErrorStateProps = {
  message?: string;
  error?: UiError;
  errorType?: ErrorType;
  onRetry?: () => void;
  onGoBack?: () => void;
  showGoBack?: boolean;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.lg,
    flex: 1,
    justifyContent: "center",
  },
});

export function ErrorState({
  message,
  error,
  errorType,
  onRetry, 
  onGoBack,
  showGoBack = false 
}: ErrorStateProps): JSX.Element {
  const navigation = useNavigation();
  const { t } = useLocale();
  const resolvedErrorType = getErrorType(error, errorType);
  const titleKey = getErrorTitleKey(resolvedErrorType);
  const resolvedMessage = getErrorMessage(error, message, t);
  const showGoBackAction = showGoBack || navigation.canGoBack();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ErrorStateIcon errorType={resolvedErrorType} />
      <ErrorStateTitle title={t(titleKey)} />
      <ErrorStateMessage message={resolvedMessage} />
      <ErrorStateActions
        onRetry={onRetry}
        showGoBackAction={showGoBackAction}
        onGoBack={handleGoBack}
      />
    </View>
  );
}

export { GenericError, NetworkError, NotFoundError } from "./ErrorStateWrappers";
