import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[DynamicIntInputDirective]",
})
export class DynamicIntInputDirective {
  @Input() maxIntegerDigits!: number;
  @Input() maxDecimalDigits!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener("keypress", ["$event"]) onKeyPress(
    event: KeyboardEvent
  ): boolean {
    const keyCode = event.which || event.keyCode;
    const inputValue = this.el.nativeElement.value;

    const isNumberKey = keyCode >= 48 && keyCode <= 57;
    const isDotKey = keyCode === 46;
    const hasDecimalPoint = inputValue.includes(".");

    if (isNumberKey || (isDotKey && !hasDecimalPoint)) {
      return true;
    }
    return false;
  }

  @HostListener("input", ["$event"]) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    const [integerPart, decimalPart] = value.split(".");

    const limitedIntegerPart = integerPart.slice(0, this.maxIntegerDigits);

    const limitedDecimalPart = decimalPart
      ? decimalPart.slice(0, this.maxDecimalDigits)
      : "";

    input.value = limitedDecimalPart
      ? `${limitedIntegerPart}.${limitedDecimalPart}`
      : limitedIntegerPart;
  }

  @HostListener("blur", ["$event"]) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value.endsWith(".")) {
      value = value.slice(0, -1);
    }

    if (!value) {
      value = "0";
    }

    this.renderer.setProperty(input, "value", value);
  }
}
