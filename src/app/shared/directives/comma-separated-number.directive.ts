import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[CommaSeparatedNumber]'
})
export class CommaSeparatedNumberDirective {

constructor(private el: ElementRef) {}

@HostListener('input', ['$event']) onInputChange(event: any) {
  // Get the input value and remove any existing commas
  let value = event.target.value.replace(/,/g, '');
  // Format the value with commas for thousands
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Update the input field value
  event.target.value = value;
}

}


// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appThousandSeparator]'
// })
// export class ThousandSeparatorDirective {

//   constructor(private el: ElementRef) {}

//   @HostListener('input', ['$event']) onInputChange(event: any) {
//     // Get the input value and remove any existing commas
//     let value = event.target.value.replace(/,/g, '');
//     // Format the value with commas for thousands
//     value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     // Update the input field value
//     event.target.value = value;
//   }
// }
