# Ralph Loop 1: Code Quality, Refactoring & Dedup

You are auditing this repository for code quality. Work through items ONE AT A TIME.

## Audit Scope

### 1. Code Duplication
- Find duplicated logic, copy-pasted blocks, repeated patterns that should be abstracted
- Identify functions that do nearly the same thing and could be unified
- Look for repeated error handling, config loading, or data transformation patterns

### 2. Code Refactoring
- Identify functions that are too long (>40 lines) or do too many things
- Find deeply nested conditionals that could be flattened (early returns, guard clauses)
- Look for god objects/modules that should be split
- Check for proper separation of concerns
- Identify magic numbers/strings that should be constants

### 3. Code Quality
- Check type hints completeness (all function signatures should have type hints)
- Verify docstrings on public functions and classes
- Look for bare `except:` clauses, mutable default arguments, global state
- Check for proper use of context managers (file handles, DB connections)
- Verify consistent naming conventions (snake_case for functions/variables, PascalCase for classes)
- Look for unused imports, dead code, unreachable branches

### 4. State of the Art / Best Practices 2026
- Check Python version compatibility and modern idioms (match/case, walrus operator where appropriate, f-strings everywhere)
- Verify use of `pathlib` over `os.path`
- Check if dataclasses or Pydantic models are used where appropriate instead of raw dicts
- Verify dependency versions are current (not pinned to ancient versions)
- Check for modern async patterns where I/O-bound work would benefit
- Ensure pyproject.toml is used (not just requirements.txt)

### 5. Testing & Error Handling
- Check if tests exist; if not, flag as critical finding
- Verify error handling is graceful (what happens with corrupt .olm, empty DB, missing files?)
- Check for proper logging vs print statements
- Look for edge cases: empty inputs, very large inputs, unicode issues, missing fields

## Rules

- Read actual files before making any judgment. Never guess.
- Fix issues directly in the code when the fix is clear and safe.
- For each fix, explain briefly what was wrong and why the new version is better.
- If a fix is risky or ambiguous, document it as a finding but do not change the code.
- Update progress.md after each item.
- Work on ONLY ONE item per invocation.

## Completion

When you have thoroughly audited all files in the repository and either fixed or documented every finding:

<promise>COMPLETE</promise>
