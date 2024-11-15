import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
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
  @Input() content!: any;

  selectedTabIndex = 0;
  tableData: any = [];
  editMode: boolean = false;
  codeEnable: boolean = false;
  private subscriptions: Subscription[] = [];
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  currentDate = new Date();



  BranchData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  DepartmentData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Department code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "Types = 'FA DEPARTMENT'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  DesignationData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Design Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='HRM DESIGNATION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  GradeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Grade Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM GRADE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  NationalityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Nationality Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='NATIONALITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ReligionData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Religion Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

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

  StateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'State Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='state master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  CityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'City Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  PRCountryCodeData: MasterSearchModel = {
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

  PRStateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'State Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='state master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  PRCityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'City Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  
  GenderList = [
    {
      name: 'Male',
      value: 1
    },
    {
      name: 'FEMALE',
      value: 2
    },
    {
      name: 'Other',
      value: 3
    },
  ]

  maritial = [
    {
      name: 'Married',
      value: 1
    },
    {
      name: 'Single',
      value: 2
    },
  ]

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
    Religion: [''],
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
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    // this.renderer.selectRootElement('#code')?.focus();
    // this.codeEnable = true;
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == 'VIEW') {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteEmployeeMaster()
      }
    }
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

  BranchDataSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Branch.setValue(e.BRANCH_CODE)
    this.employeeMasterForm.controls.BranchDes.setValue(e.BRANCH_NAME)
  }

  DepartmentSelected(e: any) {
    console.log(e);
  }

  DesignationSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Designation.setValue(e.CODE)
    this.employeeMasterForm.controls.DesignationDes.setValue(e.DESCRIPTION)

  }

  GradeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Grade.setValue(e.CODE)
    this.employeeMasterForm.controls.GradeDes.setValue(e.DESCRIPTION)

  }

  NationalitySelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Nationality.setValue(e.CODE)

  }

  ReligionSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Religion.setValue(e.CODE)

  }

  CountryCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.Country.setValue(e.CODE)
  }

  StateCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.State.setValue(e.CODE)

  }

  CityCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.City.setValue(e.CODE)
  }

  PRCountryCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.PRCountry.setValue(e.CODE)

  }

  PRStateCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.PRState.setValue(e.CODE)

  }

  PRCityCodeSelected(e: any) {
    console.log(e);
    this.employeeMasterForm.controls.PRCity.setValue(e.CODE)
  }

  addTableData() { }

  deleteTableData() { }

  setFormValues() {
    if (!this.content) return

    let API = 'EmployeeMaster/GetEmployeeMasterDetail/' + this.content.EMPMST_CODE;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        this.employeeMasterForm.controls.DOB.setValue(result.response.EMPMST_DOB)
        this.employeeMasterForm.controls.DOJ.setValue(result.response.EMPMST_JOIN_DATE)
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

    this.employeeMasterForm.controls.code.setValue(this.content.EMPMST_CODE)
    this.employeeMasterForm.controls.name.setValue(this.content.EMPMST_NAME)
    this.employeeMasterForm.controls.otherLanguage.setValue(this.content.EMPMST_OTHERNAME)
    this.employeeMasterForm.controls.Branch.setValue(this.content.EMPMST_BRANCH_CODE)
    this.employeeMasterForm.controls.Department.setValue(this.content.EMPMST_DEPT_CODE)
    this.employeeMasterForm.controls.Designation.setValue(this.content.EMPMST_DESG_CODE)
    this.employeeMasterForm.controls.GroupCode.setValue(this.content.EMPMST_DEDACCCODE)
    this.employeeMasterForm.controls.Grade.setValue(this.content.EMPMST_GRADE_CODE)
    this.employeeMasterForm.controls.Nationality.setValue(this.content.EMPMST_NATIONALITY_CODE)
    this.employeeMasterForm.controls.Religion.setValue(this.content.EMPMST_NATIONALITY_CODE)
    this.employeeMasterForm.controls.DOB.setValue(this.content.EMPMST_DOB)
    this.employeeMasterForm.controls.BloodGroup.setValue(this.content.EMPMST_BLOOD_GROUP)
    this.employeeMasterForm.controls.FatherName.setValue(this.content.EMPMST_FATHER_NAME)
    this.employeeMasterForm.controls.Gender.setValue(this.content.EMPMST_GENDER)
    this.employeeMasterForm.controls.MaritialStatus.setValue(this.content.EMPMST_MARITAL_STATUS)
    this.employeeMasterForm.controls.HomeHouseName.setValue(this.content.EMPMST_HOUSENAME_HM)
    this.employeeMasterForm.controls.HomeAddress.setValue(this.content.EMPMST_ADDRESS_HM)
    this.employeeMasterForm.controls.Country.setValue(this.content.EMPMST_COUNTRYCODE_HM)
    this.employeeMasterForm.controls.State.setValue(this.content.EMPMST_STATECODE_HM)
    this.employeeMasterForm.controls.City.setValue(this.content.EMPMST_TOWNCODE_HM)
    this.employeeMasterForm.controls.MoblieCode.setValue(this.content.EMPMST_MOBILE_HM1)
    this.employeeMasterForm.controls.MoblieNum.setValue(this.content.EMPMST_MOBILE_HM2)
    this.employeeMasterForm.controls.LandLineNum.setValue(this.content.EMPMST_TEL_LAND_HM)
    this.employeeMasterForm.controls.email.setValue(this.content.EMPMST_EMAIL)
    this.employeeMasterForm.controls.PRhouseName.setValue(this.content.EMPMST_HOUSENAME_PR)
    this.employeeMasterForm.controls.PRAddress.setValue(this.content.EMPMST_ADDRESS_PR)
    this.employeeMasterForm.controls.PRCountry.setValue(this.content.EMPMST_COUNTRYCODE_PR)
    this.employeeMasterForm.controls.PRState.setValue(this.content.EMPMST_STATECODE_PR)
    this.employeeMasterForm.controls.PRCity.setValue(this.content.EMPMST_TOWNCODE_PR)
    this.employeeMasterForm.controls.PRMoblieCode.setValue(this.content.EMPMST_MOBILE_PR1)
    this.employeeMasterForm.controls.PRMoblieNo.setValue(this.content.EMPMST_MOBILE_PR2)
    this.employeeMasterForm.controls.PRLand.setValue(this.content.EMPMST_TEL_LAND_PR)
  }

  setPostData() {//this.commonService.nullToString()
    let form = this.employeeMasterForm.value
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "EMPMST_CODE": this.commonService.nullToString(form.code),
      "EMPMST_NAME": this.commonService.nullToString(form.name),
      "EMPMST_OTHERNAME": this.commonService.nullToString(form.otherLanguage),
      "EMPMST_BRANCH_CODE": this.commonService.nullToString(form.Branch),
      "EMPMST_VISABRANCH_CODE": "str",
      "EMPMST_DEPT_CODE": this.commonService.nullToString(form.Department),
      "EMPMST_DESG_CODE": this.commonService.nullToString(form.Designation),
      "EMPMST_DEDACCCODE": this.commonService.nullToString(form.GroupCode),
      "EMPMST_EMPSUBLEDGERAC": "str",
      "EMPMST_PICPATH": "str",
      "EMPMST_SIGNPATH": "str",
      "EMPMST_GRADE_CODE": this.commonService.nullToString(form.Grade),
      "EMPMST_REPORTTO_CODE1": "str",
      "EMPMST_REPORTTO_CODE2": "str",
      "EMPMST_VISA_DESG_CODE": "str",
      "EMPMST_CATEGORY_CODE": "str",
      "EMPMST_TYPE_CODE": "str",
      "EMPMST_CAMP_CODE": "str",
      "EMPMST_LOCATION_CODE": "str",
      "EMPMST_NATIONALITY_CODE": this.commonService.nullToString(form.Nationality),
      "EMPMST_RELIGION_CODE": this.commonService.nullToString(form.Religion),
      "EMPMST_CONTRACT_CODE": "str",
      "EMPMST_DOB": form.DOB,
      "EMPMST_BLOOD_GROUP": this.commonService.emptyToZero(form.BloodGroup),
      "EMPMST_FATHER_NAME": this.commonService.nullToString(form.FatherName),
      "EMPMST_MOTHER_TONGUE": "str",
      "EMPMST_GENDER": this.commonService.emptyToZero(form.Gender),
      "EMPMST_MARITAL_STATUS": this.commonService.emptyToZero(form.MaritialStatus),
      "EMPMST_PROBATION_CONFIRMED": 0,
      "EMPMST_PROBATION_PERIOD": "str",
      "EMPMST_PROBATION_STARTDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_JOIN_DATE": form.DOJ,
      "EMPMST_CONFIRM_DATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_LEAVING_STATUS": true,
      "EMPMST_LEAVE_DATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_REASON_CODE": "string",
      "EMPMST_LAST_ANUAL_LV_TAKEN": "2024-11-14T08:17:18.161Z",
      "EMPMST_LAST_REJOIN_ON": "2024-11-14T08:17:18.161Z",
      "EMPMST_TRAINING_MONTHS": 0,
      "EMPMST_NOTICE_PERIOD": 0,
      "EMPMST_LAST_PRPDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_LAST_OVTDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_LEAVESPERYEAR": 0,
      "EMPMST_PENDINGPERYEAR": 0,
      "EMPMST_LEAVESPERMONTH": 0,
      "EMPMST_SALARY_PERIOD": 0,
      "EMPMST_SALARY_METHOD": 0,
      "EMPMST_STOP_SALARY": true,
      "EMPMST_TIME_ATTREQU": true,
      "EMPMST_WITHOVT": true,
      "EMPMST_CURRENCY": "str",
      "EMPMST_SALARY_ACCODE": "str",
      "EMPMST_SALARY_SUBLEDGERAC": "str",
      "EMPMST_JOBCOSTRATE": 0,
      "EMPMST_BASIC_SALARY": 0,
      "EMPMST_GROSS_ALLOWANCE": 0,
      "EMPMST_GROSS_DEDUCTION": 0,
      "EMPMST_GROSS_SALARY": 0,
      "EMPMST_TOTAL_CONTRACT_SALARY": 0,
      "EMPMST_COMPANY_BANK_CODE": "str",
      "EMPMST_BANK_CODE": "str",
      "EMPMST_BANK_ACCOUNT_NO": "str",
      "EMPMST_AGENT_CODE": "str",
      "EMPMST_WPS_TYPE": "str",
      "EMPMST_NORMALOT_CODE": "str",
      "EMPMST_HOLIDAYOT_CODE": "str",
      "EMPMST_ELIGIBLE_LEAVE_SALARY": true,
      "EMPMST_ELIGIBLE_AIRTICKET": true,
      "EMPMST_ELIGIBLE_GRATUITY": true,
      "EMPMST_LEAVESALARY_STARTDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_AIRTKT_STARTDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_GRATUITY_STARTDATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_LSALARY_CODE": "str",
      "EMPMST_AIRTIKT_CODE": "str",
      "EMPMST_GRTUITY_CODE": "str",
      "EMPMST_LAST_LEVSAL_DATE": "2024-11-14T08:17:18.161Z",
      "EMPMST_LAST_AIRTKT_DATE": "2024-11-14T08:17:18.161Z",
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
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.updateEmployeeMaster()
      return
    }
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