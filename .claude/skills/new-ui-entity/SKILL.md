---
name: new-ui-entity
description: Scaffold a new exported component, directive, pipe, or service in the ui-lib library and wire it into the public API. Use when adding a new reusable piece to the library that consumers will import.
---

# Add a new entity to ui-lib

Use this when creating a new component, directive, pipe, or service that should be exported from the library.

## Where things go

Everything lives under `projects/ui-lib/src/lib/`, grouped by kind:

- `components/` — components (larger ones get their own subfolder with external `.html`/`.scss`)
- `directives/`
- `pipes/`
- `services/`
- `utils/` — shared types (`types.ts`) and constants (`utils.ts`)

## Steps

1. **Create the file(s)** in the right folder. You can scaffold with the CLI (schematics are preconfigured for `scss`, `skipTests: true`, and the `lib` selector prefix):
   ```bash
   ng generate component components/my-thing
   ng generate directive directives/my-thing
   ng generate pipe pipes/my-thing
   ng generate service services/my-thing
   ```
   Or write the file by hand following the conventions below.

2. **Export it from `projects/ui-lib/src/public-api.ts`.** This is mandatory — anything not re-exported here will not ship to consumers. Add an `export * from './lib/...'` line.

3. **Build to verify:** `ng build`.

## Conventions to follow

These come from the existing code and the project's coding standards (see CLAUDE.md):

- **Selector prefix `lib`** for components/directives (e.g. `lib-my-thing`, `[libMyThing]`).
- **Standalone is the default** — do NOT set `standalone: true`. Declare dependencies in the `imports` array.
- **Components:** `changeDetection: ChangeDetectionStrategy.OnPush`; use `input()`/`input.required()`/`output()` and `computed()` (not decorators); prefer inline `template`/`styles` for small components, external files (paths relative to the `.ts`) for larger ones.
- **Services:** `@Injectable({ providedIn: 'root' })`; obtain dependencies with `inject()`.
- **Directives** that validate: register against `NG_VALIDATORS` with `multi: true` (see existing validator directives).
- **Generics:** make components/types generic (`<T = any>`) when they operate on caller-supplied data, like `TableComponent<T>`.
- **Formatting:** tabs, single quotes, final newline (`.editorconfig`).
- Accessibility: meet WCAG AA and pass AXE checks.
