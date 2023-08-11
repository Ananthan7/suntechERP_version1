import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormatter'
})
export class NumberFormatterPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value >= 1000000) {
      // Convert to millions
      const millions = value / 1000000;
      return this.formatDecimal(millions, 2) + "M";
    } else if (value >= 1000) {
      // Convert to thousands
      const thousands = value / 1000;
      return this.formatDecimal(thousands, 1) + "K";
    } else if(value < 1000 && value > 1){
      return Math.trunc(value);
    } else if (value < 1 && value > -1) {
      return value.toFixed(4);
    }else if (!value){
      return 0
    }
    return value.toFixed(1);
  }

  formatDecimal(number:any, decimalPlaces:any) {
    const multiplier = Math.pow(10, decimalPlaces);
    const roundedValue = Math.floor(number * multiplier) / multiplier;
    return roundedValue.toFixed(decimalPlaces);
  }

 // if (value >= 1000000) {
    //   return (Math.trunc(value) / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    // }
    // if (value >= 1000) {
    //   return (Math.trunc(value) / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    // }
    // if (value >= 1000000) {
    //   // Convert to millions
    //   const millions = value / 1000000;
    //   return Math.floor(millions) + "M";
    // } else if (value >= 1000) {
    //   // Convert to thousands
    //   const thousands = value / 1000;
    //   return Math.floor(thousands) + "K";
    // }
}
