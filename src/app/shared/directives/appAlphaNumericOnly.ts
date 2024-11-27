import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumericOnly]' // The directive selector
})
export class AlphaNumericOnlyDirective {
  
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z0-9]*$/; // Updated pattern: Only letters and numbers
    const inputChar = String.fromCharCode(event.charCode);

    // Prevent input if it doesn't match the pattern
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
