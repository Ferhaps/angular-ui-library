import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';

/**
 * Full-screen loading overlay driven by {@link LoadingService}.
 *
 * Mount it once, near your app root — it shows a spinner whenever anything holds
 * a loading claim (`easyUiLibInterceptor` takes one for requests tagged with the
 * `X-Global-Loader` header, as does `LoadingService.withLoading()`) and hides
 * once the last claim is released.
 *
 * @example
 * ```html
 * <eui-global-loader />
 * ```
 */
@Component({
	selector: 'eui-global-loader',
	imports: [MatProgressSpinnerModule],
	templateUrl: './global-loader.component.html',
	styleUrl: './global-loader.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoaderComponent {
	protected loadingService = inject(LoadingService);
}
