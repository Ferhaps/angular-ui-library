import {
	Component,
	computed,
	input,
	output,
	signal,
	ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Sort direction of a column: unsorted, ascending or descending. */
export type SortState = 'none' | 'asc' | 'desc';

/**
 * A clickable, accessible column sort header used inside `TableComponent`.
 *
 * Clicking cycles the sort through `none -> desc -> asc -> none` and emits the
 * new {@link SortState} via `sort`. Normally you configure sorting through the
 * table's `Config` rather than using this directly.
 */
@Component({
	selector: 'eui-table-sort-header',
	imports: [MatIconModule],
	templateUrl: './table-sort-header.component.html',
	styleUrls: ['./table-sort-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSortHeaderComponent {
	/** Whether this column is the one currently driving the sort. */
	public selected = input.required<boolean>();
	/** Emits the new sort direction each time the header is activated. */
	public sort = output<SortState>();

	protected readonly sortState = signal<SortState>('none');

	protected readonly ariaLabel = computed(() => {
		switch (this.sortState()) {
			case 'none':
				return 'Sort descending';
			case 'desc':
				return 'Sort ascending';
			default:
				return 'Clear sort';
		}
	});

	protected onSortClick(): void {
		this.sortState.update((state) =>
			state === 'none' ? 'desc' : state === 'desc' ? 'asc' : 'none',
		);
		this.sort.emit(this.sortState());
	}
}
