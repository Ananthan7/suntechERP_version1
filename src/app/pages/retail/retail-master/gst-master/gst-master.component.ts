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
  @ViewChild("overlayRegCgstAcCredit")
  overlayRegCgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayRegCgstAcDebit")
  overlayRegCgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayRegSgstAcCredit")
  overlayRegSgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayRegSgstAcDebit")
  overlayRegSgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayRegIgstAcCredit")
  overlayRegIgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayRegIgstAcDebit")
  overlayRegIgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregCgstAcCredit")
  overlayUnregCgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregCgstAcDebit")
  overlayUnregCgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregSgstAcCredit")
  overlayUnregSgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregSgstAcDebit")
  overlayUnregSgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregIgstAcCredit")
  overlayUnregIgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregIgstAcDebit")
  overlayUnregIgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregCgstCtrlAcCredit")
  overlayUnregCgstCtrlAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregCgstCtrlAcDebit")
  overlayUnregCgstCtrlAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregSgstCtrlAcCredit")
  overlayUnregSgstCtrlAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregSgstCtrlAcDebit")
  overlayUnregSgstCtrlAcDebit!: MasterSearchComponent;
  @ViewChild("overlayUnregIgstCtrlAcCredit")
  overlayUnregIgstCtrlAcCredit!: MasterSearchComponent;
  @ViewChild("overlayUnregIgstCtrlAcDebit")
  overlayUnregIgstCtrlAcDebit!: MasterSearchComponent;
  @ViewChild("overlayImpIgstAcCredit")
  overlayImpIgstAcCredit!: MasterSearchComponent;
  @ViewChild("overlayImpIgstCtrlAcDebit")
  overlayImpIgstCtrlAcDebit!: MasterSearchComponent;
  @ViewChild("overlayExpIgstAcDebit")
  overlayExpIgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayExpIgstCtrlAcCredit")
  overlayExpIgstCtrlAcCredit!: MasterSearchComponent;
  @ViewChild("overlayimpIgstAcDebit")
  overlayimpIgstAcDebit!: MasterSearchComponent;
  @ViewChild("overlayImpIgstCtrlAcCredit")
  overlayImpIgstCtrlAcCredit!: MasterSearchComponent;

  expenseHsnOrSacAllocationData: any[] = [];
  stateWiseGstDetailsData: any[] = [];
  dateWiseGstDetailsData: any[] = [];
  flag: any;
  code: any;
  dialogBox: any;
  branchCode: any;
  selectedRowIndex: any;

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

  roundOffAcCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "ROUND OFF A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  CGSTACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "CGST A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  SGSTACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "SGST A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  IGSTACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "IGST A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  CGSTCTRLACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "CGST CTRL A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  SGSTCTRLACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "SGST CTRL A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  IGSTCTRLACCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "account_mode not in ('P','R')  and isnull(accode,'')<>''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "IGST CTRL A/C",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

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

  expenseCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 7,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      " BRANCH_CODE = 'strbranchcode' AND AC_OnHold = 0 and  VIEW_ACCMST_BRANCHWISE.ACCODE in (select ACCODE from ACCOUNT_MAIN where ( (  account_mode in ('L','G')) ) and ISNULL(accode,'') <> '')",
    SEARCH_FIELD: "STOCK_CODE",
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
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "HSN CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  expenseHsnOrSacAllocationColumnHeadings: any[] = [
    { field: "Sr", caption: "Sr" },
    { field: "Exp. A/c", caption: "Exp. A/c" },
    { field: "Exp. A/c Desc", caption: "Exp. A/c Desc" },
    { field: "HSN Code", caption: "HSN Code" },
    { field: "HSN Desc", caption: "HSN Desc" },
    { field: "Tax Reg", caption: "Tax Reg" },
    { field: "Rev Un", caption: "Rev Un" },
    { field: "I/p Cre", caption: "I/p Cre" },
  ];

  stateWiseGstDetailsColumnHeadings: any[] = [
    { field: "STATE_CODE", caption: "State Code" },
    { field: "STATE_DESCRIPTION", caption: "Description" },
    { field: "CGST_PER", caption: "CGST%" },
    { field: "SGST_PER", caption: "SGST%" },
    { field: "IGST_PER", caption: "IGST%" },
  ];

  dateWiseGstDetailsColumnHeadings: any[] = [
    { field: "SRNO", caption: "Sr No" },
    { field: "GST_CODE", caption: "GST Code" },
    { field: "GST_DATE", caption: "Date" },
    { field: "IGST_PER", caption: "GST %" },
    { field: "YEARCODE", caption: "Year Month" },
  ];

  selectedIndexes: any;

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
    impIgstAcDebit: [""],
    impIgstCtrlAcDebit: [""],
    impIgstCtrlAcCredit: [""],
    expIgstAcDebit: [""],
    expIgstCtrlAcCredit: [""],
    expAc: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.branchCode = this.commonService.branchCode;
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
      this.getStateListData();
    }
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
      this.getStateListData();
    }
    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    this.code = DATA.GST_CODE;
    this.gstMasterMainForm.controls["gstCode"].setValue(DATA.GST_CODE);
    this.gstMasterMainForm.controls["gstDesc"].setValue(DATA.GST_DESCRIPTION);
    this.gstMasterMainForm.controls["gstPercent"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.GST_PER),
        "THREE"
      )
    );
    this.gstMasterMainForm.controls["cessPercent"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.CESS_PER),
        "THREE"
      )
    );
    this.gstMasterMainForm.controls["group1"].setValue(DATA.GROUP_CODE1);
    this.gstMasterMainForm.controls["group2"].setValue(DATA.GROUP_CODE2);
    this.gstMasterMainForm.controls["group3"].setValue(DATA.GROUP_CODE3);
    this.gstMasterMainForm.controls["roundOff"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.GST_ROUNDOFF),
        "THREE"
      )
    );
    this.gstMasterMainForm.controls["roundOffAc"].setValue(
      DATA.ROUNDOFF_ACCODE
    );
    this.gstMasterMainForm.controls["regCgstAcCredit"].setValue(
      DATA.REG_CGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["regCgstAcDebit"].setValue(
      DATA.REG_CGST_DEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["regIgstAcCredit"].setValue(
      DATA.REG_IGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["regIgstAcDebit"].setValue(
      DATA.REG_IGST_DEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["regSgstAcCredit"].setValue(
      DATA.REG_SGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["regSgstAcDebit"].setValue(
      DATA.REG_SGST_DEBIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregCgstAcCredit"].setValue(
      DATA.UNREG_CGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["unregCgstAcDebit"].setValue(
      DATA.UNREG_CGST_DEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["unregSgstAcCredit"].setValue(
      DATA.UNREG_SGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["unregSgstAcDebit"].setValue(
      DATA.UNREG_SGST_DEBIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregIgstAcCredit"].setValue(
      DATA.UNREG_IGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["unregIgstAcDebit"].setValue(
      DATA.UNREG_IGST_DEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["unregCgstCtrlAcCredit"].setValue(
      DATA.UNREG_CGST_CTRLCREDIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregCgstCtrlAcDebit"].setValue(
      DATA.UNREG_CGST_CTRLDEBIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregSgstCtrlAcCredit"].setValue(
      DATA.UNREG_SGST_CTRLCREDIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregSgstCtrlAcDebit"].setValue(
      DATA.UNREG_SGST_CTRLDEBIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregIgstCtrlAcCredit"].setValue(
      DATA.UNREG_IGST_CTRLCREDIT_ACCODE
    );

    this.gstMasterMainForm.controls["unregIgstCtrlAcDebit"].setValue(
      DATA.UNREG_IGST_CTRLDEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["impIgstAcCredit"].setValue(
      DATA.IMPORT_IGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["impIgstAcDebit"].setValue(
      DATA.IMPORT_IGST_DEBIT_ACCODE
    );

    this.gstMasterMainForm.controls["impIgstCtrlAcCredit"].setValue(
      DATA.IMPORT_IGST_CTRLCREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["impIgstCtrlAcDebit"].setValue(
      DATA.IMPORT_IGST_CTRLDEBIT_ACCODE
    );
    this.gstMasterMainForm.controls["expIgstAcDebit"].setValue(
      DATA.EXPORT_IGST_CREDIT_ACCODE
    );
    this.gstMasterMainForm.controls["expIgstCtrlAcCredit"].setValue(
      DATA.EXPORT_IGST_CTRLDEBIT_ACCODE
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

  gstMasterMainFormSubmit() {
    console.log(this.dateWiseGstDetailsData);

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
        GST_CODE: this.gstMasterMainForm.value.gstCode || "",
        GST_DESCRIPTION: this.gstMasterMainForm.value.gstDesc || "",
        GST_PER: Number(this.gstMasterMainForm.value.gstPercent) || 0,
        SGST_ACCODE: "string",
        IGST_ACCODE: "string",
        CGST_ACCODE: "string",
        GROUP_CODE1: this.gstMasterMainForm.value.group1 || "",
        GROUP_CODE2: this.gstMasterMainForm.value.group2 || "",
        GROUP_CODE3: this.gstMasterMainForm.value.group3 || "",
        MID: 0,
        CONTROL_ACCCODE: "string",
        REG_CGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.regCgstAcCredit || "",
        REG_CGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.regCgstAcDebit || "",
        REG_SGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.regSgstAcCredit || "",
        REG_SGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.regSgstAcDebit || "",
        REG_IGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.regIgstAcCredit || "",
        REG_IGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.regIgstAcDebit || "",
        UNREG_CGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.unregCgstAcCredit || "",
        UNREG_CGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.unregCgstAcDebit || "",
        UNREG_SGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.unregSgstAcCredit || "",
        UNREG_SGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.unregSgstAcDebit || "",
        UNREG_IGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.unregIgstAcCredit || "",
        UNREG_IGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.unregIgstAcDebit || "",
        UNREG_CGST_CTRLCREDIT_ACCODE:
          this.gstMasterMainForm.value.unregCgstCtrlAcCredit || "",
        UNREG_CGST_CTRLDEBIT_ACCODE:
          this.gstMasterMainForm.value.unregCgstCtrlAcDebit || "",
        UNREG_SGST_CTRLCREDIT_ACCODE:
          this.gstMasterMainForm.value.unregSgstCtrlAcCredit || "",
        UNREG_SGST_CTRLDEBIT_ACCODE:
          this.gstMasterMainForm.value.unregSgstCtrlAcDebit || "",
        UNREG_IGST_CTRLCREDIT_ACCODE:
          this.gstMasterMainForm.value.unregIgstCtrlAcCredit || "",
        UNREG_IGST_CTRLDEBIT_ACCODE:
          this.gstMasterMainForm.value.unregIgstCtrlAcDebit || "",
        IMPORT_IGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.impIgstAcCredit || "",
        IMPORT_IGST_DEBIT_ACCODE:
          this.gstMasterMainForm.value.impIgstAcDebit || "",
        IMPORT_IGST_CTRLCREDIT_ACCODE:
          this.gstMasterMainForm.value.impIgstCtrlAcCredit || "",
        IMPORT_IGST_CTRLDEBIT_ACCODE:
          this.gstMasterMainForm.value.impIgstCtrlAcDebit || "",
        EXPORT_IGST_CREDIT_ACCODE:
          this.gstMasterMainForm.value.expIgstAcDebit || "",
        EXPORT_IGST_CTRLDEBIT_ACCODE:
          this.gstMasterMainForm.value.expIgstCtrlAcCredit || "",
        GST_ROUNDOFF: Number(this.gstMasterMainForm.value.roundOff) || 0,
        ROUNDOFF_ACCODE: this.gstMasterMainForm.value.roundOffAc || "",
        CESS_ACCODE: "string",
        CESS_PER: Number(this.gstMasterMainForm.value.cessPercent) || 0,
        // gstMasterGst:
        //   this.expenseHsnOrSacAllocationData.length > 0
        //     ? [
        //         {
        //           UNIQUEID: 0,
        //           SN: this.expenseHsnOrSacAllocationData[0].SRNO,
        //           GST_CODE: this.gstMasterMainForm.value.gstCode,
        //           GST_DESCRIPTION: this.gstMasterMainForm.value.gstDesc,
        //           GST_PER: 0,
        //           EXPENSE_ACCODE:
        //             this.expenseHsnOrSacAllocationData[0].EXPENSE_ACCODE,
        //           EXPENSE_ACCODE_DESC:
        //             this.expenseHsnOrSacAllocationData[0].EXPENSE_ACCODE_DESC,
        //           HSN_SAC_CODE:
        //             this.expenseHsnOrSacAllocationData[0].HSN_SAC_CODE,
        //           HSN_SAC_DESC:
        //             this.expenseHsnOrSacAllocationData[0].HSN_SAC_DESC,
        //           TAX_REG: this.expenseHsnOrSacAllocationData[0].TAX_REG,
        //           REVERSECHARGE_UNREG:
        //             this.expenseHsnOrSacAllocationData[0].REVERSECHARGE_UNREG,
        //           ELIGIBLE_INPUTCREDIT:
        //             this.expenseHsnOrSacAllocationData[0].ELIGIBLE_INPUTCREDIT,
        //           EXPENSE_ACCTYPE: "str",
        //           COST_CODE: "string",
        //         },
        //       ]
        //     : [],

        gstMasterGst: this.expenseHsnOrSacAllocationData.map((item) => ({
          UNIQUEID: 0,
          SN: item.SRNO || 0,
          GST_CODE: this.gstMasterMainForm.value.gstCode || "",
          GST_DESCRIPTION: this.gstMasterMainForm.value.gstDesc || "",
          GST_PER: 0,
          EXPENSE_ACCODE: item.EXPENSE_ACCODE || "",
          EXPENSE_ACCODE_DESC: item.EXPENSE_ACCODE_DESC || "",
          HSN_SAC_CODE: item.HSN_SAC_CODE || "",
          HSN_SAC_DESC: item.HSN_SAC_DESC || "",
          TAX_REG: item.TAX_REG || "",
          REVERSECHARGE_UNREG: item.REVERSECHARGE_UNREG || "",
          ELIGIBLE_INPUTCREDIT: item.ELIGIBLE_INPUTCREDIT || "",
          EXPENSE_ACCTYPE: "str",
          COST_CODE: "string",
        })),

        // gstMasterDetails:
        //   this.stateWiseGstDetailsData.length > 0
        //     ? [
        //         {
        //           GST_CODE: this.gstMasterMainForm.value.gstCode,
        //           STATE_CODE: this.stateWiseGstDetailsData[0].STATE_CODE,
        //           STATE_DESCRIPTION:
        //             this.stateWiseGstDetailsData[0].STATE_DESCRIPTION,
        //           CGST_PER: 0,
        //           SGST_PER: 0,
        //           IGST_PER: 0,
        //           UNIQUEID: 0,
        //         },
        //       ]
        //     : [],

        gstMasterDetails: this.stateWiseGstDetailsData.map((item) => ({
          GST_CODE: this.gstMasterMainForm.value.gstCode,
          STATE_CODE: item.STATE_CODE || "",
          STATE_DESCRIPTION: item.STATE_DESCRIPTION || "",
          CGST_PER: 0,
          SGST_PER: 0,
          IGST_PER: 0,
          UNIQUEID: 0,
        })),

        // gstMasterFyGst:
        //   this.dateWiseGstDetailsData.length > 0
        //     ? [
        //         {
        //           BRANCH_CODE: this.branchCode,
        //           UNIQUEID: 0,
        //           SRNO: Number(this.dateWiseGstDetailsData[0].SrNo),
        //           GST_CODE: this.dateWiseGstDetailsData[0].VAT_Code,
        //           GST_PER: Number(this.dateWiseGstDetailsData[0].VAT_Per),
        //           CGST_PER: 0,
        //           SGST_PER: 0,
        //           IGST_PER: 0,
        //           YEARCODE: this.dateWiseGstDetailsData[0].YearMonth,
        //           GST_DATE: "2024-11-29T04:03:07.279Z",
        //         },
        //       ]
        //     : [],

        gstMasterFyGst: this.dateWiseGstDetailsData.map((item) => ({
          BRANCH_CODE: this.branchCode,
          UNIQUEID: 0,
          SRNO: Number(item.SrNo) || 0,
          GST_CODE: item.GST_CODE || "",
          GST_PER: Number(item.VAT_Per) || 0,
          CGST_PER: 0,
          SGST_PER: 0,
          IGST_PER: 0,
          YEARCODE: item.YearMonth,
          GST_DATE: new Date(),
        })),
      };

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

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  charAndDigitLimitChecker(event: any, controller: string) {
    const inputValue = event.target.value;
    const value = parseFloat(inputValue);

    if (controller === "gstPercent") {
      const message = `A percentage value cannot be greater than 100.`;

      if (isNaN(value) || value > 100) {
        this.openDialog("Warning", message, true);
        this.gstMasterMainForm.controls[controller].setValue("");
      } else {
        this.gstMasterMainForm.controls[controller].setValue(inputValue);
      }

      value <= 100 ? this.getDatewiseListData() : console.log();
    }
  }

  checkPercentage(event: any) {
    let message = `Percentage must be more than zero`;
    if (this.gstMasterMainForm.value.gstPercent === "") {
      this.gstMasterMainForm.controls["roundOff"].setValue("");
      this.openDialog("Warning", message, true);
    }
  }

  openTab(event: KeyboardEvent, formControlName: string) {
    const control = this.gstMasterMainForm.get(formControlName);
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

      case "roundOffAc":
        this.overlayRoundOffAcc.showOverlayPanel(event);
        break;

      case "regCgstAcCredit":
        this.overlayRegCgstAcCredit.showOverlayPanel(event);
        break;

      case "regCgstAcDebit":
        this.overlayRegCgstAcDebit.showOverlayPanel(event);
        break;
      case "regSgstAcCredit":
        this.overlayRegSgstAcCredit.showOverlayPanel(event);
        break;

      case "regSgstAcDebit":
        this.overlayRegSgstAcDebit.showOverlayPanel(event);
        break;
      case "regIgstAcCredit":
        this.overlayRegIgstAcCredit.showOverlayPanel(event);
        break;
      case "regIgstAcDebit":
        this.overlayRegIgstAcDebit.showOverlayPanel(event);
        break;
      case "unregCgstAcCredit":
        this.overlayUnregCgstAcCredit.showOverlayPanel(event);
        break;

      case "unregCgstAcDebit":
        this.overlayUnregCgstAcDebit.showOverlayPanel(event);
        break;

      case "unregSgstAcCredit":
        this.overlayUnregSgstAcCredit.showOverlayPanel(event);
        break;
      case "unregSgstAcDebit":
        this.overlayUnregSgstAcDebit.showOverlayPanel(event);
        break;

      case "unregIgstAcCredit":
        this.overlayUnregIgstAcCredit.showOverlayPanel(event);
        break;

      case "unregIgstAcDebit":
        this.overlayUnregIgstAcDebit.showOverlayPanel(event);
        break;

      case "unregCgstCtrlAcCredit":
        this.overlayUnregCgstCtrlAcCredit.showOverlayPanel(event);
        break;

      case "unregCgstCtrlAcDebit":
        this.overlayUnregCgstCtrlAcDebit.showOverlayPanel(event);
        break;

      case "unregCgstCtrlAcDebit":
        this.overlayUnregCgstCtrlAcDebit.showOverlayPanel(event);
        break;

      case "unregSgstCtrlAcCredit":
        this.overlayUnregSgstCtrlAcCredit.showOverlayPanel(event);
        break;

      case "unregSgstCtrlAcDebit":
        this.overlayUnregSgstCtrlAcDebit.showOverlayPanel(event);
        break;

      case "unregIgstCtrlAcCredit":
        this.overlayUnregIgstCtrlAcCredit.showOverlayPanel(event);
        break;

      case "unregIgstCtrlAcDebit":
        this.overlayUnregIgstCtrlAcDebit.showOverlayPanel(event);
        break;

      case "impIgstAcCredit":
        this.overlayImpIgstAcCredit.showOverlayPanel(event);
        break;

      case "impIgstCtrlAcDebit":
        this.overlayImpIgstCtrlAcDebit.showOverlayPanel(event);
        break;

      case "expIgstAcDebit":
        this.overlayExpIgstAcDebit.showOverlayPanel(event);
        break;

      case "expIgstCtrlAcCredit":
        this.overlayExpIgstCtrlAcCredit.showOverlayPanel(event);
        break;

      case "impIgstAcDebit":
        this.overlayimpIgstAcDebit.showOverlayPanel(event);
        break;

      case "impIgstCtrlAcCredit":
        this.overlayImpIgstCtrlAcCredit.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
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

  getStateListData() {
    let PARAMS =
      this.flag === "ADD"
        ? { MODE: this.flag }
        : { MODE: this.flag, GST_CODE: this.code };

    let API = `GstMaster/GetStatelist/${this.branchCode}`;

    let sub: Subscription = this.apiService
      .getDynamicAPIwithParamsCustom(API, PARAMS)
      .subscribe(
        (result) => {
          if (result.status.trim() === "Success") {
            this.stateWiseGstDetailsData = result.dynamicData[0].map(
              (item: any) => ({
                ...item,
                IGST_PER: 0,
                SGST_PER: 0,
                CGST_PER: 0,
              })
            );
            console.log(this.stateWiseGstDetailsData);
          }
        },
        (err) => {
          console.error("Error fetching data:", err);
          this.commonService.toastErrorByMsgId("MSG1531");
        }
      );
  }
  getDatewiseListData() {
    const payload = {
      strDate: new Date(),
      strPer: this.gstMasterMainForm.value.gstPercent,
      strVATCode: this.gstMasterMainForm.value.gstCode,
    };
    const API = `GstMaster/GetUspGetFinancialDates`;

    this.apiService.postDynamicAPI(API, payload).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.dateWiseGstDetailsData = result.dynamicData[0].map(
            (item: any) => ({
              SRNO: item.SRNO || item.SrNo,
              GST_CODE: item.GST_CODE || item.VAT_Code,
              GST_DATE: item.GST_DATE || item.VAT_Per,
              IGST_PER: item.IGST_PER || item.VAT_Per,
              YEARCODE: item.YEARCODE || item.YearMonth,
            })
          );
          console.log(this.dateWiseGstDetailsData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
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
      this.expenseHsnOrSacAllocationData =
        this.expenseHsnOrSacAllocationData.filter(
          (_, index) => !this.selectedRowIndex.includes(index)
        );

      console.log("Rows deleted successfully");
      this.selectedRowIndex = [];
    } else {
      console.log("No row selected to delete");
    }
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log("Selected Row Keys:", values);

    let indexes: number[] = [];

    this.expenseHsnOrSacAllocationData.forEach((value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        indexes.push(index);
      }
    });

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

  onInput(event: any, controller?: any, checkExistCode?: any) {
    const input = event.target.value;

    if (checkExistCode === true) {
      let API = `GstMaster/CheckGstIfCodeExists/${input}`;
      let sub: Subscription = this.apiService
        .getDynamicAPI(API)
        .subscribe((res) => {
          if (res.checkifExists === true) {
            let message = `GST Code Already Exist ! `;
            this.gstMasterMainForm.controls[controller].setValue("");
            return this.openDialog("Warning", message, true);
          }
        });
    }
  }

  getGridDataObjects(CODE: any) {
    let API = `GstMaster/GetGstMasterDetail/${CODE}`;
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
          this.stateWiseGstDetailsData = result.response.gstMasterDetails;
          this.dateWiseGstDetailsData = result.response.gstMasterFyGst;

          console.log(this.expenseHsnOrSacAllocationData);
          console.log(this.stateWiseGstDetailsData);
          console.log(this.dateWiseGstDetailsData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
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

    this.expenseHsnOrSacAllocationData[currentIndex].HSN_SAC_CODE =
      event.CODE;
    this.expenseHsnOrSacAllocationData[currentIndex].HSN_SAC_DESC =
      event.DESCRIPTION;

    console.log(this.expenseHsnOrSacAllocationData);
  }




  codeAlert(event: any, controller: any) {
    if (controller === "gstPercent") {
      let message = `A percentage value cannot be greater than 100.`;

      if (event.target.value > 100) {
        this.gstMasterMainForm.controls[controller].setValue("");
        this.openDialog("Warning", message, true);
      } else {
        this.gstMasterMainForm.controls[controller].setValue(
          event.target.value
        );
      }
    }

    const message = "Please enter code first!";
    const GSTCODE = this.gstMasterMainForm.value.gstCode;
    const GSTPERCENT = this.gstMasterMainForm.value.gstPercent;

    console.log("Value:", GSTCODE);

    if (GSTCODE === "" || !GSTCODE) {
      this.openDialog("Warning", message, true);
      this.gstMasterMainForm.controls[controller].setValue(" ");
    }

    if (GSTCODE && GSTPERCENT) {
      this.getDatewiseListData();
    }
  }
}
