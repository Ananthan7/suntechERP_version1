import {  Directive, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[UppercaseDirective]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const res = input.value.toUpperCase();
    console.log(input.value,'fires');
    
    input.value = res
  }
}
