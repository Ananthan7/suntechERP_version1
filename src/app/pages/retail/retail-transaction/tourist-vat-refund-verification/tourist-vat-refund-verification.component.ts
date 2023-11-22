import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tourist-vat-refund-verification',
  templateUrl: './tourist-vat-refund-verification.component.html',
  styleUrls: ['./tourist-vat-refund-verification.component.scss']
})
export class TouristVatRefundVerificationComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['Sr.No','VOCDATE','TRD NO','VOCT_','VOC','Sales Amt','Planent Amt','VAT Amt','Planet Vat Amt'];

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
