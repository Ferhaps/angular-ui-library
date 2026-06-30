# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular workspace containing a single publishable library project, `ui-lib`, distributed to npm as **`@ferhaps/easy-ui-lib`**. It provides reusable Angular components, directives, pipes, and services built on top of Angular Material / CDK, shared across multiple Angular apps.

The library version tracks the Angular major version (currently 21.x). The root `package.json` (`"name": "ui-library"`, `"version": "0.0.0"`) is just the workspace shell — the real package manifest is `projects/ui-lib/package.json`.

## Commands

```bash
ng build                 # Build the library with ng-packagr -> dist/ui-lib (production by default)
ng build --watch --configuration development   # Rebuild on change (alias: npm run watch)
ng test                  # Run unit tests via Karma + Jasmine in Chrome
ng serve                 # Dev server (alias: npm start)
```

There is one Angular project (`ui-lib`), so commands don't need a project name. Build output goes to `dist/ui-lib` (set in `projects/ui-lib/ng-package.json`).

### Tests

Karma/Jasmine is configured, but Angular schematics are set with `skipTests: true` (see `angular.json`), so no `.spec.ts` files currently exist. New tests are opt-in. To run a single test/suite, mark it with Jasmine's `fit`/`fdescribe` — Karma has no built-in name filter via the CLI.

## Architecture

- **Library project lives under `projects/ui-lib/`.** `angular.json` defines `newProjectRoot: "projects"` and a single `ui-lib` library project built with `@angular/build:ng-packagr`.
- **`projects/ui-lib/src/public-api.ts` is the entire public surface.** ng-packagr uses it as the entry file. Anything consumers should import (components, directives, pipes, services, types) MUST be re-exported here, or it won't ship. When adding a new exported entity, update this file.
- **Angular Material / CDK are peer dependencies** (`@angular/cdk`, `@angular/common`, `@angular/core`, `@angular/material`). Components import Material modules directly; consuming apps must provide these.
- **Component selector prefix is `lib`** (configured in `angular.json`).

Key building blocks (under `projects/ui-lib/src/lib/`):

- **Error handling pipeline** — `ErrorService` (`services/error.service.ts`) is a `providedIn: 'root'` RxJS `Subject` that broadcasts `HttpErrorResponse`s; `ErrorHandlerComponent` subscribes and opens `ErrorPopupComponent` in a `MatDialog`. `ErrorDisplayComponent` and the `SnakeCaseParserPipe` render human-readable messages. Drop `<lib-error-handler>` once near the app root.
- **Global loader** — `LoaderService` + `GlobalLoaderComponent` provide an app-wide loading overlay.
- **`TableComponent<T>`** (`components/table/`) — a generic, config-driven table. Behavior is declared via a `Config<T>` object (columns via `dataProps`, sorting, drag-drop reordering, single/multiple row selection, row options, `classRules`) and it emits a single typed `TableEvent<T>` `output` for all interactions. Pairs with `TableSortHeaderComponent`.
- **Form helpers** — validator directives (`directives/`: password, phone, fields-match) hook into `NG_VALIDATORS`; `SearchBarComponent` is a debounced search input implemented as a `ControlValueAccessor` (`NG_VALUE_ACCESSOR`).
- **`utils/utils.ts`** — shared HTTP constants (`HTTP_STATUS_CODES`, and `*_HTTP_OPTIONS` request option objects; note the `X-Skip-Error` and `X-Global-Loader` header conventions that the error/loader systems key off). `utils/types.ts` holds shared types like `SystemError`.

## Coding conventions

From the project's established style (formerly in `.github/copilot-instructions.md`). Match the surrounding code.

**TypeScript:** strict mode; prefer type inference when obvious; avoid `any` — use `unknown` when uncertain.

**Angular (v20+ idioms):**
- Standalone components are the default — do NOT set `standalone: true` in decorators.
- Use signals for state: `input()` / `input.required()` and `output()` functions (not `@Input`/`@Output` decorators), and `computed()` for derived state. Mutate signals with `set`/`update`, never `mutate`.
- Always set `changeDetection: ChangeDetectionStrategy.OnPush`.
- Use `inject()` instead of constructor injection; services are `providedIn: 'root'`.
- Put host bindings in the `host` object of the decorator — do NOT use `@HostBinding`/`@HostListener`.
- Templates: native control flow (`@if`/`@for`/`@switch`), `class`/`style` bindings (not `ngClass`/`ngStyle`), reactive forms over template-driven, `async` pipe for observables.
- Prefer inline templates/styles for small components; when external, use paths relative to the component's `.ts` file.
- `NgOptimizedImage` for static images (not for inline base64).

**Accessibility:** must pass AXE checks and meet WCAG AA (focus management, color contrast, ARIA).

**Formatting** (`.editorconfig`): tabs for indentation, single quotes in TypeScript, final newline.

## Publishing

The library is published manually to npm. See the `publish-library` skill for the version-bump → build → `npm publish` workflow.
