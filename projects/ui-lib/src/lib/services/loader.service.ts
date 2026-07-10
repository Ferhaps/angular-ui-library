import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Drives the app-wide loading overlay rendered by `GlobalLoaderComponent`.
 *
 * `easyUiLibInterceptor` toggles this for requests tagged with the
 * `X-Global-Loader` header, but you can call {@link setLoading} yourself to show
 * the overlay around any async work.
 */
@Injectable({
	providedIn: 'root',
})
export class LoaderService {
	private loadingSubject = new BehaviorSubject<boolean>(false);

	/** Stream of the current loading state; drives the global loader overlay. */
	public loading$ = this.loadingSubject.asObservable();

	/** Shows (`true`) or hides (`false`) the global loading overlay. */
	public setLoading(loadingState: boolean) {
		this.loadingSubject.next(loadingState);
	}

	/** Returns the current loading state synchronously. */
	public isLoading(): boolean {
		return this.loadingSubject.getValue();
	}
}
