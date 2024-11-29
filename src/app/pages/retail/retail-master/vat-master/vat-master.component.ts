import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
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
  selector: "app-vat-master",
  templateUrl: "./vat-master.component.html",
  styleUrls: ["./vat-master.component.scss"],
})
export class VatMasterComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;
  @ViewChild("overlayGroupOne") overlayGroupOne!: MasterSearchComponent;
  @ViewChild("overlayGroupTwo") overlayGroupTwo!: MasterSearchComponent;
  @ViewChild("overlayGroupThree") overlayGroupThree!: MasterSearchComponent;
  @ViewChild("overlayRegVatAccCredit")
  overlayRegVatAccCredit!: MasterSearchComponent;
  @ViewChild("overlayRegVatAccDebit")
  overlayRegVatAccDebit!: MasterSearchComponent;
  @ViewChild("overlayRegRcmAccCredit")
  overlayRegRcmAccCredit!: MasterSearchComponent;
  @ViewChild("overlayRegRcmAccDebit")
  overlayRegRcmAccDebit!: MasterSearchComponent;
  @ViewChild("overlayRegVatCtrlAccCredit")
  overlayRegVatCtrlAccCredit!: MasterSearchComponent;
  @ViewChild("overlayRegVatCtrlAccDebit")
  overlayRegVatCtrlAccDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregVatAccCredit")
  overlayUnregVatAccCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregVatAccDebit")
  overlayUnregVatAccDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregRcmAccCredit")
  overlayUnregRcmAccCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregRcmAccDebit")
  overlayUnregRcmAccDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregVatCtrlAccCredit")
  overlayUnregVatCtrlAccCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregVatCtrlAccDebit")
  overlayUnregVatCtrlAccDebit!: MasterSearchComponent;
  @ViewChild("overlayImpVatAccDebit")
  overlayImpVatAccDebit!: MasterSearchComponent;
  @ViewChild("overlayImpRcmAccCredit")
  overlayImpRcmAccCredit!: MasterSearchComponent;
  @ViewChild("overlayImpVatCtrlAccDebit")
  overlayImpVatCtrlAccDebit!: MasterSearchComponent;
  @ViewChild("overlayImpRcmCtrlAccDebit")
  overlayImpRcmCtrlAccDebit!: MasterSearchComponent;
  @ViewChild("overlayExpVatAccDebit")
  overlayExpVatAccDebit!: MasterSearchComponent;
  @ViewChild("overlayExpVatAccCredit")
  overlayExpVatAccCredit!: MasterSearchComponent;
  @ViewChild("overlayPosVatAccDebit")
  overlayPosVatAccDebit!: MasterSearchComponent;

  @ViewChild("overlayPosVatRefundCredit")
  overlayPosVatRefundCredit!: MasterSearchComponent;

  private subscriptions: Subscription[] = [];
  @Input() content!: any;

  expenseHsnOrSacAllocationData: any[] = [];
  costCenterAccountData: any[] = [];
  accountDateWiseGstDetailsData: any[] = [];
  selectedRowIndex: any;
  flag: any;
  code: any;
  dialogBox: any;

  groupCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    ORDER_TYPE: 0,
    WHERECONDITION: " TYPES='GSTGROUP'",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "GROUP CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  expenseHsnOrSacAllocationColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr. No" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. UnReg" },
    { field: "PROFIT", caption: "I/p Credit" },
  ];

  costCenterAccountColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr. No" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. UnReg" },
    { field: "PROFIT", caption: "I/p Credit" },
  ];

  accountDateWiseGstDetailsColumnHeadings: any[] = [
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

  vatMasterMainForm: FormGroup = this.formBuilder.group({
    vatCode: [""],
    vatDesc: [""],
    vatPercent: [""],
    group1: [""],
    group2: [""],
    group3: [""],
    regVatAccCredit: [""],
    regVatAccDebit: [""],
    regRcmAccCredit: [""],
    regRcmAccDebit: [""],
    regVatCtrlAccCredit: [""],
    regVatCtrlAccDebit: [""],
    unregVatAccCredit: [""],
    unregVatAccDebit: [""],
    unregRcmAccCredit: [""],
    unregRcmAccDebit: [""],
    unregVatCtrlAccCredit: [""],
    unregVatCtrlAccDebit: [""],
    impVatAccDebit: [""],
    impRcmAccCredit: [""],
    impVatCtrlAccDebit: [""],
    impRcmCtrlAccDebit: [""],
    expVatAccDebit: [""],
    expVatAccCredit: [""],
    posVatAccDebit: [""],
    posVatRefundCredit: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    // this.branchCode = this.commonService.branchCode;
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
        const API = `/GstMaster/DeleteGstMaster/${this.code}`;
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
        this.close("reloadMainGrid", true);
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

  vatMasterMainFormSubmit() {
    console.log(this.accountDateWiseGstDetailsData);
    console.log(this.costCenterAccountData);
    console.log(this.expenseHsnOrSacAllocationData);

    Object.keys(this.vatMasterMainForm.controls).forEach((controlName) => {
      const control = this.vatMasterMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.vatMasterMainForm.controls
    ).some((controlName) => {
      const control = this.vatMasterMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {};

      if (this.flag === "EDIT") {
        let API = `/GstMaster/InsertGstMaster/${this.code}`;
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
        let API = `/GstMaster/InsertGstMaster`;
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

  openTab(event: KeyboardEvent, formControlName: string) {
    const control = this.vatMasterMainForm.get(formControlName);
    if (
      (event.key === "Tab" || event.key === "Enter") &&
      control?.value === "" &&
      control?.valid
    ) {
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

      case "regVatAccCredit":
        this.overlayRegVatAccCredit.showOverlayPanel(event);
        break;

      case "regVatAccDebit":
        this.overlayRegVatAccDebit.showOverlayPanel(event);
        break;

      case "regRcmAccCredit":
        this.overlayRegRcmAccCredit.showOverlayPanel(event);
        break;

      case "regRcmAccDebit":
        this.overlayRegRcmAccDebit.showOverlayPanel(event);
        break;

      case "regVatCtrlAccCredit":
        this.overlayRegVatCtrlAccCredit.showOverlayPanel(event);
        break;
      case "regVatCtrlAccDebit":
        this.overlayRegVatCtrlAccDebit.showOverlayPanel(event);
        break;
      case "unregVatAccCredit":
        this.overlayUnregVatAccCredit.showOverlayPanel(event);
        break;
      case "unregVatAccDebit":
        this.overlayUnregVatAccDebit.showOverlayPanel(event);
        break;
      case "unregRcmAccCredit":
        this.overlayUnregRcmAccCredit.showOverlayPanel(event);
        break;
      case "unregRcmAccDebit":
        this.overlayUnregRcmAccDebit.showOverlayPanel(event);
        break;

      case "unregVatCtrlAccCredit":
        this.overlayUnregVatCtrlAccCredit.showOverlayPanel(event);
        break;

      case "unregVatCtrlAccDebit":
        this.overlayUnregVatCtrlAccDebit.showOverlayPanel(event);
        break;

      case "impVatAccDebit":
        this.overlayImpVatAccDebit.showOverlayPanel(event);
        break;

      case "impRcmAccCredit":
        this.overlayImpRcmAccCredit.showOverlayPanel(event);
        break;

      case "impVatCtrlAccDebit":
        this.overlayImpVatCtrlAccDebit.showOverlayPanel(event);
        break;
      case "impRcmCtrlAccDebit":
        this.overlayImpRcmCtrlAccDebit.showOverlayPanel(event);
        break;

      case "expVatAccDebit":
        this.overlayExpVatAccDebit.showOverlayPanel(event);
        break;

      case "expVatAccCredit":
        this.overlayExpVatAccCredit.showOverlayPanel(event);
        break;
      case "expVatAccCredit":
        this.overlayExpVatAccCredit.showOverlayPanel(event);
        break;

      case "posVatAccDebit":
        this.overlayPosVatAccDebit.showOverlayPanel(event);
        break;
      case "posVatRefundCredit":
        this.overlayPosVatRefundCredit.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
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
                    this.vatMasterMainForm.controls[formName].setValue(
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
      this.vatMasterMainForm.controls[formName].setValue("");
    });
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.vatMasterMainForm.controls[ctrl].setValue(value);
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
        this.vatMasterMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log("Selected Row Keys:", values);

    let indexes: number[] = [];

    // Find the indexes of the selected rows
    this.expenseHsnOrSacAllocationData.forEach(
      (value: { SRNO: string }, index: number) => {
        if (values.includes(parseFloat(value.SRNO))) {
          indexes.push(index);
        }
      }
    );

    this.selectedRowIndex = indexes;
    console.log("Selected Row Indexes:", this.selectedRowIndex);
  }

  updateField(data: any, value: any, field: string): void {
    const rowIndex = value?.data?.SRNO - 1;
    if (rowIndex >= 0 && this.expenseHsnOrSacAllocationData[rowIndex]) {
      if (typeof data === "object" && data.target) {
        console.log("Input value:", data.target.value);
        this.expenseHsnOrSacAllocationData[rowIndex][field] = data.target.value;
      } else {
        console.log("Data:", data);
        this.expenseHsnOrSacAllocationData[rowIndex][field] = data;
      }
    } else {
      console.warn("Invalid row index or data row missing:", rowIndex);
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  addRowFunc(): void {
    const message = `Expense Account Code cannot be empty`;

    if (
      this.expenseHsnOrSacAllocationData.length > 0 &&
      !this.expenseHsnOrSacAllocationData[
        this.expenseHsnOrSacAllocationData.length - 1
      ].EXPENSE_ACCODE
    ) {
      this.openDialog("Warning", message, true);
      return;
    }

    const newRow = {
      SRNO:
        this.expenseHsnOrSacAllocationData.length > 0
          ? this.expenseHsnOrSacAllocationData[
              this.expenseHsnOrSacAllocationData.length - 1
            ].SRNO + 1
          : 1,
      EXPENSE_ACCODE: "",
      EXPENSE_ACCODE_DESC: "",
      HSN_SAC_CODE: "",
      HSN_SAC_DESC: "",
      TAX_REG: false,
      REVERSECHARGE_UNREG: false,
      ELIGIBLE_INPUTCREDIT: false,
    };

    this.expenseHsnOrSacAllocationData = [
      ...this.expenseHsnOrSacAllocationData,
      newRow,
    ];

    console.log(this.expenseHsnOrSacAllocationData);
  }

  deleteRowFunc() {
    if (this.selectedRowIndex && this.selectedRowIndex.length > 0) {
      // Delete rows using selected indexes
      this.expenseHsnOrSacAllocationData =
        this.expenseHsnOrSacAllocationData.filter(
          (_: any, index: any) => !this.selectedRowIndex.includes(index)
        );

      console.log("Rows deleted successfully");
      this.selectedRowIndex = []; // Reset the selected row index array
    } else {
      console.log("No row selected to delete");
    }
  }

  
  charAndDigitLimitChecker(event: any, controller: any) {
    const value = parseFloat(event.target.value);

    switch (controller) {
      case "vatPercent":
        let message = `A percentage value cannot be greater than 100.`;
        value > 100
          ? this.openDialog("Warning", message, true)
          : this.vatMasterMainForm.controls[controller].setValue(
              event.target.value
            );
        break;

      default:
        break;
    }
  }

  openDetails() {}
  removeData() {}
}
