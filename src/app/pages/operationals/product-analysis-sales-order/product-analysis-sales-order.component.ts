import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-analysis-sales-order',
  templateUrl: './product-analysis-sales-order.component.html',
  styleUrls: ['./product-analysis-sales-order.component.scss']
})
export class ProductAnalysisSalesOrderComponent implements OnInit {
  currentDate = new Date(new Date());

  branchList: string[] = [''];
  branchFilteredOptions: Observable<string[]> | undefined;

  productList = [
    {
      img: 'assets/images/ring.png',
      designCode: 'RN0071',
      name: 'RING WITH EMERALD',
      stockCode: '105',
      vendorRef: 'John',
      qty: '15',
      sellingPrice: '10,000',
      branchSold: 'MOE',
      ageingDays: '18',
      date: new Date()

    },
    {
      img: 'assets/images/bangle.png',
      designCode: 'BNG0091',
      name: 'BANGLE WITH EMERALD',
      stockCode: '105',
      vendorRef: 'Alex',
      qty: '40',
      sellingPrice: '10,000',
      branchSold: 'MOE',
      ageingDays: '18',
      date: new Date()

    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
