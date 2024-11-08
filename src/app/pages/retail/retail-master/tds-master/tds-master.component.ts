import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tds-master',
  templateUrl: './tds-master.component.html',
  styleUrls: ['./tds-master.component.scss']
})
export class TdsMasterComponent implements OnInit {


  BranchData:any=[];
  maindetails:any=[];
  
  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  tdsform: FormGroup = this.formBuilder.group({
    section_code:[''],
    financial_year:[''],
    description:[''],
    credit_ac:[''],
    debit_ac:[''],
    call:[''],
  })

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){

  }

  
  BranchDataSelected(e:any){

  }

}
