import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type SortState = 'none' | 'asc' | 'desc';

@Component({
  selector: 'app-table-sort-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './table-sort-header.component.html',
  styleUrls: ['./table-sort-header.component.scss']
})
export class TableSortHeaderComponent {
  @Input() public selected: boolean = false;

  @Output() public sort = new EventEmitter<SortState>();

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
