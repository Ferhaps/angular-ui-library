import { SnakeCaseParserPipe } from './snake-case-parser.pipe';

describe('SnakeCaseParserPipe', () => {
	const pipe = new SnakeCaseParserPipe();

	it('returns an empty string for null and undefined', () => {
		expect(pipe.transform(null)).toBe('');
		expect(pipe.transform(undefined)).toBe('');
	});

	it('coerces other non-string values with String()', () => {
		expect(pipe.transform(0)).toBe('0');
		expect(pipe.transform(false)).toBe('false');
	});

	it('humanises snake_case', () => {
		expect(pipe.transform('user_first_name')).toBe('User first name');
	});

	it('humanises an all-caps value instead of passing it through', () => {
		expect(pipe.transform('HTTP_ERROR')).toBe('Http error');
		expect(pipe.transform('EMAIL_ALREADY_TAKEN')).toBe('Email already taken');
	});

	it('keeps acronyms in mixed-case input', () => {
		expect(pipe.transform('user_API_key')).toBe('User API key');
		expect(pipe.transform('user_ID')).toBe('User ID');
	});
});
