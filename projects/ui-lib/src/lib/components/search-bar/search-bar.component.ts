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
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.scss',
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

	private onChange: (value: string) => void = () => {};
	private onTouched: () => void = () => {};

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
