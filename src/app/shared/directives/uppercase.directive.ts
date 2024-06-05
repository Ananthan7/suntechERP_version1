import {  Directive, ElementRef, HostListener, Renderer2  } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[UpperCaseDirective]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  @HostListener('keyup') onKeyUp() {
    this.transformToUppercase();
  }

  private transformToUppercase() {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Convert only letters to uppercase
    input.value = input.value?.trimStart().replace(/[a-z]/g, (char: string) => char.toUpperCase());

    // Restore the cursor position
    input.setSelectionRange(start, end);
  }
  // @HostListener('input', ['$event']) onInputChange(event: Event): void {
  //   const input = this.el.nativeElement as HTMLInputElement;
  //   const res = input.value.toString().toUpperCase();
  //   console.log(input.value,'fires');
  //   this.renderer.setProperty(input, 'value', res);

  // }
}
