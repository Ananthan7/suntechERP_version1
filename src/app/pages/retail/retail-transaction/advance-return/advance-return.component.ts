import { Component, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { PcrSelectionComponent } from "./pcr-selection/pcr-selection.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import Swal from "sweetalert2";
import { IndexedDbService } from "src/app/services/indexed-db.service";

@Component({
  selector: "app-advance-return",
  templateUrl: "./advance-return.component.html",
  styleUrls: ["./advance-return.component.scss"],
})
export class AdvanceReturnComponent implements OnInit {
  @Input() content!: any;
  branchCode?: String;
  yearMonth?: String;
  pcrSelectionData: any[] = [];
  vocMaxDate = new Date();
  currentDate = new Date();
  isCustomerRequired = false;
  dialogBox: any;
  isCurrencyUpdate: boolean = false;
  gridAmountDecimalFormat: any;
  companyCurrency?: String;
  viewOnly?: boolean=false;
  strBranchcode: any = localStorage.getItem('userbranch');
  baseYear: any = localStorage.getItem('YEAR') || '';
  midForInvoce: any = 0;

  columnhead: any[] = [
    { title: 'Sr #', field: 'SRNO' },
    { title: 'Branch', field: 'BRANCH_CODE' },
    { title: 'ACCODE', field: 'ACCODE' },
    { title: 'Type', field: 'RECPAY_TYPE' },
    { title: 'Cheque No', field: 'HDACCOUNT_HEAD' },
    { title: 'Cheque Date', field: 'CURRENCY_CODE' },
    { title: 'Bank', field: 'BANKCODE' },
    { title: 'Amount FC', field: 'AMOUNTFC' },
    { title: 'Amount LC', field: 'AMOUNTCC' },
    { title: 'Balance', field: 'SRNO' },
    { title: 'VAT %', field: 'CGST_PER' },
    { title: 'VAT Amount', field: 'CGST_AMOUNTCC' },
    { title: 'Total Amount', field: 'TOTAL_AMOUNTCC' },
    { title: 'COMM_TAX AMOUNT CC', field: 'COMM_TAXAMOUNTCC' },
    { title: 'COMM_TAX PER', field: 'COMM_TAXPER' },
    { title: 'COMM_AMOUNT CC', field: 'COMM_TAXAMOUNTCC' },
    { title: 'COMM_PER', field: 'COMM_PER' },

  ];



  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Party Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "Currency <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "POS Customer Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  advanceReturnForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [1],
    vocDate: [new Date()],
    partyCode: [""],
    partyCurrency: [""],
    partyCurrencyRate: [""],
    enteredBy: [""],
    enteredByCode: [""],
    partyRefNo: [""],
    date: [new Date()],
    baseCurrency: [""],
    baseCurrencyRate: [""],
    customerCode: [""],
    customerName: [""],
    advanceFromCustomers: [""],
    partyAddress: [""],
    partyAmount: [""],
    partyAmountRate: [""],
    narration: [""],
    total: [""],
    totalVat: [""],
  });

  private subscriptions: Subscription[] = [];


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private indexedDb: IndexedDbService,

  ) {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency
    };
    this.companyCurrency = this.comService.compCurrency;
   }

  ngOnInit(): void {

    this.getPartyCode();
    this.getFinancialYear();
    this.branchCode = this.comService.branchCode;
    this.advanceReturnForm.controls.vocType.setValue(this.comService.getqueryParamVocType())
    this.advanceReturnForm.controls.baseCurrency.setValue(this.comService.compCurrency);
    this.advanceReturnForm.controls.baseCurrencyRate.setValue(this.comService.getCurrRate(this.comService.compCurrency));

  }


  getPartyCode() {

    const API = `AdvanceReceiptParty/${this.strBranchcode}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          console.log('resp', resp.Accode);
          this.advanceReturnForm.controls.partyCode.setValue(resp.Accode);
          this.partyCodeChange({ target: { value: resp.Accode } });
        }
      });

  }

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

                this.advanceReturnForm.controls.partyCurrency.setValue(data[0].CURRENCY_CODE)
                this.advanceReturnForm.controls.partyCurrencyRate.setValue(data[0].CONV_RATE)
                this.advanceReturnForm.controls.partyAddress.setValue(data[0].ADDRESS)
                this.advanceReturnForm.controls.advanceFromCustomers.setValue(data[0].ACCOUNT_HEAD)
                
          

 
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

  openaddposdetails() {
    const modalRef: NgbModalRef = this.modalService.open(PcrSelectionComponent, {
      size: "lg",
      backdrop: true,
      keyboard: false,
      windowClass: "modal-full-width",
    });
    modalRef.componentInstance.customerCode = this.advanceReturnForm.value.customerCode;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedRows: any[]) => {
      // this.advanceReturnForm.value.partyCurrency 
      const existingMIDs = new Set(this.pcrSelectionData.map(data => data.MID));
      const newEntries: any = [];
      const duplicateMIDs: any = [];

      selectedRows.forEach(row => {
        if (existingMIDs.has(row.MID)) {
          duplicateMIDs.push(row.MID);
        } else {
          newEntries.push({ ...row, CURRENCY_CODE: this.advanceReturnForm.value.partyCurrency });
          // newEntries.push(row);
        }
      });

      if (duplicateMIDs.length > 0) {
        if (duplicateMIDs.length === selectedRows.length) {

          this.openDialog(
            'Warning',
            'PCR(s) already exist',
            true
          );
        } else {
          this.openDialog(
            'Warning',
            `PCR(s) with MID(s) ${duplicateMIDs.join(', ')} already exist. Only unique entries will be added.`,
            true
          );

          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.pcrSelectionData.push(...newEntries);
            }

          });

        }
      } else {
        this.pcrSelectionData.push(...newEntries);
      }
      console.log("this.pcrSelectionData", this.pcrSelectionData);

      this.pcrSelectionData.forEach((data, index) => (data.SRNO = index + 1));
      this.updateFormValuesAndSRNO();
    });

    modalRef.result.then((postData) => {
      if (postData) {
        console.log("Data from modal:", postData);
        this.pcrSelectionData.push(postData);

        this.pcrSelectionData.forEach((data, index) => (data.SRNO = index + 1));
      }
      this.updateFormValuesAndSRNO();
    });
    console.log("this.pcrSelectionData", this.pcrSelectionData);
   
  }


  enteredBySelected(e: any) {
    console.log(e);
    this.advanceReturnForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
    this.advanceReturnForm.controls.enteredByCode.setValue(e.DESCRIPTION);
  }


  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(
      DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  partyCodeSelected(e: any) {
    console.log(e);
    this.advanceReturnForm.controls.partyCode.setValue(e.ACCODE);
    this.partyCodeChange({ target: { value: e.ACCODE } })
  }


  partyCurrencyCodeSelected(e: any) {
    // console.log(e);
  }

  customerCodeSelected(e: any) {
    console.log(e);

    this.advanceReturnForm.controls.customerCode.setValue(e.CODE);
    this.advanceReturnForm.controls.customerName.setValue(e.NAME);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  updateFormValuesAndSRNO() {
    let sumCGST_AMOUNTCC = 0;
    let sumAMOUNTCC = 0;

    this.pcrSelectionData.forEach((data, index) => {
      // data.SRNO = index + 1;
      sumCGST_AMOUNTCC += parseFloat(data.CGST_AMOUNTCC);
      sumAMOUNTCC += parseFloat(data.AMOUNTCC);
    });

    let totalSum = sumCGST_AMOUNTCC + sumAMOUNTCC;

    this.advanceReturnForm.controls.totalVat.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(sumCGST_AMOUNTCC),
      'AMOUNT'
    ));
    this.advanceReturnForm.controls.total.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(totalSum),
      'AMOUNT'
    ));
    this.advanceReturnForm.controls.partyAmount.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(totalSum),
      'AMOUNT'
    ));
  }

  validateForm() {
    if (this.advanceReturnForm.invalid) {
      this.toastr.error('Select all required fields');
      return false;
    }

    if (this.isCustomerRequired && !this.advanceReturnForm.controls.customerCode.value) {
      this.toastr.error('Please fill customer details');
      return false;
    }

    return true;
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

  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear?VOCDATE=${this.comService.cDateFormat(this.advanceReturnForm.value.vocDate)}`;
    const res = await this.dataService.getDynamicAPI(API).toPromise()
    console.log(res);
    if (res.status == "Success") {
      this.yearMonth = res.BaseFinancialyear;
      console.log('BaseFinancialyear', res.BaseFinancialyear);

    }}

  formSubmit() {


    if (!this.validateForm()) {
      return;
    }


    let postData = {
      "MID": this.content?.MID || 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.advanceReturnForm.value.vocType,
      "VOCNO": this.advanceReturnForm.value.vocNo || 0,
      "VOCDATE": this.advanceReturnForm.value.vocDate,
      "VALUE_DATE": this.advanceReturnForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.advanceReturnForm.value.partyCode || "",
      "PARTY_CURRENCY": this.advanceReturnForm.value.partyCurrency || "",
      "PARTY_CURR_RATE": this.advanceReturnForm.value.partyCurrencyRate || "0",
      "TOTAL_AMOUNTFC": this.advanceReturnForm.value.partyAmount || 0,
      "TOTAL_AMOUNTCC": this.advanceReturnForm.value.partyAmount || 0,
      "REMARKS": this.advanceReturnForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-10T11:05:50.756Z",
      "NAVSEQNO": 0,
      "HAWALACOMMCODE": "",
      "HAWALACOMMPER": 0,
      "FLAG_UPDATED": "0",
      "FLAG_INPROCESS": "0",
      "SUPINVNO": "",
      "SUPINVDATE": this.advanceReturnForm.value.vocDate,
      "HHACCOUNT_HEAD": "",
      "SALESPERSON_CODE": this.advanceReturnForm.value.enteredby,
      "BALANCE_FC":this.advanceReturnForm.value.partyAmount || 0,
      "BALANCE_CC": this.advanceReturnForm.value.partyAmount || 0,
      "AUTHORIZEDPOSTING": true,
      "AUTOGENREF": "",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "POSCUSTOMERCODE": this.advanceReturnForm.value.customerCode || "",
      "D2DTRANSFER": "",
      "DRAFT_FLAG": "0",
      "POSSCHEMEID": "",
      "FLAG_EDIT_ALLOW": "",
      "PARTY_ADDRESS": this.advanceReturnForm.value.partyAddress,
      "AUTOPOSTING": true,
      "POSTDATE": this.advanceReturnForm.value.vocDate,
      "ADVRETURN": true,
      "HTUSERNAME":  this.comService.userName,
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
      "CUSTOMER_NAME": this.advanceReturnForm.value.customerName || "",
      "CUSTOMER_MOBILE": this.advanceReturnForm.value.mobile || "",
      "CUSTOMER_EMAIL": this.advanceReturnForm.value.email || "",
      "TDS_CODE": "",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "ADRRETURNREF": "",
      "SCH_SCHEME_CODE": this.advanceReturnForm.value.schemaCode || "",
      "SCH_CUSTOMER_ID": this.advanceReturnForm.value.schemaId || "",
      "REFDOCNO": "",
      "GIFT_CARDNO": "",
      "FROM_TOUCH": true,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "OT_TRANSFER_TIME": "2023-10-10T12:05:50.756Z",
      // "DUEDAYS": this.advanceReturnForm.value.dueDaysdesc || "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "WOOCOMCARDID": "",
      "currencyReceiptDetails": this.pcrSelectionData,
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
          this.midForInvoce = result.response.MID
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.advanceReturnForm.reset()
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

  printReceiptDetailsWeb() {
    let postData = {
      "MID": this.content ? this.comService.emptyToZero(this.content?.MID) : this.midForInvoce,
      "BRANCH_CODE": this.comService.nullToString(this.strBranchcode),
      "VOCNO": this.comService.emptyToZero(this.advanceReturnForm.value.vocNo),
      "VOCTYPE": this.comService.nullToString(this.comService.getqueryParamVocType()),
      "YEARMONTH": this.comService.nullToString(this.baseYear),
    }
    this.dataService.postDynamicAPI('GetAdvanceReceiptDetailsWeb', postData)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.dynamicData;
        var WindowPrt = window.open(' ', ' ', 'width=1024px, height=800px');
        if (WindowPrt === null) {
          console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
          return;
        }
        let printContent = `
                <html>
                <head>
                    <style>
                        @media print {
                            @page {
                                size: A4 portrait;
                                margin: 1cm;
                            }
                            body {
                                margin: 1cm;
                                box-sizing: border-box;
                            }
                            * {
                                box-sizing: border-box;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${data[0][0].HTMLOUT}
                </body>
                </html>
            `;
        WindowPrt.document.write(printContent);

        WindowPrt.document.close();
        WindowPrt.focus();

        setTimeout(() => {
          if (WindowPrt) {
            WindowPrt.print();
            WindowPrt.close();
          } else {
            console.error('Print window was closed before printing could occur.');
          }
        }, 800);
      });
  }


}
