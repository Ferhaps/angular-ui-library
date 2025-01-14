import { Component, output, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  ]
})
export class SearchBarComponent {
  public for = input.required<string>();
  protected search = output<string>();

  protected searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  });

  constructor() {
    this.searchForm.get('search')?.valueChanges.
      pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe((searchTerm: string) => {
        if (searchTerm.trim() !== '') {
          this.search.emit(searchTerm);
        }
      });
  }
}