import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
	FieldsMatchValidatorDirective,
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

	constructor() {
		// Re-check the confirm field when the password it mirrors changes.
		this.password.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.confirm.updateValueAndValidity());
	}

	protected readonly snippet = `<form [formGroup]="form">
  <mat-form-field>
    <input matInput formControlName="password" libPasswordValidator />
    <mat-error>Weak password</mat-error>
  </mat-form-field>

  <mat-form-field>
    <input matInput formControlName="confirm"
           libFieldsMatchValidator fieldToMatch="password" />
    <mat-error>Passwords do not match</mat-error>
  </mat-form-field>

  <mat-form-field>
    <input matInput formControlName="phone" libPhoneValidation />
  </mat-form-field>
</form>`;
}
