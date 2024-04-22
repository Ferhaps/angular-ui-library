import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SortState, TableSortHeaderComponent } from '../table-sort-header/table-sort-header.component';
import { fader } from '../../utills/animations';
import { WhiteSpaceFillerPipe } from '../../pipes/blank-filler.pipe';
import { SnakeCaseParserPipe } from '../../pipes/snake-case-parser.pipe';
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";

export type TableEvent = {
  action: string;
  obj?: any;
  prop?: string;
  index?: number;
  selected?: boolean;
  sortState?: SortState;
};

export type Config = {
  data: any[];
  title: string;
  dataProps: string[];
  tableHeadings: string[];
  options: string[];
  withAdd: boolean;
  selectableRows: boolean;
  sortable: boolean;
  draggable?: boolean;
};

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: [ 'table.component.scss' ],
  animations: [ fader ],
  standalone: true,
  imports: [
    CommonModule,
    WhiteSpaceFillerPipe,
    NgOptimizedImage,
    SnakeCaseParserPipe,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TableSortHeaderComponent,
    DragDropModule
  ],
})
export class TableComponent {
  @Input({ required: true }) config!: Config;
  
  @Output() action = new EventEmitter<TableEvent>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>

  selectedRowIndex: number = -1;
  hoverRowIndex: number = -1;
  currentSortColumn: number = -1;

  drop(event: CdkDragDrop<any>) {
    if (this.config.draggable) {
      moveItemInArray(this.config.data, event.previousIndex, event.currentIndex);
      this.action.emit({ action: 'drag', obj: this.config.data[event.currentIndex], index: event.currentIndex });
    }
  }

  onScroll() {
    const container = this.scrollContainer.nativeElement;
    // console.log(Math.ceil(container.scrollTop), container.offsetHeight, container.scrollHeight)
    if ((Math.ceil(container.scrollTop) + container.offsetHeight) >= container.scrollHeight) {
      this.action.emit({ action: 'scrolled' });
    }
  }

  onRowClick(obj: any, index: number): void {
    this.selectedRowIndex = index === this.selectedRowIndex ? -1 : index;
    this.action.emit({ action: 'rowClick', obj, index, selected: this.selectedRowIndex === index });
  }

  selectOption(оption: string, obj: any, index: number): void {
    this.action.emit({ action: оption.toLowerCase(), obj, index, selected: this.selectedRowIndex === index });
  }

  sortByProp(prop: string, sortState: SortState): void {
    this.action.emit({ action: 'sort', prop, sortState });
  }

  trackById(index: number, obj: any): number {
    return obj.id || index;
  }
}