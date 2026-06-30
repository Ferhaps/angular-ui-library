import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
	FieldsMatchValidatorDirective,
	PasswordValidatorDirective,
	PhoneValidationDirective,
} from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/page-heading';
import { DemoCard } from '../../shared/demo-card';
import { CodeBlock } from '../../shared/code-block';

@Component({
	selector: 'app-validators-page',
	imports: [
		ReactiveFormsModule,
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
			one is a ControlValueAccessor that live-formats phone numbers."
		/>

		<form [formGroup]="form">
			<app-demo-card heading="Password strength" hint="libPasswordValidator">
				<label class="field">
					<input
						type="password"
						formControlName="password"
						libPasswordValidator
						placeholder="Enter a password"
					/>
				</label>
				@if (password.value) {
					@if (password.errors?.['passwordInvalid']) {
						<p class="msg error">
							<mat-icon>error</mat-icon> Does not meet the requirements.
						</p>
					} @else {
						<p class="msg ok">
							<mat-icon>check_circle</mat-icon> Strong password.
						</p>
					}
				}
				<ul class="rules muted">
					<li>At least 8 characters</li>
					<li>Upper &amp; lower case letters</li>
					<li>A number and a special character (!&#64;#$%^&amp;*)</li>
				</ul>
			</app-demo-card>

			<app-demo-card heading="Fields match" hint="libFieldsMatchValidator">
				<label class="field">
					<input
						type="password"
						formControlName="confirm"
						libFieldsMatchValidator
						fieldToMatch="password"
						placeholder="Confirm the password above"
					/>
				</label>
				@if (confirm.value) {
					@if (confirm.errors?.['mismatch']) {
						<p class="msg error">
							<mat-icon>error</mat-icon> Passwords do not match.
						</p>
					} @else {
						<p class="msg ok"><mat-icon>check_circle</mat-icon> Matches.</p>
					}
				}
			</app-demo-card>

			<app-demo-card heading="Phone formatting" hint="libPhoneValidation (CVA)">
				<label class="field">
					<input
						formControlName="phone"
						libPhoneValidation
						placeholder="Start typing digits…"
					/>
				</label>
				<p class="readout">
					Control value:
					<code class="mono">{{ phone.value ? '"' + phone.value + '"' : '—' }}</code>
				</p>
				<p class="muted hint">
					A leading <code>+</code> is enforced and every non-digit is stripped
					as you type.
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
				display: block;
				max-width: 360px;
			}
			.field input {
				width: 100%;
				padding: 0.6rem 0.75rem;
				border: 1px solid var(--mat-sys-outline, #79747e);
				border-radius: 10px;
				font: inherit;
			}
			.msg {
				display: flex;
				align-items: center;
				gap: 0.35rem;
				margin: 0.6rem 0 0;
				font-size: 0.9rem;
			}
			.msg mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
			.msg.error {
				color: #b00020;
			}
			.msg.ok {
				color: #1b5e20;
			}
			.rules {
				margin: 0.75rem 0 0;
				padding-left: 1.1rem;
				font-size: 0.85rem;
			}
			.readout {
				margin: 0.75rem 0 0.25rem;
			}
			.hint {
				margin: 0;
				font-size: 0.85rem;
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
  <input formControlName="password" libPasswordValidator />

  <input
    formControlName="confirm"
    libFieldsMatchValidator
    fieldToMatch="password"
  />

  <input formControlName="phone" libPhoneValidation />
</form>

// errors surface as control.errors:
//   { passwordInvalid: true }  ·  { mismatch: true }`;
}
