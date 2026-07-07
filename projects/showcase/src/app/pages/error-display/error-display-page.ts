import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorDisplayComponent, SystemError } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

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
	templateUrl: './error-display-page.html',
	styleUrl: './error-display-page.scss',
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
<eui-error-display [error]="'user_not_found'" />
<eui-error-display [error]="httpError" />        <!-- parses .error / .error.message -->
<eui-error-display [error]="undefined" />        <!-- 'Unknown error' -->`;
}
