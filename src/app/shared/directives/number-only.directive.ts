import { Directive, HostListener, ElementRef } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[NumberOnly]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef,private commonService: CommonServiceService) { }
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    console.log('Key pressed:', event);
    var keyCode = event.which ? event.which : event.keyCode;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8;
    return isValid;  
  }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    const sanitizedValue = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    let num = input.value;
    if (value !== sanitizedValue) {
      num = sanitizedValue; 
    }
    const formattedNum =num;
    if (input.value !== formattedNum) {
      input.value = formattedNum;
      input.dispatchEvent(new Event('input')); 
    }
  }
}
