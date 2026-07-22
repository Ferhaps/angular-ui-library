#!/usr/bin/env bash
# Netlify "ignore" command.
#
# Deploy the showcase when the "version" field in the ROOT/WORKSPACE
# package.json changes. The current commit's version is compared against TWO
# baselines and a deploy runs if EITHER differs:
#   * the parent commit    ($COMMIT_REF^)        -> "this commit bumped the version"
#   * the last deploy       ($CACHED_COMMIT_REF)  -> "version moved since we shipped"
# Comparing against the parent is what makes a plain version bump ALWAYS deploy,
# independent of Netlify's cache state. The cached-ref check alone was skipping
# every build once CACHED_COMMIT_REF got stuck on a same-version commit; keeping
# it as a fallback means a follow-up commit still deploys after a failed build
# even if that commit didn't itself bump the version.
#
# Any change to the version string counts (verbatim compare, no semver parsing),
# so downgrades and pre-release tags trigger a deploy too. Bumps to the library
# manifest (projects/ui-lib/package.json) do NOT trigger a deploy on their own.
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

# Manual override: a skip token in the tip commit message cancels the build even
# when the version changed. Handy for version bumps that don't need a redeploy
# (e.g. a publish-only release, docs-only churn).
#   [skip deploy] / [skip netlify] / [netlify skip]  -> SKIP
commit_msg="$(git log -1 --pretty=%B "$COMMIT_REF" 2>/dev/null || true)"
if printf '%s' "$commit_msg" | grep -qiE '\[(skip deploy|skip netlify|netlify skip)\]'; then
  echo "Skip token found in commit message — skipping build."
  exit 0
fi

get_version() {
  # Print the value of the first top-level "version" key in $FILE at a given
  # commit (e.g. 0.1.3), or nothing if the commit/file/field can't be read.
  git show "$1:$FILE" 2>/dev/null \
    | sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' \
    | head -1
}

have_commit() {
  # 0 if the given ref exists locally, non-zero otherwise. Netlify clones
  # shallow, so a needed commit may be missing; try to fetch it before giving up.
  [ -n "$1" ] || return 1
  if git cat-file -e "${1}^{commit}" 2>/dev/null; then
    return 0
  fi
  echo "Ref $1 not in shallow clone — fetching." >&2
  git fetch --depth=100 origin "$1" 2>/dev/null || git fetch --unshallow 2>/dev/null || true
  git cat-file -e "${1}^{commit}" 2>/dev/null
}

curr="$(get_version "$COMMIT_REF")"
if [ -z "$curr" ]; then
  echo "Could not read current version from $FILE — building to be safe."
  exit 1
fi

# Resolve the parent commit. It may be missing from a shallow clone, so deepen
# the history if the first lookup comes up empty.
parent_ref="$(git rev-parse --verify --quiet "${COMMIT_REF}^" || true)"
if [ -z "$parent_ref" ]; then
  git fetch --deepen=10 2>/dev/null || git fetch --unshallow 2>/dev/null || true
  parent_ref="$(git rev-parse --verify --quiet "${COMMIT_REF}^" || true)"
fi

checked_any=0
changed=0

# Baseline 1: the parent commit — "did THIS commit bump the version".
if have_commit "$parent_ref"; then
  parent_ver="$(get_version "$parent_ref")"
  if [ -n "$parent_ver" ]; then
    checked_any=1
    if [ "$parent_ver" != "$curr" ]; then
      echo "Version changed vs parent commit ($parent_ver -> $curr)."
      changed=1
    fi
  fi
fi

# Baseline 2: the last successful deploy — catches changes since we last shipped.
if have_commit "$CACHED_COMMIT_REF"; then
  cached_ver="$(get_version "$CACHED_COMMIT_REF")"
  if [ -n "$cached_ver" ]; then
    checked_any=1
    if [ "$cached_ver" != "$curr" ]; then
      echo "Version changed vs last deploy ($cached_ver -> $curr)."
      changed=1
    fi
  fi
fi

# Couldn't read a single baseline -> fail safe by building.
if [ "$checked_any" -eq 0 ]; then
  echo "No usable baseline (no parent or cached commit) — building to be safe."
  exit 1
fi

if [ "$changed" -eq 1 ]; then
  echo "$FILE version is $curr — building."
  exit 1
fi

echo "$FILE version unchanged ($curr) — skipping build."
exit 0
