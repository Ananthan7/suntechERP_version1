import { Component, Input, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-pos-currency-receipt',
  templateUrl: './pos-currency-receipt.component.html',
  styleUrls: ['./pos-currency-receipt.component.scss']
})
export class PosCurrencyReceiptComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  columnhead: any[] = ['Sr#', 'Branch', 'Mode', 'A/c Code', 'Account Head', 'Currency', 'Curr.Rate', 'VAT_E-', 'VAT_E-.'];
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  vocMaxDate = new Date();
  currentDate = new Date();

  branchCode?: String;
  yearMonth?: String;
  userName?: String;

  customerData: any;


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
    LOOKUPID: 6,
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
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.userName = this.comService.userName;

    this.posCurrencyReceiptForm.controls.vocDate.setValue(this.currentDate)
    this.posCurrencyReceiptForm.controls.vocType.setValue(this.comService.getqueryParamVocType())

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
    this.posCurrencyReceiptForm.controls.moblie.setValue(e.MOBILE);
    this.posCurrencyReceiptForm.controls.email.setValue(e.EMAIL);
  }




  openaddposdetails() {
    const modalRef: NgbModalRef = this.modalService.open(PosCurrencyReceiptDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }


  posCurrencyReceiptForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: ['0'],
    vocDate: [''],
    partyCode: [''],
    partyCodeDesc: [''],  // No
    partyCurrency: [''],
    partyCurrencyRate: [''],
    enteredby: [''], // No
    enteredbyuser: [''], // No
    dueDaysdesc: [''],
    dueDays: [''], // no
    customerCode: [''],
    customerName: [''],
    moblie: [''],
    email: [''],
    partyAddress: [''],
    schemaCode: [''],
    schemaId: [''],
    partyAmount: [1000], // need to remove the value
    partyAmountLc: [1000],  // need to remove the value
    narration: [''],
    totalTax: [''],
    total: ['']
  })

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.posCurrencyReceiptForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'AdvanceReceipt/InsertAdvanceReceipt'
    console.log(this.posCurrencyReceiptForm.value.vocDate);
    
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.posCurrencyReceiptForm.value.vocType,
      "VOCNO": this.posCurrencyReceiptForm.value.vocNo,
      "VOCDATE": this.posCurrencyReceiptForm.value.vocDate,
      "VALUE_DATE": this.posCurrencyReceiptForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.posCurrencyReceiptForm.value.partyCode || "",
      "PARTY_CURRENCY": this.posCurrencyReceiptForm.value.partyCurrency || "",
      "PARTY_CURR_RATE": this.posCurrencyReceiptForm.value.partyCurrencyRate || "",
      "TOTAL_AMOUNTFC": this.posCurrencyReceiptForm.value.partyAmount || "",
      "TOTAL_AMOUNTCC": this.posCurrencyReceiptForm.value.partyAmountLc || "",
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
      "SALESPERSON_CODE": "",
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
      "CUSTOMER_MOBILE": this.posCurrencyReceiptForm.value.moblie || "",
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
      "WOOCOMCARDID": "string",
      "currencyReceiptDetails": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "BRANCH_CODE": "string",
          "RECPAY_TYPE": "string",
          "MODE": "string",
          "ACCODE": "string",
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTCC": 0,
          "HEADER_AMOUNT": 0,
          "CHEQUE_NO": "string",
          "CHEQUE_DATE": "2023-10-10T11:05:50.756Z",
          "CHEQUE_BANK": "string",
          "REMARKS": "string",
          "BANKCODE": "string",
          "PDCYN": "s",
          "HDACCOUNT_HEAD": "string",
          "MODEDESC": "string",
          "D_POSSCHEMEID": "string",
          "D_POSSCHEMEUNITS": 0,
          "CARD_NO": "string",
          "CARD_HOLDER": "string",
          "CARD_EXPIRY": "2023-10-10T11:05:50.756Z",
          "PCRMID": 0,
          "BASE_CONV_RATE": 0,
          "SUBLEDJER_CODE": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTCC": 0,
          "CGST_PER": 0,
          "CGST_AMOUNTFC": 0,
          "CGST_AMOUNTCC": 0,
          "SGST_PER": 0,
          "SGST_AMOUNTFC": 0,
          "SGST_AMOUNTCC": 0,
          "IGST_PER": 0,
          "IGST_AMOUNTFC": 0,
          "IGST_AMOUNTCC": 0,
          "CGST_ACCODE": "string",
          "SGST_ACCODE": "string",
          "IGST_ACCODE": "string",
          "GST_HEADER_AMOUNT": 0,
          "GST_NUMBER": "string",
          "INVOICE_NUMBER": "string",
          "INVOICE_DATE": "2023-10-10T11:05:50.756Z",
          "DT_GST_STATE_CODE": "st",
          "DT_GST_TYPE": "stri",
          "DT_GST_CODE": "string",
          "DT_GST_GROUP": "s",
          "CGST_CTRLACCODE": "string",
          "SGST_CTRLACCODE": "string",
          "IGST_CTRLACCODE": "string",
          "HSN_CODE": "string",
          "MIDPCR": 0,
          "INCLUSIVE": true,
          "COMM_PER": 0,
          "COMM_AMOUNTCC": 0,
          "COMM_AMOUNTFC": 0,
          "COMM_TAXPER": 0,
          "COMM_TAXAMOUNTCC": 0,
          "COMM_TAXAMOUNTFC": 0,
          "DT_TDS_CODE": "string",
          "TDS_PER": 0,
          "TDS_AMOUNTFC": 0,
          "TDS_AMOUNTCC": 0,
          "PDC_WALLETAC": "string",
          "WALLET_YN": "s",
          "SL_CODE": "string",
          "SL_DESCRIPTION": "string",
          "OT_TRANSFER_TIME": "string",
          "VAT_EXPENSE_CODE": "string",
          "VAT_EXPENSE_CODE_DESC": "string",
          "AMLVALIDID": "string",
          "AMLSOURCEOFFUNDS": "string",
          "AMLTRANSACTION_TYPE": "string"
        }
      ]
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                this.tableData = []
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
  deleteWorkerMaster() {

  }

  update() {


  }

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }


  // customer master add, view
  openCustMaster() {

    const modalRef: NgbModalRef = this.modalService.open(PosCustomerMasterComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      // windowClass: 'modal-full-width',
    });
    // modalRef.componentInstance.customerData = this.customerData;

    modalRef.result.then(
      (result) => {
        console.log( `Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );



  }

}
