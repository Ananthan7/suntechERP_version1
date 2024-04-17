import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[NumericFilter]'
})
export class NumericFilterDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/^0+/, '');

    this.renderer.setProperty(input, 'value', value);
  }
}