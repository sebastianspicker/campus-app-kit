# Ralph Loop 4: GitHub Polish & CI

You are auditing this repository for GitHub best practices and CI setup. Work through items ONE AT A TIME.

## Audit Scope

### 1. GitHub Repository Polish
- Check that .gitignore is comprehensive (Python bytecode, venv, .env, data files, OS files, IDE files)
- Verify LICENSE file exists and is appropriate (check if one is missing and suggest MIT or Apache 2.0)
- Check for a CONTRIBUTING.md if the project is meant to accept contributions
- Verify CHANGELOG.md or a release notes convention exists
- Check that .github/ directory structure is clean
- Ensure no sensitive data, large binaries, or data files are tracked in git
- Verify branch naming convention and default branch is `main`

### 2. GitHub Issue & PR Templates
- Create .github/ISSUE_TEMPLATE/bug_report.md with useful fields
- Create .github/ISSUE_TEMPLATE/feature_request.md
- Create .github/pull_request_template.md
- Keep templates minimal and practical, not bureaucratic

### 3. CI Setup (GitHub Actions — NO CD)
- Create .github/workflows/ci.yml that runs on push and PR to main
- CI should include:
  - Python version matrix (3.10, 3.11, 3.12 minimum)
  - Install dependencies from pyproject.toml or requirements.txt
  - Run linting: ruff check (not flake8, not pylint — ruff is the 2026 standard)
  - Run type checking: mypy with reasonable strictness
  - Run tests: pytest with coverage report
  - Run security: pip-audit for dependency vulnerabilities
- Do NOT set up any deployment, publishing, or release automation (no CD)
- Do NOT set up Docker builds or image publishing
- Keep the workflow simple and fast (<5 min target)

### 4. GitHub Security Hardening
- Add Dependabot config (.github/dependabot.yml) for Python pip ecosystem
- Ensure GitHub Actions use pinned versions (actions/checkout@v4, not @main)
- Check that no secrets are hardcoded anywhere (grep for API keys, tokens, passwords)
- Add a SECURITY.md with responsible disclosure instructions
- Verify .env.example exists but .env is gitignored
- Check that CI does not expose secrets in logs

### 5. Developer Experience
- Verify the repo can be cloned and set up from scratch following only the README
- Check that there is a clear "quickstart" path (clone → install → run in <5 commands)
- Ensure Makefile or similar task runner exists for common operations (lint, test, ingest, serve)
- Check that pre-commit hooks are configured or at least documented (ruff, mypy)

## Rules

- Read actual files before making any judgment. Never guess.
- Create files directly when the addition is clear (CI workflow, templates, configs).
- For CI workflows, keep them minimal and fast. Over-engineered CI is worse than no CI.
- Do not set up any form of continuous deployment or release automation.
- Update progress.md after each item.
- Work on ONLY ONE item per invocation.

## Completion

When you have reviewed and set up all GitHub infrastructure:

<promise>COMPLETE</promise>
