import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { SearchBarComponent } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

const FRUITS = [
	'Apple',
	'Apricot',
	'Banana',
	'Blueberry',
	'Cherry',
	'Clementine',
	'Dragonfruit',
	'Grape',
	'Mango',
	'Orange',
	'Papaya',
	'Peach',
	'Pear',
	'Pineapple',
	'Raspberry',
	'Strawberry',
	'Watermelon',
];

@Component({
	selector: 'app-search-bar-page',
	imports: [
		ReactiveFormsModule,
		MatSlideToggleModule,
		MatChipsModule,
		SearchBarComponent,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './search-bar-page.html',
	styleUrl: './search-bar-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarPage {
	protected readonly searchCtrl = new FormControl('', { nonNullable: true });
	protected readonly term = signal('');
	protected readonly disabled = signal(false);

	protected readonly filtered = computed(() => {
		const q = this.term().toLowerCase();
		if (!q) {
			return FRUITS;
		}
		return FRUITS.filter((f) => f.toLowerCase().includes(q));
	});

	constructor() {
		this.searchCtrl.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((value) => this.term.set(value ?? ''));
	}

	protected toggleDisabled(): void {
		this.disabled.update((d) => !d);
		this.disabled() ? this.searchCtrl.disable() : this.searchCtrl.enable();
	}

	protected readonly snippet = `searchCtrl = new FormControl('', { nonNullable: true });

constructor() {
  // Emits the trimmed term 1s after typing stops (debounce + distinct).
  this.searchCtrl.valueChanges.subscribe((term) => this.filter(term));
}

// template
<lib-search-bar for="fruit" [formControl]="searchCtrl" />`;
}
