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
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {
  selectedTabIndex = 0;
  @Input() content!: any;
  tableData: any = [];
  private subscriptions: Subscription[] = [];
  currentDate = new Date();



  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}
  DesignationData: MasterSearchModel = {}
  GradeData: MasterSearchModel = {}
  DOBData: MasterSearchModel = {}
  NationalityData: MasterSearchModel = {}
  ReligionData: MasterSearchModel = {}
  CountryCodeData: MasterSearchModel = {}
  StateCodeData: MasterSearchModel = {}
  CityCodeData: MasterSearchModel = {}
  PRCountryCodeData: MasterSearchModel ={}
  PRStateCodeData: MasterSearchModel ={}
  PRCityCodeData: MasterSearchModel ={}

  employeeMasterForm: FormGroup = this.formBuilder.group({
    code: [''],
    name: [''],
    otherLanguage: [''],
    Branch: [''],
    BranchDes: [''],
    DepartmentDes: [''], // No
    Department: [''],
    Designation: [''],
    DesignationDes: [''],// No
    GroupCode: [''],
    Grade: [''],
    GradeDes: [''], // No
    DOJ: [''],
    DOB: [''],
    BloodGroup: [''], 
    Nationality: [''], 
    Religion:[''],
    FatherName: [''],
    Gender: [''], 
    MaritialStatus: [''], 
    HomeHouseName: [''],
    HomeAddress: [''],
    Country: [''],
    State: [''],
    City: [''],
    LandLineNum: [''],
    MoblieCode: [''],
    MoblieNum: [''],
    email: [''],
    PRhouseName: [''],
    PRAddress: [''],
    PRCountry: [''],
    PRState: [''],
    PRCity: [''],
    PRLand: [''],
    PRMoblieCode: [''],
    PRMoblieNo: [''],
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

  closed(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW') {
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  BranchDataSelected(data: any) {

  }

  DepartmentSelected(data: any) {

  }

  DesignationSelected(e: any) {

  }

  GradeSelected(e: any) {

  }

  DOBSelected(e: any) {

  }

  NationalitySelected(e: any) {

  }

  ReligionSelected(e: any) { }

  CountryCodeSelected(e: any) { }

  StateCodeSelected(e: any) { }

  CityCodeSelected(e: any) { }

  PRCountryCodeSelected(e: any) { }

  PRStateCodeSelected(e: any) { }

  PRCityCodeSelected(e: any) { }

  addTableData() { }

  deleteTableData() { }

  setPostData() {//this.commonService.nullToString()
    let form = this.employeeMasterForm.value
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "EMPMST_CODE": this.commonService.nullToString(form.code),
      "EMPMST_NAME": this.commonService.nullToString(form.name),
      "EMPMST_OTHERNAME": this.commonService.nullToString(form.otherLanguage),
      "EMPMST_BRANCH_CODE": this.commonService.nullToString(form.Branch),
      "EMPMST_VISABRANCH_CODE": this.commonService.nullToString(form.BranchDes),
      "EMPMST_DEPT_CODE": this.commonService.nullToString(form.Department),
      "EMPMST_DESG_CODE": this.commonService.nullToString(form.Designation),
      "EMPMST_DEDACCCODE": this.commonService.nullToString(form.GroupCode),
      "EMPMST_EMPSUBLEDGERAC": "",
      "EMPMST_PICPATH": "",
      "EMPMST_SIGNPATH": "",
      "EMPMST_GRADE_CODE": this.commonService.nullToString(form.Grade),
      "EMPMST_REPORTTO_CODE1": "",
      "EMPMST_REPORTTO_CODE2": "",
      "EMPMST_VISA_DESG_CODE": "",
      "EMPMST_CATEGORY_CODE": "",
      "EMPMST_TYPE_CODE": "",
      "EMPMST_CAMP_CODE": "",
      "EMPMST_LOCATION_CODE": "",
      "EMPMST_NATIONALITY_CODE": this.commonService.nullToString(form.Nationality),
      "EMPMST_RELIGION_CODE": this.commonService.nullToString(form.Religion),
      "EMPMST_CONTRACT_CODE": "",
      "EMPMST_DOB": this.commonService.nullToString(form.DOB),
      "EMPMST_BLOOD_GROUP": this.commonService.emptyToZero(form.BloodGroup),
      "EMPMST_FATHER_NAME": this.commonService.nullToString(form.FatherName),
      "EMPMST_MOTHER_TONGUE": "",
      "EMPMST_GENDER": this.commonService.emptyToZero(form.Gender),
      "EMPMST_MARITAL_STATUS": this.commonService.emptyToZero(form.MaritialStatus),
      "EMPMST_PROBATION_CONFIRMED": 0,
      "EMPMST_PROBATION_PERIOD": "",
      "EMPMST_PROBATION_STARTDATE": "",
      "EMPMST_JOIN_DATE": this.commonService.nullToString(form.DOJ),
      "EMPMST_CONFIRM_DATE": "",
      "EMPMST_LEAVING_STATUS": true,
      "EMPMST_LEAVE_DATE": "",
      "EMPMST_REASON_CODE": "",
      "EMPMST_LAST_ANUAL_LV_TAKEN": "",
      "EMPMST_LAST_REJOIN_ON": "",
      "EMPMST_TRAINING_MONTHS": 0,
      "EMPMST_NOTICE_PERIOD": 0,
      "EMPMST_LAST_PRPDATE": "",
      "EMPMST_LAST_OVTDATE": "",
      "EMPMST_LEAVESPERYEAR": 0,
      "EMPMST_PENDINGPERYEAR": 0,
      "EMPMST_LEAVESPERMONTH": 0,
      "EMPMST_SALARY_PERIOD": 0,
      "EMPMST_SALARY_METHOD": 0,
      "EMPMST_STOP_SALARY": true,
      "EMPMST_TIME_ATTREQU": true,
      "EMPMST_WITHOVT": true,
      "EMPMST_CURRENCY": "",
      "EMPMST_SALARY_ACCODE": "",
      "EMPMST_SALARY_SUBLEDGERAC": "",
      "EMPMST_JOBCOSTRATE": 0,
      "EMPMST_BASIC_SALARY": 0,
      "EMPMST_GROSS_ALLOWANCE": 0,
      "EMPMST_GROSS_DEDUCTION": 0,
      "EMPMST_GROSS_SALARY": 0,
      "EMPMST_TOTAL_CONTRACT_SALARY": 0,
      "EMPMST_COMPANY_BANK_CODE": "",
      "EMPMST_BANK_CODE": "",
      "EMPMST_BANK_ACCOUNT_NO": "",
      "EMPMST_AGENT_CODE": "",
      "EMPMST_WPS_TYPE": "",
      "EMPMST_NORMALOT_CODE": "",
      "EMPMST_HOLIDAYOT_CODE": "",
      "EMPMST_ELIGIBLE_LEAVE_SALARY": true,
      "EMPMST_ELIGIBLE_AIRTICKET": true,
      "EMPMST_ELIGIBLE_GRATUITY": true,
      "EMPMST_LEAVESALARY_STARTDATE": "",
      "EMPMST_AIRTKT_STARTDATE": "",
      "EMPMST_GRATUITY_STARTDATE": "",
      "EMPMST_LSALARY_CODE": "",
      "EMPMST_AIRTIKT_CODE": "",
      "EMPMST_GRTUITY_CODE": "",
      "EMPMST_LAST_LEVSAL_DATE": "",
      "EMPMST_LAST_AIRTKT_DATE": "",
      "EMPMST_HOUSENAME_HM": this.commonService.nullToString(form.HomeHouseName),
      "EMPMST_ADDRESS_HM": this.commonService.nullToString(form.HomeAddress),
      "EMPMST_COUNTRYCODE_HM": this.commonService.nullToString(form.Country),
      "EMPMST_STATECODE_HM": this.commonService.nullToString(form.State),
      "EMPMST_TOWNCODE_HM": this.commonService.nullToString(form.City),
      "EMPMST_MOBILE_HM1": this.commonService.nullToString(form.MoblieCode),
      "EMPMST_MOBILE_HM2": this.commonService.nullToString(form.MoblieNum),
      "EMPMST_TEL_LAND_HM": this.commonService.nullToString(form.LandLineNum),
      "EMPMST_EMAIL": this.commonService.nullToString(form.email),
      "EMPMST_HOUSENAME_PR": this.commonService.nullToString(form.PRhouseName),
      "EMPMST_ADDRESS_PR": this.commonService.nullToString(form.PRAddress),
      "EMPMST_COUNTRYCODE_PR": this.commonService.nullToString(form.PRCountry),
      "EMPMST_STATECODE_PR": this.commonService.nullToString(form.PRState),
      "EMPMST_TOWNCODE_PR": this.commonService.nullToString(form.PRCity),
      "EMPMST_MOBILE_PR1": this.commonService.nullToString(form.PRMoblieCode),
      "EMPMST_MOBILE_PR2": this.commonService.nullToString(form.PRMoblieNo),
      "EMPMST_TEL_LAND_PR": this.commonService.nullToString(form.PRLand),
      "EMPMST_EMERGENCYCONTACTPERSON": "",
      "EMPMST_RELATIONCODE": "",
      "EMPMST_EMERGENCYMOBILE1": "",
      "EMPMST_EMERGENCYMOBILE2": "",
      "EMPMST_EMERGENCYLANDPHONE": "",
      "EMPMST_UD_TXT1": "",
      "EMPMST_UD_TXT2": "",
      "EMPMST_UD_TXT3": "",
      "EMPMST_UD_TXT4": "",
      "EMPMST_UD_TXT5": "",
      "EMPMST_UD_TXT6": "",
      "EMPMST_UD_TXT7": "",
      "EMPMST_UD_TXT8": "",
      "EMPMST_UD_TXT9": "",
      "EMPMST_UD_TXT10": "",
      "EMPMST_UD_TXT11": "",
      "EMPMST_UD_TXT12": "",
      "EMPMST_UD_TXT13": "",
      "EMPMST_UD_TXT14": "",
      "EMPMST_UD_TXT15": ""
    }
  }

  formSubmit() {
    let API = 'EmployeeMaster/InsertEmployeeMaster';
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
                this.employeeMasterForm.reset();
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

    let API = 'EmployeeMaster/UpdateEmployeeMaster/' + this.employeeMasterForm.value.code;
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
                this.employeeMasterForm.reset();
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
  deleteEmployeeMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.EMPMST_CODE) {
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
        let API = 'EmployeeMaster/DeleteEmployeeMaster/' + this.content?.EMPMST_CODE;
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
                    this.employeeMasterForm.reset()
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
                    this.employeeMasterForm.reset()
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