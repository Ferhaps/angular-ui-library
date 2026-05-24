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
			.search-bar {
				width: 270px;
				border: 1px solid #a4a4a4;
				display: flex;
				align-items: center;
			}

			.search-input {
				border: none;
				padding: 7px 11px;
				height: 100%;
				width: 100%;
				background-color: transparent;
			}

			mat-icon {
				margin-inline: 8px;
			}

			.search-input:focus {
				border: none;
				outline: none;
			}

			.search-bar:has(.search-input:disabled) {
				border-color: #d4d4d4;
				background-color: #f5f5f5;
				cursor: not-allowed;
			}

			.search-input:disabled {
				color: #a4a4a4;
				cursor: not-allowed;
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
