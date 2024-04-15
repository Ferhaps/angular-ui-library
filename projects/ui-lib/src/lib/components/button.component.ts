import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'main-btn',
  template: `
    <button class="hidden-btn"></button>
    <button
      mat-raised-button [class]="class"
      [disabled]="disabled">
      <ng-content/>
    </button>
  `,
  styles: [`
    button {
      border: none !important;
      background-color: #31ADFF !important;
      color: white !important;
      padding: 5px 40px !important;
      font-size: 20px !important;
    }
    button[disabled='true'] {
      cursor: not-allowed !important;
      background-color: #D0D5DD !important;
    }
    .secondary {
      background-color: white !important;
      color: #3D3C3C !important;
      border: 1px solid #D0D5DD !important;
    }
  `],
  standalone: true,
  imports: [
    MatButtonModule
  ],
})
export class ButtonComponent {
  @Input() public class: string = '';
  @Input() public disabled: boolean = false;
}