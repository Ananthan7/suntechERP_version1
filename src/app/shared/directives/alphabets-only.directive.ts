import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAlphabetsOnly]'
})
export class AlphabetsOnlyDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const transformed = input.value.replace(/[^a-zA-Z\s]/g, '');
    
    this.renderer.setProperty(input, 'value', transformed);
    
    input.setSelectionRange(start, end);
  }
}
