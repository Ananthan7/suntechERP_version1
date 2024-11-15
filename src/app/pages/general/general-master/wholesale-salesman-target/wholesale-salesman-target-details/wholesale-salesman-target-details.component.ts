import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-wholesale-salesman-target-details',
  templateUrl: './wholesale-salesman-target-details.component.html',
  styleUrls: ['./wholesale-salesman-target-details.component.scss']
})
export class WholesaleSalesmanTargetDetailsComponent implements OnInit {
  selectedDivision: string ="";
  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,


  ) { }

  typeList: any[] = [{ field: "None" }, { field:"Category"}, { field:"Sub Category"}, 
    { field:"Brand Code"}, { field:"Karat"}, { field:"Type"}, { field:"Country"}, { field:"Cost Code"}];

    divisionlist: any[] = [
      { field: 'Diamond', value: 'd' },
      { field: 'Metal', value: 'm' }
    ];
    targetonlist:any []=[{field:"Sales Amount"},{field:"Gp"}];

  wholesaledetailsform: FormGroup = this.formBuilder.group({
    detail_target_code: [""],
    description: [""],
    division: [""],
    target_on: [""],
    customer: [""],
    country: [""],
    area: [""],
    divisions: [""],
    type1: [""],
    detail_target_code1: [""],
    type2: [""],
    detail_target_code2: [""],
    type3: [""],
    detail_target_code3: [""],
    target_selection: [""],
    target_amount: [""],
   
  });

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  selectedcustomercode(e:any){
    console.log(e);
    this.wholesaledetailsform.controls.customer.setValue(e.ACCODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  countrySelected(value: any) {
    console.log(value);
    this.wholesaledetailsform.controls.country.setValue(value.CODE);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e);
    this.wholesaledetailsform.controls.divisions.setValue(e.DIVISION_CODE);
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
    this.wholesaledetailsform.controls.sieveset.setValue(e.sieveset);

  }

  ngOnInit(): void {
  }

  formSubmit(){


    const postData = {
      "SLNO": 0,
      "TARGET_CODE": this.wholesaledetailsform.controls.detail_target_code.value,
      "SALESPERSON_CODE": "string",
      "CUSTOMER": this.wholesaledetailsform.controls.customer.value,
      "DIA_OR_MTL": this.wholesaledetailsform.controls.division.value,
      "DIVISIONS": this.wholesaledetailsform.controls.divisions.value,
      "INVFILT1_VALUES": this.wholesaledetailsform.controls.type1.value,
      "INVFILT2_VALUES": this.wholesaledetailsform.controls.type2.value,
      "INVFILT3_VALUES":this.wholesaledetailsform.controls.type3.value,
      "INVFILT1_FIELD": this.wholesaledetailsform.controls.detail_target_code1.value,
      "INVFILT2_FIELD": this.wholesaledetailsform.controls.detail_target_code2.value,
      "INVFILT3_FIELD": this.wholesaledetailsform.controls.detail_target_code3.value,
      "DT_TARGETCODE": this.wholesaledetailsform.controls.detail_target_code.value,
      "FYEARCODE": "stri",
      "SERVICE_FILTER": "string",
      "TARGET_ON": this.wholesaledetailsform.controls.target_on.value,
      "TARGET": this.wholesaledetailsform.controls.target_amount.value,
      "COUNTRY":this.wholesaledetailsform.controls.country.value,
      "AREA": this.wholesaledetailsform.controls.area.value,
      "NARRATION": this.wholesaledetailsform.controls.target_selection.value,
      "TARGET_DESC": this.wholesaledetailsform.controls.description.value
    }
    console.log(postData);
    this.close(postData);

  }

  close(data?:any){
    this.activeModal.close(data);
  }

  clear(element:any){
    this.wholesaledetailsform.controls[element].reset();  }

}
