import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-advance-return',
  templateUrl: './advance-return.component.html',
  styleUrls: ['./advance-return.component.scss']
})
export class AdvanceReturnComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['SRNO','Branch','ACCODE','Type','Cheque No','Cheque Date','Bank','Currency','Amount FC','Amount LC'];

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
