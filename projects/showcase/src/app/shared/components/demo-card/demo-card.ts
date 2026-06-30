import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-demo-card',
	imports: [MatCardModule],
	templateUrl: './demo-card.html',
	styleUrl: './demo-card.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCard {
	public heading = input<string>();
	public hint = input<string>();
}
