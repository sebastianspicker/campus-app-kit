# Placeholder: React Performance (Vercel Best Practices)

**Why this is missing**
- Screens render lists via `ScrollView` + inline mapping (no virtualization, no memoized list items).
- Several screens/hooks create inline objects/functions that can trigger unnecessary re-renders.

**TODO**
- Use `FlatList`/`SectionList` for any non-trivial lists (virtualization).
- Memoize list items (`React.memo`) and keep props stable.
- Use `useCallback`/`useMemo` for handlers and derived data where it helps.
- Parallelize independent fetches (`Promise.all`) and consider `startTransition` for non-urgent updates.
- Prefer direct imports over barrels; lazy-load heavy modules/components when appropriate.
