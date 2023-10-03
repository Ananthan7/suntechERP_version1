import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './wax-process.component.html',
  styleUrls: ['./wax-process.component.scss']
})
export class WaxProcessComponent implements OnInit {

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
