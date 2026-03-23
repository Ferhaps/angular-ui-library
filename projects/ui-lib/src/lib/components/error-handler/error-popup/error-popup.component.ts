import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogComponent } from '../../default-dialog/default-dialog.component';
import { ErrorDisplayComponent } from '../../error-display.component';
import { HTTP_STATUS_CODES } from '../../../utils/utils';

@Component({
  selector: 'lib-error-popup',
  imports: [
    DefaultDialogComponent,
    ErrorDisplayComponent
  ],
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPopupComponent {
  protected httpStatusCodes = HTTP_STATUS_CODES;
  public error = inject<HttpErrorResponse>(MAT_DIALOG_DATA);
}
