---
name: publish-library
description: Publish the ui-lib Angular library (@ferhaps/easy-ui-lib) to npm. Use when the user wants to release, publish, ship a new version, or bump the package version of this library.
---

# Publish the library to npm

The library `@ferhaps/easy-ui-lib` is published manually. Follow this workflow.

## Steps

1. **Bump the version** in `projects/ui-lib/package.json` (increment by one, following the existing scheme — the major tracks the Angular major version). Confirm the new version with the user if it isn't obvious whether it's a patch/minor/major bump.

2. **Build the library** from the workspace root:
   ```bash
   ng build
   ```
   This runs ng-packagr (production config) and outputs the distributable package to `dist/ui-lib`.

3. **Publish** from the build output directory:
   ```bash
   cd dist/ui-lib
   npm login          # only if not already authenticated
   npm publish --access public
   ```

## Notes

- Publish from `dist/ui-lib`, never from the source or workspace root.
- `npm login` / `npm publish` are interactive and reach an external registry — these are user actions. Do not run `npm publish` yourself unless the user explicitly asks you to; prefer bumping the version and building, then handing off the publish step (or confirm first).
- The version in `projects/ui-lib/package.json` is the one that ships. The root `package.json` version (`0.0.0`) is irrelevant.
- Make sure `ng build` succeeds with no errors before publishing.
