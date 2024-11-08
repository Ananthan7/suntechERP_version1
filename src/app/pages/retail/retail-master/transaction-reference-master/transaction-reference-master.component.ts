import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-reference-master',
  templateUrl: './transaction-reference-master.component.html',
  styleUrls: ['./transaction-reference-master.component.scss']
})
export class TransactionReferenceMasterComponent implements OnInit {
  BranchData:any=[];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,

  ) { }

  transactionform: FormGroup = this.formBuilder.group({
    ref_code:[''],
    client_name:[''],
    client_name_desc:[''],
    ref_date:[''],
    status:[''],
  })

  ngOnInit(): void {
  }

  formSubmit(){

  }

  close(data?: any){
    this.activeModal.close(data);
  }
  BranchDataSelected(event:any){

  }

}
