import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[RestrictNegative]'
})
export class RestrictNegativeDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}