import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetalIssueDetailsComponent } from './metal-issue-details/metal-issue-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './metal-issue.component.html',
  styleUrls: ['./metal-issue.component.scss']
})
export class MetalIssueComponent implements OnInit {

  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [''];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddmetalissue() {
    const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  metalIssueForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    time: [''],
    vocDate: [''],
    enteredBy: [''],
    vocNo: [''],
    worker: [''],
    workerDes: [''],
    remarks: [''],   
  });

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "UNIQUEID": 12345,
      "APPR_CODE": "test",
      "SRNO": srno,
      "USER_CODE": "",
      "APPR_TYPE": "",
      "APPRREQUIRED": false,
      "ATTACH_REQ": false,
      "ORG_MESSAGE": false,
      "EMAIL": false,
      "SYS_MESSAGE": false,
      "EMAIL_ID": "test",
      "MOBILE_NO": "1234567890"
    };
    this.tableData.push(data);
  }
}
