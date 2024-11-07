import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-set-ref-master',
  templateUrl: './set-ref-master.component.html',
  styleUrls: ['./set-ref-master.component.scss']
})
export class SetRefMasterComponent implements OnInit {

  tableData:any = [];
  BranchData: MasterSearchModel = {}

  SetRefMasterForm: FormGroup = this.formBuilder.group({
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


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(e:any){

  }
}
