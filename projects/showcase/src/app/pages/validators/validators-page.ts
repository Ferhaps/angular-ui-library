import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
	FieldsMatchValidatorDirective,
	PasswordErrors,
	PasswordValidatorDirective,
	PhoneValidationDirective,
} from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-validators-page',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		PasswordValidatorDirective,
		FieldsMatchValidatorDirective,
		PhoneValidationDirective,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './validators-page.html',
	styleUrl: './validators-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsPage {
	protected readonly form = new FormGroup({
		password: new FormControl('', { nonNullable: true }),
		confirm: new FormControl('', { nonNullable: true }),
		phone: new FormControl('', { nonNullable: true }),
	});

	protected get password(): FormControl<string> {
		return this.form.controls.password;
	}
	protected get confirm(): FormControl<string> {
		return this.form.controls.confirm;
	}
	protected get phone(): FormControl<string> {
		return this.form.controls.phone;
	}

	protected readonly passwordVisible = signal(false);

	protected togglePasswordVisibility(): void {
		this.passwordVisible.update((visible) => !visible);
	}

	protected readonly passwordErrors = toSignal(
		this.password.statusChanges.pipe(
			map(
				() =>
					(this.password.errors?.['passwordInvalid'] as PasswordErrors) ?? null,
			),
		),
		{ initialValue: null },
	);

	protected readonly snippet = `<form [formGroup]="form">
  <mat-form-field>
    <!-- rules are configurable: [minLength]="10", [requireSpecial]="false", … -->
    <input matInput formControlName="password" euiPasswordValidator />
    <mat-error>Weak password</mat-error>
  </mat-form-field>

  <!-- granular failures for per-rule UI: control.errors?.passwordInvalid →
	{ minLength?: 8, uppercase?, lowercase?, digit?, special? } -->

  <mat-form-field>
    <!-- re-validates automatically when 'password' changes -->
    <input matInput formControlName="confirm"
      euiFieldsMatchValidator fieldToMatch="password" />
    <mat-error>Passwords do not match</mat-error>
  </mat-form-field>

  <mat-form-field>
    <input matInput formControlName="phone" euiPhoneValidation />
  </mat-form-field>
</form>`;

	// These directives are for reactive / template-driven forms (NG_VALIDATORS /
	// ControlValueAccessor). Signal Forms validates in the schema instead, so the
	// same behaviour is expressed with built-in + custom validators — no directives.
	protected readonly signalFormsSnippet = `import {
  form, required, minLength, pattern, validate,
} from '@angular/forms/signals';

model = signal({ password: '', confirm: '', phone: '' });

f = form(this.model, (path) => {
  // Password strength → the directive's rules as built-in validators:
  required(path.password);
  minLength(path.password, 8, { message: 'At least 8 characters' });
  pattern(path.password, /[A-Z]/, { message: 'An uppercase letter' });
  pattern(path.password, /[a-z]/, { message: 'A lowercase letter' });
  pattern(path.password, /\\d/, { message: 'A number' });
  pattern(path.password, /[!@#$%^&*]/, { message: 'A special character' });

  // Fields match → cross-field validation via valueOf():
  validate(path.confirm, ({ value, valueOf }) =>
    value() === valueOf(path.password)
      ? null
      : { kind: 'mismatch', message: 'Passwords do not match' });

  // Phone → validate the "+digits" format. (Live formatting needs a custom
  // FormValueControl — Signal Forms has no CVA-style formatter directive.)
  pattern(path.phone, /^\\+[0-9]+$/, { message: 'A leading + and digits' });
});

// template — Signal Forms binds native inputs via [formField]:
<input type="password" [formField]="f.password" />
<input type="password" [formField]="f.confirm" />
<input [formField]="f.phone" />`;
}
