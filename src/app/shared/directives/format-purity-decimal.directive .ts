import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[PurityDecimal]'
})
export class PurityDecimalDirective {
  @Input() max: any;
  @Input() min: any;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonServiceService,
  ) {
  }
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    const currentValue = event.target.value;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || (keyCode === 46 && currentValue.indexOf('.') === -1);
    return isValid;  
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let AMTDECIMAL: any = this.commonService.allCompanyParameters?.PURITYDECIMALS

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = this.commonService.emptyToZero(parts[0]).toString();
    let fractionalPart = parts[1];
    if (this.max && integerPart.length > this.max) {
      integerPart = integerPart.slice(0, this.max);
      input.value = `${integerPart}.${fractionalPart ? fractionalPart : ''}`;
    }
    if (fractionalPart && fractionalPart.length > AMTDECIMAL) {
      fractionalPart = fractionalPart.slice(0, AMTDECIMAL);
      input.value = `${integerPart}.${fractionalPart}`;
    }
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const formatString = this.commonService.allCompanyParameters?.METALRATEFORMAT;

    if (value === '') {
      value = '0';
    }

    // Remove non-numeric characters except the decimal point
    value = value.replace(/[^0-9.-]/g, '');

    // Apply the custom format string
    value = this.applyFormat(value, formatString);
    
    // Set the formatted value back to the input field
    this.renderer.setProperty(input, 'value', value);
  }

  private applyFormat(value: string, formatString: string): string {
    // Extract the number of decimal places from the format string
    const match = formatString.match(/\.(0+)/);
    const decimalPlaces = match ? match[1].length : 0;

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts[1] || '';

    // Limit the fractional part to the specified decimal places
    if (fractionalPart.length > decimalPlaces) {
      fractionalPart = fractionalPart.slice(0, decimalPlaces);
    }

    // Add trailing zeros if necessary
    while (fractionalPart.length < decimalPlaces) {
      fractionalPart += '0';
    }

    // Format the integer part with commas
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Reconstruct the formatted value
    let formattedValue = integerPart;
    if (decimalPlaces > 0) {
      formattedValue += '.' + fractionalPart;
    }

    return formattedValue;
  }
}
