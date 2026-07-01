import { Directive, OnDestroy, input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
	selector: '[libFieldsMatchValidator]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FieldsMatchValidatorDirective,
			multi: true,
		},
	],
})
export class FieldsMatchValidatorDirective implements Validator, OnDestroy {
	public fieldToMatch = input.required<string>();

	private control?: AbstractControl;
	private matchSub?: Subscription;

	public validate(control: AbstractControl): ValidationErrors | null {
		this.control = control;
		const matchingControl = control.root.get(this.fieldToMatch());

		if (matchingControl && !this.matchSub) {
			this.matchSub = matchingControl.valueChanges.subscribe(() => {
				this.control?.updateValueAndValidity({ emitEvent: false });
			});
		}

		const value = control.value;
		if (!value || !matchingControl) {
			return null;
		}

		return value !== matchingControl.value ? { mismatch: true } : null;
	}

	public ngOnDestroy(): void {
		this.matchSub?.unsubscribe();
	}
}
