import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-demo-card',
	imports: [MatCardModule],
	template: `
		<mat-card appearance="outlined" class="demo-card">
			@if (heading()) {
				<mat-card-header>
					<mat-card-title>{{ heading() }}</mat-card-title>
					@if (hint()) {
						<mat-card-subtitle>{{ hint() }}</mat-card-subtitle>
					}
				</mat-card-header>
			}
			<mat-card-content>
				<ng-content />
			</mat-card-content>
		</mat-card>
	`,
	styles: [
		`
			.demo-card {
				margin-bottom: 1.5rem;
			}
			mat-card-title {
				font-size: 1.05rem;
			}
			mat-card-content {
				padding-top: 0.75rem;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCard {
	public heading = input<string>();
	public hint = input<string>();
}
