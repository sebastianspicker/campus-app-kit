# React performance notes (mobile)

Keep lists virtualized and props stable on list items.

Practical guidelines:

- Prefer `FlatList` for lists that can grow.
- Keep `keyExtractor` stable.
- Use `useCallback` for event handlers that are passed down to memoized children.
