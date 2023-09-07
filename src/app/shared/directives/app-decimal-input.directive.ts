import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
@Directive({
  selector: '[AmountDecimalInput]'
})
export class AppDecimalInputDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private commonService: CommonServiceService,
    ) { 
  }
  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    let AMTCount:any = this.commonService.allbranchMaster?.BAMTDECIMALS
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
    // this.el.nativeElement.value = value;
    this.renderer.setProperty(input, 'value', value);
  }

  countZeros(string:string) {
    const regex = /0/g;
    const matches = string.match(regex);
    return matches ? matches.length : 0;
  }
 
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let AMTCount:string = this.commonService.allbranchMaster?.BAMTDECIMALS
    let value: string = this.el.nativeElement.value;
    
    const parts = value.split('.');
    // let integerPart:any = parts[0];
    let fractionalPart:any = parts[1];
   
    // // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    // Limit the fractional part to 3 decimal places
    if (fractionalPart && fractionalPart.length >= AMTCount) {
      event.preventDefault();
    }
    
  }

}
