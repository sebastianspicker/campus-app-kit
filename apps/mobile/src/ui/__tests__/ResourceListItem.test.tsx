import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResourceListItem } from "../ResourceListItem";

vi.mock("expo-router", () => ({
  Link: ({ children, onPress }: { children: React.ReactNode; onPress?: (event: { preventDefault: () => void }) => void }) => (
    <a data-testid="resource-link" onClick={(event) => onPress?.(event)}>{children}</a>
  )
}));
vi.mock("@expo/vector-icons/MaterialIcons", () => ({ default: () => <span>icon</span> }));
vi.mock("../ThemeContext", () => ({
  useTheme: () => ({ colors: { accent: "#000", border: "#ddd", infoSurface: "#eee", muted: "#666", surface: "#fff", text: "#111" } })
}));
vi.mock("react-native", () => ({
  Pressable: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyleSheet: { create: (styles: object) => styles, hairlineWidth: 1 }
}));

afterEach(() => vi.useRealTimers());

describe("ResourceListItem navigation handoff", () => {
  it("stores an accepted item once while suppressing a duplicate press", () => {
    vi.useFakeTimers();
    const item = { id: "event-1" };
    const onNavigate = vi.fn();
    const tree = TestRenderer.create(
      <ResourceListItem
        item={item}
        href={(entry) => ({ pathname: "/events/[id]", params: { id: entry.id } })}
        renderCard={() => ({ title: "Event" })}
        accessibilityLabel={() => "Event"}
        onNavigate={onNavigate}
      />
    );
    const link = tree.root.findByProps({ "data-testid": "resource-link" });

    const firstPress = { preventDefault: vi.fn() };
    act(() => link.props.onClick(firstPress));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenLastCalledWith(item);
    expect(firstPress.preventDefault).not.toHaveBeenCalled();

    const duplicatePress = { preventDefault: vi.fn() };
    act(() => link.props.onClick(duplicatePress));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(duplicatePress.preventDefault).toHaveBeenCalledOnce();

    act(() => { vi.advanceTimersByTime(500); });
    act(() => link.props.onClick({ preventDefault: vi.fn() }));
    expect(onNavigate).toHaveBeenCalledTimes(2);
  });
});
