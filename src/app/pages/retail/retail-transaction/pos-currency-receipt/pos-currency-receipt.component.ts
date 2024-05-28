import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PosCurrencyReceiptDetailsComponent } from './pos-currency-receipt-details/pos-currency-receipt-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PosCustomerMasterComponent } from '../common/pos-customer-master/pos-customer-master.component';
import { DxDataGridComponent } from 'devextreme-angular';
import { startOfDay } from '@fullcalendar/angular';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { AuditTrailComponent } from 'src/app/shared/common/audit-trail/audit-trail.component';


@Component({
  selector: 'app-pos-currency-receipt',
  templateUrl: './pos-currency-receipt.component.html',
  styleUrls: ['./pos-currency-receipt.component.scss']
})
export class PosCurrencyReceiptComponent implements OnInit {
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;
  @ViewChild(AuditTrailComponent) auditTrailComponent?: AuditTrailComponent;

  @Input() content!: any; //use: To get clicked row details from master grid
  // columnhead: any[] = ['Sr#', 'Branch', 'Mode', 'A/c Code', 'Account Head', '', 'Curr.Rate', 'VAT_E_', 'VAT_E_'];
  columnsList: any[] = [
    { title: 'Sr #', field: 'SRNO' },
    { title: 'Branch', field: 'BRANCH_CODE' },
    { title: 'Mode', field: 'MODE' },
    { title: 'A/c Code', field: 'ACCODE' },
    { title: 'Account Head', field: 'HDACCOUNT_HEAD' },
    { title: 'Currency', field: 'CURRENCY_CODE' },
    { title: 'Curr.Rate', field: 'CURRENCY_RATE' },
    { title: 'Amount', field: 'AMOUNTCC' },
    { title: 'VAT_E_', field: 'CGST_AMOUNTCC' },
    { title: 'Total', field: 'NET_TOTAL' },
  ];

  viewOnly: boolean=false;
  midForInvoce:any=0;
  posCurrencyDetailsData: any[] = [];
  private subscriptions: Subscription[] = [];
  amlNameValidation?: boolean;
  customerData: any;
  baseYear: any = localStorage.getItem('YEAR') || '';
  strBranchcode: any = localStorage.getItem('userbranch');
  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  yearMonth?: String;
  userName?: String;
  companyCurrency?: String;
  gridAmountDecimalFormat: any;
  isCurrencyUpdate: boolean = false;
  vatPercentage: string = '';
  hsnCode: string = '';
  currencyCode: any;
  currencyConvRate: any;

  isCustomerRequired = false;
  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: '',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Party Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'POS Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  selectedIndexes: any = [];



  posCurrencyReceiptForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: [''],
    vocDate: [''],
    partyCode: [''],
    partyCodeDesc: [''],  // No
    partyCurrency: [''],
    partyCurrencyRate: [''],
    enteredby: [''], // No
    enteredbyuser: [''], // No
    dueDaysdesc: [''],
    dueDays: [new Date()], // no
    customerCode: [''],
    customerName: [''],
    mobile: [''],
    email: [''],
    partyAddress: [''],
    schemaCode: [''],
    schemaId: [''],
    partyCurr: [], // need to remove the value
    partyAmountFC: [0.00],  // need to remove the value
    narration: [''],
    totalTax: [''],
    total: ['']
  })

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    public comService: CommonServiceService,
    private indexedDb: IndexedDbService,
  ) {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency
    };

    this.companyCurrency = this.comService.compCurrency;

    console.log(this.isCustomerRequired)
  }



  async ngOnInit(): Promise<void> {
    await this.loadCompanyParams();
    console.log(this.isCustomerRequired)
    // this.posCurrencyReceiptForm.controls['vocType'].disable();
    // this.posCurrencyReceiptForm.controls['vocNo'].disable();

    this.branchCode = this.comService.branchCode;
    // this.yearMonth = this.comService.yearSelected;
    this.userName = this.comService.userName;


    let branchParams: any = localStorage.getItem('BRANCH_PARAMETER')
    this.comService.allbranchMaster = JSON.parse(branchParams);

    this.amlNameValidation = this.comService.allbranchMaster.AMLNAMEVALIDATION;

    this.posCurrencyReceiptForm.controls.vocDate.setValue(this.currentDate)
    this.posCurrencyReceiptForm.controls.vocType.setValue(this.comService.getqueryParamVocType())

    this.getFinancialYear();
    this.getPartyCode();

    if (this.content?.MID != null)
      this.getArgsData();
    else {
      this.changeDueDate(null);
      this.generateVocNo();

    }

  }


  private loadCompanyParams(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.indexedDb.getAllData('compparams').subscribe((data) => {
        if (data.length > 0) {
          console.log('==============compparams======================');
          console.log(data);
          console.log('====================================');
          this.comService.allCompanyParams = data;
          this.comService.allCompanyParams.forEach((param: any) => {
            if (param.PARAMETER === 'PCRPOSCUSTCOMPULSORY') {
              this.isCustomerRequired = param.PARAM_VALUE === '1';
            }
          });
        }
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum?VocType=${this.comService.getqueryParamVocType()}&BranchCode=${this.strBranchcode}&strYEARMONTH=${this.baseYear}&vocdate=${this.convertDateToYMD(this.currentDate)}&blnTransferDummyDatabase=false`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.posCurrencyReceiptForm.controls.vocNo.setValue(resp.newvocno);
        }
      });
  }

  getPartyCode() {

    const API = `AdvanceReceiptParty/${this.strBranchcode}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          console.log('resp', resp.Accode);
          this.posCurrencyReceiptForm.controls.partyCode.setValue(resp.Accode);
          this.getGSTDetails(resp.Accode);
          this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(resp.AccountHead);
          this.partyCodeChange({ target: { value: resp.Accode } });
        }
      });

  }
  updateDueDays(event: any) {
    let value = event.target.value;
    if (value != '') {
      const vocDate = new Date(this.posCurrencyReceiptForm.value.vocDate);
      const updatedDate = vocDate.getDate() + parseInt(value);
      vocDate.setDate(updatedDate);
      this.posCurrencyReceiptForm.controls.dueDays.setValue(vocDate);
    } else {
      this.posCurrencyReceiptForm.controls.dueDays.setValue(this.currentDate);
    }
  }


  changeDueDate(event: any) {
    // const inputValue = event.target.value;
    const inputValue = this.posCurrencyReceiptForm.value.dueDays;
    const vocDate = new Date(this.posCurrencyReceiptForm.value.vocDate);

    if (inputValue !== '') {
      const selectedDate = new Date(inputValue);
      selectedDate.setHours(0, 0, 0, 0);

      if (!isNaN(selectedDate.getTime())) {
        vocDate.setHours(0, 0, 0, 0);
        const difference = this.calculateDateDifference(selectedDate, vocDate);
        this.posCurrencyReceiptForm.get('dueDaysdesc')?.setValue(difference.toString());
      } else {
        console.error('Invalid date input. Please enter a valid date.');
      }
    }
  }

  calculateDateDifference(dateA: Date, dateB: Date): number {
    const timeDifference = dateA.getTime() - dateB.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return Math.floor(dayDifference);
  }


  getArgsData() {
    console.log('this.content', this.content);
    if (this.content.FLAG == 'VIEW')
      this.viewOnly = true;

    this.snackBar.open('Loading...');
    let Sub: Subscription = this.dataService.getDynamicAPI(`AdvanceReceipt/GetAdvanceReceiptWithMID/${this.content.MID}`)
      .subscribe((result) => {
        this.snackBar.dismiss();
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        if (result.status == "Success") {
          const data = result.response;

          this.posCurrencyDetailsData = data.currencyReceiptDetails;
          this.posCurrencyDetailsData.forEach((data, index) => { data.NET_TOTAL = (parseFloat(data.AMOUNTCC) + parseFloat(data.CGST_AMOUNTCC)).toFixed(2); });
          console.log('this.posCurrencyDetailsData', this.posCurrencyDetailsData);
          this.updateFormValuesAndSRNO();

          // set form values
          this.posCurrencyReceiptForm.controls.vocType.setValue(data.VOCTYPE);
          this.posCurrencyReceiptForm.controls.vocNo.setValue(data.VOCNO);
          this.posCurrencyReceiptForm.controls.vocDate.setValue(data.VOCDATE);
          this.posCurrencyReceiptForm.controls.partyCode.setValue(data.PARTYCODE);
          // this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue();
          this.posCurrencyReceiptForm.controls.partyCurrency.setValue(data.PARTY_CURRENCY);
          this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(data.PARTY_CURR_RATE);

          this.posCurrencyReceiptForm.controls.enteredby.setValue(data.SALESPERSON_CODE);
          // this.posCurrencyReceiptForm.controls.enteredbyuser.setValue();
          // this.posCurrencyReceiptForm.controls.dueDays.setValue(data.DUEDAYS);
          this.posCurrencyReceiptForm.controls.dueDaysdesc.setValue(data.DUEDAYS);

          this.posCurrencyReceiptForm.controls.customerCode.setValue(data.POSCUSTOMERCODE);
          this.posCurrencyReceiptForm.controls.customerName.setValue(data.CUSTOMER_NAME);
          this.posCurrencyReceiptForm.controls.mobile.setValue(data.CUSTOMER_MOBILE);
          this.posCurrencyReceiptForm.controls.email.setValue(data.CUSTOMER_EMAIL);
          this.customerData = {
            "MOBILE": data.CUSTOMER_MOBILE,
            "CODE": data.POSCUSTOMERCODE,
          }

          this.posCurrencyReceiptForm.controls.partyAddress.setValue(data.PARTY_ADDRESS);

          this.posCurrencyReceiptForm.controls.partyCurr.setValue(data.PARTY_CURRENCY);
          this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(data.TOTAL_AMOUNTFC);
          // this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(data.TOTAL_AMOUNTCC);
        }
      });
  }

  enteredBySelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.enteredby.setValue(e.SALESPERSON_CODE);
    this.posCurrencyReceiptForm.controls.enteredbyuser.setValue(e.DESCRIPTION);
  }

  auditTrailClick() {
    let params = {
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.posCurrencyReceiptForm.value.vocType,
      VOCNO: this.posCurrencyReceiptForm.value.vocNo.toString() || '',
      MID: this.content?this.comService.emptyToZero(this.content?.MID):this.midForInvoce,
      YEARMONTH: this.yearMonth,
    }
    this.auditTrailComponent?.showDialog(params)
  }

  // PartyCodeChange(event: any) {
  //   this.PartyCodeData.SEARCH_VALUE = event.target.value
  // }

  partyCodeSelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.partyCode.setValue(e.ACCODE);
    this.getGSTDetails(e.ACCODE);
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(e['ACCOUNT HEAD']);
    this.partyCodeChange({ target: { value: e.ACCODE } })
  }

  //party Code Change
  partyCodeChange(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let postData = {
      "SPID": "001",
      "parameter": {
        "ACCODE": event.target.value || "",
        "BRANCH_CODE": this.branchCode
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.status == "Success") { //
          if (result.dynamicData.length > 0) {

            let data = result.dynamicData[0]
            console.log('data', data);

            if (data && data[0].CURRENCY_CODE) {
              if (this.companyCurrency == data[0].CURRENCY_CODE)
                this.isCurrencyUpdate = true;
              else
                this.isCurrencyUpdate = false;

              this.posCurrencyReceiptForm.controls.partyCurrency.setValue(data[0].CURRENCY_CODE)
              this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(data[0].CONV_RATE)
              this.posCurrencyReceiptForm.controls.partyCurr.setValue(data[0].CURRENCY_CODE)
              this.currencyCode = data[0].CURRENCY_CODE;
              this.currencyConvRate = data[0].CONV_RATE;

              // this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(data[0].CURRENCY_CODE)
              // this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(data[0].CURRENCY_CODE)
              // this.PartyDetailsOrderForm.controls.BillToAccountHead.setValue(data[0].ACCOUNT_HEAD)
              // this.PartyDetailsOrderForm.controls.BillToAddress.setValue(data[0].ADDRESS)

              // let currencyArr = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE = data[0].CURRENCY_CODE)
              // this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(currencyArr[0].CONV_RATE)
              // this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(currencyArr[0].CONV_RATE)
            }
          }

        } else {
          this.toastr.error('PartyCode not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
  }


  partyCurrencyCodeSelected(e: any) {
    // console.log(e);
    this.posCurrencyReceiptForm.controls.partyCurrency.setValue(e.CURRENCY_CODE);
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(e.CURRENCY_CODE);
  }

  customerCodeSelected(e: any) {
    console.log(e);
    this.customerData = e;
    this.posCurrencyReceiptForm.controls.customerCode.setValue(e.CODE);
    this.posCurrencyReceiptForm.controls.customerName.setValue(e.NAME);
    this.posCurrencyReceiptForm.controls.mobile.setValue(e.MOBILE);
    this.posCurrencyReceiptForm.controls.email.setValue(e.EMAIL);
  }



  deleteDetailRecord() {
    // this.selec
    if (this.selectedIndexes.length > 0) {
      this.posCurrencyDetailsData = this.posCurrencyDetailsData.filter((data, index) => !this.selectedIndexes.includes(index));
      this.updateFormValuesAndSRNO();
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }
  }

  validateForm() {
    if (this.posCurrencyReceiptForm.invalid) {
      this.toastr.error('Select all required fields');
      return false;
    }

    if (this.isCustomerRequired && !this.posCurrencyReceiptForm.controls.customerCode.value) {
      this.toastr.error('Please fill customer details');
      return false;
    }

    return true;
  }
  formSubmit() {


    if (!this.validateForm()) {
      return;
    }


    let postData = {
      "MID": this.content?.MID || 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.posCurrencyReceiptForm.value.vocType,
      "VOCNO": this.posCurrencyReceiptForm.value.vocNo || 0,
      "VOCDATE": this.posCurrencyReceiptForm.value.vocDate,
      "VALUE_DATE": this.posCurrencyReceiptForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.posCurrencyReceiptForm.value.partyCode || "",
      "PARTY_CURRENCY": this.posCurrencyReceiptForm.value.partyCurrency || "",
      "PARTY_CURR_RATE": this.posCurrencyReceiptForm.value.partyCurrencyRate || "0",
      "TOTAL_AMOUNTFC": this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      "TOTAL_AMOUNTCC": this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      "REMARKS": this.posCurrencyReceiptForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-10T11:05:50.756Z",
      "NAVSEQNO": 0,
      "HAWALACOMMCODE": "",
      "HAWALACOMMPER": 0,
      "FLAG_UPDATED": "0",
      "FLAG_INPROCESS": "0",
      "SUPINVNO": "",
      "SUPINVDATE": this.posCurrencyReceiptForm.value.vocDate,
      "HHACCOUNT_HEAD": "",
      "SALESPERSON_CODE": this.posCurrencyReceiptForm.value.enteredby,
      "BALANCE_FC":this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      "BALANCE_CC": this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      "AUTHORIZEDPOSTING": true,
      "AUTOGENREF": "",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "POSCUSTOMERCODE": this.posCurrencyReceiptForm.value.customerCode || "",
      "D2DTRANSFER": "",
      "DRAFT_FLAG": "0",
      "POSSCHEMEID": "",
      "FLAG_EDIT_ALLOW": "",
      "PARTY_ADDRESS": this.posCurrencyReceiptForm.value.partyAddress,
      "AUTOPOSTING": true,
      "POSTDATE": this.posCurrencyReceiptForm.value.vocDate,
      "ADVRETURN": true,
      "HTUSERNAME": this.userName,
      "GENSEQNO": 0,
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "",
      "GST_NUMBER": "",
      "GST_TYPE": "",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "DOC_REF": "",
      "REC_STATUS": "",
      "CUSTOMER_NAME": this.posCurrencyReceiptForm.value.customerName || "",
      "CUSTOMER_MOBILE": this.posCurrencyReceiptForm.value.mobile || "",
      "CUSTOMER_EMAIL": this.posCurrencyReceiptForm.value.email || "",
      "TDS_CODE": "",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "ADRRETURNREF": "",
      "SCH_SCHEME_CODE": this.posCurrencyReceiptForm.value.schemaCode || "",
      "SCH_CUSTOMER_ID": this.posCurrencyReceiptForm.value.schemaId || "",
      "REFDOCNO": "",
      "GIFT_CARDNO": "",
      "FROM_TOUCH": true,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "OT_TRANSFER_TIME": "2023-10-10T12:05:50.756Z",
      "DUEDAYS": this.posCurrencyReceiptForm.value.dueDaysdesc || "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "WOOCOMCARDID": "",
      "currencyReceiptDetails": this.posCurrencyDetailsData,
    }


    // let API = 'AdvanceReceipt/InsertAdvanceReceipt'

    if (this.content?.FLAG == 'VIEW')
      return;

    let apiCtrl;
    let apiResponse;
    if (this.content && this.content.FLAG == 'EDIT') {
      apiCtrl = `AdvanceReceipt/UpdateAdvanceReceipt/${postData.BRANCH_CODE}/${postData.VOCTYPE}/${postData.VOCNO}/${postData.YEARMONTH}`;
      apiResponse = this.dataService.putDynamicAPI(apiCtrl, postData)
    } else {
      apiCtrl = 'AdvanceReceipt/InsertAdvanceReceipt';
      apiResponse = this.dataService.postDynamicAPI(apiCtrl, postData)
    }

    let Sub: Subscription = apiResponse
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            this.midForInvoce=result.response.MID
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.posCurrencyReceiptForm.reset()
                // this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteCurrencyReceipt() {
    if (this.content.MID == null) {
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
        let API = `AdvanceReceipt/DeleteAdvanceReceipt/${this.content.BRANCH_CODE}/${this.content.VOCTYPE}/${this.content.VOCNO}/${this.content.YEARMONTH}`;
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
                    this.close('reloadMainGrid') //reloads data in MainGrid
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
                    this.close('reloadMainGrid')
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  AccountPosting() {
    if (!this.content) return
    let params = {
      BRANCH_CODE:  this.comService.nullToString(this.strBranchcode),
      VOCTYPE:  this.comService.getqueryParamVocType(),
      VOCNO: this.posCurrencyReceiptForm.value.vocNo,
      YEARMONTH: this.comService.nullToString(this.baseYear),
      MID: this.content?this.comService.emptyToZero(this.content?.MID):this.midForInvoce,
      ACCUPDATEYN: 'Y',
      USERNAME: this.comService.userName,
      MAINVOCTYPE: this.comService.getqueryParamMainVocType(),
      HEADER_TABLE: this.comService.getqueryParamTable(),
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('AccountPosting', params)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.comService.toastSuccessByMsgId(result.message || 'Posting Done')
        } else {
          this.comService.toastErrorByMsgId(result.message)
        }
      },
        (err) => this.comService.toastErrorByMsgId("Server Error")
      );
    this.subscriptions.push(Sub);
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    let indexes: Number[] = [];
    this.posCurrencyDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);

  }

  // customer master add, view
  openCustMaster() {
    this.posCurrencyReceiptForm.controls.partyCode.value;
    const modalRef: NgbModalRef = this.modalService.open(PosCustomerMasterComponent, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.customerData = this.customerData;
    modalRef.componentInstance.amlNameValidation = this.amlNameValidation;
    modalRef.componentInstance.vocDetails = {
      VOCTYPE: this.comService.getqueryParamVocType(),
      VOCDATE: this.posCurrencyReceiptForm.value.vocDate,
      VOCNO: this.posCurrencyReceiptForm.value.vocNo,
      YEARMONTH: this.yearMonth,
    };
    modalRef.componentInstance.queryParams = {isViewOnly: this.viewOnly };


    modalRef.result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
        console.log(result);
        if (result != null && result?.customerDetails != null)
          this.customerCodeSelected(result.customerDetails);
      },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );
  }



  onRowDoubleClicked(e: any) {
    e.cancel = true;
    this.openAddPosARdetails(e.data);
  }
  removeLineItemsGrid(e: any) {
    console.log(e.data)
    const values: any = []
    values.push(e.data.SRNO);
    let indexes: Number[] = [];
    this.posCurrencyDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    this.updateFormValuesAndSRNO();

  }


  printReceiptDetailsWeb() {
    // let _validate = this.validateBeforePrint();
    // if (_validate[0] === false) {
    //   if (typeof _validate[1] === 'string') {
    //     this.snackBar.open(_validate[1], 'OK');
    //   } else {
    //     console.error('Error message is not a string:', _validate[1]);
    //   }
    //   return
    // }
    let postData = {
      "MID":this.content?this.comService.emptyToZero(this.content?.MID):this.midForInvoce,
      "BRANCH_CODE": this.comService.nullToString(this.strBranchcode),
      "VOCNO": this.comService.emptyToZero(this.posCurrencyReceiptForm.value.vocNo,),
      "VOCTYPE": this.comService.nullToString(this.comService.getqueryParamVocType(),),
      "YEARMONTH": this.comService.nullToString(this.baseYear),
    }
    this.dataService.postDynamicAPI('GetAdvanceReceiptDetailsWeb ', postData)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.dynamicData
        var WindowPrt = window.open(' ', ' ', 'width=' + '1024px' + ', height=' + '800px');
        if (WindowPrt === null) {
          console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
          return;
        }
        let printContent = data[0][0].HTMLOUT;
        WindowPrt.document.write(printContent);

        WindowPrt.document.close();
        WindowPrt.focus();

        setTimeout(() => {
          if (WindowPrt) {
            WindowPrt.print();
          } else {
            console.error('Print window was closed before printing could occur.');
          }
        }, 800);
      })
  }


  openAddPosARdetails(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(PosCurrencyReceiptDetailsComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.receiptData = { ...data };
    modalRef.componentInstance.queryParams = { vatPercentage: this.vatPercentage, hsnCode: this.hsnCode, currecyCode: this.currencyCode, currencyConvRate: this.currencyConvRate, isViewOnly: this.viewOnly };

    // modalRef.componentInstance.receiptData = data;

    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from modal:', postData);
        this.handlePostData(postData);
      }
    });
  }

  getGSTDetails(acCode: any) {

    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let vatData = {

      'BranchCode': this.branchCode,
      'AcCode': acCode,
      'VocType': this.comService.getqueryParamVocType(),
      'Date': new Date().toISOString(),

    };
    let Sub: Subscription = this.dataService.postDynamicAPI('GetGSTCodeExpenseVoc', vatData)
      .subscribe((result) => {

        if (result.status == 'Success') {
          let data = result.response;
          console.log('vatData', data.GST_PER);
          this.vatPercentage = data.GST_PER;
          this.hsnCode = data.HSN_SAC_CODE;
        }
      }
      )
  }


  handlePostData(postData: any) {
    const preItemIndex = this.posCurrencyDetailsData.findIndex((data: any) =>
      data.SRNO.toString() == postData.SRNO.toString()
    );
    postData.NET_TOTAL = (parseFloat(postData.AMOUNTCC) + parseFloat(postData.CGST_AMOUNTCC)).toFixed(2);

    if (postData?.isUpdate && preItemIndex !== -1) {
      this.posCurrencyDetailsData[preItemIndex] = postData;
    } else {
      this.posCurrencyDetailsData.push(postData);
    }

    console.log('Updated posCurrencyDetailsData', this.posCurrencyDetailsData);
    this.updateFormValuesAndSRNO();
  }

  updateFormValuesAndSRNO() {
    let sumCGST_AMOUNTCC = 0;
    let sumAMOUNTCC = 0;

    this.posCurrencyDetailsData.forEach((data, index) => {
      data.SRNO = index + 1;
      sumCGST_AMOUNTCC += parseFloat(data.CGST_AMOUNTCC);
      sumAMOUNTCC += parseFloat(data.AMOUNTCC);
    });

    let totalSum = sumCGST_AMOUNTCC + sumAMOUNTCC;

    this.posCurrencyReceiptForm.controls.totalTax.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(sumCGST_AMOUNTCC),
      'AMOUNT'
    ));
    this.posCurrencyReceiptForm.controls.total.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(totalSum),
      'AMOUNT'
    ));
    this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(totalSum),
      'AMOUNT'
    ));
  }



  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear?VOCDATE=${this.comService.cDateFormat(this.posCurrencyReceiptForm.value.vocDate)}`;
    const res = await this.dataService.getDynamicAPI(API).toPromise()
    console.log(res);
    if (res.status == "Success") {
      this.yearMonth = res.BaseFinancialyear;
      console.log('BaseFinancialyear', res.BaseFinancialyear);

    }
  }

}
