import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { fader } from '../utills/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'chips',
  template: `
  <mat-chip-listbox *ngIf="chips.length > 0">
    <mat-chip *ngFor="let chip of chips; trackBy: trackById" @fadeInOut [removable]="removable">
      <span *ngIf="prop; else showValue">{{chip[prop]}}</span>
      <ng-template #showValue>{{chip}}</ng-template>
      <mat-icon *ngIf="removable" (click)="remove.emit(chip)">close</mat-icon>
    </mat-chip>
  </mat-chip-listbox>
  `,
  styles: [`
      ::ng-deep {
        .mat-mdc-chip-action-label {
          display: flex;
          align-items: center;
          }
      }

      mat-icon {
        font-size: 20px;
        margin-left: 5px;
        cursor: pointer;
      }
  `],
  animations: [ fader ],
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class ChipsComponent {
  @Input({ required: true }) public chips: any[] = [];
  @Input() public prop: string | undefined = 'name';
  @Input() public removable: boolean = true;

  @Output() protected remove = new EventEmitter();

  protected trackById(index: number, obj: any): number {
    return obj.id;
  }
}