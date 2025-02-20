import { Component, Input, input, NgModule, output, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: false,
  selector: 'lib-default-dialog',
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

@NgModule({
  declarations: [
    DefaultDialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    DefaultDialogComponent
  ]
})
export class DefaultDialogModule { }