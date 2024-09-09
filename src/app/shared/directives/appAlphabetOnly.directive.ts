import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabetOnly]'  // The directive selector
})
export class AlphabetOnlyDirective {
  
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z ]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    // If the character doesn't match the pattern, prevent the input
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
