import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[NumberDecimalInput]'
})
export class DecimalInputDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove non-numeric and non-decimal characters except for one decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Ensure there is at most one decimal point
    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
      const parts = value.split('.');
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    // Set the cleaned value back to the input field
    input.value = value;
  }
}
