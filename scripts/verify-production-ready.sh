#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build

if [[ "${SKIP_MARKER_CHECK:-}" != "1" ]]; then
  marker_pattern='(TODO|FIXME|SKELETON|PLACEHOLDER|TBD)'
  if rg -n "$marker_pattern" -S --hidden --glob '!.git/**' --glob '!IMPLEMENTATION_BACKLOG.md' --glob '!scripts/verify-production-ready.sh' .; then
    echo
    echo "Found TODO/FIXME/SKELETON/PLACEHOLDER/TBD markers. Resolve or document as \"won't do\"."
    exit 1
  fi
fi

echo "OK: production-ready checks passed."
