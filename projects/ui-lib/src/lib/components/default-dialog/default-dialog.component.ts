import { Component, Input, input, output, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-default-dialog',
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
  @Input() temRef!: TemplateRef<any>;
  
  public title = input<string>();
  public withBack = input<boolean>();

  protected back = output<void>();
}
