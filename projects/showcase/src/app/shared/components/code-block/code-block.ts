import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-code-block',
	imports: [MatIconModule, MatButtonModule, MatTooltipModule],
	templateUrl: './code-block.html',
	styleUrl: './code-block.scss',
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
