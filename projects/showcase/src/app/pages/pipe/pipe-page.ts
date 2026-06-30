import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SnakeCaseParserPipe } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/page-heading';
import { DemoCard } from '../../shared/demo-card';
import { CodeBlock } from '../../shared/code-block';

@Component({
	selector: 'app-pipe-page',
	imports: [SnakeCaseParserPipe, PageHeading, DemoCard, CodeBlock],
	template: `
		<app-page-heading
			title="Snake Case Parser"
			kind="Pipe · snakeCaseParser"
			lead="Turns snake_case (or SCREAMING_SNAKE_CASE) tokens into a readable
			label: underscores become spaces, the first letter is capitalised and the
			rest lower-cased. Handy for rendering API enum values and error codes."
		/>

		<app-demo-card heading="Try it live">
			<label class="field">
				<span class="muted">Input</span>
				<input
					[value]="value()"
					(input)="value.set($any($event.target).value)"
					placeholder="e.g. payment_failed"
				/>
			</label>
			<div class="result">
				<span class="arrow">→</span>
				<strong>{{ value() | snakeCaseParser }}</strong>
			</div>
		</app-demo-card>

		<app-demo-card heading="Examples">
			<table class="examples">
				<thead>
					<tr>
						<th>Input</th>
						<th>Output</th>
					</tr>
				</thead>
				<tbody>
					@for (sample of samples; track sample) {
						<tr>
							<td class="mono">{{ sample }}</td>
							<td>{{ sample | snakeCaseParser }}</td>
						</tr>
					}
				</tbody>
			</table>
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.field {
				display: flex;
				flex-direction: column;
				gap: 0.3rem;
				max-width: 360px;
			}
			.field input {
				padding: 0.6rem 0.75rem;
				border: 1px solid var(--mat-sys-outline, #79747e);
				border-radius: 10px;
				font: inherit;
			}
			.result {
				display: flex;
				align-items: center;
				gap: 0.6rem;
				margin-top: 1rem;
				font-size: 1.25rem;
			}
			.arrow {
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
			.examples {
				width: 100%;
				border-collapse: collapse;
			}
			.examples th,
			.examples td {
				text-align: left;
				padding: 0.5rem 0.75rem;
				border-bottom: 1px solid var(--mat-sys-outline-variant, #e3e1e6);
			}
			.examples th {
				font-size: 0.75rem;
				text-transform: uppercase;
				letter-spacing: 0.04em;
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipePage {
	protected readonly value = signal('payment_failed');

	protected readonly samples = [
		'user_not_found',
		'EMAIL_ALREADY_TAKEN',
		'pending_approval',
		'two_factor_enabled',
	];

	protected readonly snippet = `{{ 'payment_failed' | snakeCaseParser }}  <!-- Payment failed -->
{{ status | snakeCaseParser }}            <!-- e.g. 'Pending approval' -->`;
}
