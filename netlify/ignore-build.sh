#!/usr/bin/env bash
# Netlify "ignore" command.
#
# Deploy the showcase ONLY when the "version" field in the ROOT/WORKSPACE
# package.json changes. ANY change counts — 0.0.0 -> 0.0.1 triggers a deploy
# just as 0.0.0 -> 1.0.0 does (the two version strings are compared verbatim,
# no semver parsing, so downgrades and pre-release tags count too).
# Bumps to the library manifest (projects/ui-lib/package.json) do NOT trigger
# a deploy on their own.
#
# Netlify convention for the ignore command:
#   exit 0  -> SKIP the build (cancel)
#   exit 1  -> RUN the build and deploy
#
# Netlify provides:
#   $COMMIT_REF         commit currently being built
#   $CACHED_COMMIT_REF  commit of the last SUCCESSFUL build/deploy

set -e

FILE="package.json"

COMMIT_REF="${COMMIT_REF:-HEAD}"
CACHED_COMMIT_REF="${CACHED_COMMIT_REF:-}"

# Manual override: if the tip commit message contains a skip token, cancel the
# build even when the version was bumped. Handy for version bumps that don't
# need a redeploy (e.g. a publish-only release, docs-only churn).
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

# Netlify clones shallow, so the last-deployed commit may not be in the local
# history yet. Try to pull it in; if that fails we fail safe by building below.
if ! git cat-file -e "${CACHED_COMMIT_REF}^{commit}" 2>/dev/null; then
  echo "Cached commit $CACHED_COMMIT_REF not in shallow clone — fetching."
  git fetch --depth=100 origin "$CACHED_COMMIT_REF" 2>/dev/null \
    || git fetch --unshallow 2>/dev/null \
    || true
fi

get_version() {
  # Print the value of the first top-level "version" key in package.json at a
  # given commit (e.g. 0.1.3), or nothing if the file/field can't be read.
  git show "$1:$FILE" 2>/dev/null \
    | sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' \
    | head -1
}

prev="$(get_version "$CACHED_COMMIT_REF")"
curr="$(get_version "$COMMIT_REF")"

# If we couldn't read either version, fail safe by building.
if [ -z "$curr" ]; then
  echo "Could not read current version from $FILE — building to be safe."
  exit 1
fi

if [ -z "$prev" ]; then
  echo "Could not read previous version from $FILE at $CACHED_COMMIT_REF — building to be safe."
  exit 1
fi

if [ "$prev" = "$curr" ]; then
  echo "Root package.json version unchanged ($curr) — skipping build."
  exit 0
fi

echo "Root package.json version changed ($prev -> $curr) — building."
exit 1
