import { Component, Input, input, output, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-default-dialog',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.scss']
})
export class DefaultDialogComponent {
  @Input() temRef!: TemplateRef<any>;
  
  public height = input<string>();
  public dialogTitle = input<string>();
  public withBack = input<boolean>();

  protected back = output<void>();
}
