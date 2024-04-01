import { Pipe, PipeTransform } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {
  constructor(private commonService: CommonServiceService) {}

  transform(value: any, flag: string): any {
    let normalizedValue = value;

    if (typeof value === 'string' && value.trim() !== '') {
      const parsedValue = Number(value);
      if (!isNaN(parsedValue)) {
        normalizedValue = parsedValue;
      } else {
        return '0.00'; 
      }
    }

    if (normalizedValue === undefined || normalizedValue === null || isNaN(normalizedValue)) {
      return '0.00';
    }

    
    return this.commonService.commaSeperation(this.commonService.decimalQuantityFormat(normalizedValue, flag));
  }
}
