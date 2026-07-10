import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe } from '@angular/common';

/**
 * Full-screen loading overlay driven by {@link LoaderService}.
 *
 * Mount it once, near your app root — it shows a spinner whenever
 * `LoaderService.loading$` is `true` (which `easyUiLibInterceptor` toggles for
 * requests tagged with the `X-Global-Loader` header) and hides otherwise.
 *
 * @example
 * ```html
 * <eui-global-loader />
 * ```
 */
@Component({
	selector: 'eui-global-loader',
	imports: [AsyncPipe, MatProgressSpinnerModule],
	templateUrl: './global-loader.component.html',
	styleUrl: './global-loader.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoaderComponent {
	protected loaderService = inject(LoaderService);
}
