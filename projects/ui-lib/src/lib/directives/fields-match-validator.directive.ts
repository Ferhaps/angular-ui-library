import { Directive, OnDestroy, input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Cross-field validator that fails when this control's value differs from
 * another control's — e.g. a "confirm password" field.
 *
 * Point {@link fieldToMatch} at the sibling control's name (resolved from the
 * form root). On mismatch it sets a `mismatch: true` error on this control. It
 * subscribes to the mirrored control and re-validates automatically when that
 * control changes, so the error clears/appears without the user re-typing here.
 *
 * @example
 * ```html
 * <input formControlName="confirm" euiFieldsMatchValidator fieldToMatch="password" />
 * ```
 */
@Directive({
	selector: '[euiFieldsMatchValidator]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: FieldsMatchValidatorDirective,
			multi: true,
		},
	],
})
export class FieldsMatchValidatorDirective implements Validator, OnDestroy {
	/** Name of the control (within the same form) whose value must match. */
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
