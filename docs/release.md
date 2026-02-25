# Release Process

This document describes the release process for Campus App Kit.

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

## Prerequisites

Before creating a release, ensure:

1. All CI checks pass
2. CHANGELOG.md is updated with the new version
3. All package.json versions are updated
4. Documentation is up to date

## Release Steps

### 1. Update Version

Update all `package.json` files with the new version:

```bash
# Root package.json
# apps/bff/package.json
# apps/mobile/package.json
# packages/shared/package.json
# packages/institutions/package.json
```

### 2. Update Changelog

Add a new section to `CHANGELOG.md`:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature

### Changed
- Changed feature

### Fixed
- Bug fix

### Removed
- Removed feature
```

### 3. Commit Changes

```bash
git add .
git commit -m "chore: release v1.0.0"
```

### 4. Create Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 5. Automated Release

Pushing the tag triggers the release workflow:

1. **Validate**: Runs all CI checks
2. **Create Release**: Creates a GitHub release with changelog notes
3. **Build Docker**: Builds and pushes BFF Docker image to GHCR
4. **Notify**: Posts release summary

## Mobile App Release

Mobile releases are handled separately via EAS:

### Preview Build

```bash
cd apps/mobile
pnpm build:preview
```

### Production Build

```bash
cd apps/mobile
pnpm build:production
```

### Submit to Stores

Use EAS Submit or manual submission via app store consoles.

## Docker Images

BFF Docker images are published to GitHub Container Registry:

- `ghcr.io/[owner]/campus-app-kit/bff:latest`
- `ghcr.io/[owner]/campus-app-kit/bff:[version]`

## Rollback

If a release has critical issues:

1. Delete the GitHub release
2. Delete the git tag
3. Revert the version commit
4. Create a hotfix release

## Post-Release

1. Monitor GitHub Issues for bug reports
2. Update documentation if needed
3. Announce release on relevant channels
4. Plan next version features