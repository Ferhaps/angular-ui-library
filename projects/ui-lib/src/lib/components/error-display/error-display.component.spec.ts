import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorDisplayComponent } from './error-display.component';
import { SystemError } from '../../utils/types';

describe('ErrorDisplayComponent', () => {
	function render(error: SystemError): string {
		const fixture = TestBed.createComponent(ErrorDisplayComponent);
		fixture.componentRef.setInput('error', error);
		fixture.detectChanges();
		return (fixture.nativeElement as HTMLElement).textContent?.trim() ?? '';
	}

	it('renders the string body of an HttpErrorResponse', () => {
		const error = new HttpErrorResponse({
			status: 401,
			error: 'INVALID_CREDENTIALS',
		});
		expect(render(error)).toBe('Invalid credentials');
	});

	it('renders error.message from an object body', () => {
		const error = new HttpErrorResponse({
			status: 422,
			error: { message: 'email_already_taken' },
		});
		expect(render(error)).toBe('Email already taken');
	});

	it('renders a plain string', () => {
		expect(render('user_not_found')).toBe('User not found');
	});

	it("falls back to 'Unknown error'", () => {
		expect(render(undefined)).toBe('Unknown error');
		expect(render(new HttpErrorResponse({ status: 500, error: {} }))).toBe(
			'Unknown error',
		);
	});
});
