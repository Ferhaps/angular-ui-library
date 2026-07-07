import {
	ChangeDetectionStrategy,
	Component,
	inject,
	TemplateRef,
	viewChild,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';
import { ProfileDialog } from './profile-dialog/profile-dialog';
import { TemplateDialog } from './template-dialog/template-dialog';

@Component({
	selector: 'app-dialog-page',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './dialog-page.html',
	styleUrl: './dialog-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage {
	private readonly dialog = inject(MatDialog);
	private readonly promo = viewChild.required<TemplateRef<unknown>>('promo');

	protected openProfile(): void {
		this.dialog.open(ProfileDialog, { width: '420px', autoFocus: false });
	}

	protected openTemplate(): void {
		this.dialog.open(TemplateDialog, {
			width: '420px',
			autoFocus: false,
			data: { title: 'Heads up', template: this.promo() },
		});
	}

	protected readonly snippet = `// A component used as the dialog body
@Component({
  selector: 'app-profile-dialog',
  imports: [DefaultDialogComponent],
  template: \`
    <eui-default-dialog
      [dialogTitle]="editing() ? 'Edit profile' : 'Profile'"
      [withBack]="editing()"
      (back)="editing.set(false)"
    >
      <div class="dialog-content"> ...your content... </div>
    </eui-default-dialog>
  \`,
})
export class ProfileDialog { editing = signal(false); }

// Open it
this.dialog.open(ProfileDialog, { width: '420px', autoFocus: false });`;
}
