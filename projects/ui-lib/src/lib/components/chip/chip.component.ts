import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-chip',
  standalone: true,
  imports: [
    NgClass
  ],
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
