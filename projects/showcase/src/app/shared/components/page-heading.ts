import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-page-heading',
	imports: [MatChipsModule],
	template: `
		<header class="page-head">
			<div class="row">
				<h1>{{ title() }}</h1>
				@if (kind()) {
					<mat-chip-set>
						<mat-chip disableRipple>{{ kind() }}</mat-chip>
					</mat-chip-set>
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
