import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import {
	BLOB_HTTP_OPTIONS,
	HTTP_STATUS_CODES,
	JSON_HTTP_OPTIONS,
	JSON_OPTIONS_WITH_GLOBAL_LOADER,
	SKIP_ERROR_OPTIONS,
	STRING_HTTP_OPTIONS,
	withAcceptLanguage,
} from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-utils-page',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatChipsModule,
		MatExpansionModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './utils-page.html',
	styleUrl: './utils-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilsPage {
	protected readonly code = signal('404');
	protected readonly statusName = computed(
		() => HTTP_STATUS_CODES[this.code()] ?? 'Unknown code',
	);

	protected readonly commonCodes = [
		'200',
		'201',
		'400',
		'401',
		'403',
		'404',
		'422',
		'500',
		'503',
	];

	protected readonly presets = [
		{
			name: 'JSON_HTTP_OPTIONS',
			note: 'standard JSON request',
			json: this.pretty(JSON_HTTP_OPTIONS),
		},
		{
			name: 'STRING_HTTP_OPTIONS',
			note: 'text/plain response',
			json: this.pretty(STRING_HTTP_OPTIONS),
		},
		{
			name: 'BLOB_HTTP_OPTIONS',
			note: 'binary download',
			json: this.pretty(BLOB_HTTP_OPTIONS),
		},
		{
			name: 'SKIP_ERROR_OPTIONS',
			note: 'X-Skip-Error → bypass the global error popup',
			json: this.pretty(SKIP_ERROR_OPTIONS),
		},
		{
			name: 'JSON_OPTIONS_WITH_GLOBAL_LOADER',
			note: 'X-Global-Loader → show the global spinner',
			json: this.pretty(JSON_OPTIONS_WITH_GLOBAL_LOADER),
		},
	];

	protected readonly languages = ['en-US', 'fr-FR', 'de-DE', 'tr-TR'];
	protected readonly language = signal('fr-FR');
	protected readonly localizedJson = computed(() =>
		this.pretty(withAcceptLanguage(JSON_HTTP_OPTIONS, this.language())),
	);

	protected onLanguage(event: MatChipListboxChange): void {
		if (typeof event.value === 'string') {
			this.language.set(event.value);
		}
	}

	private pretty(value: unknown): string {
		return JSON.stringify(value, null, 2);
	}

	protected readonly snippet = `import {
  HTTP_STATUS_CODES,
  JSON_HTTP_OPTIONS,
  SKIP_ERROR_OPTIONS,
  withAcceptLanguage,
} from '@ferhaps/easy-ui-lib';

HTTP_STATUS_CODES[404];                         // 'Not Found'

this.http.get('/api/me', JSON_HTTP_OPTIONS);    // Accept: application/json
this.http.get('/api/me', SKIP_ERROR_OPTIONS);   // adds X-Skip-Error: true

withAcceptLanguage(JSON_HTTP_OPTIONS, 'fr-FR'); // + Accept-Language: fr-FR`;
}
