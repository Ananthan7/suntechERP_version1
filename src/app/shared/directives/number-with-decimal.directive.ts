import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[NumberDecimalInput]'
})
export class DecimalInputDirective {

  constructor(private el: ElementRef) { }
  decimalCount: number = 0
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    console.log('Key pressed:', event.target.value);
    var keyCode = event.which ? event.which : event.keyCode;
    if(keyCode === 46){
      this.decimalCount+=1
    }
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || (keyCode === 46 && this.decimalCount==1);
    return isValid;  
  }
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
