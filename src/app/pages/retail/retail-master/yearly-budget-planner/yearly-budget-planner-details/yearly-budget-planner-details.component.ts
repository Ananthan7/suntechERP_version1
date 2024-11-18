import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-yearly-budget-planner-details',
  templateUrl: './yearly-budget-planner-details.component.html',
  styleUrls: ['./yearly-budget-planner-details.component.scss']
})
export class YearlyBudgetPlannerDetailsComponent implements OnInit {

  accountMasterData: any = {
    PAGENO: 1,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Code Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCOUNT_MODE  = 'L'  AND GROUP_LEVEL = 4  AND ACCODE <> '",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  maindetails:any=[];
  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,


  ) { }

  yearlybudgetdetailsform: FormGroup = this.formBuilder.group({
   
    search: [""],
  
   
  });

  formSubmit(){      
    const postData = {
      "SLNO": 0,
      "BRANCH_CODE": "string",
      "FYEARCODE": "stri",
      "ACCODE": "string",
      "ACCOUNT_HEAD": "string",
      "BUDGET_AMOUNT": 0,
      "PRV_YEAR_AMOUNT": 0,
      "BUDGETED_AMT": 0
    }
  }

  // accountMasterData: MasterSearchModel = {
  //   PAGENO: 1,
  //   // RECORDS: 10,
  //   LOOKUPID: 252,
  //   SEARCH_FIELD: 'ACCOUNT_HEAD',
  //   SEARCH_HEADING: 'Code Search',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "ACCOUNT_MODE  = 'L'  AND GROUP_LEVEL = 4  AND ACCODE <> '",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  //   LOAD_ONCLICK: true,
  // }

  ngOnInit(): void {
    // this.appendDataToGrid();

  }

  close(data?: any) {
    this.activeModal.close(data);
  }



}
