import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appApplyOnlyNumbers]'
})
export class ApplyOnlyNumbersDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;

    // Schedule update to run after Angular change detection cycle completes
    setTimeout(() => {
      const transformed = input.value.replace(/[^0-9]/g, '');
      if (input.value !== transformed) {
        this.renderer.setProperty(input, 'value', transformed);
      }
    }, 0);
  }
}
