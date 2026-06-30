import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
	TemplateRef,
	viewChild,
} from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DefaultDialogComponent } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

// Opened via MatDialog — demonstrates projected `.dialog-content`, the back
// arrow and its `back` output, and a custom height.
@Component({
	selector: 'app-profile-dialog',
	imports: [
		DefaultDialogComponent,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
	],
	template: `
		<lib-default-dialog
			[dialogTitle]="editing() ? 'Edit profile' : 'Profile'"
			[withBack]="editing()"
			height="auto"
			(back)="editing.set(false)"
		>
			<div class="dialog-content body">
				@if (!editing()) {
					<div class="avatar"><mat-icon>person</mat-icon></div>
					<h4>Ada Lovelace</h4>
					<p class="muted">ada.lovelace&#64;example.com</p>
					<button mat-flat-button (click)="editing.set(true)">
						<mat-icon>edit</mat-icon> Edit profile
					</button>
				} @else {
					<mat-form-field appearance="outline" class="field">
						<mat-label>Name</mat-label>
						<input matInput value="Ada Lovelace" />
					</mat-form-field>
					<mat-form-field appearance="outline" class="field">
						<mat-label>Email</mat-label>
						<input matInput value="ada.lovelace@example.com" />
						<mat-icon matSuffix>mail</mat-icon>
					</mat-form-field>
					<p class="muted hint">Use the back arrow ↖ to cancel.</p>
				}
			</div>
		</lib-default-dialog>
	`,
	styles: [
		`
			.body {
				gap: 0.25rem;
				width: 300px;
				max-width: 100%;
			}
			.avatar {
				display: grid;
				place-items: center;
				width: 64px;
				height: 64px;
				border-radius: 50%;
				background: var(--mat-sys-secondary-container);
				margin-bottom: 0.25rem;
			}
			.avatar mat-icon {
				font-size: 36px;
				width: 36px;
				height: 36px;
				color: var(--mat-sys-primary);
			}
			h4 {
				margin: 0.25rem 0 0;
			}
			button mat-icon {
				margin-right: 0.35rem;
			}
			.field {
				width: 100%;
			}
			.hint {
				font-size: 0.8rem;
				margin: 0;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDialog {
	protected readonly editing = signal(false);
}

// Demonstrates passing a TemplateRef to the dialog's `temRef` input instead of
// projecting content.
@Component({
	selector: 'app-template-dialog',
	imports: [DefaultDialogComponent],
	template: `
		<lib-default-dialog
			[dialogTitle]="data.title"
			[temRef]="data.template"
			height="auto"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDialog {
	protected readonly data = inject<{
		title: string;
		template: TemplateRef<unknown>;
	}>(MAT_DIALOG_DATA);
}

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
	template: `
		<app-page-heading
			title="Default Dialog"
			kind="Component · DefaultDialogComponent"
			lead="A reusable MatDialog shell with a centered title, an optional back
			arrow (with its own output), a built-in close button and a configurable
			height. Feed it either projected content or a TemplateRef."
		/>

		<app-demo-card
			heading="Projected content · back arrow · custom height"
			hint="opened with MatDialog"
		>
			<button mat-flat-button (click)="openProfile()">
				<mat-icon>open_in_new</mat-icon> Open profile dialog
			</button>
		</app-demo-card>

		<app-demo-card heading="TemplateRef content" hint="via the temRef input">
			<button mat-stroked-button (click)="openTemplate()">
				<mat-icon>description</mat-icon> Open template dialog
			</button>

			<ng-template #promo>
				<div class="promo">
					<mat-icon class="promo-icon">auto_awesome</mat-icon>
					<p>
						This block is an <code>&lt;ng-template&gt;</code> declared on the
						page and rendered by the dialog through its
						<code>temRef</code> input — no content projection involved.
					</p>
				</div>
			</ng-template>
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			button mat-icon {
				margin-right: 0.35rem;
			}
			.promo {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.5rem;
				width: 280px;
				max-width: 100%;
				text-align: center;
				padding-inline: 0.5rem;
			}
			.promo-icon {
				font-size: 40px;
				width: 40px;
				height: 40px;
				color: var(--mat-sys-primary);
			}
		`,
	],
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
    <lib-default-dialog
      [dialogTitle]="editing() ? 'Edit profile' : 'Profile'"
      [withBack]="editing()"
      (back)="editing.set(false)"
    >
      <div class="dialog-content"> ...your content... </div>
    </lib-default-dialog>
  \`,
})
export class ProfileDialog { editing = signal(false); }

// Open it
this.dialog.open(ProfileDialog, { width: '420px', autoFocus: false });`;
}
