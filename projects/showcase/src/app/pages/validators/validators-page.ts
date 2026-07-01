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
    <input matInput formControlName="password" libPasswordValidator />
    <mat-error>Weak password</mat-error>
  </mat-form-field>

  <!-- granular failures for per-rule UI:
       control.errors?.passwordInvalid
       → { minLength?: 8, uppercase?, lowercase?, digit?, special? } -->

  <mat-form-field>
    <!-- re-validates automatically when 'password' changes -->
    <input matInput formControlName="confirm"
           libFieldsMatchValidator fieldToMatch="password" />
    <mat-error>Passwords do not match</mat-error>
  </mat-form-field>

  <mat-form-field>
    <input matInput formControlName="phone" libPhoneValidation />
  </mat-form-field>
</form>`;
}
