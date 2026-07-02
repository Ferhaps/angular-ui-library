import {
	Component,
	computed,
	input,
	output,
	signal,
	ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type SortState = 'none' | 'asc' | 'desc';

@Component({
	selector: 'lib-table-sort-header',
	imports: [MatIconModule],
	templateUrl: './table-sort-header.component.html',
	styleUrls: ['./table-sort-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSortHeaderComponent {
	public selected = input.required<boolean>();
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
