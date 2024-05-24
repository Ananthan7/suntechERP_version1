import {  Directive, ElementRef, HostListener, Renderer2  } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[UpperCaseDirective]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const res = input.value.toString().toUpperCase();
    console.log(input.value,'fires');
    this.renderer.setProperty(input, 'value', res);

  }
}
