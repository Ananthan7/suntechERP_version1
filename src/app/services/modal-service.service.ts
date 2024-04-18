import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailService {
  validatePCS!: boolean;
  blockNegativeStock!: any;
  lineItemPcs!: any;
  lineItemGrossWt!: any;
  private storedItems = new BehaviorSubject<any[]>([]);
  divisionCode!:string;
  isStoneIncluded:boolean = false;

  setData(data: any[]) {
    this.storedItems.next(data);
  }

  getData() {
    return this.storedItems.asObservable();
  }
}