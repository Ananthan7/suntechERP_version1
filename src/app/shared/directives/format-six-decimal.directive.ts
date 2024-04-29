import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
@Directive({
  selector: '[SixDecimalInput]'
})
export class FormatSixDecimalDirective {
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
    let AMTDECIMAL:any = 6 //hardcoded for six decimal

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
    let AMTCount:any = 6 //hardcoded for six decimal
    let zeroArr:any[] = ['','0','00','000','0000']
    let str = ''
    let x = 1
    while(x <= AMTCount){
      str+='0'
      x++;
    }
    if(value == ''){
      value = `${0}.${str}`;
      // this.el.nativeElement.value = value;
       this.renderer.setProperty(input, 'value', value);
    }
    // Remove non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = parts[0];
    integerPart = Number(integerPart).toString()
    let fractionalPart = parts[1];
   
    
    if(!fractionalPart){
      fractionalPart = ''
      fractionalPart += str;
    }
    // Limit the fractional part to 3 decimal places
    if (fractionalPart.length > AMTCount) {
      fractionalPart = fractionalPart.slice(0, AMTCount);
    }
    let strzero = ''
    let count = 1
    let addedzero = (AMTCount)-(fractionalPart.length)
    while(count <= addedzero){
      strzero+='0'
      count++;
    }
    if (fractionalPart && AMTCount > fractionalPart.length) {
      fractionalPart += strzero;
    }
    // Reconstruct the value and set it back to the input field
    value = `${integerPart}.${fractionalPart}`;
    value = this.commonService.commaSeperation(value)
    // this.el.nativeElement.value = value;
    this.renderer.setProperty(input, 'value', value);
  }
}
