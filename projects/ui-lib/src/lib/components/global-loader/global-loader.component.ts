import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-global-loader',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss'
})
export class GlobalLoaderComponent {
  protected loaderService = inject(LoaderService);
}
