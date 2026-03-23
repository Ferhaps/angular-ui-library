import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-global-loader',
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoaderComponent {
  protected loaderService = inject(LoaderService);
}
