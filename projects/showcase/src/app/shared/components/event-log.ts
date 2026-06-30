import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-event-log',
	imports: [MatIconModule, MatChipsModule],
	template: `
		<div class="log">
			<div class="log-head">
				<mat-icon>terminal</mat-icon>
				<span>{{ title() }}</span>
				<mat-chip-set>
					<mat-chip disableRipple>{{ events().length }}</mat-chip>
				</mat-chip-set>
			</div>
			@if (events().length) {
				<ol>
					@for (line of reversed(); track $index) {
						<li class="mono">{{ line }}</li>
					}
				</ol>
			} @else {
				<p class="empty muted">Interact with the demo to see events here.</p>
			}
		</div>
	`,
	styles: [
		`
			.log {
				border: 1px dashed var(--mat-sys-outline-variant);
				border-radius: 12px;
				background: var(--mat-sys-surface-container-low);
				padding: 0.5rem 0.75rem;
			}
			.log-head {
				display: flex;
				align-items: center;
				gap: 0.4rem;
				font-weight: 500;
				font-size: 0.85rem;
				padding: 0.25rem;
			}
			.log-head mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
			.log-head mat-chip-set {
				margin-left: auto;
			}
			ol {
				margin: 0;
				padding: 0 0 0 1.4rem;
				max-height: 220px;
				overflow-y: auto;
			}
			li {
				font-size: 0.8rem;
				padding: 0.15rem 0;
			}
			.empty {
				margin: 0.4rem 0.25rem;
				font-size: 0.85rem;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLog {
	public title = input('Event log');
	public events = input<string[]>([]);

	protected reversed(): string[] {
		return [...this.events()].reverse();
	}
}
