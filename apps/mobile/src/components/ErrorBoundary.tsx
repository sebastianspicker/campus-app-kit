import React, { Component, type ReactNode } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { spacing, typography } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

function ErrorFallback({
    error,
    onReset,
}: {
    error: Error | null;
    onReset: () => void;
}): JSX.Element {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                Oops! Something went wrong.
            </Text>
            <Text style={[styles.message, { color: theme.colors.muted }]}>
                {error?.message || "An unexpected error occurred."}
            </Text>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: theme.colors.accent },
                    pressed && styles.buttonPressed,
                ]}
                onPress={onReset}
            >
                <Text style={[styles.buttonText, { color: theme.colors.accentText }]}>
                    Try Again
                </Text>
            </Pressable>
        </View>
    );
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // eslint-disable-next-line no-console
        console.error("react_error_boundary_caught", {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
    },
    title: {
        ...typography.subheading,
        fontWeight: "bold",
        marginBottom: spacing.sm,
    },
    message: {
        ...typography.body,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    button: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonText: {
        ...typography.body,
        fontWeight: "600",
    },
});
