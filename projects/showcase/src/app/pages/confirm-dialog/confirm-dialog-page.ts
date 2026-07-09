import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-confirm-dialog-page',
	imports: [MatButtonModule, MatIconModule, PageHeading, DemoCard, CodeBlock],
	templateUrl: './confirm-dialog-page.html',
	styleUrl: './confirm-dialog-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogPage {
	private confirmDialog = inject(ConfirmDialogService);

	protected lastResult = signal<boolean | null>(null);

	protected async basic(): Promise<void> {
		const confirmed = await this.confirmDialog.confirm({
			title: 'Apply changes?',
			message: 'Your profile will be updated with the new values.',
		});
		this.lastResult.set(confirmed);
	}

	protected async danger(): Promise<void> {
		const confirmed = await this.confirmDialog.confirm({
			title: 'Delete 3 users?',
			message: 'This action cannot be undone.',
			confirmText: 'Delete',
			danger: true,
		});
		this.lastResult.set(confirmed);
	}

	protected readonly snippet = `const confirmDialog = inject(ConfirmDialogService);

// resolves true only on the confirm button — cancel, Escape,
// the close icon and backdrop clicks all resolve false
const confirmed = await confirmDialog.confirm({
	title: 'Delete 3 users?',
	message: 'This action cannot be undone.',
	confirmText: 'Delete',
	danger: true, // destructive styling on the confirm button
});

if (confirmed) {
	await this.usersService.delete(selected);
}`;
}
