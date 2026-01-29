// Placeholder: accessibility helpers for Campus App Kit UI
// TODO:
// - Standardize accessibility labels/roles for common components
// - Provide helpers for minimum touch target sizes (>= 44px)
// - Add guidance for dynamic type / font scaling

export type A11yProps = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "link" | "header" | "text";
};

export function a11yLabel(label: string): Pick<A11yProps, "accessibilityLabel"> {
  return { accessibilityLabel: label };
}

