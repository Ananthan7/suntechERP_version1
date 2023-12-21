import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent implements OnInit {
  @Output() newRowSaveClick = new EventEmitter();
  @Output() closebtnClick = new EventEmitter();
  @Input() newReceiptDatas: any;
  branchArray: any[] = [];
  typeCodeFilteredOptions!: Observable<any[]>;
  typeCodeArray: any[] = [];
  selectedTypeArray: any[] = [];
  isViewTypeCode: boolean = false;
  currencyRate: any;
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
  accountMasterData: any = {
    TABLE_NAME: 'ACCOUNT_MASTER',
    FILTER_FEILD_NAMES: {
    },
    API_FILTER_VALUE: 'ACCOUNT_HEAD',
    DB_FIELD_VALUE: 'ACCOUNT_HEAD',
    NAME_FIELD_VALUE: 'ACCODE',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  payTypeArray: any[] = [];
  /**form group data */
  receiptEntryForm: FormGroup = this.formBuilder.group({
    Branch: ['', [Validators.required]],
    AC_Code: ['', [Validators.required]],
    AC_Description: [''],
    Type: [null, [Validators.required]],
    TypeCode: ['',],
    TypeCodeDESC: ['',],
    CurrCode: ['', [Validators.required]],
    CurrRate: ['', [Validators.required]],
    TRN_No: ['',],
    TRN_Inv: ['',],
    TRN_Inv_Date: [''],
    TRN_Ref: ['',],
    Exp: ['',],
    HSN_AC: ['', [Validators.required]],
    Amount_FC: ['', [Validators.required]],
    Amount_LC: ['', [Validators.required]],
    Header_Amount: ['', [Validators.required]],
    TRN_Per: ['', [Validators.required]],
    TRN_Amount_FC: ['', [Validators.required]],
    TRN_Amount_LC: ['', [Validators.required]],
    AmountWithTRN: ['', [Validators.required]],
    HeaderAmountWithTRN: ['', [Validators.required]],
    ValidId: ['',],
    SourceofFunds: ['',],
    TransactionType: ['',],
    Narration: ['',],
    SRNO: [0],
  })
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    
  }

  ngOnInit(): void {
    if(this.newReceiptDatas.details && this.newReceiptDatas.details.length>0){
      let data = this.newReceiptDatas.details[0]
      this.getPaymentType(data.RECPAY_TYPE || data.Type)
      this.receiptEntryForm.controls.Branch.setValue(data.BRANCH_CODE || data.Branch)
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
      
      if(data.TypeCode){
        this.receiptEntryForm.controls.TypeCode.setValue(data.TypeCode)
      }
      if(data.TypeCode){
        this.receiptEntryForm.controls.TypeCodeDESC.setValue(data.TypeCodeDESC)
      }
      if(data.HSN_AC){
        this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_AC)
      }
      if(data.TRN_No){
        this.receiptEntryForm.controls.TRN_No.setValue(data.TRN_No)
      }
      if(data.TRN_Inv){
        this.receiptEntryForm.controls.TRN_Inv.setValue(data.TRN_Inv)
      }
      if(data.TRN_Inv_Date){
        this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
      }
      if(data.TRN_Inv_Date){
        this.receiptEntryForm.controls.TRN_Inv_Date.setValue(data.TRN_Inv_Date)
      }
      if(data.TRN_Ref){
        this.receiptEntryForm.controls.TRN_Ref.setValue(data.TRN_Ref)
      }
      if(data.Exp){
        this.receiptEntryForm.controls.Exp.setValue(data.Exp)
      }
      if(data.ValidId){
        this.receiptEntryForm.controls.ValidId.setValue(data.ValidId)
      }
      if(data.SourceofFunds){
        this.receiptEntryForm.controls.SourceofFunds.setValue(data.SourceofFunds)
      }
      if(data.TransactionType){
        this.receiptEntryForm.controls.TransactionType.setValue(data.TransactionType)
      }
      if(data.Narration){
        this.receiptEntryForm.controls.Narration.setValue(data.Narration)
      }
     
    }else{
      this.getBranchMasterList()
      this.getPaymentType('Credit Card')
      this.getCreditCardMaster()
      let branch = localStorage.getItem('userbranch')
      if (branch) {
        this.receiptEntryForm.controls.Branch.setValue(branch)
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
    
    if (data.length>0) {
      this.receiptEntryForm.controls.Branch.setValue(data[0].BRANCH_CODE)
      
    }else{
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
      this.newRowSaveClick.emit(this.receiptEntryForm.value)
    }
  }
  
  //Account master
  getAccountMaster(accountCode: string) {
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/AccountMaster?ACCODE=' + accountCode)
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
    let date = this.commonService.formatDate(new Date())
    let accountCode = this.newReceiptDatas.PARTY_CODE
    let Sub: Subscription = this.dataService.getDynamicAPI(`Scheme/TaxDetails?Accode=${accountCode}&strdate=${date}`)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.receiptEntryForm.controls.HSN_AC.setValue(data.HSN_SAC_CODE);
          this.receiptEntryForm.controls.TRN_Per.setValue(data.VAT_PER);

          this.receiptEntryForm.controls.HeaderAmountWithTRN.setValue(this.newReceiptDatas.SCHEME_AMOUNT)
          this.receiptEntryForm.controls.AmountWithTRN.setValue(this.newReceiptDatas.SCHEME_AMOUNT)

          let amount_LC: number = this.calculateVAT(Number(data.VAT_PER), Number(this.newReceiptDatas.SCHEME_AMOUNT))

          amount_LC = Number(amount_LC.toFixed(2))
          this.receiptEntryForm.controls.Amount_LC.setValue(amount_LC)

          this.receiptEntryForm.controls.Header_Amount.setValue(amount_LC)

          let amount_FC: number = Number(this.currencyRate) * amount_LC
          amount_FC = Number(amount_FC.toFixed(2))
          this.receiptEntryForm.controls.Amount_FC.setValue(amount_FC)

          let trn_Fc_amount: number = Number(this.newReceiptDatas.SCHEME_AMOUNT) - amount_FC
          trn_Fc_amount =  Number(trn_Fc_amount.toFixed(2)) 
          this.receiptEntryForm.controls.TRN_Amount_FC.setValue(trn_Fc_amount)

          let trn_amount_lc: number = Number(this.newReceiptDatas.SCHEME_AMOUNT) - amount_LC
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
  private calculateVAT(VAT: number, AMOUNT: number):number {
    return (AMOUNT / (100 + VAT)) * 100
  }
  //currency Code Change
  currencyCodeChange(value: string) {
    if (value == '') return
    let API = `Scheme/CurrencyMaster/${value}`
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
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/CreditCardMaster')
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
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/ComboFilter')
      .subscribe((result:any) => {
        if (result.response) {
          let data = result.response
          this.payTypeArray = data.filter((value: any) => value.COMBO_TYPE == 'Receipt Mode' && value.ENGLISH == 'Credit Card')
          this.receiptEntryForm.controls.Type.setValue(value)
        } else {
          this.toastr.error('Receipt Mode not found')
        }
      }, (err:any) => alert(err))
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
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/BranchMaster')
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
  close() {
    // this.closebtnClick.emit()
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}