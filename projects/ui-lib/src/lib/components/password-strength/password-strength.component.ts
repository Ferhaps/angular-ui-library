import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
	PasswordRules,
	validatePasswordRules,
} from '../../directives/password-validator.directive';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

type ChecklistItem = {
	label: string;
	passed: boolean;
};

const LEVEL_LABELS: Record<PasswordStrengthLevel, string> = {
	weak: 'Weak',
	fair: 'Fair',
	good: 'Good',
	strong: 'Strong',
};

@Component({
	selector: 'eui-password-strength',
	imports: [MatIconModule, MatProgressBarModule],
	templateUrl: './password-strength.component.html',
	styleUrls: ['./password-strength.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
	/** The current password value (bind your control/model value here). */
	public value = input.required<string | null | undefined>();

	// Rule inputs mirror PasswordValidatorDirective (same defaults), so the
	// meter and the validator stay in lockstep when configured identically.
	public minLength = input(8);
	public requireUppercase = input(true);
	public requireLowercase = input(true);
	public requireDigit = input(true);
	public requireSpecial = input(true);
	public specialChars = input('!@#$%^&*');

	private rules = computed<PasswordRules>(() => ({
		minLength: this.minLength(),
		requireUppercase: this.requireUppercase(),
		requireLowercase: this.requireLowercase(),
		requireDigit: this.requireDigit(),
		requireSpecial: this.requireSpecial(),
		specialChars: this.specialChars(),
	}));

	protected checklist = computed<ChecklistItem[]>(() => {
		const rules = this.rules();
		const failed = validatePasswordRules(this.value() ?? '', rules);

		const items: ChecklistItem[] = [
			{
				label: `At least ${rules.minLength} characters`,
				passed: !failed.minLength,
			},
		];
		if (rules.requireUppercase) {
			items.push({ label: 'An uppercase letter', passed: !failed.uppercase });
		}
		if (rules.requireLowercase) {
			items.push({ label: 'A lowercase letter', passed: !failed.lowercase });
		}
		if (rules.requireDigit) {
			items.push({ label: 'A number', passed: !failed.digit });
		}
		if (rules.requireSpecial) {
			items.push({
				label: `A special character (${rules.specialChars})`,
				passed: !failed.special,
			});
		}

		return items;
	});

	protected strength = computed<number>(() => {
		const items = this.checklist();
		const passed = items.filter((item) => item.passed).length;
		return Math.round((passed / items.length) * 100);
	});

	protected level = computed<PasswordStrengthLevel>(() => {
		const strength = this.strength();
		if (strength >= 100) {
			return 'strong';
		}
		if (strength >= 70) {
			return 'good';
		}
		if (strength >= 40) {
			return 'fair';
		}
		return 'weak';
	});

	protected strengthLabel = computed(() => LEVEL_LABELS[this.level()]);
}
