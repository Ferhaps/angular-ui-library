import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';

/** Request header that, when present, shows the global loader for the request. */
export const GLOBAL_LOADER_HEADER = 'X-Global-Loader';
/** Request header that, when present, suppresses the automatic error popup. */
export const SKIP_ERROR_HEADER = 'X-Skip-Error';

/**
 * Wires the library's header conventions to its services:
 *  - `X-Global-Loader` toggles the {@link LoaderService} for the request's lifetime.
 *  - `X-Skip-Error` suppresses the automatic {@link ErrorService} broadcast.
 *
 * These internal headers are stripped before the request leaves the app.
 */
export const easyUiLibInterceptor: HttpInterceptorFn = (req, next) => {
	const errorService = inject(ErrorService);
	const loader = inject(LoaderService);

	const useLoader = req.headers.has(GLOBAL_LOADER_HEADER);
	const skipError = req.headers.has(SKIP_ERROR_HEADER);

	const cleaned = req.clone({
		headers: req.headers
			.delete(GLOBAL_LOADER_HEADER)
			.delete(SKIP_ERROR_HEADER),
	});

	if (useLoader) {
		loader.setLoading(true);
	}

	return next(cleaned).pipe(
		catchError((error: HttpErrorResponse) => {
			if (!skipError) {
				errorService.sendError(error);
			}
			return throwError(() => error);
		}),
		finalize(() => {
			if (useLoader) {
				loader.setLoading(false);
			}
		}),
	);
};
