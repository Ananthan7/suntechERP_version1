import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-sales-order-cancellation',
  templateUrl: './pos-sales-order-cancellation.component.html',
  styleUrls: ['./pos-sales-order-cancellation.component.scss']
})
export class PosSalesOrderCancellationComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  orderMaxDate = new Date();

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
