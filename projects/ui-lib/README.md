# @ferhaps/easy-ui-lib

A comprehensive Angular UI library providing reusable components, directives, and pipes built with Angular Material.

## Installation

```bash
npm install @ferhaps/easy-ui-lib
```

## Dependencies

This library requires:
- Angular ^20.3.3
- Angular Material ^20.2.7
- Angular CDK ^20.3.3

## Components

### TableComponent
A feature-rich table component supporting:
- Sorting
- Single and Multi row selection
- Drag & drop rows
- Custom options menu
- Infinite scroll
- Customizable styles
- Custom header

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
  (action)="handleTableAction($event)">
  <div class="upper-part">Optional content to be displyed at the top of the table</div>
  <tr class="custom-headers">Custom header elements will be shown only if tableHeadings is empty</tr>
</lib-table>
```

``` typescript
export type SortState = 'none' | 'asc' | 'desc';

export type TableEvent<T = any> = {
  action: 'rowClick' | 'rowSelect' | 'drag' | 'scrolled' | 'sort' | 'add' | string;
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

### SearchBarComponent
A styled search input with debounce functionality.
The search event emits either a string or Event. Event is emitted when the "X" button is pressed
```html
<lib-search-bar
  [for]="'users'"
  (search)="onSearch($event)">
</lib-search-bar>
```

### DefaultDialogComponent
A customizable dialog component with optional back button.
```html
<lib-default-dialog
  [dialogTitle]="'User Details'"
  [height]="'400px'"
  [withBack]="true"
  (back)="onBack()">
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

``` typescript
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
``` typescript
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
Validates if two form fields match (useful for password confirmation).
```html
<input type="password" />
<input type="password-repeat" [libFieldsMatchValidator]="'password'" />
```

### PasswordValidatorDirective
Ensures password meets the following requirments:
* At least one uppercase letter
* At least one lowercase letter
* At least one special character from the specified set
* At least one number
* Minimum length of 8 characters

```html
<input type="password" libPasswordValidator />
```

### PhoneValidationDirective
Formats and validates phone number input as follows:
* Ensures the input always starts with a '+' symbol
If missing, automatically prepends it to the value

* Allows only numbers and the plus sign

* Prevents removing the initial '+' symbol:

```html
<input type="tel" libPhoneValidation />
```

## Pipes

### SnakeCaseParserPipe
Converts snake_case to Title Case text.
```html
<div>{{ 'user_name' | snakeCaseParser }}</div> <!-- Output: User name -->
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

## Contributing
Please read our contributing guidelines and code of conduct before submitting pull requests.

## License
MIT © [Ferhan Cherkez]