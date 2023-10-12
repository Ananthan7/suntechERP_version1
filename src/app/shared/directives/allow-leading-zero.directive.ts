import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowLeadingZero]'
})
export class AllowLeadingZeroDirective {

  constructor(private el: ElementRef) {
  }


  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value.toString().trim();
    const res = value.replace(/\D+/g, '');
    input.value = res;
  }

}