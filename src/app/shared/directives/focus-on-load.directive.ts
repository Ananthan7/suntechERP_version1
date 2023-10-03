import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[FocusOnLoad]'
})
export class FocusOnLoadDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}