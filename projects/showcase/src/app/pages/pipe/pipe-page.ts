import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnakeCaseParserPipe } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-pipe-page',
	imports: [
		SnakeCaseParserPipe,
		MatFormFieldModule,
		MatInputModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './pipe-page.html',
	styleUrl: './pipe-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipePage {
	protected readonly value = signal('payment_failed');

	protected readonly samples = [
		'user_not_found',
		'EMAIL_ALREADY_TAKEN',
		'pending_approval',
		'user_API_key',
		'HTTP_status_code',
	];

	protected readonly snippet = `{{ 'payment_failed' | snakeCaseParser }}      <!-- Payment failed -->
{{ 'EMAIL_ALREADY_TAKEN' | snakeCaseParser }} <!-- Email already taken -->
{{ 'user_API_key' | snakeCaseParser }}        <!-- User API key (acronym kept) -->`;
}
