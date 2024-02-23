import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-daily-closing-branch',
  templateUrl: './pos-daily-closing-branch.component.html',
  styleUrls: ['./pos-daily-closing-branch.component.scss']
})
export class PosDailyClosingBranchComponent implements OnInit {

  columnhead:any[] = ['Code','Branch Name'];
  columnheadDetails:any[] = ['Code','Description']
  columnheadDetails1:any[] = ['Code','Description']

  constructor(private activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
