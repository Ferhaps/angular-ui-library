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

/**
 * A reusable dialog shell: a titled, scrollable surface with a close button and
 * an optional back button, into which you project your own content.
 *
 * Provide the body as a `TemplateRef` via {@link templateRef}. Used as the base
 * for `ConfirmDialogComponent`; use it directly to build custom Material
 * dialogs with a consistent chrome.
 */
@Component({
	selector: 'eui-default-dialog',
	imports: [MatIconModule, MatDialogModule, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './default-dialog.component.html',
	styleUrls: ['./default-dialog.component.scss'],
})
export class DefaultDialogComponent {
	/** The dialog body, rendered inside the shell. */
	public templateRef = input<TemplateRef<unknown>>();

	/** Fixed content height (any CSS length). Defaults to fit content. */
	public height = input<string>();
	/** Heading shown in the dialog header. */
	public dialogTitle = input<string>();
	/** Show a back button in the header that emits {@link back}. */
	public withBack = input<boolean>();

	/** Emitted when the back button is pressed. */
	protected back = output<void>();
}
