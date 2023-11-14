import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-price-master',
  templateUrl: './customer-price-master.component.html',
  styleUrls: ['./customer-price-master.component.scss']
})
export class CustomerPriceMasterComponent implements OnInit {

  divisionMS: any = 'ID';
  columnheader:any[] = ['','',];

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
