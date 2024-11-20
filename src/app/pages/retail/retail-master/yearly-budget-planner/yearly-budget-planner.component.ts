import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  viewMode: boolean = false;
  editMode: boolean = false;
  branch_code:any;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,



  ) { }

  yearlybudgetform: FormGroup = this.formBuilder.group({
    branchcode: [""],
    date_from: [''],
    finyear: [''],
    dateto: [''],
    narration: [''],
    datefrom: [''],
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
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
    if(this.flag == 'EDIT'){
      this.editMode = true;
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
        this.flag = "EDIT";
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
    // this.activeModal.close(data); 
    if(this.flag == undefined || this.flag == 'EDIT'){
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to close this window?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    });
  }else{
    this.activeModal.close(data);
  }
  }

  formSubmit() {

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
  addTableData() {
    if (this.yearlybudgetform.controls.branchcode.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    } else {

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

}
