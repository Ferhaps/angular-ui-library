import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-demo-card',
	template: `
		<section class="card">
			@if (heading()) {
				<div class="card-head">
					<h3>{{ heading() }}</h3>
					@if (hint()) {
						<span class="muted hint">{{ hint() }}</span>
					}
				</div>
			}
			<div class="card-body">
				<ng-content />
			</div>
		</section>
	`,
	styles: [
		`
			.card {
				background: var(--mat-sys-surface, #fff);
				border: 1px solid var(--mat-sys-outline-variant, #e3e1e6);
				border-radius: 16px;
				padding: 1.25rem 1.4rem 1.4rem;
				margin-bottom: 1.5rem;
			}
			.card-head {
				display: flex;
				align-items: baseline;
				gap: 0.75rem;
				flex-wrap: wrap;
				margin-bottom: 1rem;
			}
			h3 {
				margin: 0;
				font-size: 1.05rem;
			}
			.hint {
				font-size: 0.85rem;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCard {
	public heading = input<string>();
	public hint = input<string>();
}
