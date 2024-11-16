import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { YearlyBudgetPlannerDetailsComponent } from './yearly-budget-planner-details/yearly-budget-planner-details.component';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';


@Component({
  selector: 'app-yearly-budget-planner',
  templateUrl: './yearly-budget-planner.component.html',
  styleUrls: ['./yearly-budget-planner.component.scss']
})
export class YearlyBudgetPlannerComponent implements OnInit {
  modalReference!: NgbModalRef;
  @Input() content!: any;
  unq_id:any;
  flag:any;
  dyndatas:any;
  BranchData: MasterSearchModel = {};
  maindetails: any = [];
  private subscriptions: Subscription[] = [];
  viewOnly:boolean = false;



  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,



  ) { }

  yearlybudgetform: FormGroup = this.formBuilder.group({
    branchcode:[''],
    date_from:[''],
    finyear:[''],
    dateto:[''],
    narration:[''],
    datefrom:[''],
    description:[''],
    increase:[''],
  })

  ngOnInit(): void {

    console.log(this.content);
    // this.initializeMaindetails();
    this.unq_id = this.content?.MID;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
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
    this.yearlybudgetform.controls.code.setValue(this.content?.CODE);
    this.yearlybudgetform.controls.description.setValue(this.content?.DESCRIPTION);
  }

  detailsapi(fm_id: any) {
    this.viewOnly = true;

    let API = `BudgetMaster/GetBudgetMasterDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas.FA_CATEGORY);
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
        const API = `FestivalMaster/DeleteFestivalMaster/${this.unq_id}`;
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
            error: (err :any) => {
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
  }
  branchCodeSelected(e:any){
    console.log(e);
    this.yearlybudgetform.controls.branchcode.setValue(e.BRANCH_CODE);
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
    const postData = {
      "BRANCH_CODE": this.yearlybudgetform.controls.branchcode.value,
      "FYEARCODE": this.yearlybudgetform.controls.finyear.value,
      "CREATED_BY": this.yearlybudgetform.controls.code.value,
      "CREATED_ON": this.yearlybudgetform.controls.code.value,
      "FROM_DATE": this.yearlybudgetform.controls.date_from.value,
      "TO_DATE": this.yearlybudgetform.controls.dateto.value,
      "MID": 0,
      "NARRATION": this.yearlybudgetform.controls.narration.value,
      "Details": [
        {
          "SLNO": 0,
          "BRANCH_CODE": "string",
          "FYEARCODE": "stri",
          "ACCODE": "string",
          "ACCOUNT_HEAD": "string",
          "BUDGET_AMOUNT": 0,
          "PRV_YEAR_AMOUNT": 0,
          "BUDGETED_AMT": 0
        }
      ]
    }

    if (this.flag === "EDIT") {
      let API = `BudgetMaster/UpdateBudgetMaster/${this.unq_id}`;
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
  addTableData(){
    if(this.yearlybudgetform.controls.branchcode.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    }else{
     
        this.modalReference = this.modalService.open(YearlyBudgetPlannerDetailsComponent, {
          size: 'xl',
          backdrop: true,//'static'
          keyboard: false,
          windowClass: 'modal-full-width',
      });

      this.modalReference.closed.subscribe((result) => {
        if (result) {
          console.log('Data received from modal:', result);
          this.maindetails = result;
          console.log(result);
        }
      });
      
    }

  }

  deleteTableData(){
    if (this.maindetails.length > 0) {
      this.maindetails.pop(); 
    }
  }


}
