import { Injectable, computed, signal } from '@angular/core';
import { MonoTypeOperatorFunction, defer, finalize } from 'rxjs';

/**
 * Drives the app-wide loading overlay rendered by `GlobalLoaderComponent`.
 *
 * Prefer {@link withLoading} over the manual methods — it ties the overlay to an
 * observable's lifetime, so there is nothing to remember to turn off:
 *
 * ```typescript
 * private readonly loading = inject(LoadingService);
 *
 * readonly users = toSignal(
 *   this.http.get<User[]>('/api/users').pipe(this.loading.withLoading()),
 * );
 * ```
 */
@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	// Counted rather than a boolean so overlapping work can't hide the overlay
	// early — the first caller to finish would otherwise switch it off while the
	// rest are still running.
	private readonly claims = signal(0);

	/** Whether the overlay should be visible. */
	public readonly loading = computed(() => this.claims() > 0);

	/**
	 * Shows the overlay for the lifetime of the source observable.
	 *
	 * The overlay is claimed on subscribe and released on complete, error or
	 * unsubscribe — so a superseded `switchMap` inner or a destroyed component
	 * releases it too.
	 *
	 * @example
	 * ```typescript
	 * this.http.get<User[]>('/api/users').pipe(
	 *   this.loading.withLoading(),
	 * );
	 * ```
	 */
	public withLoading<T>(): MonoTypeOperatorFunction<T> {
		return (source) =>
			defer(() => {
				this.showLoading();
				return source;
			}).pipe(finalize(() => this.hideLoading()));
	}

	/**
	 * Shows the overlay. For async work that isn't an observable — pair every
	 * call with a {@link hideLoading}, ideally in a `finally`.
	 */
	public showLoading(): void {
		this.claims.update((count) => count + 1);
	}

	/** Hides the overlay. Unpaired calls are ignored. */
	public hideLoading(): void {
		this.claims.update((count) => Math.max(0, count - 1));
	}
}
