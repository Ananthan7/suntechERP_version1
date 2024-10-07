import { Directive, HostListener, ElementRef } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[NumberOnlyWithoutComma]'
})
export class NumericWithoutCommaDirective {

  constructor(private el: ElementRef, private commonService: CommonServiceService) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    console.log('Key pressed:', event);
    const keyCode = event.which ? event.which : event.keyCode;
    const isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8;
    return isValid;  
  }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    const sanitizedValue = value.replace(/[^0-9]/g, '').replace(/^0+/, '');

    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
      input.dispatchEvent(new Event('input')); 
    }
  }
}
