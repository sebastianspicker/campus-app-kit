# Placeholder: `.gitignore` + Repo Hygiene

**Why this is missing**
- The repo must not track local IDE artifacts and should ignore common transient files.

**TODO**
- Ensure `.gitignore` covers `.vscode/`, `.idea/`, `.expo/`, `.DS_Store`, `node_modules/`, logs, build outputs.
- Keep the worktree clean (`git status` has no untracked local artifacts).
- Document what should be committed (e.g. lockfile) vs ignored.
