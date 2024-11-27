import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-gst-master",
  templateUrl: "./gst-master.component.html",
  styleUrls: ["./gst-master.component.scss"],
})
export class GstMasterComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  @ViewChild("overlayGroupOne") overlayGroupOne!: MasterSearchComponent;
  @ViewChild("overlayGroupTwo") overlayGroupTwo!: MasterSearchComponent;
  @ViewChild("overlayGroupThree") overlayGroupThree!: MasterSearchComponent;
  @ViewChild("overlayRoundOffAcc") overlayRoundOffAcc!: MasterSearchComponent;

  expenseHsnOrSacAllocationData: any;
  stateWiseGstDetailsData: any;
  dateWiseGstDetailsData: any;
  flag: any;
  code: any;
  dialogBox: any;

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "Stock Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  expenseHsnOrSacAllocationColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. Un" },
    { field: "PRgOFIT", caption: "I/p Cre" },
  ];

  stateWiseGstDetailsColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "State Code" },
    { field: "BRANCH_CODE", caption: "Description" },
    { field: "VOCTYPE", caption: "CGST%" },
    { field: "DIVISION", caption: "SGST%" },
    { field: "QTY", caption: "IGST%" },
  ];

  dateWiseGstDetailsColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "S. No" },
    { field: "BRANCH_CODE", caption: "GST Code" },
    { field: "VOCTYPE", caption: "Date" },
    { field: "DIVISION", caption: "GST%" },
    { field: "QTY", caption: "YearMonth" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  gstMasterMainForm: FormGroup = this.formBuilder.group({
    gstCode: ["", [Validators.required]],
    gstDesc: ["", [Validators.required]],
    gstPercent: [""],
    cessPercent: [""],
    applyAllBranches: [""],
    group1: [""],
    group2: [""],
    group3: [""],
    roundOff: [""],
    roundOffAc: [""],
    regCgstAcCredit: [""],
    regCgstAcDebit: [""],
    regSgstAcCredit: [""],
    regSgstAcDebit: [""],
    regIgstAcCredit: [""],
    regIgstAcDebit: [""],
    unregCgstAcCredit: [""],
    unregCgstAcDebit: [""],
    unregSgstAcCredit: [""],
    unregSgstAcDebit: [""],
    unregIgstAcCredit: [""],
    unregIgstAcDebit: [""],
    unregCgstCtrlAcCredit: [""],
    unregCgstCtrlAcDebit: [""],
    unregSgstCtrlAcCredit: [""],
    unregSgstCtrlAcDebit: [""],
    unregIgstCtrlAcCredit: [""],
    unregIgstCtrlAcDebit: [""],
    impIgstAcCredit: [""],
    impIgstCtrlAcDebit: [""],
    expIgstAcDebit: [""],
    expIgstCtrlAcCredit: [""],
  });

  ngOnInit(): void {
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
    }
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

  ViewController(DATA: any) {
    this.code = DATA.GST_CODE;
    this.gstMasterMainForm.controls["boxno"].setValue(DATA.BOX_NO);
  }

  editController(DATA: any) {
    this.ViewController(DATA);
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
        const API = `BoxMaster/DeleteBoxMaster/${this.code}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response) => {
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
                ? this.close("reloadMainGrid", true)
                : console.log("Delete Error");
            },
            error: (err) => {
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

  close(data?: any, calling?: boolean) {
    if (this.flag !== "VIEW" && !calling) {
      Swal.fire({
        title: "Are you sure you want to close this ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Close!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close(data);
        }
      });
    } else {
      this.activeModal.close(data);
    }
  }

  gstMasterMainFormSubmit() {
    Object.keys(this.gstMasterMainForm.controls).forEach((controlName) => {
      const control = this.gstMasterMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.gstMasterMainForm.controls
    ).some((controlName) => {
      const control = this.gstMasterMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MID: 0,
        BOX_NO: this.gstMasterMainForm.value.boxno,
        FROM_SERIALNO: this.gstMasterMainForm.value.fromserialno,
        PCS: this.gstMasterMainForm.value.pcs,
        TO_SERIALNO: this.gstMasterMainForm.value.toserialno,
        STOCK_CODE: this.gstMasterMainForm.value.stockcode,
        PURCHASE_BRANCH: "",
        PURCHASE_VOCTYPE: "",
        PURCHASE_VOCNO: 0,
        PURCHASE_VOCDATE: new Date(),
        PURCHASE_PARTYCODE: "string",
        LOCTYPE_CODE: this.gstMasterMainForm.value.location,
        SUB_PCS: this.gstMasterMainForm.value.subpcs,
        USERID: "",
        SYSTEM_DATE: new Date(),
      };

      if (this.flag === "EDIT") {
        let API = `BoxMaster/UpdateBoxMaster/${this.code}`;
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

              this.close("reloadMainGrid", true);
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
        let API = `BoxMaster/InsertBoxMaster`;
        let sub: Subscription = this.apiService
          .postDynamicAPI(API, postData)
          .subscribe((result) => {
            if (result.status.trim() === "Success") {
              Swal.fire({
                title: "Success",
                text: result.message
                  ? result.message
                  : "Inserted successfully!",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              this.close("reloadMainGrid", true);
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
    } else {
      this.commonService.showSnackBarMsg("Please fill mandatory fields.");
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  charAndDigitLimitChecker(event: any, controller: any) {
    const value = parseFloat(event.target.value);

    switch (controller) {
      case "gstPercent":
        let message = `A percentage value cannot be greater than 100.`;
        value > 100
          ? this.openDialog("Warning", message, true)
          : this.gstMasterMainForm.controls[controller].setValue(
              event.target.value
            );
        break;

      default:
        break;
    }
  }

  checkPercentage(event: any) {
    let message = `Percentage must be more than zero`;
    if (this.gstMasterMainForm.value.gstPercent === "") {
      this.openDialog("Warning", message, true);
    }
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "group1":
        this.overlayGroupOne.showOverlayPanel(event);
        break;
      case "group2":
        this.overlayGroupTwo.showOverlayPanel(event);
        break;
      case "group3":
        this.overlayGroupThree.showOverlayPanel(event);
        break;

      case "roundOffAc":
        this.overlayRoundOffAcc.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.gstMasterMainForm.controls[ctrl].setValue(value);
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
        this.gstMasterMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    lookupFields?: string[]
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

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    this.gstMasterMainForm.controls[formName].setValue(
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
      this.gstMasterMainForm.controls[formName].setValue("");
    });
  }

  openDetails() {}
  removeData() {}
}
