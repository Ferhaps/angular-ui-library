import { CommonModule } from '@angular/common';
import { Component, input, NgModule, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type SortState = 'none' | 'asc' | 'desc';

@Component({
  standalone: false,
  selector: 'lib-table-sort-header',
  templateUrl: './table-sort-header.component.html',
  styleUrls: ['./table-sort-header.component.scss']
})
export class TableSortHeaderComponent {
  public selected = input.required<boolean>();
  public sort = output<SortState>();

  protected sortState: SortState = 'none';

  protected onSortClick(): void {
    if (this.sortState === 'none') {
      this.sortState = 'desc';
    } else if (this.sortState === 'desc') {
      this.sortState = 'asc';
    } else {
      this.sortState = 'none';
    }

    this.sort.emit(this.sortState);
  }
}

@NgModule({
  declarations: [
    TableSortHeaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    TableSortHeaderComponent
  ]
})
export class TableSortHeaderModule { }