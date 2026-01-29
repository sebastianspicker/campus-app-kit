# Placeholder: `gitleaks` workflow

**Why this is missing**
- `.github/workflows/gitleaks.yml` depends on a `GITLEAKS_LICENSE` secret, which can break forks/PRs.

**TODO**
- Make the workflow fork-safe (guarded execution when the secret is absent).
- Document how to provide the license token securely (GitHub Secrets).
