import { NgClass } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SortState, TableSortHeaderComponent } from '../table-sort-header/table-sort-header.component';
import { WhiteSpaceFillerPipe } from '../../pipes/blank-filler.pipe';
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { fader } from '../../utils/animations';

export type TableEvent = {
  action: string;
  obj?: any;
  prop?: string;
  index?: number;
  selected?: boolean;
  sortState?: SortState;
  event?: Event;
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
  classRules?: ClassRule[];
};

export type ClassRule = {
  className: string;
  condition: (obj: any, prop: string) => boolean;
};

@Component({
  selector: 'lib-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
  animations: [fader],
  standalone: true,
  imports: [
    NgClass,
    WhiteSpaceFillerPipe,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TableSortHeaderComponent,
    DragDropModule
  ],
})
export class TableComponent {
  public config = input.required<Config>();
  protected action = output<TableEvent>();
  protected scrollContainer = viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

  protected selectedRowIndex: number = -1;
  protected hoverRowIndex: number = -1;
  protected currentSortColumn: number = -1;

  protected getClass(obj: any, prop: string): string {
    if (!this.config().classRules) return '';

    const classes: string[] = [];
    for (let rule of (this.config().classRules as ClassRule[])) {
      if (rule.condition(obj, prop)) {
        classes.push(rule.className);
      }
    }

    return classes.join(' ');
  }

  protected drop(event: CdkDragDrop<any>) {
    if (this.config().draggable) {
      moveItemInArray(this.config().data, event.previousIndex, event.currentIndex);
      this.action.emit({ action: 'drag', obj: this.config().data[event.currentIndex], index: event.currentIndex });
    }
  }

  protected onScroll() {
    const container = this.scrollContainer().nativeElement;
    // console.log(Math.ceil(container.scrollTop), container.offsetHeight, container.scrollHeight)
    if ((Math.ceil(container.scrollTop) + container.offsetHeight) >= container.scrollHeight) {
      this.action.emit({ action: 'scrolled' });
    }
  }

  protected onRowClick(event: Event, obj: any, index: number): void {
    this.selectedRowIndex = index === this.selectedRowIndex ? -1 : index;
    this.action.emit({ action: 'rowClick', obj, index, selected: this.selectedRowIndex === index, event });
  }

  protected selectOption(оption: string, obj: any, index: number): void {
    this.action.emit({ action: оption.toLowerCase(), obj, index, selected: this.selectedRowIndex === index });
  }

  protected sortByProp(prop: string, sortState: SortState): void {
    this.action.emit({ action: 'sort', prop, sortState });
  }

  protected trackById(index: number, obj: any): number {
    return obj.id || index;
  }
}