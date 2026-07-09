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

export type PasswordRules = {
	minLength: number;
	requireUppercase: boolean;
	requireLowercase: boolean;
	requireDigit: boolean;
	requireSpecial: boolean;
	specialChars: string;
};

export function validatePasswordRules(
	value: string,
	rules: PasswordRules,
): PasswordErrors {
	const errors: PasswordErrors = {};

	if (value.length < rules.minLength) {
		errors.minLength = rules.minLength;
	}
	if (rules.requireUppercase && !/[A-Z]/.test(value)) {
		errors.uppercase = true;
	}
	if (rules.requireLowercase && !/[a-z]/.test(value)) {
		errors.lowercase = true;
	}
	if (rules.requireDigit && !/\d/.test(value)) {
		errors.digit = true;
	}
	if (rules.requireSpecial && !hasSpecialChar(value, rules.specialChars)) {
		errors.special = true;
	}

	return errors;
}

function hasSpecialChar(value: string, specialChars: string): boolean {
	for (const char of value) {
		if (specialChars.includes(char)) {
			return true;
		}
	}
	return false;
}

@Directive({
	selector: '[euiPasswordValidator]',
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

		const errors = validatePasswordRules(value, {
			minLength: this.minLength(),
			requireUppercase: this.requireUppercase(),
			requireLowercase: this.requireLowercase(),
			requireDigit: this.requireDigit(),
			requireSpecial: this.requireSpecial(),
			specialChars: this.specialChars(),
		});

		return Object.keys(errors).length > 0
			? { passwordInvalid: errors }
			: null;
	}

	public registerOnValidatorChange(fn: () => void): void {
		this.onValidatorChange = fn;
	}
}
