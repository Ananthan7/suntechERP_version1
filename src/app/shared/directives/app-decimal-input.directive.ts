import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
@Directive({
  selector: '[ThreeDecimalInput]'
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
    // Remove non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts[1];
   
    let AMTCount:any = 3
    
    let zeroArr:any[] = ['','0','00','000','0000']
    
    // Limit the fractional part to 3 decimal places
    if (fractionalPart.length > AMTCount) {
      event.preventDefault();
    }
    if (fractionalPart && AMTCount > fractionalPart.length) {
      fractionalPart += zeroArr[AMTCount-fractionalPart.length]; // If there's one decimal, add two zeros
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
    // let AMTCount:any = this.countZeros(this.commonService.amtFormat)
    let regex: RegExp = new RegExp(/^\d*\.?\d{0,3}$/g);

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

}
