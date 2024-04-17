import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailService {

  private storedItems = new BehaviorSubject<any[]>([]);

  setData(data: any[]) {
    this.storedItems.next(data);
  }

  getData() {
    return this.storedItems.asObservable();
  }
}