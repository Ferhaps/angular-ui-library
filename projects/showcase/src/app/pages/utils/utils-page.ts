import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
	MatChipListboxChange,
	MatChipsModule,
} from '@angular/material/chips';
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
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

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
	template: `
		<app-page-heading
			title="HTTP Utils"
			kind="Utilities · utils.ts"
			lead="Plain helpers for HTTP work: a status-code map, ready-made request
			option presets (including the X-Skip-Error and X-Global-Loader header
			conventions the error/loader systems key off) and an Accept-Language
			helper."
		/>

		<app-demo-card heading="HTTP_STATUS_CODES lookup">
			<mat-form-field appearance="outline" class="code-field">
				<mat-label>Status code</mat-label>
				<input
					matInput
					type="number"
					[value]="code()"
					(input)="code.set($any($event.target).value)"
				/>
			</mat-form-field>
			<p class="result">
				<code class="mono">HTTP_STATUS_CODES[{{ code() || '—' }}]</code>
				<span class="arrow">→</span>
				<strong>{{ statusName() }}</strong>
			</p>
			<mat-chip-set aria-label="Common status codes">
				@for (c of commonCodes; track c) {
					<mat-chip (click)="code.set(c)">{{ c }}</mat-chip>
				}
			</mat-chip-set>
		</app-demo-card>

		<app-demo-card heading="Request option presets">
			<mat-accordion>
				@for (preset of presets; track preset.name) {
					<mat-expansion-panel>
						<mat-expansion-panel-header>
							<mat-panel-title>
								<code class="mono">{{ preset.name }}</code>
							</mat-panel-title>
							<mat-panel-description>{{ preset.note }}</mat-panel-description>
						</mat-expansion-panel-header>
						<pre class="json mono">{{ preset.json }}</pre>
					</mat-expansion-panel>
				}
			</mat-accordion>
		</app-demo-card>

		<app-demo-card heading="withAcceptLanguage(options, language)">
			<mat-chip-listbox
				[value]="language()"
				(change)="onLanguage($event)"
				aria-label="Accept-Language"
			>
				@for (lang of languages; track lang) {
					<mat-chip-option [value]="lang">{{ lang }}</mat-chip-option>
				}
			</mat-chip-listbox>
			<pre class="json mono">{{ localizedJson() }}</pre>
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.code-field {
				width: 160px;
			}
			.result {
				display: flex;
				align-items: center;
				gap: 0.6rem;
				flex-wrap: wrap;
				margin: 0.25rem 0 1rem;
				font-size: 1.05rem;
			}
			.arrow {
				color: var(--mat-sys-on-surface-variant);
			}
			.json {
				margin: 0.75rem 0 0;
				padding: 0.75rem 0.9rem;
				background: var(--mat-sys-surface-container-high);
				border-radius: 10px;
				font-size: 0.82rem;
				overflow-x: auto;
			}
			mat-expansion-panel .json {
				margin-top: 0;
			}
		`,
	],
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
