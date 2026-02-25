import { AccessibilityInfo, AccessibilityRole, Platform } from "react-native";

/**
 * Accessibility role types for React Native
 */
export type A11yRole = AccessibilityRole;

/**
 * Accessibility props for components
 */
export type A11yProps = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: A11yRole;
  accessibilityState?: {
    selected?: boolean;
    disabled?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  onAccessibilityAction?: () => void;
  importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants";
  accessibilityLiveRegion?: "none" | "polite" | "assertive";
};

/**
 * Create accessibility label props
 */
export function a11yLabel(label: string): Pick<A11yProps, "accessibilityLabel"> {
  return { accessibilityLabel: label };
}

/**
 * Create accessibility props for a button
 */
export function a11yButton(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "button",
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a link
 */
export function a11yLink(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "link",
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for an image
 */
export function a11yImage(
  label: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityRole"> {
  return {
    accessibilityRole: "image",
    accessibilityLabel: label,
  };
}

/**
 * Create accessibility props for a header
 */
export function a11yHeader(
  label: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityRole"> {
  return {
    accessibilityRole: "header",
    accessibilityLabel: label,
  };
}

/**
 * Create accessibility props for a text element
 */
export function a11yText(
  label: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityRole"> {
  return {
    accessibilityRole: "text",
    accessibilityLabel: label,
  };
}

/**
 * Create accessibility props for a search field
 */
export function a11ySearch(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "search",
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a tab
 */
export function a11yTab(
  label: string,
  isSelected: boolean,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole" | "accessibilityState"> {
  return {
    accessibilityRole: "tab",
    accessibilityLabel: label,
    accessibilityState: { selected: isSelected },
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a checkbox
 */
export function a11yCheckbox(
  label: string,
  isChecked: boolean,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole" | "accessibilityState"> {
  return {
    accessibilityRole: "checkbox",
    accessibilityLabel: label,
    accessibilityState: { checked: isChecked },
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a toggle switch
 */
export function a11ySwitch(
  label: string,
  isOn: boolean,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole" | "accessibilityState"> {
  return {
    accessibilityRole: "switch",
    accessibilityLabel: label,
    accessibilityState: { checked: isOn },
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a menu item
 */
export function a11yMenuItem(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "menuitem",
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a list
 */
export function a11yList(
  label?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityRole"> {
  return {
    accessibilityRole: "list",
    ...(label ? { accessibilityLabel: label } : {}),
  };
}

/**
 * Create accessibility props for a list item
 */
export function a11yListItem(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "button" as A11yRole,
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a progress bar
 */
export function a11yProgress(
  label: string,
  value: number,
  min: number = 0,
  max: number = 100
): Pick<A11yProps, "accessibilityLabel" | "accessibilityRole" | "accessibilityValue"> {
  return {
    accessibilityRole: "progressbar",
    accessibilityLabel: label,
    accessibilityValue: {
      min,
      max,
      now: value,
      text: `${Math.round((value / (max - min)) * 100)}%`,
    },
  };
}

/**
 * Create accessibility props for an adjustable element (slider)
 */
export function a11yAdjustable(
  label: string,
  value: number,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole" | "accessibilityValue"> {
  return {
    accessibilityRole: "adjustable",
    accessibilityLabel: label,
    accessibilityValue: { text: String(value) },
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

/**
 * Create accessibility props for a disabled element
 */
export function a11yDisabled(
  baseProps: A11yProps
): A11yProps {
  return {
    ...baseProps,
    accessibilityState: {
      ...baseProps.accessibilityState,
      disabled: true,
    },
  };
}

/**
 * Create accessibility props for an expanded element
 */
export function a11yExpanded(
  baseProps: A11yProps,
  isExpanded: boolean
): A11yProps {
  return {
    ...baseProps,
    accessibilityState: {
      ...baseProps.accessibilityState,
      expanded: isExpanded,
    },
  };
}

/**
 * Create accessibility props for a live region (announces changes)
 */
export function a11yLiveRegion(
  politeness: "polite" | "assertive" = "polite"
): Pick<A11yProps, "accessibilityLiveRegion"> {
  return {
    accessibilityLiveRegion: politeness,
  };
}

/**
 * Create accessibility props to hide element from screen readers
 */
export function a11yHidden(): Pick<A11yProps, "importantForAccessibility"> {
  return {
    importantForAccessibility: "no-hide-descendants",
  };
}

/**
 * Create accessibility props to make element focusable but not visible
 * Useful for skip links
 */
export function a11yFocusable(
  label: string
): Pick<A11yProps, "accessibilityLabel" | "importantForAccessibility"> {
  return {
    accessibilityLabel: label,
    importantForAccessibility: "yes",
  };
}

/**
 * Announce a message to screen readers
 */
export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Announce a message with polite priority (iOS only)
 */
export function announceForAccessibilityPolite(message: string): void {
  if (Platform.OS === "ios") {
    AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue: true });
  } else {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Check if screen reader is enabled
 */
export function isScreenReaderEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    AccessibilityInfo.isScreenReaderEnabled().then(resolve);
  });
}

/**
 * Check if reduce motion is enabled
 */
export function isReduceMotionEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    AccessibilityInfo.isReduceMotionEnabled().then(resolve);
  });
}

/**
 * Check if bold text is enabled (iOS only)
 */
export function isBoldTextEnabled(): Promise<boolean> {
  if (Platform.OS === "ios") {
    return new Promise((resolve) => {
      AccessibilityInfo.isBoldTextEnabled().then(resolve);
    });
  }
  return Promise.resolve(false);
}

/**
 * Check if larger text is enabled
 */
export function isGrayscaleEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    AccessibilityInfo.isGrayscaleEnabled().then(resolve);
  });
}

/**
 * Focus management helpers
 */

/**
 * Set accessibility focus to an element
 * Note: Requires the element ref to have a native tag
 */
export function setAccessibilityFocus(ref: { current: { _nativeTag?: number } | null }): void {
  if (ref.current?._nativeTag) {
    AccessibilityInfo.setAccessibilityFocus(ref.current._nativeTag);
  }
}

/**
 * Create accessibility props for a focusable element
 */
export function a11yFocusableElement(
  label: string,
  hint?: string
): A11yProps {
  return {
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
    importantForAccessibility: "yes",
  };
}

/**
 * Combine multiple accessibility props
 */
export function mergeA11yProps(...props: A11yProps[]): A11yProps {
  return props.reduce((merged, current) => ({
    ...merged,
    ...current,
    accessibilityState: {
      ...merged.accessibilityState,
      ...current.accessibilityState,
    },
    accessibilityValue: {
      ...merged.accessibilityValue,
      ...current.accessibilityValue,
    },
  }), {});
}

/**
 * Accessibility action helpers for custom actions
 */
export function a11yActions(
  actions: Array<{ name: string; label: string }>
): Pick<A11yProps, "accessibilityActions"> {
  return {
    accessibilityActions: actions,
  };
}

/**
 * Common accessibility hints
 */
export const A11yHints = {
  tap: "Double tap to activate",
  select: "Double tap to select",
  edit: "Double tap to edit",
  navigate: "Double tap to navigate",
  dismiss: "Double tap to dismiss",
  expand: "Double tap to expand",
  collapse: "Double tap to collapse",
  toggle: "Double tap to toggle",
  delete: "Double tap to delete",
  openMenu: "Double tap to open menu",
  closeMenu: "Double tap to close menu",
  showMore: "Double tap to show more options",
  playPause: "Double tap to play or pause",
  increment: "Swipe up or down to adjust",
  adjust: "Swipe up or down to adjust the value",
} as const;

/**
 * Accessibility role constants
 */
export const A11yRoles = {
  none: "none" as A11yRole,
  button: "button" as A11yRole,
  link: "link" as A11yRole,
  search: "search" as A11yRole,
  image: "image" as A11yRole,
  keyboardKey: "keyboardkey" as A11yRole,
  text: "text" as A11yRole,
  adjustable: "adjustable" as A11yRole,
  imagebutton: "imagebutton" as A11yRole,
  header: "header" as A11yRole,
  summary: "summary" as A11yRole,
  alert: "alert" as A11yRole,
  checkbox: "checkbox" as A11yRole,
  combobox: "combobox" as A11yRole,
  menu: "menu" as A11yRole,
  menubar: "menubar" as A11yRole,
  menuitem: "menuitem" as A11yRole,
  progressbar: "progressbar" as A11yRole,
  radio: "radio" as A11yRole,
  radiogroup: "radiogroup" as A11yRole,
  scrollbar: "scrollbar" as A11yRole,
  spinbutton: "spinbutton" as A11yRole,
  switch: "switch" as A11yRole,
  tab: "tab" as A11yRole,
  tablist: "tablist" as A11yRole,
  tabpanel: "tabpanel" as A11yRole,
  toolbar: "toolbar" as A11yRole,
  list: "list" as A11yRole,
  listitem: "listitem" as A11yRole,
} as const;
