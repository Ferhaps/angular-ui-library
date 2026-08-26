import { Pipe, PipeTransform } from '@angular/core';

/**
 * Turns a `snake_case` or `SCREAMING_SNAKE_CASE` identifier into a
 * human-readable, space-separated label.
 *
 * The first word is capitalised and the rest lower-cased
 * (`'user_first_name' -> 'User first name'`). An all-caps value is humanised the
 * same way (`'HTTP_ERROR' -> 'Http error'`). In a mixed-case value, fully
 * upper-case words are treated as acronyms and left untouched
 * (`'user_API_key' -> 'User API key'`).
 *
 * `null` and `undefined` become `''`; other non-string values are coerced with
 * `String()`.
 *
 * @example
 * ```html
 * {{ 'invalid_credentials' | snakeCaseParser }} <!-- Invalid credentials -->
 * ```
 */
@Pipe({
	name: 'snakeCaseParser',
})
export class SnakeCaseParserPipe implements PipeTransform {
	public transform(value: unknown): string {
		if (value === null || value === undefined) {
			return '';
		}
		if (typeof value !== 'string') {
			return String(value);
		}

		const screaming = this.isAllCaps(value);

		return value
			.split('_')
			.map((word, index) => {
				if (!word) {
					return word;
				}
				if (!screaming && this.isAllCaps(word)) {
					return word;
				}

				return index === 0
					? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
					: word.toLowerCase();
			})
			.join(' ');
	}

	private isAllCaps(text: string): boolean {
		return (
			text.length > 1 &&
			text === text.toUpperCase() &&
			text !== text.toLowerCase()
		);
	}
}
