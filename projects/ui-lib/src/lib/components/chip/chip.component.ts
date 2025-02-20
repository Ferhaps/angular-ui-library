import { CommonModule } from '@angular/common';
import { Component, input, NgModule, output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'lib-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  public value = input.required<any>();
  public isSelected = input.required<boolean>();
  public text = input.required<string>();

  protected selected = output<any>();

  protected onClick() {
    if (this.isSelected()) {
      return;
    }

    this.selected.emit(this.value());
  }
}

@NgModule({
  declarations: [
    ChipComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChipComponent
  ]
})
export class ChipModule { }