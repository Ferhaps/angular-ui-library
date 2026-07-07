import {
	Component,
	ElementRef,
	computed,
	effect,
	input,
	output,
	signal,
	viewChild,
	ChangeDetectionStrategy,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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

export type TableEvent<T = unknown> = {
	action:
		| 'rowClick'
		| 'rowSelect'
		| 'drag'
		| 'scroll'
		| 'scrolled'
		| 'sort'
		| 'add'
		| (string & {}); // Custom option actions
	obj?: T;
	prop?: keyof T;
	index?: number;
	selected?: boolean;
	selectedRows?: number[];
	sortState?: SortState;
	event?: Event;
};

export type Config<T = unknown> = {
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
	loading?: boolean;
	emptyMessage?: string;
};

export type ClassRule<T = unknown> = {
	className: string;
	condition: (obj: T, prop: keyof T) => boolean;
};

@Component({
	selector: 'eui-table',
	templateUrl: 'table.component.html',
	styleUrls: ['table.component.scss'],
	imports: [
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		TableSortHeaderComponent,
		DragDropModule,
		MatCheckboxModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = unknown> {
	public config = input.required<Config<T>>();

	protected action = output<TableEvent<T>>();

	protected scrollContainer =
		viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

	protected currentSortColumn: number = -1;
	protected currentSortState: SortState = 'none';

	private readonly selectedKeys = signal<Set<unknown>>(new Set<unknown>());
	private readonly singleSelectedKey = signal<unknown>(undefined);
	private previousData: T[] | null = null;

	protected readonly hasOptions = computed(() => !!this.config().options);
	protected readonly areAllRowsSelected = computed(() => {
		const data = this.config().data;
		return data.length > 0 && this.selectedKeys().size === data.length;
	});

	constructor() {
		effect(() => {
			const data = this.config().data;
			if (this.previousData && this.previousData !== data) {
				this.selectedKeys.set(new Set<unknown>());
				this.singleSelectedKey.set(undefined);
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
		if (mode === 'single') return this.singleSelectedKey() === key;
		if (mode === 'multiple') return this.selectedKeys().has(key);
		return false;
	}

	private isSelectedAny(obj: T): boolean {
		const key = this.keyOf(obj);
		return this.singleSelectedKey() === key || this.selectedKeys().has(key);
	}

	private selectedIndexes(): number[] {
		const keys = this.selectedKeys();
		const indexes: number[] = [];
		this.config().data.forEach((obj, index) => {
			if (keys.has(this.keyOf(obj))) indexes.push(index);
		});
		return indexes;
	}

	protected ariaSortFor(index: number): 'ascending' | 'descending' | 'none' {
		if (this.currentSortColumn !== index || this.currentSortState === 'none') {
			return 'none';
		}
		return this.currentSortState === 'asc' ? 'ascending' : 'descending';
	}

	protected getClass(obj: T, prop: keyof T): string {
		const rules = this.config().classRules;
		if (!rules) return '';

		const classes: string[] = [];
		for (const rule of rules) {
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
		this.singleSelectedKey.update((current) =>
			current === key ? undefined : key,
		);
		this.action.emit({
			action: 'rowClick',
			obj,
			index,
			selected: this.isSelectedAny(obj),
			event,
		});
	}

	protected onRowKeydown(event: KeyboardEvent, obj: T, index: number): void {
		if (!this.config().selectableRows) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.onRowClick(event, obj, index);
		}
	}

	protected selectOption(option: string, obj: T, index: number): void {
		this.action.emit({
			action: option.toLowerCase(),
			obj,
			index,
			selected: this.isSelectedAny(obj),
		});
	}

	protected toggleSelectAll(event: MatCheckboxChange): void {
		const next = new Set<unknown>();
		if (event.checked) {
			for (const obj of this.config().data) {
				next.add(this.keyOf(obj));
			}
		}
		this.selectedKeys.set(next);

		this.action.emit({
			action: 'rowSelect',
			selectedRows: this.selectedIndexes(),
		});
	}

	protected toggleRowSelection(obj: T, index: number): void {
		if (this.config().selectableRows !== 'multiple') return;

		const key = this.keyOf(obj);
		const next = new Set(this.selectedKeys());
		if (next.has(key)) {
			next.delete(key);
		} else {
			next.add(key);
		}
		this.selectedKeys.set(next);

		this.action.emit({
			action: 'rowSelect',
			index,
			selectedRows: this.selectedIndexes(),
		});
	}

	protected onSort(index: number, prop: keyof T, sortState: SortState): void {
		this.currentSortColumn = index;
		this.currentSortState = sortState;
		this.action.emit({ action: 'sort', prop, sortState });
	}

	protected getOptionsForRow(obj: T): string[] {
		const options = this.config().options;
		if (!options) return [];
		return typeof options === 'function' ? options(obj) : options;
	}
}
