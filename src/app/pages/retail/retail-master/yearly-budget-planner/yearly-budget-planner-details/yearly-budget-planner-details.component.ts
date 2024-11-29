import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-yearly-budget-planner-details',
  templateUrl: './yearly-budget-planner-details.component.html',
  styleUrls: ['./yearly-budget-planner-details.component.scss']
})
export class YearlyBudgetPlannerDetailsComponent implements OnInit {
  branchCode?: any = localStorage.getItem("userbranch");
  maindetails: any = [];
  maindetails_clone: any = [];
  data:any=[];
  @Input () tablecount :any;
  curr_branch = localStorage.getItem('userbranch');
  // @Input () fin_year :any;
  detailmonth :any[]=[];



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

  // maindetails:any=[];
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService



  ) { }

  yearlybudgetdetailsform: FormGroup = this.formBuilder.group({

    search: [""],


  });

  formSubmit() {
   console.log(this.data);
   this.close(this.data);
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

  getPendingRepairJobs() {
    let API = `MasterLookUp`;
    let bodyData = {
      "PAGENO": 1,
      "RECORDS": 10,
      "LOOKUPID": 276,
      "ORDER_TYPE": 0,
      "WHERECONDITION": "ACCOUNT_MODE  = 'L'  AND GROUP_LEVEL = 4  AND ACCODE <>''",
      "searchField": "ACCODE",
      "searchValue": ""
  };  

    let sub: Subscription = this.dataService
      .postDynamicAPI(API, bodyData)
      .subscribe((res: any) => {
        if (res.status == "Success") {
          const uniqueItems = new Set();

          res.dynamicData[0].forEach((item: any) => {
            const identifier = item.CODE; 
          
            if (!uniqueItems.has(identifier)) {
              uniqueItems.add(identifier);
            }
          });
          
          this.maindetails = Array.from(uniqueItems)
            .map((identifier: any) => {
              return res.dynamicData[0].find((item: any) => item.CODE === identifier); 
            })
            .map((item: any) => ({
              ...item,
            }));
          
          this.maindetails.push(...res.dynamicData[1]);
          this.maindetails_clone = this.maindetails;
          console.log(this.maindetails);

        }
      });
  }

  ngOnInit(): void {
    // this.appendDataToGrid();
    this.branchCode = this.comService.branchCode;
    this.getPendingRepairJobs();


  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  onSelectionChanged(e: any) {
    console.log(e);
    this.data =[];
    const selectedRows = e.selectedRowsData;
    // let count = this.tablecount;
    let count = 0;

    const existingACCodes = new Set();
    let ind_amount = 0;
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let data = months.map((month, index) => ({
      "FYEARCODE": "",
      "BRANCH_CODE": "",
      "SRNO": 0,
      "ACCODE": "string", 
      "MONTHNAME": month,
      "BUDGETED_AMT": 0,
      "BUDGET_AMOUNT": 0
  }));
  
  selectedRows.forEach((row: any) => {
      if (!existingACCodes.has(row.ACCODE)) {
          count++;
          const post = {
              "SLNO": count,
              "BRANCH_CODE": this.curr_branch,
              "FYEARCODE": "stri",
              "ACCODE": row.CODE,
              "ACCOUNT_HEAD": row.ACCOUNT_HEAD,
              "BUDGET_AMOUNT": 0,
              "PRV_YEAR_AMOUNT": 0,
              "BUDGETED_AMT": 0,
              "dtlMonth": data.map(item => ({
                  ...item,  
                  "ACCODE": row.CODE  
              }))
          };
  
          this.data.push(post);
  
          existingACCodes.add(row.CODE);
      }
  });
  

    console.log(this.data);
}

filterbysearch() {
  this.maindetails = this.maindetails_clone
  let search_value = this.yearlybudgetdetailsform.controls.search.value;
  if (search_value && search_value.trim() !== "") {
    const lowerSearchValue = search_value.trim().toLowerCase();
    this.maindetails = this.maindetails.filter((e: any) => {
      const hasCode = e.CODE && e.CODE.toLowerCase().includes(lowerSearchValue);
      const hasAccountHead = e.ACCOUNT_HEAD && e.ACCOUNT_HEAD.toLowerCase().includes(lowerSearchValue);
      return hasCode || hasAccountHead;
    });
  } else {
    this.maindetails = this.maindetails_clone
  }
}



  
  



}
