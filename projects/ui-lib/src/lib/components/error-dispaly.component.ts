import { Component, input, NgModule, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { SnakeCaseParserModule, SnakeCaseParserPipe } from '../pipes/snake-case-parser.pipe';
import { SystemError } from '../utils/types';
import { CommonModule } from '@angular/common';

@Component({
  standalone: false,
  selector: 'lib-error-dispaly',
  template: `<strong class="err-container">{{ displayError | snakeCaseParser }}</strong>`,
  styles: [`
  .err-container {
    display: block;
    max-width: 300px;
    font-size: 20px;
    text-align: center;
    border: 1px solid red;
    border-radius: 5px;
    padding: 0.5rem 1.5rem;
    background-color: #ffe6e6;
    color: #ff0000;
    overflow-wrap: break-word;
  }
`]
})
export class ErrorDispalyComponent implements OnInit {
  public error = input.required<SystemError>();

  protected displayError: string = '';

  public ngOnInit(): void {
    if (this.error() instanceof HttpErrorResponse) {
      if (typeof (this.error() as HttpErrorResponse).error === 'string') {
        this.displayError = (this.error() as HttpErrorResponse).error;
      } else if (this.error && (this.error() as HttpErrorResponse)?.error?.message) {
        this.displayError = (this.error() as HttpErrorResponse).error.message;
      } else {
        this.displayError = 'Unknown error';
      }
    } else if (typeof this.error() === 'string') {
      this.displayError = (this.error() as string);
    } else {
      this.displayError = 'Unknown error';
    }
  }
}

@NgModule({
  declarations: [
    ErrorDispalyComponent
  ],
  imports: [
    CommonModule,
    SnakeCaseParserModule,
  ],
  exports: [
    ErrorDispalyComponent
  ]
})
export class ErrorDispalyModule { }