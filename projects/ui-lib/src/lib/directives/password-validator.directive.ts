import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
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

    // At least one uppercase letter, one lowercase letter, one digit, one special character, and minimum eight characters long
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*\d).{8,}$/

    if (password && !pattern.test(password)) {
      return { passwordInvalid: true };
    }

    return null;
  }
}
