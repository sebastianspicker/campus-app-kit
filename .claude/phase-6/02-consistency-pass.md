# Phase 6.2: Consistency Pass

You are performing a cross-cutting consistency review of the entire codebase. Work through items ONE AT A TIME.

## Context

Five phases of improvement have been applied across a TypeScript monorepo (Expo + Node.js BFF + shared packages). Different sub-phases may have introduced inconsistent patterns. Your job is to unify.

## Audit Scope

### 1. Naming Conventions
Verify consistent naming across ALL source files:
- `camelCase` for variables, functions, parameters
- `PascalCase` for types, interfaces, components, classes
- `SCREAMING_SNAKE_CASE` for constants
- File naming: `camelCase.ts` for utilities, `PascalCase.tsx` for React components
- Test files: `[module].test.ts` or `[module].test.tsx`

### 2. Import Ordering
Verify consistent import ordering:
1. Node.js builtins (`node:http`, `node:url`)
2. External packages (`zod`, `react`, `expo-router`)
3. Workspace packages (`@campus/shared`, `@campus/institutions`)
4. Relative imports (`./utils`, `../components`)
- Check: is there an ESLint rule for this? If not, is the convention followed manually?

### 3. Error Handling Patterns
- BFF: are all errors formatted through `sendError()` consistently?
- Mobile: are all API errors wrapped in `ApiErrorException` consistently?
- Are error messages tone-consistent? (technical vs user-friendly, formal vs casual)
- Are error log levels consistent? (error vs warn vs info)

### 4. TypeScript Patterns
- `type` vs `interface`: is one used consistently for object shapes?
- Optional chaining (`?.`) vs explicit null checks: consistent approach?
- Nullish coalescing (`??`) vs logical OR (`||`): correct usage everywhere?
- Generic constraints: are they applied consistently to utility functions?

### 5. Code Formatting
- Indent: 2 spaces everywhere?
- Semicolons: consistent presence or absence?
- Quotes: single or double, consistent?
- Trailing commas: consistent approach?
- Run `pnpm lint` — fix any violations

### 6. Comment Style
- `//` for inline comments, not `/* */` (unless multi-line)
- No JSDoc where function name + types are self-documenting
- Comments explain WHY, not WHAT
- No commented-out code left behind
- No orphaned TODO/FIXME markers (the verify script checks for these)

### 7. Logging Consistency
- BFF: is structured logging used consistently? Same logger setup everywhere?
- Mobile: are `console.log` statements behind `__DEV__` checks?
- Are log messages formatted the same way across all modules?

## Rules

- Read representative files from each module to assess consistency
- When you find an inconsistency, fix it across ALL occurrences (not just one file)
- Run `pnpm lint && pnpm typecheck` after changes to verify
- Update `progress.md` under `## Phase 6.2: Consistency Pass` after each item
- Work on ONLY ONE item per invocation

## Completion

When the codebase is consistent across all dimensions:

<promise>COMPLETE</promise>
