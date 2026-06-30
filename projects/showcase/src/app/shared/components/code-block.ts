import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-code-block',
	imports: [MatIconModule, MatButtonModule, MatTooltipModule],
	template: `
		<div class="code-wrap">
			<button
				mat-icon-button
				class="copy"
				matTooltip="Copy to clipboard"
				aria-label="Copy code"
				(click)="copy()"
			>
				<mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
			</button>
			<pre class="mono"><code>{{ code() }}</code></pre>
		</div>
	`,
	styles: [
		`
			.code-wrap {
				position: relative;
				background: #1e1b24;
				border-radius: 12px;
				overflow: hidden;
			}
			pre {
				margin: 0;
				padding: 1rem 1.1rem;
				overflow-x: auto;
				color: #e8e3f0;
				font-size: 0.83rem;
				line-height: 1.55;
			}
			.copy {
				position: absolute;
				top: 0.4rem;
				right: 0.4rem;
				--mdc-icon-button-icon-color: #e8e3f0;
				--mat-icon-button-state-layer-color: #fff;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
	public code = input.required<string>();
	protected copied = signal(false);
	private snackBar = inject(MatSnackBar);

	protected async copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(this.code());
			this.copied.set(true);
			this.snackBar.open('Copied to clipboard', '', { duration: 1500 });
			setTimeout(() => this.copied.set(false), 1500);
		} catch {
			this.snackBar.open('Clipboard unavailable', '', { duration: 1500 });
		}
	}
}
