import { Component, Directive, Injectable, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from 'moment';


@Component({
  selector: "app-pos-currency-receipt-details",
  templateUrl: "./pos-currency-receipt-details.component.html",
  styleUrls: ["./pos-currency-receipt-details.component.scss"],
})


export class PosCurrencyReceiptDetailsComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  branchCode?: String;
  paymentModeList: any[] = [];
  dummyDate = '1900-01-01T00:00:00';


  selectedTabIndex = 0;


  debitAmountData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Debit Amount',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  modeOfData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 25,
    SEARCH_FIELD: 'Credit_Code',
    // SEARCH_HEADING: 'Mode Of',
    SEARCH_HEADING: 'Credit Card lookup',
    SEARCH_VALUE: '',
    WHERECONDITION: "Credit_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  // `CMBRANCH_CODE = '${this.comService.branchCode}'`


  posCurrencyReceiptDetailsForm: FormGroup = this.formBuilder.group({
    branch: [""],
    modeOfSelect: [""],
    modeCODE: [""], // Not Declaration 
    modeDesc: [""],
    debitAmount: [""],
    debitAmountDesc: [""],
    // debitAmountDate : [new Date()],
    currencyCode: [""],
    currencyRate: [""],
    amountFc: [""],
    amountCc: [""],
    creditCardNumber: [""],
    creditCardName: [""],
    creditCardDate: [new Date()],
    ttNumber: [""],
    ttDate: [""],
    ttDrawnBank: [""],
    ttDepositBank: [""],
    chequeNumber: [""],
    chequeDate: [new Date()],
    chequeDrawnBank: [""],
    chequeDepositBank: [""],
    remarks: [""],
    vatNo: [""],
    hsnCode: [""],
    invoiceNo: [""],
    invoiceDate: [new Date()],
    vat: [""],
    vatcc: [""],
    totalFc: [""],
    totalLc: [""],
    headerVatAmt: [""],

  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private comService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.paymentModeList = this.comService.getComboFilterByID('Payment Mode');
    console.log('paymentModeList :', this.paymentModeList);

    this.posCurrencyReceiptDetailsForm.controls.branch.setValue(this.branchCode);

    this.vatDetails();
  }

  vatDetails() {
    // if (event.target.value == '') return
    this.snackBar.open('Loading...')
    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let vatData = {
      "SPID": "013",
      "parameter": {
        // "BRANCH_CODE": this.branchCode,
        // 'strBranchCode': this.branchCode,
        'strBranchCode': '',
        'strAccode': "",
        'strVocType': '',
        'strDate': ''
      }
    };
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', vatData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.dynamicData.length > 0) {
          let data = result.dynamicData[0]
          console.log('vatData', data);
        }
      }
      )
  }

  debitAmountSelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(e.ACCODE);
    this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(e['ACCOUNT HEAD']);
    this.DebitamountChange({ target: { value: e.ACCODE } });
  }

  CurrencySelected(e: any) {
    console.log(e);
  }

  receiptModeSelected(e: any) {
    console.log(e);

    this.posCurrencyReceiptDetailsForm.controls.modeCODE.setValue(e.Credit_Code);
    this.posCurrencyReceiptDetailsForm.controls.modeDesc.setValue(e.Description);

  }

  //party Code Change
  DebitamountChange(event: any) {
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
              this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(data[0].CURRENCY_CODE)
              console.log(data[0].CURRENCY_CODE);
              this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(data[0].CONV_RATE)
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

  validateReceipt() {
    if ('this.selectedTabIndex == "TT"') {
      return this.posCurrencyReceiptDetailsForm.invalid;
    }
    else if ('this.selectedTabIndex == "Cheque"') {
      return this.posCurrencyReceiptDetailsForm.invalid;
    } else {
      return this.posCurrencyReceiptDetailsForm.invalid;
    }
  }


  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      // this.update()
      return;
    }
    if (this.posCurrencyReceiptDetailsForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }


    console.log(this.posCurrencyReceiptDetailsForm.value.vocDate);
    const res = this.validateReceipt();
    if (!res) {
      var CHEQUE_NO, CHEQUE_DATE, CHEQUE_BANK
      if (this.posCurrencyReceiptDetailsForm.value.modeOfSelect == 'TT') {
        CHEQUE_NO = this.posCurrencyReceiptDetailsForm.value.ttNumber;
        CHEQUE_DATE = this.posCurrencyReceiptDetailsForm.value.ttDate;
        CHEQUE_BANK = this.posCurrencyReceiptDetailsForm.value.ttDrawnBank;
      } else if (this.posCurrencyReceiptDetailsForm.value.modeOfSelect == 'Cheque') {
        CHEQUE_NO = this.posCurrencyReceiptDetailsForm.value.chequeNumber;
        CHEQUE_DATE = this.posCurrencyReceiptDetailsForm.value.chequeDate;
        CHEQUE_BANK = this.posCurrencyReceiptDetailsForm.value.chequeDrawnBank;
      }

      let postData = {
        "UNIQUEID": 0,
        "SRNO": 0,
        "BRANCH_CODE": this.branchCode,
        "RECPAY_TYPE": "",
        "MODE": this.posCurrencyReceiptDetailsForm.value.modeOfSelect,
        "ACCODE": this.posCurrencyReceiptDetailsForm.value.debitAmount,
        "CURRENCY_CODE": this.posCurrencyReceiptDetailsForm.value.currencyCode,
        "CURRENCY_RATE": this.posCurrencyReceiptDetailsForm.value.currencyRate,
        "AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.amountCc, // functionalities not started so assigned like this
        // "AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.amountFc,
        "AMOUNTCC": this.posCurrencyReceiptDetailsForm.value.amountCc,
        "HEADER_AMOUNT": 0,
        "CHEQUE_NO": CHEQUE_NO || "",
        "CHEQUE_DATE": CHEQUE_DATE || this.dummyDate,
        "CHEQUE_BANK": CHEQUE_BANK || "",
        "REMARKS": this.posCurrencyReceiptDetailsForm.value.remarks,
        "BANKCODE": "",
        "PDCYN": "s",
        "HDACCOUNT_HEAD": this.posCurrencyReceiptDetailsForm.value.debitAmountDesc,
        "MODEDESC": this.posCurrencyReceiptDetailsForm.value.modeDesc,
        "D_POSSCHEMEID": "",
        "D_POSSCHEMEUNITS": 0,
        "CARD_NO": this.posCurrencyReceiptDetailsForm.value.creditCardNumber,
        "CARD_HOLDER": this.posCurrencyReceiptDetailsForm.value.creditCardName,
        "CARD_EXPIRY": this.posCurrencyReceiptDetailsForm.value.creditCardDate || this.dummyDate,
        "PCRMID": 0,
        "BASE_CONV_RATE": 0,
        "SUBLEDJER_CODE": "",
        "DT_BRANCH_CODE": "",
        "DT_VOCTYPE": "",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "",
        "TOTAL_AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.totalLc || 0,
        // "TOTAL_AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.totalFc || 0,
        "TOTAL_AMOUNTCC": this.posCurrencyReceiptDetailsForm.value.totalLc || 0,
        "CGST_PER": 0,
        "CGST_AMOUNTFC": 0,
        "CGST_AMOUNTCC": 0,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": 0,
        "SGST_AMOUNTCC": 0,
        "IGST_PER": 0,
        "IGST_AMOUNTFC": 0,
        "IGST_AMOUNTCC": 0,
        "CGST_ACCODE": "",
        "SGST_ACCODE": "",
        "IGST_ACCODE": "",
        "GST_HEADER_AMOUNT": 0,
        "GST_NUMBER": "",
        "INVOICE_NUMBER": this.posCurrencyReceiptDetailsForm.value.invoiceNo,
        "INVOICE_DATE": this.posCurrencyReceiptDetailsForm.value.invoiceDate,
        "DT_GST_STATE_CODE": "",
        "DT_GST_TYPE": "",
        "DT_GST_CODE": "",
        "DT_GST_GROUP": "s",
        "CGST_CTRLACCODE": "",
        "SGST_CTRLACCODE": "",
        "IGST_CTRLACCODE": "",
        "HSN_CODE": "",
        "MIDPCR": 0,
        "INCLUSIVE": true,
        "COMM_PER": 0,
        "COMM_AMOUNTCC": 0,
        "COMM_AMOUNTFC": 0,
        "COMM_TAXPER": 0,
        "COMM_TAXAMOUNTCC": 0,
        "COMM_TAXAMOUNTFC": 0,
        "DT_TDS_CODE": "",
        "TDS_PER": 0,
        "TDS_AMOUNTFC": 0,
        "TDS_AMOUNTCC": 0,
        "PDC_WALLETAC": "",
        "WALLET_YN": "s",
        "SL_CODE": "",
        "SL_DESCRIPTION": "",
        "OT_TRANSFER_TIME": "",
        "VAT_EXPENSE_CODE": this.posCurrencyReceiptDetailsForm.value.vatNo,
        "VAT_EXPENSE_CODE_DESC": "",
        "AMLVALIDID": "",
        "AMLSOURCEOFFUNDS": "",
        "AMLTRANSACTION_TYPE": ""
      };

      this.close(postData);
    }

  }

  deleteWorkerMaster() {
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
        let API = 'AdvanceReceipt/DeleteAdvanceReceipt/' + this.content.WORKER_CODE
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
                    // this.workerMasterForm.reset()
                    this.tableData = []
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
                    // this.workerMasterForm.reset()
                    this.tableData = []
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

  changeAmountLc(event: any){

  }


  setMonthAndYear(normalizedMonthAndYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = normalizedMonthAndYear;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(ctrlValue);
    datepicker.close();
  }
  


  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }

}

