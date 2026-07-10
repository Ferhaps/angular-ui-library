import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { firstValueFrom } from 'rxjs';
import {
	ConfirmDialogComponent,
	ConfirmDialogOptions,
} from '../components/confirm-dialog/confirm-dialog.component';

/**
 * Opens the library's confirmation dialog and awaits the user's decision.
 *
 * Inject it and `await confirm(...)` before running a destructive or
 * irreversible action. The safe (cancel) button is focused first, and `danger`
 * styling is available for destructive confirms.
 *
 * @example
 * ```ts
 * if (await this.confirmDialog.confirm({ title: 'Delete item?', danger: true })) {
 *   this.delete();
 * }
 * ```
 */
@Injectable({
	providedIn: 'root',
})
export class ConfirmDialogService {
	private dialog = inject(MatDialog);

	/**
	 * Opens a confirmation dialog and resolves to `true` only when the user
	 * presses the confirm button. Cancel, Escape, the close icon and backdrop
	 * clicks all resolve to `false`.
	 *
	 * @param options - Labels, `danger` styling and width. See {@link ConfirmDialogOptions}.
	 */
	public async confirm(options: ConfirmDialogOptions = {}): Promise<boolean> {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: options,
			width: options.width || '400px',
			// Focus the safe action first, especially for destructive confirms.
			autoFocus: '.cancel-button',
			scrollStrategy: new NoopScrollStrategy(),
		});

		const result = await firstValueFrom(dialogRef.afterClosed(), {
			defaultValue: false,
		});
		return result === true;
	}
}
