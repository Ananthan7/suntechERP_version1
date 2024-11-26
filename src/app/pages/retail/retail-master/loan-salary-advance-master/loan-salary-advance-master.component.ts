import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-loan-salary-advance-master",
  templateUrl: "./loan-salary-advance-master.component.html",
  styleUrls: ["./loan-salary-advance-master.component.scss"],
})
export class LoanSalaryAdvanceMasterComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  @ViewChild("overlayempCode") overlayempCode!: MasterSearchComponent;
  @ViewChild("overlaystaffadvCodeSearch")
  overlaystaffadvCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayuserDefined1Search")
  overlayuserDefined1Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined2Search")
  overlayuserDefined2Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined3Search")
  overlayuserDefined3Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined4Search")
  overlayuserDefined4Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined5Search")
  overlayuserDefined5Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined6Search")
  overlayuserDefined6Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined7Search")
  overlayuserDefined7Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined8Search")
  overlayuserDefined8Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined9Search")
  overlayuserDefined9Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined10Search")
  overlayuserDefined10Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined11Search")
  overlayuserDefined11Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined12Search")
  overlayuserDefined12Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined13Search")
  overlayuserDefined13Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined14Search")
  overlayuserDefined14Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined15Search")
  overlayuserDefined15Search!: MasterSearchComponent;
  selectedTabIndex = 0;
  tableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  isloading: boolean = false;
  viewMode: boolean = false;
  deleteMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  currentDate = new Date();

  employeeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  glCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "ACCODE <>''",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "STAFF AD. GL CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefinedData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 131,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 132,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 133,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 134,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 135,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 136,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 137,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 138,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 139,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 140,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 141,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 142,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 143,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 144,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  LoanSalaryAdvanceMasterForm: FormGroup = this.formBuilder.group({
    mid: [""],
    vocno: [""],
    voc_type: [""],
    voc_date: [""],
    branch_code: [""],
    yearmonth: [""],
    loan_divn_code: [""],
    loan_dept_code: [""],
    loan_emp_code: [""],
    loan_narration: [""],
    loan_deduction_basis: [0],
    loan_amount: [0],
    loan_balance_amount: [0],
    loan_issue_date: [""],
    loan_pay_doc_details: [""],
    loan_deduction_fm_date: [""],
    loan_deduction_to_date: [""],
    loan_accode: [""],
    loan_ref1: [""],
    loan_ref2: [""],
    loan_installments: [0],
    loan_intervals: [0],
    loan_created_by: [""],
    loan_created_ts: [""],
    loan_modified_by: [""],
    loan_modified_ts: [""],
    navseqno: [0],
    print_count: [0],
    udf1: [""],
    udf2: [""],
    udf3: [""],
    udf4: [""],
    udf5: [""],
    udf6: [""],
    udf7: [""],
    udf8: [""],
    udf9: [""],
    udf10: [""],
    udf11: [""],
    udf12: [""],
    udf13: [""],
    udf14: [""],
    udf15: [""],
    // details: this.formBuilder.group({
    loandet_emp_code: [""],
    loandet_scheduled_date: [""],
    loandet_scheduled_amount: [0],
    loandet_effective_date: [""],
    loandet_effective_amount: [0],
    loandet_deducted_date: [""],
    loandet_created_by: [""],
    loandet_created_ts: [""],
    uniqueid: [0],
    dt_branch_code: [""],
    dt_voc_type: [""],
    dt_vocno: [0],
    dt_yearmonth: [""],
    loandet_amount: [""],
    loandet_repaid_amount: [""],
    loandet_balance_amount: [""],
    loandet_closing_date: [""],
    // })
  });
  branchCode: any;
  flag: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService
  ) {}

  ngOnInit(): void {
    console.log(this.content);

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;
    this.branchCode = this.commonService.branchCode;

    this.flag === "ADD" && this.generateVocNo();
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

    this.setvoucherTypeMaster();
    this.LoanSalaryAdvanceMasterForm.controls.voc_type.setValue(
      this.commonService.getqueryParamVocType()
    );
    this.LoanSalaryAdvanceMasterForm.controls.voc_date.setValue(
      this.commonService.currentDate
    );

    this.setView(this.content);
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${
      this.commonService.branchCode
    }/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(
      this.currentDate
    )}`;
    this.dataService.getDynamicAPI(API).subscribe((resp) => {
      if (resp.status == "Success") {
        console.log(resp);

        this.LoanSalaryAdvanceMasterForm.controls.vocno.setValue(resp.newvocno);
      }
    });
  }

  setView(DATA: any) {
    console.log(DATA);

    this.LoanSalaryAdvanceMasterForm.controls["voc_type"].setValue(
      DATA.VOCTYPE
    );

    this.LoanSalaryAdvanceMasterForm.controls["vocno"].setValue(DATA.VOCNO);

    this.LoanSalaryAdvanceMasterForm.controls["loan_emp_code"].setValue(
      DATA.LOAN_EMP_CODE
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_dept_code"].setValue(
      DATA.LOAN_DEPT_CODE
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_divn_code"].setValue(
      DATA.LOAN_DIVN_CODE
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_modified_by"].setValue(
      DATA.LOAN_MODIFIED_BY
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_amount"].setValue(
      DATA.LOAN_AMOUNT
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_issue_date"].setValue(
      DATA.LOAN_ISSUE_DATE
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_ref1"].setValue(
      DATA.LOAN_REF1
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_ref2"].setValue(
      DATA.LOAN_REF2
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_installments"].setValue(
      DATA.LOAN_INSTALLMENTS
    );
    this.LoanSalaryAdvanceMasterForm.controls[
      "loan_deduction_fm_date"
    ].setValue(DATA.LOAN_DEDUCTION_FM_DATE);
    this.LoanSalaryAdvanceMasterForm.controls["loan_intervals"].setValue(
      DATA.LOAN_INTERVALS
    );
    this.LoanSalaryAdvanceMasterForm.controls[
      "loan_deduction_to_date"
    ].setValue(DATA.LOAN_DEDUCTION_TO_DATE);
    this.LoanSalaryAdvanceMasterForm.controls["loan_pay_doc_details"].setValue(
      DATA.LOAN_PAY_DOC_DETAILS
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_narration"].setValue(
      DATA.LOAN_NARRATION
    );
    this.LoanSalaryAdvanceMasterForm.controls["loan_narration"].setValue(
      DATA.LOAN_NARRATION
    );

    this.LoanSalaryAdvanceMasterForm.controls["udf1"].setValue(DATA.UDF1);
    this.LoanSalaryAdvanceMasterForm.controls["udf2"].setValue(DATA.UDF2);
    this.LoanSalaryAdvanceMasterForm.controls["udf3"].setValue(DATA.UDF3);
    this.LoanSalaryAdvanceMasterForm.controls["udf4"].setValue(DATA.UDF4);
    this.LoanSalaryAdvanceMasterForm.controls["udf5"].setValue(DATA.UDF5);
    this.LoanSalaryAdvanceMasterForm.controls["udf6"].setValue(DATA.UDF6);
    this.LoanSalaryAdvanceMasterForm.controls["udf7"].setValue(DATA.UDF7);
    this.LoanSalaryAdvanceMasterForm.controls["udf8"].setValue(DATA.UDF8);
    this.LoanSalaryAdvanceMasterForm.controls["udf9"].setValue(DATA.UDF9);
    this.LoanSalaryAdvanceMasterForm.controls["udf10"].setValue(DATA.UDF10);
    this.LoanSalaryAdvanceMasterForm.controls["udf11"].setValue(DATA.UDF11);
    this.LoanSalaryAdvanceMasterForm.controls["udf12"].setValue(DATA.UDF12);
    this.LoanSalaryAdvanceMasterForm.controls["udf13"].setValue(DATA.UDF13);
    this.LoanSalaryAdvanceMasterForm.controls["udf14"].setValue(DATA.UDF14);
    this.LoanSalaryAdvanceMasterForm.controls["udf15"].setValue(DATA.UDF15);
  }

  setvoucherTypeMaster() {
    let frm = this.LoanSalaryAdvanceMasterForm.value;
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(
      frm.branch_code,
      frm.voc_type,
      frm.dt_voctype
    );
    console.log(vocTypeMaster);
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
    let form = this.LoanSalaryAdvanceMasterForm.value;

    return {
      MID: 0,
      VOCNO: this.commonService.emptyToZero(form.vocno),
      VOCTYPE: this.commonService.nullToString(form.voc_type),
      VOCDATE: form.voc_date
        ? new Date(form.voc_date).toISOString()
        : new Date().toISOString(),
      BRANCH_CODE: this.branchCode,
      YEARMONTH: this.commonService.nullToString(form.yearmonth),
      LOAN_DIVN_CODE: this.commonService.nullToString(form.loan_divn_code),
      LOAN_DEPT_CODE: this.commonService.nullToString(form.loan_dept_code),
      LOAN_EMP_CODE: this.commonService.nullToString(form.loan_emp_code),
      LOAN_NARRATION: this.commonService.nullToString(form.loan_narration),
      LOAN_DEDUCTION_BASIS: form.loan_deduction_basis || 0,
      LOAN_AMOUNT: form.loan_amount || 0,
      LOAN_BALANCE_AMOUNT: form.loan_balance_amount || 0,
      LOAN_ISSUE_DATE: form.loan_issue_date
        ? new Date(form.loan_issue_date).toISOString()
        : new Date().toISOString(),
      LOAN_PAY_DOC_DETAILS: this.commonService.nullToString(
        form.loan_pay_doc_details
      ),
      LOAN_DEDUCTION_FM_DATE: form.loan_deduction_fm_date
        ? new Date(form.loan_deduction_fm_date).toISOString()
        : new Date().toISOString(),
      LOAN_DEDUCTION_TO_DATE: form.loan_deduction_to_date
        ? new Date(form.loan_deduction_to_date).toISOString()
        : new Date().toISOString(),
      LOAN_ACCODE: this.commonService.nullToString(form.loan_accode),
      LOAN_REF1: this.commonService.nullToString(form.loan_ref1),
      LOAN_REF2: this.commonService.nullToString(form.loan_ref2),
      LOAN_INSTALLMENTS: form.loan_installments || 0,
      LOAN_INTERVALS: form.loan_intervals || 0,
      LOAN_CREATED_BY: this.commonService.nullToString(form.loan_created_by),
      LOAN_CREATED_TS: form.loan_created_ts
        ? new Date(form.loan_created_ts).toISOString()
        : new Date().toISOString(),
      LOAN_MODIFIED_BY: this.commonService.nullToString(form.loan_modified_by),
      LOAN_MODIFIED_TS: form.loan_modified_ts
        ? new Date(form.loan_modified_ts).toISOString()
        : new Date().toISOString(),
      NAVSEQNO: form.navseqno || 0,
      PRINT_COUNT: form.print_count || 0,
      UDF1: this.commonService.nullToString(form.udf1),
      UDF2: this.commonService.nullToString(form.udf2),
      UDF3: this.commonService.nullToString(form.udf3),
      UDF4: this.commonService.nullToString(form.udf4),
      UDF5: this.commonService.nullToString(form.udf5),
      UDF6: this.commonService.nullToString(form.udf6),
      UDF7: this.commonService.nullToString(form.udf7),
      UDF8: this.commonService.nullToString(form.udf8),
      UDF9: this.commonService.nullToString(form.udf9),
      UDF10: this.commonService.nullToString(form.udf10),
      UDF11: this.commonService.nullToString(form.udf11),
      UDF12: this.commonService.nullToString(form.udf12),
      UDF13: this.commonService.nullToString(form.udf13),
      UDF14: this.commonService.nullToString(form.udf14),
      UDF15: this.commonService.nullToString(form.udf15),
      // Details: form.details.map((detail: any) => ({
      //   SRNO: detail.srno || 0,
      //   VOCTYPE: this.commonService.nullToString(detail.voctype),
      //   VOCNO: detail.vocno || 0,
      //   VOCDATE: detail.vocdate ? new Date(detail.vocdate).toISOString() : new Date().toISOString(),
      //   YEARMONTH: this.commonService.nullToString(detail.yearmonth),
      //   BRANCH_CODE: this.commonService.nullToString(detail.branch_code),
      //   LOANDET_EMP_CODE: this.commonService.nullToString(detail.loandet_emp_code),
      //   LOANDET_SCHEDULED_DATE: detail.loandet_scheduled_date
      //     ? new Date(detail.loandet_scheduled_date).toISOString()
      //     : new Date().toISOString(),
      //   LOANDET_SCHEDULED_AMOUNT: detail.loandet_scheduled_amount || 0,
      //   LOANDET_EFFECTIVE_DATE: detail.loandet_effective_date
      //     ? new Date(detail.loandet_effective_date).toISOString()
      //     : new Date().toISOString(),
      //   LOANDET_EFFECTIVE_AMOUNT: detail.loandet_effective_amount || 0,
      //   LOANDET_DEDUCTED_DATE: detail.loandet_deducted_date
      //     ? new Date(detail.loandet_deducted_date).toISOString()
      //     : new Date().toISOString(),
      //   LOANDET_CREATED_BY: this.commonService.nullToString(detail.loandet_created_by),
      //   LOANDET_CREATED_TS: detail.loandet_created_ts
      //     ? new Date(detail.loandet_created_ts).toISOString()
      //     : new Date().toISOString(),
      //   UNIQUEID: detail.uniqueid || 0,
      //   DT_BRANCH_CODE: this.commonService.nullToString(detail.dt_branch_code),
      //   DT_VOCTYPE: this.commonService.nullToString(detail.dt_voctype),
      //   DT_VOCNO: detail.dt_vocno || 0,
      //   DT_YEARMONTH: this.commonService.nullToString(detail.dt_yearmonth),
      // })),
    };
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    console.log(this.tableData);

    let API = "LoanHeader/InsertLoanHeader";
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
                  this.LoanSalaryAdvanceMasterForm.reset();
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
      "LoanHeader/UpdateLoanHeader/" +
      this.content.BRANCH_CODE +
      "/" +
      this.content.VOCTYPE +
      "/" +
      this.content.VOCNO +
      "/" +
      this.content.YEARMONTH;
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
                  this.LoanSalaryAdvanceMasterForm.reset();
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
    if (!this.content.MID) {
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
          "LoanHeader/DeleteLoanHeader/" +
          this.content.BRANCH_CODE +
          "/" +
          this.content.VOCTYPE +
          "/" +
          this.content.VOCNO +
          "/" +
          this.content.YEARMONTH;
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
                      this.LoanSalaryAdvanceMasterForm.reset();
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
                      this.LoanSalaryAdvanceMasterForm.reset();
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

  UserDefined1DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf1.setValue(e.CODE);
  }
  UserDefined2DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf2.setValue(e.CODE);
  }
  UserDefined3DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf3.setValue(e.CODE);
  }
  UserDefined4DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf4.setValue(e.CODE);
  }
  UserDefined5DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf5.setValue(e.CODE);
  }
  UserDefined6DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf6.setValue(e.CODE);
  }
  UserDefined7DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf7.setValue(e.CODE);
  }
  UserDefined8DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf8.setValue(e.CODE);
  }
  UserDefined9DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf9.setValue(e.CODE);
  }
  UserDefined10DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf10.setValue(e.CODE);
  }
  UserDefined11DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf11.setValue(e.CODE);
  }
  UserDefined12DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf12.setValue(e.CODE);
  }
  UserDefined13DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf13.setValue(e.CODE);
  }
  UserDefined14DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf14.setValue(e.CODE);
  }
  UserDefined15DataSelected(e: any) {
    console.log(e);
    this.LoanSalaryAdvanceMasterForm.controls.udf15.setValue(e.CODE);
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
      const control = this.LoanSalaryAdvanceMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.LoanSalaryAdvanceMasterForm.controls[formName].setValue("");
    });
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
      case "loan_emp_code":
        this.overlayempCode.showOverlayPanel(event);
        break;
      case "loan_divn_code":
        this.overlaystaffadvCodeSearch.showOverlayPanel(event);
        break;
      case "udf1":
        this.overlayuserDefined1Search.showOverlayPanel(event);
        break;
      case "udf2":
        this.overlayuserDefined2Search.showOverlayPanel(event);
        break;
      case "udf3":
        this.overlayuserDefined3Search.showOverlayPanel(event);
        break;
      case "udf4":
        this.overlayuserDefined4Search.showOverlayPanel(event);
        break;
      case "udf5":
        this.overlayuserDefined5Search.showOverlayPanel(event);
        break;
      case "udf6":
        this.overlayuserDefined6Search.showOverlayPanel(event);
        break;
      case "udf7":
        this.overlayuserDefined7Search.showOverlayPanel(event);
        break;
      case "udf8":
        this.overlayuserDefined8Search.showOverlayPanel(event);
        break;
      case "udf9":
        this.overlayuserDefined9Search.showOverlayPanel(event);
        break;
      case "udf10":
        this.overlayuserDefined10Search.showOverlayPanel(event);
        break;
      case "udf11":
        this.overlayuserDefined11Search.showOverlayPanel(event);
        break;
      case "udf12":
        this.overlayuserDefined12Search.showOverlayPanel(event);
        break;
      case "udf13":
        this.overlayuserDefined13Search.showOverlayPanel(event);
        break;
      case "udf14":
        this.overlayuserDefined14Search.showOverlayPanel(event);
        break;
      case "udf15":
        this.overlayuserDefined15Search.showOverlayPanel(event);
        break;
      default:
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

                    this.LoanSalaryAdvanceMasterForm.controls[
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

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.LoanSalaryAdvanceMasterForm.controls[ctrl].setValue(value);
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
        this.LoanSalaryAdvanceMasterForm.controls[controller].setValue(value);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }
}
