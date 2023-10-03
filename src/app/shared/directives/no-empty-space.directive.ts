import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Directive({
  selector: '[appNoEmptySpace]'
})
export class NoEmptySpaceDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const trimmedValue = value.toString()?.trimStart();
    const existingErrors = this.control?.control?.errors;

    this.control?.control?.setValue(trimmedValue, { emitEvent: false });

    if (trimmedValue === '') {
      this.control?.control?.setErrors({ ...existingErrors, 'required': true });
    } else {
      if (existingErrors && existingErrors['required']) {
        delete existingErrors['required'];
        this.control?.control?.setErrors({ ...existingErrors });
      }
    }
  }
}
