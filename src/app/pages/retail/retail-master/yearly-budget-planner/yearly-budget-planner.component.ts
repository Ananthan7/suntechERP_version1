import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { YearlyBudgetPlannerDetailsComponent } from './yearly-budget-planner-details/yearly-budget-planner-details.component';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';


@Component({
  selector: 'app-yearly-budget-planner',
  templateUrl: './yearly-budget-planner.component.html',
  styleUrls: ['./yearly-budget-planner.component.scss']
})
export class YearlyBudgetPlannerComponent implements OnInit {
  modalReference!: NgbModalRef;
  @Input() content!: any;
  unq_id: any;
  fyear: any;
  flag: any;
  dyndatas: any;
  BranchData: MasterSearchModel = {};
  maindetails: any = [];
  maindetails_data: any = [];
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  userDefinedData: any;
  username: any = localStorage.getItem('username');
  curr_branch: any = localStorage.getItem('userbranch');
  viewMode: boolean = false;
  editMode: boolean = false;
  branch_code:any;
  lastsr = 0;
  prefixcode = new FormControl('');
  @ViewChild('branch_code') codeInput!: ElementRef;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,
    private renderer: Renderer2,
    private commonService: CommonServiceService,



  ) { }

  yearlybudgetform: FormGroup = this.formBuilder.group({
    branchcode: ["",[Validators.required]],
    date_from: ['',[Validators.required]],
    finyear: ['',[Validators.required]],
    dateto: ['',[Validators.required]],
    narration: [''],
    datefrom: ['',[Validators.required]],
    description: [{value: '', disabled: true}],
    increase: [''],
  })

  ngOnInit(): void {
    console.log(this.content);
    // this.initializeMaindetails();
    this.unq_id = this.content?.FYEARCODE;
    this.branch_code = this.content?.BRANCH_CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW' || this.flag == 'DELETE') {
      this.detailsapi(this.unq_id);
    }
    if(this.flag == 'EDIT' || this.flag == "DELETE"){
      this.editMode = false;
    }
  }


  ngAfterViewInit() {
    if (this.codeInput && this.flag == undefined) {
      this.codeInput.nativeElement.focus();
    }
  }

  checkcode() {
    const branchcodeval = this.yearlybudgetform.controls.branchcode;
    if (!branchcodeval.value || branchcodeval.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
      this.renderer.selectRootElement('#branch_code')?.focus();
    }
  }

  finyearcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'FIN YEAR',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  }

  selectedfinyear(e: any) {
    console.log(e);
    this.yearlybudgetform.controls.finyear.setValue(e.FYEARCODE);
    this.yearlybudgetform.controls.date_from.setValue(e.STARTYEAR);
    this.yearlybudgetform.controls.dateto.setValue(e.ENDYEAR);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewMode = true;

      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }
  editController(DATA: any) {
    this.ViewController(DATA);
  }


  ViewController(DATA: any) {
    this.yearlybudgetform.controls.branchcode.setValue(this.content?.BRANCH_CODE);
    this.yearlybudgetform.controls.date_from.setValue(this.content?.FROM_DATE);
    this.yearlybudgetform.controls.finyear.setValue(this.content?.FYEARCODE);
    this.yearlybudgetform.controls.dateto.setValue(this.content?.TO_DATE);
    this.yearlybudgetform.controls.narration.setValue(this.content?.NARRATION);
    this.fyear = this.content?.FYEARCODE;
  }

  detailsapi(fm_id: any) {
    // this.viewOnly = true;

    let API = `BudgetMaster/GetBudgetMasterDetail/${this.branch_code}/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        this.maindetails.push(...result.response.Details);
        // ('#gridContainer').reload();
        console.log(result.response.Details)
        console.log(this.dyndatas);
        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }


  DeleteController(DATA?: any) {
    this.ViewController(DATA);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const API = `BudgetMaster/DeleteBudgetMaster/${this.branch_code}/${this.unq_id}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid")
                : console.log("Delete Error");
            },
            error: (err: any) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        this.flag = "VIEW";
        this.activeModal.close("");

      }
    });
  }


  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }


  branchCodeSelected(e: any) {
    console.log(e);
    this.yearlybudgetform.controls.branchcode.setValue(e.BRANCH_CODE);
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
  }
  )
  }

  formSubmit() {

    console.log(this.maindetails);
    let sno =1;
    this.maindetails.forEach((e:any) => {
      e.FYEARCODE = this.yearlybudgetform.controls.finyear.value;
      e.BUDGET_AMOUNT = Number(e.BUDGET_AMOUNT);  
      e.BUDGETED_AMT = Number(e.BUDGETED_AMT); 
      e.dtlMonth.forEach((s:any) => {
        s.FYEARCODE = this.yearlybudgetform.controls.finyear.value;
        s.BRANCH_CODE = this.curr_branch;
        s.BUDGETED_AMT = Number(s.BUDGETED_AMT);
        s.BUDGET_AMOUNT = Number(s.BUDGET_AMOUNT);  
        s.SRNO = sno;
        sno++;  
      });
    });

    const postData = {
      "BRANCH_CODE": this.yearlybudgetform.controls.branchcode.value,
      "FYEARCODE": this.yearlybudgetform.controls.finyear.value,
      "CREATED_BY": this.username,
      "CREATED_ON": new Date(),
      "FROM_DATE": this.yearlybudgetform.controls.date_from.value,
      "TO_DATE": this.yearlybudgetform.controls.dateto.value,
      "MID": 0,
      "NARRATION": this.yearlybudgetform.controls.narration.value,
      "Details":
        this.maindetails

    }

    if (this.flag === "EDIT") {
      let API = `BudgetMaster/UpdateBudgetMaster/${this.branch_code}/${this.unq_id}`;
      let sub: Subscription = this.apiService
        .putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Updated successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: result.message ? result.message : "Failed!",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      let API = `BudgetMaster/InsertBudgetMaster`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Inserted successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: "Not Inserted Successfully",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    }
  }

  setamount(data: any, event: any) {
    console.log('New Value:', event.target.value);
    console.log(data);
    const updatedSRNO = data.data.SLNO - 1; 
    this.lastsr = updatedSRNO;
    const budgetedAmt = parseFloat(event.target.value);
    this.maindetails[updatedSRNO].BUDGETED_AMT = this.commonService.decimalQuantityFormat(event.target.value,'AMOUNT');
    // this.maindetails[updatedSRNO].BUDGETED_AMT = budgetedAmt.toFixed(2);
    console.log('Updated DOC_TYPE:', this.maindetails[updatedSRNO].BUDGETED_AMT);
    let amount =  this.maindetails[updatedSRNO].BUDGETED_AMT;
    let accode = data.data.ACCODE;
    // this.calculate_total(amount,accode);
    if(this.flag == undefined){
      this.calculate_total(amount,accode);
    }else{
      this.calculate_total_edit(amount,accode);

    }
  }

  

  calculate_total(amount:any,accode:any ) {
    this.maindetails_data =[];
   
    let ind_amount = amount / 12;
    // let months = [
    //   'January', 'February', 'March', 'April', 'May', 'June', 
    //   'July', 'August', 'September', 'October', 'November', 'December'
    // ];
    // let data = months.map((month, index) => ({
    //   'SRNO': index + 1,
    //   'MONTH': month,
    //   'AMOUNT': ind_amount.toFixed(2)
    // }));
    let details = this.maindetails;
    let loc_data: any[] = [];  
    details.forEach((e: any) => {
      if (e.ACCODE == accode) {
        console.log(e.dtlMonth);
        loc_data = e.dtlMonth;  
      }
    });

    loc_data.forEach((s: any) => {
      s.BUDGET_AMOUNT = ind_amount.toFixed(2); 
    });
    
  
    this.maindetails_data.push(...loc_data);
  }


  calculate_total_edit(amount:any,accode:any ) {
    console.log("in")
    this.maindetails_data =[];
   
    let ind_amount = amount / 12;
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let data = months.map((month, index) => ({
      'SRNO': index,
      'MONTHNAME': month,
      'BUDGET_AMOUNT': ind_amount.toFixed(2)
    }));
    // let details = this.maindetails;
    // let loc_data: any[] = [];  
    // details.forEach((e: any) => {
    //   if (e.ACCODE == accode) {
    //     console.log(e.dtlMonth);
    //     loc_data = e.dtlMonth;  
    //   }
    // });

    // loc_data.forEach((s: any) => {
    //   s.BUDGET_AMOUNT = ind_amount.toFixed(2); 
    // });
    
  
    this.maindetails_data.push(...data);
  }


  settotal(data: any, event: any) {
    const updatedSRNO = data.data.SRNO;
    const budgetedAmt = parseInt(event.target.value, 10);  
    this.maindetails_data[updatedSRNO].BUDGET_AMOUNT = this.commonService.decimalQuantityFormat(budgetedAmt,"AMOUNT"); 
    this.cal_totalval(updatedSRNO);
  }

  cal_totalval(SRNO:any){
    let amt = 0;
    this.maindetails_data.forEach((e: any) => {
        amt += parseFloat(e.BUDGET_AMOUNT);  
    });
    console.log(this.lastsr);
    this.maindetails[this.lastsr].BUDGETED_AMT = Math.floor(amt); 

  }
  
  


  addTableData() {
    if (this.yearlybudgetform.controls.branchcode.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    } else {
      // let tablecount = this.maindetails.length;

      this.modalReference = this.modalService.open(YearlyBudgetPlannerDetailsComponent, {
        size: 'xl',
        backdrop: true,
        keyboard: false,
        windowClass: 'modal-full-width',
      });
      this.modalReference.componentInstance.flag = this.flag;

      this.modalReference.closed.subscribe((result) => {
        if (result) {
          console.log('Data received from modal:', result);
          this.maindetails = result;
          // this.maindetails.push(result);
          console.log(result);
        }
      });
    }
  }

  deleteTableData() {
    if (this.maindetails.length > 0) {
      this.maindetails.pop();
    }
  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    if (!searchValue || this.flag == "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };

    this.commonService.showSnackBarMsg("MSG81447");

    const sub: Subscription = this.apiService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {

              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Filtered Search Result:", searchResult);

              if (FROMCODE === true) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              } else if (FROMCODE === false) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              }

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {

                    this.yearlybudgetform.controls[formName].setValue(
                      matchedItem[field]
                    );
                  } else {
                    console.error(
                      `Property ${field} not found in matched item.`
                    );
                    this.commonService.toastErrorByMsgId("No data found");
                    this.clearLookupData(LOOKUPDATA, FORMNAMES);
                  }
                });
              } else {
                this.commonService.toastErrorByMsgId("No data found");
                this.clearLookupData(LOOKUPDATA, FORMNAMES);
              }
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.yearlybudgetform.controls[formName].setValue("");
    });
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.yearlybudgetform.controls[ctrl].setValue(value);
          } else {
            console.warn(`Model field '${field}' not found in event object.`);
          }
        });
      } else {
        console.warn(
          "Controller and modelfield arrays must be of equal length."
        );
      }
    } else if (controller && modelfield) {
      // Handle single controller and field
      const value = e[modelfield];
      if (value !== undefined) {
        this.yearlybudgetform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  onSelectionChanged(e: any) {
    console.log(e);
    const selectedRows = e.selectedRowsData;   
  }

  calculatepercent(){
    console.log("inside");

    let total_accodes = "";
    this.maindetails.forEach((e: any) => {
      total_accodes += `#${e.ACCODE}`;
    });

    let accodesArray = total_accodes.split('#').filter(Boolean);
    accodesArray.sort();
    let sorted_accodes = `#${accodesArray.join('#')}`;
    let postData ={
      str_Branch: this.curr_branch,
      str_Accodes:sorted_accodes,
      str_Fyearcode: this.yearlybudgetform.controls.finyear.value,
      int_Increase_per: Number(this.yearlybudgetform.controls.increase.value)
    }
    let API = `BudgetMaster/GetUSPBudgetSuggession`;
    let Sub: Subscription = this.apiService.postDynamicAPI(API,postData)
      .subscribe((result: any) => {
        console.log(result);
        let dyndata = result.dynamicData[0];
        console.log(dyndata);
        let total_prev = 0;
        if(dyndata){
          dyndata.forEach((e:any)=>{
            total_prev += e.PRV_YEAR_AMOUNT
          });
          let rounded_total_prev = parseFloat(total_prev.toFixed(2));
          this.maindetails.forEach((ele:any) => {
              ele.PRV_YEAR_AMOUNT = rounded_total_prev;
          });
        }else{
          this.maindetails.forEach((ele:any) => {
            ele.PRV_YEAR_AMOUNT = 0.000;
        });
        }
        
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);

  }

}
