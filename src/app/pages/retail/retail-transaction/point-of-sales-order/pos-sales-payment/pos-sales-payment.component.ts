import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-sales-payment',
  templateUrl: './pos-sales-payment.component.html',
  styleUrls: ['./pos-sales-payment.component.scss']
})
export class PosSalesPaymentComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  continueClick(){}

}
