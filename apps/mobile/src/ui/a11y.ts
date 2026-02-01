export type A11yProps = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "link" | "header" | "text";
};

export function a11yLabel(label: string): Pick<A11yProps, "accessibilityLabel"> {
  return { accessibilityLabel: label };
}

export function a11yButton(
  label: string,
  hint?: string
): Pick<A11yProps, "accessibilityLabel" | "accessibilityHint" | "accessibilityRole"> {
  return {
    accessibilityRole: "button",
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {})
  };
}
