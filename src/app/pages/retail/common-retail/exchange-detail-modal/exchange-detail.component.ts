import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    Component,
    OnInit,
    ViewChild,
    Renderer2,
    AfterViewInit,
    Input,
    EventEmitter,
    Output,
    HostListener,
} from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, pairwise, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';


import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { DatePipe, formatDate } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import * as _moment from 'moment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, noop } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ItemDetailService } from 'src/app/services/modal-service.service';



@Component({
    selector: 'app-exchange-detail',
    templateUrl: './exchange-detail.component.html',
    styleUrls: ['./exchange-detail.component.scss']
})
export class ExchangeDetailModal implements OnInit {
    @Input() modalTitle: string = 'Default Title';
    @Input() ordered_items!: any; 
    @Input() customerDataForm!: FormGroup; 
   
    @Input() vocDataForm!: FormGroup; 
    @Input() customerDetailForm!: FormGroup; 

    @Input() modal!: NgbModalRef;
    @Output() newExchangeItem = new EventEmitter<any>();

    viewOnly: boolean = false;

    dummyDate = '1900-01-01T00:00:00';
    dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];
    salesReturnsItems_forVoc: any = [];
    currentExchangeMetalPurchase: any[] = [];
    exchange_items: any[] = [];
    sales_returns_items: any = [];
    exchangeForm!: FormGroup;
    branch_tax_percentage: any;
    standardPurity: any = 0;
    baseYear: any = '';
    modalReference: any;
    zeroAmtVal!: any;
    zeroMQtyVal!: any;
    invMetalPurchaseTotalPcs: any;
    exStockCodeOptions: string[] = [''];
    strBranchcode: any = '';
    customerDetails: any = {};
    retailSReturnDataMID: any = '0';
    metalPurchaseDataMID: any = '0';


      // sales return total var..
      invReturnSalesTotalPcs: any = 0;
      invReturnSalesTotalWeight: any = 0;
      invReturnSalesTotalPureWeight: any = 0;
      invReturnSalesTotalMakingAmt: any = 0;
      invReturnSalesTotalMetalAmt: any = 0;
      invReturnSalesTotalStoneAmt: any = 0;
      invReturnSalesTotalNetAmt: any = 0;
      invReturnSalesTotalDisAmt: any = 0;
      invReturnSalesTotalPurityDiff: any = 0;
      invReturnSalesTotalStoneDiff: any = 0;
      invReturnSalesTotalDisPer: any = 0;
      invReturnSalesTotalTaxAmt: any = 0;
      invReturnSalesTotalNetTotal: any = 0;


  
    prnt_inv_total_items: any;
    prnt_inv_total_pcs: any;
    prnt_inv_total_weight: any;
    prnt_inv_total_pure_weight: any;
    prnt_inv_total_making_amt: any;
    prnt_inv_total_metal_amt: any;
    prnt_inv_total_stone_amt: any;
    prnt_inv_total_dis_amt: any;
    prnt_inv_total_gross_amt: any;
    prnt_inv_net_total_without_tax: any;
    prnt_inv_total_tax_amount: any;
    prnt_inv_net_total_with_tax: any;

    
    order_items_slno_length: any;
    order_items_total_amount: any;
    order_items_total_tax: any;
    order_items_total_net_amount: any;
    order_items_total_net_amount_org: any;
    order_items_total_gross_amount: any;
    order_items_total_discount_amount: any;

    order_total_exchange: any;


    strUser: any = '';

    salespersonName: string = '';
    branchOptions: string[] = [''];
    filteredBranchOptions!: Observable<string[]>;
    filteredSalesReturnBranchOptions!: Observable<string[]>;
    filteredAdvanceBranchOptions!: Observable<string[]>;
    filteredGiftModeBranchOptions!: Observable<string[]>;

    blockNegativeStock: any;
    blockNegativeStockValue: any;
    blockMinimumPrice: any;
    blockMinimumPriceValue: any;
    validatePCS: any;
    validateGrossWt: boolean = false;
    validateStoneWt: boolean = false;
    receiptModesTypes: any;
    receiptModesList: any;
    metalPurchaseDataPost: any = null;
    retailSalesDataPost: any = null;
    retailSReturnDataPost: any = null;

    lineItemPcs: any;
    makingRate: any;
    totalGrossAmount: any;
    totalTaxAmount: any;
    totalMakingAmount: any;
    totalNetAmount: any;
    lineItemGrossWt: any;
    isFieldReset: boolean = false;
    // Dialog box
    dialogBox: any;
    dialogBoxResult: any;

    defaultGrossTotal: any;
    defaultTaxTotal: any;
    defaultNetTotal: any;
    defaultMakingCharge: any;

    // public noImage = environment._noImage;
    selectedOption = '3';
    title = 'appBootstrap';

    exStockCodeFilteredOptions!: Observable<string[]>;

    public pos_main_data: any = {};

    public retailsReturnMain: any = {};

    public metalPurchaseMain: any = {};
    currentExchangeMetalPurchaseGst: any[] = [];

    all_branch: any;
    orderedItemEditId: any;


    currentLineItems: any = [];
    salesReturnEditId: any;
    salesReturnEditCode: any = '';
    salesReturnEditAmt: any = '';
    exchangeItemEditId: any;
    retailSaleDataVocNo: any = '0';

    exchange_items_slno_length: any;
    exchange_items_total_amount: any;
    retailSReturnVocNo: any = '0';
    metalPurchaseDataVocNo: any = '0';
    receiptEditId: any;
    _exchangeItemchange: any;
    exchangeFormMetalRateType = '';

    invMetalPurchaseTotalNettWeight: any;
    invMetalPurchaseTotalGrossWeight: any;
    invMetalPurchaseTotalPureWeight: any;
    invMetalPurchaseTotalPurityDiff: any;
    invMetalPurchaseTotalMakingAmt: any;
    invMetalPurchaseTotalNetAmt: any;
    invMetalPurchaseTotalMetalAmt: any;
    invMetalPurchaseTotalStoneAmt: any;
    invMetalPurchaseTotalOzWt: any;

    ozWeight: any = 0;

    modalReferenceSalesReturn: any;
    closeResult!: string;
    karatRateDetails: any = [];
    orders: any[] = [];
    receiptDetailsList: any = [];

    
    receiptTotalNetAmt: any;
    balanceAmount: any;

    
    prnt_inv_net_total_without_tax_sum: any;
    prnt_inv_total_tax_amount_sum: any;
    prnt_inv_net_total_with_tax_sum: any;
    prnt_received_amount: any;
    prnt_received_amount_words: any;

    constructor(
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private suntechApi: SuntechAPIService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private renderer: Renderer2,
        public comFunc: CommonServiceService,
        // public service: NgxBarcodeScannerService,
        private acRoute: ActivatedRoute,
        private inDb: IndexedDbService,
        private datePipe: DatePipe,
        public lineItemService: ItemDetailService,

    ) {
        this.strUser = localStorage.getItem('username');
        this.exchangeForm = this.formBuilder.group({
            fcn_exchange_division: ['', Validators.required],
            fcn_exchange_item_code: ['', Validators.required],
            fcn_exchange_item_desc: ['', Validators.required],
            fcn_exchange_pcs: [{ value: 0 }],
            // fcn_exchange_pcs: ['', Validators.required],
            fcn_exchange_gross_wt: [{ value: 0 }, Validators.required],
            fcn_exchange_stone_wt: [{ value: 0 }, Validators.required],
            fcn_exchange_net_wt: [{ value: 0 }, Validators.required],
            fcn_exchange_purity: [{ value: 0 }, Validators.required],
            fcn_exchange_pure_weight: [{ value: 0 }, Validators.required],
            fcn_exchange_purity_diff: [{ value: 0 }, Validators.required],
            fcn_exchange_stone_rate: [{ value: 0 }, Validators.required],
            fcn_exchange_stone_amount: [{ value: 0 }, Validators.required],
            fcn_exchange_metal_rate: [{ value: 0 }, Validators.required],
            fcn_exchange_metal_amount: [{ value: 0 }, Validators.required],
            fcn_exchange_chargeable_wt: [{ value: 0 }, Validators.required],
            fcn_exchange_making_rate: [{ value: 0 }, Validators.required],
            fcn_exchange_making_amt: [{ value: 0 }, Validators.required],
            fcn_exchange_net_amount: [{ value: 0 }, Validators.required],
            
        });
        this.strBranchcode = localStorage.getItem('userbranch');

    }

    ngOnInit(): void {
        this.getExchangeStockCodes();

    }

    getExchangeStockCodes() {
        // this.suntechApi
        // .getRetailsalesExchangeLookup(this.strBranchcode)
        let API = `RetailsalesExchangeLookup?BRANCH_CODE=${this.strBranchcode}&STOCK_CODE=`
        this.suntechApi
            .getDynamicAPI(API)
            .subscribe((resp) => {
                console.log(resp);
                console.log(resp.Message);
                let _data = resp.response;

                // this.all_sales_person = resp;
                var data = _data.map((t: any) => t.STOCK_CODE);
                this.exStockCodeOptions = data;
                this.exStockCodeFilteredOptions =
                    this.exchangeForm.controls.fcn_exchange_item_code.valueChanges.pipe(
                        startWith(''),
                        map((value) => this._filterExStockCodes(value))
                    );
            });
    }


    private _filterExStockCodes(value: string): string[] {
        const filterValue = value.toLowerCase() || '';

        return this.exStockCodeOptions.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }


    exchangeStockCode(event: any) {
        if (event.target.value == '') {
            let _exchangeCode = this.exchangeForm.value.fcn_exchange_item_code;
            this.exchangeForm.reset({
                fcn_exchange_item_code: _exchangeCode,
            });
        } else {
            // event.target.value = event.target.value.toString().toUpperCase();

            this.getStockforExchange(event.target.value);
        }
    }

    getStockforExchange(value: any) {

        if (value != '') {

            this.standardPurity = 0;
            console.log(this.exchangeForm.value.fcn_exchange_item_code);

            let _exchangeCode = this.exchangeForm.value.fcn_exchange_item_code;
            this.exchangeForm.reset({
                fcn_exchange_item_code: _exchangeCode,
            });
            // this.exchangeForm.controls.fcn_exchange_item_code.setValue(_exchangeCode);
            // alert(_exchangeCode);
            let _exchangeItem;
            let _karatRateRec;
            let _karatCode;
            let API = `RetailsalesExchangeLookup?BRANCH_CODE=${this.strBranchcode}&STOCK_CODE=${_exchangeCode}`
            this.suntechApi.getDynamicAPI(API)
                .subscribe((resp) => {
                    this.renderer.selectRootElement('#fcn_exchange_gross_wt').focus();

                    if (resp.status == "Success") {

                        _exchangeItem = resp.response;
                        console.table(_exchangeItem);
                        this._exchangeItemchange = _exchangeItem[0];
                        // _karatCode = _exchangeItem[0].KARAT_CODE;
                        // _karatRateRec = this.karatRateDetails.filter(function (i) {
                        //   return i.KARAT_CODE == _karatCode;
                        // });

                        this.exchangeForm.controls['fcn_exchange_item_code'].setValue(_exchangeItem[0].STOCK_CODE);

                        this.exchangeForm.controls['fcn_exchange_division'].setValue(
                            _exchangeItem[0].DIVISION_CODE
                        );
                        this.exchangeForm.controls['fcn_exchange_item_desc'].setValue(
                            _exchangeItem[0].STOCK_DESCRIPTION
                        );
                        this.exchangeForm.controls['fcn_exchange_pcs'].setValue(
                            _exchangeItem[0].PCS
                        );
                        this.exchangeForm.controls['fcn_exchange_gross_wt'].setValue(
                            _exchangeItem[0].GROSSWT
                        );
                        this.exchangeForm.controls['fcn_exchange_purity'].setValue(
                            parseFloat(_exchangeItem[0].PURITY)
                        );
                        this.standardPurity = this._exchangeItemchange.PURITY;
                        if (_exchangeItem[0].METAL_RATE_PERGMS_ITEMKARAT > 0) {
                            // if (_exchangeItem[0].METAL_RATE_PERGMS_24KARAT > 0) {
                            this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue(

                                // this.comFunc.transformDecimalVB(
                                //   this.comFunc.amtDecimals,
                                // _exchangeItem[0].METAL_RATE_PERGMS_24KARAT
                                _exchangeItem[0].METAL_RATE_PERGMS_ITEMKARAT // jebu told use this

                                // ) // type not showing so this..
                                // this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, _exchangeItem[0].METAL_RATE_PERGMS_24KARAT) // type not showing so this..
                                //  this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, _exchangeItem[0].METAL_RATE)
                                // _karatRateRec[0].KARAT_RATE
                            );
                        } else {
                            this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue('0.000000');
                        }

                        this.exchangeFormMetalRateType = _exchangeItem[0].METAL_RATE_TYPE;

                        if (_exchangeItem[0].INCLUDE_STONE == false) {
                            // this.exchangeForm.con
                            this.comFunc.formControlSetReadOnly('fcn_exchange_stone_rate', true);
                            this.comFunc.formControlSetReadOnly('fcn_exchange_stone_wt', true);
                            this.comFunc.formControlSetReadOnly(
                                'fcn_exchange_stone_amount',
                                true
                            );
                            this.comFunc.formControlSetReadOnly('fcn_exchange_net_wt', true);
                            this.comFunc.formControlSetReadOnly(
                                'fcn_exchange_chargeable_wt',
                                true
                            );
                            // this.exchangeForm.controls.fcn_exchange_stone_wt.disable();
                            // this.exchangeForm.controls.fcn_exchange_stone_wt.clearValidators();
                            this.removeValidationsForForms(this.exchangeForm, [
                                'fcn_exchange_stone_wt',
                                'fcn_exchange_stone_rate',
                                'fcn_exchange_stone_amount',
                                'fcn_exchange_net_wt',
                                'fcn_exchange_chargeable_wt',
                            ]);
                            // this.exchangeForm.controls.fcn_exchange_stone_wt.clearValidators();
                            // this.exchangeForm.controls.fcn_exchange_stone_wt.updateValueAndValidity();

                            // focus
                            // this.renderer.selectRootElement('#fcn_exchange_purity').focus();
                        } else {
                            this.comFunc.formControlSetReadOnly('fcn_exchange_net_wt', false);
                            this.comFunc.formControlSetReadOnly('fcn_exchange_stone_wt', false);
                            this.comFunc.formControlSetReadOnly('fcn_exchange_stone_rate', false);
                            this.comFunc.formControlSetReadOnly(
                                'fcn_exchange_stone_amount',
                                false
                            );
                            this.comFunc.formControlSetReadOnly(
                                'fcn_exchange_chargeable_wt',
                                false
                            );

                            // focus
                            // this.renderer.selectRootElement('#fcn_exchange_stone_wt').focus();
                        }

                    }

                });
        }

    }

    removeValidationsForForms(form: FormGroup, controlsArr: string[]) {
        controlsArr.forEach(controlName => {
            const control = form.get(controlName);
            if (control) {
                control.clearValidators();
                control.updateValueAndValidity();
            }
        });
    }

    changeExchangeStoneWt(event: any) {
        const value = event.target.value;
        if (value != '') {
            this.setExchangeNettWt();
            this.setExchangePureWt();
            this.setExStoneAmt();
            this.setExNetAmt();
            this.setExMetalAmt();

        } else {
            this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(
                this.zeroMQtyVal
            );
        }
    }

    setExchangeStoneWt() {
        const stoneWt = this.comFunc.transformDecimalVB(
            this.comFunc.mQtyDecimals,
            this.exchangeForm.value.fcn_exchange_gross_wt -
            this.exchangeForm.value.fcn_exchange_net_wt
        );
        this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(stoneWt);
    }
    setExchangeNettWt() {
        const stoneWt = this.comFunc.transformDecimalVB(
            this.comFunc.mQtyDecimals,
            this.exchangeForm.value.fcn_exchange_gross_wt -
            this.exchangeForm.value.fcn_exchange_stone_wt
        );
        this.exchangeForm.controls.fcn_exchange_net_wt.setValue(stoneWt);
    }
    setExchangePureWt() {
        const value = this.comFunc.transformDecimalVB(
            this.comFunc.mQtyDecimals,
            this.exchangeForm.value.fcn_exchange_net_wt *
            this.exchangeForm.value.fcn_exchange_purity
        );
        this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(value);
    }
    setExPurityDiff() {
        const standardValue = this.comFunc.transformDecimalVB(
            this.comFunc.mQtyDecimals,
            this.exchangeForm.value.fcn_exchange_net_wt * this.standardPurity
        );
        // console.log('')
        const pureWeight = this.comFunc.transformDecimalVB(
            this.comFunc.mQtyDecimals,
            parseFloat(standardValue) -
            parseFloat(this.exchangeForm.value.fcn_exchange_pure_weight)
        );

        this.exchangeForm.controls.fcn_exchange_purity_diff.setValue(pureWeight);
    }
    changeExNetAmt(event: any) {
        const value = event.target.value;
        if (value != '') {
        
        } else {
            this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
                this.zeroMQtyVal
            );
        }
    }

    setExStoneAmt() {
        const res = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt) *
            this.comFunc.emptyToZero(
                this.exchangeForm.value.fcn_exchange_stone_rate
            )
        );
        this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(res);
    }

    setExNetAmt() {
        this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                parseFloat(this.exchangeForm.value.fcn_exchange_metal_amount || 0) +
                parseFloat(this.exchangeForm.value.fcn_exchange_making_amt || 0) +
                parseFloat(this.exchangeForm.value.fcn_exchange_stone_amount || 0)
            )
        );
    }

    setExMetalAmt() {

        let secondArg;
        if (this.comFunc.popMetalValueOnNet == true) {
            secondArg = this.exchangeForm.value.fcn_exchange_net_wt
        } else {
            secondArg = this.exchangeForm.value.fcn_exchange_gross_wt
        }
        this.exchangeForm.controls['fcn_exchange_metal_amount'].setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                // _exchangeMetalRate * _exchangeNetWt
                this.exchangeForm.value.fcn_exchange_metal_rate *
                // this.exchangeForm.value.fcn_exchange_pure_weight
                this.comFunc.emptyToZero(secondArg)
            )
        );
    }

    changeExchangeNettWt(event: any) {
        if (event.target.value != '') {
            this.setExchangeStoneWt();
            this.setExchangePureWt();
            this.setExchangeMakingAmt();
            this.setExStoneAmt();
            this.setExNetAmt();
            this.setExMetalAmt();
        } else {
            this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(
                this.zeroAmtVal
            );
        }
    }

    setExchangeMakingAmt() {
        let _exchangeGrossWt = this.exchangeForm.value.fcn_exchange_gross_wt;
        let _exchangeNetWt = this.exchangeForm.value.fcn_exchange_net_wt;
        let _exchangeMakingRate = this.exchangeForm.value.fcn_exchange_making_rate;

        if (!this.comFunc.allbranchMaster?.MAKINGCHARGESONNET) {
            this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
                this.comFunc.transformDecimalVB(
                    this.comFunc.amtDecimals,
                    _exchangeGrossWt * _exchangeMakingRate
                )
            );
            this.setExNetAmt();
        } else {
            this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
                this.comFunc.transformDecimalVB(
                    this.comFunc.amtDecimals,
                    _exchangeNetWt * _exchangeMakingRate
                )
            );
            this.setExNetAmt();
        }
        this.setExNetAmt();
    }

    changeExMakingRate(event: any) {
        if (event.target.value != '') {
            this.setExchangeMakingAmt();
        } else {
            this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
                this.zeroAmtVal
            );
        }
    }

    changeExchangeStoneRate(event: any) {
        const value = event.target.value;
        if (event.target.value != '') {
            const res = this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(
                    this.exchangeForm.value.fcn_exchange_stone_wt
                ) * this.comFunc.emptyToZero(value)
            );
            this.setExStoneAmt();
            this.setExNetAmt();
        } else {
            const value = this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                0
            );
            this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(value);
            this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(value);
            this.setExNetAmt();
        }
    }

    changeExchangeMetalAmt(event: any) {
        if (event.target.value != '') {
            const value = this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.exchangeForm.value.fcn_exchange_metal_amount /
                this.exchangeForm.value.fcn_exchange_net_wt
            );
            this.exchangeForm.controls.fcn_exchange_metal_rate.setValue(value);
            this.setExNetAmt();
        } else {
            this.exchangeForm.controls.fcn_exchange_metal_rate.setValue(
                this.zeroAmtVal
            );
            this.setExNetAmt();
        }
    }

    convertDateWithTimeZero(date: any) {
        return date.split('T')[0] + 'T00:00:00.000Z';
    }

    setMetalPurchaseDataPost() {

        console.log('this.invMetalPurchaseTotalPcs ', this.invMetalPurchaseTotalPcs);

        // console.log('fcn_exchange_metal_rate - value ',this.exchangeForm.value.fcn_exchange_metal_rate, ' val');
        // alert(this.exchangeForm.value.fcn_exchange_metal_rate);
        this.metalPurchaseDataPost = {
            'POPCUSTCODE': this.customerDetails['CODE'] || '',
            MID: this.metalPurchaseDataMID,
            BRANCH_CODE: this.strBranchcode,
            VOCTYPE: 'PEP',
            // VOCTYPE: 'POP',
            // VOCTYPE: this.vocType,
            // VOCNO: this.vocDataForm.value.fcn_voc_no,
            VOCNO: this.metalPurchaseDataVocNo,
            VOCDATE: this.convertDateWithTimeZero(
                new Date(this.vocDataForm.value.vocdate).toISOString()
            ),
            YEARMONTH: this.baseYear,
            PARTYCODE: this.comFunc.basePartyCode,
            PARTY_CURRENCY: this.comFunc.compCurrency,
            PARTY_CURR_RATE: 1,
            ITEM_CURRENCY: this.comFunc.compCurrency,
            ITEM_CURR_RATE: 1,
            VALUE_DATE: this.vocDataForm.value.vocdate,
            SALESPERSON_CODE: this.vocDataForm.value.sales_person, //need
            RATE_TYPE: this._exchangeItemchange?.METAL_RATE_TYPE || '', //need_input
            METAL_RATE: this._exchangeItemchange?.METAL_RATE || 0, //need_input
            // METAL_RATE: this._exchangeItemchange?.METAL_RATE_PERGMS_24KARAT || 0, //need_input
            // METAL_RATE: this.exchangeForm.value.fcn_exchange_metal_rate || 0, //need_input
            FIXED: 1,
            TOTAL_PCS: this.comFunc.emptyToZero(this.invMetalPurchaseTotalPcs),
            TOTAL_GRWT: this.comFunc.emptyToZero(
                this.invMetalPurchaseTotalGrossWeight
            ),
            TOTAL_PUWT: this.comFunc.emptyToZero(
                this.invMetalPurchaseTotalPureWeight
            ),

            TOTAL_MKGVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalMakingAmt)
            ),
            TOTAL_MKGVALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalMakingAmt)
            ),
            // TOTAL_MKGVALUE_FC: this.comFunc.emptyToZero(
            //   this.order_total_exchange
            // ),
            // TOTAL_MKGVALUE_CC: this.comFunc.FCToCC(
            //   this.comFunc.compCurrency,
            //   this.comFunc.emptyToZero(this.order_total_exchange)
            // ),
            TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalMetalAmt)
            ),
            TOTAL_METALVALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalMetalAmt)
            ),
            TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.invMetalPurchaseTotalStoneAmt
            ),
            TOTAL_STONEVALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalStoneAmt)
            ),
            TOTAL_PUDIFF: this.comFunc.emptyToZero(
                this.invMetalPurchaseTotalPurityDiff
            ), //need
            TOTAL_STONEDIFF: 0, //need_input
            ITEM_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), //need_input,
            ITEM_VALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), //need_input
            PARTY_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), //need_input
            PARTY_VALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), //need_input
            NET_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ),
            NET_VALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ),
            ADDL_VALUE_FC: 0,
            ADDL_VALUE_CC: 0,
            GROSS_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ),
            GROSS_VALUE_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), //need_input
            REMARKS: '',
            FLAG_EDIT_ALLOW: 'N',
            // FLAG_EDIT_ALLOW: 'Y',
            TOTAL_OZWT: this.comFunc.emptyToZero(this.invMetalPurchaseTotalOzWt), //need_input
            ROUND_VALUE_CC: 0, //need_input
            NAVSEQNO: 0, //need
            SUPINVNO: '',
            SUPINVDATE: this.vocDataForm.value.vocdate, //need_input
            SYSTEM_DATE: new Date().toISOString(),
            FLAG_UPDATED: 'N',
            FLAG_INPROCESS: 'N',
            PURCHASEFIXINGAMTLC: 0,
            PURCHASEFIXINGAMTFC: 0,
            PURCHASEFIXINGMID: 0,
            PURCHASEFIXINGREF: '',
            PURCHASEFIXINGPUREWT: 0,
            PURCHASEFIXINGRATE: '',
            D2DTRANSFER: 'F', //need_input
            HHACCOUNT_HEAD: '',
            OUSTATUS: true,
            OUSTATUSNEW: 1, //need_input
            CURRRECMID: 0, //NEED_INPUT
            CURRRECVOCTYPE: '', //NEED_INPUT
            CURRRECREF: '', //need_input
            CURRRECAMOUNTFC: 0,
            CURRRECAMOUNTCC: 0,
            TOTAL_DISCOUNTWT: 0, //need_input
            CUSTOMER_NAME: '', //need_input
            MACHINEID: '', //need_input
            AUTOPOSTING: false, //need_input
            AUTHORIZEDPOSTING: true,
            CANCELLEDPOSTING: false,
            PURITYQUALITYCHECK: false,
            CREDITDAY: 0,
            POSTDATE: this.vocDataForm.value.vocdate, //need
            SALESPERSON_NAME: this.salespersonName, //need
            TOTAL_AMT_FC: 0,
            TOTAL_WASTQTY: 0,
            TESTINGPARTY: '',
            TESTINGPARTYWT: 0,
            TESTINGPARTYREMARKS: '',
            TESTINGPARTYWTRECEIVED: 0,
            DOC_DISCMTLRATE: 0,
            REPAIR_REF: '',
            HLOCTYPE_CODE: '',
            HTUSERNAME: this.strUser || '',
            MHIDCATEGORY: '',
            MHCUSTIDNO: '',
            GENSEQNO: 0, //need
            ShipmentCompany: '',
            Shipmentport: '',
            POSCUSTIDNO: this.customerDetails?.CODE || '',
            HVAT_AMOUNT_CC: 0,
            HVAT_AMOUNT_FC: 0,
            HTOTALAMOUNTWITHVAT_CC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ),
            HTOTALAMOUNTWITHVAT_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
            ), // need_input
            INTERNALUNFIX: false,
            InternalFixedQty: 0,
            DIRECTFIXINGREF: '',
            placeofsupply: '',
            TOTAL_WASTAGE_AMOUNTFC: 0,
            TOTAL_WASTAGE_AMOUNTCC: 0,
            Discount_PerGrm: 0,
            FROM_TOUCH: false,
            TAX_Applicable: false,
            POSPricesFixed: false,
            CUSTOMER_ADDRESS:
                this.customerDetailForm.value.fcn_cust_detail_address || '',
            H_DECLARATIONNO: '',
            H_ORIGINCOUNTRY: '',
            H_PACKETNO: 0,
            H_DECLARATIONDATE: this.vocDataForm.value.vocdate,
            PartyRoundValueFc: 0, 
            ItemRoundValueFc: 0,
            H_Shipper: '',
            H_Miner: '',
            H_Basis: '',
            H_Destination: '',
            H_ShipmentMode: '',
            H_AirwayBill: '',
            VATAmountFCRound: 0,
            VATONMAKING: false, 
            OT_TRANSFER_TIME: '',
            QRCODEIMAGE: '',
            QRCODEVALUE: '',
            VATAmountFCRoundCC: 0,
            CALCULATEPARTYVATONMAKINGONLY: 0,
            VATAMOUNTMakingONLYCC: 0,
            IMPEXPDOC_TYPE: 0,
            Exclude_VAT: false, // need_input
            PARTYTRANSEWISE_METALVATONMAKING: false,
            PARTYTRANSEWISE_DESIGNATEDZONE: false,

            'PARTYADDRESS': '',
            'REP_REF': '',
            'BASE_CURRENCY': '',
            'BASE_CURR_RATE': '0',
            'BASE_CONV_RATE': '0',
            'INCLUSIVE': 0,
            'PRINT_COUNT': '0',
            'DOC_REF': '',
            'FIXED_QTY': '0.000',
            'GST_REGISTERED': false,
            'GST_STATE_CODE': '0',
            'GST_NUMBER': '',
            'GST_TYPE': '',
            'GST_TOTALFC': '0.000',
            'GST_TOTALCC': '0.000',
            'CUSTOMER_MOBILE': '',
            'CUSTOMER_EMAIL': '',
            'GST_GROUP': '',
            'FIXING_PROCESS': false,
            'TOTAL_ADDL_TAXFC': '0.000',
            'TOTAL_ADDL_TAXCC': '0.000',
            'REF_JOBCREATED': false,
            'EXCLUDEVAT': false,
            'TEST_BRANCH_CODE': '',
            'TEST_VOCTYPE': '',
            'TEST_VOCNO': '0',
            'TEST_YEARMONTH': '',
            'TDS_CODE': '',
            'TDS_APPLICABLE': false,
            'TDS_TOTALFC': '0.000',
            'TDS_TOTALCC': '0.000',

            'SHIPPER_CODE': '',
            'SHIPPER_NAME': '',
            'ORIGIN_COUNTRY': '',
            'DESTINATION_STATE': '',
            'DESTINATION_COUNTRY': '',
            'MINING_COMP_CODE': '',
            'MINING_COMP_NAME': '',
            'AIRWAY_BILLNO': '',
            'AIRWAY_BILLDATE': this.dummyDate,
            'AIRWAY_WEIGHT': '0.000',
            'ARIVAL_DATE': this.dummyDate,
            'CLEARENCE_DATE': this.dummyDate,
            'BOE_FILLINGDATE': this.dummyDate,
            'BOE_NO': '',
            'PO_IMP': '0',
            'SILVER_RATE_TYPE': '',
            'SILVER_RATE': '0.000000',
            'TOTAL_SILVERWT': '0.000',
            'TOTAL_SILVERVALUE_FC': '0.000',
            'TOTAL_SILVERVALUE_CC': '0.000',
            'PO_REFNO': '',
            'MINING_COMP_REFNO': '',
            'PARTY_ROUNDOFF': '0.000',
            'TRANSPORTER_CODE': '',
            'VEHICLE_NO': '',
            'LR_NO': '',
            'AIR_BILL_NO': '',
            'SHIPCODE': '',
            'SHIPDESC': '',
            'STAMPCHARGE': false,
            'TOTSTAMP_AMTFC': '0.000',
            'TOTSTAMP_AMTCC': '0.000',
            'TOTSTAMP_PARTYAMTFC': '0.000',
            'REFPURIMPORT': '',
            'BOE_EXPIRY_DATE': this.dummyDate,
            'H_BILLOFENTRYREF': '',
            'SUB_LED_ACCODE': '',
            'ACTIVITY_CODE': '',
            'TCS_ACCODE': '',
            'TCS_AMOUNT': '0.000',
            'TCS_AMOUNTCC': '0.000',
            'TCS_APPLICABLE': false,
            'DISCOUNTPERCENTAGE': '0.000',
            'CUSTOMER_CODE': '',
            'IMPORTINPURCHASE': false,
            'SL_CODE': '',
            'SL_DESCRIPTION': '',
            'CNT_ORIGIN': '',
            'FREIGHT_RATE': '0',
            'TDS_PER': '0.000',
            'TDS_TOPARTY': false,
            'LONDONFIXING_TYPE': '0',
            'LONDONFIXING_RATE': '0.000',
            'PARTYROUNDOFF': '0.000',
            'NOTIONAL_PARTY': false,
            'METAL_CONV_CURR': '',
            'METAL_CONV_RATE': '0.000000',
            'CHECK_HEDGINGBAL': false,
            'IMPORTINSALES': false,
            'AUTOGENMID': '0',
            'AUTOGENVOCTYPE': '',
            'AUTOGENREF': '',
            'PRINT_COUNT_ACCOPY': '0',
            'PRINT_COUNT_CNTLCOPY': '0',
            "PURITYQUALITYREMARKS": '',
            "PARTYTRANSWISE_DESIGNATEDZONE": false,

            "SHIP_ACCODE": "",
            "SHIP_STATE_CODE": "",
            "DISPATCH_NAME": "",
            "DISPATCH_ADDRESS": "",
            "DISPATCH_STATE_CODE": "",
            "TRANSPORTER_ID": "",
            "TRANSPORTER_MODE": "",
            "TRANSPORT_DISTANCE": 0,
            "TRANSPORT_DATE": this.dummyDate,
            "VEHICLE_TYPE": "",
            "DISPATCH_CITY": "",
            "DISPATCH_ZIPCODE": 0,
            "EWAY_TRANS_TYPE": "",
            "CREDIT_DAYSMTL": 0,
            "VALUE_DATEMTL": this.dummyDate,
            "PARTY_STATE_CODE": "",

            metalPurchaseDetails: this.currentExchangeMetalPurchase,

        };
    }
    addItemtoExchange(btn: any) {
        let _exchangeDiv = this.exchangeForm.value.fcn_exchange_division;
        let _exchangeItemCode = this.exchangeForm.value.fcn_exchange_item_code;
        let _exchangeItemDesc = this.exchangeForm.value.fcn_exchange_item_desc;
        let _exchangePurity = this.exchangeForm.value.fcn_exchange_purity;
        let _exchangeMetalRate = this.exchangeForm.value.fcn_exchange_metal_rate;
        let _exchangeMetalAmt = this.exchangeForm.value.fcn_exchange_metal_amount;
        let _exchangeMkgAmt = this.exchangeForm.value.fcn_exchange_making_amt;
        let _exchangeNetAmt = this.exchangeForm.value.fcn_exchange_net_amount;

        let _exchangePcs = this.exchangeForm.value.fcn_exchange_pcs;
        let _exchangeWeight = this.exchangeForm.value.fcn_exchange_net_wt;

        console.log(_exchangeMetalAmt);


        if (
            this.exchangeForm.value.fcn_exchange_item_code != '' &&
            _exchangeMetalAmt > 0 &&
            _exchangeMetalAmt != '' &&
            _exchangeNetAmt > 0 &&
            _exchangeNetAmt != ''
        ) {
            // if (items_length == 0) this.exchange_items_slno_length = 1;
            // else
            //   this.exchange_items_slno_length = this.exchange_items_slno_length + 1;
            let itemsLengths = this.exchange_items[this.exchange_items.length - 1];
            console.log('itemsLengths ex', itemsLengths);

            if (
                this.exchangeItemEditId == '' ||
                this.exchangeItemEditId == undefined ||
                this.exchangeItemEditId == null
            ) {
                if (itemsLengths == undefined) itemsLengths = 1;
                else itemsLengths = itemsLengths.ID + 1;
                this.exchange_items_slno_length = itemsLengths;

                console.log('itemsLengths ex add', itemsLengths);

            } else {
                itemsLengths = this.exchangeItemEditId;
                this.exchange_items_slno_length = itemsLengths;
            }

            console.log('=====================this.exchange_items_slno_length===============');
            console.log(this.exchange_items_slno_length);
            console.log(this.exchange_items);
            console.log('====================================');
            var values = {
                ID: this.exchange_items_slno_length,
                sn_no: this.exchange_items_slno_length,
                stock_code: _exchangeItemCode,
                mkg_amount: _exchangeMkgAmt,
                total_amount: _exchangeMetalAmt,
                pcs: _exchangePcs,
                weight: _exchangeWeight, // nett weight
                description: _exchangeItemDesc,
                tax_amount: '0',
                net_amount: _exchangeNetAmt,
                metalRate: _exchangeMetalRate,
                metalAmt: _exchangeMetalAmt,

                // need to update
                gross_wt: this.exchangeForm.value.fcn_exchange_gross_wt || 0,
                pure_wt: this.exchangeForm.value.fcn_exchange_pure_weight || 0,
                stone_amt: this.exchangeForm.value.fcn_exchange_stone_amount || 0,
                purity_diff: this.exchangeForm.value.fcn_exchange_purity_diff || 0,
                // gross_amt: this.lineItemForm.value.fcn_li_gross_amount || 0,
                METAL_RATE_TYPE: this._exchangeItemchange?.METAL_RATE_TYPE,
                METAL_RATE: this._exchangeItemchange?.METAL_RATE,
                // METAL_RATE: this._exchangeItemchange?.METAL_RATE,
                METAL_RATE_PERGMS_ITEMKARAT:
                    this._exchangeItemchange?.METAL_RATE_PERGMS_ITEMKARAT,
                ozWeight: this.setOzWt(),
            };

            // this.exchange_items.push(values);
            if (
                this.exchangeItemEditId == '' ||
                this.exchangeItemEditId == undefined ||
                this.exchangeItemEditId == null
            ) {
                this.exchange_items.push(values);
                this.newExchangeItem.emit(this.exchange_items);
            } else {
                // this.exchange_items[this.exchangeItemEditId - 1] = values;
                // this.exchangeItemEditId = '';
                // alert(this.exchangeItemEditId)
                const preitemIndex = this.exchange_items.findIndex((data: any) => {
                    // console.table(data);
                    console.table(data.sn_no == this.exchangeItemEditId);
                    return data.sn_no == this.exchangeItemEditId;
                });
                // alert(preitemIndex)
                console.log('====================================');
                console.log(this.exchange_items);
                console.log('====================================');
                if (preitemIndex != -1) {
                    values.sn_no = this.exchangeItemEditId;
                    this.exchange_items[preitemIndex] = values;
                    console.log(
                        '==============this.exchange_items[preitemIndex]======================'
                    );
                    console.log(values);
                    console.log('====================================');
                }
            }

            this.setExchangeMetalItems(this.exchange_items_slno_length, values);
            this.setExchangeMetalGstItems(this.exchange_items_slno_length, values);
            // alert('metal detail added');

            this.exchangeForm.controls['fcn_exchange_division'].setValue('');
            this.exchangeForm.controls['fcn_exchange_item_desc'].setValue('');
            this.exchangeForm.controls['fcn_exchange_item_code'].setValue('');
            this.exchangeForm.controls['fcn_exchange_purity'].setValue('');
            this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue('');
            this.exchangeForm.controls['fcn_exchange_metal_amount'].setValue('');
            if (btn == 'saveBtn') 
                this.modal.dismiss('Cross click');
            this.sumTotalValues();

            this.setMetalPurchaseDataPost();
        } else {
            // alert('Invalid Metal Amount');
            if (this.exchangeForm.value.fcn_exchange_item_code == '') {
                this.openDialog('Warning', 'Stock code should not be empty', true);
            }
            if (_exchangeMetalAmt == '' || 0)
                this.openDialog('Warning', 'Invalid Metal Amount', true);
            if (_exchangeNetAmt == '' || 0)
                this.openDialog('Warning', 'Invalid Net Amount', true);
        }
    }


    openDialog(title: any, msg: any, okBtn: any, swapColor = false) {
        this.dialogBox = this.dialog.open(DialogboxComponent, {
            width: '40%',
            disableClose: true,
            data: { title, msg, okBtn, swapColor },
        });
    }

    setOzWt() {
        this.ozWeight = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            parseFloat(this.exchangeForm.value.fcn_exchange_pure_weight || 0) /
            31.1035
        );
        return this.ozWeight;
    }


    setExchangeMetalItems(slno: any, data: any) {
        console.log('fcn_exchange_metal_rate - value ', this.exchangeForm.value.fcn_exchange_metal_rate, ' val');
        console.log('ssssssssss', this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.comFunc.emptyToZero(data.METAL_RATE_PERGMS_ITEMKARAT)
        ));


        // MAKINGCHARGESONNET
        let temp_exchange_items_metal = {
            UNIQUEID: '0',
            SRNO: slno,
            DIVISION_CODE: this.exchangeForm.value.fcn_exchange_division,
            STOCK_CODE: data.stock_code || '', // m
            PCS: this.exchangeForm.value.fcn_exchange_pcs || 0, //m
            GROSSWT: this.exchangeForm.value.fcn_exchange_gross_wt || 0,
            STONEWT: this.exchangeForm.value.fcn_exchange_stone_wt || 0, // m
            NETWT: this.exchangeForm.value.fcn_exchange_net_wt || 0, // m
            PURITY: this.exchangeForm.value.fcn_exchange_purity || 0, // m
            // PUREWT: (this.exchangeForm.value.fcn_exchange_purity || 0), // m
            // PUDIFF: 0.0,
            PUREWT: this.exchangeForm.value.fcn_exchange_pure_weight || 0,

            CHARGABLEWT: this.exchangeForm.value.fcn_exchange_chargeable_wt || 0, // defaultNetTotal weight
            MKG_RATEFC: this.exchangeForm.value.fcn_exchange_making_rate || 0, //need
            MKG_RATECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.exchangeForm.value.fcn_exchange_making_rate
            ),

            // this.comFunc.CCToFC(
            //   this.comFunc.compCurrency,
            //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
            // ), // cctofc rate

            MKGVALUEFC: this.exchangeForm.value.fcn_exchange_making_amt, // metal amount
            MKGVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.exchangeForm.value.fcn_exchange_making_amt
            ), // metal amount
            // MKGVALUEFC: this.comFunc.emptyToZero(data.mkg_amount), // metal amount
            // MKGVALUECC: this.comFunc.FCToCC(
            //   this.comFunc.compCurrency,
            //   this.comFunc.emptyToZero(data.mkg_amount)
            // ), // metal amount
            RATE_TYPE: data.METAL_RATE_TYPE || '',
            METAL_RATE: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_rate),
            // METAL_RATE: this.comFunc.emptyToZero(data.METAL_RATE),
            // METAL_RATE: this.comFunc.emptyToZero(data.metalRate),

            METAL_RATE_GMSFC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(data.METAL_RATE_PERGMS_ITEMKARAT)
            ), //need
            METAL_RATE_GMSCC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(data.METAL_RATE_PERGMS_ITEMKARAT)
            ), //need
            METALVALUEFC: this.comFunc.emptyToZero(data.metalAmt),
            METALVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(data.metalAmt)
            ),
            STONE_RATEFC: this.exchangeForm.value.fcn_exchange_stone_rate || 0,
            STONE_RATECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(
                    this.exchangeForm.value.fcn_exchange_stone_rate
                )
            ),
            STONEVALUEFC: this.exchangeForm.value.fcn_exchange_stone_amount || 0,
            STONEVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(
                    this.exchangeForm.value.fcn_exchange_stone_amount
                )
            ),
            NETVALUEFC: this.exchangeForm.value.fcn_exchange_net_amount,
            NETVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(
                    this.exchangeForm.value.fcn_exchange_net_amount
                )
            ),
            PUDIFF: this.exchangeForm.value.fcn_exchange_purity_diff || 0, // need_input
            STONEDIFF: 0.0, //need_input
            PONO: 0, // need_input
            LOCTYPE_CODE: '', // need_input
            OZWT: data.ozWeight || 0, // need_input
            SUPPLIER: '', // need_input
            BATCHSRNO: 0, // need_input
            STOCK_DOCDESC: this.exchangeForm.value.fcn_exchange_item_desc || '',
            BAGNO: '',
            BAGREMARKS: '',
            WASTAGEPER: 0.0,
            WASTAGEQTY: 0.0,
            WASTAGEAMOUNTFC: 0.0,
            WASTAGEAMOUNTCC: 0.0,
            MKGMTLNETRATE: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                data.METAL_RATE_PERGMS_ITEMKARAT
            ),
            // MKGMTLNETRATE: this.comFunc.transformDecimalVB(
            //   this.comFunc.amtDecimals,
            //   parseFloat(this.exchangeForm.value.fcn_exchange_making_rate) +
            //   this.exchangeForm.value.fcn_exchange_metal_rate
            // ),
            MCLENGTH: 0,
            MCUNIT: 0,
            SORDER_REF: '',
            BARCODEDQTY: 0,

            RUBY_WT: 0.0,
            RUBY_RATE: 0.0,
            RUBY_AMOUNTFC: 0.0,
            RUBY_AMOUNTCC: 0.0,
            EMERALD_WT: 0.0,
            EMERALD_RATE: 0.0,
            EMERALD_AMOUNTFC: 0.0,
            EMERALD_AMOUNTCC: 0.0,
            SAPPHIRE_WT: 0.0,
            SAPPHIRE_RATE: 0.0,
            SAPPHIRE_AMOUNTFC: 0.0,
            SAPPHIRE_AMOUNTCC: 0.0,
            ZIRCON_WT: 0.0,
            ZIRCON_RATE: 0.0,
            ZIRCON_AMOUNTFC: 0.0,
            ZIRCON_AMOUNTCC: 0.0,
            COLOR_STONE_WT: 0.0,
            COLOR_STONE_RATE: 0.0,
            COLOR_STONE_AMOUNTFC: 0.0,
            COLOR_STONE_AMOUNTCC: 0.0,

            DISCOUNTWT: 0,
            DISCOUNTPUWT: 0,
            REPITEMCODE: '',
            MTL_SIZE: '',
            MTL_COLOR: '',
            MTL_DESIGN: '',
            BARCODE: '',
            ORDER_STATUS: false,
            PORDER_REF: '',
            BARCODEDPCS: '0',
            DT_BRANCH_CODE: this.strBranchcode,
            DT_VOCNO: 0, // to 0
            DT_VOCTYPE: 'EST', // change
            DT_YEARMONTH: this.baseYear,
            SUPPLIERDISC: '',
            DTKarat: 0,
            JAWAHARAYN: 0,
            RESALERECYCLE: 0,
            CASHEXCHANGE: 0,
            C1_CATEGORY: '',
            C2_CATEGORY: '',
            C3_CATEGORY: '',
            C4_CATEGORY: '',
            C5_CATEGORY: '',
            C6_CATEGORY: '',
            VATCODE: '',
            HSNCODE: '',
            VAT_PER: 0,
            VAT_AMOUNTCC: 0,
            VAT_AMOUNTFC: 0,
            TOTALAMOUNTWITHVATCC: 0,
            TOTALAMOUNTWITHVATFC: 0,

            // TOTALAMOUNTWITHVATCC: this.comFunc.FCToCC(
            //   this.comFunc.compCurrency,
            //   this.comFunc.emptyToZero(data.total_amount)
            // ),
            // TOTALAMOUNTWITHVATFC: this.comFunc.emptyToZero(data.total_amount),
            DetailPCS: 0,
            SAMEBARCODEPURCHASE: 0,
            REEXPORTYN: 0,
            DECLARATIONNO: '',
            D_Remarks: '',
            PREMIUM_CURRENCY: '',
            PREMIUM_CURR_RATE: 0,
            PREMIUM_RATE_TYPE: '',
            PREMIUM_METAL_RATEFC: 0,
            PREMIUM_METAL_RATECC: 0,
            PREMIUM_TOTALAMOUNTCC: 0,
            PREMIUM_TOTALAMOUNTFC: 0,
            Done_ReExportYN: false,
            SLIVERPURITYPER: 0,
            MDESIGN_CODE: '',
            DUSTWT: 0,
            SALES_REF: '',
            OT_TRANSFER_TIME: '',
            VATAMOUNTMETALONLY: 0,
            VATAMOUNTMETALONLYCC: 0,

            "BASE_CONV_RATE": this.zeroAmtVal,
            "WASTAGE_PURITY": this.zeroAmtVal,
            "PUDIFF_AMTLC": this.zeroAmtVal,
            "PUDIFF_AMTFC": this.zeroAmtVal,
            "TAX_AMOUNTFC": this.zeroAmtVal,
            "TAX_AMOUNTCC": this.zeroAmtVal,
            "TAX_P": '0',
            "LOT_NO": '',
            "BAR_NO": '',
            "TICKET_NO": '',
            "PENALTY": '0.000',
            "TOTAL_AMOUNTFC": '0.000',
            "TOTAL_AMOUNTCC": '0.000',
            "CGST_PER": '0.000',
            "CGST_AMOUNTFC": '0.000',
            "CGST_AMOUNTCC": '0.000',
            "SGST_PER": '0.000',
            "SGST_AMOUNTFC": '0.000',
            "SGST_AMOUNTCC": '0.000',
            "IGST_PER": '0.000',
            "IGST_AMOUNTFC": '0.000',
            "IGST_AMOUNTCC": '0.000',
            "CGST_ACCODE": '',
            "SGST_ACCODE": '',
            "IGST_ACCODE": '',
            "UNITWT": '0.000000',
            "CGST_CTRLACCODE": '',
            "SGST_CTRLACCODE": '',
            "IGST_CTRLACCODE": '',
            "HSN_CODE": '',
            "GST_ROUNDOFFFC": '0.00',
            "GST_ROUNDOFFCC": '0.00',
            "ROUNDOFF_ACCODE": '',
            "OLD_GOLD_TYPE": '',
            "OUTSIDEGOLD": false,
            "KUNDAN_PCS": '0',
            "KUNDAN_CARAT": '0.000',
            "KUNDAN_RATEFC": '0.000',
            "KUNDAN_RATECC": '0.000',
            "KUNDAN_WEIGHT": '0.000',
            "KUNDANVALUEFC": '0.000',
            "KUNDANVALUECC": '0.000',
            "KUNDAN_UNIT": '0',
            "TDS_CODE": '',
            "TDS_PER": '0.00',
            "TDS_TOTALFC": '0.000',
            "TDS_TOTALCC": '0.000',
            "SILVER_PURITY": '0.00000000',
            "SILVER_PUREWT": '0.000',
            "SILVER_RATE_TYPE": '',
            "SILVER_RATE": '0.000000',
            "SILVER_RATEFC": '0.000000',
            "SILVER_RATECC": '0.000000',
            "SILVER_VALUEFC": '0.000',
            "SILVER_VALUECC": '0.000',
            "OZGOLD_PUREWT": '0.000',
            "OZSILVER_PUREWT": '0.000',
            "CONV_FACTOR_OZ": '0.000000',
            "PUR_REF": '',
            "BATCHID": '1',
            "STAMPCHARGE_RATEFC": '0.000000',
            "STAMPCHARGE_RATECC": '0.000000',
            "STAMPCHARGE_AMTFC": '0.000',
            "STAMPCHARGE_AMTCC": '0.000',
            "STAMPCHARGE": false,
            "ACTUALGROSSWT": '439.600',
            "ACTUALPURITY": '0.75000000',
            "MELTINGLOSS": '0.000',
            "DRAFTIMPORTFLG": false,
            "FIXMID": '0',
            "FIXVOCTYPE": '',
            "FIXVOCNO": '0',
            "FIXBRANCH": '',
            "FIXYEARMONTH": '',
            "FIXSRNO": '0',
            "FIX_STOCKCODE": '',
            "IMPORT_REF": '',
            "PRICE1CODE": '',
            "PRICE2CODE": '',
            "PRICE3CODE": '',
            "PRICE4CODE": '',
            "PRICE5CODE": '',
            "PRICE1_VALUECC": '0.000',
            "PRICE1_VALUEFC": '0.000',
            "PRICE2_VALUECC": '0.000',
            "PRICE2_VALUEFC": '0.000',
            "PRICE3_VALUECC": '0.000',
            "PRICE3_VALUEFC": '0.000',
            "PRICE4_VALUECC": '0.000',
            "PRICE4_VALUEFC": '0.000',
            "PRICE5_VALUECC": '0.000',
            "PRICE5_VALUEFC": '0.000',
            "MKGPREMIUMACCODE": '',
            "DETLINEREMARKS": '',
            "MUD_WT": '0.000',
            "GST_CODE": 'VAT',
            "HALLMARKING": '',
            "DISCAMTFC": '0.000',
            "DISCAMTCC": '0.000',
            "DISCPER": '0.000',
            "MARGIN_PER": '0.000',
            "MARGIN_AMTFC": '0.000',
            "MARGIN_AMTCC": '0.000',
            "Picture_Path": '',
            "ORIGINAL_COUNTRY": '',
            "DET_KPNO": '',
            "SERVICE_ACCODE": '',
            "taxcode": '',
            "COLOR": '',
            "CLARITY": '',
            "SIZE": '',
            "SHAPE": '',
            "SIEVE": '',
            "KPNUMBER": '',
        };

        temp_exchange_items_metal.SRNO = slno;

        // this.currentExchangeMetalPurchase.push(temp_exchange_items_metal);
        if (
            this.exchangeItemEditId == '' ||
            this.exchangeItemEditId == undefined ||
            this.exchangeItemEditId == null
        ) {
            this.currentExchangeMetalPurchase.push(temp_exchange_items_metal);
        } else {
            // this.currentExchangeMetalPurchase[this.exchangeItemEditId - 1] =

            //   temp_exchange_items_metal;
            const preitemIndex = this.currentExchangeMetalPurchase.findIndex(
                (data: any) => data.SRNO == temp_exchange_items_metal.SRNO
            );
            if (preitemIndex != -1) {
                temp_exchange_items_metal.SRNO = this.exchangeItemEditId;
                this.currentExchangeMetalPurchase[preitemIndex] =
                    temp_exchange_items_metal;
            } else {
                this.currentExchangeMetalPurchase.push(temp_exchange_items_metal);
            }
            this.exchangeItemEditId = '';
        }
        this.metalPurchaseMain.MetalPurchaseDetails =
            this.currentExchangeMetalPurchase;
        console.log(this.metalPurchaseMain);
    }

    setExchangeMetalGstItems(slno: any, items: any) {
        let temp_exchange_items_gst = {
            UNIQUEID: 1.1,
            DT_BRANCH_CODE: 'sample string 2',
            DT_VOCTYPE: 'sample string 3',
            DT_VOCNO: 4.1,
            DT_YEARMONTH: 'sample string 5',
            STOCK_CODE: 'sample string 6',
            GST_CODE: 'sample string 7',
            GST_TYPE: 'sample string 8',
            SRNO: 9,
            CGST_ACCODE: 'sample string 10',
            SGST_ACCODE: 'sample string 11',
            IGST_ACCODE: 'sample string 12',
            CGST_CTL_ACCODE: 'sample string 13',
            SGST_CTL_ACCODE: 'sample string 14',
            IGST_CTL_ACCODE: 'sample string 15',
            CGST_PER: 16.1,
            SGST_PER: 17.1,
            IGST_PER: 18.1,
            CGST_AMOUNTFC: 19.1,
            CGST_AMOUNTLC: 20.1,
            SGST_AMOUNTFC: 21.1,
            SGST_AMOUNTLC: 22.1,
            IGST_AMOUNTFC: 23.1,
            IGST_AMOUNTLC: 24.1,
            TOTAL_GST_AMOUNTFC: 25.1,
            TOTAL_GST_AMOUNTLC: 26.1,
            TOTAL_GST_PER: 27.1,
            BATCHID: 28.1,
        };

        temp_exchange_items_gst.SRNO = slno;

        this.currentExchangeMetalPurchaseGst.push(temp_exchange_items_gst);
        this.metalPurchaseMain.MetalPurchaseGst =
            this.currentExchangeMetalPurchaseGst;
        console.log(this.metalPurchaseMain);
    }

    getExchangeNwtWt(event: any) {
        const value = event.target.value;
        if (value != '' && value != 0) {
            let _exchangeGrossWt = this.exchangeForm.value.fcn_exchange_gross_wt;
            let _exchangeStoneWt = this.exchangeForm.value.fcn_exchange_stone_wt;
            let _exchangePureWt = this.exchangeForm.value.fcn_exchange_pure_weight;
            let _exchangeNetWt = _exchangeGrossWt - _exchangeStoneWt;
            let _exchangeMetalRate = this.exchangeForm.value.fcn_exchange_metal_rate;
            this.exchangeForm.controls['fcn_exchange_net_wt'].setValue(
                _exchangeNetWt
            );
            this.exchangeForm.controls['fcn_exchange_chargeable_wt'].setValue(
                event.target.value
            );

            this.changeExchangeNettWt({ target: { value: _exchangeGrossWt } });
            this.setOzWt();
            this.setExchangeMakingAmt();
            this.setExMetalAmt();
            this.setExNetAmt();
            // focus
            this.setFocusBasedExchangeStone();
        } else {
            // focus
            // this.setFocusBasedExchangeStone();
            this.openDialog('Warning', this.comFunc.getMsgByID('MSG1303'), true);
        }
    }

    setFocusBasedExchangeStone() {
        if (this._exchangeItemchange.INCLUDE_STONE == false) {
            // focus
            this.renderer.selectRootElement('#fcn_exchange_purity').focus();
        } else {
            // focus
            this.renderer.selectRootElement('#fcn_exchange_stone_wt').focus();
        }
    }

    changeExPurity(event: any) {
        // alert('called')
        // && this.comFunc.enforceMinMax(event.target)
        const value = event.target.value;
        if (value != '') {
            if (value <= this._exchangeItemchange?.PURITY_FROM) {
                // this.exchangeForm.controls.fcn_exchange_purity.setValue(event.target.min);
                this.exchangeForm.controls.fcn_exchange_purity.setValue(
                    this.standardPurity
                );
                this.openDialog('Warning', this.comFunc.getMsgByID('MSG1696'), true);
            }
            if (value >= this._exchangeItemchange?.PURITY_TO) {
                this.openDialog('Warning', this.comFunc.getMsgByID('MSG1699'), true);
                this.exchangeForm.controls.fcn_exchange_purity.setValue(
                    this.standardPurity
                );
            }
            this.setExchangePureWt();
            this.setExPurityDiff();
        } else {
            this.exchangeForm.controls.fcn_exchange_purity.setValue(
                this.standardPurity
            );
        }
    }

    sumTotalValues() {
        /* line items start */
        let total_pcs = 0;
        let total_weight = 0;
        let total_pure_weight = 0;
        let total_making_amt = 0;
        let total_metal_amt = 0;
        let total_stone_amt = 0;
        let total_dis_amt = 0;
        let total_gross_amt = 0;
        let total_sum = 0;
        let tax_sum = 0;
        let net_sum = 0;
        /* line items end */

        let total_sales_return_sum = 0;
        let total_exchange = 0;
        let total_received_amount = 0;

        this.ordered_items.forEach(function (item:any) {
            console.log('item---------------------', item);

            total_sum = total_sum + parseFloat(item.total_amount);
            tax_sum = tax_sum + parseFloat(item.tax_amount);
            net_sum = net_sum + parseFloat(item.net_amount);
            total_pcs = total_pcs + item.pcs;
            total_weight = total_weight + parseFloat(item.weight);
            total_pure_weight = total_pure_weight + parseFloat(item.pure_wt);
            total_making_amt = total_making_amt + parseFloat(item.making_amt);
            total_metal_amt = total_metal_amt + parseFloat(item.metal_amt);
            total_stone_amt = total_stone_amt + parseFloat(item.stone_amt);
            total_dis_amt = total_dis_amt + parseFloat(item.dis_amt);
            total_gross_amt = total_gross_amt + parseFloat(item.gross_amt);
        });

        this.prnt_inv_total_pcs = total_pcs;
        this.prnt_inv_total_weight = total_weight;
        this.prnt_inv_total_pure_weight = total_pure_weight;
        this.prnt_inv_total_making_amt = total_making_amt;
        this.prnt_inv_total_metal_amt = total_metal_amt;
        this.prnt_inv_total_stone_amt = total_stone_amt;
        this.prnt_inv_total_dis_amt = total_dis_amt;
        this.prnt_inv_total_gross_amt = total_gross_amt;

        this.prnt_inv_net_total_without_tax = total_sum;
        this.order_items_total_amount = total_sum;
        this.prnt_inv_total_tax_amount = tax_sum;
        this.order_items_total_tax = tax_sum;

        this.order_items_total_gross_amount = net_sum;
        this.order_items_total_discount_amount = 0.0;
        // sales return items
        this.sales_returns_items.forEach(function (item: any) {
            total_sales_return_sum =
                total_sales_return_sum + parseFloat(item.total_amount);
        });
        // this.order_total_sales_returns = total_sales_return_sum.toFixed(2);
        // this.order_total_sales_returns = this.invReturnSalesTotalNetTotal;

        this.exchange_items.forEach(function (item) {
            // total_exchange = total_exchange + parseFloat(item.net_amount);
            total_exchange = total_exchange + parseFloat(item.total_amount);
        });

        // Metal purchase (Exchange)
        this.sumExchangeItem();
        this.sumRetailSalesReturn();
        this.order_total_exchange = total_exchange;

        console.log('============== amount ======================');
        console.log(
            this.order_items_total_gross_amount,
            total_sales_return_sum,
            total_exchange
        );
        console.log('====================================');
        this.order_items_total_net_amount = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.order_items_total_gross_amount -
            // total_sales_return_sum -
            this.invReturnSalesTotalNetTotal -
            total_exchange
        );
        this.order_items_total_net_amount_org = this.order_items_total_net_amount;
        this.sumReceiptItem();
        
    }

    sumReceiptItem() {
        var totalNetAmount = 0.0;

        this.receiptDetailsList.forEach((item: any) => {
            totalNetAmount =
                this.comFunc.emptyToZero(totalNetAmount) + this.comFunc.emptyToZero(item['AMOUNT_FC']);
        });

        this.receiptTotalNetAmt =
            this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, totalNetAmount);
        this.balanceAmount =
            this.comFunc.emptyToZero(this.order_items_total_net_amount) - this.comFunc.emptyToZero(this.receiptTotalNetAmt);

        this.prnt_received_amount = this.receiptTotalNetAmt;
        this.prnt_received_amount_words = this.numToWord(this.prnt_received_amount);

        // recpCtrl.receiptTotalNetAmt = receiptTotalNetAmt;
        // recpCtrl.balanceAmount = balanceAmount;
    }

    sumRetailSalesReturn() {
        let total_pcs = 0;
        let total_weight = 0;
        let total_pure_weight = 0;
        let total_making_amt = 0;
        let total_metal_amt = 0;
        let total_stone_amt = 0;
        let total_dis_amt = 0;
        let total_sum = 0;
        let tax_sum = 0;
        let net_sum = 0;
        let total_pur_diff = 0;
        let total_stone_diff = 0;
        let total_dis_per = 0;
        let total_tax_amt = 0;

        this.sales_returns_items.forEach(function (item: any) {
            console.log('return item---------------------', item);
            total_sum = total_sum + parseFloat(item.total_amount);
            tax_sum = tax_sum + parseFloat(item.tax_amount);
            net_sum = net_sum + parseFloat(item.net_amount);
            total_pcs = total_pcs + item.pcs;
            total_weight = total_weight + parseFloat(item.weight);
            total_pure_weight = total_pure_weight + parseFloat(item.pure_wt);
            total_making_amt = total_making_amt + parseFloat(item.making_amt);
            total_metal_amt = total_metal_amt + parseFloat(item.metal_amt);
            total_stone_amt = total_stone_amt + parseFloat(item.stone_amt);
            total_pur_diff = total_pur_diff + parseFloat(item.PUDIFF);
            total_stone_diff = total_stone_diff + parseFloat(item.STONEDIFF);
            total_dis_amt = total_dis_amt + parseFloat(item.DISCOUNTVALUEFC);
            total_dis_per = total_dis_per + parseFloat(item.DISCOUNT);
            total_tax_amt = total_tax_amt + parseFloat(item.VAT_AMOUNTFC);
        });
        // alert(total_pur_diff);

        this.invReturnSalesTotalPcs = total_pcs;
        this.invReturnSalesTotalWeight = total_weight;
        this.invReturnSalesTotalPureWeight = total_pure_weight;
        this.invReturnSalesTotalMakingAmt = total_making_amt;
        this.invReturnSalesTotalMetalAmt = total_metal_amt;
        this.invReturnSalesTotalStoneAmt = total_stone_amt;
        this.invReturnSalesTotalNetAmt = net_sum;
        this.invReturnSalesTotalPurityDiff = total_pur_diff;
        this.invReturnSalesTotalStoneDiff = total_stone_diff;
        this.invReturnSalesTotalDisAmt = total_dis_amt;
        this.invReturnSalesTotalDisPer = total_dis_per;
        this.invReturnSalesTotalTaxAmt = total_tax_amt;

        // this.invReturnSalesTotalNetTotal = this.comFunc.transformDecimalVB(
        //   this.comFunc.amtDecimals,
        //   net_sum + total_tax_amt
        // );

        this.invReturnSalesTotalNetTotal = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            // total_sum
            net_sum
            // +       total_tax_amt
        );
        console.log('=================invReturnSalesTotalPcs===================');
      
        console.log('====================================');
    }
    sumExchangeItem() {
        let total_pcs = 0;
        let total_nett_weight = 0;
        let total_pure_weight = 0;
        let total_metal_amt = 0;
        let total_stone_amt = 0;
        let total_sum = 0;
        let total_gross_wt = 0;
        let total_purity = 0;
        let total_purity_diff = 0;
        let total_pure_wt = 0;
        let total_mkg_value = 0;
        let total_net_amount = 0;
        let total_oz_weight = 0;

        this.exchange_items.forEach(function (item) {
            console.log('exchange item---------------------', item);
            total_sum = total_sum + parseFloat(item.total_amount);
            total_pcs = total_pcs + item.pcs;
            total_nett_weight = total_nett_weight + parseFloat(item.weight); //nett weight
            total_gross_wt = total_gross_wt + parseFloat(item.gross_wt);
            total_pure_weight = total_pure_weight + parseFloat(item.pure_wt);
            total_metal_amt = total_metal_amt + parseFloat(item.metalAmt);
            total_stone_amt = total_stone_amt + parseFloat(item.stone_amt);
            total_purity_diff = total_purity_diff + parseFloat(item.purity_diff);
            total_mkg_value = total_mkg_value + parseFloat(item.mkg_amount);
            total_net_amount = total_net_amount + parseFloat(item.net_amount);
            total_oz_weight = total_oz_weight + parseFloat(item.ozWeight);
            console.log('=================ozWeight===================');
            console.log(typeof item.ozWeight, item.ozWeight);
            console.log('====================================');
        });

        this.invMetalPurchaseTotalPcs = total_pcs;
        this.invMetalPurchaseTotalNettWeight = total_nett_weight;
        this.invMetalPurchaseTotalGrossWeight = total_gross_wt;
        this.invMetalPurchaseTotalPureWeight = total_pure_weight;
        this.invMetalPurchaseTotalPurityDiff = total_purity_diff;
        this.invMetalPurchaseTotalMetalAmt = total_metal_amt;
        this.invMetalPurchaseTotalStoneAmt = total_stone_amt;
        this.invMetalPurchaseTotalMakingAmt = total_mkg_value;
        this.invMetalPurchaseTotalNetAmt = total_net_amount;
        this.invMetalPurchaseTotalOzWt = total_oz_weight;
    }


    numToWord(number: any) {
        //Validates the number input and makes it a string
        if (typeof number === 'string') {
            number = parseInt(number, 10);
        }
        if (typeof number === 'number' && !isNaN(number) && isFinite(number)) {
            number = number.toString(10);
        } else {
            return 'This is not a valid number';
        }

        //Creates an array with the number's digits and
        //adds the necessary amount of 0 to make it fully
        //divisible by 3
        var digits = number.split('');
        var digitsNeeded = 3 - (digits.length % 3);
        if (digitsNeeded !== 3) {
            //prevents this : (123) ---> (000123)
            while (digitsNeeded > 0) {
                digits.unshift('0');
                digitsNeeded--;
            }
        }

        //Groups the digits in groups of three
        var digitsGroup = [];
        var numberOfGroups = digits.length / 3;
        for (var i = 0; i < numberOfGroups; i++) {
            digitsGroup[i] = digits.splice(0, 3);
        }
        console.log(digitsGroup); //debug

        //Change the group's numerical values to text
        var digitsGroupLen = digitsGroup.length;
        var numTxt = [
            [
                null,
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
            ], //hundreds
            [
                null,
                'ten',
                'twenty',
                'thirty',
                'forty',
                'fifty',
                'sixty',
                'seventy',
                'eighty',
                'ninety',
            ], //tens
            [
                null,
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
            ], //ones
        ];
        var tenthsDifferent = [
            'ten',
            'eleven',
            'twelve',
            'thirteen',
            'fourteen',
            'fifteen',
            'sixteen',
            'seventeen',
            'eighteen',
            'nineteen',
        ];

        // j maps the groups in the digitsGroup
        // k maps the element's position in the group to the numTxt equivalent
        // k values: 0 = hundreds, 1 = tens, 2 = ones
        for (var j = 0; j < digitsGroupLen; j++) {
            for (var k = 0; k < 3; k++) {
                var currentValue = digitsGroup[j][k];
                digitsGroup[j][k] = numTxt[k][currentValue];
                if (k === 0 && currentValue !== '0') {
                    // !==0 avoids creating a string "null hundred"
                    digitsGroup[j][k] += ' hundred ';
                } else if (k === 1 && currentValue === '1') {
                    //Changes the value in the tens place and erases the value in the ones place
                    digitsGroup[j][k] = tenthsDifferent[digitsGroup[j][2]];
                    digitsGroup[j][2] = 0; //Sets to null. Because it sets the next k to be evaluated, setting this to null doesn't work.
                }
            }
        }

        console.log(digitsGroup); //debug

        //Adds '-' for grammar, cleans all null values, joins the group's elements into a string
        for (var l = 0; l < digitsGroupLen; l++) {
            if (digitsGroup[l][1] && digitsGroup[l][2]) {
                digitsGroup[l][1] += '-';
            }
            digitsGroup[l].filter(function (e: any) {
                return e !== null;
            });
            digitsGroup[l] = digitsGroup[l].join('');
        }

        console.log(digitsGroup); //debug

        //Adds thousand, millions, billion and etc to the respective string.
        var posfix = [
            null,
            'thousand',
            'million',
            'billion',
            'trillion',
            'quadrillion',
            'quintillion',
            'sextillion',
        ];
        if (digitsGroupLen > 1) {
            var posfixRange = posfix.splice(0, digitsGroupLen).reverse();
            for (var m = 0; m < digitsGroupLen - 1; m++) {
                //'-1' prevents adding a null posfix to the last group
                if (digitsGroup[m]) {
                    // avoids 10000000 being read (one billion million)
                    digitsGroup[m] += ' ' + posfixRange[m];
                }
            }
        }

        console.log(digitsGroup); //debug

        //Joins all the string into one and returns it
        return digitsGroup.join(' ');
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
      this.lineItemService.openWarningModal(() => this.modal.dismiss('Cross click'));
      if (this.lineItemService.isWarningModalOpen) {
        event.preventDefault();
        event.stopPropagation(); 
      } else {
        
      }
    }
}