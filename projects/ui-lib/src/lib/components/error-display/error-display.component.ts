import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { SnakeCaseParserPipe } from '../../pipes/snake-case-parser.pipe';
import { SystemError } from '../../utils/types';

@Component({
	selector: 'eui-error-display',
	imports: [SnakeCaseParserPipe],
	templateUrl: './error-display.component.html',
	styleUrl: './error-display.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplayComponent {
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
