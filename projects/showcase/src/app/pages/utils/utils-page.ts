import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import {
	BLOB_HTTP_OPTIONS,
	HTTP_STATUS_CODES,
	JSON_HTTP_OPTIONS,
	JSON_OPTIONS_WITH_GLOBAL_LOADER,
	SKIP_ERROR_OPTIONS,
	STRING_HTTP_OPTIONS,
	withAcceptLanguage,
} from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/page-heading';
import { DemoCard } from '../../shared/demo-card';
import { CodeBlock } from '../../shared/code-block';

@Component({
	selector: 'app-utils-page',
	imports: [PageHeading, DemoCard, CodeBlock],
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
			<label class="field">
				<span class="muted">Status code</span>
				<input
					type="number"
					[value]="code()"
					(input)="code.set($any($event.target).value)"
				/>
			</label>
			<p class="result">
				<code class="mono">HTTP_STATUS_CODES[{{ code() || '—' }}]</code>
				<span class="arrow">→</span>
				<strong>{{ statusName() }}</strong>
			</p>
			<div class="codes">
				@for (c of commonCodes; track c) {
					<button type="button" class="code-chip" (click)="code.set(c)">
						{{ c }}
					</button>
				}
			</div>
		</app-demo-card>

		<app-demo-card heading="Request option presets">
			<div class="presets">
				@for (preset of presets; track preset.name) {
					<div class="preset">
						<div class="preset-head">
							<code class="mono name">{{ preset.name }}</code>
							@if (preset.note) {
								<span class="muted note">{{ preset.note }}</span>
							}
						</div>
						<pre class="json mono">{{ preset.json }}</pre>
					</div>
				}
			</div>
		</app-demo-card>

		<app-demo-card heading="withAcceptLanguage(options, language)">
			<div class="langs">
				@for (lang of languages; track lang) {
					<button
						type="button"
						class="code-chip"
						[class.active]="lang === language()"
						(click)="language.set(lang)"
					>
						{{ lang }}
					</button>
				}
			</div>
			<pre class="json mono">{{ localizedJson() }}</pre>
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
				max-width: 200px;
			}
			.field input {
				padding: 0.55rem 0.7rem;
				border: 1px solid var(--mat-sys-outline, #79747e);
				border-radius: 10px;
				font: inherit;
			}
			.result {
				display: flex;
				align-items: center;
				gap: 0.6rem;
				flex-wrap: wrap;
				margin: 1rem 0;
				font-size: 1.05rem;
			}
			.arrow {
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
			.codes,
			.langs {
				display: flex;
				flex-wrap: wrap;
				gap: 0.4rem;
			}
			.code-chip {
				border: 1px solid var(--mat-sys-outline-variant, #cfc9d6);
				background: var(--mat-sys-surface-container-low, #f7f4fb);
				border-radius: 999px;
				padding: 0.25rem 0.7rem;
				font: inherit;
				font-size: 0.85rem;
				cursor: pointer;
			}
			.code-chip:hover,
			.code-chip.active {
				background: var(--mat-sys-secondary-container, #e8def8);
				border-color: transparent;
			}
			.presets {
				display: grid;
				gap: 1rem;
			}
			.preset-head {
				display: flex;
				align-items: baseline;
				gap: 0.6rem;
				flex-wrap: wrap;
				margin-bottom: 0.35rem;
			}
			.name {
				font-weight: 600;
			}
			.note {
				font-size: 0.82rem;
			}
			.json {
				margin: 0;
				padding: 0.75rem 0.9rem;
				background: var(--mat-sys-surface-container-high, #ece6f0);
				border-radius: 10px;
				font-size: 0.82rem;
				overflow-x: auto;
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
