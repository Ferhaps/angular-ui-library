import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-page-heading',
	imports: [MatChipsModule],
	templateUrl: './page-heading.html',
	styleUrl: './page-heading.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeading {
	public title = input.required<string>();
	public kind = input<string>();
	public lead = input<string>();
}
