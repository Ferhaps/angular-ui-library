import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DefaultDialogComponent } from '../default-dialog/default-dialog.component';

export type ConfirmDialogOptions = {
	/** Dialog heading. Defaults to 'Are you sure?'. */
	title?: string;
	/** Optional body text under the heading. */
	message?: string;
	/** Confirm button label. Defaults to 'Confirm'. */
	confirmText?: string;
	/** Cancel button label. Defaults to 'Cancel'. */
	cancelText?: string;
	/** Styles the confirm button as destructive (error colors). */
	danger?: boolean;
	/** Dialog width. Defaults to '400px'. */
	width?: string;
};

@Component({
	selector: 'eui-confirm-dialog',
	imports: [DefaultDialogComponent, MatDialogModule, MatButtonModule],
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
	protected options = inject<ConfirmDialogOptions>(MAT_DIALOG_DATA);
}
