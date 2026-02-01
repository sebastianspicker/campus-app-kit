# `gitleaks` workflow

Secret scanning is implemented via `.github/workflows/gitleaks.yml`.

If you have a `GITLEAKS_LICENSE`, set it as a GitHub Actions secret to enable full scanning features.
The workflow references `.gitleaks.toml` for repo-specific allowlists.
