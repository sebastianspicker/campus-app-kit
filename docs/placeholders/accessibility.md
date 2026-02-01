# Accessibility baseline (mobile UI)

This repo provides a small, consistent accessibility baseline for reusable UI.

## Baseline

- Give tappable elements a role and label (`accessibilityRole`, `accessibilityLabel`).
- Keep touch targets comfortable (aim for ~44px).
- Ensure text contrast is readable in both light and dark backgrounds.
- Prefer clear, short labels; avoid duplicating visible text unless it adds context.

## Project helpers

- `apps/mobile/src/ui/a11y.ts` contains small helpers (for example `a11yButton()`).

## How to verify

- iOS: VoiceOver + Dynamic Type (Settings → Accessibility).
- Android: TalkBack + Font size/display size.
- Manual: navigate screens without looking at the display and ensure every control is discoverable.
