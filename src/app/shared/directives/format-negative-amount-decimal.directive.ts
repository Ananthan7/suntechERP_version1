import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[NegativeAmountDecimal]'
})
export class NegativeAmountDecimalDirective {
  @Input() max: any;
  @Input() min: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonServiceService,
  ) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    const currentValue = event.target.value;

    var isValid = 
      (keyCode >= 48 && keyCode <= 57) || 
      keyCode === 8 || 
      (keyCode === 46 && currentValue.indexOf('.') === -1) ||
      (keyCode === 45 && currentValue.indexOf('-') === -1 && currentValue === ''); 

    return isValid;
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const isNegative = value.startsWith('-');

    let AMTDECIMAL: any = this.commonService.allbranchMaster?.BAMTDECIMALS;

    value = isNegative ? value.substring(1) : value;

    const parts = value.split('.');
    let integerPart = this.commonService.emptyToZero(parts[0]).toString();
    let fractionalPart = parts[1];

    if (this.max && integerPart.length > this.max) {
      integerPart = integerPart.slice(0, this.max);
    }

    if (fractionalPart && fractionalPart.length > AMTDECIMAL) {
      fractionalPart = fractionalPart.slice(0, AMTDECIMAL);
    }

    input.value = `${isNegative ? '-' : ''}${integerPart}${fractionalPart ? '.' + fractionalPart : ''}`;
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const formatString = this.commonService.allbranchMaster?.BAMTFORMAT_NET;

    if (value === '') {
      value = '0';
    }

    value = value.replace(/[^0-9.-]/g, '');

    value = this.applyFormat(value, formatString);

    this.renderer.setProperty(input, 'value', value);
  }

  private applyFormat(value: string, formatString: string): string {
    const match = formatString.match(/\.(0+)/);
    const decimalPlaces = match ? match[1].length : 0;

    const isNegative = value.startsWith('-');
    value = isNegative ? value.substring(1) : value;

    const parts = value.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts[1] || '';

    if (fractionalPart.length > decimalPlaces) {
      fractionalPart = fractionalPart.slice(0, decimalPlaces);
    }

    while (fractionalPart.length < decimalPlaces) {
      fractionalPart += '0';
    }

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let formattedValue = integerPart;
    if (decimalPlaces > 0) {
      formattedValue += '.' + fractionalPart;
    }

    return isNegative ? `-${formattedValue}` : formattedValue;
  }
}
