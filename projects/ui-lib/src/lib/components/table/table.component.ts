import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SortState, TableSortHeaderComponent } from '../table-sort-header/table-sort-header.component';
import { fader } from '../../utills/animations';
import { WhiteSpaceFillerPipe } from '../../pipes/blank-filler.pipe';
import { SnakeCaseParserPipe } from '../../pipes/snake-case-parser.pipe';

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
    TableSortHeaderComponent
  ],
})
export class TableComponent {
  @Input({ required: true }) public config!: Config;
  
  @Output() protected action = new EventEmitter<TableEvent>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>

  public selectedRowIndex: number = -1;
  protected hoverRowIndex: number = -1;
  protected currentSortColumn: number = -1;

  protected trackById(index: number, obj: any): number {
    return obj.id || index;
  }

  protected onScroll() {
    const container = this.scrollContainer.nativeElement;
    // console.log(Math.ceil(container.scrollTop), container.offsetHeight, container.scrollHeight)
    if ((Math.ceil(container.scrollTop) + container.offsetHeight) >= container.scrollHeight) {
      console.log('scroll')
      this.action.emit({ action: 'scrolled' });
    }
  }

  protected onRowClick(obj: any, index: number): void {
    this.selectedRowIndex = index === this.selectedRowIndex ? -1 : index;
    this.action.emit({ action: 'rowClick', obj, index, selected: this.selectedRowIndex === index });
  }

  protected selectOption(оption: string, obj: any, index: number): void {
    this.action.emit({ action: оption.toLowerCase(), obj, index, selected: this.selectedRowIndex === index });
  }

  protected sortByProp(prop: string, sortState: SortState): void {
    this.action.emit({ action: 'sort', prop, sortState });
  }
}