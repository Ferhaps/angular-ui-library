import { Directive } from '@angular/core';

@Directive({
  selector: '[libPhoneValidation]',
  host: {
    '(input)': 'onInput($event)',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class PhoneValidationDirective {
  public onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (!input.value.includes('+')) {
      input.value = `+${input.value}`;
    }
    
    // Only allow digits and plus sign
    const regex = /^[0-9+]*$/;
    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^0-9+]/g, '');
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.key === 'Backspace' && inputValue === '+') {
      event.preventDefault();
    }
  }
}
