import { OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error-handler',
  templateUrl: 'error-handler.component.html',
  styleUrls: ['error-handler.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule
  ]
})
export class ErrorHandlerComponent implements OnDestroy {
  private errSubscriptions = new Subscription();
  private errorService = inject(ErrorService);
  private dialog = inject(MatDialog);

  constructor() {
    this.errSubscriptions.add(
      this.errorService.error$.subscribe((err: HttpErrorResponse) => {
        console.log(err);
        this.showPopup(err);
      }),
    );
  }

  private showPopup(error: HttpErrorResponse): void {
    this.dialog.closeAll();
    this.dialog.open(ErrorPopupComponent, {
      data: error,
      width: '400px',
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  public ngOnDestroy(): void {
    this.errSubscriptions.unsubscribe();
  }
}
