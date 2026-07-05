import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'snakeCaseParser',
})
export class SnakeCaseParserPipe implements PipeTransform {
	public transform(value: unknown): string {
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
