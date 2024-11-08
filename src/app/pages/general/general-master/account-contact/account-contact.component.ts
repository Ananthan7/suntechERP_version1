import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-account-contact',
  templateUrl: './account-contact.component.html',
  styleUrls: ['./account-contact.component.scss']
})
export class AccountContactComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,


  ) { }

  accountcontactform: FormGroup = this.formBuilder.group({
    mid: [""],
    accountcode: [""],
    accountcodedesc: [""],
    subledgercodedesc: [""],
    name: [""],
    designation: [""],
    emailid: [""],
    pointerwt: [""],
    countrycode: [""],
    country: [""],
    mobilecode: [""],
    mobile: [""],
    mobilecode1: [""],
    mobile1: [""],
    telcode_r: [""],
    tel_r: [""],
    telcode_o: [""],
    tel_o: [""],
    fax_no: [""],
    nationality: [""],
    state: [""],
    city: [""],
    language: [""],
    favorite_festival: [""],
    company: [""],
    gender: [""],
    maritial_status: [""],
    religion: [""],
    category: [""],
    cust_status: [""],
    income: [""],
    blood_group: [""],
    cust_id: [""],
    cust_type: [""],
    po_box: [""],
    spouse_name: [""],
    spouse_mobile: [""],
    spouse_email: [""],
    address: [""],
    official_address: [""],
    delivey_address: [""],
    remarks: [""],
    subledgercode: [""],
   
  });

  ngOnInit(): void {
  }


  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.accountcontactform.controls.sieveset.setValue(e.sieveset);

  }

  
  formSubmit(){

  }

  close(data?: any) {
    this.activeModal.close(data);
  }


}
