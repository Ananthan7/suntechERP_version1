// import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
// import { CommonServiceService } from 'src/app/services/common-service.service';

// @Directive({
//   selector: '[FourDecimalInput]'
// })
// export class MetalDecimalDirective {
//   constructor(
//     private el: ElementRef,
//     private renderer: Renderer2,
//     private commonService: CommonServiceService,
//   ) {}

//   @HostListener('input', ['$event']) onInput(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const value = input.value;
//     let AMTDECIMAL: any = this.commonService.allbranchMaster?.BMQTYDECIMALS;

//     // Split the value into integer and fractional parts
//     const parts = value.split('.');
//     let integerPart = parts[0];
//     let fractionalPart = parts[1];
//     if (fractionalPart && fractionalPart.length > AMTDECIMAL) {
//       fractionalPart = fractionalPart.slice(0, AMTDECIMAL);
//       input.value = `${integerPart}.${fractionalPart}`;
//     }
//   }

//   @HostListener('blur', ['$event']) onBlur(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     let value = input.value;
//     let AMTCount: any = this.commonService.allbranchMaster?.BMQTYDECIMALS;
//     let zeroArr: any[] = ['', '0', '00', '000', '0000'];
//     let str = '';
//     let x = 1;
//     while (x <= AMTCount) {
//       str += '0';
//       x++;
//     }

//     // Remove non-numeric characters except the decimal point
//     value = value.replace(/[^0-9.]/g, '');

//     // Split the value into integer and fractional parts
//     const parts = value.split('.');
//     let integerPart = parts[0];
//     integerPart = Number(integerPart).toString();
//     let fractionalPart = parts[1];

//     if (!fractionalPart) {
//       fractionalPart = '';
//       fractionalPart += str;
//     }

//     // Always add four decimal places
//     fractionalPart = fractionalPart.padEnd(4, '0');

//     // Reconstruct the value and set it back to the input field
//     value = `${integerPart}.${fractionalPart}`;
//     this.renderer.setProperty(input, 'value', value);
//   }
// }

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Directive({
  selector: '[FourDecimalInput]'
})
export class FourDecimalDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonServiceService,
  ) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let AMTDECIMAL: any = this.commonService.allbranchMaster?.BMQTYDECIMALS;

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts[1];
    if (fractionalPart && fractionalPart.length > AMTDECIMAL) {
      fractionalPart = fractionalPart.slice(0, AMTDECIMAL);
      input.value = `${integerPart}.${fractionalPart}`;
    }
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    let AMTCount: any = this.commonService.allbranchMaster?.BMQTYDECIMALS;
    let str = '0000';

    // Remove non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Split the value into integer and fractional parts
    const parts = value.split('.');
    let integerPart = parts[0];
    integerPart = Number(integerPart).toString();
    let fractionalPart = parts[1];

    // If fractional part is not provided, set it to '.0000'
    fractionalPart = fractionalPart ? fractionalPart : str;

    // Limit the fractional part to the specified decimal places
    if (fractionalPart.length > AMTCount) {
      fractionalPart = fractionalPart.slice(0, AMTCount);
    }

    // Reconstruct the value and set it back to the input field
    value = `${integerPart}.${fractionalPart}`;
    this.renderer.setProperty(input, 'value', value);
  }
}
