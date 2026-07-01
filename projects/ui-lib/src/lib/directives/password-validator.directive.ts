import { Directive, effect, input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

export type PasswordErrors = {
	minLength?: number;
	uppercase?: boolean;
	lowercase?: boolean;
	digit?: boolean;
	special?: boolean;
};

@Directive({
	selector: '[libPasswordValidator]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: PasswordValidatorDirective,
			multi: true,
		},
	],
})
export class PasswordValidatorDirective implements Validator {
	public minLength = input(8);
	public requireUppercase = input(true);
	public requireLowercase = input(true);
	public requireDigit = input(true);
	public requireSpecial = input(true);
	public specialChars = input('!@#$%^&*');

	private onValidatorChange: () => void = () => {};

	constructor() {
		effect(() => {
			this.minLength();
			this.requireUppercase();
			this.requireLowercase();
			this.requireDigit();
			this.requireSpecial();
			this.specialChars();
			this.onValidatorChange();
		});
	}

	public validate(control: AbstractControl): ValidationErrors | null {
		const value: string = control.value;

		if (!value) {
			return null;
		}

		const errors: PasswordErrors = {};

		if (value.length < this.minLength()) {
			errors.minLength = this.minLength();
		}
		if (this.requireUppercase() && !/[A-Z]/.test(value)) {
			errors.uppercase = true;
		}
		if (this.requireLowercase() && !/[a-z]/.test(value)) {
			errors.lowercase = true;
		}
		if (this.requireDigit() && !/\d/.test(value)) {
			errors.digit = true;
		}
		if (this.requireSpecial() && !this.hasSpecialChar(value)) {
			errors.special = true;
		}

		return Object.keys(errors).length > 0
			? { passwordInvalid: errors }
			: null;
	}

	public registerOnValidatorChange(fn: () => void): void {
		this.onValidatorChange = fn;
	}

	private hasSpecialChar(value: string): boolean {
		const specials = this.specialChars();
		for (const char of value) {
			if (specials.includes(char)) {
				return true;
			}
		}
		return false;
	}
}
