import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-page-heading',
	template: `
		<header class="page-head">
			<div class="row">
				<h1>{{ title() }}</h1>
				@if (kind()) {
					<span class="chip">{{ kind() }}</span>
				}
			</div>
			@if (lead()) {
				<p class="lead muted">{{ lead() }}</p>
			}
			<ng-content />
		</header>
	`,
	styles: [
		`
			.page-head {
				margin-bottom: 1.75rem;
			}
			.row {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				flex-wrap: wrap;
			}
			h1 {
				margin: 0;
				font-size: clamp(1.6rem, 3vw, 2.1rem);
			}
			.chip {
				font-size: 0.7rem;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				padding: 0.2rem 0.55rem;
				border-radius: 999px;
				background: var(--mat-sys-secondary-container, #e8def8);
				color: var(--mat-sys-on-secondary-container, #1d192b);
			}
			.lead {
				margin: 0.6rem 0 0;
				max-width: 70ch;
				font-size: 1.02rem;
				line-height: 1.5;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeading {
	public title = input.required<string>();
	public kind = input<string>();
	public lead = input<string>();
}
