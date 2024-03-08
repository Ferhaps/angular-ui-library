import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { SnakeCaseParserPipe } from '../pipes/snake-case-parser.pipe';
import { SystemError } from '../utills/types';

@Component({
  selector: 'app-error-dispaly',
  standalone: true,
  imports: [
    CommonModule,
    SnakeCaseParserPipe
  ],
  template: `<strong class="err-container">{{ displayError | snakeCaseParser }}</strong>`,
  styles: [`
    .err-container {
      display: block;
      width: fit-content;
      border: 1px solid red;
      border-radius: 5px;
      padding: 1rem 2rem;
      background-color: #ffe6e6;
      color: #ff0000;
      font-size: 20px;
    }
  `]
})
export class ErrorDispalyComponent implements OnInit {
  @Input({ required: true }) error: SystemError;

  protected displayError: string = '';

  public ngOnInit(): void {
    if (this.error instanceof HttpErrorResponse) {
      if (typeof this.error.error === 'string') {
        this.displayError = this.error.error;
      } else if (this.error && this.error.error && this.error.error.message) {
        this.displayError = this.error.error.message;
      } else {
        this.displayError = 'Unknown error';
      }
    } else if (typeof this.error === 'string') {
      this.displayError = this.error;
    } else {
      this.displayError = 'Unknown error';
    }
  }
}
