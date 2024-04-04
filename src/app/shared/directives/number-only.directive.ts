import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[NumberOnly]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef) { }
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    console.log('Key pressed:', event);
    var keyCode = event.which ? event.which : event.keyCode;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8;
    return isValid;  
  }
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
