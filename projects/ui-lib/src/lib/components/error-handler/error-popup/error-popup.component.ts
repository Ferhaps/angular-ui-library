import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogComponent, DefaultDialogModule } from '../../default-dialog/default-dialog.component';
import { ErrorDispalyComponent, ErrorDispalyModule } from '../../error-dispaly.component';
import { HTTP_STATUS_CODES } from '../../../utils/utils';
import { CommonModule } from '@angular/common';

@Component({
  standalone: false,
  selector: 'lib-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent {
  protected httpStatusCodes = HTTP_STATUS_CODES;
  
  constructor(@Inject(MAT_DIALOG_DATA) public error: HttpErrorResponse) { }
}

@NgModule({
  declarations: [
    ErrorPopupComponent
  ],
  imports: [
    CommonModule,
    ErrorDispalyModule,
    DefaultDialogModule
  ],
  exports: [
    ErrorPopupComponent
  ]
})
export class ErrorPopupModule { }
