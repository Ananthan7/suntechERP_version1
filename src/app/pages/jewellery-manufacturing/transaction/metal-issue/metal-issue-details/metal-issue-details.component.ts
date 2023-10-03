import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-issue-details',
  templateUrl: './metal-issue-details.component.html',
  styleUrls: ['./metal-issue-details.component.scss']
})
export class MetalIssueDetailsComponent implements OnInit {

  columnhead:any[] = ['SRNO','VOCNO','VOCTYPE', 'VOCDATE','JOB_NO','JOB_SO ','UNQ_JOB','JOB_DE','BRANCH'];
  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }
}
