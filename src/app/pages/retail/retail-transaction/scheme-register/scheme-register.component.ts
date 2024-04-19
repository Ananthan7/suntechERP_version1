import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { AuthCheckerComponent } from 'src/app/shared/common/auth-checker/auth-checker.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild('add_scheme') add_scheme: any;
  @ViewChild('pos_customer_search') pos_customer_search: any;
  @ViewChild(AuthCheckerComponent) authCheckerComponent?: AuthCheckerComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  formdata = new FormData();
  isLoading: boolean = false
  viewMode: boolean = false;
  disableDOJ: boolean = true;
  usedSchemeMode: boolean = false;
  editMode: boolean = false;
  editUNITS: boolean = false;
  isViewSchemeMasterGrid: boolean = true;
  disableCancelBtn: boolean = true;
  viewPorcessBtn: boolean = true;
  viewDeleteBtn: boolean = false;
  disableSaveBtn: boolean = false;
  selectedFieldValue: string = '';
  VIEWEDITFLAG: string = '';
  
  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  newSchemeItems: any[] = [];
  SchemeMasterDetails: any[] = [];
  IdTypesList: any[] = [];
  schemeArray: any[] = []
  dataToEditrow: any[] = [];
  detailArray: any[] = []
  savedAttachments: any[] = []
  newSchemeLength: number = 0
  dataIndex: any;
  currentDate: any = new Date();
  dateFormat: any = this.commonService.allbranchMaster?.BDATEFORMAT
  initialLoadedAmounts: any;
  customerMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithName: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'NAME',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithMobile: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'MOBILE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SCHEMEMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 59,
    SEARCH_FIELD: 'SCHEME_CODE',
    SEARCH_HEADING: 'Scheme Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATUS = 1 AND BRANCH_CODE="+this.commonService.branchCode,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  BranchMasterFindData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: "BRANCH_CODE",
    SEARCH_HEADING: "Branch Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  Attachedfile: any[] = [];

  schemeRegistrationForm: FormGroup = this.formBuilder.group({
    SchemeId: ['', Validators.required],
    SCHEME_CODE: [''],
    Code: ['', Validators.required],
    Name: [''],
    MobileNo: [''],
    Email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
    PanNo: [''],
    Branch: ['', Validators.required],
    DateOfJoining: [''],
    AlertBeforeDays: [''],
    CancellationCharge: [''],
    TenurePeriod: [''],
    MaturingDate: [''],
    InstallmentAmount: [''],
    BonusInstallment: [''],
    Units: [1],
    Frequency: [''],
    TotalAmountToPay: [''],
    SchemeType: [''],
    Salesman: ['', Validators.required],
    SalesmanName: [''],
    SumAssured: [''],
    Remarks: [''],
    SendAlert: [true],
    VOCTYPE: [''],
    VOCDATE: [''],
    SCH_REMINDER_MODE: [0],
    SCH_PARTIALLY_PAID: [false],
    PAY_STATUS: [false],
    REMAINDER_SEND: [true],
    SCH_SEND_ALERT: [true],
    SCH_CANCEL: [false],
    SCH_REDEEM: [false],
    SCH_STATUS: [''],
    SCH_REMINDER_DAYS: [0],
    UNIQUEID: [0],
    SCH_CUSTOMER_ID: [''],
    Attachedfile: [null],
  });
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {

  }
  ngOnInit(): void {
    if (this.content?.FLAG == 'VIEW') {
      this.viewMode = true
      this.usedSchemeMode = true;
      this.schemeRegistrationForm.controls.SendAlert.disable()
    }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.editUNITS = true
      this.editMode = true
      this.disableCancelBtn = false
    }
    // if (this.content && this.content.FLAG == 'DELETE') {
    //  this.authCheckerComponent?.openAuthModal()
    // }
    this.schemeRegistrationForm.controls.SchemeType.setValue('AMOUNT');
    this.schemeRegistrationForm.controls.Branch.setValue(this.commonService.branchCode);
    this.schemeRegistrationForm.controls.DateOfJoining.setValue(this.currentDate)
    this.schemeRegistrationForm.controls.VOCDATE.setValue(this.currentDate)
    this.schemeRegistrationForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.setInitialValues()
  }
 
  ngAfterViewInit(): void {
    this.getIDtypes() //ID master list
  }
  attachmentClicked(){
    this.attachmentUploadComponent?.showDialog()
  }
  SalesmanSelected(event: any) {
    this.schemeRegistrationForm.controls.Salesman.setValue(event.SALESPERSON_CODE)
    this.schemeRegistrationForm.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  salesmanChange(event: any) {
    if (event.target.value == ""){
      this.schemeRegistrationForm.controls.SalesmanName.setValue('');
      return
    };
    if (this.content?.FLAG == 'VIEW') return;

    let inputValue = event.target.value;
    inputValue = inputValue.toUpperCase();
    let data = this.commonService.SalespersonMasterData.filter((item: any) => item.SALESPERSON_CODE == inputValue);
    if (data.length > 0) {
      this.schemeRegistrationForm.controls.Salesman.setValue(
        data[0].SALESPERSON_CODE
      );
      this.schemeRegistrationForm.controls.SalesmanName.setValue(
        data[0].DESCRIPTION
      );
    } else {
      this.commonService.toastErrorByMsgId("Invalid Salesperson Code!");
      this.schemeRegistrationForm.controls.Salesman.setValue("");
      this.schemeRegistrationForm.controls.SalesmanName.setValue("");
    }
  }
  BranchMasterChange(event: any) {
    this.schemeRegistrationForm.controls.Branch.setValue(event.BRANCH_CODE)
  }
  setInitialValues() {
    if (!this.content) return;    
    this.schemeRegistrationForm.controls.VOCTYPE.setValue(this.content.PAY_VOCTYPE)
    this.schemeRegistrationForm.controls.Code.setValue(this.content.SCH_CUSTOMER_CODE)
    this.schemeRegistrationForm.controls.Name.setValue(this.content.SCH_CUSTOMER_NAME)
    this.schemeRegistrationForm.controls.MobileNo.setValue(this.content.SCH_ALERT_MOBILE)
    this.schemeRegistrationForm.controls.Email.setValue(this.content.SCH_ALERT_EMAIL)
    this.schemeRegistrationForm.controls.SCH_CUSTOMER_ID.setValue(this.content.SCH_CUSTOMER_ID)
    this.openAttchments()
    this.getSchemeRegistrationDetail(this.content.SCH_CUSTOMER_ID)
  }
  //schemeid EDIT and VIEW Value Change
  getSchemeRegistrationDetail(SCH_CUSTOMER_ID: any) {
    let API = `SchemeRegistration/GetSchemeRegistrationDetail/${SCH_CUSTOMER_ID}`
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          let detail = data.Details
          detail.forEach((item: any) => {
            item.PAY_AMOUNT_CC = this.commonService.decimalQuantityFormat(item.PAY_AMOUNT_CC,'AMOUNT')
            item.PAY_AMOUNT_CC = this.commonService.commaSeperation(item.PAY_AMOUNT_CC)
            item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTCC,'AMOUNT')
            item.RCVD_AMOUNTCC = this.commonService.commaSeperation(item.RCVD_AMOUNTCC)
          })
          this.SchemeMasterDetails = detail.sort((a:any, b:any) => a.SRNO - b.SRNO);
          if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'DELETE') {
            let schemeReceipts: any[] = this.SchemeMasterDetails.filter((item: any) => item.RCVD_VOCTYPE != '')
            if (schemeReceipts.length == 0) {
              this.viewDeleteBtn = true;
              this.disableSaveBtn = true;
              this.usedSchemeMode = false;
              if (this.content.FLAG == 'EDIT') {
                this.disableDOJ = false;
                this.viewMode = false;
                this.viewDeleteBtn = false;
              }
              if (this.content.FLAG == 'DELETE') this.deleteBtnClicked(); 
            } else {
              this.viewDeleteBtn = false;
              this.viewMode = true;
              if (this.content.FLAG == 'DELETE'){
                this.commonService.toastErrorByMsgId('Scheme is in use!, cannot delete')
              }else{
                this.disableSaveBtn = true;
                this.usedSchemeMode = false;
              }
            }
          }
          if(this.content?.FLAG == 'VIEW'){
            this.viewMode = true;
          }
          if (data.SCH_CANCEL) {
            this.viewMode = true
            this.disableSaveBtn = false;
            this.usedSchemeMode = true;
            this.commonService.toastErrorByMsgId('Scheme is canceled')
          }

          this.schemeRegistrationForm.controls.Branch.setValue(data.PAY_BRANCH_CODE)
          this.schemeRegistrationForm.controls.Salesman.setValue(data.SALESPERSON_CODE)
          this.schemeRegistrationForm.controls.SalesmanName.setValue(data.SALESMAN_NAME)
          this.schemeRegistrationForm.controls.SCHEME_CODE.setValue(data.SCH_SCHEME_CODE)
          this.schemeRegistrationForm.controls.SchemeId.setValue(data.SCH_SCHEME_CODE)
          this.schemeRegistrationForm.controls.Units.setValue(data.SCH_UNITS)
          this.schemeRegistrationForm.controls.SendAlert.setValue(data.SCH_SEND_ALERT)
          this.schemeRegistrationForm.controls.TenurePeriod.setValue(data.SCH_SCHEME_PERIOD)
          this.schemeRegistrationForm.controls.Frequency.setValue(data.SCH_FREQUENCY)

          this.schemeRegistrationForm.controls.MobileNo.setValue(data.SCH_ALERT_MOBILE)
          this.schemeRegistrationForm.controls.Email.setValue(data.SCH_ALERT_EMAIL)
          // this.schemeRegistrationForm.controls.BonusInstallment.setValue(
          //   this.commonService.commaSeperation(data.SCHEME_BONUS))
          let totalAMT = data.SCH_INST_AMOUNT_FC * data.SCH_SCHEME_PERIOD
          this.setFormControlAmount('TotalAmountToPay', totalAMT)
          this.setFormControlAmount('InstallmentAmount', data.SCH_INST_AMOUNT_CC)
          this.setFormControlAmount('CancellationCharge', data.SCH_CANCEL_AMT)
          this.setFormControlAmount('SumAssured', data.SCH_ASSURED_AMT_FC)
          this.setFormControlAmount('BonusInstallment', data.SCHEME_BONUS)
          //amounts used for calculating number of units
          this.initialLoadedAmounts = {
            InstallmentAmount: data.SCH_INST_AMOUNT_CC,
            CancellationCharge: data.SCH_CANCEL_AMT,
            BonusInstallment: data.SCHEME_BONUS,
          }
          this.schemeRegistrationForm.controls.Remarks.setValue(data.REMARKS)
          this.schemeRegistrationForm.controls.PanNo.setValue(data.PAN_NUMBER)
          this.schemeRegistrationForm.controls.DateOfJoining.setValue(data.SCH_JOIN_DATE)
          this.schemeRegistrationForm.controls.VOCDATE.setValue(data.VOCDATE)
          this.schemeRegistrationForm.controls.MaturingDate.setValue(data.SCH_EXPIRE_DATE)



          let params = {
            "ID": 1,
            "SCHEME_UNIQUEID": this.commonService.nullToString(data.Details[0].UNIQUEID),
            "SCHEME_ID": this.commonService.nullToString(data.SCH_CUSTOMER_CODE),
            "SCHEME_UNITS": this.commonService.emptyToZero(data.SCH_UNITS),
            "SCHEME_TOTAL_VALUE": this.commonService.emptyToZero(data.PAY_AMOUNTFC),
            "SCHEME_STARTED": this.commonService.nullToString(this.commonService.formatDateTime(data.SCH_JOIN_DATE)),
            "SCHEME_ENDEDON": this.commonService.nullToString(this.commonService.formatDateTime(data.SCH_EXPIRE_DATE)),
            "SCHEME_STATUS": this.commonService.nullToString(data.SCH_STATUS?.toString() == '1' ? 'Active' : 'InActive'),
            "SCHEME_UNITVALUE": this.commonService.emptyToZero(Number(data.SCH_UNITS) * Number(data.PAY_AMOUNTFC)),
            "SCHEME_CUSTCODE": this.commonService.nullToString(this.schemeRegistrationForm.value.Code),
            "BRANCH_CODE": data.Branch || new Date(1 / 1 / 1753).toISOString(),
            "PCS_SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
            "SalesManCode": this.commonService.nullToString(data.Salesman),
            "AttachmentPath": '',
            "BANK_ACCOUNTNO": "",
            "BANK_IBANNO": "",
            "BANK_SWIFTID": "",
            "BANK_EMISTARTDATE": this.commonService.formatDateTime(this.currentDate),
            "BANK_EMIENDDATE": this.commonService.formatDateTime(this.currentDate),
            "ACTIVE": true,
            "SCHEME_REMARKS": '',
            "CUSTOMER_ACCOUNTNO": '',
            "BANK_DATE": this.commonService.formatDateTime(this.currentDate),
            "SCHEME_BLOCK": data.SCH_REDEEM ? 1 : 0,
            "SCHEME_ControlRedeemDate": this.commonService.formatDateTime(this.currentDate),
          }
          this.newSchemeItems.push(params)

          let datas = {
            "schemeData": params,
            // "ImageData": {
            //   "BRANCH_CODE": this.commonService.branchCode || "",
            //   "VOCTYPE": "",
            //   "YEARMONTH": this.commonService.yearSelected,
            //   "VOCNO": 0
            // },
            // "Images": data.Attachedfile || []
          }
          this.detailArray.push(datas)

          this.commonService.closeSnackBarMsg();
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
        this.commonService.closeSnackBarMsg();
      })
    this.subscriptions.push(Sub)
  }
  validateNoOfUnitLimit(event:any){
    if(this.commonService.emptyToZero(event.target.value)>12){
      this.commonService.toastErrorByMsgId('No of Unit cannot be more than 12')
      this.schemeRegistrationForm.controls.Units.setValue(12)
    }
  }
  /**USE: change fn to calculate no of units and amount */
  numberOfUnitCalculate() {
    let form = this.schemeRegistrationForm.value
    if (form.Units && this.content?.FLAG != 'VIEW' && !this.editUNITS) {
      let InstallmentAmount: number = this.commonService.emptyToZero(form.Units) * this.commonService.emptyToZero(this.initialLoadedAmounts.InstallmentAmount)
      // let CancellationCharge: number = this.commonService.emptyToZero(form.Units) * this.commonService.emptyToZero(this.initialLoadedAmounts.CancellationCharge)
      // let BonusInstallment: number = this.commonService.emptyToZero(form.Units) * this.commonService.emptyToZero(this.initialLoadedAmounts.BonusInstallment)
      let TotalAmountToPay: number = InstallmentAmount * this.commonService.emptyToZero(form.TenurePeriod)
      let SumAssured: number = TotalAmountToPay + this.initialLoadedAmounts.BonusInstallment;

      this.setFormControlAmount('InstallmentAmount', InstallmentAmount);
      // this.setFormControlAmount('CancellationCharge', CancellationCharge);
      // this.setFormControlAmount('BonusInstallment', BonusInstallment);
      this.setFormControlAmount('TotalAmountToPay', TotalAmountToPay);
      this.setFormControlAmount('SumAssured', SumAssured);
    }
  }
  setFormControlAmount(controlName: string, amount: any) {
    amount = this.commonService.emptyToZero(amount)
    amount = this.commonService.decimalQuantityFormat(amount, 'AMOUNT')
    this.schemeRegistrationForm.controls[controlName].setValue(
      this.commonService.commaSeperation(amount)
    )
  }
  /**schemeID change function */
  schemeIDChange(event: any) {
    if (event.target.value == "") return;
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${event.target.value}`;
    let Sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((result: any) => {
        let sataus = result.status.trim().toLowerCase();
        if (sataus == "success") {
          if (result.response["SCHEME_CUSTCODE"]) {
            let event = {
              target: { value: result.response["SCHEME_CUSTCODE"] },
            };
            this.searchValueChange(event, "CODE", true);
          }
          this.newSchemeItems = [];
          this.newSchemeItems.push(result.response);
        } else {
          Swal.fire({
            title: "Scheme Id Not Found",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          });
        }
      });
    this.subscriptions.push(Sub);
  }
  validateInput(event: any): void {
    const allowedChars = /[a-zA-Z0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  customizeText(data: any) {
    let num = Number(data.value).toFixed(2)
    return num
  }
  /**USE: grid click event */
  onRowClickHandler(event: any) {
    this.VIEWEDITFLAG = 'EDIT'
    this.dataIndex = event.dataIndex
  }
  customizeDate(data: any) {
    if (!data.value) return
    return data.value.slice(0, 10)
  }
  openAttchments(e?: any) {
    // const columnName = e.column?.dataField;
    // const cellValue = e.data[columnName];

    // Handle the cell click event based on the column and value
    // if (columnName === 'IS_ATTACHMENT_PRESENT') {
      // let SCHEME_UNIQUEID = e.row.data.SCHEME_UNIQUEID;
      let API = `SchemeRegistration/GetSchemeAttachments`
      let param = { SCH_CUSTOMER_ID: this.content.SCH_CUSTOMER_ID }
      let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
        .subscribe((result: any) => {
          if (result.fileCount > 0) {
            this.savedAttachments = []
            for (let j = 0; j < result.file.length; j++) {
              this.savedAttachments.push({file: result.file[j]})
              // window.open(
              //   result.file[j],
              //   '_blank' // <- This is what makes it open in a new window.
              // );
            }
          } 
          // else {
          //   this.commonService.toastErrorByMsgId(result.message)
          // }
        })
    // }
  }
  cancelSchemeClick() {
    this.authCheckerComponent?.openAuthModal()
  }
  cancelScheme(event: any) {
    if (!this.content?.SCH_CUSTOMER_ID) {
      this.commonService.toastErrorByMsgId('customer id not available')
      return
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let API = `SchemeRegistration/CancelSchemeRegistration/` + this.content?.SCH_CUSTOMER_ID
    let param = { SCH_CUSTOMER_ID: this.content?.SCH_CUSTOMER_ID || '' }
    let Sub: Subscription = this.dataService.putDynamicAPI(API, param)
      .subscribe((result: any) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          this.viewMode = true
          this.commonService.toastSuccessByText('Scheme Cancelled')
        } else {
          this.commonService.toastErrorByMsgId(result.message)
        }
      })
  }
  addScheme() {
    this.isViewSchemeMasterGrid = false
  }
  uploadSubmited(file:any){
    this.Attachedfile = file
  }
  fetchSchemeWithCustCode() {
    if (this.viewMode == true || this.content?.FLAG == 'VIEW') return
    if (this.schemeRegistrationForm.value.SchemeId == ''){
      return
    }
    this.SchemeMasterDetails = []
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = `SchemeMaster/GetSchemeMasterDetails/${this.schemeRegistrationForm.value.Branch}/${this.schemeRegistrationForm.value.SchemeId}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        if (result.response) {
          this.editUNITS = false;
          let data = result.response
          if (data.STATUS == false) {
            this.commonService.toastErrorByMsgId('Selected Scheme is Inactive')
            this.schemeRegistrationForm.controls.SchemeId.setValue('')
            return
          }
          this.disableDOJ = false;
          this.viewPorcessBtn = false
          this.schemeRegistrationForm.controls.SCHEME_CODE.setValue(data.SCHEME_CODE)
          this.schemeRegistrationForm.controls.Branch.setValue(data.BRANCH_CODE)
          this.schemeRegistrationForm.controls.Frequency.setValue(data.SCHEME_FREQUENCY)
          this.schemeRegistrationForm.controls.Remarks.setValue(data.SCHEME_REMARKS)
          this.schemeRegistrationForm.controls.Units.setValue(1)
          this.schemeRegistrationForm.controls.TenurePeriod.setValue(data.SCHEME_PERIOD)
          // this.schemeRegistrationForm.controls.BonusInstallment.setValue(
          //   this.commonService.commaSeperation(data.SCHEME_BONUS)
          // )
          let total = data.SCHEME_AMOUNT * data.SCHEME_PERIOD
          this.setFormControlAmount('TotalAmountToPay', total)
          this.setFormControlAmount('InstallmentAmount', data.SCHEME_AMOUNT)
          this.setFormControlAmount('CancellationCharge', data.CANCEL_CHARGE)
          this.setFormControlAmount('BonusInstallment', data.SCHEME_BONUS)
          this.setFormControlAmount('SumAssured', (total + data.SCHEME_BONUS))
          this.initialLoadedAmounts = {
            InstallmentAmount: data.SCHEME_AMOUNT,
            CancellationCharge: data.CANCEL_CHARGE,
            BonusInstallment: data.SCHEME_BONUS,
          }

          let maturingdate
          if (data.SCHEME_FREQUENCY.toUpperCase() == 'WEEKLY') {
            maturingdate = this.commonService.addWeeksToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
          } else {
            maturingdate = this.commonService.addMonthsToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
            console.log(maturingdate, 'maturingdate');
          }
          this.schemeRegistrationForm.controls.MaturingDate.setValue(maturingdate)
        } else {
          this.disableDOJ = true;
          this.schemeRegistrationForm.controls.SchemeId.setValue('')
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      })
    this.subscriptions.push(Sub)
  }

  ReminderSendSelected(data: any, value: any) {
    this.SchemeMasterDetails[value.data.SRNO - 1].REMAINDER_SEND = data.REMAINDER_SEND ? true : false;
  }
  PayStatusSelected(data: any, value: any) {
    this.SchemeMasterDetails[value.data.SRNO - 1].PAY_STATUS = data.PAY_STATUS ? true : false;
    //this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }
  /**USE: funtion used to process grid  */
  processSchemeAPI() {
    let formValue = this.schemeRegistrationForm.value
    if(formValue.Code == ''){
      this.commonService.toastErrorByMsgId('Customer code required')
      return
    }
    if(formValue.Salesman == ''){
      this.commonService.toastErrorByMsgId('Salesman required')
      return
    }
    if(formValue.SchemeId == ''){
      this.commonService.toastErrorByMsgId('Scheme Code required')
      return
    }
    let joindate = this.commonService.formatYYMMDD(new Date(formValue.DateOfJoining))
    let params = {
      BRANCH_CODE: formValue.Branch || this.commonService.branchCode,
      SCHEME_CODE: this.commonService.nullToString(formValue.SchemeId),
      joinDate: this.commonService.nullToString(joindate),
      alertBeforeDays: this.commonService.emptyToZero(formValue.AlertBeforeDays),
      tenure: this.commonService.emptyToZero(formValue.TenurePeriod),
    }
    let API = `SchemeRegistration`
    let sub: Subscription = this.dataService.getDynamicAPIwithParams(API, params)
      .subscribe((resp: any) => {
        if (resp) {
          this.viewMode = true;
          this.disableSaveBtn = true;
          this.usedSchemeMode = true;
          this.SchemeMasterDetails = resp.response
          let amountcc = this.commonService.emptyToZero(formValue.InstallmentAmount)
          amountcc = this.commonService.decimalQuantityFormat(amountcc,'AMOUNT')
          this.SchemeMasterDetails.forEach((item: any) => {
            item.PAY_AMOUNT_FC = this.commonService.commaSeperation(amountcc)
            item.PAY_AMOUNT_CC = this.commonService.commaSeperation(amountcc)
            item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTCC,'AMOUNT')
            item.RCVD_AMOUNTCC = this.commonService.commaSeperation(item.RCVD_AMOUNTCC)
            item.RCVD_VOCNO = item.RCVD_VOCNO.toString()
            if (item.REMAINDER_SEND.toString() == '0') {
              item.REMAINDER_SEND = false
            } else {
              item.REMAINDER_SEND = true
            }
          })
          this.SchemeMasterDetails.sort((a: any, b: any) => a.SRNO - b.SRNO)

        } else {
          this.commonService.toastErrorByMsgId('Server Error')
        }
      });
    this.subscriptions.push(sub)
  }

  exportToExcel() {
    this.commonService.exportExcel(this.schemeReceiptList, 'Scheme Details')
  }

  /**USE get Nationalitycode from API */
  getIDtypes() {
    let API = 'GeneralMaster/GetGeneralMasterList/ID MASTER'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.IdTypesList = result.response;
      });
    this.subscriptions.push(Sub)
  }
  emailIdChange(event: any) {
    if (this.schemeRegistrationForm.controls.Email.hasError('pattern')) {
      this.commonService.toastErrorByMsgId('Email Format Not Correct')
      this.schemeRegistrationForm.controls.Email.setValue('')
    }
  }
  restCustomer(){
    this.schemeRegistrationForm.controls.Code.setValue('')
    this.schemeRegistrationForm.controls.MobileNo.setValue('')
    this.schemeRegistrationForm.controls.Name.setValue('')
    this.schemeRegistrationForm.controls.Email.setValue('')
  }
  //search Value Change SCHEME_CUSTCODE
  searchValueChange(event: any, searchFlag: string, schemeFlag?: boolean) {
    if(event.target.value == '') this.restCustomer();
    if (event.target.value == '' || this.content?.FLAG == 'VIEW') return;
    let API = `PosCustomerMaster/GetCustomerByCode/${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.selectedCustomer(result.response, schemeFlag)
      } else {
        this.reset()
        this.commonService.toastErrorByMsgId('MSG1531')
      }
    }, err => this.commonService.toastErrorByMsgId('MSG1531'))
    this.subscriptions.push(Sub)
  }

  deleteTableData() {
    this.newSchemeItems = []
  }
  saveClick() {
    this.schemeRegistrationForm.reset()
    this.isViewSchemeMasterGrid = true;

    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.IdTypesList = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  selectedCustomer(data: any, schemeFlag?: boolean) {
    this.schemeRegistrationForm.controls.Code.setValue(data.CODE)
    this.schemeRegistrationForm.controls.MobileNo.setValue(data.MOBILE)
    this.schemeRegistrationForm.controls.Name.setValue(data.NAME)
    this.schemeRegistrationForm.controls.Email.setValue(data.EMAIL)
    // this.schemeRegistrationForm.controls.GovIdType.setValue(data.Idcategory)
    // this.schemeRegistrationForm.controls.GovIdNumber.setValue(data.POSCustIDNo)
    // if (data.CODE && !schemeFlag) this.fetchSchemeWithCustCode()
  }
  selectedScheme(data: any) {
    this.schemeRegistrationForm.controls.SCHEME_CODE.setValue(data.SCHEME_CODE)
    this.schemeRegistrationForm.controls.SchemeId.setValue(data.SCHEME_CODE.toUpperCase())
    if (data.SCHEME_CODE) this.fetchSchemeWithCustCode()
  }
  reset() {
    this.schemeRegistrationForm.controls.Code.setValue('')
    this.schemeRegistrationForm.controls.MobileNo.setValue('')
    this.schemeRegistrationForm.controls.Name.setValue('')
    this.schemeRegistrationForm.controls.Email.setValue('')
    this.schemeRegistrationForm.controls.GovIdType.setValue(null)
    this.schemeRegistrationForm.controls.GovIdNumber.setValue('')
  }

  cancel() {
    this.reset()
    this.isViewSchemeMasterGrid = true;
    this.detailArray = []
    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }


  addNewRow(data: any) {
    let params = {
      "ID": 1,
      "SCHEME_UNIQUEID": '',
      "SCHEME_ID": this.commonService.nullToString(data.SchemeID),
      "SCHEME_UNITS": this.commonService.emptyToZero(data.Units),
      "SCHEME_TOTAL_VALUE": this.commonService.emptyToZero(data.TotalValue),
      "SCHEME_STARTED": this.commonService.formatDateTime(data.StartDate),
      "SCHEME_ENDEDON": this.commonService.formatDateTime(data.endDate),
      "SCHEME_STATUS": this.commonService.nullToString(data.Status),
      "SCHEME_UNITVALUE": this.commonService.emptyToZero(data.SchemeAmount),
      "SCHEME_CUSTCODE": this.commonService.nullToString(this.schemeRegistrationForm.value.Code),
      "BRANCH_CODE": this.commonService.nullToString(data.Branch),
      "PCS_SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "SalesManCode": this.commonService.nullToString(data.Salesman),
      "AttachmentPath": '',
      "BANK_ACCOUNTNO": "",
      "BANK_IBANNO": "",
      "BANK_SWIFTID": "",
      "BANK_EMISTARTDATE": this.commonService.formatDateTime(this.currentDate),
      "BANK_EMIENDDATE": this.commonService.formatDateTime(this.currentDate),
      "ACTIVE": true,
      "SCHEME_REMARKS": '',
      "CUSTOMER_ACCOUNTNO": '',
      "BANK_DATE": this.commonService.formatDateTime(this.currentDate),
      "SCHEME_BLOCK": data.BlockScheme ? 1 : 0,
      "SCHEME_ControlRedeemDate": this.commonService.formatDateTime(this.currentDate),
    }
    if (this.VIEWEDITFLAG == 'EDIT') {
      this.newSchemeItems[this.dataIndex] = params;
      this.VIEWEDITFLAG = ''
    } else {
      this.newSchemeItems.push(params)
    }

    let datas = {
      "schemeData": params,
      // "ImageData": {
      //   "BRANCH_CODE": this.commonService.branchCode || "",
      //   "VOCTYPE": "",
      //   "YEARMONTH": this.commonService.yearSelected,
      //   "VOCNO": 0
      // },
      "Images": data.Attachedfile || []
    }
    this.detailArray.push(datas)
  }

  replaceObject(updatedObject: any): void {
    const index = this.newSchemeItems.findIndex((item: any) => item.id === updatedObject.id);

    if (index !== -1) {
      // Replace the object at the found index
      this.newSchemeItems[index] = updatedObject;
    }
  }
  onFileChange(input: any) {
    if (input.target.files.length > 0) {
      const file: File = input.target.files[0];
      for (let x = 0; x < input.target.files.length; x++) {
        this.Attachedfile.push(file);
        this.schemeRegistrationForm.controls.Attachedfile.setValue(this.Attachedfile);
        // this.formdata.append("Images[" + x + "].Image.File", file);
      }
    }
  }
  setPostData() {
    let formValue = this.schemeRegistrationForm.value
    let params = {
      "MID": this.content ? this.content.MID : 0,
      "SCH_CUSTOMER_ID": this.content ? this.content.SCH_CUSTOMER_ID : "",
      "SCH_CUSTOMER_CODE": formValue.Code,
      "SCH_CUSTOMER_NAME": formValue.Name,
      "SCH_SCHEME_CODE": formValue.SchemeId,
      "SCH_METALCURRENCY": "",
      "SCH_JOIN_DATE": this.commonService.formatDateTime(new Date(formValue.DateOfJoining)),
      "SCH_SCHEME_PERIOD": this.commonService.emptyToZero(formValue.TenurePeriod),
      "SCH_FREQUENCY": formValue.Frequency,
      "SCH_INST_AMOUNT_FC": this.commonService.CCToFC(
        this.commonService.compCurrency,
        this.commonService.emptyToZero(formValue.InstallmentAmount)
      ) || 0,
      "SCH_INST_AMOUNT_CC": this.commonService.emptyToZero(formValue.InstallmentAmount),
      "SCH_ASSURED_AMT_FC": this.commonService.CCToFC(
        this.commonService.compCurrency,
        this.commonService.emptyToZero(formValue.SumAssured)
      ) || 0,
      "SCH_ASSURED_AMT_CC": this.commonService.emptyToZero(formValue.SumAssured),
      "SCH_EXPIRE_DATE": this.commonService.formatDateTime(new Date(formValue.MaturingDate)),
      "SCH_REMINDER_DAYS": this.commonService.emptyToZero(formValue.AlertBeforeDays),
      "SCH_REMINDER_MODE": formValue.Frequency,
      "SCHEME_BONUS": this.commonService.emptyToZero(formValue.BonusInstallment),
      "REMARKS": formValue.Remarks,
      "SCH_UNITS": this.commonService.emptyToZero(formValue.Units),
      "SCH_CANCEL_AMT": this.commonService.emptyToZero(formValue.CancellationCharge),
      "SCH_STATUS": formValue.SCH_STATUS,
      "PAY_DATE": this.commonService.formatDateTime(new Date(formValue.DateOfJoining)),
      "PAY_BRANCH_CODE": formValue.Branch,
      "PAY_VOCTYPE": formValue.VOCTYPE,
      "PAY_VOCNO": 0,
      "PAY_YEARMONTH": this.commonService.yearSelected,
      "PAY_AMOUNTFC": this.commonService.emptyToZero(formValue.InstallmentAmount) * this.commonService.emptyToZero(formValue.TenurePeriod),
      "PAY_AMOUNTCC": this.commonService.emptyToZero(formValue.InstallmentAmount) * this.commonService.emptyToZero(formValue.TenurePeriod),
      "SCH_ALERT_EMAIL": formValue.Email,
      "SCH_ALERT_MOBILE": formValue.MobileNo,
      "SCH_SEND_ALERT": formValue.SendAlert,
      "PAN_NUMBER": formValue.PanNo.toUpperCase(),
      "SCH_PAN_NUMBER": formValue.PanNo.toUpperCase(),
      "VOCDATE": formValue.VOCDATE,
      "SCH_CANCEL": false,
      "SCH_REDEEM": true,
      "REDEEM_REFERENCE": "",
      "SCHEME_BRANCH": formValue.Branch,
      "SALESPERSON_CODE": formValue.Salesman,
      "SALESMAN_NAME": formValue.SalesmanName,
      "Details": this.SchemeMasterDetails || []
    }
    this.detailArray = []
    this.detailArray.push(params)
  }

  /**USE: set form data for saving */
  setFormData() {
    this.setPostData();
    let formValue = this.schemeRegistrationForm.value

    this.detailArray.forEach((item: any, i: any) => {
      // delete item.schemeData['ID'];
      this.formdata.append(`Model.model[${i}].schemeData.MID`, this.content ? this.content.MID : '0');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_ID`, this.content ? this.content.SCH_CUSTOMER_ID : '0');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_CODE`, formValue.Code);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_NAME`, formValue.Name);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SCHEME_CODE`, formValue.SCHEME_CODE || '');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_METALCURRENCY`, 'AMOUNT');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_JOIN_DATE`, this.commonService.formatDate(new Date(formValue.DateOfJoining)));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SCHEME_PERIOD`, formValue.TenurePeriod || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_FREQUENCY`, formValue.Frequency);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_INST_AMOUNT_FC`, item.SCH_INST_AMOUNT_FC);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_INST_AMOUNT_CC`, item.SCH_INST_AMOUNT_CC);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ASSURED_AMT_FC`, item.SCH_ASSURED_AMT_FC || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ASSURED_AMT_CC`, item.SCH_ASSURED_AMT_CC || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_EXPIRE_DATE`, this.commonService.formatDate(new Date(formValue.MaturingDate)));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REMINDER_DAYS`, formValue.AlertBeforeDays || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REMINDER_MODE`, formValue.Frequency);
      this.formdata.append(`Model.model[${i}].schemeData.SCHEME_BONUS`, item.SCHEME_BONUS);
      this.formdata.append(`Model.model[${i}].schemeData.REMARKS`, item.REMARKS);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_UNITS`, formValue.Units);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CANCEL_AMT`, item.SCH_CANCEL_AMT);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_STATUS`, '0');
      this.formdata.append(`Model.model[${i}].schemeData.PAY_DATE`, this.commonService.formatDate(new Date(formValue.DateOfJoining)));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_BRANCH_CODE`, this.commonService.nullToString(this.commonService.branchCode));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_VOCTYPE`, formValue.VOCTYPE);
      this.formdata.append(`Model.model[${i}].scheformValue.PanNomeData.PAY_VOCNO`, '0');
      this.formdata.append(`Model.model[${i}].schemeData.PAY_YEARMONTH`, this.commonService.nullToString(this.commonService.yearSelected));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_AMOUNTFC`, item.PAY_AMOUNTFC || 0);
      //TODO PAY_AMOUNTFC = installment amount * schemeperiod
      this.formdata.append(`Model.model[${i}].schemeData.PAY_AMOUNTCC`, item.PAY_AMOUNTCC || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ALERT_EMAIL`, formValue.Email);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ALERT_MOBILE`, formValue.MobileNo);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SEND_ALERT`, formValue.SendAlert);
      this.formdata.append(`Model.model[${i}].schemeData.PAN_NUMBER`, item.PAN_NUMBER);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_PAN_NUMBER`, item.SCH_PAN_NUMBER);
      this.formdata.append(`Model.model[${i}].schemeData.VOCDATE`, this.commonService.formatDate(new Date(formValue.VOCDATE)));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CANCEL`, formValue.SCH_CANCEL);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REDEEM`, formValue.SCH_REDEEM);
      this.formdata.append(`Model.model[${i}].schemeData.REDEEM_REFERENCE`, `''`);
      this.formdata.append(`Model.model[${i}].schemeData.SCHEME_BRANCH`, this.commonService.branchCode);
      this.formdata.append(`Model.model[${i}].schemeData.SALESPERSON_CODE`, formValue.Salesman);
      this.formdata.append(`Model.model[${i}].schemeData.SALESMAN_NAME`, formValue.SalesmanName);
      this.SchemeMasterDetails.forEach((data: any, index: any) => {
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].UNIQUEID`, data.UNIQUEID ? data.UNIQUEID : '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_CUSTOMER_CODE`, formValue.Code);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_CUSTOMER_ID`, '');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SRNO`, data.SRNO || '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_DATE`, this.commonService.formatDate(new Date(data.PAY_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_AMOUNT_FC`, data.PAY_AMOUNT_FC || 0);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_AMOUNT_CC`, data.PAY_AMOUNT_CC || 0);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_STATUS`, data.PAY_STATUS);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].REMAINDER_DATE`, this.commonService.formatDate(new Date(data.REMAINDER_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].REMAINDER_SEND`, data.REMAINDER_SEND);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].DT_BRANCH_CODE`, this.commonService.branchCode);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_DATE`, this.commonService.formatDate(new Date(data.RCVD_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_BRANCH_CODE`, data.RCVD_BRANCH_CODE);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_VOCTYPE`, data.RCVD_VOCTYPE);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_VOCNO`, '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_YEARMONTH`, this.commonService.yearSelected);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_AMOUNTFC`, '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_AMOUNTCC`, data.RCVD_AMOUNTCC);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCHBAL_AMOUNTFC`, '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCHBAL_AMOUNTCC`, '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_PARTIALLY_PAID`, formValue.SCH_PARTIALLY_PAID);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RECEIPT_REF`, '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RECEIPT_MID`, '0');
      })
      if (this.Attachedfile.length > 0) {
        this.formdata.append(`Model.model[0].imageData.VOCNO`, formValue.UNIQUEID);
        this.formdata.append(`Model.model[0].imageData.UNIQUEID`, '');
        this.formdata.append(`Model.model[0].imageData.SRNO`, formValue.UNIQUEID);
        this.formdata.append(`Model.model[0].imageData.VOCDATE`, this.commonService.formatDate(new Date(formValue.VOCDATE)));
        this.formdata.append(`Model.model[0].imageData.REMARKS`, formValue.Remarks);
        this.formdata.append(`Model.model[0].imageData.CODE`, formValue.Code);
        this.formdata.append(`Model.model[0].imageData.EXPIRE_DATE`, '');
        this.formdata.append(`Model.model[0].imageData.DOC_ACTIVESTATUS`, '');
        this.formdata.append(`Model.model[0].imageData.DOC_LASTRENEWBY`, '');
        this.formdata.append(`Model.model[0].imageData.DOC_LASTRENEWDATE`, '');
        this.formdata.append(`Model.model[0].imageData.DOC_NEXTRENEWDATE`, '');
        this.formdata.append(`Model.model[0].imageData.DOCUMENT_DATE`, this.commonService.formatDate(new Date(formValue.VOCDATE)));
        this.formdata.append(`Model.model[0].imageData.DOCUMENT_NO`, '');
        this.formdata.append(`Model.model[0].imageData.FROM_KYC`, '');
        for (let i: number = 0; i < this.Attachedfile.length; i++) {
          this.formdata.append("Model.Images[" + i + "].Image.File", this.Attachedfile[i]);
        }
      }
    })
  }
  submitValidation() {
    let flag = false
    // /Code Name Salesman
    if (this.schemeRegistrationForm.value.Code == '') {
      this.commonService.toastErrorByMsgId('Customer Code Required')
      flag = true
    }
    if (this.schemeRegistrationForm.value.SchemeId == '') {
      this.commonService.toastErrorByMsgId('Scheme Code Required')
      flag = true
    }
    if (this.schemeRegistrationForm.value.Branch == '') {
      this.commonService.toastErrorByMsgId('Branch Code Required')
      flag = true
    }
    if (this.schemeRegistrationForm.value.Salesman == '') {
      this.commonService.toastErrorByMsgId('Salesman Required')
      flag = true
    }
    if (this.SchemeMasterDetails.length == 0) {
      this.commonService.toastErrorByMsgId('Process Scheme Before saving')
      flag = true
    }
    // if (this.schemeRegistrationForm.value.SendAlert && this.schemeRegistrationForm.value.Email == '' ) {
    //   this.commonService.toastErrorByMsgId('Mail Id required for Send Alert')
    //   flag = true
    // }
    return flag
  }

  /**USE: save button click */
  formSubmitWithAttachment() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.editSchemeDetail()
      this.schemeRegistrationForm.controls.SCH_CUSTOMER_ID.setValue(this.content.SCH_CUSTOMER_ID)
      return
    }
    if (this.submitValidation()) return
    this.setFormData();
    //save API
    this.isLoading = true;
    this.commonService.showSnackBarMsg('MSG81447');
    let API = 'SchemeRegistration/InsertWithAttachments'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, this.formdata)
      .subscribe((result: any) => {
        this.isLoading = false;
        this.commonService.closeSnackBarMsg();
        if (result.status == "Success") {
          this.detailArray = []
          this.formdata = new FormData();
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text:  "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.close('reloadMainGrid')
          })
        } else {
          this.detailArray = []
          this.commonService.toastErrorByMsgId('Scheme Not Saved, try again')
        }
      }, err => {
        this.detailArray = []
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531')
        this.isLoading = false;
      })
    this.subscriptions.push(Sub)
  }

  editSchemeDetail() {
    let API = 'SchemeRegistration/UpdateWithAttachments'
    this.setFormData();
    let Sub: Subscription = this.dataService.putDynamicAPI(API, this.formdata)
      .subscribe((result) => {
        if (result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text:  "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.formdata = new FormData();
              this.close('reloadMainGrid')
            }
          })
        } else {
          this.commonService.toastErrorByMsgId(result.message || 'No updated')
        }
      }, err => alert(err))

    this.subscriptions.push(Sub)
  }

  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
  }
  editMainGridDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
  }
  //USE delete row
  deleteBtnClicked() {
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
        this.deleteSchemeRegistration()
      }
    })
  }
  deleteSchemeRegistration() {
    let API = `SchemeRegistration/DeleteSchemeRegistration/${this.content?.MID}`
    let Sub: Subscription = this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result.status == "Success") {
        this.close()
        Swal.fire({
          title: this.commonService.getMsgByID('MSG3588') || 'Deleted',
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.close('reloadMainGrid')
          }
        })
      } else {
        this.commonService.toastErrorByMsgId(result.message || 'Scheme Not Deleted!')
      }
    }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  formatDateMaturingDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.schemeRegistrationForm.controls.DateOfJoining.setValue(new Date(date))
    }
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.schemeRegistrationForm.controls.DateOfJoining.setValue(new Date(date))
    }
    let maturingdate
    if (this.schemeRegistrationForm.value.Frequency.toUpperCase() == 'WEEKLY') {
      maturingdate = this.commonService.addWeeksToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
    } else {
      maturingdate = this.commonService.addMonthsToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
      console.log(maturingdate, 'maturingdate');
    }
    this.schemeRegistrationForm.controls.MaturingDate.setValue(maturingdate)
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    this.snackBar.dismiss()
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }


  changeDateOfJoining(event: any) {
    this.updateMaturingDate();
  }

  updateMaturingDate() {
    let value = this.schemeRegistrationForm.value.TenurePeriod;
    const dateOfJoining = new Date(this.schemeRegistrationForm.value.DateOfJoining);
    if (value != '') {
      if (this.schemeRegistrationForm.value.Frequency.toUpperCase() == 'WEEKLY') {
        const updatedDate = dateOfJoining.getDate() + (parseInt(value) * 7);
        dateOfJoining.setDate(updatedDate);
      } else {
        const updatedDate = dateOfJoining.getMonth() + parseInt(value);
        dateOfJoining.setMonth(updatedDate);
      }
      this.schemeRegistrationForm.controls.MaturingDate.setValue(dateOfJoining);
    } else {
      this.schemeRegistrationForm.controls.MaturingDate.setValue(dateOfJoining);
    }
  }

}
