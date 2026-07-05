# @ferhaps/easy-ui-lib

A comprehensive Angular UI library providing reusable components, directives, and pipes built with Angular Material.

## Installation

```bash
npm install @ferhaps/easy-ui-lib
```

## Dependencies

This library declares the following peer dependencies — your app must provide them:

- Angular (`@angular/core`, `@angular/common`) ^22.0.4
- Angular Forms (`@angular/forms`) ^22.0.4
- Angular Material (`@angular/material`) ^22.0.2
- Angular CDK (`@angular/cdk`) ^22.0.2

## Components

### TableComponent

A feature-rich table component supporting:

- Sorting
- Single and Multi row selection
- Drag & drop rows
- Custom options menu
- Infinite scroll
- Loading and empty states
- Customizable styles
- Custom header
- Keyboard-accessible rows, sort headers and row menus (aria-sort / aria-selected)

```html
<lib-table
	[config]="{
    data: items,
    title: 'Users Table',
    dataProps: ['id', 'name', 'email'],
    tableHeadings: ['ID', 'Name', 'Email'],
    options: ['Edit', 'Delete'],
    withAdd: true,
    selectableRows: 'single' | 'multiple',
    sortable: true,
    draggable: true
  }"
	(action)="handleTableAction($event)"
>
	<div class="upper-part">Optional content to be displyed at the top of the table</div>
	<tr class="custom-headers">
		Custom header elements will be shown only if tableHeadings is empty
	</tr>
</lib-table>
```

```typescript
export type Config<T = unknown> = {
  data: T[];
  title: string;
  dataProps: (keyof T)[];
  tableHeadings?: string[];
  options?: string[] | ((obj: T) => string[]);
  withAdd?: boolean;
  selectableRows?: 'single' | 'multiple';
  sortable?: boolean;
  draggable?: boolean;
  classRules?: ClassRule<T>[];
  trackBy?: (obj: T) => unknown;
  loading?: boolean;
  emptyMessage?: string;
};

export type SortState = 'none' | 'asc' | 'desc';

export type TableEvent<T = unknown> = {
  // Known actions, plus any custom string. Row-option labels are emitted
  // lowercased as the action (e.g. an 'Edit' option → action 'edit'), so you
  // can handle your own actions alongside the built-in ones.
  action: 'rowClick' | 'rowSelect' | 'drag' | 'scroll' | 'scrolled' | 'sort' | 'add' | (string & {});
  obj?: T;
  prop?: keyof T;
  index?: number;
  selected?: boolean;
  selectedRows?: number[];
  sortState?: SortState;
  event?: Event;
};

handleTableAction(event: TableEvent) {}
```

Row selection is tracked by row identity (see `trackBy`), so selections follow their rows across drag-drop reordering and reset automatically when a new `data` array is supplied. `selectedRows` is always reported as indices into the current `data` order.

### SearchBarComponent

A styled search input with debounce functionality that works with **all three** Angular forms styles. It implements `ControlValueAccessor` (reactive + template-driven forms) **and** `FormValueControl` (Signal Forms, Angular 22+), so you can bind it whichever way your app uses.

**Standalone usage (output only)**

```html
<lib-search-bar [for]="'users'" (search)="onSearch($event)"> </lib-search-bar>
```

**Reactive forms**

```html
<lib-search-bar [for]="'users'" formControlName="search" />
```

**Template-driven forms**

```html
<lib-search-bar [for]="'users'" [(ngModel)]="searchTerm" />
```

**Signal Forms** (via the `[formField]` directive — no `ControlValueAccessor` needed)

```typescript
import { form } from "@angular/forms/signals";

model = signal({ query: "" });
f = form(this.model);
```

```html
<lib-search-bar [for]="'users'" [formField]="f.query" />
```

The `search` output still emits on every debounced change and can be used alongside any form binding. The emitted value is the trimmed search string.

The debounce defaults to 300ms and is configurable via `[debounceMs]` (applied live, so it can be bound to a signal):

```html
<lib-search-bar [for]="'users'" [formControl]="searchCtrl" [debounceMs]="500" />
```

### DefaultDialogComponent

A customizable dialog component with optional back button.

```html
<lib-default-dialog [dialogTitle]="'User Details'" [height]="'400px'" [withBack]="true" (back)="onBack()">
	<div class="dialog-content">
		<!-- Your content here -->
	</div>
</lib-default-dialog>
```

### GlobalLoaderComponent

A centered spinner overlay for loading states.

```html
<lib-global-loader />
```

```typescript
private loaderService = inject(LoaderService);
this.loaderService.setLoading(true);
// do stuff
this.loaderService.setLoading(false);
```

### ErrorHandlerComponent

Displays error messages in a dialog format.

```html
<lib-error-handler />
```

```typescript
private errorService = inject(ErrorService);
try {
  this.apiCall();
}
catch (e: HttpErrorResponse) {
  this.errorService.sendError(e);
}
```

## Directives

### FieldsMatchValidatorDirective

Validates that two form fields match (useful for password confirmation). It **re-validates automatically** when the mirrored field changes — no manual `updateValueAndValidity()` wiring needed.

```html
<input type="password" formControlName="password" />
<input type="password" formControlName="confirm" libFieldsMatchValidator fieldToMatch="password" />
<!-- error key when they differ: { mismatch: true } -->
```

### PasswordValidatorDirective

Validates password strength. Every rule is configurable via inputs (defaults shown):

| Input              | Default      | Meaning                     |
| ------------------ | ------------ | --------------------------- |
| `minLength`        | `8`          | Minimum length              |
| `requireUppercase` | `true`       | Needs an uppercase letter   |
| `requireLowercase` | `true`       | Needs a lowercase letter    |
| `requireDigit`     | `true`       | Needs a number              |
| `requireSpecial`   | `true`       | Needs a special character   |
| `specialChars`     | `'!@#$%^&*'` | Accepted special characters |

```html
<input type="password" libPasswordValidator [minLength]="10" [requireSpecial]="false" />
```

Rather than a single boolean, it reports **which** rules failed under the `passwordInvalid` key, so a UI can show a per-rule checklist:

```typescript
// control.errors?.passwordInvalid — only failing rules are present
export type PasswordErrors = {
	minLength?: number; // the required length, present when too short
	uppercase?: boolean;
	lowercase?: boolean;
	digit?: boolean;
	special?: boolean;
};
```

### PhoneValidationDirective

Formats phone number input as follows:

- Ensures the input always starts with a '+' symbol (prepends it if missing)
- Allows only numbers and the plus sign
- Prevents removing the initial '+' symbol

Implemented as a `ControlValueAccessor`, so the formatted value is written back to the bound form control. It works standalone or with reactive / template-driven forms.

```html
<!-- Standalone -->
<input type="tel" libPhoneValidation />

<!-- Reactive forms -->
<input type="tel" libPhoneValidation formControlName="phone" />

<!-- Template-driven forms -->
<input type="tel" libPhoneValidation [(ngModel)]="phone" />
```

### These directives and Signal Forms

The three directives above hook into **reactive / template-driven** forms (`NG_VALIDATORS` for the validators, `ControlValueAccessor` for phone). **Signal Forms works completely differently** — validation lives in the form's schema, not in directives on the input — so these directives are not used there. Express the same behaviour with schema validators instead:

```typescript
import { form, required, minLength, pattern, validate } from "@angular/forms/signals";

model = signal({ password: "", confirm: "", phone: "" });

f = form(this.model, (path) => {
	// PasswordValidatorDirective → built-in validators, one per rule:
	minLength(path.password, 8, { message: "At least 8 characters" });
	pattern(path.password, /[A-Z]/, { message: "An uppercase letter" });
	pattern(path.password, /[a-z]/, { message: "A lowercase letter" });
	pattern(path.password, /\d/, { message: "A number" });
	pattern(path.password, /[!@#$%^&*]/, { message: "A special character" });

	// FieldsMatchValidatorDirective → cross-field validation via valueOf():
	validate(path.confirm, ({ value, valueOf }) => (value() === valueOf(path.password) ? null : { kind: "mismatch", message: "Passwords do not match" }));

	// PhoneValidationDirective → pattern() validates the "+digits" format.
	// (Live formatting needs a custom FormValueControl — Signal Forms has no
	//  CVA-style formatter directive; see SearchBarComponent for that pattern.)
	pattern(path.phone, /^\+[0-9]+$/, { message: "A leading + and digits" });
});
```

```html
<input type="password" [formField]="f.password" />
<input type="password" [formField]="f.confirm" />
<input [formField]="f.phone" />
```

Only `SearchBarComponent` (a value-editing control) implements the Signal Forms `FormValueControl` contract for direct `[formField]` binding — see its section above.

## Pipes

### SnakeCaseParserPipe

Turns `snake_case` / `SCREAMING_SNAKE_CASE` tokens into a readable, capitalised label — handy for rendering backend enums and error codes. A fully upper-case token is humanised to a sentence; mixed-case tokens keep all-upper words as acronyms (`API`, `URL`, `ID`) so they aren't mangled.

```html
<div>{{ 'user_name' | snakeCaseParser }}</div>
<!-- Output: User name -->

<div>{{ 'EMAIL_ALREADY_TAKEN' | snakeCaseParser }}</div>
<!-- Output: Email already taken -->

<div>{{ 'user_API_key' | snakeCaseParser }}</div>
<!-- Output: User API key -->
```

## Services

### LoaderService

Manages global loading state.

```typescript
private loaderService = inject(LoaderService);
this.loaderService.setLoading(true);
// do stuff
this.loaderService.setLoading(false);
```

### ErrorService

Handles global error display.

```typescript
private errorService = inject(ErrorService);
try {
  this.apiCall();
}
catch (e: HttpErrorResponse) {
  this.errorService.sendError(e);
}
```

## Utilities

Exported from `@ferhaps/easy-ui-lib` for working with `HttpClient`.

### HTTP_STATUS_CODES

A `Record<number | string, string>` mapping HTTP status codes to their reason phrases.

```typescript
HTTP_STATUS_CODES[404]; // 'Not Found'
```

### Request option presets

Ready-to-use option objects for `HttpClient` calls:

- `JSON_HTTP_OPTIONS` — JSON request/response
- `STRING_HTTP_OPTIONS` — `text` response
- `BLOB_HTTP_OPTIONS` — binary (`blob`) response
- `SKIP_ERROR_OPTIONS` — JSON request carrying the `X-Skip-Error` header, signalling the error pipeline not to surface a popup for this call
- `JSON_OPTIONS_WITH_GLOBAL_LOADER` — JSON request carrying the `X-Global-Loader` header, opting the call into the global loader

```typescript
this.http.get<User[]>("/api/users", JSON_HTTP_OPTIONS);
```

### withAcceptLanguage(options, language)

Returns a copy of any options preset with an `Accept-Language` header. No locale is baked into the presets, so opt in per call (or build your own interceptor). Pairs with the `HttpRequestOptions` type, also exported.

```typescript
this.http.get<User[]>("/api/users", withAcceptLanguage(JSON_HTTP_OPTIONS, "bg"));
```

## HTTP interceptor

`easyUiLibInterceptor` wires the header conventions above to the library's services:

- a request carrying `X-Global-Loader` toggles the `LoaderService` for its lifetime;
- a failed request is broadcast through `ErrorService` (opening the popup) **unless** it carries `X-Skip-Error`.

Both internal headers are stripped before the request is sent.

Register it in your `HttpClient` setup:

```typescript
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { easyUiLibInterceptor } from "@ferhaps/easy-ui-lib";

provideHttpClient(withInterceptors([easyUiLibInterceptor]));
```

Or let the library configure `HttpClient` for you (skip this if you need other `provideHttpClient` features such as `withFetch()`, or already call it yourself). You can pass your own functional interceptors to run alongside the library's — they run after `easyUiLibInterceptor`:

```typescript
import { provideEasyUiLib } from "@ferhaps/easy-ui-lib";

bootstrapApplication(App, {
	providers: [provideEasyUiLib([authInterceptor])], // or just provideEasyUiLib()
});
```

Then opt individual requests in/out via the presets:

```typescript
this.http.get("/api/report", JSON_OPTIONS_WITH_GLOBAL_LOADER); // shows the loader
this.http.get("/api/poll", SKIP_ERROR_OPTIONS); // no error popup
```

## Theming

Components read Angular Material's M3 **system variables** (`--mat-sys-*`) with neutral fallbacks, so they adopt your app's Material theme — light or dark — automatically. With no Material theme present they fall back to sensible neutral colors. To customize, provide a Material M3 theme (or override the relevant `--mat-sys-*` custom properties) at a scope above the components.

## Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

MIT © [Ferhan Cherkez]
