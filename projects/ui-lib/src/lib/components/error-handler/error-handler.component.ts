import { OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ErrorService } from '../../services/error.service';

/**
 * Listens to {@link ErrorService} and shows any broadcast error in a popup
 * dialog (closing any previous popup first).
 *
 * Mount it once, near your app root — it renders nothing itself. Combined with
 * `easyUiLibInterceptor`, failed HTTP requests surface automatically unless the
 * request opts out via the `X-Skip-Error` header.
 *
 * @example
 * ```html
 * <eui-error-handler />
 * ```
 */
@Component({
	selector: 'eui-error-handler',
	templateUrl: 'error-handler.component.html',
	styleUrls: ['error-handler.component.scss'],
	imports: [MatDialogModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHandlerComponent implements OnDestroy {
	private errSubscriptions = new Subscription();
	private errorService = inject(ErrorService);
	private dialog = inject(MatDialog);

	constructor() {
		this.errSubscriptions.add(
			this.errorService.error$.subscribe((err: HttpErrorResponse) => {
				this.showPopup(err);
			}),
		);
	}

	private showPopup(error: HttpErrorResponse): void {
		this.dialog.closeAll();
		this.dialog.open(ErrorPopupComponent, {
			data: error,
			width: '400px',
			autoFocus: false,
			scrollStrategy: new NoopScrollStrategy(),
		});
	}

	public ngOnDestroy(): void {
		this.errSubscriptions.unsubscribe();
	}
}
