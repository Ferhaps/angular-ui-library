import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-event-log',
	imports: [MatIconModule, MatChipsModule],
	templateUrl: './event-log.html',
	styleUrl: './event-log.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLog {
	public title = input('Event log');
	public events = input<string[]>([]);

	protected reversed(): string[] {
		return [...this.events()].reverse();
	}
}
