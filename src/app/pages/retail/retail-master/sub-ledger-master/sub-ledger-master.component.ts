import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-sub-ledger-master',
  templateUrl: './sub-ledger-master.component.html',
  styleUrls: ['./sub-ledger-master.component.scss']
})
export class SubLedgerMasterComponent implements OnInit {

  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  SubLedgerMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    vocDate:[''],
    Branch:[''],
    BranchDes:[''],
    Active:[true],
    address:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(e:any){

  }
}
