# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-25

### Added

#### Features
- ICS RRULE expansion for recurring events in BFF (`rrule` package integration)
- Query parameter filtering for events endpoint (`search`, `from`, `to`, `limit`, `offset`)
- Zod validation schemas for all API inputs and outputs
- Skeleton loading components for mobile app (`Skeleton`, `SkeletonCard`, `SkeletonList`)
- Error state component with retry functionality (`ErrorState`)
- Design tokens in theme system (spacing, typography, shadows)

#### Infrastructure
- Comprehensive Makefile with development targets
- VS Code settings for consistent development experience
- Husky pre-commit hooks with lint-staged
- Release readiness plan documentation

#### Testing
- Expanded BFF integration tests (24 tests covering all endpoints)
- Test suites for: error handling, health, events, rooms, today, rate limiting, security headers, CORS

### Changed

- Improved `ResourceListSection` component with loading and error states
- Updated ESLint configuration
- Enhanced documentation structure

### Fixed

- Import path issues in UI components
- Error response structure consistency across all endpoints

### Removed

- Obsolete documentation files (`BUGS_AND_FIXES_ARCHIVE.md`, `OPEN_IMPROVEMENTS_AND_PLAN.md`)
- Archived `BUGS_AND_FIXES.md`

---

## [0.1.0] - 2024-12-01

### Added

- Initial release
- Mobile app with Expo SDK 51 and Expo Router
- BFF (Backend-for-Frontend) with public connectors
- Institution packs system
- Shared types and Zod schemas
- CI/CD pipeline with GitHub Actions
- Security workflows (CodeQL, Gitleaks, Dependency Review)
- Comprehensive documentation (architecture, runbook, connectors, FAQ)
- Docker configuration for BFF
- EAS build configuration for mobile

### Features

#### Mobile App
- Today screen with events and rooms
- Events listing and detail screens
- Rooms listing and detail screens
- Schedule screen
- Profile screen
- Error boundary with retry
- Data caching with persistence

#### BFF
- Health check endpoint
- Events endpoint with public connector
- Rooms endpoint with public connector
- Schedule endpoint with ICS parsing
- Today endpoint (combined events + rooms)
- Rate limiting
- HTTP caching
- CORS support
- Security headers

#### Shared Packages
- `@campus/shared` - Domain types and Zod schemas
- `@campus/institutions` - Institution configuration packs

[1.0.0]: https://github.com/example/campus-app-kit/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/example/campus-app-kit/releases/tag/v0.1.0
