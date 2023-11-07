import { Component, Input, OnInit } from "@angular/core";
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
    SEARCH_HEADING: 'Mode Of',
    SEARCH_VALUE: '',
    WHERECONDITION: "Credit_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  cashReceiptForm: FormGroup = this.formBuilder.group({
    cashdebitAmount: [''],
    cashdebitAmountDesc: [''],
    cashDebitAmountDate: [''],
    cashcurrencyCode: [''],
    cashcurrencyRate: [''],
    cashAmountFc: [''],
    cashAmountLc: [''],
    cashRemarks: [''],
  });

  creditReceiptForm: FormGroup = this.formBuilder.group({
    creditCardNumber: [''],
    creditCardName: [''],
    creditCardDate: [''],
    creditCardAmount: [''],
    creditCardAmountDesc: [''],
    creditCardcurrencyCode: [''],
    creditCardcurrencyRate: [''],
    creditCardamountFc: [''],
    creditCardAmountLc: [''],
    creditCardRemarks: [''],
  });

  otherReceiptForm: FormGroup = this.formBuilder.group({
    otherdebitAmount: [''],
    otherdebitAmountDesc: [''],
    otherVocDate: [''],
    ttAmount: [''],
    ttAmountDesc: [''],
    otherCurrencyCode: [''],
    otherCurrencyRate: [''],
    otherAmountFc: [''],
    otherAmountLc: [''],
    otherRemarks: [''],
  });

  ttReceiptForm: FormGroup = this.formBuilder.group({
    ttNo: [''],
    ttDate: [''],
    ttDrawnBank: [''],
    ttDepositBank: [''],
    ttCurrencyCode: [''],
    ttCurrencyRate: [''],
    ttAmount: [''],
    ttAmountDesc: [''],
    ttAmountFc: [''],
    ttAmountLc: [''],
    ttRemarks: [''],
  });

  chequeReceiptForm: FormGroup = this.formBuilder.group({
    chequeNumber: [''],
    chequeDate: [''],
    chequeDrawnBank: [''],
    chequeDepositBank: [''],
    chequeCurrencyCode: [''],
    chequeCurrencyRate: [''],
    chequeAmount: [''],
    chequeAmountDesc: [''],
    chequeAmountFc: [''],
    chequeAmountLc: [''],
    chequeRemarks: [''],
  });

  posCurrencyReceiptDetailsForm: FormGroup = this.formBuilder.group({
    branch: [""],
    modeOfSelect: [""],
    modeCODE: [""], // Not Declaration 
    modeDesc: [""],
    vatno: [""],
    hsnCode: [""],
    invoiceNo: [""],
    invoiceDate: [""],
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
    if (this.selectedTabIndex == 0) {
       this.cashReceiptForm.controls.cashdebitAmount.setValue(e.ACCODE);
       this.cashReceiptForm.controls.cashdebitAmountDesc.setValue(e['ACCOUNT HEAD']);
    }
    else if (this.selectedTabIndex == 1) {
      this.creditReceiptForm.controls.creditCardAmount.setValue(e.ACCODE);
      this.creditReceiptForm.controls.creditCardAmountDesc.setValue(e['ACCOUNT HEAD']);
    }
    else if (this.selectedTabIndex == 2) {
      this.otherReceiptForm.controls.otherdebitAmount.setValue(e.ACCODE);
      this.otherReceiptForm.controls.otherdebitAmountDesc.setValue(e['ACCOUNT HEAD']);
  
    }
    else if (this.selectedTabIndex == 3) {
      this.ttReceiptForm.controls.ttAmount.setValue(e.ACCODE);
      this.ttReceiptForm.controls.ttAmountDesc.setValue(e['ACCOUNT HEAD']);
  
    }
    else if (this.selectedTabIndex == 4) {
       this.chequeReceiptForm.invalid;
    } else {
      //  this.posCurrencyReceiptDetailsForm.invalid;
    }
    

    this.DebitamountChange({ target: { value: e.ACCODE } });


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
              this.cashReceiptForm.controls.cashcurrencyCode.setValue(data[0].CURRENCY_CODE)
              console.log(data[0].CURRENCY_CODE);
              this.cashReceiptForm.controls.cashcurrencyRate.setValue(data[0].CONV_RATE)
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
    if (this.selectedTabIndex == 0) {
      return this.cashReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 1) {
      return this.creditReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 2) {
      return this.otherReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 3) {
      return this.ttReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 4) {
      return this.chequeReceiptForm.invalid;
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

    let API = "AdvanceReceipt/InsertAdvanceReceipt";
    console.log(this.posCurrencyReceiptDetailsForm.value.vocDate);
    const res = this.validateReceipt();
    if (!res) {
      var MODE, CURRENCYCODE, CURRENCYRATE, AMOUNTFC, AMOUNTLC, CHEQUENO, CHEQUEDATE, CHEQUEBANK, REMARKS,
        CARDNO, CARDHOLDER, CARDEXPIRY;
        MODE = this.posCurrencyReceiptDetailsForm.value.modeCODE;
      if (this.selectedTabIndex == 0) {
        CURRENCYCODE = this.cashReceiptForm.value.cashcurrencyCode;
        CURRENCYRATE = this.cashReceiptForm.value.cashcurrencyRate;
        AMOUNTFC = this.cashReceiptForm.value.cashAmountFc;
        AMOUNTLC = this.cashReceiptForm.value.cashAmountLc;
        REMARKS = this.cashReceiptForm.value.cashRemarks;
        CHEQUENO = 0;
        CHEQUEDATE = "";
        CHEQUEBANK = "";
        CARDNO = 0;
        CARDHOLDER = "";
        CARDEXPIRY = "";
      } else if (this.selectedTabIndex == 1) {
        CURRENCYCODE = this.creditReceiptForm.value.creditCardcurrencyCode;
        CURRENCYRATE = this.creditReceiptForm.value.creditCardcurrencyRate;
        AMOUNTFC = this.creditReceiptForm.value.creditCardamountFc;
        AMOUNTLC = this.creditReceiptForm.value.creditCardAmountLc;
        REMARKS = this.creditReceiptForm.value.creditCardRemarks;
        CHEQUENO = 0;
        CHEQUEDATE = "";
        CHEQUEBANK = "";
        CARDNO = this.creditReceiptForm.value.creditCardNumber;
        CARDHOLDER = this.creditReceiptForm.value.creditCardName;
        CARDEXPIRY = this.creditReceiptForm.value.creditCardDate;
      } else if (this.selectedTabIndex == 2) {
        CURRENCYCODE = this.otherReceiptForm.value.otherCurrencyCode;
        CURRENCYRATE = this.otherReceiptForm.value.otherCurrencyRate;
        AMOUNTFC = this.otherReceiptForm.value.otherAmountFc;
        AMOUNTLC = this.otherReceiptForm.value.otherAmountLc;
        REMARKS = this.otherReceiptForm.value.otherRemarks;
        CHEQUENO = 0;
        CHEQUEDATE = "";
        CHEQUEBANK = "";
        CARDNO = 0;
        CARDHOLDER = "";
        CARDEXPIRY = "";
      } else if (this.selectedTabIndex == 3) {
        CURRENCYCODE = this.ttReceiptForm.value.ttCurrencyCode;
        CURRENCYRATE = this.ttReceiptForm.value.ttCurrencyRate;
        AMOUNTFC = this.ttReceiptForm.value.ttAmountFc;
        AMOUNTLC = this.ttReceiptForm.value.ttAmountLc;
        REMARKS = this.ttReceiptForm.value.ttRemarks;
        CHEQUENO = 0;
        CHEQUEDATE = "";
        CHEQUEBANK = "";
        CARDNO = 0;
        CARDHOLDER = "";
        CARDEXPIRY = "";
      } else if (this.selectedTabIndex == 4) {
        CURRENCYCODE = this.chequeReceiptForm.value.chequeCurrencyCode;
        CURRENCYRATE = this.chequeReceiptForm.value.chequeCurrencyRate;
        AMOUNTFC = this.chequeReceiptForm.value.chequeAmountFc;
        AMOUNTLC = this.chequeReceiptForm.value.chequeAmountLc;
        REMARKS = this.chequeReceiptForm.value.chequeRemarks;
        CHEQUENO = this.chequeReceiptForm.value.chequeNumber;
        CHEQUEDATE = this.chequeReceiptForm.value.chequeDate;
        CHEQUEBANK = this.chequeReceiptForm.value.chequeDrawnBank; // Need To Discuss
        CARDNO = 0;
        CARDHOLDER = "";
        CARDEXPIRY = "";
      }



      let postData = {
        "UNIQUEID": 0,
        "SRNO": 0,
        "BRANCH_CODE": this.branchCode,
        "RECPAY_TYPE": "",
        "MODE": MODE,
        "ACCODE": this.posCurrencyReceiptDetailsForm.value.debitAmount,
        "CURRENCY_CODE": CURRENCYCODE,
        "CURRENCY_RATE": CURRENCYRATE || 0,
        "AMOUNTFC": AMOUNTFC,
        "AMOUNTCC": AMOUNTLC,
        "HEADER_AMOUNT": 0,
        "CHEQUE_NO": CHEQUENO,
        "CHEQUE_DATE": CHEQUEDATE,
        "CHEQUE_BANK": CHEQUEBANK,
        "REMARKS": REMARKS,
        "BANKCODE": "",
        "PDCYN": "s",
        "HDACCOUNT_HEAD": this.posCurrencyReceiptDetailsForm.value.debitAmountDesc,
        "MODEDESC": this.posCurrencyReceiptDetailsForm.value.modeDesc,
        "D_POSSCHEMEID": "",
        "D_POSSCHEMEUNITS": 0,
        "CARD_NO": CARDNO,
        "CARD_HOLDER": CARDHOLDER,
        "CARD_EXPIRY": CARDEXPIRY,
        "PCRMID": 0,
        "BASE_CONV_RATE": 0,
        "SUBLEDJER_CODE": "",
        "DT_BRANCH_CODE": "",
        "DT_VOCTYPE": "",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "",
        "TOTAL_AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.totalFc,
        "TOTAL_AMOUNTCC": this.posCurrencyReceiptDetailsForm.value.totalLc,
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
  deleteWorkerMaster() { }

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }
}
