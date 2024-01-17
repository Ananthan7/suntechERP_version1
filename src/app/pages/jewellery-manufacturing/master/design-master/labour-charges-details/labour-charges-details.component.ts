import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-labour-charges-details',
  templateUrl: './labour-charges-details.component.html',
  styleUrls: ['./labour-charges-details.component.scss']
})
export class LabourChargesDetailsComponent implements OnInit {

  columnhead:any[]=['SRNO','Code','Type','Method','Division','Shape','SizeFrom','SizeTo','Unit','SellingRate','']
  labourChargesDetailsForm: FormGroup = this.formBuilder.group({
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
