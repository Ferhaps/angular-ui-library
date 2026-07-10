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

/**
 * The single event emitted by `TableComponent` for every interaction. Inspect
 * {@link action} to know what happened; the other fields are populated as
 * relevant to that action.
 */
export type TableEvent<T = unknown> = {
	/**
	 * What happened. Built-in actions:
	 * - `rowClick` — a row was clicked/activated
	 * - `rowSelect` — checkbox selection changed (see {@link selectedRows})
	 * - `drag` — a row was dragged to a new position
	 * - `scroll` / `scrolled` — the body scrolled / reached the bottom
	 * - `sort` — a column's sort changed (see {@link prop}, {@link sortState})
	 * - `add` — the header add button was pressed
	 *
	 * A custom row option emits its own label lower-cased (e.g. `'edit'`).
	 */
	action:
		| 'rowClick'
		| 'rowSelect'
		| 'drag'
		| 'scroll'
		| 'scrolled'
		| 'sort'
		| 'add'
		| (string & {}); // Custom option actions
	/** The row the action targeted, when applicable. */
	obj?: T;
	/** The column key involved (e.g. for `sort`). */
	prop?: keyof T;
	/** Index of {@link obj} in the current `data` order. */
	index?: number;
	/** Whether the target row is currently selected. */
	selected?: boolean;
	/** Indices (into current `data`) of all selected rows, for `rowSelect`. */
	selectedRows?: number[];
	/** New sort direction, for `sort`. */
	sortState?: SortState;
	/** The originating DOM event, when one exists. */
	event?: Event;
};

/**
 * Declarative configuration for `TableComponent`. Everything the table renders
 * and every behaviour it enables is driven by this object — pass it via the
 * `config` input.
 */
export type Config<T = unknown> = {
	/** The rows to render. */
	data: T[];
	/** Table title shown in the header. */
	title: string;
	/** Object keys to render as columns, in order. */
	dataProps: (keyof T)[];
	/** Column header labels; defaults to the {@link dataProps} keys. */
	tableHeadings?: string[];
	/**
	 * Per-row action menu. A static list, or a function returning the options
	 * for a given row. Each selection emits a `TableEvent` with its lower-cased
	 * label as the action.
	 */
	options?: string[] | ((obj: T) => string[]);
	/** Show a header "add" button that emits the `add` action. */
	withAdd?: boolean;
	/** Enable row selection — a single row, or many via checkboxes. */
	selectableRows?: 'single' | 'multiple';
	/** Enable clickable sort headers. */
	sortable?: boolean;
	/** Enable drag-and-drop row reordering (mutates {@link data} in place). */
	draggable?: boolean;
	/** Conditionally apply CSS classes to cells; see {@link ClassRule}. */
	classRules?: ClassRule<T>[];
	/**
	 * Identity function for a row (defaults to the row object reference). Drives
	 * selection tracking so it survives reordering — return a stable key.
	 */
	trackBy?: (obj: T) => unknown;
	/** Show a loading spinner instead of rows. */
	loading?: boolean;
	/** Message shown when {@link data} is empty. */
	emptyMessage?: string;
};

/** A conditional CSS class applied to a cell when {@link condition} holds. */
export type ClassRule<T = unknown> = {
	/** Class name to add to the cell. */
	className: string;
	/** Receives the row and the cell's column key; return `true` to apply. */
	condition: (obj: T, prop: keyof T) => boolean;
};

/**
 * Generic, config-driven data table.
 *
 * All rendering and behaviour — columns, sorting, drag-drop reordering, single
 * or multiple row selection, per-row option menus, conditional cell classes,
 * loading and empty states — is declared through a single {@link Config} object
 * bound to the `config` input. Every interaction is reported through one typed
 * `action` output ({@link TableEvent}). Rows, headers and menus are
 * keyboard-accessible, and selection is keyed by row identity (see
 * {@link Config.trackBy}) so it survives reordering.
 *
 * @typeParam T - The row model type.
 * @example
 * ```html
 * <eui-table [config]="config" (action)="onAction($event)" />
 * ```
 */
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
	/** The table's declarative configuration. See {@link Config}. */
	public config = input.required<Config<T>>();

	/** Emits once per user interaction. See {@link TableEvent}. */
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
