import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  @Output() closebtnClick = new EventEmitter();
  //Receipt forms 
  cashreceiptForm: FormGroup;
  creditCardReceiptForm: FormGroup;
  advanceReceiptForm: FormGroup;
  othersReceiptForm: FormGroup;
  giftReceiptForm: FormGroup;
  customerReceiptForm: FormGroup;

  receiptModesList: any;
  selectedTabIndex = 0;
  viewOnly: boolean = false;
  
  receiptModeOptions_Cash: any[] = [];
  receiptModeOptions_CC : any[] = [];
  receiptModeAdvanceOthers: any[] = [];
  filteredAdvanceBranchOptions: any[] = [];
  filteredadvanceYear: any[] = [];
  receiptModeOptionsOthers: any[] = [];
  receiptModeGiftOptions: any[] = [];
  filteredGiftModeBranchOptions: any[] = [];
  customAcCodeListOptions: any[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) { 
    /** Start Receipt forms  */
    this.cashreceiptForm = this.formBuilder.group({
      paymentsCash: ['', Validators.required],
      cashAmtLC: ['', Validators.required],
      cashAmtFC: ['', [Validators.required, Validators.min(0.1)]],
    });
    this.creditCardReceiptForm = this.formBuilder.group({
      paymentsCreditCard: ['', Validators.required],
      cardCCNo: ['', Validators.required],
      cardAmtFC: ['', [Validators.required, Validators.min(0.1)]],
    });

    this.advanceReceiptForm = this.formBuilder.group({
      paymentsAdvance: ['', Validators.required],
      advanceBranch: ['', Validators.required],
      advanceYear: ['', Validators.required],
      advanceRecNo: ['', Validators.required],
      advanceAmount: ['', [Validators.required, Validators.min(0.1)]],
      advanceVatAmountLC: [''],
      advanceVatAmountFC: [''],
    });

    this.othersReceiptForm = this.formBuilder.group({
      paymentsOthers: ['', Validators.required],
      othersAmtFC: ['', [Validators.required, Validators.min(0.1)]],
    });

    this.giftReceiptForm = this.formBuilder.group({
      paymentsCreditGIftVoc: ['', Validators.required],
      giftVocNo: ['', Validators.required],
      giftBranch: ['', Validators.required],
      giftAmtFC: ['', [Validators.required, Validators.min(0.1)]],
    });

    this.customerReceiptForm = this.formBuilder.group({
      customAcCodeList: ['', Validators.required],
      customerAmtLC: ['', Validators.required],
      customerAmtFC: ['', [Validators.required, Validators.min(0.1)]],
      // customerAccode: ['', Validators.required],
    });
    /**End Receipt forms  */

    this.receiptModesList = {
      BTN_CASH: true,
      BTN_CREDITCARD: true,
      BTN_ADVANCE: true,
      BTN_OTHERS: true,
      BTN_CUSTOMER: true,
    }
    
  }

  ngOnInit(): void {
  }

  setTabByIndex(index:any) {

  }
  changeBranch(value:any) {

  }
  changeAdvanceVocNo(value:any) {

  }
  changeCustAcCode(value:any) {

  }
  
  changeReceiptAmtFC(event:any, formName?:any, fieldName?:any) {
    // this[formName].controls[fieldName].setValue(
    //   event.target.value);
  }


  enforceMinMax(value:any){
    return this.commonService.enforceMinMax(value)
  }
  /**USE: close modal window */
  close() {
    this.closebtnClick.emit();
  }
}
