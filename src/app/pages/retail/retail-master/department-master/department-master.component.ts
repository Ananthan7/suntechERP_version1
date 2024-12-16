import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-department-master",
  templateUrl: "./department-master.component.html",
  styleUrls: ["./department-master.component.scss"],
})
export class DepartmentMasterComponent implements OnInit {
  @Input() content!: any;

  @ViewChild("overlayBranchSearch") overlayBranchSearch!: MasterSearchComponent;
  @ViewChild("overlayCountryCodeSearch")
  overlayCountryCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayoneTimeCodeSearch")
  overlayoneTimeCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayleaveSalaryCodeSearch")
  overlayleaveSalaryCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayairTicketCodeSearch")
  overlayairTicketCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayGratuityCodeSearch")
  overlayGratuityCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayAIDebitExpCodeSearch")
  overlayAIDebitExpCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayAICreditCodeSearch")
  overlayAICreditCodeSearch!: MasterSearchComponent;
  @ViewChild("overlayDebitExpensesLeaveSalSearch")
  overlayDebitExpensesLeaveSalSearch!: MasterSearchComponent;
  @ViewChild("overlayDebitExpensesAirTicketSearch")
  overlayDebitExpensesAirTicketSearch!: MasterSearchComponent;
  @ViewChild("overlayDebitExpensesGratuitySearch")
  overlayDebitExpensesGratuitySearch!: MasterSearchComponent;
  @ViewChild("overlayCreditExpensesLeaveSalSearch")
  overlayCreditExpensesLeaveSalSearch!: MasterSearchComponent;
  @ViewChild("overlayCreditExpensesAirTicketSearch")
  overlayCreditExpensesAirTicketSearch!: MasterSearchComponent;
  @ViewChild("overlayCreditExpensesGratuitySearch")
  overlayCreditExpensesGratuitySearch!: MasterSearchComponent;
  @ViewChild("overlayOtherAmountValueSearch")
  overlayOtherAmountValueSearch!: MasterSearchComponent;
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
  branchCode: any = this.commonService.branchCode;

  dialogBox: any;

  selectedTabIndex = 0;
  tableData: any = [];
  editMode: boolean = false;
  codeEnable: boolean = true;
  private subscriptions: Subscription[] = [];
  isloading: boolean = false;
  viewMode: boolean = false;
  deleteMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;

  CountryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  oneTimeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 128,
    SEARCH_FIELD: "PAY_OVERTIME_MASTER ",
    SEARCH_HEADING: "one Time Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  leaveSalaryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 125,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Leave Salary Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  airTicketCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 126,
    ORDER_TYPE: 0,
    WHERECONDITION: "CODE<> ''",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Air Ticket Code",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  GratuityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 127,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Gratuity Code Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  AIDebitExpCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 1,
    WHERECONDITION: `ACCODE<> '' and  ADBRANCH_CODE= '${this.branchCode}'`,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Debit Expenses",
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  AICreditCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Credit Salary Payable",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  DebitExpensesLeaveSalData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: " Leave Salary Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  DebitExpensesAirTicketData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Air Ticket",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  DebitExpensesGratuityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Gratuity Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  CreditExpensesLeaveSalData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: " Leave Salary Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  CreditExpensesAirTicketData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Air Ticket",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  CreditExpensesGratuityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Gratuity Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  OtherAmountValueData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: " Other Amount Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
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

  PDEPTMST_WEEKOFF1 = [
    {
      name: "Yes",
      value: 1,
    },
    {
      name: "No",
      value: 0,
    },
  ];

  departmentMasterForm: FormGroup = this.formBuilder.group({
    code: ["", Validators.required],
    Description: [""],
    CountryCode: [""],
    CountryCodeDes: [""],
    shift: [""],
    PDEPTMST_WEEKOFF1: [""],
    PDEPTMST_HALFDAY1: [""],
    PDEPTMST_WEEKOFF2: [""],
    PDEPTMST_HALFDAY2: [""],
    TYPEWEEKOFF1: [false],
    TYPEWEEKOFF2: [false],
    oneTimeCode: [""],
    leaveSalaryCode: [""],
    airTicketCode: [""],
    GratuityCode: [""],

    AIDebitExpCode: [""],
    AICreditCode: [""],
    DebitExpensesLeaveSal: [""],
    DebitExpensesAirTicket: [""],
    DebitExpensesGratuity: [""],
    CreditExpensesLeaveSal: [""],
    CreditExpensesAirTicket: [""],
    CreditExpensesGratuity: [""],
    OtherAmount: [""],
    OtherAmountValue: [""],

    Shift1From: [""],
    Shift1To: [""],
    Shift1Break1: [""],
    Shift1Break1From: [""],
    Shift1Break1To: [""],
    Shift1Break2: [""],
    Shift1Break2From: [""],
    Shift1Break2To: [""],
    Shift2: [""],
    Shift2From: [""],
    Shift2To: [""],
    Shift2Break1: [""],
    Shift2Break1From: [""],
    Shift2Break1To: [""],
    Shift2Break2: [""],
    Shift2Break2From: [""],
    Shift2Break2To: [""],
    Shift3: [""],
    Shift3From: [""],
    Shift3To: [""],
    Shift3Break1: [""],
    Shift3Break1From: [""],
    Shift3Break1To: [""],
    Shift3Break2: [""],
    Shift3Break2From: [""],
    Shift3Break2To: [""],
    userDefined1: [""],
    UserDefined2: [""],
    UserDefined3: [""],
    UserDefined4: [""],
    UserDefined5: [""],
    UserDefined6: [""],
    UserDefined7: [""],
    UserDefined8: [""],
    UserDefined9: [""],
    UserDefined10: [""],
    UserDefined11: [""],
    UserDefined12: [""],
    UserDefined13: [""],
    UserDefined14: [""],
    UserDefined15: [""],
  });
  weekOff: any;
  weekOffType: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.renderer.selectRootElement('#code')?.focus();
    // this.codeEnable = true;
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMode = false;
        this.deleteDepartmentMaster();
      }
    }


    this.weekOff = this.commonService
      .getComboFilterByID("Days of Week")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.weekOff);

    this.weekOffType = this.commonService
      .getComboFilterByID("Weekly Off Type")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.weekOffType);
    console.log(this.commonService.getComboFilterByID("Weekly Off Type"));
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

  codeEnabled() {
    if (this.departmentMasterForm.value.code == '') {
      this.codeEnable = true;
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
    }
    else {
      this.codeEnable = false;
    }
  }

checkCode(): boolean {
  if (this.departmentMasterForm.value.code == '') {
    this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
    return true
  }
  return false
  }
  CountryCodeDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.CountryCode.setValue(e.CODE);
    this.departmentMasterForm.controls.CountryCodeDes.setValue(e.DESCRIPTION);
  }

  oneTimeCodeDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.oneTimeCode.setValue(e.CODE);
  }

  leaveSalaryCodeDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.leaveSalaryCode.setValue(e.CODE);
  }

  airTicketCodeDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.airTicketCode.setValue(e.CODE);
  }

  GratuityCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.GratuityCode.setValue(e.CODE);
  }

  AIDebitExpCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.AIDebitExpCode.setValue(e.ACCODE);
  }

  AICreditCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.AICreditCode.setValue(e.ACCODE);
  }

  DebitExpensesLeaveSalDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesLeaveSal.setValue(e.ACCODE);
  }

  DebitExpensesAirTicketSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesAirTicket.setValue(
      e.ACCODE
    );
  }

  DebitExpensesGratuityDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesGratuity.setValue(e.ACCODE);
  }

  CreditExpensesLeaveSalDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.CreditExpensesLeaveSal.setValue(
      e.ACCODE
    );
  }

  CreditExpensesAirTicketSelected(e: any) {
    console.log(e);
    if (this.checkCode()) return
    this.departmentMasterForm.controls.CreditExpensesAirTicket.setValue(
      e.ACCODE
    );
  }

  CreditExpensesGratuityDataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.CreditExpensesGratuity.setValue(
      e.ACCODE
    );
  }

  OtherAmountValueSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.OtherAmountValue.setValue(e.ACCODE);
  }

  UserDefined1DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined1.setValue(e.CODE);
  }
  UserDefined2DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined2.setValue(e.CODE);
  }
  UserDefined3DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined3.setValue(e.CODE);
  }
  UserDefined4DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined4.setValue(e.CODE);
  }
  UserDefined5DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined5.setValue(e.CODE);
  }
  UserDefined6DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined6.setValue(e.CODE);
  }
  UserDefined7DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined7.setValue(e.CODE);
  }
  UserDefined8DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined8.setValue(e.CODE);
  }
  UserDefined9DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined9.setValue(e.CODE);
  }
  UserDefined10DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined10.setValue(e.CODE);
  }
  UserDefined11DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined11.setValue(e.CODE);
  }
  UserDefined12DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined12.setValue(e.CODE);
  }
  UserDefined13DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined13.setValue(e.CODE);
  }
  UserDefined14DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined14.setValue(e.CODE);
  }
  UserDefined15DataSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.departmentMasterForm.controls.UserDefined15.setValue(e.CODE);
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
      case "CountryCode":
        this.overlayCountryCodeSearch.showOverlayPanel(event);
        break;
      case "oneTimeCode":
        this.overlayoneTimeCodeSearch.showOverlayPanel(event);
        break;
      case "leaveSalaryCode":
        this.overlayleaveSalaryCodeSearch.showOverlayPanel(event);
        break;
      case "airTicketCode":
        this.overlayairTicketCodeSearch.showOverlayPanel(event);
        break;
      case "GratuityCode":
        this.overlayGratuityCodeSearch.showOverlayPanel(event);
        break;
      case "AIDebitExpCode":
        this.overlayAIDebitExpCodeSearch.showOverlayPanel(event);
        break;
      case "AICreditCode":
        this.overlayAICreditCodeSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesLeaveSal":
        this.overlayDebitExpensesLeaveSalSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesAirTicket":
        this.overlayDebitExpensesAirTicketSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesGratuity":
        this.overlayDebitExpensesGratuitySearch.showOverlayPanel(event);
        break;
      case "CreditExpensesLeaveSal":
        this.overlayCreditExpensesLeaveSalSearch.showOverlayPanel(event);
        break;
      case "CreditExpensesAirTicket":
        this.overlayCreditExpensesAirTicketSearch.showOverlayPanel(event);
        break;
      case "CreditExpensesGratuity":
        this.overlayCreditExpensesGratuitySearch.showOverlayPanel(event);
        break;
      case "OtherAmountValue":
        this.overlayOtherAmountValueSearch.showOverlayPanel(event);
        break;
      case "userDefined1":
        this.overlayuserDefined1Search.showOverlayPanel(event);
        break;
      case "UserDefined2":
        this.overlayuserDefined2Search.showOverlayPanel(event);
        break;
      case "UserDefined3":
        this.overlayuserDefined3Search.showOverlayPanel(event);
        break;
      case "UserDefined4":
        this.overlayuserDefined4Search.showOverlayPanel(event);
        break;
      case "UserDefined5":
        this.overlayuserDefined5Search.showOverlayPanel(event);
        break;
      case "UserDefined6":
        this.overlayuserDefined6Search.showOverlayPanel(event);
        break;
      case "UserDefined7":
        this.overlayuserDefined7Search.showOverlayPanel(event);
        break;
      case "UserDefined8":
        this.overlayuserDefined8Search.showOverlayPanel(event);
        break;
      case "UserDefined9":
        this.overlayuserDefined9Search.showOverlayPanel(event);
        break;
      case "UserDefined10":
        this.overlayuserDefined10Search.showOverlayPanel(event);
        break;
      case "UserDefined11":
        this.overlayuserDefined11Search.showOverlayPanel(event);
        break;
      case "UserDefined12":
        this.overlayuserDefined12Search.showOverlayPanel(event);
        break;
      case "UserDefined13":
        this.overlayuserDefined13Search.showOverlayPanel(event);
        break;
      case "UserDefined14":
        this.overlayuserDefined14Search.showOverlayPanel(event);
        break;
      case "UserDefined15":
        this.overlayuserDefined15Search.showOverlayPanel(event);
        break;
      default:
    }
  }

  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case "CountryCode":
        this.overlayCountryCodeSearch.showOverlayPanel(event);
        break;
      case "oneTimeCode":
        this.overlayoneTimeCodeSearch.showOverlayPanel(event);
        break;
      case "leaveSalaryCode":
        this.overlayleaveSalaryCodeSearch.showOverlayPanel(event);
        break;
      case "airTicketCode":
        this.overlayairTicketCodeSearch.showOverlayPanel(event);
        break;
      case "GratuityCode":
        this.overlayGratuityCodeSearch.showOverlayPanel(event);
        break;
      case "AIDebitExpCode":
        this.overlayAIDebitExpCodeSearch.showOverlayPanel(event);
        break;
      case "AICreditCode":
        this.overlayAICreditCodeSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesLeaveSal":
        this.overlayDebitExpensesLeaveSalSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesAirTicket":
        this.overlayDebitExpensesAirTicketSearch.showOverlayPanel(event);
        break;
      case "DebitExpensesGratuity":
        this.overlayDebitExpensesGratuitySearch.showOverlayPanel(event);
        break;
      case "CreditExpensesLeaveSal":
        this.overlayCreditExpensesLeaveSalSearch.showOverlayPanel(event);
        break;
      case "CreditExpensesAirTicket":
        this.overlayCreditExpensesAirTicketSearch.showOverlayPanel(event);
        break;
      case "CreditExpensesGratuity":
        this.overlayCreditExpensesGratuitySearch.showOverlayPanel(event);
        break;
      case "OtherAmountValue":
        this.overlayOtherAmountValueSearch.showOverlayPanel(event);
        break;
      case "userDefined1":
        this.overlayuserDefined1Search.showOverlayPanel(event);
        break;
      case "userDefined2":
        this.overlayuserDefined2Search.showOverlayPanel(event);
        break;
      case "userDefined3":
        this.overlayuserDefined3Search.showOverlayPanel(event);
        break;
      case "userDefined4":
        this.overlayuserDefined4Search.showOverlayPanel(event);
        break;
      case "userDefined5":
        this.overlayuserDefined5Search.showOverlayPanel(event);
        break;
      case "userDefined6":
        this.overlayuserDefined6Search.showOverlayPanel(event);
        break;
      case "userDefined7":
        this.overlayuserDefined7Search.showOverlayPanel(event);
        break;
      case "userDefined8":
        this.overlayuserDefined8Search.showOverlayPanel(event);
        break;
      case "userDefined9":
        this.overlayuserDefined9Search.showOverlayPanel(event);
        break;
      case "userDefined10":
        this.overlayuserDefined10Search.showOverlayPanel(event);
        break;
      case "userDefined11":
        this.overlayuserDefined11Search.showOverlayPanel(event);
        break;
      case "userDefined12":
        this.overlayuserDefined12Search.showOverlayPanel(event);
        break;
      case "userDefined13":
        this.overlayuserDefined13Search.showOverlayPanel(event);
        break;
      case "userDefined14":
        this.overlayuserDefined14Search.showOverlayPanel(event);
        break;
      case "userDefined15":
        this.overlayuserDefined15Search.showOverlayPanel(event);
        break;
      default:
    }
  }

  validateLookupField(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAME: string
  ) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;
    if (
      event.target.value == "" ||
      this.viewMode == true ||
      this.editMode == true
    )
      return;
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${
        LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ""
      }`,
    };
    this.commonService.toastInfoByMsgId("MSG81447");
    let API = "UspCommonInputFieldSearch/GetCommonInputFieldSearch";
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, param)
      .subscribe(
        (result) => {
          let data = this.commonService.arrayEmptyObjectToString(
            result.dynamicData[0]
          );
          if (data.length == 0) {
            this.commonService.toastErrorByMsgId("MSG1531");
            this.departmentMasterForm.controls[FORMNAME].setValue("");
            // this.renderer.selectRootElement(FORMNAME).focus();
            LOOKUPDATA.SEARCH_VALUE = "";
            this.openOverlay(FORMNAME, event);
            return;
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
        }
      );
    this.subscriptions.push(Sub);
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

                    this.departmentMasterForm.controls[formName].setValue(
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
      this.departmentMasterForm.controls[formName].setValue("");
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
      const control = this.departmentMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }

  convertToISO(time: string): string {
    // Ensure 'time' is a valid string and has the correct format
    if (typeof time !== "string" || !time.includes(":")) {
      console.error("Invalid time format:", time);
      return ""; // Or return a default ISO string or some safe fallback value
    }

    const currentDate = new Date();
    const [hours, minutes] = time.split(":"); // Now safe to split

    const newDate = new Date(currentDate.toISOString()); // Start with the current date
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(0); // Set seconds to 0
    newDate.setMilliseconds(0); // Set milliseconds to 0

    return newDate.toISOString(); // Converts to ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
  }

  setFormValues() {
    if (!this.content) return;

    let API =
      "PayDepartmentMaster/GetPayDepartmentMasterDetailWithCode/" +
      this.content.PDEPTMST_CODE;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        this.commonService.closeSnackBarMsg();
        console.log(result.response);

        const shift1FromTime = result.response.PDEPTMST_SHIFT1_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift2FromTime = result.response.PDEPTMST_SHIFT2_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift3FromTime = result.response.PDEPTMST_SHIFT3_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift1ToTime = result.response.PDEPTMST_SHIFT1_TO.split("T")[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift2ToTime = result.response.PDEPTMST_SHIFT2_TO.split("T")[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift3ToTime = result.response.PDEPTMST_SHIFT3_TO.split("T")[1]
          .split("Z")[0]
          .slice(0, 5);

        const shift1Break1FromTime = result.response.PDEPTMST_BREAK1_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift1Break1ToTime = result.response.PDEPTMST_BREAK1_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift1Break2FromTime = result.response.PDEPTMST_BREAK2_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift1Break2ToTime = result.response.PDEPTMST_BREAK2_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);

        const shift2Break1FromTime =
          result.response.PDEPTMST_S2BREAK1_FROM.split("T")[1]
            .split("Z")[0]
            .slice(0, 5);
        const shift2Break1ToTime = result.response.PDEPTMST_S2BREAK1_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift2Break2FromTime =
          result.response.PDEPTMST_S2BREAK2_FROM.split("T")[1]
            .split("Z")[0]
            .slice(0, 5);
        const shift2Break2oTime = result.response.PDEPTMST_S2BREAK2_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift3Break1FromTime =
          result.response.PDEPTMST_S3BREAK1_FROM.split("T")[1]
            .split("Z")[0]
            .slice(0, 5);
        const shift3Break1ToTime = result.response.PDEPTMST_S3BREAK1_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);

        const shift3Break2FromTime = result.response.PDEPTMST_BREAK3_FROM.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);
        const shift3Break2ToTime = result.response.PDEPTMST_BREAK3_TO.split(
          "T"
        )[1]
          .split("Z")[0]
          .slice(0, 5);

        this.departmentMasterForm.controls.Shift1From.setValue(shift1FromTime);
        this.departmentMasterForm.controls.Shift2From.setValue(shift2FromTime);
        this.departmentMasterForm.controls.Shift3From.setValue(shift3FromTime);
        this.departmentMasterForm.controls.Shift1To.setValue(shift1ToTime);
        this.departmentMasterForm.controls.Shift2To.setValue(shift2ToTime);
        this.departmentMasterForm.controls.Shift3To.setValue(shift3ToTime);
        this.departmentMasterForm.controls.Shift1Break1From.setValue(
          shift1Break1FromTime
        );
        this.departmentMasterForm.controls.Shift1Break1To.setValue(
          shift1Break1ToTime
        );
        this.departmentMasterForm.controls.Shift1Break2From.setValue(
          shift1Break2FromTime
        );
        this.departmentMasterForm.controls.Shift1Break2To.setValue(
          shift1Break2ToTime
        );
        this.departmentMasterForm.controls.Shift2Break1From.setValue(
          shift2Break1FromTime
        );
        this.departmentMasterForm.controls.Shift2Break1To.setValue(
          shift2Break1ToTime
        );
        this.departmentMasterForm.controls.Shift2Break2From.setValue(
          shift2Break2FromTime
        );
        this.departmentMasterForm.controls.Shift2Break2To.setValue(
          shift2Break2oTime
        );
        this.departmentMasterForm.controls.Shift3Break1From.setValue(
          shift3Break1FromTime
        );
        this.departmentMasterForm.controls.Shift3Break1To.setValue(
          shift3Break1ToTime
        );
        this.departmentMasterForm.controls.Shift3Break2From.setValue(
          shift3Break2FromTime
        );
        this.departmentMasterForm.controls.Shift3Break2To.setValue(
          shift3Break2ToTime
        );

        console.log(shift1FromTime);
      },
      (err) => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
    this.subscriptions.push(Sub);
    console.log(this.content);
    console.log("After conversion:", Number(this.content.PDEPTMST_SHIFT));
    const shiftValue = Number(this.content.PDEPTMST_SHIFT);
    console.log(shiftValue);

    this.departmentMasterForm.controls.code.setValue(
      this.content.PDEPTMST_CODE
    );
    this.departmentMasterForm.controls.Description.setValue(
      this.content.PDEPTMST_DESC
    );
    this.departmentMasterForm.controls.oneTimeCode.setValue(
      this.content.PDEPTMST_ACCODE
    );
    this.departmentMasterForm.controls.GratuityCode.setValue(
      this.content.PDEPTMST_GRATUITY_ACCODE
    );
    this.departmentMasterForm.controls.airTicketCode.setValue(
      this.content.PDEPTMST_AIRTICKET_ACCODE
    );
    this.departmentMasterForm.controls.leaveSalaryCode.setValue(
      this.content.PDEPTMST_LEAVESALARY_ACCODE
    );
    this.departmentMasterForm.controls.PDEPTMST_WEEKOFF1.setValue(
      this.content.PDEPTMST_WEEKOFF1.toString()
    );
    this.departmentMasterForm.controls.PDEPTMST_HALFDAY1.setValue(
      this.content.PDEPTMST_HALFDAY1.toString()
    );
    this.departmentMasterForm.controls.PDEPTMST_WEEKOFF2.setValue(
      this.content.PDEPTMST_WEEKOFF2.toString()
    );
    this.departmentMasterForm.controls.PDEPTMST_HALFDAY2.setValue(
      this.content.PDEPTMST_HALFDAY2.toString()
    );
    this.departmentMasterForm.controls.Shift2.setValue(
      this.content.PDEPTMST_SHIFT2
    );
    this.departmentMasterForm.controls.Shift3.setValue(
      this.content.PDEPTMST_SHIFT3
    );
    this.departmentMasterForm.controls.shift.setValue(
      this.content.PDEPTMST_SHIFT.toString()
    );
    this.departmentMasterForm.controls.shift.markAsPristine();
    this.departmentMasterForm.controls.shift.markAsTouched();
    this.departmentMasterForm.controls.CountryCode.setValue(
      this.content.PDEPTMST_COUNTRYCODE
    );
    this.departmentMasterForm.controls.userDefined1.setValue(this.content.UDF1);
    this.departmentMasterForm.controls.UserDefined2.setValue(this.content.UDF2);
    this.departmentMasterForm.controls.UserDefined3.setValue(this.content.UDF3);
    this.departmentMasterForm.controls.UserDefined4.setValue(this.content.UDF4);
    this.departmentMasterForm.controls.UserDefined5.setValue(this.content.UDF5);
    this.departmentMasterForm.controls.UserDefined6.setValue(this.content.UDF6);
    this.departmentMasterForm.controls.UserDefined7.setValue(this.content.UDF7);
    this.departmentMasterForm.controls.UserDefined8.setValue(this.content.UDF8);
    this.departmentMasterForm.controls.UserDefined9.setValue(this.content.UDF9);
    this.departmentMasterForm.controls.UserDefined10.setValue(
      this.content.UDF10
    );
    this.departmentMasterForm.controls.UserDefined11.setValue(
      this.content.UDF11
    );
    this.departmentMasterForm.controls.UserDefined12.setValue(
      this.content.UDF12
    );
    this.departmentMasterForm.controls.UserDefined13.setValue(
      this.content.UDF13
    );
    this.departmentMasterForm.controls.UserDefined14.setValue(
      this.content.UDF14
    );
    this.departmentMasterForm.controls.UserDefined15.setValue(
      this.content.UDF15
    );
    this.departmentMasterForm.controls.TYPEWEEKOFF1.setValue(
      this.content.PDEPTMST_TYPEWEEKOFF1
    );
    this.departmentMasterForm.controls.TYPEWEEKOFF2.setValue(
      this.content.PDEPTMST_TYPEWEEKOFF2
    );
    this.departmentMasterForm.controls.Shift1Break1.setValue(
      this.content.PDEPTMST_SHIFT1
    );
    this.departmentMasterForm.controls.DebitExpensesLeaveSal.setValue(
      this.content.PDEPTMST_LEAVESALARY_PROVISION_ACCODE
    );
    this.departmentMasterForm.controls.DebitExpensesGratuity.setValue(
      this.content.PDEPTMST_GRATUITY_PROVISION_ACCODE
    );
    this.departmentMasterForm.controls.DebitExpensesAirTicket.setValue(
      this.content.PDEPTMST_AIRTICKET_PROVISION_ACCODE
    );
    this.departmentMasterForm.controls.CreditExpensesLeaveSal.setValue(
      this.content.LV_SCHEME
    );
    this.departmentMasterForm.controls.CreditExpensesAirTicket.setValue(
      this.content.GR_SCHEME
    );
    this.departmentMasterForm.controls.CreditExpensesGratuity.setValue(
      this.content.TK_SCHEME
    );
    this.departmentMasterForm.controls.AIDebitExpCode.setValue(
      this.content.COMP_LB_CODE
    );
    this.departmentMasterForm.controls.AICreditCode.setValue(
      this.content.OT_CODE
    );
    this.departmentMasterForm.controls.OtherAmountValue.setValue(
      this.content.PDEPTMST_OTHER_ACCODE
    );
    this.departmentMasterForm.controls.OtherAmount.setValue(
      this.content.PDEPTMST_OTHERAC
    );
    this.departmentMasterForm.controls.Shift2Break1.setValue(
      this.content.PDEPTMST_SHIFT2BREAK1
    );
    this.departmentMasterForm.controls.Shift3Break1.setValue(
      this.content.PDEPTMST_SHIFT3BREAK1
    );
    this.departmentMasterForm.controls.Shift1Break2.setValue(
      this.content.PDEPTMST_SHIFT1BREAK2
    );
    this.departmentMasterForm.controls.Shift2Break2.setValue(
      this.content.PDEPTMST_SHIFT2BREAK2
    );
    this.departmentMasterForm.controls.Shift3Break2.setValue(
      this.content.PDEPTMST_SHIFT3BREAK2
    );
  }

  setPostData() {
    let form = this.departmentMasterForm.value;
    let postData = {
      MID: this.commonService.emptyToZero(this.content?.MID),
      PDEPTMST_CODE: this.commonService.nullToString(form.code.toUpperCase()),
      PDEPTMST_DESC: this.commonService.nullToString(
        form.Description.toUpperCase()
      ),
      PDEPTMST_ACCODE: this.commonService.nullToString(
        form.oneTimeCode.toUpperCase()
      ),
      PDEPTMST_GRATUITY_ACCODE: this.commonService.nullToString(
        form.GratuityCode.toUpperCase()
      ),
      PDEPTMST_AIRTICKET_ACCODE: this.commonService.nullToString(
        form.airTicketCode.toUpperCase()
      ),
      PDEPTMST_LEAVESALARY_ACCODE: this.commonService.nullToString(
        form.leaveSalaryCode.toUpperCase()
      ),
      PDEPTMST_WEEKOFF1: this.commonService.emptyToZero(form.PDEPTMST_WEEKOFF1),
      PDEPTMST_HALFDAY1: this.commonService.emptyToZero(form.PDEPTMST_HALFDAY1),
      PDEPTMST_WEEKOFF2: this.commonService.emptyToZero(form.PDEPTMST_WEEKOFF2),
      PDEPTMST_HALFDAY2: this.commonService.emptyToZero(form.PDEPTMST_HALFDAY2),
      PDEPTMST_SHIFT1: this.onchangeCheckBoxNum(form.Shift1Break1),
      PDEPTMST_SHIFT1_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift1From)
      ),
      PDEPTMST_SHIFT1_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift1To)
      ),
      PDEPTMST_SHIFT2: this.onchangeCheckBoxNum(form.Shift2),
      PDEPTMST_SHIFT2_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift2From)
      ),
      PDEPTMST_SHIFT2_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift2To)
      ),
      PDEPTMST_SHIFT3: this.onchangeCheckBoxNum(form.Shift3),
      PDEPTMST_SHIFT3_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift3From)
      ),
      PDEPTMST_SHIFT3_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift3To)
      ),
      PDEPTMST_BREAK1_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift1Break1From)
      ),
      PDEPTMST_BREAK1_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift1Break1To)
      ),
      PDEPTMST_BREAK2_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift1Break2From)
      ),
      PDEPTMST_BREAK2_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift1Break2To)
      ),
      PDEPTMST_BREAK3_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift3Break2From)
      ),
      PDEPTMST_BREAK3_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift3Break2To)
      ),
      PDEPTMST_SHIFT: this.commonService.emptyToZero(form.shift),
      PDEPTMST_WKGHRS_STATUS: 0,
      PDEPTMST_LEAVESALARY_PROVISION_ACCODE: this.commonService.nullToString(
        form.DebitExpensesLeaveSal
      ),
      PDEPTMST_SALARY_PAYABLE_ACCODE: "",
      PDEPTMST_GRATUITY_PROVISION_ACCODE: this.commonService.nullToString(
        form.DebitExpensesGratuity
      ),
      PDEPTMST_AIRTICKET_PROVISION_ACCODE: this.commonService.nullToString(
        form.DebitExpensesAirTicket
      ),
      OT_BASE: 0,
      OT_NOM: 0,
      OT_HOL: 0,
      LV_SCHEME: this.commonService.nullToString(form.CreditExpensesLeaveSal),
      GR_SCHEME: this.commonService.nullToString(form.CreditExpensesAirTicket),
      TK_SCHEME: this.commonService.nullToString(form.CreditExpensesGratuity),
      COMP_LB_CODE: this.commonService.nullToString(form.AIDebitExpCode),
      OT_CODE: this.commonService.nullToString(form.AICreditCode),
      PDEPTMST_OTHER_ACCODE: this.commonService.nullToString(
        form.OtherAmountValue
      ),
      PDEPTMST_OTHERAC: this.onchangeCheckBoxNum(form.OtherAmount),
      OT_HOURS: 0,
      BASIC_ALLW: "",
      PDEPTMST_COUNTRYCODE: this.commonService.nullToString(
        form.CountryCode.toUpperCase()
      ),
      UDF1: this.commonService.nullToString(form.userDefined1),
      UDF2: this.commonService.nullToString(form.UserDefined2),
      UDF3: this.commonService.nullToString(form.UserDefined3),
      UDF4: this.commonService.nullToString(form.UserDefined4),
      UDF5: this.commonService.nullToString(form.UserDefined5),
      UDF6: this.commonService.nullToString(form.UserDefined6),
      UDF7: this.commonService.nullToString(form.UserDefined7),
      UDF8: this.commonService.nullToString(form.UserDefined8),
      UDF9: this.commonService.nullToString(form.UserDefined9),
      UDF10: this.commonService.nullToString(form.UserDefined10),
      UDF11: this.commonService.nullToString(form.UserDefined11),
      UDF12: this.commonService.nullToString(form.UserDefined12),
      UDF13: this.commonService.nullToString(form.UserDefined13),
      UDF14: this.commonService.nullToString(form.UserDefined14),
      UDF15: this.commonService.nullToString(form.UserDefined15),
      PDEPTMST_TYPEWEEKOFF1: this.onchangeCheckBoxNum(form.TYPEWEEKOFF1),
      PDEPTMST_TYPEWEEKOFF2: this.onchangeCheckBoxNum(form.TYPEWEEKOFF2),
      PDEPTMST_SHIFT2BREAK1: this.onchangeCheckBoxNum(form.Shift2Break1),
      PDEPTMST_SHIFT3BREAK1: this.onchangeCheckBoxNum(form.Shift3Break1),
      PDEPTMST_SHIFT1BREAK2: this.onchangeCheckBoxNum(form.Shift1Break2),
      PDEPTMST_SHIFT2BREAK2: this.onchangeCheckBoxNum(form.Shift2Break2),
      PDEPTMST_SHIFT3BREAK2: this.onchangeCheckBoxNum(form.Shift3Break2),
      PDEPTMST_S2BREAK1_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift2Break1From)
      ),
      PDEPTMST_S2BREAK1_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift2Break1To)
      ),
      PDEPTMST_S3BREAK1_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift3Break1From)
      ),
      PDEPTMST_S3BREAK1_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift3Break1To)
      ),
      PDEPTMST_S2BREAK2_FROM: this.commonService.nullToString(
        this.convertToISO(form.Shift2Break2From)
      ),
      PDEPTMST_S2BREAK2_TO: this.commonService.nullToString(
        this.convertToISO(form.Shift2Break2To)
      ),
    };
    return postData;
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  formSubmit() {
    if (this.content?.FLAG == "VIEW") return;
    if (this.content?.FLAG == "EDIT") {
      this.updateDepartmentMaster();
      return;
    }

    if (this.departmentMasterForm.controls["code"].value == "") {
      let message = `Code is mandatory ! `;
      return this.openDialog("Warning", message, true);
    } else {
      let API = "PayDepartmentMaster/InsertPayDepartmentMaster";
      let postData = this.setPostData();

      this.commonService.showSnackBarMsg("MSG81447");
      let Sub: Subscription = this.dataService
        .postDynamicAPI(API, postData)
        .subscribe(
          (result) => {
            console.log("result", result);
            if (result.response) {
              if (result.status == "Success") {
                Swal.fire({
                  title: "Saved Successfully",
                  text: "",
                  icon: "success",
                  confirmButtonColor: "#336699",
                  confirmButtonText: "Ok",
                }).then((result: any) => {
                  if (result.value) {
                    this.departmentMasterForm.reset();
                    this.tableData = [];
                    this.close("reloadMainGrid");
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId("MSG3577");
            }
          },
          (err) => {
            this.commonService.toastErrorByMsgId("MSG3577");
          }
        );
      this.subscriptions.push(Sub);
    }
  }

  updateDepartmentMaster() {
    let API =
      "PayDepartmentMaster/UpdatePayDepartmentMaster/" +
      this.departmentMasterForm.value.code;
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
                  this.departmentMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG3577");
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG3577");
        }
      );
    this.subscriptions.push(Sub);
  }

  /**USE: delete Melting Type From Row */
  deleteDepartmentMaster() {
    // if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.PDEPTMST_CODE) {
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
          "PayDepartmentMaster/DeletePayDepartmentMaster/" +
          this.content?.PDEPTMST_CODE;
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
                      this.departmentMasterForm.reset();
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
                      this.departmentMasterForm.reset();
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
      else {
        this.close("reloadMainGrid");
      }
    });
  }
}
