import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[numericInput]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    const sanitizedValue = value.replace(/[^0-9]/g, '')

    if (value !== sanitizedValue) {
      input.value = sanitizedValue; // Update the input field with the sanitized value
      input.dispatchEvent(new Event('input')); // Trigger an input event to propagate changes
    }
  }
}
