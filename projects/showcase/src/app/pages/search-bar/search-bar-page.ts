import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SearchBarComponent } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/page-heading';
import { DemoCard } from '../../shared/demo-card';
import { CodeBlock } from '../../shared/code-block';

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
		MatButtonModule,
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
				<button mat-stroked-button type="button" (click)="toggleDisabled()">
					{{ disabled() ? 'Enable' : 'Disable' }}
				</button>
			</div>

			<dl class="readout">
				<dt>Control value</dt>
				<dd class="mono">{{ term() ? '"' + term() + '"' : '—' }}</dd>
				<dt>Status</dt>
				<dd class="mono">{{ disabled() ? 'DISABLED' : 'VALID' }}</dd>
			</dl>
		</app-demo-card>

		<app-demo-card heading="Live filtering" hint="{{ filtered().length }} match(es)">
			<ul class="chips">
				@for (fruit of filtered(); track fruit) {
					<li>{{ fruit }}</li>
				} @empty {
					<li class="muted none">No fruit matches “{{ term() }}”.</li>
				}
			</ul>
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
				gap: 1rem;
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
			.chips {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			}
			.chips li {
				padding: 0.3rem 0.7rem;
				border-radius: 999px;
				background: var(--mat-sys-secondary-container, #e8def8);
				color: var(--mat-sys-on-secondary-container, #1d192b);
				font-size: 0.85rem;
			}
			.chips li.none {
				background: transparent;
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
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
