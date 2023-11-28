import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-customer-master-main',
  templateUrl: './pos-customer-master-main.component.html',
  styleUrls: ['./pos-customer-master-main.component.scss']
})
export class PosCustomerMasterMainComponent implements OnInit {

  
  vocMaxDate = new Date();
  currentDate = new Date();
 

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}
