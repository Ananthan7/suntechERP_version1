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
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "where TYPES ='country MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  DepartmentData: MasterSearchModel = {}
  oneTimeCodeData: MasterSearchModel = {}
  leaveSalaryCodeData: MasterSearchModel = {}
  airTicketCodeData: MasterSearchModel = {}
  GratuityCodeData: MasterSearchModel = {}
  AIDebitExpCodeData: MasterSearchModel = {}
  AICreditCodeData: MasterSearchModel = {}
  DebitExpensesLeaveSalData: MasterSearchModel = {}
  DebitExpensesAirTicketData: MasterSearchModel = {}
  DebitExpensesGratuityData: MasterSearchModel = {}
  CreditExpensesLeaveSalData: MasterSearchModel = {}
  CreditExpensesAirTicketData: MasterSearchModel = {}
  CreditExpensesGratuityData: MasterSearchModel = {}
  OtherAmountValueData: MasterSearchModel = {}
  UserDefinedData: MasterSearchModel = {}

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

  }

  oneTimeCodeDataSelected(e: any) {

  }

  leaveSalaryCodeDataSelected(e: any) {

  }

  airTicketCodeDataSelected(e: any) { }

  GratuityCodeSelected(e: any) { }

  AIDebitExpCodeSelected(e: any) { }

  AICreditCodeSelected(e: any) { }

  DebitExpensesLeaveSalDataSelected(e: any) { }

  DebitExpensesAirTicketSelected(e: any) { }

  DebitExpensesGratuityDataSelected(e: any) { }

  CreditExpensesLeaveSalDataSelected(e: any) { }

  CreditExpensesAirTicketSelected(e: any) { }

  CreditExpensesGratuityDataSelected(e: any) { }

  OtherAmountValueSelected(e: any) { }

  UserDefined1DataSelected(e: any) { }
  UserDefined2DataSelected(e: any) { }
  UserDefined3DataSelected(e: any) { }
  UserDefined4DataSelected(e: any) { }
  UserDefined5DataSelected(e: any) { }
  UserDefined6DataSelected(e: any) { }
  UserDefined7DataSelected(e: any) { }
  UserDefined8DataSelected(e: any) { }
  UserDefined9DataSelected(e: any) { }
  UserDefined10DataSelected(e: any) { }
  UserDefined11DataSelected(e: any) { }
  UserDefined12DataSelected(e: any) { }
  UserDefined13DataSelected(e: any) { }
  UserDefined14DataSelected(e: any) { }
  UserDefined15DataSelected(e: any) { }

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
      "PDEPTMST_LEAVESALARY_PROVISION_ACCODE": "string",
      "PDEPTMST_SALARY_PAYABLE_ACCODE": "string",
      "PDEPTMST_GRATUITY_PROVISION_ACCODE": "string",
      "PDEPTMST_AIRTICKET_PROVISION_ACCODE": "string",
      "OT_BASE": 0,
      "OT_NOM": 0,
      "OT_HOL": 0,
      "LV_SCHEME": "string",
      "GR_SCHEME": "string",
      "TK_SCHEME": "string",
      "COMP_LB_CODE": "string",
      "OT_CODE": "string",
      "PDEPTMST_OTHER_ACCODE": "string",
      "PDEPTMST_OTHERAC": 0,
      "OT_HOURS": 0,
      "BASIC_ALLW": "string",
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

  updateMeltingType() {
    
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
