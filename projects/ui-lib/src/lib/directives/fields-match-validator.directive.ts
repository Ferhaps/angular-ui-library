import { CommonModule } from '@angular/common';
import { Directive, input, NgModule } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  standalone: false,
  selector: '[libFieldsMatchValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FieldsMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class FieldsMatchValidatorDirective implements Validator {
  public fieldToMatch = input.required<string>();

  public validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const matchingControl = control.root.get(this.fieldToMatch());
    if (!matchingControl) {
      return null;
    }

    if (value !== matchingControl.value) {
      return { mismatch: true };
    }

    return null;
  }
}

@NgModule({
  declarations: [
    FieldsMatchValidatorDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FieldsMatchValidatorDirective
  ]
})
export class FieldsMatchModule { }
