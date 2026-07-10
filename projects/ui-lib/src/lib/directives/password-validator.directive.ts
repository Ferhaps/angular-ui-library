import { Directive, effect, input } from '@angular/core';
import {
	AbstractControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

/**
 * Which password rules a value failed. Reported by
 * `PasswordValidatorDirective` under the `passwordInvalid` error key. A property
 * is present only when that rule failed; `minLength` carries the required
 * length. An empty object means the value passed every rule.
 */
export type PasswordErrors = {
	/** Present when too short; value is the required minimum length. */
	minLength?: number;
	/** Present when no uppercase letter was found. */
	uppercase?: boolean;
	/** Present when no lowercase letter was found. */
	lowercase?: boolean;
	/** Present when no digit was found. */
	digit?: boolean;
	/** Present when no character from `specialChars` was found. */
	special?: boolean;
};

/**
 * The full set of password requirements to check against. Shared by
 * `PasswordValidatorDirective` and `PasswordStrengthComponent` so the validator
 * and the meter stay in lockstep.
 */
export type PasswordRules = {
	/** Minimum number of characters. */
	minLength: number;
	/** Require at least one `A-Z` letter. */
	requireUppercase: boolean;
	/** Require at least one `a-z` letter. */
	requireLowercase: boolean;
	/** Require at least one digit. */
	requireDigit: boolean;
	/** Require at least one character from {@link specialChars}. */
	requireSpecial: boolean;
	/** The set of characters that count as "special". */
	specialChars: string;
};

/**
 * Pure engine behind the password validator and strength meter: checks `value`
 * against `rules` and returns the {@link PasswordErrors} that failed (empty when
 * the value satisfies every rule).
 */
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

/**
 * Template-driven / reactive form validator for password strength.
 *
 * Add `euiPasswordValidator` to an input and tune the rules via its inputs. On
 * failure it sets a single `passwordInvalid` error whose value is a
 * {@link PasswordErrors} object describing which rules failed. Changing any rule
 * input re-runs validation automatically. Empty values are treated as valid —
 * pair with `required` if the field is mandatory.
 *
 * @example
 * ```html
 * <input [(ngModel)]="password" euiPasswordValidator [minLength]="10" />
 * ```
 */
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
	/** Minimum length. Default `8`. */
	public minLength = input(8);
	/** Require an uppercase letter. Default `true`. */
	public requireUppercase = input(true);
	/** Require a lowercase letter. Default `true`. */
	public requireLowercase = input(true);
	/** Require a digit. Default `true`. */
	public requireDigit = input(true);
	/** Require a special character (see {@link specialChars}). Default `true`. */
	public requireSpecial = input(true);
	/** Characters that satisfy the "special" rule. Default `!@#$%^&*`. */
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
