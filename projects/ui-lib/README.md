# @ferhaps/easy-ui-lib

A comprehensive Angular UI library providing reusable components, directives, and pipes built with Angular Material.

## Installation

```bash
npm install @ferhaps/easy-ui-lib
```

## Dependencies

This library requires:
- Angular ^19.0.0
- Angular Material ^19.0.0
- Angular CDK ^19.0.0

## Components

### ChipComponent
A selectable chip component for displaying tags or filters.
```typescript
<lib-chip
  [value]="value"
  [isSelected]="isSelected"
  [text]="displayText"
  (selected)="onChipSelected($event)">
</lib-chip>
```

### TableComponent
A feature-rich table component supporting:
- Sorting
- Row selection
- Drag & drop rows
- Custom options menu
- Infinite scroll
- Customizable styles

```typescript
<lib-table
  [config]="{
    data: items,
    title: 'Users Table',
    dataProps: ['id', 'name', 'email'],
    tableHeadings: ['ID', 'Name', 'Email'],
    options: ['Edit', 'Delete'],
    withAdd: true,
    selectableRows: true,
    sortable: true,
    draggable: true
  }"
  (action)="handleTableAction($event)">
</lib-table>
```

### SearchBarComponent
A styled search input with debounce functionality.
```typescript
<lib-search-bar
  [for]="'users'"
  (search)="onSearch($event)">
</lib-search-bar>
```

### DefaultDialogComponent
A customizable dialog component with optional back button.
```typescript
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
```typescript
<lib-global-loader></lib-global-loader>
```

### ErrorHandlerComponent
Displays error messages in a dialog format.
```typescript
<lib-error-handler></lib-error-handler>
```

## Directives

### FieldsMatchValidatorDirective
Validates if two form fields match (useful for password confirmation).
```typescript
<input type="password" />
<input type="password-repeat" [libFieldsMatchValidator]="'password'" />
```

### PasswordValidatorDirective
Ensures password meets complexity requirements.
```typescript
<input type="password" libPasswordValidator />
```

### PhoneValidationDirective
Formats and validates phone number input.
```typescript
<input type="tel" libPhoneValidation />
```

## Pipes

### BlankFillerPipe
Replaces empty values with a specified character.
```typescript
{{ someValue | blankFiller:'-' }}
```

### SnakeCaseParserPipe
Converts snake_case to Title Case text.
```typescript
{{ 'user_name' | snakeCaseParser }} <!-- Output: User name -->
```

## Services

### LoaderService
Manages global loading state.
```typescript
constructor(private loaderService: LoaderService) {
  loaderService.setLoading(true);
  // ... async operation
  loaderService.setLoading(false);
}
```

### ErrorService
Handles global error display.
```typescript
constructor(private errorService: ErrorService) {
  errorService.sendError(error);
}
```

## Contributing
Please read our contributing guidelines and code of conduct before submitting pull requests.

## License
MIT © [Ferhan Cherkez]