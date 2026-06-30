import {
	Component,
	ElementRef,
	effect,
	input,
	output,
	viewChild,
	ChangeDetectionStrategy,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
	SortState,
	TableSortHeaderComponent,
} from '../table-sort-header/table-sort-header.component';
import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
	MatCheckboxChange,
	MatCheckboxModule,
} from '@angular/material/checkbox';

export type TableEvent<T = any> = {
	action:
		| 'rowClick'
		| 'rowSelect'
		| 'drag'
		| 'scrolled'
		| 'sort'
		| 'add'
		| string;
	obj?: T;
	prop?: keyof T;
	index?: number;
	selected?: boolean;
	selectedRows?: number[];
	sortState?: SortState;
	event?: Event;
};

export type Config<T = any> = {
	data: T[];
	title: string;
	dataProps: (keyof T)[];
	tableHeadings?: string[];
	options?: string[] | ((obj: T) => string[]);
	withAdd?: boolean;
	selectableRows?: 'single' | 'multiple';
	sortable?: boolean;
	draggable?: boolean;
	classRules?: ClassRule<T>[];
	trackBy?: (obj: T) => unknown;
};

export type ClassRule<T = any> = {
	className: string;
	condition: (obj: T, prop: keyof T) => boolean;
};

@Component({
	selector: 'lib-table',
	templateUrl: 'table.component.html',
	styleUrls: ['table.component.scss'],
	imports: [
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		TableSortHeaderComponent,
		DragDropModule,
		MatCheckboxModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = any> {
	public config = input.required<Config<T>>();

	protected action = output<TableEvent<T>>();

	protected scrollContainer =
		viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

	protected hoverRowIndex: number = -1;
	protected currentSortColumn: number = -1;

	private selectedKeys = new Set<unknown>();
	private singleSelectedKey: unknown = undefined;
	private previousData: T[] | null = null;

	constructor() {
		// Reset selection whenever a new data array is supplied. The reference
		// check keeps in-place mutations (e.g. drag-drop reorder) and inline
		// config literals from clearing the current selection on every cycle.
		effect(() => {
			const data = this.config().data;
			if (this.previousData && this.previousData !== data) {
				this.selectedKeys.clear();
				this.singleSelectedKey = undefined;
			}
			this.previousData = data;
		});
	}

	protected keyOf(obj: T): unknown {
		const trackBy = this.config().trackBy;
		return trackBy ? trackBy(obj) : obj;
	}

	protected isRowSelected(obj: T): boolean {
		const key = this.keyOf(obj);
		const mode = this.config().selectableRows;
		if (mode === 'single') return this.singleSelectedKey === key;
		if (mode === 'multiple') return this.selectedKeys.has(key);
		return false;
	}

	private isSelectedAny(obj: T): boolean {
		const key = this.keyOf(obj);
		return this.singleSelectedKey === key || this.selectedKeys.has(key);
	}

	private selectedIndexes(): number[] {
		const indexes: number[] = [];
		this.config().data.forEach((obj, index) => {
			if (this.selectedKeys.has(this.keyOf(obj))) indexes.push(index);
		});
		return indexes;
	}

	protected getClass(obj: T, prop: keyof T): string {
		if (!this.config().classRules) return '';

		const classes: string[] = [];
		for (let rule of this.config().classRules as ClassRule<T>[]) {
			if (rule.condition(obj, prop)) {
				classes.push(rule.className);
			}
		}

		return classes.join(' ');
	}

	protected drop(event: CdkDragDrop<T[]>) {
		if (this.config().draggable) {
			moveItemInArray(
				this.config().data,
				event.previousIndex,
				event.currentIndex,
			);
			this.action.emit({
				action: 'drag',
				obj: this.config().data[event.currentIndex],
				index: event.currentIndex,
			});
		}
	}

	protected onScroll(e: Event): void {
		const container = this.scrollContainer().nativeElement;
		this.action.emit({ action: 'scroll', event: e });
		if (
			Math.ceil(container.scrollTop) + container.offsetHeight >=
			container.scrollHeight
		) {
			this.action.emit({ action: 'scrolled' });
		}
	}

	protected onRowClick(event: Event, obj: T, index: number): void {
		const key = this.keyOf(obj);
		this.singleSelectedKey = this.singleSelectedKey === key ? undefined : key;
		this.action.emit({
			action: 'rowClick',
			obj,
			index,
			selected: this.isSelectedAny(obj),
			event,
		});
	}

	protected selectOption(option: string, obj: T, index: number): void {
		this.action.emit({
			action: option.toLowerCase(),
			obj,
			index,
			selected: this.isSelectedAny(obj),
		});
	}

	protected areAllRowsSelected(): boolean {
		const data = this.config().data;
		return data.length > 0 && this.selectedKeys.size === data.length;
	}

	protected toggleSelectAll(event: MatCheckboxChange): void {
		this.selectedKeys.clear();
		if (event.checked) {
			for (const obj of this.config().data) {
				this.selectedKeys.add(this.keyOf(obj));
			}
		}

		this.action.emit({
			action: 'rowSelect',
			selectedRows: this.selectedIndexes(),
		});
	}

	protected toggleRowSelection(obj: T, index: number): void {
		if (this.config().selectableRows !== 'multiple') return;

		const key = this.keyOf(obj);
		if (this.selectedKeys.has(key)) {
			this.selectedKeys.delete(key);
		} else {
			this.selectedKeys.add(key);
		}

		this.action.emit({
			action: 'rowSelect',
			index,
			selectedRows: this.selectedIndexes(),
		});
	}

	protected sortByProp(prop: keyof T, sortState: SortState): void {
		this.action.emit({ action: 'sort', prop, sortState });
	}

	protected getOptionsForRow(obj: T): string[] {
		const options = this.config().options;
		if (!options) return [];
		return typeof options === 'function' ? options(obj) : options;
	}

	protected hasOptions(): boolean {
		return !!this.config().options;
	}
}
