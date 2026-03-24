# Sub-Phase D.3: Dependency Vulnerability Audit

## Context
You are working on campus-app-kit. Your task is to audit all npm dependencies for known vulnerabilities.

## Process
1. Run `pnpm audit --audit-level moderate` — capture output
2. Run `pnpm outdated` — check for critical outdated packages
3. Review the `lightningcss` override in root `package.json` — is it still needed?
4. Check if any dev dependencies have known CVEs

## Decision Framework
- **Critical/High CVE:** Update immediately if tests pass
- **Moderate CVE:** Update if the fix is non-breaking
- **Low CVE:** Log for future consideration
- **Breaking update:** Do NOT update — log the issue with reason

## Rules
- Only update dependencies if `pnpm verify` passes after the update
- If a dependency update breaks something, revert it and log why
- Document any pinned/overridden versions with reasons
- Do NOT update major versions without explicit reason

## Acceptance Criteria
- [ ] `pnpm audit` output reviewed
- [ ] No high/critical vulnerabilities remain (or documented why they can't be fixed)
- [ ] All overrides documented
- [ ] `pnpm verify` passes
