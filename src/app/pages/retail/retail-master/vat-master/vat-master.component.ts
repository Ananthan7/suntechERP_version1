import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
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

import { ChangeDetectorRef } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { CustomdialogboxComponent } from "./customdialogbox/customdialogbox.component";
import { take } from "rxjs/operators";
import * as moment from "moment";

@Component({
  selector: "app-vat-master",
  templateUrl: "./vat-master.component.html",
  styleUrls: ["./vat-master.component.scss"],
})
export class VatMasterComponent implements OnInit {
  @ViewChild("codeField") codeField!: ElementRef;
  @ViewChild("vatPercentField") vatPercentField!: ElementRef;
  @ViewChild("dataGrid1", { static: false }) dataGrid1!: DxDataGridComponent;
  @ViewChild("dataGrid2", { static: false }) dataGrid2!: DxDataGridComponent;
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
  @ViewChild("overlayEHSNSACCODE")
  overlayEHSNSACCODE!: MasterSearchComponent;
  @ViewChild("overlayEEXPENSEACCODE")
  overlayEEXPENSEACCODE!: MasterSearchComponent;
  @ViewChild("overlayCHSNSACCODE")
  overlayCHSNSACCODE!: MasterSearchComponent;

  @ViewChild("overlayPosVatRefundCredit")
  overlayPosVatRefundCredit!: MasterSearchComponent;

  private subscriptions: Subscription[] = [];
  private isFocusOutHandled = false;
  @Input() content!: any;

  expenseHsnSacAllocationData: any[] = [];
  costCenterAccountData: any[] = [];
  accountSettingDateWiseVatDetailsData: any[] = [];
  selectedRowFromCostCenterAccount: any;
  selectedRowFromExpenseHasSacAllocation: any;
  flag: any;
  code: any;
  dialogBox: any;
  customDialogBox: any;
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
    WHERECONDITION: ` BRANCH_CODE = '${this.branchCode}' AND AC_OnHold = 0 and  VIEW_ACCMST_BRANCHWISE.ACCODE in (select ACCODE from ACCOUNT_MAIN where ( (  account_mode in ('L','G')) ) and ISNULL(accode,'') <> '')`,
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

  accountSettingDateWiseVatDetailsColumnHeadings: any[] = [
    { field: "SRNO", caption: "SRNO" },
    { field: "VAT_CODE", caption: "VAT Code" },
    { field: "VAT_PER", caption: "VAT PER" },
    { field: "VAT_DATE", caption: "DATE" },
    { field: "YEARCODE", caption: "YEAR MONTH" },
  ];

  expenseHsnSearchData: any;
  searching!: boolean;
  GPCFetched: Boolean = false;
  typedValues: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  vatMasterMainForm: FormGroup = this.formBuilder.group({
    vatCode: ["", [Validators.required]],
    vatDesc: ["", [Validators.required]],
    vatPercent: ["", [Validators.required]],
    group1: [""],
    group2: [""],
    group3: [""],
    regVatAccCredit: ["", [Validators.required]],
    regVatAccDebit: ["", [Validators.required]],
    regRcmAccCredit: ["", [Validators.required]],
    regRcmAccDebit: ["", [Validators.required]],
    regVatCtrlAccCredit: ["", [Validators.required]],
    regVatCtrlAccDebit: ["", [Validators.required]],
    unregVatAccCredit: ["", [Validators.required]],
    unregVatAccDebit: ["", [Validators.required]],
    unregRcmAccCredit: ["", [Validators.required]],
    unregRcmAccDebit: ["", [Validators.required]],
    unregVatCtrlAccCredit: ["", [Validators.required]],
    unregVatCtrlAccDebit: ["", [Validators.required]],
    impVatAccDebit: ["", [Validators.required]],
    impRcmAccCredit: ["", [Validators.required]],
    impVatCtrlAccDebit: ["", [Validators.required]],
    impRcmCtrlAccDebit: ["", [Validators.required]],
    expVatAccDebit: ["", [Validators.required]],
    expVatAccCredit: ["", [Validators.required]],
    posVatAccDebit: ["", [Validators.required]],
    posVatRefundCredit: ["", [Validators.required]],
    searchValue: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
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
      FLAG = "VIEW";
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
    this.vatMasterMainForm.controls["regVatAccCredit"].setValue(
      DATA.REG_IGST_CREDIT_ACCODE
    );
    this.vatMasterMainForm.controls["regVatAccDebit"].setValue(
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

    this.vatMasterMainForm.controls["unregRcmAccCredit"].setValue(
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

              response.status === "Success" &&
                this.close("reloadMainGrid", true);
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
  calculateCellValue(data: any, field: string): any {
    if (field === "VAT_DATE") {
      return data.VAT_DATE ? new Date(data.VAT_DATE).toLocaleDateString() : "";
    }
    return data[field];
  }

  checkSpecificControls(): boolean {
    const specificControls = [
      "regVatAccCredit",
      "regVatAccDebit",
      "regRcmAccCredit",
      "regRcmAccDebit",
      "regVatCtrlAccCredit",
      "regVatCtrlAccDebit",
      "unregVatAccCredit",
      "unregVatAccDebit",
      "unregRcmAccCredit",
      "unregRcmAccDebit",
      "unregVatCtrlAccCredit",
      "unregVatCtrlAccDebit",
      "impVatAccDebit",
      "impRcmAccCredit",
      "impVatCtrlAccDebit",
      "impRcmCtrlAccDebit",
      "expVatAccDebit",
      "expVatAccCredit",
      "posVatAccDebit",
      "posVatRefundCredit",
    ];

    for (const controlName of specificControls) {
      const control = this.vatMasterMainForm.get(controlName);

      if (control) {
        const controlValue = control.value;

        if (controlValue && controlValue.length < 3) {
          return true;
        }
      }
    }

    return false;
  }

  checkIncompleteFields(data: any[], tabIndex: any): boolean {
    const requiredFields =
      tabIndex == 0
        ? [
            "HSN_SAC_CODE",
            "HSN_SAC_DESC",
            "EXPENSE_ACCODE",
            "EXPENSE_ACCODE_DESC",
          ]
        : ["GPC_ACCODE", "GPC_ACCODE_DESC", "HSN_SAC_CODE", "HSN_SAC_DESC"];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (const field of requiredFields) {
        if (!row[field]) {
          console.log(`Missing value for field '${field}' in row index ${i}`);
          return true;
        }
      }
    }

    return false;
  }

  vatMasterMainFormSubmit() {
    let grid1 = this.checkIncompleteFields(this.expenseHsnSacAllocationData, 0);

    if (grid1) {
      const message = `The Expense HSN/SAC Allocation row's Expense Code & Description, and HSN Code & Description cannot be empty!`;
      this.openDialog("Warning", message, true);
      this.goToTab(1);
      return;
    }

    let grid2 = this.checkIncompleteFields(this.costCenterAccountData, 1);

    if (grid2) {
      const message = `The Cost Center Account row's Cost Code, GPC Account Code & Description, and HSN Code & Description cannot be empty!`;
      this.openDialog("Warning", message, true);
      this.goToTab(2);

      return;
    }

    let checkSpecificControlsName = this.checkSpecificControls();

    if (checkSpecificControlsName) {
      const message = `Please Fill The Regular Trade Fields!`;
      this.openDialog("Warning", message, true);
      this.goToTab(0);

      return;
    }

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
          this.vatMasterMainForm.value.regVatAccCredit || "",
        REG_IGST_DEBIT_ACCODE:
          this.vatMasterMainForm.value.regVatAccDebit || "",
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
        UNREG_RCM_DEBIT: this.vatMasterMainForm.value.unregRcmAccDebit || "",
        UNREG_RCM_CREDIT: this.vatMasterMainForm.value.unregRcmAccCredit || "",
        REG_RCM_DEBIT: this.vatMasterMainForm.value.regRcmAccDebit || "",
        REG_RCM_CREDIT: this.vatMasterMainForm.value.regRcmAccCredit || "",
        IMP_RCM_DEBIT: this.vatMasterMainForm.value.impRcmAccCredit || "",
        IMP_RCM_CTRL_CREDIT:
          this.vatMasterMainForm.value.impRcmCtrlAccDebit || "",
        POSVATREFUND_DEBIT_ACCODE:
          this.vatMasterMainForm.value.posVatAccDebit || "",
        vatMasterGst: [
          ...this.costCenterAccountData,
          ...this.expenseHsnSacAllocationData,
        ].map((item) => ({
          UNIQUEID: 0,
          SN: item.SN || 0,
          GST_CODE: this.vatMasterMainForm.value.vatCode || "",
          GST_DESCRIPTION: this.vatMasterMainForm.value.vatDesc || "",
          GST_PER: Number(this.vatMasterMainForm.value.vatPercent) || 0,
          EXPENSE_ACCODE: this.costCenterAccountData.some(
            (cc) => cc.GPC_ACCODE === item.GPC_ACCODE
          )
            ? item.GPC_ACCODE
            : item.EXPENSE_ACCODE || "",
          EXPENSE_ACCODE_DESC: this.costCenterAccountData.some(
            (cc) => cc.GPC_ACCODE_DESC === item.GPC_ACCODE_DESC
          )
            ? item.GPC_ACCODE_DESC
            : item.EXPENSE_ACCODE_DESC || "",
          HSN_SAC_CODE: item.HSN_SAC_CODE || "",
          HSN_SAC_DESC: item.HSN_SAC_DESC || "",
          TAX_REG: item.TAX_REG,
          REVERSECHARGE_UNREG: item.REVERSECHARGE_UNREG,
          ELIGIBLE_INPUTCREDIT: item.ELIGIBLE_INPUTCREDIT,
          EXPENSE_ACCTYPE:
            this.costCenterAccountData.some((cc) => cc.SN === item.SN) &&
            this.costCenterAccountData.includes(item)
              ? "GPC"
              : "",
          COST_CODE: this.costCenterAccountData.some(
            (cc) => cc.COST_CODE === item.COST_CODE
          )
            ? item.COST_CODE
            : "",
        })),

        VatMasterDetails: this.accountSettingDateWiseVatDetailsData.map(
          (item) => ({
            BRANCH_CODE: this.branchCode,
            UNIQUEID: 0,
            SRNO: Number(item.SRNO) || 0,
            VAT_CODE: item.VAT_CODE || "",
            VAT_PER: Number(item.VAT_PER),
            YEARCODE: item.YEARCODE || "",
            VAT_DATE: this.isValidDate(item.VAT_DATE)
              ? this.formatDate(item.VAT_DATE)
              : item.VAT_DATE || new Date().toISOString(),
          })
        ),
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
                text: result.message
                  ? result.message
                  : "Not Inserted Successfully",
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

  openTabFromGrid(
    event: KeyboardEvent,
    gridField: string[],
    data: any,
    gridType: any,
    fieldName: string
  ) {
    let input = (event.target as HTMLInputElement).value;
    let index = data.SN - 1;

    if ((event.key === "Tab" || event.key === "Enter") && !input) {
      this.openGridPanel(event, fieldName);
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      let input = (event.target as HTMLInputElement).value;

      console.log(input);
      if (!input || input.length <= 1 || input == "") {
        if (gridType === "costCenter") {
          this.costCenterAccountData[index][gridField[1]] = "";
          this.costCenterAccountData[index][gridField[0]] = "";
        } else if (gridType === "expense") {
          this.expenseHsnSacAllocationData[index][gridField[1]] = "";
          this.expenseHsnSacAllocationData[index][gridField[0]] = "";
        }
      }
    }
  }
  openGridPanel(event: any, fieldName: string) {
    switch (fieldName) {
      case "EHSN_SAC_CODE":
        this.overlayEHSNSACCODE.showOverlayPanel(event);
        break;
      case "EEXPENSE_ACCODE":
        this.overlayEEXPENSEACCODE.showOverlayPanel(event);
        break;
      case "CHSN_SAC_CODE":
        this.overlayCHSNSACCODE.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${fieldName}`);
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
            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

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

  selectingRowFromExpenseHsnSacAllocationData(values: any) {
    let indexes: number[] = [];

    // Find the indexes of the selected rows
    this.expenseHsnSacAllocationData.forEach(
      (value: { SN: string }, index: number) => {
        if (values.includes(parseFloat(value.SN))) {
          indexes.push(index);
        }
      }
    );

    this.selectedRowFromExpenseHasSacAllocation = indexes;
  }

  selectingRowFromcostCenterAccountData(values: any) {
    let indexes: number[] = [];

    // Find the indexes of the selected rows
    this.costCenterAccountData.forEach(
      (value: { SN: string }, index: number) => {
        if (values.includes(parseFloat(value.SN))) {
          indexes.push(index);
        }
      }
    );

    this.selectedRowFromCostCenterAccount = indexes;
  }

  onSelectionChanged(event: any, TAB: any) {
    let values = event.selectedRowKeys;
    return TAB === 1
      ? this.selectingRowFromExpenseHsnSacAllocationData(values)
      : this.selectingRowFromcostCenterAccountData(values);
  }

  updateField(EVENT: any, DATA: any, FIELD: string, GRIDTYPE: any): void {
    const rowIndex = DATA?.SN - 1;

    const gridData =
      GRIDTYPE === "costCenter"
        ? this.costCenterAccountData
        : this.expenseHsnSacAllocationData;

    if (rowIndex >= 0 && gridData[rowIndex]) {
      // Handle input event or direct value
      if (typeof EVENT === "object" && EVENT?.target) {
        gridData[rowIndex][FIELD] = EVENT.target.value;
      } else if (EVENT) {
        gridData[rowIndex][FIELD] = EVENT;
      } else {
        console.warn("Invalid EVENT:", EVENT);
      }

      if (GRIDTYPE === "costCenter") {
        this.costCenterAccountData = [...gridData];
      } else {
        this.expenseHsnSacAllocationData = [...gridData];
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

    this.dialogBox.afterClosed().subscribe((result: any) => {
      if (result === "OK") {
        return "OK";
      } else {
        return null;
      }
    });
  }

  openCustomDialog(
    title: any,
    msg: any,
    okBtn: any,
    clBtn: any,
    swapColor: any = false
  ) {
    this.customDialogBox = this.dialog.open(CustomdialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, clBtn, swapColor },
    });

    this.customDialogBox.afterClosed().subscribe((result: any) => {
      if (result === "OK") {
        console.log("User clicked OK");
      } else if (result === "Cancel") {
        console.log("User clicked Cancel");
      }
    });
  }

  addingRowInCostCenterAccount() {
    if (
      this.costCenterAccountData.length > 0 &&
      !this.costCenterAccountData[this.costCenterAccountData.length - 1]
        .GPC_ACCODE
    ) {
      const message = `GPC Accode Cannot Be Empty!`;
      this.openDialog("Warning", message, true);
      return;
    }
    this.clearSelection(this.dataGrid2, 1);
    const newRow = {
      SN:
        this.costCenterAccountData.length > 0
          ? this.costCenterAccountData[this.costCenterAccountData.length - 1]
              .SN + 1
          : 1,
      COST_CODE: "",
      GPC_ACCODE: "",
      GPC_ACCODE_DESC: "",
      HSN_SAC_CODE: "",
      HSN_SAC_DESC: "",
      TAX_REG: true,
      REVERSECHARGE_UNREG: true,
      ELIGIBLE_INPUTCREDIT: true,
    };

    this.costCenterAccountData = [...this.costCenterAccountData, newRow];

    const pageIndex = Math.floor(
      (this.costCenterAccountData.length - 1) /
        this.dataGrid2.instance.pageSize()
    );
    this.goToPage(pageIndex, this.dataGrid2);
  }

  event(event: any) {
    console.log(event);
  }
  addingRowInExpenseHsnSacAllocation() {
    if (
      this.expenseHsnSacAllocationData.length > 0 &&
      !this.expenseHsnSacAllocationData[
        this.expenseHsnSacAllocationData.length - 1
      ].EXPENSE_ACCODE
    ) {
      const message = `Expense Accode Cannot Be Empty!`;
      this.openDialog("Warning", message, true);
      return;
    }

    this.clearSelection(this.dataGrid1, 0);

    const newRow = {
      SN:
        this.expenseHsnSacAllocationData.length > 0
          ? this.expenseHsnSacAllocationData[
              this.expenseHsnSacAllocationData.length - 1
            ].SN + 1
          : 1,
      EXPENSE_ACCODE: "",
      EXPENSE_ACCODE_DESC: "",
      HSN_SAC_CODE: "",
      HSN_SAC_DESC: "",
      TAX_REG: true,
      REVERSECHARGE_UNREG: true,
      ELIGIBLE_INPUTCREDIT: true,
    };

    this.expenseHsnSacAllocationData = [
      ...this.expenseHsnSacAllocationData,
      newRow,
    ];

    const pageIndex = Math.floor(
      (this.costCenterAccountData.length - 1) /
        this.dataGrid1.instance.pageSize()
    );
    this.goToPage(pageIndex, this.dataGrid1);
  }

  addRowFunc(TAB: any) {
    return TAB === 1
      ? this.addingRowInExpenseHsnSacAllocation()
      : this.addingRowInCostCenterAccount();
  }

  deletingRowFromExpenseHsnSacAllocation() {
    if (
      this.selectedRowFromExpenseHasSacAllocation &&
      this.selectedRowFromExpenseHasSacAllocation.length > 0
    ) {
      // Delete rows using selected indexes
      this.expenseHsnSacAllocationData =
        this.expenseHsnSacAllocationData.filter(
          (_: any, index: any) =>
            !this.selectedRowFromExpenseHasSacAllocation.includes(index)
        );

      this.selectedRowFromExpenseHasSacAllocation = []; // Reset the selected row index array
    }
  }
  deletingRowFromCostCenterAccount() {
    if (
      this.selectedRowFromCostCenterAccount &&
      this.selectedRowFromCostCenterAccount.length > 0
    ) {
      this.costCenterAccountData = this.costCenterAccountData.filter(
        (_: any, index: any) =>
          !this.selectedRowFromCostCenterAccount.includes(index)
      );

      this.selectedRowFromCostCenterAccount = [];
    }
  }

  deleteRowFunc(TAB: any) {
    return TAB === 1
      ? this.deletingRowFromExpenseHsnSacAllocation()
      : this.deletingRowFromCostCenterAccount();
  }

  gridDataBinding(
    event: any,
    data: any,
    gridField: string[],
    gridType: "costCenter" | "expense",
    applyToAll?: boolean
  ) {
    const currentIndex = data.SN - 1;
    if (gridType === "costCenter") {
      this.costCenterAccountData[currentIndex][gridField[0]] = event.CODE;
      this.costCenterAccountData[currentIndex][gridField[1]] =
        event.DESCRIPTION;
    } else if (gridType === "expense") {
      this.expenseHsnSacAllocationData[currentIndex][gridField[0]] =
        event.CODE || event.ACCODE;
      this.expenseHsnSacAllocationData[currentIndex][gridField[1]] =
        event.DESCRIPTION || event.ACCOUNT_HEAD;
    }

    if (applyToAll && this.GPCFetched) {
      this.openCustomDialog(
        "Warning",
        "Do you want to Apply to all ?",
        true,
        true
      );

      this.customDialogBox.afterClosed().subscribe((result: any) => {
        console.log(result);

        if (result === "OK") {
          console.log(result);

          setTimeout(() => {
            this.costCenterAccountData = this.costCenterAccountData.map(
              (item) => {
                return {
                  ...item,
                  HSN_SAC_CODE: item.HSN_SAC_CODE
                    ? item.HSN_SAC_CODE
                    : event.CODE,
                  HSN_SAC_DESC: item.HSN_SAC_DESC
                    ? item.HSN_SAC_DESC
                    : event.DESCRIPTION,
                };
              }
            );
          }, 100);
        } else if (result === "Cancel") {
          this.costCenterAccountData[currentIndex][gridField[0]] = event.CODE;
          this.costCenterAccountData[currentIndex][gridField[1]] =
            event.DESCRIPTION;
        }
      });
    }

    this.cdr.detectChanges();
  }

  //First Tab
  getAccountSettingDatewiseListData() {
    const payload = {
      strDate: new Date(),
      strPer: this.vatMasterMainForm.value.vatPercent,
      strVATCode: this.vatMasterMainForm.value.vatCode,
    };
    const API = `GstMaster/GetUspGetFinancialDates`;

    this.apiService.postDynamicAPI(API, payload).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.accountSettingDateWiseVatDetailsData = result.dynamicData[0].map(
            (item: any) => ({
              SRNO: item.SrNo,
              VAT_CODE: item.VAT_Code,
              VAT_DATE: item.Date,
              VAT_PER: item.VAT_Per.toFixed(3),
              YEARCODE: item.YearMonth,
            })
          );
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
      }
    );
  }

  validateVATCode(controller?: any): boolean {
    const VATCODE = this.vatMasterMainForm.value.vatCode;
    if (!VATCODE) {
      this.openDialog("Warning", "Code cannot be empty!", true);
      controller && this.vatMasterMainForm.controls[controller].reset();
      this.dialogBox.afterClosed().subscribe((result: any) => {
        if (result === "OK") {
          setTimeout(() => {
            this.codeField.nativeElement.focus();
          }, 100);
        }
      });
      return false;
    }
    return true;
  }

  descriptionValidation(controller: String): boolean {
    return this.validateVATCode(controller);
  }

  vatPercentValidation(controller?: String): Boolean {
    return this.validateVATCode(controller);
  }

  regularTradeValidation(controller: String) {
    return this.validateVATCode(controller);
  }

  vatPercentFocusout(event: any): void {
    const VATCODE = this.vatMasterMainForm.value.vatCode;
    const TYPEDVALUE = this.typedValues;
    if (!VATCODE) return;

    const VATPER = event.target.value;
    let MESSAGE;
    if (TYPEDVALUE > 100) {
      MESSAGE = "A percentage value cannot be greater than 100.";
    } else if (!TYPEDVALUE || TYPEDVALUE <= 0) {
      MESSAGE = "A percentage value cannot be negative (-), zero, or empty.";
    }

    console.log(VATPER);

    console.log(MESSAGE);

    if (VATPER > 100 || VATPER < 1) {
      this.vatMasterMainForm.controls.vatPercent.reset();
      this.openDialog("Warning", MESSAGE, true);

      this.dialogBox
        .afterClosed()
        .pipe(take(1))
        .subscribe((result: any) => {
          if (result === "OK") {
            setTimeout(() => {
              this.vatPercentField.nativeElement.focus();
            }, 100);
          }
        });
    } else {
      this.vatMasterMainForm.controls.vatPercent.setValue(VATPER);

      if (VATCODE && VATPER && this.flag === "ADD") {
        this.getAccountSettingDatewiseListData();
      }

      if (VATCODE && VATPER && this.flag === "EDIT") {
        const today = moment().startOf("day");

        this.accountSettingDateWiseVatDetailsData =
          this.accountSettingDateWiseVatDetailsData.map((item) => {
            const vatDate = moment(item.VAT_DATE, "DD/MM/YYYY");
            if (vatDate.isSameOrAfter(today)) {
              item.VAT_PER = VATPER;
            }
            return item;
          });
      }
    }
  }

  typedValue(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    return (this.typedValues = inputElement.value);
  }

  dateFormating(isoDate: any) {
    const formattedDate = moment(isoDate).format("DD/MM/YYYY");
    return formattedDate;
  }

  getGridDataObjects(CODE: any) {
    let API = `VatMaster/GetVatMasterDetail/${CODE}`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.accountSettingDateWiseVatDetailsData =
            result.response[0].VatMasterDetails.map(
              (item: any, index: number) => ({
                ...item,
                SRNO: index + 1,
                VAT_DATE: this.dateFormating(item.VAT_DATE),
              })
            );

          this.costCenterAccountData = result.response[0].VatMasterGst.filter(
            (item: { EXPENSE_ACCTYPE: string }) =>
              item.EXPENSE_ACCTYPE === "GPC"
          ).map((item: any) => ({
            ...item,
            GPC_ACCODE: item.EXPENSE_ACCODE,
            GPC_ACCODE_DESC: item.EXPENSE_ACCODE_DESC,
          }));

          this.expenseHsnSacAllocationData =
            result.response[0].VatMasterGst.filter(
              (item: { EXPENSE_ACCTYPE: string }) =>
                item.EXPENSE_ACCTYPE !== "GPC"
            );
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  getGPCAccountData() {
    this.clearSelection(this.dataGrid2, 1);
    this.GPCFetched = true;
    let API = `VatMaster/GetFillGPCAccounts`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.costCenterAccountData = [];
          this.costCenterAccountData = [
            ...this.costCenterAccountData,
            ...result.dynamicData[0].map((item: any) => ({
              ...item,
              SN: item.SRNO,
              COST_CODE: item.COST_CODE,
              GPC_ACCODE: item.GPC_ACCODE,
              GPC_ACCODE_DESC: item.Account_Head,
              TAX_REG: item.TAX_REG == 1,
              REVERSECHARGE_UNREG: item.REVERSECHARGE_UNREG == 1,
              ELIGIBLE_INPUTCREDIT: item.ELIGIBLE_INPUTCREDIT == 1,
              HSN_SAC_CODE: "",
              HSN_SAC_DESC: "",
            })),
          ];
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  getSerachValue(event: any) {
    let SEARCHVALUE = event.target.value.trim();

    if (!SEARCHVALUE) {
      this.searching = false;
      return;
    }

    this.expenseHsnSearchData = this.expenseHsnSacAllocationData.filter(
      (item: any) =>
        item.EXPENSE_ACCODE.toLowerCase().startsWith(SEARCHVALUE.toLowerCase())
    );
    this.searching = true;
  }

  openGPCGrid(event?: any, index?: any): void {
    const clickedElement = event.target as HTMLElement;

    if (
      event.key === "Tab" ||
      event.key === "Enter" ||
      (clickedElement && clickedElement.tagName === "I")
    ) {
      const modalRef: NgbModalRef = this.modalService.open(
        GpcGridComponentComponent,
        {
          size: "md",
          backdrop: true,
          keyboard: false,
          centered: true,
        }
      );

      let searchValue = (event?.target as HTMLInputElement)?.value || "";

      modalRef.componentInstance.searchValue = searchValue;

      modalRef.result.then(
        (row) => {
          if (row === "NOT-SELECTED") {
            (event?.target as HTMLInputElement).value = "";

            console.log("No data selected from modal.");

            const currentSn = index.data.SN;
            const dataIndex = this.costCenterAccountData.findIndex(
              (item) => item.SN === currentSn
            );

            this.costCenterAccountData[dataIndex].COST_CODE = "";
            this.costCenterAccountData[dataIndex].GPC_ACCODE = "";
            this.costCenterAccountData[dataIndex].GPC_ACCODE_DESC = "";
            (event?.target as HTMLInputElement).value = "";

            return;
          }

          if (row) {
            const currentSn = index.data.SN;

            const isDuplicate = this.costCenterAccountData.some(
              (item) => item.GPC_ACCODE === row[0].GPC_ACCODE
            );

            if (isDuplicate) {
              let message = `GPC Accode Already Exist ! `;
              (event?.target as HTMLInputElement).value = "";
              return this.openDialog("Warning", message, true);
            } else {
              const dataIndex = this.costCenterAccountData.findIndex(
                (item) => item.SN === currentSn
              );

              this.costCenterAccountData[dataIndex].GPC_ACCODE =
                row[0].GPC_ACCODE;

              this.costCenterAccountData[dataIndex].GPC_ACCODE_DESC =
                row[0].Account_Head;

              this.costCenterAccountData[dataIndex].COST_CODE =
                row[0].COST_CODE;
            }
          }
        },
        (close) => {
          console.log(close);
          (event?.target as HTMLInputElement).value = "";

          console.log("No data selected from modal.");

          const currentSn = index.data.SN;
          const dataIndex = this.costCenterAccountData.findIndex(
            (item) => item.SN === currentSn
          );

          this.costCenterAccountData[dataIndex].COST_CODE = "";
          this.costCenterAccountData[dataIndex].GPC_ACCODE = "";
          this.costCenterAccountData[dataIndex].GPC_ACCODE_DESC = "";
          (event?.target as HTMLInputElement).value = "";

          return;
        }
      );
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      const currentSn = index.data.SN;

      const dataIndex = this.costCenterAccountData.findIndex(
        (item) => item.SN === currentSn
      );
      const searchValue = (event.target as HTMLInputElement).value || "";
      console.log("Expected");
      if (!searchValue || searchValue.length <= 1 || searchValue == "") {
        this.costCenterAccountData[dataIndex].COST_CODE = "";
        this.costCenterAccountData[dataIndex].GPC_ACCODE = "";
        this.costCenterAccountData[dataIndex].GPC_ACCODE_DESC = "";
      }
    }
  }

  formatDate(inputDate: string): string {
    if (!this.isValidDate(inputDate)) {
      throw new Error(`Invalid date format: ${inputDate}`);
    }

    if (!isNaN(Date.parse(inputDate))) {
      return new Date(inputDate).toISOString();
    }

    const parts = inputDate.split("/");
    return new Date(+parts[2], +parts[1] - 1, +parts[0]).toISOString();
  }

  isValidDate(date: any): boolean {
    if (!date) return false;

    if (!isNaN(Date.parse(date))) {
      return true;
    }

    const parts = date.split("/");
    if (parts.length === 3) {
      const day = +parts[0],
        month = +parts[1] - 1,
        year = +parts[2];
      const testDate = new Date(year, month, day);
      return (
        testDate.getFullYear() === year &&
        testDate.getMonth() === month &&
        testDate.getDate() === day
      );
    }

    return false;
  }

  formatDateCell = (row: any): string => {
    const date = row.VAT_DATE;
    if (!date) {
      return "";
    }

    if (typeof date === "string" && !isNaN(Date.parse(date))) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = parsedDate.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return date;
  };

  SPvalidateLookupGridModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FIELDNAMES: string[],
    LOOKUPFIELDS: string[],
    GRIDTYPE: any,
    DATA: any
  ) {
    const searchValue = event.target.value?.trim();

    if (!searchValue || this.flag === "VIEW") return;

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
            const searchResult = LOOKUPDATA.FRONTENDFILTER
              ? this.commonService.searchAllItemsInArray(
                  data,
                  LOOKUPDATA.SEARCH_VALUE
                )
              : data;

            if (searchResult?.length) {
              const matchedItem = searchResult[0];

              FIELDNAMES.forEach((fieldName, index) => {
                const lookupField = LOOKUPFIELDS[index];
                if (lookupField && lookupField in matchedItem) {
                  this.updateField(
                    matchedItem[lookupField],
                    DATA,
                    fieldName,
                    GRIDTYPE
                  );
                } else {
                  console.error(
                    `Property ${lookupField} not found in matched item.`
                  );
                  this.commonService.toastErrorByMsgId("No data found");
                  (event.target as HTMLInputElement).value = "";

                  this.clearGridData(
                    LOOKUPDATA,
                    FIELDNAMES,
                    GRIDTYPE,
                    DATA.SN - 1
                  );
                }
              });
            } else {
              this.commonService.toastErrorByMsgId("No data found");
              (event.target as HTMLInputElement).value = "";

              this.clearGridData(LOOKUPDATA, FIELDNAMES, GRIDTYPE, DATA.SN - 1);
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            (event.target as HTMLInputElement).value = "";

            this.clearGridData(LOOKUPDATA, FIELDNAMES, GRIDTYPE, DATA.SN - 1);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          (event.target as HTMLInputElement).value = "";

          this.clearGridData(LOOKUPDATA, FIELDNAMES, GRIDTYPE, DATA.SN - 1);
        },
      });

    this.subscriptions.push(sub);
  }

  clearGridData(
    LOOKUPDATA: MasterSearchModel,
    FIELDNAMES: string[],
    GRIDTYPE: any,
    INDEX: any
  ) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FIELDNAMES.forEach((fieldName) => {
      if (GRIDTYPE === "expense") {
        this.expenseHsnSacAllocationData[INDEX][fieldName] = "";
      }

      if (GRIDTYPE === "costCenter") {
        this.costCenterAccountData[INDEX][fieldName] = "";
      }
    });
  }

  goToPage(pageIndex: number, dataGrid: any): void {
    const gridInstance = dataGrid.instance;
    if (gridInstance) {
      const totalPages = gridInstance.pageCount();
      if (pageIndex >= 0 && pageIndex < totalPages) {
        gridInstance.pageIndex(pageIndex);
      } else {
        console.error("Invalid page index:", pageIndex);
      }
    }
  }

  clearSelection(dataGrid: any, tabIndex?: any): void {
    const gridInstance = dataGrid.instance;
    if (gridInstance) {
      gridInstance.clearSelection();

      if (tabIndex === 1) {
        this.selectedRowFromCostCenterAccount = [];
      } else if (tabIndex === 1) {
        this.selectedRowFromExpenseHasSacAllocation = [];
      }
    }
  }

  goToTab(index: number): void {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }

  onInput(event: any, controller?: any) {
    let input = event.target.value;

    if (input && this.flag === "ADD") {
      let API = `VatMaster/CheckIfvatCodePresent/${input}`;
      let sub: Subscription = this.apiService
        .getDynamicAPI(API)
        .subscribe((res) => {
          console.log(res);

          if (res.checkifExists === true) {
            let message = `Code Already Exist ! `;
            this.vatMasterMainForm.controls[controller].setValue("");
            return this.openDialog("Warning", message, true);
          }
        });
    }

    if (
      this.vatMasterMainForm.value.vatCode &&
      this.vatMasterMainForm.value.vatPercent &&
      this.flag === "ADD"
    ) {
      this.getAccountSettingDatewiseListData();
    }
  }
  
}
