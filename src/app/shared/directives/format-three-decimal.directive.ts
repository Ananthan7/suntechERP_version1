import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[ThreeDecimalInput]'
})
export class FormatThreeDecimalDirective {
  @Input() max: any;
  @Input() min: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonServiceService,
  ) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    const keyCode = event.which ? event.which : event.keyCode;
    const currentValue = event.target.value;
    const isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || (keyCode === 46 && currentValue.indexOf('.') === -1) || (keyCode === 45 && currentValue.indexOf('-') === -1);
    return isValid;
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const AMTDECIMAL = 3;

    const isNegative = value.charAt(0) === '-';
    const parts = value.split('.');
    let integerPart = this.commonService.emptyToZero(parts[0]).toString();
    if (isNegative && integerPart === '0') {
      integerPart = '-' + integerPart;
    }
    let fractionalPart = parts[1];

    if (this.max && integerPart.replace('-', '').length > this.max) {
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
    const AMTCount = 3;
    const zeroArr = ['', '0', '00', '000', '0000'];
    let str = '';
    let x = 1;
    while (x <= AMTCount) {
      str += '0';
      x++;
    }

    if (value === '') {
      value = `0.${str}`;
      this.renderer.setProperty(input, 'value', value);
      return;
    }

    const isNegative = value.charAt(0) === '-';

    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    let integerPart = parts[0];
    if (isNegative) {
      integerPart = '-' + integerPart;
    }
    integerPart = Number(integerPart).toString();

    let fractionalPart = parts[1] || '';
    if (!fractionalPart) {
      fractionalPart = '';
      fractionalPart += str;
    }

    if (fractionalPart.length > AMTCount) {
      fractionalPart = fractionalPart.slice(0, AMTCount);
    }

    let strzero = '';
    let count = 1;
    let addedzero = (AMTCount) - (fractionalPart.length);
    while (count <= addedzero) {
      strzero += '0';
      count++;
    }

    if (fractionalPart && AMTCount > fractionalPart.length) {
      fractionalPart += strzero;
    }

    value = `${integerPart}.${fractionalPart}`;
    value = this.commonService.commaSeperation(value);
    if (isNegative && !value.startsWith('-')) {
      value = '-' + value;
    }
    this.renderer.setProperty(input, 'value', value);
  }
}
