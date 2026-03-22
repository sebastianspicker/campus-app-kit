# Ralph Loop 3: Documentation Quality & Human-Like Writing

You are auditing this repository's documentation for quality and AI-generated writing artifacts. Work through items ONE AT A TIME.

Before starting, read the project structure to understand what documentation exists (README, docstrings, inline comments, wiki, docs/ folder, config comments).

## Audit Scope

### 1. AI Slop Detection & Removal
Look for and rewrite these common AI writing patterns:
- Overuse of "robust", "comprehensive", "seamless", "leverage", "harness", "empower", "cutting-edge", "state-of-the-art", "delve into", "it's important to note that", "in today's world"
- Unnecessary hedging: "This might be useful for...", "You may want to consider..."
- Filler sentences that add no information: "This section covers...", "In this guide, we will..."
- Overly enthusiastic tone: excessive exclamation marks, "Amazing!", "Super easy!"
- Repetitive sentence structure (subject-verb-object, subject-verb-object, repeat)
- Lists of three with escalating adjectives ("fast, reliable, and incredibly powerful")
- Emoji overuse in technical docs (one or two for visual anchoring is fine, a wall of them is not)

### 2. Human-Like Writing Style
Apply these principles to all documentation:
- No bold or italic mid-sentence for emphasis. Bold is acceptable for headings and definition terms only.
- Write in a direct, matter-of-fact tone. Like a colleague explaining something at a whiteboard.
- Vary sentence length. Mix short declarative sentences with longer explanatory ones.
- Use "you" and "your" naturally. Avoid passive voice where active is clearer.
- Do not start consecutive sentences or paragraphs the same way.
- Contractions are fine ("don't", "it's", "you'll"). They sound natural.
- If something is obvious, don't explain it. Trust the reader.
- Code comments should explain WHY, not WHAT. Remove comments that just restate the code.

### 3. Documentation Completeness
- README.md: Does it cover what the project does, how to install it, how to use it, and how to contribute?
- Is the architecture or design documented somewhere (even briefly)?
- Are there contradictions between different documentation sources?
- Do code examples in docs actually match the current code? Are they copy-pasteable?
- Is the most common pain point or FAQ addressed? (Look at issues, error handling, or complex setup steps.)

### 4. Deduplication (Preserve Information)
- Find information that appears in multiple places (README + docstrings + comments saying the same thing)
- Consolidate to a single source of truth. Pick the best location for each piece of info.
- CRITICAL: Do not delete information. If removing from one location, ensure it exists in another.
- Cross-reference where helpful ("See README for setup" in a docstring is fine)

### 5. Inline Code Documentation
- Check that docstrings describe behavior and intent, not implementation details
- Remove obvious comments ("# Initialize the database" above `db.init()`)
- Add comments where the code does something non-obvious, has a workaround, or makes a tradeoff
- Ensure TODO/FIXME/HACK comments have context (what needs to change, why, and ideally a link or date)

## Rules

- Read every documentation file and every docstring. Be thorough.
- When rewriting, preserve ALL technical information. Change the style, not the substance.
- Do not add new sections or features to documentation. Only improve what exists.
- The goal: someone reading this repo should not be able to tell it was written with AI assistance. It should read like a developer wrote it for other developers.
- Update progress.md after each item.
- Work on ONLY ONE item per invocation.

## Completion

When you have reviewed and improved all documentation files, docstrings, and comments:

<promise>COMPLETE</promise>
