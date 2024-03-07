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


@Component({
  selector: 'app-pos-currency-receipt',
  templateUrl: './pos-currency-receipt.component.html',
  styleUrls: ['./pos-currency-receipt.component.scss']
})
export class PosCurrencyReceiptComponent implements OnInit {
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;

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
    { title: 'VAT_E_', field: '' },
    { title: 'VAT_E_.', field: '' },
  ];

  viewOnly?: boolean;

  posCurrencyDetailsData: any[] = [];
  private subscriptions: Subscription[] = [];
  amlNameValidation?: boolean;
  customerData: any;


  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  yearMonth?: String;
  userName?: String;



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
    vocNo: ['1'],
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
    private comService: CommonServiceService,
  ) {

  }

  ngOnInit(): void {
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


    if (this.content?.MID != null)
      this.getArgsData();
    else
      this.changeDueDate(null);


    // this.posCurrencyReceiptForm.get('dueDaysdesc')?.valueChanges.subscribe((newValue) => {
    //   alert(newValue);
    //   const parsedDate = this.parseDateString(newValue);
    //   this.posCurrencyReceiptForm.get('dueDays')?.setValue(parsedDate);
    // });

    // this.posCurrencyReceiptForm.get('dueDays')?.valueChanges.subscribe((newDate: Date) => {
    //   this.posCurrencyReceiptForm.get('dueDaysdesc')?.setValue(this.formatDate(newDate));

    //   const currentDate = startOfDay(new Date());
    //   const difference = this.calculateDateDifference(newDate, currentDate);
    //   this.posCurrencyReceiptForm.get('dueDaysdesc')?.setValue(difference.toString());
    // });

    // Subscribe to changes in dueDaysdesc
    // this.posCurrencyReceiptForm.get('dueDaysdesc')?.valueChanges.subscribe((newValue) => {
    //   this.updateDueDays(newValue);
    // });

    // Subscribe to changes in dueDays
    // this.posCurrencyReceiptForm.get('dueDays')?.valueChanges.subscribe((newDate: Date) => {
    //   // Calculate and update the difference in days
    //   const currentDate = new Date();
    //   const difference = this.calculateDateDifference(newDate, currentDate);
    //   this.posCurrencyReceiptForm.get('dueDaysdesc')?.setValue(difference.toString());
    // });
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

  // PartyCodeChange(event: any) {
  //   this.PartyCodeData.SEARCH_VALUE = event.target.value
  // }

  partyCodeSelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.partyCode.setValue(e.ACCODE);
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(e['ACCOUNT_HEAD']);
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

              this.posCurrencyReceiptForm.controls.partyCurrency.setValue(data[0].CURRENCY_CODE)
              this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(data[0].CONV_RATE)
              this.posCurrencyReceiptForm.controls.partyCurr.setValue(data[0].CURRENCY_CODE)

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
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }
  }

  formSubmit() {

    // if (this.content && this.content.FLAG == 'EDIT') {
    // this.update()
    // return
    // }

    if (this.posCurrencyReceiptForm.invalid) {
      this.toastr.error('select all required fields')
      return
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
      "BALANCE_FC": 0,
      "BALANCE_CC": 0,
      "AUTHORIZEDPOSTING": true,
      "AUTOGENREF": "",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "POSCUSTOMERCODE": this.posCurrencyReceiptForm.value.customerCode || "",
      "D2DTRANSFER": "",
      "DRAFT_FLAG": "0",
      "POSSCHEMEID": "0",
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
      "REC_STATUS": "0",
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
    this.openAddPosARdetails(e.data);
  }

  openAddPosARdetails(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(PosCurrencyReceiptDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.receiptData = data;

    modalRef.result.then((postData) => {
      if (postData) {

        console.log('Data from modal:', postData);
        if (postData?.isUpdate) {

          const preItemIndex = this.posCurrencyDetailsData.findIndex((data: any) =>
            data.SRNO.toString() == postData.SRNO.toString()
          );

          console.log(preItemIndex);

          this.posCurrencyDetailsData[preItemIndex] = postData;

        } else {
          this.posCurrencyDetailsData.push(postData);
        }
        this.posCurrencyDetailsData.forEach((data, index) => data.SRNO = index + 1);
      }
    });
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
