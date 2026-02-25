# Bugs & Required Fixes

This document tracks current known issues and required fixes. All previously resolved items have been archived.

**Current Status:** All known bugs resolved. ✅

---

## Active Issues

*No active bugs at this time.*

---

## Known Limitations

These are documented limitations (not bugs) that may be addressed in future releases:

### ICS RRULE Support
**Status:** ✅ Implemented (2026-02-24)

The ICS parser now supports `RRULE` (recurring events). Events are expanded up to 1 year into the future by default, with a maximum of 100 instances per recurring event. Configuration options are available via `parseIcs()` options.

**Reference:** §70 in archive

### MD5 for ETags in FIPS Environments
**Status:** Documented limitation

MD5 is used for cache ETags. While fine for caching purposes, some strictly regulated environments (FIPS) might block MD5 usage.

**Workaround:** For FIPS-compliant deployments, consider patching `sendJsonWithCache` to use SHA-256 or a non-cryptographic hash.

**Reference:** §76 in archive

---

## Quick Reference: Common Failure Causes

| Symptom | Typical Cause | Fix |
|--------|---------------|-----|
| Generic 500 on data routes | Connector or Zod throw | Check BFF logs for details |
| BFF fails at startup | Missing `INSTITUTION_ID` | Set `INSTITUTION_ID=hfmt` |
| Mobile "Missing BFF base URL" | Wrong env variable | Set `EXPO_PUBLIC_BFF_BASE_URL` |
| `pnpm verify` fails on markers | `rg` scan hits node_modules | Already fixed with exclusions |
| Empty events/rooms/schedule | Missing config or upstream failure | Check `publicSources` / `publicRooms` |
| Rate limit issues | trustProxy / forwarded headers | See runbook for proxy setup |
| Events/schedule wrong time | Timezone/date parsing | Check TZID in ICS source |

---

## Archive

All 76 resolved bugs and fixes have been archived in [`BUGS_AND_FIXES_ARCHIVE.md`](BUGS_AND_FIXES_ARCHIVE.md).

---

## Reporting New Issues

When reporting a new issue, please include:

1. **Environment:** Node version, pnpm version, OS
2. **Steps to reproduce:** Clear sequence of commands
3. **Expected behavior:** What should happen
4. **Actual behavior:** What actually happened
5. **Logs:** Relevant BFF or mobile logs

Use the issue template in `.github/ISSUE_TEMPLATE/` if available.
