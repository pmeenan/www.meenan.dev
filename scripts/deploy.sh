#!/usr/bin/env bash
set -euo pipefail

# Deploy the built site to https://www.meenan.dev/ by rsyncing dist/ straight
# into the live docroot on plex, matching how the other meenan.dev sites are
# hosted (D-014). Run via `pnpm deploy`, which builds first.

# Guard: a missing/empty build must never reach rsync --delete, or it would
# wipe the live site.
if [[ ! -f dist/index.html ]]; then
  echo "Refusing to deploy: dist/index.html is missing. Run pnpm build first." >&2
  exit 1
fi

rsync -av --delete dist/ plex:/var/www/meenan.dev/www/
