import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.scss']
})
export class DepartmentMasterComponent implements OnInit {

  @Input() content!: any;

  selectedTabIndex = 0;
  tableData: any = [];
  private subscriptions: Subscription[] = [];
  isloading: boolean = false;
  CountryCodeData: MasterSearchModel = {
      PAGENO: 1,
      RECORDS: 10,
      LOOKUPID: 3,
      SEARCH_FIELD: 'CODE',
      SEARCH_HEADING: 'Country Code',
      SEARCH_VALUE: '',
      WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
      VIEW_INPUT: true,
      VIEW_TABLE: true,
  }
  DepartmentData: MasterSearchModel = {}
  oneTimeCodeData: MasterSearchModel = {}
  leaveSalaryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Leave Salary Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  airTicketCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Air Ticket Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  GratuityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Gratuity Code Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  AIDebitExpCodeData: MasterSearchModel = {}
  AICreditCodeData: MasterSearchModel = {}
  DebitExpensesLeaveSalData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: ' Leave Salary Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  DebitExpensesAirTicketData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Air Ticket',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  DebitExpensesGratuityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Gratuity Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  CreditExpensesLeaveSalData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: ' Leave Salary Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  CreditExpensesAirTicketData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Air Ticket',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  CreditExpensesGratuityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Gratuity Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  OtherAmountValueData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: ' Other Amount Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
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
  }

  UserDefined2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  departmentMasterForm: FormGroup = this.formBuilder.group({
    code: [''],
    Description: [''],
    CountryCode: [''],
    CountryCodeDes: [''],
    shift: [''],
    PDEPTMST_WEEKOFF1: [''],
    PDEPTMST_HALFDAY1: [''],
    PDEPTMST_WEEKOFF2: [''],
    PDEPTMST_HALFDAY2: [''],
    TYPEWEEKOFF1: [false],
    TYPEWEEKOFF2: [false],
    oneTimeCode: [''],
    leaveSalaryCode: [''],
    airTicketCode: [''],
    GratuityCode: [''],

    AIDebitExpCode: [''],
    AICreditCode: [''],
    DebitExpensesLeaveSal: [''],
    DebitExpensesAirTicket: [''],
    DebitExpensesGratuity: [''],
    CreditExpensesLeaveSal: [''],
    CreditExpensesAirTicket: [''],
    CreditExpensesGratuity: [''],
    OtherAmount: [''],
    OtherAmountValue: [''],

    Shift1From: [''],
    Shift1To: [''],
    Shift1Break1: [''],
    Shift1Break1From: [''],
    Shift1Break1To: [''],
    Shift1Break2: [''],
    Shift1Break2From: [''],
    Shift1Break2To: [''],
    Shift2: [''],
    Shift2From: [''],
    Shift2To: [''],
    Shift2Break1: [''],
    Shift2Break1From: [''],
    Shift2Break1To: [''],
    Shift2Break2: [''],
    Shift2Break2From: [''],
    Shift2Break2To: [''],
    Shift3: [''],
    Shift3From: [''],
    Shift3To: [''],
    Shift3Break1: [''],
    Shift3Break1From: [''],
    Shift3Break1To: [''],
    Shift3Break2: [''],
    Shift3Break2From: [''],
    Shift3Break2To: [''],
    userDefined1: [''],
    UserDefined2: [''],
    UserDefined3: [''],
    UserDefined4: [''],
    UserDefined5: [''],
    UserDefined6: [''],
    UserDefined7: [''],
    UserDefined8: [''],
    UserDefined9: [''],
    UserDefined10: [''],
    UserDefined11: [''],
    UserDefined12: [''],
    UserDefined13: [''],
    UserDefined14: [''],
    UserDefined15: [''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  CountryCodeDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.CountryCode.setValue(e.CODE);
    this.departmentMasterForm.controls.CountryCodeDes.setValue(e.DESCRIPTION);

    
  }

  oneTimeCodeDataSelected(e: any) {
    console.log(e);

  }

  leaveSalaryCodeDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.leaveSalaryCode.setValue(e.ACCODE);
  }

  airTicketCodeDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.airTicketCode.setValue(e.ACCODE);
  }

  GratuityCodeSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.GratuityCode.setValue(e.ACCODE);
  }

  AIDebitExpCodeSelected(e: any) {
    console.log(e);

  }

  AICreditCodeSelected(e: any) {
    console.log(e);

  }

  DebitExpensesLeaveSalDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesLeaveSal.setValue(e.ACCODE);
  }

  DebitExpensesAirTicketSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesAirTicket.setValue(e.ACCODE);
  }

  DebitExpensesGratuityDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.DebitExpensesGratuity.setValue(e.ACCODE);
  }

  CreditExpensesLeaveSalDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.CreditExpensesLeaveSal.setValue(e.ACCODE);
  }

  CreditExpensesAirTicketSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.CreditExpensesAirTicket.setValue(e.ACCODE);
  }

  CreditExpensesGratuityDataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.CreditExpensesGratuity.setValue(e.ACCODE);
  }

  OtherAmountValueSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.OtherAmountValue.setValue(e.ACCODE);

  }

  UserDefined1DataSelected(e: any) { 
    console.log(e); 
    this.departmentMasterForm.controls.UserDefined1.setValue(e.CODE);
  }
  UserDefined2DataSelected(e: any) {
    console.log(e);
    this.departmentMasterForm.controls.UserDefined2.setValue(e.CODE);
  }
  UserDefined3DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined3.setValue(e.CODE);
   }
  UserDefined4DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined4.setValue(e.CODE);
   }
  UserDefined5DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined5.setValue(e.CODE);
   }
  UserDefined6DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined6.setValue(e.CODE);
   }
  UserDefined7DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined7.setValue(e.CODE);
   }
  UserDefined8DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined8.setValue(e.CODE);
   }
  UserDefined9DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined9.setValue(e.CODE);
   }
  UserDefined10DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined10.setValue(e.CODE);
   }
  UserDefined11DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined11.setValue(e.CODE);
   }
  UserDefined12DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined12.setValue(e.CODE);
   }
  UserDefined13DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined13.setValue(e.CODE);
   }
  UserDefined14DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined14.setValue(e.CODE);
   }
  UserDefined15DataSelected(e: any) { 
    console.log(e);
    this.departmentMasterForm.controls.UserDefined15.setValue(e.CODE);
   }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  setPostData() {
    let form = this.departmentMasterForm.value
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "PDEPTMST_CODE": this.commonService.nullToString(form.code),
      "PDEPTMST_DESC": this.commonService.nullToString(form.Description),
      "PDEPTMST_ACCODE": form.oneTimeCode,
      "PDEPTMST_GRATUITY_ACCODE": form.GratuityCode,
      "PDEPTMST_AIRTICKET_ACCODE": form.airTicketCode,
      "PDEPTMST_LEAVESALARY_ACCODE": form.leaveSalaryCode,
      "PDEPTMST_WEEKOFF1": form.PDEPTMST_WEEKOFF1,
      "PDEPTMST_HALFDAY1": form.PDEPTMST_HALFDAY1,
      "PDEPTMST_WEEKOFF2": form.PDEPTMST_WEEKOFF2,
      "PDEPTMST_HALFDAY2": form.PDEPTMST_HALFDAY2,
      "PDEPTMST_SHIFT1": 0,
      "PDEPTMST_SHIFT1_FROM": form.Shift1From,
      "PDEPTMST_SHIFT1_TO": form.Shift1To,
      "PDEPTMST_SHIFT2": this.onchangeCheckBoxNum(form.Shift2),
      "PDEPTMST_SHIFT2_FROM": form.Shift2From,
      "PDEPTMST_SHIFT2_TO": form.Shift2To,
      "PDEPTMST_SHIFT3": this.onchangeCheckBoxNum(form.Shift3),
      "PDEPTMST_SHIFT3_FROM": form.Shift3From,
      "PDEPTMST_SHIFT3_TO": form.Shift3To,
      "PDEPTMST_BREAK1_FROM": form.Shift1Break1From,
      "PDEPTMST_BREAK1_TO": form.Shift1Break1To,
      "PDEPTMST_BREAK2_FROM": form.Shift1Break2From,
      "PDEPTMST_BREAK2_TO": form.Shift1Break2To,
      "PDEPTMST_BREAK3_FROM": form.Shift3Break1From,
      "PDEPTMST_BREAK3_TO": form.Shift3Break1To,
      "PDEPTMST_SHIFT": this.onchangeCheckBoxNum(form.shift),
      "PDEPTMST_WKGHRS_STATUS": 0,
      "PDEPTMST_LEAVESALARY_PROVISION_ACCODE": "",
      "PDEPTMST_SALARY_PAYABLE_ACCODE": "",
      "PDEPTMST_GRATUITY_PROVISION_ACCODE": "",
      "PDEPTMST_AIRTICKET_PROVISION_ACCODE": "",
      "OT_BASE": 0,
      "OT_NOM": 0,
      "OT_HOL": 0,
      "LV_SCHEME": "",
      "GR_SCHEME": "",
      "TK_SCHEME": "",
      "COMP_LB_CODE": "",
      "OT_CODE": "",
      "PDEPTMST_OTHER_ACCODE": "",
      "PDEPTMST_OTHERAC": 0,
      "OT_HOURS": 0,
      "BASIC_ALLW": "",
      "PDEPTMST_COUNTRYCODE": form.CountryCode,
      "UDF1": form.userDefined1,
      "UDF2": form.UserDefined2,
      "UDF3": form.UserDefined3,
      "UDF4": form.UserDefined4,
      "UDF5": form.UserDefined5,
      "UDF6": form.UserDefined6,
      "UDF7": form.UserDefined7,
      "UDF8": form.UserDefined8,
      "UDF9": form.UserDefined9,
      "UDF10": form.UserDefined10,
      "UDF11": form.UserDefined11,
      "UDF12": form.UserDefined12,
      "UDF13": form.UserDefined13,
      "UDF14": form.UserDefined14,
      "UDF15": form.UserDefined15,
      "PDEPTMST_TYPEWEEKOFF1": this.onchangeCheckBoxNum(form.TYPEWEEKOFF1),
      "PDEPTMST_TYPEWEEKOFF2": this.onchangeCheckBoxNum(form.TYPEWEEKOFF2),
      "PDEPTMST_SHIFT2BREAK1": 0,
      "PDEPTMST_SHIFT3BREAK1": 0,
      "PDEPTMST_SHIFT1BREAK2": 0,
      "PDEPTMST_SHIFT2BREAK2": 0,
      "PDEPTMST_SHIFT3BREAK2": 0,
      "PDEPTMST_S2BREAK1_FROM": "",
      "PDEPTMST_S2BREAK1_TO": "",
      "PDEPTMST_S3BREAK1_FROM": "",
      "PDEPTMST_S3BREAK1_TO": "",
      "PDEPTMST_S2BREAK2_FROM": "",
      "PDEPTMST_S2BREAK2_TO": ""
    }
  }

  formSubmit() {
    let API = 'PayDepartmentMaster/InsertPayDepartmentMaster';
    let postData = this.setPostData();

    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
        if (result.response) {
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.departmentMasterForm.reset();
                this.tableData = [];
                this.close('reloadMainGrid');
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);

  }

  updateEmployeeMaster() {

    let API = 'PayDepartmentMaster/UpdatePayDepartmentMaster' + this.departmentMasterForm.value.code;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.departmentMasterForm.reset();
                this.tableData = [];
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteDepartmentMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.PDEPTMST_CODE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'MeltingType/DeleteMeltingType/' + this.content?.PDEPTMST_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.departmentMasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.departmentMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
