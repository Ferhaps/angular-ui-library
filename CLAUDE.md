# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular workspace containing one publishable library project, `ui-lib`, distributed to npm as **`@ferhaps/easy-ui-lib`**. It provides reusable Angular components, directives, pipes, and services built on top of Angular Material / CDK, shared across multiple Angular apps. A second project, `showcase`, is a **non-published demo application** that exercises every public feature of the library (one routed page per feature); it imports the library by its package name, mapped to the lib source via `tsconfig` `paths`, so editing the lib hot-reloads.

The library version tracks the Angular major version (currently 22.x). The root `package.json` (`"name": "ui-library"`, `"version": "0.0.0"`) is just the workspace shell — the real package manifest is `projects/ui-lib/package.json`. Only `ui-lib` is published; `showcase` never ships.

## Commands

The workspace now has two projects, so CLI commands take a project name. The npm scripts encode it for you:

```bash
npm run build            # ng build ui-lib  -> dist/ui-lib (ng-packagr, production)
npm run watch            # ng build ui-lib --watch --configuration development
npm test                 # ng test ui-lib   (Karma + Jasmine in Chrome)
npm start                # ng serve showcase (the demo app dev server)
npm run build:showcase   # ng build showcase -> dist/showcase
```

Raw `ng build` / `ng serve` (no project) will error now that there are two projects — pass `ui-lib` or `showcase`. Library build output goes to `dist/ui-lib` (set in `projects/ui-lib/ng-package.json`).

### Tests

Karma/Jasmine is configured, but Angular schematics are set with `skipTests: true` (see `angular.json`), so no `.spec.ts` files currently exist. New tests are opt-in. To run a single test/suite, mark it with Jasmine's `fit`/`fdescribe` — Karma has no built-in name filter via the CLI.

## Architecture

- **Library project lives under `projects/ui-lib/`.** `angular.json` defines `newProjectRoot: "projects"` and a single `ui-lib` library project built with `@angular/build:ng-packagr`.
- **`projects/ui-lib/src/public-api.ts` is the entire public surface.** ng-packagr uses it as the entry file. Anything consumers should import (components, directives, pipes, services, types) MUST be re-exported here, or it won't ship. When adding a new exported entity, update this file.
- **Angular Material / CDK / Forms are peer dependencies** (`@angular/cdk`, `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/material`). Components import Material modules directly; consuming apps must provide these.
- **Component selector prefix is `lib`** (configured in `angular.json`); the showcase app uses prefix `app`.
- **Showcase demo app lives under `projects/showcase/`** (`@angular/build:application`, standalone + zone.js, Angular Material 3 theme). Routes lazy-load one page per library feature from `src/app/pages/*`; the feature list is centralized in `src/app/nav.ts`. It imports `@ferhaps/easy-ui-lib`, resolved to `projects/ui-lib/src/public-api.ts` by the `paths` mapping in the root `tsconfig.json` — so demos always reflect the current source. Mounts `<lib-error-handler>` and `<lib-global-loader>` once in the app shell.

Key building blocks (under `projects/ui-lib/src/lib/`):

- **Error handling pipeline** — `ErrorService` (`services/error.service.ts`) is a `providedIn: 'root'` RxJS `Subject` that broadcasts `HttpErrorResponse`s; `ErrorHandlerComponent` subscribes and opens `ErrorPopupComponent` in a `MatDialog`. `ErrorDisplayComponent` and the `SnakeCaseParserPipe` render human-readable messages. Drop `<lib-error-handler>` once near the app root.
- **Global loader** — `LoaderService` + `GlobalLoaderComponent` provide an app-wide loading overlay.
- **`TableComponent<T>`** (`components/table/`) — a generic, config-driven table. Behavior is declared via a `Config<T>` object (columns via `dataProps`, sorting, drag-drop reordering, single/multiple row selection, row options, `classRules`, `trackBy`) and it emits a single typed `TableEvent<T>` `output` for all interactions. Rows are tracked by identity (override with `Config.trackBy`) and selection is keyed to that identity, so it survives drag-drop reordering and resets when a new `data` array is supplied; `TableEvent.selectedRows` reports indices into the current `data` order. Pairs with `TableSortHeaderComponent`.
- **Form helpers** — `PasswordValidatorDirective` and `FieldsMatchValidatorDirective` hook into `NG_VALIDATORS`; `PhoneValidationDirective` formats input via a `ControlValueAccessor` (`NG_VALUE_ACCESSOR`), keeping the bound form control in sync; `SearchBarComponent` is a debounced search input, also a `ControlValueAccessor`.
- **`utils/utils.ts`** (re-exported from `public-api.ts`) — shared HTTP helpers: `HTTP_STATUS_CODES`, the `*_HTTP_OPTIONS` request option presets (note the `X-Skip-Error` and `X-Global-Loader` header conventions that the error/loader systems key off), the `HttpRequestOptions` type, and `withAcceptLanguage(options, language)` for opting into a locale (no locale is baked into the presets). `utils/types.ts` holds shared types like `SystemError`.

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
- Every component lives in its own folder with separate `.ts`, `.html`, and `.scss` files — no inline `template`/`styles`. Wire them with `templateUrl`/`styleUrl` (paths relative to the `.ts` file). One component per folder.
- `NgOptimizedImage` for static images (not for inline base64).

**Accessibility:** must pass AXE checks and meet WCAG AA (focus management, color contrast, ARIA).

**Formatting** (`.editorconfig`): tabs for indentation, single quotes in TypeScript, final newline.

## Keeping showcase and README in sync

**This is mandatory.** Any change to `ui-lib` — new feature, modification, or removal — requires two follow-up steps before the work is considered done:

1. **Showcase** (`projects/showcase/`) — implement or update the demo page for the affected entity. New entities need a new page wired into `src/app/nav.ts`. Existing entities need their page updated to exercise the change.
2. **README** (`projects/ui-lib/README.md`) — update the relevant section to match. New entities get a new entry; removals get their entry deleted; modifications get their docs updated.

The showcase is the live proof the library works; the README is the consumer-facing contract. Never let them diverge from the library source.

## Publishing

The library is published manually to npm. See the `publish-library` skill for the version-bump → build → `npm publish` workflow.
