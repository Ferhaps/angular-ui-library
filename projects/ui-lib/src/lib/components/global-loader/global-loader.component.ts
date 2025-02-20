import { Component, inject, NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: false,
  selector: 'lib-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss'
})
export class GlobalLoaderComponent {
  protected loaderService = inject(LoaderService);
}

@NgModule({
  declarations: [
    GlobalLoaderComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    GlobalLoaderComponent
  ]
})
export class GlobalLoaderModule { }