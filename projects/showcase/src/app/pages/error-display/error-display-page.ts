import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorDisplayComponent, SystemError } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

type Example = { label: string; input: string; error: SystemError };

@Component({
	selector: 'app-error-display-page',
	imports: [
		ErrorDisplayComponent,
		MatChipsModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	template: `
		<app-page-heading
			title="Error Display"
			kind="Component · ErrorDisplayComponent"
			lead="Takes a SystemError — a string, an HttpErrorResponse, or
			undefined — and renders a friendly, human-readable message. The text is
			run through the SnakeCaseParser pipe, so snake_case codes become real
			sentences."
		/>

		<app-demo-card heading="Every SystemError shape">
			<div class="grid">
				@for (ex of examples; track ex.label) {
					<div class="example">
						<div class="meta">
							<mat-chip-set>
								<mat-chip disableRipple>{{ ex.label }}</mat-chip>
							</mat-chip-set>
							<code class="mono">{{ ex.input }}</code>
						</div>
						<lib-error-display [error]="ex.error" />
					</div>
				}
			</div>
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
				gap: 1.25rem;
				align-items: start;
			}
			.example {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
			.meta {
				display: flex;
				flex-direction: column;
				gap: 0.3rem;
			}
			.tag {
				font-size: 0.7rem;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
			.meta code {
				font-size: 0.78rem;
				word-break: break-word;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplayPage {
	protected readonly examples: Example[] = [
		{
			label: 'string',
			input: `'user_not_found'`,
			error: 'user_not_found',
		},
		{
			label: 'HttpErrorResponse · string body',
			input: `new HttpErrorResponse({ error: 'invalid_credentials' })`,
			error: new HttpErrorResponse({
				status: 401,
				error: 'invalid_credentials',
			}),
		},
		{
			label: 'HttpErrorResponse · { message }',
			input: `error: { message: 'Email already taken' }`,
			error: new HttpErrorResponse({
				status: 422,
				error: { message: 'Email already taken' },
			}),
		},
		{
			label: 'undefined',
			input: `undefined`,
			error: undefined,
		},
	];

	protected readonly snippet = `// SystemError = HttpErrorResponse | string | undefined
<lib-error-display [error]="'user_not_found'" />
<lib-error-display [error]="httpError" />        <!-- parses .error / .error.message -->
<lib-error-display [error]="undefined" />        <!-- 'Unknown error' -->`;
}
