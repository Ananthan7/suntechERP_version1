import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-design-sequence',
  templateUrl: './design-sequence.component.html',
  styleUrls: ['./design-sequence.component.scss']
})
export class DesignSequenceComponent implements OnInit {

  columnhead:any[]=['SRNO','PROCESS_CODE','POINTS','STD_LOSS','MAX_LOSS','STD_TIME','LOSS_ACCODE','WIP_ACCODE','TIMEON_P']
  designSequenceForm: FormGroup = this.formBuilder.group({
    processCode:[''],
    processDesc:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeSelected(e:any){
    console.log(e);
    this.designSequenceForm.controls.processCode.setValue(e.SEQ_CODE);
    this.designSequenceForm.controls.processDesc.setValue(e.DESCRIPTION);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }

  deleteRecord(){

  }
}
