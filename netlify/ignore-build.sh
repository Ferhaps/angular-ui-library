#!/usr/bin/env bash
# Netlify "ignore" command.
#
# Deploy the showcase ONLY when the "version" field in the LIBRARY package.json
# (projects/ui-lib/package.json — the npm release version) changes. Bumps to
# the root/workspace package.json do NOT trigger a Netlify deploy.
#
# Netlify convention for the ignore command:
#   exit 0  -> SKIP the build (cancel)
#   exit 1  -> RUN the build and deploy
#
# Netlify provides:
#   $COMMIT_REF         commit currently being built
#   $CACHED_COMMIT_REF  commit of the last SUCCESSFUL build/deploy

set -e

FILE="projects/ui-lib/package.json"

# Manual override: if the tip commit message contains a skip token, cancel the
# build even when the library version was bumped. Handy for version bumps that
# don't need a redeploy (e.g. a publish-only release, docs-only churn).
#   [skip deploy] / [skip netlify] / [netlify skip]  -> SKIP
commit_msg="$(git log -1 --pretty=%B "$COMMIT_REF" 2>/dev/null || true)"
if printf '%s' "$commit_msg" | grep -qiE '\[(skip deploy|skip netlify|netlify skip)\]'; then
  echo "Skip token found in commit message — skipping build."
  exit 0
fi

# First build ever (or Netlify has no cached commit yet) -> build.
if [ -z "$CACHED_COMMIT_REF" ]; then
  echo "No cached commit reference — building."
  exit 1
fi

get_version() {
  # Print the "version" line from package.json at a given commit, whitespace-stripped.
  git show "$1:$FILE" 2>/dev/null | grep '"version"' | head -1 | tr -d '[:space:]'
}

prev="$(get_version "$CACHED_COMMIT_REF")"
curr="$(get_version "$COMMIT_REF")"

# If we couldn't read either version, fail safe by building.
if [ -z "$curr" ]; then
  echo "Could not read current version — building to be safe."
  exit 1
fi

if [ "$prev" = "$curr" ]; then
  echo "Library package.json version unchanged ($curr) — skipping build."
  exit 0
fi

echo "Library package.json version changed ($prev -> $curr) — building."
exit 1
