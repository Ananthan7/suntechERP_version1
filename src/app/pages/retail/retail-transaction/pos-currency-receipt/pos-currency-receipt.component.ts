import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-currency-receipt',
  templateUrl: './pos-currency-receipt.component.html',
  styleUrls: ['./pos-currency-receipt.component.scss']
})
export class PosCurrencyReceiptComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  formSubmit() {

  }
  deleteWorkerMaster() {

  }

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }
  ngOnInit(): void {
  }

}
