import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogComponent } from '../../default-dialog/default-dialog.component';
import { ErrorDispalyComponent } from '../../error-dispaly.component';

@Component({
  selector: 'app-error-popup',
  standalone: true,
  imports: [
    DefaultDialogComponent,
    ErrorDispalyComponent
  ],
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public error: HttpErrorResponse) { }
}
