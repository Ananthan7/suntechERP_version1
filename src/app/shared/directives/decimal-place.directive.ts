// decimal-places.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimalPlaces]'
})
export class DecimalPlacesDirective {
  @Input() decimalPlaces: number = 3; // Change this to the desired number of decimal places

  constructor(private el: ElementRef) { }
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    console.log('Key pressed:', event);
    var keyCode = event.which ? event.which : event.keyCode;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || keyCode === 46;
    return isValid;
  }
  @HostListener('input', ['$event']) onInput(event: any): void {
    const inputVal: string = event.target.value;
    const decimalIndex: number = inputVal.indexOf('.');

    if (decimalIndex !== -1 && inputVal.length - decimalIndex > this.decimalPlaces + 1) {
      // Limit the number of decimal places
      event.target.value = parseFloat(inputVal).toFixed(this.decimalPlaces);
    }
  }
}