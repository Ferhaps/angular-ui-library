import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  template: `
    <form class="search-bar" [formGroup]="searchForm">
      <img ngSrc="assets/images/searchIcon.svg" width="22" height="22" priority="priority" alt="search">
      <input
        class="search-input" type="search" name="field"
        placeholder="Search {{for}}" autocomplete="off" formControlName="search">
    </form>
  `,
  styles: [`
    .search-bar {
      width: 270px;
      border: 1px solid #A4A4A4;
      padding: 7px 11px;
      height: 20px;
      display: flex;
      align-items: center;
    }
    .search-input {
      border: none;
      padding: 0;
      margin-left: 1rem;
      width: 100%;
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
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ]
})

export class SearchBarComponent {
  @Input() public for: string = '';

  @Output() private search = new EventEmitter<string>();

  protected searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  });

  constructor() {
    this.searchForm.get('search')?.valueChanges.
      pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe((searchTerm: string) => this.search.emit(searchTerm));
  }
}