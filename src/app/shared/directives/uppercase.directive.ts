import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[UpperCaseDirective]",
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener("input", ["$event"])
  onInputChange(event: Event) {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const transformedValue = input.value.toUpperCase();

    input.value = transformedValue;
    this.control.control?.setValue(transformedValue, { emitEvent: false });

    input.setSelectionRange(start, end);
  }
}
