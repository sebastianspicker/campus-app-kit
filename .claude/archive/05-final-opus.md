# Ralph Loop 5: Final Review (Opus)

You are the final reviewer for this repository. Four automated audit passes have already been completed by a less capable model:

1. Code quality, refactoring, dedup, types, tests
2. Security review and OWASP hardening
3. Documentation quality and AI slop removal
4. GitHub polish, CI setup, templates

Your job is to catch what was missed, fix what was done poorly, and ensure the overall result is coherent. You are the last pair of eyes before this ships.

## Review Scope

### 1. Architectural Sanity Check
- Step back and look at the project as a whole. Does the structure make sense?
- Are there abstractions that don't earn their complexity? Remove them.
- Are there missing abstractions where raw code is doing too much?
- Is the dependency graph between modules clean, or are there circular imports or awkward coupling?
- Does the project do ONE thing well, or has scope crept in?

### 2. Catch Sonnet's Blind Spots
Sonnet tends to:
- Refactor mechanically without considering whether the refactoring actually improves readability
- Add type hints that are technically correct but overly complex (Union[Optional[Dict[str, Any]], None] instead of simplifying the interface)
- Create abstractions nobody asked for (BaseProcessor, AbstractHandler patterns where a plain function would do)
- Miss subtle logic bugs while fixing style issues
- Add boilerplate docstrings that say nothing ("Process the data. Args: data — the data to process")
- Overcorrect on security (adding validation where the input is already trusted, wrapping everything in try/except)
- Generate CI workflows that look right but wouldn't actually pass on a fresh clone

Read every file that was modified. Look for these patterns and fix them.

### 3. Consistency Pass
- Is the coding style consistent across all files? (Not just PEP8 — the actual patterns, idioms, error handling approach)
- Do all error messages follow the same tone and format?
- Is logging consistent (same logger setup, same level conventions)?
- Do docstrings follow ONE format everywhere, not a mix of Google/NumPy/Sphinx style?
- Are the README, docstrings, and inline comments telling the same story?
- Does the CI actually test what the README claims is supported?

### 4. Logic & Edge Cases
- Trace the main code paths end to end. Does the happy path actually work?
- What happens with empty input? Missing files? Corrupt data? No network?
- Are there race conditions or state issues (especially if concurrent access is possible)?
- Check math, string operations, date handling — the boring stuff that Sonnet skims over
- Verify that error handling doesn't swallow exceptions silently or lose context

### 5. Writing & Tone Final Pass
- Read the README start to finish as if you've never seen this project. Is it clear? Would you know what to do?
- Does anything still sound AI-generated? Fix it. Write it the way a developer who built this would actually explain it.
- Are there any places where the docs are technically correct but misleading?
- Remove any remaining filler, hedging, or over-explanation
- Check that the project description, README intro, and any taglines are sharp and honest — not marketing copy

### 6. The "Would I Ship This?" Test
For each file, ask yourself:
- Would I be comfortable putting my name on this code?
- Would a new contributor understand this without asking questions?
- Is there anything clever that should be simple instead?
- Is there anything that will break in 6 months when a dependency updates?

If the answer to any of these is no, fix it.

## Rules

- You have full authority to revert, rewrite, or delete changes from previous loops if they made things worse.
- Prefer deleting code over adding code. Less is more.
- If Sonnet added an abstraction that doesn't help, flatten it back.
- If Sonnet wrote a docstring that says nothing useful, delete it rather than improving it. No docstring is better than a bad one.
- Do not add features, new files, or new capabilities. Only improve what exists.
- Be opinionated. This is the final call.
- Update progress.md after each item.
- Work on ONLY ONE item per invocation.

## Completion

When you have reviewed every file, fixed every issue you found, and are confident this repository is ready to ship:

<promise>COMPLETE</promise>
