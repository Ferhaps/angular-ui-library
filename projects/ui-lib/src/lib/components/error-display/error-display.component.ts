import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { SnakeCaseParserPipe } from '../../pipes/snake-case-parser.pipe';
import { SystemError } from '../../utils/types';

/**
 * Renders a {@link SystemError} as a friendly, human-readable message.
 *
 * It unwraps an `HttpErrorResponse` (using its string body or `error.message`),
 * passes a plain string through, and falls back to `'Unknown error'`. Drop it
 * anywhere you need to show an inline error.
 *
 * @example
 * ```html
 * <eui-error-display [error]="error" />
 * ```
 */
@Component({
	selector: 'eui-error-display',
	imports: [SnakeCaseParserPipe],
	templateUrl: './error-display.component.html',
	styleUrl: './error-display.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplayComponent {
	/** The error to render (HTTP error, string, or `undefined`). */
	public error = input.required<SystemError>();

	protected displayError = computed<string>(() => {
		const error = this.error();

		if (error instanceof HttpErrorResponse) {
			if (typeof error.error === 'string') {
				return error.error;
			}
			if (error.error?.message) {
				return error.error.message;
			}
			return 'Unknown error';
		}

		if (typeof error === 'string') {
			return error;
		}

		return 'Unknown error';
	});
}
