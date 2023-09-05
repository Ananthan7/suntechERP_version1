import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[numericInput]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Remove non-numeric characters
    input.value = value.replace(/[^0-9]/g, '');
  }
}
