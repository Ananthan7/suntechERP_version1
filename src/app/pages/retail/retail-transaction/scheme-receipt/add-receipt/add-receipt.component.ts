import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  typeCodeFilteredOptions!: Observable<any[]>;
  typeCodeArray: any[] = [];
  selectedTypeArray: any[] = [];
  isViewTypeCode: boolean = false;
  currencyRate: any;
  payTypeArray: any[] = [];
  gridDataSource: any[] = [];
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
    LOOKUPID: 81,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Account Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  /**form group data */
  receiptEntryForm: FormGroup = this.formBuilder.group({
    Branch: [''],
    AC_Code: [''],
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
    Amount_FC: [''],
    Amount_LC: [''],
    Header_Amount: [''],
    TRN_Per: [''],
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
    SchemeBalance: [''],
    InstallmentAmount: [''],
  })
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private activeModal: NgbActiveModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {

  }

  ngOnInit(): void {
    if (this.content.details && this.content.details.length > 0) {
      this.setInitialValues()
    } else {
      // this.getBranchMasterList()
      this.getPaymentType('Credit Card')
      this.getCreditCardMaster()
      this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
    }
    if(this.content){
      this.receiptEntryForm.controls.SchemeCode.setValue(this.content.SchemeID)
      this.receiptEntryForm.controls.SchemeId.setValue(this.content.SchemeID)
      this.receiptEntryForm.controls.InstallmentAmount.setValue(this.content.SCHEME_AMOUNT)
    }
    this.setGridData()
  }

  setInitialValues() {
    let data = this.content.details[0]
    this.getPaymentType(data.RECPAY_TYPE || data.Type)
    this.receiptEntryForm.controls.Branch.setValue(this.commonService.branchCode)
    this.receiptEntryForm.controls.SchemeCode.setValue(data.SchemeID)
    // this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE || data.AC_Code)
    this.receiptEntryForm.controls.AC_Description.setValue(data.AC_Description)
    this.receiptEntryForm.controls.CurrRate.setValue(data.CURRENCY_RATE || data.CurrRate)
    this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE || data.CurrCode)
    this.receiptEntryForm.controls.Amount_FC.setValue(data.AMOUNTFC || data.Amount_FC)
    this.receiptEntryForm.controls.Amount_LC.setValue(data.AMOUNTCC || data.Amount_LC)
    this.receiptEntryForm.controls.Header_Amount.setValue(data.HEADER_AMOUNT || data.Header_Amount)
    this.receiptEntryForm.controls.AmountWithTRN.setValue(data.HEADER_AMOUNTWITHVAT || data.AmountWithTRN)
    this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(data.HEADER_AMOUNTWITHVAT || data.HeaderAmountWithTRN)
    this.receiptEntryForm.controls.TRN_Amount_FC.setValue(data.VAT_AMOUNTFC || data.TRN_Amount_FC)
    this.receiptEntryForm.controls.TRN_Amount_LC.setValue(data.VAT_AMOUNTCC || data.TRN_Amount_LC)
    this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER || data.TRN_Per)
    this.receiptEntryForm.controls.SRNO.setValue(data.SRNO)

    this.receiptEntryForm.controls.TypeCode.setValue(data.TypeCode)
    this.receiptEntryForm.controls.TypeCodeDESC.setValue(data.TypeCodeDESC)
    this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_AC)
    this.receiptEntryForm.controls.TRN_No.setValue(data.TRN_No)
    this.receiptEntryForm.controls.TRN_Inv.setValue(data.TRN_Inv)
    this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
    this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
    this.receiptEntryForm.controls.TRN_Ref.setValue(data.TRN_Ref)
    this.receiptEntryForm.controls.Exp.setValue(data.Exp)
    this.receiptEntryForm.controls.ValidId.setValue(data.ValidId)
    this.receiptEntryForm.controls.SourceofFunds.setValue(data.SourceofFunds)
    this.receiptEntryForm.controls.TransactionType.setValue(data.TransactionType)
    this.receiptEntryForm.controls.Narration.setValue(data.Narration)
  }
  setGridData() {
    let param = {
      SCH_CUSTOMER_CODE: this.content.POSCustomerCode || '',
      SCH_CUSTOMER_ID: this.content.SchemeCode || '',
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('SchemeReceipt/GetSchemeReceipts',param)
      .subscribe((result) => {
        if (result.response) {
          this.gridDataSource = result.response
        } else {
          this.toastr.error('data not found')
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
    this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE)
    if (data.ACCODE) {
      this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD)
      this.getAccountMaster(data.ACCODE)
    }
  }
  //party Code Change
  branchChange(event: any) {
    let branch = event.target.value
    event.target.value = branch.toUpperCase()
    let data = this.branchArray.filter((item: any) => item.BRANCH_CODE == event.target.value)

    if (data.length > 0) {
      this.receiptEntryForm.controls.Branch.setValue(data[0].BRANCH_CODE)

    } else {
      this.toastr.error('Branch not found!');
      this.receiptEntryForm.value.Branch.setValue('')
    }
  }
  //use: form submit
  onSubmit() {
    if (this.receiptEntryForm.invalid) {
      this.toastr.error('select all required details!');
      return;
    } else {
      this.close(this.receiptEntryForm.value)
      // this.newRowSaveClick.emit(this.receiptEntryForm.value)
    }
  }

  //Account master
  getAccountMaster(accountCode: string) {
    let Sub: Subscription = this.dataService.getDynamicAPI(`AccountMaster/${accountCode}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (data.CURRENCY_CODE) {
            this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
            this.currencyCodeChange(data.CURRENCY_CODE);
          } else {
            this.toastr.error('PartyCode not found in credit master')
          }
        } else {
          this.toastr.error('PartyCode not found in credit master')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  accountMasterChanged(event: any) {
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/AccountMaster?ACCODE=' + event.target.value)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.AC_Code.setValue(data.ACCODE);
          this.receiptEntryForm.controls.AC_Description.setValue(data.ACCOUNT_HEAD);
          if (data.CURRENCY_CODE) {
            this.receiptEntryForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
            this.currencyCodeChange(data.CURRENCY_CODE);
          } else {
            this.toastr.error('Account Code not found')
            this.receiptEntryForm.controls.AC_Code.setValue('');
            this.receiptEntryForm.controls.AC_Description.setValue('');
          }
        } else {
          this.toastr.error('Account Code not found')
          this.receiptEntryForm.controls.AC_Code.setValue('');
          this.receiptEntryForm.controls.AC_Description.setValue('');
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //USE to get HSN and VAT and calculations
  getTaxDetails() {
    console.log(this.content, 'fired');

    let date = this.commonService.formatDate(new Date())
    let accountCode = this.content.PartyCode
    if (!accountCode) {
      this.toastr.error('Accode not found')
      return
    }
    let Sub: Subscription = this.dataService.getDynamicAPI(`TaxDetails?Accode=${accountCode}&strdate=${date}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_SAC_CODE);
          this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER);
          this.content.SCHEME_AMOUNT = 100 //TODO
          console.log(this.content.SCHEME_AMOUNT, 'this.content.SCHEME_AMOUNT ');

          this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(this.content.SCHEME_AMOUNT)
          this.receiptEntryForm.controls.AmountWithTRN.setValue(this.content.SCHEME_AMOUNT)

          let amount_LC: number = this.calculateVAT(Number(data.VAT_PER), Number(this.content.SCHEME_AMOUNT))

          amount_LC = Number(amount_LC.toFixed(2))
          this.receiptEntryForm.controls.Amount_LC.setValue(amount_LC)

          this.receiptEntryForm.controls.Header_Amount.setValue(amount_LC)

          let amount_FC: number = Number(this.currencyRate) * amount_LC
          amount_FC = Number(amount_FC.toFixed(2))
          this.receiptEntryForm.controls.Amount_FC.setValue(amount_FC)

          let trn_Fc_amount: number = Number(this.content.SCHEME_AMOUNT) - amount_FC
          trn_Fc_amount = Number(trn_Fc_amount.toFixed(2))
          this.receiptEntryForm.controls.TRN_Amount_FC.setValue(trn_Fc_amount)

          let trn_amount_lc: number = Number(this.content.SCHEME_AMOUNT) - amount_LC
          trn_amount_lc = Number(trn_amount_lc.toFixed(2))
          this.receiptEntryForm.controls.TRN_Amount_LC.setValue(trn_amount_lc)



          // "VAT_CODE": "VAT5",
          // "HSN_SAC_CODE": "VAT5",
          // "VAT_PER": "5.00",
          // "EXPENSE_ACCODE": "225004",
          // "VAT_DATE": "8/26/2023 12:00:00 AM"
        } else {
          this.toastr.error('Accode not found in credit master')
        }
      }, err => this.toastr.error(err))
    this.subscriptions.push(Sub)
  }
  private calculateVAT(VAT: number, AMOUNT: number): number {
    return (AMOUNT / (100 + VAT)) * 100
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
            this.receiptEntryForm.controls.CurrRate.setValue(data.CONV_RATE)
            this.getTaxDetails()
            this.currencyRate = data.CONV_RATE
          }
        } else {
          this.toastr.error('Currency rate not Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  /**USE: get CreditCardMaster */
  getCreditCardMaster() {
    let Sub: Subscription = this.dataService.getDynamicAPI('CreditCardMaster/GetCreditCardMaster')
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.typeCodeArray = data.filter((value: any) => value.MODE == 1)

          this.typeCodeFilteredOptions = this.receiptEntryForm.controls.TypeCode.valueChanges.pipe(
            startWith(''),
            map(value => this._filterTypeCode(value || '')),
          );
        } else {
          this.toastr.error('Currency rate not Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  private _filterTypeCode(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.typeCodeArray.filter((option: any) =>
      option.CREDIT_CODE.toLowerCase().includes(filterValue) ||
      option.DESCRIPTION.toLowerCase().includes(filterValue));
  }
  changeTypeCode(event: any) {
    this.selectedTypeArray = this.typeCodeArray.filter((item: any) => item.CREDIT_CODE == event.option.value)
    this.receiptEntryForm.controls.TypeCodeDESC.setValue(this.selectedTypeArray[0].DESCRIPTION)
    this.receiptEntryForm.controls.AC_Code.setValue(this.selectedTypeArray[0].ACCODE)

    if (this.selectedTypeArray[0].ACCODE != "") {
      this.getAccountMaster(this.selectedTypeArray[0].ACCODE)
    }
  }
  /**USE:  get PaymentType*/
  getPaymentType(value: string) {
    let Sub: Subscription = this.dataService.getDynamicAPI('ComboFilter')
      .subscribe((result: any) => {
        if (result.response) {
          let data = result.response
          this.payTypeArray = data.filter((value: any) => value.COMBO_TYPE == 'Receipt Mode' && value.ENGLISH == 'Credit Card')
          this.receiptEntryForm.controls.Type.setValue(value)
        } else {
          this.toastr.error('Receipt Mode not found')
        }
      }, (err: any) => alert(err))
    this.subscriptions.push(Sub)
  }
  //type change
  paymentTypeChange(event: any) {
    if (event.value == 'Credit Card') {
      this.isViewTypeCode = false;
      this.receiptEntryForm.controls.AC_Code.setValue('');
      this.receiptEntryForm.controls.AC_Description.setValue('');
    } else {
      this.receiptEntryForm.controls.TypeCode.setValue(null);
      this.receiptEntryForm.controls.TypeCodeDESC.setValue('');
      this.isViewTypeCode = true;
    }
    if (event.value == 'Cash') {
      this.getBranchMasterList()
    }
  }
  /**USE: branch autocomplete starts*/
  getBranchMasterList() {
    let Sub: Subscription = this.dataService.getDynamicAPI('BranchMaster')
      .subscribe((result) => {
        if (result.response) {
          this.branchArray = result.response
          // this.branchFilteredOptions = this.receiptEntryForm.controls.Branch.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this._filterBranch(value || '')),
          // );

          let AcCode = this.branchArray.filter((item: any) => item.BRANCH_CODE = this.receiptEntryForm.value.Branch)
          if (AcCode[0].CASH_ACCODE) {

            // this.receiptEntryForm.controls.AC_Code.setValue(AcCode[0].CASH_ACCODE)
            // this.receiptEntryForm.controls.AC_Description.setValue(AcCode[0].DESCRIPTION)
            // this.getAccountMaster(AcCode[0].CASH_ACCODE)
          }

        } else {
          Swal.fire({
            title: 'branch Not Found!',
            text: "",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  // private _filterBranch(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.branchArray.filter((option: any) =>
  //     option.BRANCH_CODE.toLowerCase().includes(filterValue) ||
  //     option.DESCRIPTION.toLowerCase().includes(filterValue));
  // }

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
