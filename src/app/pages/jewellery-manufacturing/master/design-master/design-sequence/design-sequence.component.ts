import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }

  deleteRecord(){

  }
}
