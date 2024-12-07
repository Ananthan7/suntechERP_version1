import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";
import { GpcGridComponentComponent } from "./gpc-grid-component/gpc-grid-component.component";

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
  costCenterSelectedRowIndex: any;
  expenseSelectedRowIndex: any;
  flag: any;
  code: any;
  dialogBox: any;
  branchCode: any = this.commonService.branchCode;

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

  expenseCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 7,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      " BRANCH_CODE = 'strbranchcode' AND AC_OnHold = 0 and  VIEW_ACCMST_BRANCHWISE.ACCODE in (select ACCODE from ACCOUNT_MAIN where ( (  account_mode in ('L','G')) ) and ISNULL(accode,'') <> '')",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "EXPENSE CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  hsnCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 7,
    LOOKUPID: 3,
    ORDER_TYPE: 0,
    WHERECONDITION: "TYPES='HSN MASTER'",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "HSN CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  VATACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "VAT A/C CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  RCMACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "RCM A/C CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  VATCTRLACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",

    SEARCH_FIELD: "",
    SEARCH_HEADING: "VAT CTRL A/C CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  RCMCTRLACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "RCM CTRL A/C CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  POSVATACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",

    SEARCH_FIELD: "",
    SEARCH_HEADING: "POS VAT CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  POSVATREFUNDCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "account_mode not in ('P','R') and isnull(accode,'')<>'' and BRANCH_CODE='" +
      this.branchCode +
      "'  ",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "POS VAT REFUND",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  costCenterAccountColumnHeadings: any[] = [
    { field: "SRNO", caption: "SRNO" },
    { field: "COST_CODE", caption: "COSTCENTER" },
    { field: "GPC_ACCODE", caption: "GPC_ACCODE" },
    { field: "GPC_ACCODE_DESC", caption: "GPC_ACCODE_DESC" },
    { field: "HSN_SAC_CODE", caption: "HSN_SAC_CODE" },
    { field: "HSN_SAC_DESC", caption: "HSN_SAC_DESC" },
    { field: "TAX_REG", caption: "TAX_REG" },
    { field: "REVERSECHARGE_UNREG", caption: "REVERSECHARGE_UNREG" },
    { field: "ELIGIBLE_INPUTCREDIT", caption: "ELIGIBLE_INPUTCREDIT" },
  ];

  accountDateWiseGstDetailsColumnHeadings: any[] = [
    { field: "SRNO", caption: "SRNo" },
    { field: "GST_CODE", caption: "GST Code" },
    { field: "GST_DATE", caption: "DATE" },
    { field: "GST_PER", caption: "GST PER" },
    { field: "YEARCODE", caption: "YEAR MONTH" },
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
    searchValue: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

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

    this.vatMasterMainForm.controls["vatCode"].setValue(DATA.GST_CODE);
    this.vatMasterMainForm.controls["vatDesc"].setValue(DATA.GST_DESCRIPTION);
    this.vatMasterMainForm.controls["vatPercent"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.GST_PER),
        "THREE"
      )
    );
    this.vatMasterMainForm.controls["group1"].setValue(DATA.GROUP_CODE1);
    this.vatMasterMainForm.controls["group2"].setValue(DATA.GROUP_CODE2);
    this.vatMasterMainForm.controls["group3"].setValue(DATA.GROUP_CODE3);
    this.vatMasterMainForm.controls["regRcmAccCredit"].setValue(
      DATA.REG_IGST_CREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["regRcmAccDebit"].setValue(
      DATA.REG_IGST_DEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["regRcmAccDebit"].setValue(
      DATA.REG_IGST_DEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["unregVatAccCredit"].setValue(
      DATA.UNREG_IGST_CREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["unregVatAccDebit"].setValue(
      DATA.UNREG_IGST_DEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["unregVatCtrlAccCredit"].setValue(
      DATA.UNREG_IGST_CTRLCREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["unregVatCtrlAccDebit"].setValue(
      DATA.UNREG_IGST_CTRLDEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["impVatAccDebit"].setValue(
      DATA.IMPORT_IGST_DEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["impVatCtrlAccDebit"].setValue(
      DATA.IMPORT_IGST_CTRLCREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["expVatAccCredit"].setValue(
      DATA.EXPORT_IGST_CREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["expVatAccDebit"].setValue(
      DATA.EXPORT_IGST_CTRLDEBIT_ACCODE
    );
    this.vatMasterMainForm.controls["posVatRefundCredit"].setValue(
      DATA.POSVAT_CREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["regVatCtrlAccCredit"].setValue(
      DATA.REG_IGST_CTRLCREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["regVatCtrlAccDebit"].setValue(
      DATA.REG_IGST_CTRLDEBIT_ACCODE
    );

    this.vatMasterMainForm.controls["regVatCtrlAccDebit"].setValue(
      DATA.UNREG_RCM_DEBIT
    );
    this.vatMasterMainForm.controls["unregRcmAccDebit"].setValue(
      DATA.UNREG_RCM_CREDIT
    );
    this.vatMasterMainForm.controls["regRcmAccDebit"].setValue(
      DATA.REG_RCM_DEBIT
    );
    this.vatMasterMainForm.controls["regRcmAccCredit"].setValue(
      DATA.REG_RCM_CREDIT
    );
    this.vatMasterMainForm.controls["impRcmAccCredit"].setValue(
      DATA.IMP_RCM_DEBIT
    );
    this.vatMasterMainForm.controls["impRcmCtrlAccDebit"].setValue(
      DATA.IMP_RCM_CTRL_CREDIT
    );
    this.vatMasterMainForm.controls["posVatAccDebit"].setValue(
      DATA.POSVATREFUND_DEBIT_ACCODE
    );

    this.getGridDataObjects(this.code);
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
        const API = `/VatMaster/DeleteVatMaster/${this.code}`;
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
      const postData = {
        MID: 0,
        GST_CODE: this.vatMasterMainForm.value.vatCode || "",
        GST_DESCRIPTION: this.vatMasterMainForm.value.vatDesc || "",
        GST_PER: Number(this.vatMasterMainForm.value.vatPercent) || 0,
        GROUP_CODE1: this.vatMasterMainForm.value.group1 || "",
        GROUP_CODE2: this.vatMasterMainForm.value.group2 || "",
        GROUP_CODE3: this.vatMasterMainForm.value.group3 || "",
        REG_IGST_CREDIT_ACCODE:
          this.vatMasterMainForm.value.regRcmAccCredit || "",
        REG_IGST_DEBIT_ACCODE:
          this.vatMasterMainForm.value.regRcmAccDebit || "",
        UNREG_IGST_CREDIT_ACCODE:
          this.vatMasterMainForm.value.unregVatAccCredit || "",
        UNREG_IGST_DEBIT_ACCODE:
          this.vatMasterMainForm.value.unregVatAccDebit || "",
        UNREG_IGST_CTRLCREDIT_ACCODE:
          this.vatMasterMainForm.value.unregVatCtrlAccCredit || "",
        UNREG_IGST_CTRLDEBIT_ACCODE:
          this.vatMasterMainForm.value.unregVatCtrlAccDebit || "",
        IMPORT_IGST_DEBIT_ACCODE:
          this.vatMasterMainForm.value.impVatAccDebit || "",
        IMPORT_IGST_CTRLCREDIT_ACCODE:
          this.vatMasterMainForm.value.impVatCtrlAccDebit || "",
        EXPORT_IGST_CREDIT_ACCODE:
          this.vatMasterMainForm.value.expVatAccCredit || "",
        EXPORT_IGST_CTRLDEBIT_ACCODE:
          this.vatMasterMainForm.value.expVatAccDebit || "",
        GST_ROUNDOFF: 0,
        ROUNDOFF_ACCODE: "string",
        POSVAT_CREDIT_ACCODE:
          this.vatMasterMainForm.value.posVatRefundCredit || "",
        REG_IGST_CTRLCREDIT_ACCODE:
          this.vatMasterMainForm.value.regVatCtrlAccCredit || "",
        REG_IGST_CTRLDEBIT_ACCODE:
          this.vatMasterMainForm.value.regVatCtrlAccDebit || "",
        UNREG_RCM_DEBIT: this.vatMasterMainForm.value.unregRcmAccCredit || "",
        UNREG_RCM_CREDIT: this.vatMasterMainForm.value.unregRcmAccDebit || "",
        REG_RCM_DEBIT: this.vatMasterMainForm.value.regRcmAccDebit || "",
        REG_RCM_CREDIT: this.vatMasterMainForm.value.regRcmAccCredit || "",
        IMP_RCM_DEBIT: this.vatMasterMainForm.value.impRcmAccCredit || "",
        IMP_RCM_CTRL_CREDIT:
          this.vatMasterMainForm.value.impRcmCtrlAccDebit || "",
        POSVATREFUND_DEBIT_ACCODE:
          this.vatMasterMainForm.value.posVatAccDebit || "",
        vatMasterGst: this.costCenterAccountData.map((item) => ({
          UNIQUEID: 0,
          SN: item.SRNO || 0,
          GST_CODE: this.vatMasterMainForm.value.vatCode || "",
          GST_DESCRIPTION: this.vatMasterMainForm.value.vatDesc || "",
          GST_PER: 0,
          EXPENSE_ACCODE: item.EXPENSE_ACCODE || "",
          EXPENSE_ACCODE_DESC: item.EXPENSE_ACCODE_DESC || "",
          HSN_SAC_CODE: item.HSN_SAC_CODE || "",
          HSN_SAC_DESC: item.HSN_SAC_DESC || "",
          TAX_REG: item.TAX_REG,
          REVERSECHARGE_UNREG: item.REVERSECHARGE_UNREG,
          ELIGIBLE_INPUTCREDIT: item.ELIGIBLE_INPUTCREDIT,
          EXPENSE_ACCTYPE: "str",
          COST_CODE: item.COST_CODE,
        })),
        VatMasterDetails: this.expenseHsnOrSacAllocationData.map((item) => ({
          BRANCH_CODE: this.branchCode,
          UNIQUEID: 0,
          SRNO: Number(item.SRNO) || 0,
          VAT_CODE: this.vatMasterMainForm.value.vatCode || "",
          VAT_PER: Number(this.vatMasterMainForm.value.vatPercent),
          YEARCODE: item.YEARCODE || "",
          VAT_DATE: new Date(),
        })),
      };

      if (this.flag === "EDIT") {
        let API = `/VatMaster/UpdateVatMaster/${this.code}`;
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
        let API = `/VatMaster/InsertVatMaster`;
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

  onSelectionChanged(event: any, TAB: any) {
    let values = event.selectedRowKeys;
    console.log("Selected Row Keys:", values);

    switch (TAB) {
      case "Expense HSN/SAC Allocation":
        let indexesE: number[] = [];

        // Find the indexes of the selected rows
        this.expenseHsnOrSacAllocationData.forEach(
          (value: { SRNO: string }, index: number) => {
            if (values.includes(parseFloat(value.SRNO))) {
              indexesE.push(index);
            }
          }
        );

        this.expenseSelectedRowIndex = indexesE;
        console.log("Selected Row Indexes:", this.expenseSelectedRowIndex);
        break;

      case "Cost Center Account":
        let indexesC: number[] = [];

        // Find the indexes of the selected rows
        this.costCenterAccountData.forEach(
          (value: { SRNO: string }, index: number) => {
            if (values.includes(parseFloat(value.SRNO))) {
              indexesC.push(index);
            }
          }
        );

        this.costCenterSelectedRowIndex = indexesC;
        console.log("Selected Row Indexes:", this.costCenterSelectedRowIndex);
        break;

      default:
        break;
    }
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

  addRowFunc(TAB: any) {
    console.log(TAB);
    let message =
      TAB === "Cost Center Account"
        ? `GPC Code cannot be empty`
        : `Expense Account Code cannot be empty`;

    switch (TAB) {
      case "Cost Center Account":
        if (
          this.costCenterAccountData.length > 0 &&
          !this.costCenterAccountData[this.costCenterAccountData.length - 1]
            .EXPENSE_ACCODE
        ) {
          this.openDialog("Warning", message, true);
          return;
        }

        const newRowC = {
          SRNO:
            this.costCenterAccountData.length > 0
              ? this.costCenterAccountData[
                  this.costCenterAccountData.length - 1
                ].SRNO + 1
              : 1,
          COST_CODE: "",
          GPC_ACCODE: "",
          GPC_ACCODE_DESC: "",
          HSN_SAC_CODE: "",
          HSN_SAC_DESC: "",
          TAX_REG: false,
          REVERSECHARGE_UNREG: false,
          ELIGIBLE_INPUTCREDIT: false,
        };

        this.costCenterAccountData = [...this.costCenterAccountData, newRowC];

        console.log(this.expenseHsnOrSacAllocationData);

        break;

      case "Expense HSN/SAC Allocation":
        if (
          this.expenseHsnOrSacAllocationData.length > 0 &&
          !this.expenseHsnOrSacAllocationData[
            this.expenseHsnOrSacAllocationData.length - 1
          ].EXPENSE_ACCODE
        ) {
          this.openDialog("Warning", message, true);
          return;
        }

        const newRowE = {
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
          newRowE,
        ];

        console.log(this.expenseHsnOrSacAllocationData);

        break;

      default:
        break;
    }
  }

  deleteRowFunc(TAB: any) {
    switch (TAB) {
      case "Cost Center Account":
        if (
          this.costCenterSelectedRowIndex &&
          this.costCenterSelectedRowIndex.length > 0
        ) {
          // Delete rows using selected indexes
          this.costCenterAccountData = this.costCenterAccountData.filter(
            (_: any, index: any) =>
              !this.costCenterSelectedRowIndex.includes(index)
          );

          console.log("Rows deleted successfully");
          this.costCenterSelectedRowIndex = []; // Reset the selected row index array
        } else {
          console.log("No row selected to delete");
        }

        break;

      case "Expense HSN/SAC Allocation":
        if (
          this.expenseSelectedRowIndex &&
          this.expenseSelectedRowIndex.length > 0
        ) {
          // Delete rows using selected indexes
          this.expenseHsnOrSacAllocationData =
            this.expenseHsnOrSacAllocationData.filter(
              (_: any, index: any) =>
                !this.expenseSelectedRowIndex.includes(index)
            );

          console.log("Rows deleted successfully");
          this.expenseSelectedRowIndex = []; // Reset the selected row index array
        } else {
          console.log("No row selected to delete");
        }

        break;

      default:
        break;
    }

    console.log(TAB);
  }

  expenseSelect(event: any, data: any) {
    let currentIndex = data.data.SRNO - 1;

    this.expenseHsnOrSacAllocationData[currentIndex].EXPENSE_ACCODE =
      event.CODE;
    this.expenseHsnOrSacAllocationData[currentIndex].EXPENSE_ACCODE_DESC =
      event.DESCRIPTION;

    console.log(this.expenseHsnOrSacAllocationData);
  }

  hsnSelect(event: any, data: any) {
    let currentIndex = data.data.SRNO - 1;

    this.expenseHsnOrSacAllocationData[currentIndex].HSN_SAC_CODE = event.CODE;
    this.expenseHsnOrSacAllocationData[currentIndex].HSN_SAC_DESC =
      event.DESCRIPTION;

    console.log(this.expenseHsnOrSacAllocationData);
  }

  GPCSelect(event: any, data: any) {
    let currentIndex = data.data.SRNO - 1;

    this.costCenterAccountData[currentIndex].GPC_ACCODE = event.CODE;
    this.costCenterAccountData[currentIndex].GPC_ACCODE_DESC =
      event.DESCRIPTION;

    console.log(this.costCenterAccountData);
  }

  HSNSelect(event: any, data: any) {
    console.log(data);
    
    let currentIndex = data.data.SRNO - 1;

    this.costCenterAccountData[currentIndex].HSN_SAC_CODE = event.CODE;
    this.costCenterAccountData[currentIndex].HSN_SAC_DESC = event.DESCRIPTION;

    console.log(this.costCenterAccountData);
  }

  getDatewiseListData() {
    const payload = {
      strDate: new Date(),
      strPer: this.vatMasterMainForm.value.vatPercent,
      strVATCode: this.vatMasterMainForm.value.vatCode,
    };
    const API = `GstMaster/GetUspGetFinancialDates`;

    this.apiService.postDynamicAPI(API, payload).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.accountDateWiseGstDetailsData = result.dynamicData[0].map(
            (item: any) => ({
              SRNO: item.SRNO || item.SrNo,
              GST_CODE: item.GST_CODE || item.VAT_Code,
              GST_DATE: item.GST_DATE || item.Date,
              GST_PER: item.GST_PER || item.VAT_Per.toFixed(3),
              YEARCODE: item.YEARCODE || item.YearMonth,
            })
          );
          console.log(this.accountDateWiseGstDetailsData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
      }
    );
  }

  codeAlert(event: any, controller: any) {
    if (controller === "vatPercent") {
      let message = `A percentage value cannot be greater than 100.`;

      if (event.target.value > 100) {
        this.vatMasterMainForm.controls[controller].setValue("");
        this.openDialog("Warning", message, true);
      } else {
        this.vatMasterMainForm.controls[controller].setValue(
          event.target.value
        );
      }
    }

    const message = "Please enter code first!";
    const GSTCODE = this.vatMasterMainForm.value.vatCode;
    const GSTPERCENT = this.vatMasterMainForm.value.vatPercent;

    console.log("Value:", GSTCODE);

    if (GSTCODE === "" || !GSTCODE) {
      this.openDialog("Warning", message, true);
      this.vatMasterMainForm.controls[controller].setValue(" ");
    }

    if (GSTCODE && GSTPERCENT) {
      this.getDatewiseListData();
    }
  }

  getGridDataObjects(CODE: any) {
    let API = `VatMaster/GetVatMasterDetail/${CODE}`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          console.log(result.response);
          this.expenseHsnOrSacAllocationData = result.response.gstMasterGst.map(
            (item: any) => ({
              SRNO: item.SRNO || item.SN,
              ...item,
            })
          );

          console.log(this.expenseHsnOrSacAllocationData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  getGPCAccountData() {
    let API = `VatMaster/GetFillGPCAccounts`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          console.log(result.response);
          this.costCenterAccountData = result.dynamicData[0].map(
            (item: any) => ({
              ...item,

              SRNO: item.SRNO || item.SN,
              TAX_REG: item.TAX_REG == 1,
              REVERSECHARGE_UNREG: item.REVERSECHARGE_UNREG == 1,
              ELIGIBLE_INPUTCREDIT: item.ELIGIBLE_INPUTCREDIT == 1,
              HSN_SAC_CODE: "",
              HSN_SAC_DESC: "",
              GPC_ACCODE_DESC: item.Account_Head,
            })
          );

          console.log(this.costCenterAccountData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  getSerachValue() {}

  openGPCGrid(data: any, index?:any) {
    const modalRef: NgbModalRef = this.modalService.open(
      GpcGridComponentComponent,
      {
        size: "md",
        backdrop: true,
        keyboard: false,
        centered: true,
      }
    );
    modalRef.componentInstance.receiptData = { ...data };

    modalRef.result.then(
      (row) => {
        if (row) {
          console.log("Data from modal:", row);
          let currentIndex = index.data.SRNO - 1;

          this.costCenterAccountData[currentIndex].GPC_ACCODE = row[0].GPC_ACCODE;
          this.costCenterAccountData[currentIndex].GPC_ACCODE_DESC =
            row[0].Account_Head;
      
          console.log(this.costCenterAccountData);
        }
      },
      (dismissReason) => {
        console.log("Modal dismissed:", dismissReason);
      }
    );
  }
}
