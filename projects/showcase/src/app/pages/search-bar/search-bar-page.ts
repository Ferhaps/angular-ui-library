import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
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
		FormField,
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

	protected readonly sfModel = signal({ query: '' });
	protected readonly sfForm = form(this.sfModel);

	protected readonly filtered = computed(() => this.filterFruits(this.term()));
	protected readonly sfFiltered = computed(() =>
		this.filterFruits(this.sfModel().query),
	);

	private filterFruits(query: string): string[] {
		const q = query.trim().toLowerCase();
		return q ? FRUITS.filter((f) => f.toLowerCase().includes(q)) : FRUITS;
	}

	constructor() {
		this.searchCtrl.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((value) => this.term.set(value ?? ''));
	}

	protected toggleDisabled(): void {
		this.disabled.update((d) => !d);
		this.disabled() ? this.searchCtrl.disable() : this.searchCtrl.enable();
	}

	protected readonly reactiveSnippet = `searchCtrl = new FormControl('', { nonNullable: true });

constructor() {
  // Emits the trimmed term after typing stops (debounce + distinct).
  this.searchCtrl.valueChanges.subscribe((term) => this.filter(term));
}

// template — debounce defaults to 300ms, override with [debounceMs]
<eui-search-bar for="fruit" [formControl]="searchCtrl" [debounceMs]="500" />`;

	protected readonly templateDrivenSnippet = `// component
tdTerm = '';

// template — binds with [(ngModel)] like any native input
<eui-search-bar for="fruit" [(ngModel)]="tdTerm" [debounceMs]="500" />`;

	protected readonly signalFormsSnippet = `import { form } from '@angular/forms/signals';

model = signal({ query: '' });
f = form(this.model);

// template — signal forms bind via [formField]
<eui-search-bar for="fruit" [formField]="f.query" />`;
}
