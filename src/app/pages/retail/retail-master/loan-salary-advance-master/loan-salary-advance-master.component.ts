import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-loan-salary-advance-master',
  templateUrl: './loan-salary-advance-master.component.html',
  styleUrls: ['./loan-salary-advance-master.component.scss']
})
export class LoanSalaryAdvanceMasterComponent implements OnInit {

  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  LoanSalaryAdvanceMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    vocDate:[''],
    Branch:[''],
    BranchDes:[''],
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
