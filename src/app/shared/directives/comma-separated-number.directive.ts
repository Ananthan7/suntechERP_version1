import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[CommaSeparatedNumber]'
})
export class CommaSeparatedNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except '.'
    const parts = value.split('.'); // Split into integer and decimal parts
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add comma for thousands
    value = parts.join('.'); // Join integer and decimal parts with '.'
    input.value = value; // Update input value
  }

}
