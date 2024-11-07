import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-general-document-master',
  templateUrl: './general-document-master.component.html',
  styleUrls: ['./general-document-master.component.scss']
})
export class GeneralDocumentMasterComponent implements OnInit {

  BranchData:any=[];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  
  generaldocumentform: FormGroup = this.formBuilder.group({
    code:[''],
    description:[''],
    reminderdays:[''],
    cust_applicable:[''],
    cust_mandatory:[''],
    branch_applicable:[''],
    branch_mandatory:[''],
    supplier_applicable:[''],
    supplier_mandatory:[''],
    employee_applicable:[''],
    employee_mandatory:[''],
    user_defined_1:[''],
    user_defined_2:[''],
    user_defined_3:[''],
    user_defined_4:[''],
    user_defined_5:[''],
    user_defined_6:[''],
    user_defined_7:[''],
    user_defined_8:[''],
    user_defined_9:[''],
    user_defined_10:[''],
    user_defined_11:[''],
    user_defined_12:[''],
    user_defined_13:[''],
    user_defined_14:[''],
    user_defined_15:[''],
  })

  ngOnInit(): void {
  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }

  BranchDataSelected(e:any){

  }



}
