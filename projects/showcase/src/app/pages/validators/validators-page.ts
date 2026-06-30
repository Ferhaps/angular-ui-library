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
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

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
	template: `
		<app-page-heading
			title="Form Directives"
			kind="Directives · password · fields-match · phone"
			lead="Three attribute directives that plug straight into reactive forms:
			two register with NG_VALIDATORS (password strength, field matching) and
			one is a ControlValueAccessor that live-formats phone numbers. Here they
			sit inside Material form fields with mat-error / mat-hint."
		/>

		<form [formGroup]="form">
			<app-demo-card heading="Password strength" hint="libPasswordValidator">
				<mat-form-field appearance="outline" class="field">
					<mat-label>Password</mat-label>
					<input
						matInput
						type="password"
						formControlName="password"
						libPasswordValidator
						autocomplete="new-password"
					/>
					<mat-icon matSuffix>lock</mat-icon>
					<mat-hint>8+ chars, upper &amp; lower, a number and a special char</mat-hint>
					<mat-error>Does not meet the requirements.</mat-error>
				</mat-form-field>
				@if (password.value && password.valid) {
					<p class="msg ok"><mat-icon>check_circle</mat-icon> Strong password.</p>
				}
			</app-demo-card>

			<app-demo-card heading="Fields match" hint="libFieldsMatchValidator">
				<mat-form-field appearance="outline" class="field">
					<mat-label>Confirm password</mat-label>
					<input
						matInput
						type="password"
						formControlName="confirm"
						libFieldsMatchValidator
						fieldToMatch="password"
						autocomplete="new-password"
					/>
					<mat-icon matSuffix>done_all</mat-icon>
					<mat-error>Passwords do not match.</mat-error>
				</mat-form-field>
				@if (confirm.value && confirm.valid) {
					<p class="msg ok"><mat-icon>check_circle</mat-icon> Matches.</p>
				}
			</app-demo-card>

			<app-demo-card heading="Phone formatting" hint="libPhoneValidation (CVA)">
				<mat-form-field appearance="outline" class="field">
					<mat-label>Phone number</mat-label>
					<input
						matInput
						formControlName="phone"
						libPhoneValidation
						inputmode="tel"
						placeholder="Start typing digits…"
					/>
					<mat-icon matPrefix>call</mat-icon>
					<mat-hint>A leading + is enforced; non-digits are stripped.</mat-hint>
				</mat-form-field>
				<p class="readout">
					Control value:
					<code class="mono">{{ phone.value ? '"' + phone.value + '"' : '—' }}</code>
				</p>
			</app-demo-card>
		</form>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.field {
				width: 100%;
				max-width: 360px;
			}
			.msg {
				display: flex;
				align-items: center;
				gap: 0.35rem;
				margin: 0.25rem 0 0;
				font-size: 0.9rem;
				color: light-dark(#1b5e20, #81c784);
			}
			.msg mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
			.readout {
				margin: 0.25rem 0 0;
			}
		`,
	],
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
