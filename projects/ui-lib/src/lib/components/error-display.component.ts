import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { SnakeCaseParserPipe } from '../pipes/snake-case-parser.pipe';
import { SystemError } from '../utils/types';

@Component({
	selector: 'lib-error-display',
	imports: [SnakeCaseParserPipe],
	template: `<strong class="err-container">{{
		displayError() | snakeCaseParser
	}}</strong>`,
	styles: [
		`
			.err-container {
				display: block;
				max-width: 300px;
				font-size: 20px;
				text-align: center;
				border: 1px solid red;
				border-radius: 5px;
				padding: 0.5rem 1.5rem;
				background-color: #ffe6e6;
				color: #ff0000;
				overflow-wrap: break-word;
			}
		`,
	],
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
