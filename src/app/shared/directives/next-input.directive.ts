import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNextInput]'
})
export class NextInputDirective {
  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    const form = event.currentTarget as HTMLElement;
    const inputs = Array.from(document.querySelectorAll('input'));
    const index = inputs.indexOf(form as HTMLInputElement);

    if (index >= 0 && index < inputs.length - 1) {
      event.preventDefault();
      const nextInput = inputs[index + 1];
      nextInput.focus();
    }
  }
}
