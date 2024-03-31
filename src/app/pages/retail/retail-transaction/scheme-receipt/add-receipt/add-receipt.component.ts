import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent implements OnInit {
  @Input() content: any;
  @Output() newRowSaveClick = new EventEmitter();
  @Output() closebtnClick = new EventEmitter();
  branchArray: any[] = [];
  typeCodeArray: any[] = [];
  selectedTypeArray: any[] = [];
  isViewTypeCode: boolean = false;
  isViewCheckDetail: boolean = true;
  currencyRate: any;
  payTypeArray: any[] = [];
  gridDataSource: any[] = [];
  currencyCodeArr: any[] = [];
  schemeFlag: boolean = false;
  viewMode: boolean = false;
  disableAmountFC: boolean = false;
  dateFormat: any = this.commonService.allbranchMaster?.BDATEFORMAT
  Attachedfile: any[] = [];

  /**serach modal data */
  branchMasterData: any = {
    TABLE_NAME: 'BRANCH_MASTER',
    FILTER_FEILD_NAMES: {
    },
    API_FILTER_VALUE: 'BRANCH_CODE',
    DB_FIELD_VALUE: 'BRANCH_CODE',
    NAME_FIELD_VALUE: 'DESCRIPTION',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: "ACCODE,ACCOUNT_HEAD",
    SEARCH_HEADING: "Account Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  creditMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 25,
    SEARCH_FIELD: "CREDIT_CODE",
    SEARCH_HEADING: "Credit Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "MODE = 1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  /**form group data */
  receiptEntryForm: FormGroup = this.formBuilder.group({
    Branch: [''],
    AC_Code: ['', [Validators.required]],
    AC_Description: [''],
    Type: [null],
    TypeCode: ['',],
    TypeCodeDESC: ['',],
    CurrCode: [''],
    CurrRate: [''],
    TRN_No: ['',],
    TRN_Inv: ['',],
    TRN_Inv_Date: [''],
    TRN_Ref: ['',],
    Exp: ['',],
    HSN_AC: [''],
    Amount_FC: ['', [Validators.required]],
    Amount_LC: ['', [Validators.required]],
    Header_Amount: ['', [Validators.required]],
    TRN_Per: ['', [Validators.required]],
    TRN_Amount_FC: [''],
    TRN_Amount_LC: [''],
    AmountWithTRN: [''],
    HeaderAmountWithTRN: [''],
    ValidId: ['',],
    SourceofFunds: ['',],
    TransactionType: ['',],
    Narration: ['',],
    SRNO: [0],
    SchemeCode: [''],
    SchemeId: [''],
    SchemeBalance: [0],
    SchemeTotalAmount: [''],
    InstallmentAmount: [''],
    ChequeNumber: [''],
    ChequeDate: [''],
    DrawnBank: [''],
    DepBank: [''],
    IGST_ACCODE: [''],
    CGST_ACCODE: [''],
    SGST_ACCODE: [''],
    GST_GROUP: [''],
    POS_TAX_CRACCODE: [''],
    MIN_CONV_RATE: [''],
    MAX_CONV_RATE: [''],
    CONV_RATE: [''],
    paidBalance: [0],
  })
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private activeModal: NgbActiveModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {

  }

  ngOnInit(): void {
    this.getPaymentType('Cash')
    this.getCreditCardMaster()
    this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
    this.receiptEntryForm.controls.ChequeDate.setValue(this.commonService.currentDate)
    console.log(this.content);
    
    if (this.content && this.content.FLAG == 'VIEW') {
      this.viewMode = true
      this.setInitialValues()
      return
    }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.setvaluesEdited()
      this.viewMode = true
      return
    }
    this.setFormValues()
    this.paymentTypeChange({ ENGLISH: 'Cash' })
  }
  setvaluesEdited(){
    this.receiptEntryForm.controls.SchemeCode.setValue(this.content.SchemeCode)
    this.receiptEntryForm.controls.SchemeId.setValue(this.content.SchemeID)
    this.receiptEntryForm.controls.AC_Code.setValue(this.content.AC_Code)
    this.receiptEntryForm.controls.AC_Description.setValue(this.content.AC_Description)
    this.receiptEntryForm.controls.Type.setValue(this.content.Type)
    this.receiptEntryForm.controls.CurrCode.setValue(this.content.CurrCode)
    this.receiptEntryForm.controls.CurrRate.setValue(this.content.CurrRate)
    this.receiptEntryForm.controls.TRN_Per.setValue(this.content.TRN_Per)
    this.receiptEntryForm.controls.Narration.setValue(this.content.Narration)
    this.setFormControlAmount('InstallmentAmount', this.content.InstallmentAmount)
    this.setFormControlAmount('Header_Amount', this.content.Header_Amount)
    this.setFormControlAmount('Amount_LC', this.content.Amount_LC)
    this.setFormControlAmount('Amount_FC', this.content.Amount_FC)
    this.setFormControlAmount('SchemeTotalAmount', this.content.SchemeTotalAmount)
  }

  setFormValues() {
    this.receiptEntryForm.controls.SchemeCode.setValue(this.content.SchemeCode)
    this.receiptEntryForm.controls.SchemeId.setValue(this.content.SchemeID)
    this.setFormControlAmount('InstallmentAmount', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlAmount('Header_Amount', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlAmount('Amount_LC', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlAmount('Amount_FC', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlAmount('SchemeTotalAmount', this.content.SCHEME_AMOUNT)
    this.setGridData()
  }

  setInitialValues() {
    console.log(this.content, 'this.content');
    let data: any = this.content || {}
    this.getPaymentType(data.RECPAY_TYPE)
    this.getSchemeDetailView()
    this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
    this.receiptEntryForm.controls.AC_Code.setValue(data.CurrCode)
    this.receiptEntryForm.controls.AC_Description.setValue(data.AC_Description)
    this.receiptEntryForm.controls.CurrRate.setValue(
      this.commonService.decimalQuantityFormat(data.CurrRate, 'RATE'))
    this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE || data.CurrCode)
    this.setFormControlAmount('Amount_FC', data.TOTAL_AMOUNTFC)
    this.setFormControlAmount('Amount_LC', data.TOTAL_AMOUNTCC)
    this.setFormControlAmount('Header_Amount', data.TOTAL_AMOUNTCC)
    this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER || data.TRN_Per)
    this.receiptEntryForm.controls.SchemeId.setValue(data.D_POSSCHEMEID)
    this.receiptEntryForm.controls.SchemeCode.setValue(data.POSCUSTOMERCODE)
    this.receiptEntryForm.controls.SchemeBalance.setValue(data.BALANCE_CC)
    this.openAttchments()
  }
  getSchemeDetailView() {
    let param = {
      SCH_CUSTOMER_CODE: this.content.POSCUSTOMERCODE || '',
      SCH_CUSTOMER_ID: this.content.D_POSSCHEMEID || '',
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('SchemeReceipt/GetSchemeDetails', param)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.gridDataSource = result.dynamicData[0]
          this.gridDataSource.forEach((item: any) => {
            item.PAY_AMOUNT_FC = this.commonService.decimalQuantityFormat(item.PAY_AMOUNT_FC, 'AMOUNT')
            item.PAY_AMOUNT_CC = this.commonService.decimalQuantityFormat(item.PAY_AMOUNT_CC, 'AMOUNT')
            item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTFC, 'AMOUNT')
            item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTCC, 'AMOUNT')
          })
          this.receiptEntryForm.controls.InstallmentAmount.setValue(this.gridDataSource[0].PAY_AMOUNT_CC)
          this.gridDataSource.sort((a: any, b: any) => a.SRNO - b.SRNO)
        } else {
          this.viewMode = true;
          this.commonService.toastErrorByMsgId('grid data not found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  setGridData() {
    let param = {
      SCH_CUSTOMER_CODE: this.content.SCH_CUSTOMER_CODE || '',
      SCH_CUSTOMER_ID: this.content.SchemeID || '',
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('SchemeReceipt/GetSchemeReceipts', param)
      .subscribe((result) => {
        if (result.status == "Success") {
          let totaAMounts = result.dynamicData[0]
          this.receiptEntryForm.controls.InstallmentAmount.setValue(totaAMounts[0].PAY_AMOUNT_CC)
          this.gridDataSource = result.dynamicData[1]
          this.receiptEntryForm.controls.paidBalance.setValue(
            this.commonService.emptyToZero(this.gridDataSource[0].RCVD_AMOUNTCC)
          )
          this.gridDataSource.forEach((item: any) => {
            item.PAY_AMOUNT_FC = this.commonService.decimalQuantityFormat(item.PAY_AMOUNT_FC, 'AMOUNT')
            item.PAY_AMOUNT_CC = this.commonService.decimalQuantityFormat(item.PAY_AMOUNT_CC, 'AMOUNT')
            item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTFC, 'AMOUNT')
            item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTCC, 'AMOUNT')
          })
          this.gridDataSource.sort((a: any, b: any) => a.SRNO - b.SRNO)
          this.calculateGridAmount(1)
        } else {
          this.disableAmountFC = true;
          this.viewMode = true;
          this.commonService.toastErrorByMsgId('grid data not found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  onFileChange(input: any) {
    if (input.target.files.length > 0) {
      const file: File = input.target.files[0];
      for (let x = 0; x < input.target.files.length; x++) {
        this.Attachedfile.push(file);
        // this.formdata.append("Images[" + x + "].Image.File", file);
      }
    }
  }
  //selected Branch from search
  selectedBranch(data: any) {
    this.receiptEntryForm.controls.Branch.setValue(data.BRANCH_CODE)
    if (data.CASH_ACCODE) {
      // this.receiptEntryForm.controls.AC_Code.setValue(data.CASH_ACCODE)
      this.getAccountMaster(data.CASH_ACCODE)
    }
  }
  selectedAcCode(data: any) {
    if (data.accode) {
      this.receiptEntryForm.controls.AC_Code.setValue(data.accode)
      this.receiptEntryForm.controls.AC_Description.setValue(data.account_head)
      this.getAccountMaster(data.accode)
      if (data.BANK_CODE) this.receiptEntryForm.controls.DepBank.setValue(data.BANK_CODE)
    }
    if (data.ACCODE) {
      this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE)
      this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD)
      this.getAccountMaster(data.ACCODE)
    }
    if (data.CURRENCY_CODE) {
      this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE)
    }
  }
  creditCardSelect(data: any) {
    this.receiptEntryForm.controls.TypeCode.setValue(data.Credit_Code)
    this.receiptEntryForm.controls.TypeCodeDESC.setValue(data.Description)
    this.changeTypeCode(data.Credit_Code)
  }
  //party Code Change
  branchChange(event: any) {
    let branch = event.target.value
    event.target.value = branch.toUpperCase()
    let data = this.branchArray.filter((item: any) => item.BRANCH_CODE == event.target.value)

    if (data.length > 0) {
      this.receiptEntryForm.controls.Branch.setValue(data[0].BRANCH_CODE)

    } else {
      this.commonService.toastErrorByMsgId('Branch not found!');
      this.receiptEntryForm.value.Branch.setValue('')
    }
  }
  //use: form submit
  onSubmit() {
    let formValue = this.receiptEntryForm.value
    if (formValue.Type == 'Cheque' && formValue.ChequeDate == '') {
      this.commonService.toastErrorByMsgId('Cheque Date Required')
      return
    }
    if (formValue.Type == 'Cheque' && formValue.ChequeNumber == '') {
      this.commonService.toastErrorByMsgId('Cheque Number Required')
      return
    }
    if (formValue.Type == 'Cheque' && formValue.DrawnBank == '') {
      this.commonService.toastErrorByMsgId('Drawn Bank Not Added')
    }
    if (Number(formValue.Amount_FC) == 0 || Number(formValue.Amount_LC) == 0) {
      this.commonService.toastErrorByMsgId('Amount cannot be zero')
      return
    }
    if (formValue.TRN_Per == '') {
      this.commonService.toastErrorByMsgId('tax details loading')
      return
    }
    if (formValue.AC_Code == '') {
      this.commonService.toastErrorByMsgId('A/C Code Required')
      return
    }
    if (this.receiptEntryForm.invalid) {
      this.commonService.toastErrorByMsgId('select all required details!');
      return;
    } else {
      let Details = this.receiptEntryForm.value
      Details.Attachedfile = this.Attachedfile
      Details.GRID_DATA = this.gridDataSource
      this.close(Details)
    }
  }

  //USE: get currency master min max rate
  getCurrencyMasterDetail() {
    this.commonService.toastInfoByMsgId('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(`CurrencyMaster/GetCurrencyMasterDetail/${this.receiptEntryForm.value.CurrCode}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.receiptEntryForm.controls.MIN_CONV_RATE.setValue(data.MIN_CONV_RATE)
          this.receiptEntryForm.controls.MAX_CONV_RATE.setValue(data.MAX_CONV_RATE)
          this.receiptEntryForm.controls.CONV_RATE.setValue(data.CONV_RATE)
        } else {
          this.disableAmountFC = true
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //Account master
  getAccountMaster(accountCode: string) {
    this.commonService.toastInfoByMsgId('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(`AccountMaster/${accountCode}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (this.receiptEntryForm.value.CurrCode == '') {
            //   console.log(data.CURRENCY_CODE);
            this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
          }
          if (this.receiptEntryForm.value.CurrCode == this.commonService.compCurrency) {
            this.disableAmountFC = true
          } else {
            this.disableAmountFC = false
            this.setFormControlAmount('Amount_LC', 0)
            this.setFormControlAmount('Amount_FC', 0)
            this.setFormControlAmount('Header_Amount', 0)
            this.gridDataSource.forEach((item: any, index: any) => {
              if (index != 0) {
                item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(0, 'AMOUNT')
                item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(0, 'AMOUNT')
              } else {
                item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(this.receiptEntryForm.value.paidBalance, 'AMOUNT')
                item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(this.receiptEntryForm.value.paidBalance, 'AMOUNT')
              }
            })
          }
          this.currencyCodeChange(this.receiptEntryForm.value.CurrCode);

        } else {
          this.commonService.toastErrorByMsgId('PartyCode not found in credit master')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //Account master change funtion
  accountMasterChanged(event: any) {
    let API = 'Scheme/AccountMaster?ACCODE='
    let Sub: Subscription = this.dataService.getDynamicAPI(API + event.target.value)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE);
          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (data.CURRENCY_CODE) {
            this.currencyCodeArr = []
            this.currencyCodeArr.push({CURRENCY_CODE: data.CURRENCY_CODE})
            this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
            this.currencyCodeChange(data.CURRENCY_CODE);
          } else {
            this.commonService.toastErrorByMsgId('Account Code not found')
            this.receiptEntryForm.controls.AC_Code.setValue('');
            this.receiptEntryForm.controls.AC_Description.setValue('');
          }
        } else {
          this.commonService.toastErrorByMsgId('Account Code not found')
          this.receiptEntryForm.controls.AC_Code.setValue('');
          this.receiptEntryForm.controls.AC_Description.setValue('');
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //USE: to get HSN and VAT and calculations
  getTaxDetails() {
    let accountCode = this.content.PartyCode
    if (!accountCode) {
      this.commonService.toastErrorByMsgId('Party Code Not Found')
      return
    }
    let param = {
      Accode: accountCode,
      strdate: this.commonService.formatDate(new Date()),
      branch_code: this.commonService.branchCode,
      mainvoctype: this.commonService.getqueryParamMainVocType()
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(`TaxDetails`, param)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_SAC_CODE);
          this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER);
          this.receiptEntryForm.controls.IGST_ACCODE.setValue(data.IGST_ACCODE);
          this.receiptEntryForm.controls.SGST_ACCODE.setValue(data.SGST_ACCODE);
          this.receiptEntryForm.controls.CGST_ACCODE.setValue(data.CGST_ACCODE);
          this.receiptEntryForm.controls.GST_GROUP.setValue(data.GST_GROUP);
          this.receiptEntryForm.controls.POS_TAX_CRACCODE.setValue(data.POS_TAX_CRACCODE);

          this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(this.content.SCHEME_AMOUNT)
          this.receiptEntryForm.controls.AmountWithTRN.setValue(this.content.SCHEME_AMOUNT)
          // this.calculateGridAmount()
        } else {
          this.commonService.toastErrorByMsgId('Accode not found in credit master')
        }
      }, err => this.commonService.toastErrorByMsgId(err))
    this.subscriptions.push(Sub)
  }

  private calculateVAT(VAT: number, AMOUNT: number): number {
    return (AMOUNT / (100 + VAT)) * 100
  }
  setFormControlAmount(controlName: string, amount: any) {
    amount = this.commonService.emptyToZero(amount)
    amount = this.commonService.decimalQuantityFormat(amount, 'AMOUNT')
    this.receiptEntryForm.controls[controlName].setValue(
      this.commonService.commaSeperation(amount)
    )
  }
  //use: currency rate change fn
  currencyRateChange(event: any) {
    let form = this.receiptEntryForm.value
    if (this.commonService.emptyToZero(event.target.value) < this.commonService.emptyToZero(form.MIN_CONV_RATE)) {
      this.commonService.toastErrorByMsgId('Rate should not be less than ' + form.MIN_CONV_RATE)
      this.receiptEntryForm.controls.CurrRate.setValue(
        this.commonService.decimalQuantityFormat(form.MIN_CONV_RATE, 'RATE')
      )
    } else if (this.commonService.emptyToZero(event.target.value) > this.commonService.emptyToZero(form.MAX_CONV_RATE)) {
      this.commonService.toastErrorByMsgId('Rate should not be greater than ' + form.MAX_CONV_RATE)
      this.receiptEntryForm.controls.CurrRate.setValue(
        this.commonService.decimalQuantityFormat(form.MAX_CONV_RATE, 'RATE')
      )
    } else {
      this.receiptEntryForm.controls.CurrRate.setValue(
        this.commonService.decimalQuantityFormat(event.target.value, 'RATE')
      )
    }
    // this.setFormControlAmount('Header_Amount', this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    // this.setFormControlAmount('Amount_LC', this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    // this.setFormControlAmount('Amount_FC', this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

    let amount = this.commonService.emptyToZero(form.Amount_FC) * this.commonService.emptyToZero(form.CurrRate)
    this.setFormControlAmount('Amount_LC', amount)
    this.setFormControlAmount('Header_Amount', amount)
    this.setFormControlAmount('Amount_FC', form.Amount_FC)
    if (this.gridDataSource.length > 0) {
      this.calculateGridAmount()
    } else {
      this.setGridData()
    }
  }
  /**use: amount lc change fn to calculate amounts */
  calculateAmountLC() {
    let form = this.receiptEntryForm.value
    if (this.commonService.emptyToZero(form.SchemeBalance) == 0) {
      this.commonService.toastErrorByMsgId('Scheme Balance is ' + form.SchemeBalance)
      return
    }
    if (this.commonService.emptyToZero(form.SchemeBalance) < this.commonService.emptyToZero(form.Amount_LC)) {
      this.setFormControlAmount('Amount_LC', 0)
      this.setFormControlAmount('Amount_FC', 0)
      this.setFormControlAmount('Header_Amount', 0)
      this.commonService.toastErrorByMsgId('Allocating Amount cannot allow more than Scheme Balance ' + form.SchemeBalance)
      return
    }

    if (this.commonService.emptyToZero(form.Amount_FC) > 0 && form.CurrCode != this.commonService.compCurrency) {
      let currencyRate = this.commonService.emptyToZero(form.Amount_LC) / this.commonService.emptyToZero(form.Amount_FC)
      if (currencyRate > form.MAX_CONV_RATE) {
        // this.commonService.toastErrorByMsgId('Currency Rate cannot be more than ' + form.MAX_CONV_RATE)
        this.receiptEntryForm.controls.CurrRate.setValue(
          this.commonService.decimalQuantityFormat(form.CONV_RATE, 'RATE')
        )
        let amount = this.commonService.emptyToZero(form.Amount_LC) / this.commonService.emptyToZero(form.CurrRate)
        this.setFormControlAmount('Amount_FC', amount.toFixed(2))
      } else if (currencyRate < form.MIN_CONV_RATE) {
        this.commonService.toastErrorByMsgId('Currency Rate cannot be less than ' + form.MIN_CONV_RATE)
        this.receiptEntryForm.controls.CurrRate.setValue(
          this.commonService.decimalQuantityFormat(form.CONV_RATE, 'RATE')
        )
        let amount = this.commonService.emptyToZero(form.Amount_LC) / this.commonService.emptyToZero(form.CurrRate)
        this.setFormControlAmount('Amount_FC', amount.toFixed(2))
      } else {
        this.receiptEntryForm.controls.CurrRate.setValue(
          this.commonService.decimalQuantityFormat(currencyRate, 'RATE')
        )
      }
    } else {
      let amount = this.commonService.emptyToZero(form.Amount_LC) / this.commonService.emptyToZero(form.CurrRate)
      this.setFormControlAmount('Amount_FC', amount.toFixed(2))
    }
    this.setFormControlAmount('Amount_LC', form.Amount_LC)
    this.setFormControlAmount('Header_Amount', form.Amount_LC)
    if (this.gridDataSource.length > 0) {
      this.calculateGridAmount()
    } else {
      this.setGridData()
    }
  }
  calculateAmountFC() {
    let form = this.receiptEntryForm.value
    if (this.commonService.emptyToZero(form.SchemeBalance) == 0) {
      this.commonService.toastErrorByMsgId('Scheme Balance is' + form.SchemeBalance)
      return
    }
    if (this.commonService.emptyToZero(form.SchemeBalance) < this.commonService.emptyToZero(form.Amount_FC)) {
      this.commonService.toastErrorByMsgId('Allocating Amount cannot allow more than Scheme Balance ' + form.SchemeBalance)
      this.setFormControlAmount('Amount_LC', 0)
      this.setFormControlAmount('Amount_FC', 0)
      this.setFormControlAmount('Header_Amount', 0)
      return
    }
    let amount = this.commonService.emptyToZero(form.Amount_FC) * this.commonService.emptyToZero(form.CurrRate)
    this.setFormControlAmount('Amount_LC', amount)
    this.setFormControlAmount('Header_Amount', amount)
    this.setFormControlAmount('Amount_FC', form.Amount_FC)
    if (this.gridDataSource.length > 0) {
      this.calculateGridAmount()
    } else {
      this.setGridData()
    }
  }
  extraBalance: number = 0
  /**calculate amount and split to rows in grid*/
  calculateGridAmount(MODE?: number) {
    let formData = this.receiptEntryForm.value
    let Amount_LC = this.commonService.emptyToZero(formData.Amount_LC)
    let Amount_FC = this.commonService.emptyToZero(formData.Amount_FC)
    let Header_Amount = this.commonService.emptyToZero(formData.Header_Amount)
    let InstallmentAmount = this.commonService.emptyToZero(formData.InstallmentAmount)

    let payAmountSum: number = 0
    // calculating total scheme balancesetFormControlAmount
    this.gridDataSource.forEach((item: any, index: any) => {
      payAmountSum += parseInt(item.PAY_AMOUNT_FC)
      if (index != 0) {
        item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(0, 'AMOUNT')
        item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(0, 'AMOUNT')
      }
    })
    this.setFormControlAmount('SchemeBalance', payAmountSum)
    //checking given amount is more that scheme balance
    if (Header_Amount > payAmountSum) {
      this.commonService.toastErrorByMsgId('Allocating Header Amount cannot allow more than ' + formData.SchemeBalance)
      this.setFormControlAmount('Amount_LC', 0)
      this.setFormControlAmount('Amount_FC', 0)
      this.setFormControlAmount('Header_Amount', 0)
      return
    }

    let totalSpiltAmtLC = formData.paidBalance + Amount_LC
    let totalSpiltAmtFC = formData.paidBalance + Amount_FC
    // fn to calculate and split amount to rows
    let FixedArrLC = this.distributeAmounts(this.gridDataSource.length, InstallmentAmount, totalSpiltAmtLC)
    let FixedArrFC = this.distributeAmounts(this.gridDataSource.length, InstallmentAmount, totalSpiltAmtFC)
    console.log(this.commonService.compCurrency, formData.CurrCode,'curr');
    
    this.gridDataSource.forEach((item: any, index: number) => {
      item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(FixedArrFC[index].AMOUNT, 'AMOUNT')
      item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(FixedArrLC[index].AMOUNT, 'AMOUNT')
    })
    this.setNarrationString() //narration add
  }

  distributeAmounts(totalObjects: number, maxAmount: number, inputAmount: number): any[] {
    const objects: any[] = [];

    let remainingAmount = inputAmount;
    for (let i = 1; i <= totalObjects; i++) {
      let currentAmount = Math.min(maxAmount, remainingAmount);
      if (currentAmount > 0) {
        objects.push({ ID: i, AMOUNT: currentAmount });
        remainingAmount -= currentAmount;
      } else {
        objects.push({ ID: i, AMOUNT: 0 });
      }
    }

    return objects;
  }


  setNarrationString() {
    let narrationStr: string = ''
    this.gridDataSource.forEach((item: any, index: any) => {
      if (Number(item.RCVD_AMOUNTFC) != 0) {
        narrationStr += `${item.PAY_DATE} : ${item.RCVD_AMOUNTFC} #`
      }
    })
    this.receiptEntryForm.controls.Narration.setValue(narrationStr)
  }
  getPDCAccount(event: any) {
    const selectedDate = event.value;
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      let param = {
        strAccode: this.receiptEntryForm.value.AC_Code
      }
      let Sub: Subscription = this.dataService.getDynamicAPIwithParams('AccountMaster/GetPDCAccount', param).subscribe(
        (result) => {
          if (result.response) {
            let data = result.response;
            this.receiptEntryForm.controls.AC_Code.setValue(data.PDC_ISSUEAC)
            this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD)
          }
        },
        (err) => this.commonService.toastErrorByMsgId("Server Error")
      );
      this.subscriptions.push(Sub);
    }
  }
  //currency Code Change
  currencyCodeChange(value: string) {
    if (value == '') return
    let API = `CurrencyMaster/GetCurrencyMasterDetail/${value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          if (data.CONV_RATE) {
            this.receiptEntryForm.controls.CurrRate.setValue(
              this.commonService.decimalQuantityFormat(data.CONV_RATE, 'RATE')
            )
            // this.calculateAmountFC()
            this.getTaxDetails()
            this.getCurrencyMasterDetail()
            this.currencyRate = data.CONV_RATE
          }
        } else {
          this.commonService.toastErrorByMsgId('Currency rate not Found')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('Currency rate not Found')
      })
    this.subscriptions.push(Sub)
  }
  /**USE: get CreditCardMaster */
  getCreditCardMaster() {
    let Sub: Subscription = this.dataService.getDynamicAPI('CreditCardMaster/GetCreditCardMaster')
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.typeCodeArray = data.filter((value: any) => value.MODE == 1)
        } else {
          this.commonService.toastErrorByMsgId('Currency rate not Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  changeTypeCode(event: any) {
    this.selectedTypeArray = this.typeCodeArray.filter((item: any) => item.CREDIT_CODE == event)
    this.receiptEntryForm.controls.TypeCodeDESC.setValue(this.selectedTypeArray[0].DESCRIPTION)
    this.receiptEntryForm.controls.AC_Code.setValue(this.selectedTypeArray[0].ACCODE)

    if (this.selectedTypeArray[0].ACCODE != "") {
      this.getAccountMaster(this.selectedTypeArray[0].ACCODE)
    }
  }
  /**USE:  get PaymentType*/
  getPaymentType(value: string) {
    // let Sub: Subscription = this.dataService.getDynamicAPI('ComboFilter')
    //   .subscribe((result: any) => {
    //     if (result.response) {
    //       let data = result.response
    // this.payTypeArray = data.filter((value: any) => value.COMBO_TYPE == 'Receipt Mode')

    this.payTypeArray = [
      { ENGLISH: 'Cash' },
      { ENGLISH: 'Credit Card' },
      { ENGLISH: 'Cheque' },
      { ENGLISH: 'TT' },
      { ENGLISH: 'Others' },
      // { ENGLISH: 'VAT' },
    ]
    this.receiptEntryForm.controls.Type.setValue(value)
    //     } else {
    //       this.commonService.toastErrorByMsgId('Receipt Mode not found')
    //     }
    //   }, (err: any) => alert(err))
    // this.subscriptions.push(Sub)
  }
  //type change
  paymentTypeChange(event: any) {
    this.accountMasterData.LOOKUPID = 152;
    this.accountMasterData.SEARCH_FIELD = 'ACCODE';
    this.accountMasterData.API_VALUE = ""
    this.accountMasterData.WHERECONDITION = "ACCODE<>''"
    this.accountMasterData.VIEW_INPUT = true;
    this.isViewCheckDetail = true;
    this.isViewTypeCode = true;
    this.receiptEntryForm.controls.AC_Code.setValue('');
    this.receiptEntryForm.controls.AC_Description.setValue('');
    this.receiptEntryForm.controls.TypeCode.setValue(null);
    this.receiptEntryForm.controls.TypeCodeDESC.setValue('');
    this.receiptEntryForm.controls.ChequeNumber.setValue('');
    this.receiptEntryForm.controls.DrawnBank.setValue('');
    this.receiptEntryForm.controls.DepBank.setValue('');
    this.receiptEntryForm.controls.ChequeDate.setValue(this.commonService.currentDate);
    if (event.ENGLISH == 'Credit Card') {
      this.receiptEntryForm.controls.AC_Code.setValue('');
      this.receiptEntryForm.controls.AC_Description.setValue('');
    } else if (event.ENGLISH == 'Cash') {
      this.isViewTypeCode = false;
      this.receiptEntryForm.controls.TypeCode.setValue(null);
      this.receiptEntryForm.controls.TypeCodeDESC.setValue('');
      this.accountMasterData.LOAD_ONCLICK = true;
      this.accountMasterData.PAGENO = 1;
      this.accountMasterData.SEARCH_FIELD = 'ACCODE,ACCOUNT_HEAD,CURRENCY_CODE';
      this.accountMasterData.VIEW_INPUT = false;
      this.accountMasterData.API_VALUE = 'SchemeReceipt/GetCashAccode/' + this.commonService.branchCode
      this.getBranchMasterList()
    } else if (event.ENGLISH == 'Cheque') {
      this.accountMasterData.LOOKUPID = 70;
      this.isViewCheckDetail = false;
      this.isViewTypeCode = false;
      this.accountMasterData.LOAD_ONCLICK = true;
      this.accountMasterData.PAGENO = 1;
      this.accountMasterData.SEARCH_FIELD = 'BANK_CODE';
      this.accountMasterData.WHERECONDITION = "ACCOUNT_MODE='B' AND Accode <> ''"
    } else if (event.ENGLISH == 'TT') {
      this.isViewTypeCode = false;
      this.accountMasterData.LOAD_ONCLICK = true;
      this.accountMasterData.PAGENO = 1;
      this.accountMasterData.WHERECONDITION = "ACCOUNT_MODE in ('G','L') AND Accode <> ''"
    } else if (event.ENGLISH == 'Others') {
      this.isViewTypeCode = false;
    }
  }
  /**USE: branch autocomplete starts*/
  getBranchMasterList() {
    let Sub: Subscription = this.dataService.getDynamicAPI('BranchMaster')
      .subscribe((result) => {
        if (result.response) {
          this.branchArray = result.response
          let AcCode = this.branchArray.filter((item: any) => item.BRANCH_CODE = this.receiptEntryForm.value.Branch)
          if (AcCode[0].CASH_ACCODE) {
            this.receiptEntryForm.controls.AC_Code.setValue(AcCode[0].CASH_ACCODE)
            this.getAccountMaster(AcCode[0].CASH_ACCODE)
          } else {
            this.commonService.toastErrorByMsgId('Cash code not found')
          }
        } else {
          this.commonService.toastErrorByMsgId('branch Not Found!')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  openAttach() {
    for (let j = 0; j < this.Attachedfile.length; j++) {
      window.open(
        this.Attachedfile[j],
        '_blank' // <- This is what makes it open in a new window.
      );
    }
  }
  // use: open file
  openAttchments() {
    // Handle the cell click event based on the column and value
    // if (columnName === 'IS_ATTACHMENT_PRESENT') {
    // let SCHEME_UNIQUEID = e.row.data.SCHEME_UNIQUEID;
    let API = `SchemeCurrencyReceipt/SchemeCurrencyReceipt/GetReceiptAttachments?MID=` + this.content.MID
    let param = { SCH_CUSTOMER_ID: this.content.SCH_CUSTOMER_ID }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
      .subscribe((result: any) => {
        console.log(result, 'result');
        if (result.fileCount > 0) {
          this.Attachedfile = result.file
        } else {
          this.commonService.toastErrorByMsgId(result.message)
        }
      })
    // }
  }
  branchCodeChange(event: any) {
    if (event.option.value) {
      let AcCode = this.branchArray.filter((item: any) => item.BRANCH_CODE = event.option.value)
      if (AcCode[0].CASH_ACCODE) this.receiptEntryForm.controls.AC_Code.setValue(AcCode[0].CASH_ACCODE)
    }
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**USE: close modal window */
  close(data?: any) {
    this.activeModal.close(data);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}