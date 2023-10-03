import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetalIssueDetailsComponent } from './metal-issue-details/metal-issue-details.component';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './metal-issue.component.html',
  styleUrls: ['./metal-issue.component.scss']
})
export class MetalIssueComponent implements OnInit {

  currentFilter: any;
  divisionMS: any = 'ID';

  columnhead: any[] = ['SRNO', 'VOCNO', 'VOCTYPE', 'VOCDATE', 'JOB_NO', 'JOB_SO ', 'UNQ_JOB', 'JOB_DE', 'BRANCH'];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }
  openaddmetalissue() {
    const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
}
