import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[DateValidation]'
})
export class DateValidationDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const inputValue: string = inputElement.value;

    // Remove any characters that do not match the desired date format (YYYY-MM-DD)
    const cleanedValue: string = inputValue.replace(/[^0-9\/]/g, '');

    // Limit the input length to the expected date format length (e.g., 10 characters for YYYY-MM-DD)
    if (cleanedValue.length >= 10) {
      inputElement.value = cleanedValue.slice(0, 10);
    } else {
      inputElement.value = cleanedValue;
    }
  }
  @HostListener('keypress', ['$event'])
  onKeypress(event: KeyboardEvent) {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const inputValue: string = inputElement.value;

    // Check if the input matches the 'dd/mm/yyyy' format
    if(inputValue.length == 2 || inputValue.length == 5){
      inputElement.value = inputValue + '/';
    }
    if(this.hasTwoSlashes(inputValue)){
      inputElement.value = ''
    }
  }
  hasTwoSlashes(str:any) {
    const slashCount = (str.match(/\//g) || []).length;
    return slashCount > 2;
  }
  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const inputValue: string = inputElement.value;

    // Limit the input length to the expected date format length (e.g., 10 characters for YYYY-MM-DD)
    if (inputValue.length > 9) {
      inputElement.value = inputValue.slice(0, 10);
    } else {
      inputElement.value = inputValue;
    }
  }
}
