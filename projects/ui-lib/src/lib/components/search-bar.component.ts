import {
	Component,
	output,
	input,
	ChangeDetectionStrategy,
	forwardRef,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'lib-search-bar',
	template: `
		<form class="search-bar" [formGroup]="searchForm">
			<mat-icon>search</mat-icon>
			<input
				class="search-input"
				type="search"
				name="field"
				[placeholder]="'Search ' + for()"
				autocomplete="off"
				formControlName="search"
			/>
		</form>
	`,
	styles: [
		`
			/* Theme-aware via Angular Material system variables, with fallbacks to
			   sensible neutral colors when no Material M3 theme is provided. */
			.search-bar {
				width: 270px;
				display: flex;
				align-items: center;
				gap: 2px;
				border: 1px solid var(--mat-sys-outline-variant, #cfcfcf);
				border-radius: 10px;
				background-color: var(--mat-sys-surface, #ffffff);
				color: var(--mat-sys-on-surface, #1c1b1f);
				transition:
					border-color 0.18s ease,
					box-shadow 0.18s ease,
					background-color 0.18s ease;
			}

			.search-bar:hover {
				border-color: var(--mat-sys-outline, #a4a4a4);
			}

			.search-bar:focus-within {
				border-color: var(--mat-sys-primary, #1976d2);
				box-shadow: 0 0 0 3px
					color-mix(in srgb, var(--mat-sys-primary, #1976d2) 20%, transparent);
			}

			.search-input {
				border: none;
				padding: 9px 12px 9px 2px;
				height: 100%;
				width: 100%;
				background-color: transparent;
				color: inherit;
				font: inherit;
				font-size: 14px;
			}

			.search-input::placeholder {
				color: var(--mat-sys-on-surface-variant, #8a8a8a);
			}

			.search-input:focus {
				border: none;
				outline: none;
			}

			.search-input::-webkit-search-cancel-button {
				cursor: pointer;
			}

			mat-icon {
				flex-shrink: 0;
				margin-inline: 10px 2px;
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}

			/* Disabled — theme-aware so it reads correctly in light and dark. */
			.search-bar:has(.search-input:disabled) {
				border-color: var(--mat-sys-outline-variant, #d4d4d4);
				background-color: var(--mat-sys-surface-container, #f5f5f5);
				box-shadow: none;
				cursor: not-allowed;
				opacity: 0.65;
			}

			.search-input:disabled {
				color: var(--mat-sys-on-surface-variant, #a4a4a4);
				cursor: not-allowed;
			}

			.search-bar:has(.search-input:disabled) mat-icon {
				color: var(--mat-sys-on-surface-variant, #a4a4a4);
			}

			@media (max-width: 1086px) {
				.search-bar {
					width: 170px;
				}
			}
		`,
	],
	imports: [MatIconModule, ReactiveFormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchBarComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements ControlValueAccessor {
	public for = input.required<string>();

	protected search = output<string | Event>();

	protected searchForm: FormGroup = new FormGroup({
		search: new FormControl(''),
	});

	private onChange: (value: string) => void = () => { };
	private onTouched: () => void = () => { };

	constructor() {
		this.searchForm
			.get('search')
			?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe((term: string) => {
				const trimmed = term.trim();
				this.onChange(trimmed); // notifies parent form control
				this.search.emit(trimmed); // existing output still works
			});
	}

	writeValue(value: string): void {
		this.searchForm.get('search')?.setValue(value ?? '', { emitEvent: false });
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.searchForm.disable() : this.searchForm.enable();
	}
}
