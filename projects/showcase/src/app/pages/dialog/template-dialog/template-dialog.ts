import {
	ChangeDetectionStrategy,
	Component,
	inject,
	TemplateRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultDialogComponent } from '@ferhaps/easy-ui-lib';

// Demonstrates passing a TemplateRef to the dialog's `temRef` input instead of
// projecting content.
@Component({
	selector: 'app-template-dialog',
	imports: [DefaultDialogComponent],
	templateUrl: './template-dialog.html',
	styleUrl: './template-dialog.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDialog {
	protected readonly data = inject<{
		title: string;
		template: TemplateRef<unknown>;
	}>(MAT_DIALOG_DATA);
}
