import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[libPhoneValidation]',
})
export class PhoneValidationDirective {
  @HostListener('input', ['$event']) public onInput(event: Event) {
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

  @HostListener('keydown', ['$event']) public onKeyDown(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.key === 'Backspace' && inputValue === '+') {
      event.preventDefault();
    }
  }
}
