import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PcrSelectionComponent } from './pcr-selection/pcr-selection.component';

@Component({
  selector: 'app-advance-return',
  templateUrl: './advance-return.component.html',
  styleUrls: ['./advance-return.component.scss']
})
export class AdvanceReturnComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['SRNO','Branch','ACCODE','Type','Cheque No','Cheque Date','Bank','Currency','Amount FC','Amount LC'];
  pcrSelectionData: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  openaddposdetails() {
    const modalRef: NgbModalRef = this.modalService.open(PcrSelectionComponent, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from modal:', postData);
        this.pcrSelectionData.push(postData);

        this.pcrSelectionData.forEach((data, index) => data.SRNO = index + 1);
      }
    });

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
