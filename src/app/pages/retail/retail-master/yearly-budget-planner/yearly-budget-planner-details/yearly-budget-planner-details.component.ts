import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-yearly-budget-planner-details',
  templateUrl: './yearly-budget-planner-details.component.html',
  styleUrls: ['./yearly-budget-planner-details.component.scss']
})
export class YearlyBudgetPlannerDetailsComponent implements OnInit {

  maindetails:any=[];
  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,


  ) { }

  yearlybudgetdetailsform: FormGroup = this.formBuilder.group({
   
    search: [""],
  
   
  });

  formSubmit(){

  }

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }


}
