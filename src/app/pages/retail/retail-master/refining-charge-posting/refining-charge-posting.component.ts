import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-refining-charge-posting',
  templateUrl: './refining-charge-posting.component.html',
  styleUrls: ['./refining-charge-posting.component.scss']
})
export class RefiningChargePostingComponent implements OnInit {

  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  refiningChargePostingMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    vocDate:[''],
    Branch:[''],
    BranchDes:[''],
    Active:[true],
    address:[''],
    DailyTarget:[''],
    BRANCH_CODE:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,

  ) {  }

  ngOnInit(): void {
  }

  setNewFormValues() {
    this.refiningChargePostingMasterForm.controls.BRANCH_CODE.setValue(this.comService.branchCode)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(e:any){

  }

}
