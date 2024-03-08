import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-default-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.scss']
})
export class DefaultDialogComponent {
  @Input() public temRef: TemplateRef<any> | undefined;
  @Input() public title: string = '';
  @Input() public withBack: boolean = false;

  @Output() public back = new EventEmitter();
}
