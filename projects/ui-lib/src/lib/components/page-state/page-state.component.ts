import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageErrorComponent } from '../page-error/page-error.component';

export type PageState = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-page-state',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PageErrorComponent
  ],
  templateUrl: './page-state.component.html',
  styleUrls: ['./page-state.component.scss']
})
export class PageStateComponent {
  @Input({ required: true }) state!: PageState;

  @Output() retry = new EventEmitter();
}
