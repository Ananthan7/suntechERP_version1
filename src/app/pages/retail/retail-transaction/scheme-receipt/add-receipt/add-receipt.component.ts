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
  schemeFlag: boolean = false;
  viewMode: boolean = false;
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
    this.getPaymentType('')
    this.getCreditCardMaster()
    this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
    this.receiptEntryForm.controls.ChequeDate.setValue(this.commonService.currentDate)
    if (this.content) {
      this.setFormValues()
    }
    this.paymentTypeChange({ ENGLISH: 'Cash' })
  }
  setFormValues() {
    this.receiptEntryForm.controls.SchemeCode.setValue(this.content.SchemeCode)
    this.receiptEntryForm.controls.SchemeId.setValue(this.content.SchemeID)
    this.setFormControlValue('InstallmentAmount', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlValue('Header_Amount', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlValue('Amount_LC', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlValue('Amount_FC', this.content.SCH_INST_AMOUNT_FC)
    this.setFormControlValue('SchemeTotalAmount', this.content.SCHEME_AMOUNT)
    this.setGridData()
  }
  // setInitialValues() {
  //   let data = this.content.details[0]
  //   this.getPaymentType(data.RECPAY_TYPE || data.Type)
  //   this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
  //   this.receiptEntryForm.controls.SchemeCode.setValue(data.SchemeID)
  //   // this.receiptEntryForm.controls.AC_Code.setValue(data.CurrCode)
  //   this.receiptEntryForm.controls.AC_Description.setValue(data.AC_Description)
  //   this.receiptEntryForm.controls.CurrRate.setValue(data.CURRENCY_RATE || data.CurrRate)
  //   this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE || data.CurrCode)
  //   this.receiptEntryForm.controls.Amount_FC.setValue(data.AMOUNTFC || data.Amount_FC)
  //   this.receiptEntryForm.controls.Amount_LC.setValue(data.AMOUNTCC || data.Amount_LC)
  //   this.receiptEntryForm.controls.Header_Amount.setValue(
  //     this.commonService.commaSeperation(data.HEADER_AMOUNT) || data.Header_Amount)
  //   this.receiptEntryForm.controls.AmountWithTRN.setValue(data.HEADER_AMOUNTWITHVAT || data.AmountWithTRN)
  //   this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(data.HEADER_AMOUNTWITHVAT || data.HeaderAmountWithTRN)
  //   this.receiptEntryForm.controls.TRN_Amount_FC.setValue(data.VAT_AMOUNTFC || data.TRN_Amount_FC)
  //   this.receiptEntryForm.controls.TRN_Amount_LC.setValue(data.VAT_AMOUNTCC || data.TRN_Amount_LC)
  //   this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER || data.TRN_Per)
  //   this.receiptEntryForm.controls.SRNO.setValue(data.SRNO)

  //   this.receiptEntryForm.controls.TypeCode.setValue(data.TypeCode)
  //   this.receiptEntryForm.controls.TypeCodeDESC.setValue(data.TypeCodeDESC)
  //   this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_AC)
  //   this.receiptEntryForm.controls.TRN_No.setValue(data.TRN_No)
  //   this.receiptEntryForm.controls.TRN_Inv.setValue(data.TRN_Inv)
  //   this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
  //   this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
  //   this.receiptEntryForm.controls.TRN_Ref.setValue(data.TRN_Ref)
  //   this.receiptEntryForm.controls.Exp.setValue(data.Exp)
  //   this.receiptEntryForm.controls.ValidId.setValue(data.ValidId)
  //   this.receiptEntryForm.controls.SourceofFunds.setValue(data.SourceofFunds)
  //   this.receiptEntryForm.controls.TransactionType.setValue(data.TransactionType)
  //   this.receiptEntryForm.controls.Narration.setValue(data.Narration)
  // }
  setGridData() {
    if (this.gridDataSource.length > 0) {
      this.calculateGridAmount()
      return
    }
    let param = {
      SCH_CUSTOMER_CODE: this.content.SCH_CUSTOMER_CODE || '',
      SCH_CUSTOMER_ID: this.content.SchemeID || '',
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('SchemeReceipt/GetSchemeReceipts', param)
      .subscribe((result) => {
        if (result.response) {
          this.gridDataSource = result.response
          this.calculateGridAmount()
        } else {
          this.disableAmountFC = true;
          this.viewMode = true;
          this.commonService.toastErrorByMsgId('grid data not found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
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
    if (Number(formValue.Amount_FC) == 0 || Number(formValue.Amount_LC) == 0) {
      this.commonService.toastErrorByMsgId('Amount cannot be zero')
      return
    }
    if (formValue.TRN_Per == '') {
      this.commonService.toastErrorByMsgId('Issue while loading tax details, try again')
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
      this.close(this.receiptEntryForm.value)
    }
  }
  disableAmountFC: boolean = false;
  //Account master
  getAccountMaster(accountCode: string) {
    this.commonService.toastInfoByMsgId('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(`AccountMaster/${accountCode}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (data.CURRENCY_CODE) {
            this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
            if (data.CURRENCY_CODE == this.commonService.compCurrency) {
              this.disableAmountFC = true
            }
            this.currencyCodeChange(data.CURRENCY_CODE);
          } else {
            this.commonService.toastErrorByMsgId('PartyCode not found in credit master')
          }
        } else {
          this.commonService.toastErrorByMsgId('PartyCode not found in credit master')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  accountMasterChanged(event: any) {
    let API = 'Scheme/AccountMaster?ACCODE='
    let Sub: Subscription = this.dataService.getDynamicAPI(API + event.target.value)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE);
          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (data.CURRENCY_CODE) {
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
  getGSTDetail() {
    let param = {
      accode: this.content.PartyCode,
      branch_code: this.commonService.branchCode,
      mainvoctype: this.commonService.getqueryParamMainVocType(),
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('TaxDetails/GetGSTDetail', param)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.receiptEntryForm.controls.IGST_ACCODE.setValue(data.IGST_ACCODE);
        } else {
          this.commonService.toastErrorByMsgId('IGST Code not found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //USE to get HSN and VAT and calculations
  getTaxDetails() {
    let date = this.commonService.formatDate(new Date())
    let accountCode = this.content.PartyCode
    if (!accountCode) {
      this.commonService.toastErrorByMsgId('Party Code Not Found')
      return
    }
    let Sub: Subscription = this.dataService.getDynamicAPI(`TaxDetails?Accode=${accountCode}&strdate=${date}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.getGSTDetail()
          this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_SAC_CODE);
          this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER);
          // this.content.SCHEME_AMOUNT = 100 //TODO

          this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(this.content.SCHEME_AMOUNT)
          this.receiptEntryForm.controls.AmountWithTRN.setValue(this.content.SCHEME_AMOUNT)


          // let amount_LC: number = this.calculateVAT(Number(data.VAT_PER), Number(this.content.SCH_INST_AMOUNT_FC))

          // amount_LC = Number(amount_LC.toFixed(2))


          // let amount_FC: number = Number(this.currencyRate) * amount_LC
          // amount_FC = Number(amount_FC.toFixed(2))

          // let trn_Fc_amount: number = Number(this.content.SCHEME_AMOUNT) - amount_FC
          // trn_Fc_amount = Number(trn_Fc_amount.toFixed(2))
          // this.receiptEntryForm.controls.TRN_Amount_FC.setValue(trn_Fc_amount)

          // let trn_amount_lc: number = Number(this.content.SCHEME_AMOUNT) - amount_LC
          // trn_amount_lc = Number(trn_amount_lc.toFixed(2))
          // this.receiptEntryForm.controls.TRN_Amount_LC.setValue(trn_amount_lc)
        } else {
          this.commonService.toastErrorByMsgId('Accode not found in credit master')
        }
      }, err => this.commonService.toastErrorByMsgId(err))
    this.subscriptions.push(Sub)
  }

  private calculateVAT(VAT: number, AMOUNT: number): number {
    return (AMOUNT / (100 + VAT)) * 100
  }
  setFormControlValue(controlName: string, amount: any) {
    amount = this.commonService.emptyToZero(amount)
    amount = this.commonService.decimalQuantityFormat(amount, 'AMOUNT')
    this.receiptEntryForm.controls[controlName].setValue(
      this.commonService.commaSeperation(amount)
    )
  }
  calculateAmountLC() {
    let form = this.receiptEntryForm.value
    if (this.commonService.emptyToZero(form.SchemeBalance) == 0) {
      this.commonService.toastErrorByMsgId('Scheme Balance is' + form.SchemeBalance)
      return
    }
    if (this.commonService.emptyToZero(form.SchemeBalance) < this.commonService.emptyToZero(form.Amount_LC)) {
      this.receiptEntryForm.controls.Amount_LC.setValue('')
      this.commonService.toastErrorByMsgId('Allocating Amount cannot allow more than Scheme Balance ' + form.SchemeBalance)
      return
    }
    this.setFormControlValue('Amount_LC', form.Amount_LC)
    this.setFormControlValue('Header_Amount', form.Amount_LC)
    this.setFormControlValue('Amount_FC', form.Amount_LC)
    this.setGridData()
  }
  calculateAmountFC() {
    let form = this.receiptEntryForm.value
    if (this.commonService.emptyToZero(form.SchemeBalance) == 0) {
      this.commonService.toastErrorByMsgId('Scheme Balance is' + form.SchemeBalance)
      return
    }
    if (this.commonService.emptyToZero(form.SchemeBalance) < this.commonService.emptyToZero(form.Amount_FC)) {
      this.receiptEntryForm.controls.Amount_FC.setValue('')
      this.commonService.toastErrorByMsgId('Allocating Amount cannot allow more than Scheme Balance ' + form.SchemeBalance)
      return
    }
    this.setFormControlValue('Amount_FC', form.Amount_FC)
    this.setFormControlValue('Header_Amount', form.Amount_FC)
    this.setFormControlValue('Amount_LC', form.Amount_FC)
    this.setGridData()
  }
  /**calculate amount and split to rows */
  calculateGridAmount() {
    let formData = this.receiptEntryForm.value
    let Amount_LC = this.commonService.emptyToZero(formData.Amount_LC)
    let Amount_FC = this.commonService.emptyToZero(formData.Amount_FC)
    let payAmountSum: number = 0
    this.gridDataSource.forEach((item: any, index: any) => {
      payAmountSum += parseInt(item.PAY_AMOUNT_FC)
      item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(0, 'THREE')
      item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(0, 'THREE')
    })
    let SchemeBalance = this.commonService.decimalQuantityFormat((payAmountSum), 'AMOUNT')
    this.receiptEntryForm.controls.SchemeBalance.setValue(
      this.commonService.commaSeperation(SchemeBalance)
    )
    if (Amount_LC > payAmountSum || Amount_FC > payAmountSum) {
      this.commonService.toastErrorByMsgId('Allocating Amount cannot allow more than ' + this.receiptEntryForm.value.SchemeBalance)
      this.receiptEntryForm.controls.Amount_LC.setValue(
        this.commonService.decimalQuantityFormat(0, 'AMOUNT')
      )
      this.receiptEntryForm.controls.Amount_FC.setValue(
        this.commonService.decimalQuantityFormat(0, 'AMOUNT')
      )
      this.receiptEntryForm.controls.Header_Amount.setValue(
        this.commonService.decimalQuantityFormat(0, 'AMOUNT')
      )
      return
    }
    let balanceAmount: number = Amount_LC - this.commonService.emptyToZero(formData.InstallmentAmount)
    let totalRowsToUpdate = Math.floor(Amount_LC / this.commonService.emptyToZero(formData.InstallmentAmount))
    let flag = 0
    this.gridDataSource.forEach((item: any, index: any) => {
      if (balanceAmount <= 0) {
        this.gridDataSource[0].RCVD_AMOUNTFC = this.commonService.emptyToZero(Amount_FC)
        this.gridDataSource[0].RCVD_AMOUNTCC = this.commonService.emptyToZero(Amount_LC)
        this.gridDataSource[0].RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(Amount_FC, 'THREE')
        this.gridDataSource[0].RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(Amount_LC, 'THREE')
        flag = 1
      }
      if (flag == 1) return
      if (totalRowsToUpdate >= index + 1) {
        item.RCVD_AMOUNTFC = this.commonService.emptyToZero(formData.InstallmentAmount)
        item.RCVD_AMOUNTCC = this.commonService.emptyToZero(formData.InstallmentAmount)
        item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTFC, 'THREE')
        item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat((item.RCVD_AMOUNTCC), 'THREE')
      } else {
        item.RCVD_AMOUNTFC = Amount_FC - (totalRowsToUpdate *
          this.commonService.emptyToZero(formData.InstallmentAmount))
        item.RCVD_AMOUNTFC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTFC, 'THREE')
        item.RCVD_AMOUNTCC = Amount_LC - (totalRowsToUpdate *
          this.commonService.emptyToZero(formData.InstallmentAmount))
        item.RCVD_AMOUNTCC = this.commonService.decimalQuantityFormat(item.RCVD_AMOUNTFC, 'THREE')
        flag = 1
      }
      if (flag == 1) return
    })
    this.setNarrationString() //narration add
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
            this.getTaxDetails()
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
    this.receiptEntryForm.controls.Type.setValue('Cash')
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
      this.accountMasterData.SEARCH_FIELD = 'ACCODE,ACCOUNT_HEAD';
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
