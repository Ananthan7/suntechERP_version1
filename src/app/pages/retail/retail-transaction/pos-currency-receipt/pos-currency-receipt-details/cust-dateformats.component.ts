import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";


export const DATE_FORMAT_1 = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMAT_2 = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MM/YYYY', // Make sure this property is present
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[dateFormat1]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_1 }],
})
export class CustomDateFormat1 {}

@Directive({
  selector: '[dateFormat2]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2 }],
})
export class CustomDateFormat2 {}
