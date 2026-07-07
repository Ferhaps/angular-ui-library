import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	TemplateRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgTemplateOutlet } from '@angular/common';

@Component({
	selector: 'eui-default-dialog',
	imports: [MatIconModule, MatDialogModule, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './default-dialog.component.html',
	styleUrls: ['./default-dialog.component.scss'],
})
export class DefaultDialogComponent {
	public templateRef = input<TemplateRef<unknown>>();

	public height = input<string>();
	public dialogTitle = input<string>();
	public withBack = input<boolean>();

	protected back = output<void>();
}
