import { CommonModule } from '@angular/common';
import { Directive, NgModule } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: false,
  selector: '[libPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true
    }
  ]
})
export class PasswordValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    const pattern = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.*\d)/;

    if (password && !pattern.test(password)) {
      return { passwordInvalid: true };
    }

    return null;
  }
}

@NgModule({
  declarations: [
    PasswordValidatorDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PasswordValidatorDirective
  ]
})
export class PasswordValidatorModule { }