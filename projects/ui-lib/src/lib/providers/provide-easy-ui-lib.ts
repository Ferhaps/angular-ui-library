import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { easyUiLibInterceptor } from '../interceptors/easy-ui-lib.interceptor';

/**
 * Convenience provider that registers `HttpClient` with the library's
 * interceptor wired up. Optionally pass your own functional interceptors to run
 * alongside it — they run after `easyUiLibInterceptor` in the chain:
 * ```ts
 * provideEasyUiLib()
 * provideEasyUiLib([authInterceptor, retryInterceptor])
 * ```
 *
 * Use this when the library should own `HttpClient` setup. If you need other
 * `provideHttpClient` features (e.g. `withFetch()`) or already call
 * `provideHttpClient(...)` yourself, skip this and add the interceptor to your
 * own configuration instead:
 * ```ts
 * provideHttpClient(withInterceptors([easyUiLibInterceptor]))
 * ```
 */
export function provideEasyUiLib(otherInterceptors: HttpInterceptorFn[] = []): EnvironmentProviders {
	return makeEnvironmentProviders([
		provideHttpClient(withInterceptors([easyUiLibInterceptor, ...otherInterceptors])),
	]);
}
