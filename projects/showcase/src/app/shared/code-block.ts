import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-code-block',
	imports: [MatIconModule],
	template: `
		<div class="code-wrap">
			<button
				type="button"
				class="copy"
				(click)="copy()"
				[attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
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
				top: 0.5rem;
				right: 0.5rem;
				display: inline-grid;
				place-items: center;
				border: none;
				border-radius: 8px;
				padding: 0.3rem;
				cursor: pointer;
				color: #cdc6da;
				background: rgba(255, 255, 255, 0.08);
			}
			.copy:hover {
				background: rgba(255, 255, 255, 0.16);
			}
			.copy mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
	public code = input.required<string>();
	protected copied = signal(false);

	protected async copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(this.code());
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 1500);
		} catch {
			// Clipboard API unavailable (e.g. insecure context) — ignore.
		}
	}
}
