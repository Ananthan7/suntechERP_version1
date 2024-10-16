import { Directive, HostListener, ElementRef } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[LimitlessDecimalInput]'
})
export class DecimalInputDirective {

  constructor(private el: ElementRef,private commonService: CommonServiceService) { }
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    const currentValue = event.target.value;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || (keyCode === 46 && currentValue.indexOf('.') === -1);
    return isValid;  
  }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    const sanitizedValue = value.replace(/[^0-9.]/g, '')
    let num = input.value;
    if (value !== sanitizedValue) {
      num = sanitizedValue; // Update the input field with the sanitized value
    }
    num = this.commonService.commaSeperation(num)
    input.value = num
    input.dispatchEvent(new Event('input')); // Trigger an input event to propagate changes
  }
}
