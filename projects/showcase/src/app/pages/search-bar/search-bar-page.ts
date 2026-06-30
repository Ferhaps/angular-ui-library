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
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

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
	template: `
		<app-page-heading
			title="Search Bar"
			kind="Component · SearchBarComponent"
			lead="A debounced search input implemented as a ControlValueAccessor.
			Wire it to a reactive form control like any native input — it emits the
			trimmed term 1s after typing stops, de-duplicated."
		/>

		<app-demo-card
			heading="Reactive form control"
			hint="emits 1s after you stop typing"
		>
			<div class="row">
				<lib-search-bar for="fruit" [formControl]="searchCtrl" />
				<mat-slide-toggle [checked]="disabled()" (change)="toggleDisabled()">
					Disabled
				</mat-slide-toggle>
			</div>

			<dl class="readout">
				<dt>Control value</dt>
				<dd class="mono">{{ term() ? '"' + term() + '"' : '—' }}</dd>
				<dt>Status</dt>
				<dd class="mono">{{ disabled() ? 'DISABLED' : 'VALID' }}</dd>
			</dl>
		</app-demo-card>

		<app-demo-card
			heading="Live filtering"
			hint="{{ filtered().length }} match(es)"
		>
			@if (filtered().length) {
				<mat-chip-set>
					@for (fruit of filtered(); track fruit) {
						<mat-chip disableRipple>{{ fruit }}</mat-chip>
					}
				</mat-chip-set>
			} @else {
				<p class="muted">No fruit matches “{{ term() }}”.</p>
			}
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.row {
				display: flex;
				align-items: center;
				gap: 1.5rem;
				flex-wrap: wrap;
				margin-bottom: 1rem;
			}
			.readout {
				display: grid;
				grid-template-columns: auto 1fr;
				gap: 0.25rem 1rem;
				margin: 0;
			}
			.readout dt {
				font-weight: 500;
			}
			.readout dd {
				margin: 0;
			}
		`,
	],
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
