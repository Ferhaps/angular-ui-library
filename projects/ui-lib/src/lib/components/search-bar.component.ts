import { Component, output, input, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

const CUSTOM_CONROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchBarComponent),
  multi: true,
};

@Component({
  selector: 'lib-search-bar',
  template: `
  <form class="search-bar" [formGroup]="searchForm">
    <mat-icon>search</mat-icon>
    <input class="search-input" type="search" name="field"
      [placeholder]="'Search ' + for()" autocomplete="off" formControlName="search" />
  </form>
`,
  styles: [`
  .search-bar {
    width: 270px;
    border: 1px solid #A4A4A4;
    display: flex;
    align-items: center;
  }

  .search-input {
    border: none;
    padding: 7px 11px;
    height: 100%;
    width: 100%;
    background-color: transparent;
  }

  mat-icon {
    margin-inline: 8px;
  }

  .search-input:focus {
    border: none;
    outline: none;
  }

  @media (max-width: 1086px) {
    .search-bar {
      width: 170px;
    }
  }
`],
  imports: [
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [CUSTOM_CONROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements ControlValueAccessor {
  public for = input.required<string>();

  protected search = output<string | Event>();

  protected searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  });

  constructor() {
    this.searchForm.get('search')?.valueChanges.
      pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe((searchTerm: string | Event) => {
        if (typeof searchTerm === 'string') {
          searchTerm = searchTerm.trim();
        }

        this.search.emit(searchTerm);
      });
  }

  writeValue(value: string): void {
    this.searchForm.get('search')?.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.searchForm.get('search')?.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // Implement if needed
  }
}