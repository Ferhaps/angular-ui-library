import {
	Directive,
	ElementRef,
	forwardRef,
	inject,
	Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
	selector: '[euiPhoneValidation]',
	host: {
		'(input)': 'onInput($event)',
		'(keydown)': 'onKeyDown($event)',
		'(blur)': 'onTouched()',
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PhoneValidationDirective),
			multi: true,
		},
	],
})
export class PhoneValidationDirective implements ControlValueAccessor {
	private renderer = inject(Renderer2);
	private elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	private onChange: (value: string) => void = () => {};
	protected onTouched: () => void = () => {};

	protected onInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const formatted = this.format(input.value);
		if (formatted !== input.value) {
			this.renderer.setProperty(input, 'value', formatted);
		}
		this.onChange(formatted);
	}

	protected onKeyDown(event: KeyboardEvent): void {
		const inputValue = (event.target as HTMLInputElement).value;
		if (event.key === 'Backspace' && inputValue === '+') {
			event.preventDefault();
		}
	}

	public writeValue(value: string): void {
		const next = value ? this.format(value) : '';
		this.renderer.setProperty(this.elementRef.nativeElement, 'value', next);
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.renderer.setProperty(
			this.elementRef.nativeElement,
			'disabled',
			isDisabled,
		);
	}

	private format(value: string): string {
		let formatted = value;

		// Ensure the value always carries a leading plus sign.
		if (!formatted.includes('+')) {
			formatted = `+${formatted}`;
		}

		// Only allow digits and the plus sign.
		if (!/^[0-9+]*$/.test(formatted)) {
			formatted = formatted.replace(/[^0-9+]/g, '');
		}

		return formatted;
	}
}
