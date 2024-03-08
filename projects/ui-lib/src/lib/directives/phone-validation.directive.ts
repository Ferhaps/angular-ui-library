import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneValidation]',
  standalone: true
})
export class PhoneValidationDirective {
  @HostListener('input', ['$event']) public onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    if (!input.value.includes('+')) {
      input.value = `+${input.value}`;
    }
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
