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

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,


  ) { }

  typeList: any[] = [{ field: "None" }, { field:"Category"}, { field:"Sub Category"}, 
    { field:"Brand Code"}, { field:"Karat"}, { field:"Type"}, { field:"Country"}, { field:"Cost Code"}];

    divisionlist:any []=[{field:"Diamond"},{field:"Metal"}];

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

  }

  close(){
    this.activeModal.close();
  }

  clear(element:any){
    this.wholesaledetailsform.controls[element].reset();  }

}
