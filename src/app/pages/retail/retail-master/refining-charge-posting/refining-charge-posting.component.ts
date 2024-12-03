import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-refining-charge-posting",
  templateUrl: "./refining-charge-posting.component.html",
  styleUrls: ["./refining-charge-posting.component.scss"],
})
export class RefiningChargePostingComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("overlayPartyNumber") overlayPartyNumber!: MasterSearchComponent;
  @ViewChild("overlayServiceCode") overlayServiceCode!: MasterSearchComponent;
  @ViewChild("overlaySalesManCode") overlaySalesManCode!: MasterSearchComponent;
  @ViewChild("overlayCurrencyCode") overlayCurrencyCode!: MasterSearchComponent;
  tableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  deleteMode: boolean = false;
  private subscriptions: Subscription[] = [];
  refiningChargePostingMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    vocDate: [""],
    vocType: [""],
    vocNumber: [""],
    partNumber: [""],
    serviceCode: [""],
    salesMan: [""],
    currency: [""],
    checkBox1: [""],
    checkBox2: [""],
  });
  partyCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Party Number",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  serviceCOde: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Service Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  salesMan: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Sales Man",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  currencyCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.content?.FLAG) {
      // this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMode = true;
        this.deleteRecord();
      }
    }
  }

  setNewFormValues() {
    this.refiningChargePostingMasterForm.controls.BRANCH_CODE.setValue(
      this.commonService.branchCode
    );
  }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return;
    }
    if (this.content && this.content.FLAG == "VIEW") {
      this.activeModal.close(data);
      return;
    }
    Swal.fire({
      title: "Do you want to exit?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    });
  }

  BranchDataSelected(e: any) {}

  setPostData() {
    let form = this.refiningChargePostingMasterForm.value;
  
    let postData = {
      MID: this.commonService.emptyToZero(this.content?.MID),
      VOCTYPE: this.commonService.nullToString(form.vocType.toUpperCase()),
      VOCNO: this.commonService.emptyToZero(form.vocNumber),
      VOCDATE: this.commonService.nullToString(form.vocDate),
      YEARMONTH: this.commonService.nullToString(form.yearMonth),
      PARTYCODE: this.commonService.nullToString(form.partNumber.toUpperCase()),
      SALESPERSON_CODE: this.commonService.nullToString(form.salesMan.toUpperCase()),
      PARTY_CURRENCY: this.commonService.nullToString(form.currency.toUpperCase()),
      AUTOPOSTING: form.checkBox1 === true ? 1 : 0,
      AUTHORIZEDPOSTING: form.checkBox2 === true ? 1 : 0,
      SYSTEM_DATE: new Date(),
      SERVICE_CODE: this.commonService.nullToString(form.serviceCode.toUpperCase()),
      // Details: [
      //   {
      //     UNIQUEID: 0,
      //     REFCHRG_CODE: this.commonService.nullToString(form.refChargeCode || ""),
      //     REFCHRG_TYPE: form.refChargeType === true ? 1 : 0,
      //     REFINE_RATEFC: this.commonService.emptyToZero(form.refineRateFC),
      //     REFINE_RATECC: this.commonService.emptyToZero(form.refineRateCC),
      //     REFINE_AMOUNTFC: this.commonService.emptyToZero(form.refineAmountFC),
      //     REFINE_AMOUNTCC: this.commonService.emptyToZero(form.refineAmountCC),
      //     CGST_PER: this.commonService.emptyToZero(form.cgstPercent),
      //     CGST_AMOUNTFC: this.commonService.emptyToZero(form.cgstAmountFC),
      //     CGST_AMOUNTCC: this.commonService.emptyToZero(form.cgstAmountCC),
      //     SGST_PER: this.commonService.emptyToZero(form.sgstPercent),
      //     SGST_AMOUNTFC: this.commonService.emptyToZero(form.sgstAmountFC),
      //     SGST_AMOUNTCC: this.commonService.emptyToZero(form.sgstAmountCC),
      //     IGST_PER: this.commonService.emptyToZero(form.igstPercent),
      //     IGST_AMOUNTFC: this.commonService.emptyToZero(form.igstAmountFC),
      //     IGST_AMOUNTCC: this.commonService.emptyToZero(form.igstAmountCC),
      //     TOTAL_AMOUNTFC: this.commonService.emptyToZero(form.totalAmountFC),
      //     TOTAL_AMOUNTCC: this.commonService.emptyToZero(form.totalAmountCC),
      //     GST_CODE: this.commonService.nullToString(form.gstCode || ""),
      //     HSN_CODE: this.commonService.nullToString(form.hsnCode || ""),
      //   },
      // ],
    };
  
    return postData;
  }
  
  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    console.log(this.tableData);

    let API = "RefineChargeMaster/InsertRefineChargeMaster";
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.refiningChargePostingMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  update() {
    let API =
      "RefineChargeMaster/UpdateRefineChargeMaster/" + this.content.CODE;
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.refiningChargePostingMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (!this.content.CODE) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
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
        let API =
          "RefineChargeMaster/DeleteRefineChargeMaster/" + this.content.CODE;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.refiningChargePostingMasterForm.reset();
                      this.tableData = [];
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.refiningChargePostingMasterForm.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.commonService.toastErrorByMsgId("MSG1880"); // Not Deleted
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
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

    // if (!searchValue || this.flag == "VIEW") return;

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

    const sub: Subscription = this.dataService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];
                console.log(FORMNAMES);
                console.log(matchedItem);

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    console.log(field);

                    this.refiningChargePostingMasterForm.controls[
                      formName
                    ].setValue(matchedItem[field]);
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
      this.refiningChargePostingMasterForm.controls[formName].setValue("");
    });
  }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    LOOKUPDATA: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if (event.key == "Tab") {
      console.log("Tab");
      console.log(controllers);
      console.log(event);

      this.lookupKeyPress(event, controllers[0]);
    }
  }

  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control =
        this.refiningChargePostingMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == "Tab" && event.target.value == "") {
      this.showOverleyPanel(event, form);
    }
    if (event.key === "Enter") {
      if (event.target.value == "") this.showOverleyPanel(event, form);
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "partNumber":
        this.overlayPartyNumber.showOverlayPanel(event);
        break;
      case "serviceCode":
        this.overlayServiceCode.showOverlayPanel(event);
        break;
      case "salesMan":
        this.overlaySalesManCode.showOverlayPanel(event);
        break;
      case "currency":
        this.overlayCurrencyCode.showOverlayPanel(event);
        break;
      default:
    }
  }
}
