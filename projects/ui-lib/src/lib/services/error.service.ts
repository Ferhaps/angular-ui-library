import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * App-wide broadcast channel for HTTP errors.
 *
 * `easyUiLibInterceptor` calls {@link sendError} for every failed request that
 * isn't opted out via the `X-Skip-Error` header, and `ErrorHandlerComponent`
 * subscribes to {@link error$} to surface them in a popup. Inject it directly to
 * push your own errors onto the same pipeline.
 */
@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	private errorSubject = new Subject<HttpErrorResponse>();

	/** Stream of broadcast errors. Emits once per {@link sendError} call. */
	public error$ = this.errorSubject.asObservable();

	/** Broadcasts an error to every {@link error$} subscriber (e.g. the popup). */
	public sendError(error: HttpErrorResponse) {
		this.errorSubject.next(error);
	}
}
