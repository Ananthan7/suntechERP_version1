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

  debitAmountData: MasterSearchModel = {
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

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
   this.paymentModeList = this.comService.getComboFilterByID('Payment Mode');
   console.log('paymentModeList :' ,this.paymentModeList);
   
  }

  posCurrencyReceiptDetailsForm: FormGroup = this.formBuilder.group({
    branch: [""],
    modeOfSelect: [""],
    modeOfSearch: [""], // Not Declaration 
    modeDesc: [""],
    debitAmount: [""], // Not Declaration
    debitAmountDesc: [""],// Not Declaration
    currencyRate: [""],
    currencyCode: [""],
    amountFc: [""],
    amountCc: [""],
    remarks: [""],
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

  debitAmountSelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(e.ACCODE);
    this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(e['ACCOUNT HEAD']);
    this.DebitamountChange({ target: { value: e.ACCODE } })
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
                console.log('dataOne : ',data);
                              
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

    let postData = {
          "UNIQUEID": 0,
          "SRNO": 0,
          "BRANCH_CODE": this.branchCode,
          "RECPAY_TYPE": "",
          "MODE": this.posCurrencyReceiptDetailsForm.value.modeOfSelect,
          "ACCODE": "",
          "CURRENCY_CODE": this.posCurrencyReceiptDetailsForm.value.currencyCode,
          "CURRENCY_RATE": this.posCurrencyReceiptDetailsForm.value.currrencyRate,
          "AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.amountFc,
          "AMOUNTCC": this.posCurrencyReceiptDetailsForm.value.amountCc,
          "HEADER_AMOUNT": 0,
          "CHEQUE_NO": "",
          "CHEQUE_DATE": "2023-10-13T06:50:01.122Z",
          "CHEQUE_BANK": "",
          "REMARKS": this.posCurrencyReceiptDetailsForm.value.remarks,
          "BANKCODE": "",
          "PDCYN": "s",
          "HDACCOUNT_HEAD": "",
          "MODEDESC": this.posCurrencyReceiptDetailsForm.value.modeDesc,
          "D_POSSCHEMEID": "",
          "D_POSSCHEMEUNITS": 0,
          "CARD_NO": "",
          "CARD_HOLDER": "",
          "CARD_EXPIRY": "2023-10-13T06:50:01.122Z",
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
          "INVOICE_DATE":  this.posCurrencyReceiptDetailsForm.value.invoiceDate,
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

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.posCurrencyReceiptDetailsForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  deleteWorkerMaster() {}

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }
}
