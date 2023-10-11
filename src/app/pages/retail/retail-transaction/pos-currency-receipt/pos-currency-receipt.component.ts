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


@Component({
  selector: 'app-pos-currency-receipt',
  templateUrl: './pos-currency-receipt.component.html',
  styleUrls: ['./pos-currency-receipt.component.scss']
})
export class PosCurrencyReceiptComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  columnhead: any[] = ['Sr#','Branch','Mode','A/c Code','Account Head','Currency','Curr.Rate','VAT_E-','VAT_E-.'];
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  vocMaxDate = new Date();
  currentDate = new Date();

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  openaddposdetails() {
    const modalRef: NgbModalRef = this.modalService.open(PosCurrencyReceiptDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  posCurrencyReceiptForm: FormGroup = this.formBuilder.group({
    vocType : [''],
    vocNo : [''],
    vocDate : [''],
    partyCode : [''],
    partyCodeDesc : [''],  // No
    partyCurrency : [''],
    partyCurrencyDesc : [''],
    enteredby : [''], // No
    enteredbyuser : [''], // No
    dueDaysdesc : [''],
    dueDays : [''], // no
    customerCode : [''],
    customerCodeDesc : [''],
    moblie : [''],
    email : [''],
    partyAdress : [''],
    schemaCode : [''],
    schemaId : [''],
    partyAmount : [''],
    partyAmountLc : [''],
    narration : [''],
    totalTax : [''],
    total : ['']
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

    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.posCurrencyReceiptForm.value.vocType,
      "VOCNO": this.posCurrencyReceiptForm.value.vocNo,
      "VOCDATE": this.posCurrencyReceiptForm.value.vocDate,
      "VALUE_DATE": "2023-10-10T11:05:50.756Z",
      "YEARMONTH": "string",
      "PARTYCODE": this.posCurrencyReceiptForm.value.partyCode || "",
      "PARTY_CURRENCY": this.posCurrencyReceiptForm.value.partyCurrency || "",
      "PARTY_CURR_RATE": this.posCurrencyReceiptForm.value.partyCurrencyDesc || "",
      "TOTAL_AMOUNTFC": this.posCurrencyReceiptForm.value.partyAmount || "",
      "TOTAL_AMOUNTCC": this.posCurrencyReceiptForm.value.partyAmountLc || "",
      "REMARKS": this.posCurrencyReceiptForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-10T11:05:50.756Z",
      "NAVSEQNO": 0,
      "HAWALACOMMCODE": "string",
      "HAWALACOMMPER": 0,
      "FLAG_UPDATED": "s",
      "FLAG_INPROCESS": "s",
      "SUPINVNO": "string",
      "SUPINVDATE": "2023-10-10T11:05:50.756Z",
      "HHACCOUNT_HEAD": "string",
      "SALESPERSON_CODE": "string",
      "BALANCE_FC": 0,
      "BALANCE_CC": 0,
      "AUTHORIZEDPOSTING": true,
      "AUTOGENREF": "string",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "str",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "POSCUSTOMERCODE":  this.posCurrencyReceiptForm.value.customerCode || "",
      "D2DTRANSFER": "s",
      "DRAFT_FLAG": "string",
      "POSSCHEMEID": "string",
      "FLAG_EDIT_ALLOW": "s",
      "PARTY_ADDRESS": "string",
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "ADVRETURN": true,
      "HTUSERNAME": "string",
      "GENSEQNO": 0,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "st",
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "DOC_REF": "string",
      "REC_STATUS": "s",
      "CUSTOMER_NAME": this.posCurrencyReceiptForm.value.customerCodeDesc || "",
      "CUSTOMER_MOBILE": this.posCurrencyReceiptForm.value.moblie || "",
      "CUSTOMER_EMAIL": this.posCurrencyReceiptForm.value.email || "",
      "TDS_CODE": "string",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "ADRRETURNREF": "string",
      "SCH_SCHEME_CODE": this.posCurrencyReceiptForm.value.schemaCode || "",
      "SCH_CUSTOMER_ID": this.posCurrencyReceiptForm.value.schemaId || "",
      "REFDOCNO": "string",
      "GIFT_CARDNO": "string",
      "FROM_TOUCH": true,
      "SL_CODE": "string",
      "SL_DESCRIPTION": "string",
      "OT_TRANSFER_TIME": "string",
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

  update(){


  }

  /**USE: close modal window */
  close(data?: any) {
    // this.activeModal.close();
    this.activeModal.close(data);
  }
  ngOnInit(): void {
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'currency',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e:any){
    console.log(e);
    this.posCurrencyReceiptForm.controls.partyCode.setValue(e.CURRENCY_CODE);
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(e.DESCRIPTION);
  }

  userName = localStorage.getItem('username');
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  userDataSelected(data: any,value: any) {
    console.log(value);
    console.log(data);
   
    this.tableData[value.data.SRNO - 1].USER_CODE = data.UsersName;
    //this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }
}
