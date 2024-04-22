import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { ItemDetailService } from 'src/app/services/modal-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';



@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailTable implements OnInit {
    @Input() modalTitle: string = 'Default Title';
    @Input() updatedLineItem: any;
    @Input() modal!: NgbModalRef;
    @Input() vocType: any;
    @Input() itemDetailsEdit: any;
    @Input() vocDataForm!: FormGroup;
    @Input() editItemDetail: any;
    @Input() viewOnly!: boolean;
    @Input() editOnly!: boolean;

    @Output() newItemEvent = new EventEmitter<any>();
    @Output() grossAmountEvent = new EventEmitter<any>();
    @Output() totalTaxEvent = new EventEmitter<any>();
    @Output() itemTotalEvent = new EventEmitter<any>();
    @Output() netTotalEvent = new EventEmitter<any>();
    @Output() netAmountEvent = new EventEmitter<any>();
    

    @Input() karatRateDetails!: any[];

    isWarningModalOpen:boolean=false;
    salesReturnsItems_forVoc: any = [];
    exchange_items: any[] = [];
    sales_returns_items: any = [];
    lineItemForm!: FormGroup;
    branch_tax_percentage: any;
    baseYear: any = '';
    li_stone_wt_val: any;
    li_net_wt_val: any;
    li_making_rate_val: any;
    li_making_amount_val: any;
    li_stone_rate_val: any;
    li_stone_amount_val: any;
    li_metal_rate_val: any;
    li_metal_amount_val: any;
    li_rate_val: any;
    updateBtn!: boolean;
    ordered_items: any[] = [];
    modalReferenceUserAuth!: NgbModalRef;
    @Input() orderedItems!: any[];


    inv_bill_date: any;
    inv_number: any;
    inv_cust_id_no: any;

    invMetalPurchaseTotalPcs: any;
    invMetalPurchaseTotalNettWeight: any;
    invMetalPurchaseTotalGrossWeight: any;
    invMetalPurchaseTotalPureWeight: any;
    invMetalPurchaseTotalPurityDiff: any;
    invMetalPurchaseTotalMakingAmt: any;
    invMetalPurchaseTotalNetAmt: any;
    invMetalPurchaseTotalMetalAmt: any;
    invMetalPurchaseTotalStoneAmt: any;
    invMetalPurchaseTotalOzWt: any;


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

    public pos_main_data: any = {};

    public retailsReturnMain: any = {};

    public metalPurchaseMain: any = {};


    all_branch: any;
    orderedItemEditId: any;


    currentLineItems: any = [];
    salesReturnEditId: any;
    salesReturnEditCode: any = '';
    salesReturnEditAmt: any = '';
    exchangeItemEditId: any;
    retailSaleDataVocNo: any = '0';
    retailSReturnVocNo: any = '0';
    metalPurchaseDataVocNo: any = '0';
    receiptEditId: any;

    retailSalesMID: any = '0';
    retailSReturnDataMID: any = '0';
    metalPurchaseDataMID: any = '0';
    standardPurity: any = 0;
    maritalStatusList: any = [];
    lineItemModalForSalesReturn: boolean = false;
    zeroAmtVal!: any;
    zeroMQtyVal!: any;
    blockNegativeStock: any;
    blockNegativeStockValue: any;
    blockMinimumPrice: any;
    blockMinimumPriceValue: any;
    userwiseDiscount: boolean = false;


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

    defaultGrossTotal: any;
    dialogBox: any;
    dialogBoxResult: any;
    defaultTaxTotal: any;
    defaultNetTotal: any;
    defaultMakingCharge: any;
    validatePCS: any;
    lineItemPcs: any;
    makingRate: any;
    totalGrossAmount: any;
    totalTaxAmount: any;
    totalMakingAmount: any;
    totalNetAmount: any;
    lineItemGrossWt: any;
    public newDictionary: any;
    public taxType = 1;
    li_total_val: any;
    li_discount_percentage_val: any;
    li_discount_amount_val: any;
    li_gross_amount_val: any;
    li_tax_percentage_val: any;
    li_tax_amount_val: any;
    li_net_amount_val: any;
    currentStockCode: any;
    li_tag_val: any;
    strBranchcode: any = '';
    strUser: any = '';
    isFieldReset: boolean = false;
    divisionMS = 'M';
    curr_line_item_images: any;
    validateStoneWt: boolean = false;
    validateGrossWt: boolean = false;
    @Input() vocTypeData: any;

    li_division_val: any;
    li_item_code_val: any;
    li_item_desc_val: any;
    li_location_val: any;
    li_pcs_val: any;
    li_gross_wt_val: any;
    order_items_slno_length: any;
    order_items_total_amount: any;
    order_items_total_tax: any;
    order_items_total_net_amount: any;
    order_items_total_net_amount_org: any;
    order_items_total_gross_amount: any;
    order_items_total_discount_amount: any;




    order_total_exchange: any;



    estMode: string = 'ADD';

    // baseImgUrl = baseImgUrl;
    maskVocDate: any = new Date();
    amlNameValidationData = false;

    value: any;
    // barcode: string;
    isSaved: boolean = false;

    selectedTabIndex = 0;

    public isCustProcessing = false;

    salesReturnRowData: any;
    salesReturnRowDataSRNO: any;

    queryParams: any;

    public mask = {
        guide: true,
        showMask: true,
        // keepCharPositions : true,
        mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    };
    noWhiteSpacePattern = /^\S*$/;
    dateValue: any;

    ozWeight: any = 0;

    vocMaxDate = new Date();

    dummyDate = '1900-01-01T00:00:00';
    dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];


    salespersonName: string = '';
    branchOptions: string[] = [''];


    receiptModesTypes: any;
    receiptModesList: any;
    metalPurchaseDataPost: any = null;
    retailSalesDataPost: any = null;
    retailSReturnDataPost: any = null;



    // public noImage = environment._noImage;
    selectedOption = '3';
    title = 'appBootstrap';


    rs_WithReturnExchangeReceipt = {
        _retailSales: {},
        _retailReceipt: [],
        _retailsReturn: {},
        _metalPurchase: {},
    };

    vocTypesinExchange: any[] = [
        // { value: 'POS', viewValue: 'POS' },
        { value: 'POS', viewValue: 'POS' },
        { value: 'PS1', viewValue: 'PS1' },
    ];

    custDesignation: any = [
        { value: '1', label: 'Mr' },
        { value: '2', label: 'Mrs' },
        { value: '3', label: 'Ms' },
    ];


    itemcodeSelected(value: any) {
        this.lineItemForm.controls.fcn_li_item_code.setValue(value.PREFIX_CODE);
        this.lineItemForm.controls.fcn_li_item_desc.setValue(value.DESCRIPTION)
    }


    divisionCodeSelected(e: any) {
        this.lineItemForm.controls.fcn_li_division.setValue(e.DIVISION_CODE);

    }
    modalReference: any;
    modalReferenceSalesReturn: any;
    closeResult!: string;
    orders: any[] = [];
    receiptDetailsList: any = [];

    receiptTotalNetAmt: any;
    balanceAmount: any;
    fcn_returns_cust_code_val: any;
    fcn_exchange_division_val: any
    fcn_exchange_item_desc_val: any
    fcn_returns_voc_date_val: any
    fcn_returns_sales_man_val: any
    fcn_returns_cust_mobile_val: any


    prnt_inv_net_total_without_tax_sum: any;
    prnt_inv_total_tax_amount_sum: any;
    prnt_inv_net_total_with_tax_sum: any;
    prnt_received_amount: any;
    prnt_received_amount_words: any;


    newLineItem: any = {
        STOCK_CODE: '',
        STOCK_DESCRIPTION: 'DIAMOND PENDANT',
        MAIN_STOCK_CODE: 'MP009544',
        MAIN_STOCK_DESC: '',
        KARAT_CODE: '',
        DIVISIONMS: '',
        DIVISION_CODE: 'M',
        LOCATION_CODE: '',
        TAG_LINES:
            '18KRG- 2.58 GMS\r\nRD-44/0.25 CTS\r\nBT*-1/13.29 CTS\r\nORC/A/REP/1014',
        DESIGN_CODE: 'LPERC000298-P',
        COLOR_CODE: 'RG',
        SIZE: '',
        BARCODEITEM: 'False',
        TAX_INCLUSIVE: 'False',
        ASK_WASTAGE: 'False',
        POSFIXED: 'False',
        TPROMOTIONALITEM: 'False',
        ITEM_ONHOLD: 'False',
        STAMPCHARGES: '0.000',
        PCS: '0',
        GROSSWT: '0.000',
        STONEWT: '0.000',
        NET_WT: '0.000',
        CHARGABLEWT: '0.000',
        PURITY: '0.000000',
        PUREWT: '0.000',
        PUDIFF: '0.000',
        STONEDIFF: '0.000',
        STOCK_FCCOST: '1660.310',
        STOCK_LCCOST: '1660.310',
        PRICE1FC: 4620.0,
        PRICE1LC: 4620.0,
        PRICE2FC: 1660.31,
        PRICE2LC: 1660.31,
    };

    constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, public comFunc: CommonServiceService,
        private suntechApi: SuntechAPIService, public dialog: MatDialog, private renderer: Renderer2, public lineItemService: ItemDetailService
    ) {
        this.strBranchcode = localStorage.getItem('userbranch');
        this.strUser = localStorage.getItem('username');


        let branchParams: any = localStorage.getItem('BRANCH_PARAMETER')
        this.zeroAmtVal = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            0
        );
        this.lineItemForm = this.formBuilder.group({
            fcn_li_item_code: ['', Validators.required],
            fcn_li_item_desc: ['', Validators.required],
            fcn_li_division: ['', Validators.required],
            fcn_li_location: [''],
            fcn_li_pcs: [0, Validators.required],
            fcn_li_gross_wt: ['', [Validators.required, Validators.min(0.1)]],
            fcn_li_stone_wt: [0, Validators.required],
            fcn_li_net_wt: [0, Validators.required],
            fcn_li_rate: [0, [Validators.required]],
            fcn_li_total_amount: [0, [Validators.required]],
            fcn_li_discount_percentage: [0],
            fcn_li_discount_amount: [0],
            fcn_li_gross_amount: [0, [Validators.required, Validators.min(1)]],
            fcn_li_tax_percentage: [0, Validators.required],
            fcn_li_tax_amount: [0, Validators.required],
            fcn_li_net_amount: [0, [Validators.required, Validators.min(1)]],
            fcn_li_purity: [{ value: 0 }, Validators.required],
            fcn_li_pure_wt: [{ value: 0 }, Validators.required],
            fcn_ad_pcs: [0],
            fcn_ad_cts: [''],
            fcn_ad_gms: [0],
            fcn_ad_rate_type: [''],
            fcn_ad_rate: [0],
            fcn_ad_amount: [0],
            fcn_tab_details: [''],
            fcn_ad_making_rate: [0],
            fcn_ad_making_amount: [0],
            fcn_ad_stone_rate: [0],
            fcn_ad_stone_amount: [0],
            fcn_ad_metal_rate: [0],
            fcn_ad_metal_amount: [0],
        });

    }

    ngOnInit(): void {
        this.lineItemService.getData().subscribe(data => {
            this.currentLineItems = data;
        });
        this.ordered_items = this.orderedItems;
        if (this.editItemDetail == true) {
            this.editTable(this.updatedLineItem);
        }
        this.userwiseDiscount = this.comFunc.getCompanyParamValue('USERWISEDISCOUNT').toString() == '0' ? false : true;
    }

    dismissModal() {
        // Here you might emit an event or perform other actions to close the modal
    }

    convertDateToYMD(str: any) {
        var date = new Date(str),
            mnth = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join('-');
    }
    getStockDesc(event: any) {


        this.li_tax_amount_val = 0.0;
        var gross_amount_val = 0.0;
        this.li_net_amount_val = 0.0;
        this.currentStockCode = event.target.value;

        // form rest before stockcode change
        this.lineItemForm.reset();
        this.lineItemForm.reset();
        this.lineItemForm.controls.fcn_li_item_code.setValue(this.currentStockCode);

        this.snackBar.open('Loading...');
        if (event.target.value != '') {
            

            let API = 'RetailSalesStockValidation?strStockCode=' + event.target.value +
                '&strBranchCode=' + this.strBranchcode +
                '&strVocType=POS' + '&strUserName=' + this.strUser +
                '&strLocation=%27%27&strPartyCode=%27%27&strVocDate=' + this.convertDateToYMD(this.vocTypeData)
            this.suntechApi.getDynamicAPI(API)
                .subscribe((resp: any) => {
                    this.snackBar.dismiss();
                 
                    if (resp != null) {
                        const stockInfoResult = resp.resultStatus;
                        const stockInfos = resp.stockInfo;
                        const stockInfoPrice = resp.priceInfo;
                        let stockInfoTaxes = resp.taxInfo;
                        this.isFieldReset = true;
                        if (stockInfoTaxes.length == 0 || stockInfoTaxes === null) {
                            stockInfoTaxes = [{
                                HSN_COD: 0,
                                GST_CODE: 0,
                                IGST_PER: 0,
                                IGST_ACCODE: 0,
                            }];
                        }
                        // if (resp.status == 'Success') {
                        if (stockInfoResult.RESULT_TYPE == "" || stockInfoResult.RESULT_TYPE == "Success") {
                            this.newLineItem = stockInfos;
                            this.newLineItem.HSN_CODE = stockInfoTaxes[0]?.HSN_CODE;
                            this.newLineItem.GST_CODE = stockInfoTaxes[0]?.GST_CODE;
                            this.newLineItem.IGST_ACCODE = stockInfoTaxes[0]?.POS_TAX_ACCODE;
                            // this.newLineItem.IGST_ACCODE = stockInfoTaxes[0]?.IGST_ACCODE;
                            // this.newLineItem.POS_TAX_ACCODE = stockInfoTaxes[0]?.POS_TAX_ACCODE;
                            this.newLineItem.STOCK_DESCRIPTION = stockInfos.DESCRIPTION;
                            this.newLineItem.STOCK_COST = stockInfoPrice.STOCK_COST;

                            this.divisionMS = stockInfos.DIVISIONMS;

                            const isBalanceZero = parseFloat(this.newLineItem.BALANCE_QTY) === 0;
                            const allowNegative = this.comFunc.stringToBoolean(stockInfos.ALLOW_NEGATIVE);
                            this.validateGrossWt = !(isBalanceZero || allowNegative);

                            this.validateStoneWt = this.comFunc.stringToBoolean(stockInfos.STONE);
                            this.lineItemService.isStoneIncluded = this.comFunc.stringToBoolean(stockInfos.STONE);
                            this.lineItemForm.controls['fcn_li_item_code'].setValue(
                                stockInfos.STOCK_CODE
                            );
                            this.lineItemForm.controls['fcn_li_item_desc'].setValue(
                                stockInfos.DESCRIPTION
                            );
                            this.lineItemForm.controls['fcn_li_location'].setValue(
                                stockInfos.LOCATION_CODE
                            );
                            this.lineItemForm.controls['fcn_li_division'].setValue(
                                stockInfos.DIVISION
                            );
                            this.lineItemForm.controls['fcn_li_pcs'].setValue(
                                stockInfos.BALANCE_PCS
                            );
                            this.lineItemPcs = stockInfos.BALANCE_PCS;
                            this.lineItemService.lineItemPcs = stockInfos.BALANCE_PCS;
                            this.lineItemGrossWt = this.comFunc.transformDecimalVB(
                                this.comFunc.mQtyDecimals,
                                this.comFunc.emptyToZero(stockInfos.BALANCE_QTY)
                            );
                            this.lineItemService.lineItemGrossWt = this.comFunc.transformDecimalVB(
                                this.comFunc.mQtyDecimals,
                                this.comFunc.emptyToZero(stockInfos.BALANCE_QTY)
                            );
                            this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                                stockInfos.BALANCE_QTY
                            );
                            this.lineItemService.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                                this.comFunc.amtDecimals,
                                stockInfoPrice.MIN_SAL_PRICE
                            );

                            this.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                                this.comFunc.amtDecimals,
                                stockInfoPrice.MIN_SAL_PRICE
                            );

                            this.lineItemForm.controls['fcn_li_stone_wt'].setValue(

                                this.comFunc.transformDecimalVB(
                                    this.comFunc.amtDecimals,
                                    stockInfos.STONE_WT || 0
                                )

                                // stockInfos.STONE_WT || 0
                            ); // need field
                            this.lineItemForm.controls['fcn_li_net_wt'].setValue(
                                stockInfos.NET_WT
                            ); // need field
                            // this.lineItemForm.controls['fcn_li_stone_wt'].setValue(stockInfoPrice.STONE_WT); // need field
                            this.lineItemForm.controls.fcn_li_rate.enable();
                            // this.lineItemForm.controls.fcn_li_pcs.enable();
                            this.lineItemForm.controls['fcn_li_tax_percentage'].setValue(
                                this.comFunc.transformDecimalVB(
                                    this.comFunc.allbranchMaster?.BAMTDECIMALS, stockInfoTaxes[0].IGST_PER)
                            );
                            this.lineItemForm.controls['fcn_li_purity'].setValue(
                                stockInfos.PURITY
                            );

                            this.blockNegativeStock = stockInfos.BLOCK_NEGATIVESTOCK;
                            this.lineItemService.divisionCode = stockInfos.DIVISION;

                            this.blockNegativeStockValue = stockInfos.BALANCE_QTY;
                            this.lineItemService.blockNegativeStock = stockInfos.BLOCK_NEGATIVESTOCK;
                            this.lineItemService.blockMinimumPrice = stockInfos.BLOCK_MINIMUMPRICE;
                            this.blockMinimumPrice = stockInfos.BLOCK_MINIMUMPRICE;
                            this.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                                this.comFunc.amtDecimals,
                                stockInfoPrice.MIN_SAL_PRICE
                            );
                            this.lineItemService.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                                this.comFunc.amtDecimals,
                                stockInfoPrice.MIN_SAL_PRICE
                            );
                            this.validatePCS = stockInfos.VALIDATE_PCS;
                            this.lineItemService.validatePCS = stockInfos.VALIDATE_PCS;
                            this.managePcsGrossWt();

                            // this.lineItemForm.controls['fcn_li_rate'].setValue(stockInfos.RATE); // got value =0
                            this.lineItemForm.controls['fcn_li_rate'].setValue(
                                parseFloat(stockInfos.RATE).toFixed(2)
                            );

                            this.makingRate = parseFloat(stockInfos.RATE).toFixed(2);
                            this.lineItemForm.controls['fcn_ad_rate'].setValue(
                                parseFloat(stockInfos.RATE).toFixed(2)
                            );

                            this.renderer.selectRootElement('#fcn_li_total_amount').focus();

                            this.curr_line_item_images = stockInfos.PICTURE_NAME;

                            if (this.divisionMS == 'M') {
                                if (parseFloat(this.lineItemForm.value.fcn_li_gross_wt) !== 0) {
                                    // this.renderer.selectRootElement('#fcn_li_total_amount').focus();
                                }
                                else {
                                    this.renderer.selectRootElement('#fcn_li_gross_wt').focus();
                                }


                                this.lineItemForm.controls['fcn_ad_making_rate'].setValue(
                                    parseFloat(stockInfoPrice.SELLING_PRICE).toFixed(2)
                                ); //calculation

                                this.lineItemForm.controls['fcn_ad_metal_rate'].setValue(
                                    stockInfoPrice.METAL_RATE

                                ); //need field
                                this.lineItemForm.controls['fcn_ad_rate_type'].setValue(
                                    stockInfos.RATE_TYPE != 'NULL' ? stockInfos.RATE_TYPE : ''
                                );

                                this.lineItemForm.controls['fcn_tab_details'].setValue(
                                    stockInfos.TAGLINES
                                );
                                this.li_tag_val = stockInfos.TAGLINES;

                                this.lineItemForm.controls['fcn_li_rate'].setValue(
                                    this.comFunc.transformDecimalVB(
                                        this.comFunc.amtDecimals,
                                        stockInfoPrice.SELLING_PRICE
                                    )
                                );
                                // this.lineItemForm.controls['fcn_ad_amount'].setValue(stockInfoPrice.SELLING_PRICE);
                                this.makingRate = this.comFunc.transformDecimalVB(
                                    this.comFunc.amtDecimals,
                                    stockInfoPrice.SELLING_PRICE
                                )
                                this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(
                                    this.comFunc.emptyToZero(stockInfoPrice.STONE_SALES_PRICE)
                                );

                                this.setMetalRate(stockInfos.KARAT_CODE);
                                this.manageCalculations();
                            } else {
                                this.lineItemForm.controls['fcn_li_rate'].setValue(
                                    this.comFunc.transformDecimalVB(
                                        this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                        stockInfoPrice.SELLING_PRICE
                                    )
                                );
                                this.lineItemForm.controls['fcn_li_total_amount'].setValue(
                                    this.comFunc.transformDecimalVB(
                                        this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                        stockInfoPrice.SELLING_PRICE
                                    )
                                );

                                this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
                                    this.zeroAmtVal
                                );
                                this.lineItemForm.controls.fcn_li_discount_amount.setValue(
                                    this.zeroAmtVal
                                );

                                this.manageCalculations();
                            }

                            this.li_tax_amount_val =
                                this.lineItemForm.value.fcn_li_tax_amount;
                            this.li_net_amount_val =
                                this.lineItemForm.value.fcn_li_net_amount;


                            if (this.comFunc.stringToBoolean(this.newLineItem.STONE?.toString()) == false) {

                                this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', true);
                                this.comFunc.formControlSetReadOnly('fcn_li_net_wt', true);
                                this.removeValidationsForForms(this.lineItemForm, ['fcn_li_stone_wt', 'fcn_li_net_wt']);
                            } else {

                                this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', false);
                                this.comFunc.formControlSetReadOnly('fcn_li_net_wt', false);
                                this.addValidationsForForms(this.lineItemForm, 'fcn_li_stone_wt', [
                                    Validators.required,
                                ]);
                                this.addValidationsForForms(this.lineItemForm, 'fcn_li_net_wt', [
                                    Validators.required,
                                ]);
                            }
                        } else {
                            this.openDialog(
                                'Failed',
                                this.comFunc.getMsgByID('MSG1464'),
                                true
                            );
                        }
                    }
                });


        }



    }


    addValidationsForForms(form: FormGroup, ctrlName: any, validations: any) {
        const control = form.get(ctrlName);
        if (control) {
            control.setValidators(validations);
            control.updateValueAndValidity();
        }
    }
    manageCalculations(
        argsData: any = { totalAmt: null, nettAmt: null, disAmt: null }
    ) {
       

        /** set nett weight */
        this.lineItemForm.controls['fcn_li_net_wt'].setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) -
                this.comFunc.emptyToZero(
                    this.lineItemForm.value.fcn_li_stone_wt
                )
            )
        );

        /**  set pure weight */
        this.lineItemForm.controls.fcn_li_pure_wt.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) *
                this.lineItemForm.value.fcn_li_purity
            )
        );

        /** empty stone rate if stone wt is  0 */
        const stonewtVal = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt);
        (stonewtVal)
        if (stonewtVal == 0) {
            this.lineItemForm.controls.fcn_ad_stone_rate.setValue(this.zeroAmtVal);
        }

        /** set stone amount */
        this.lineItemForm.controls['fcn_ad_stone_amount'].setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt) *
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate)
            )
        );

        /** set metal amount */
        this.lineItemForm.controls['fcn_ad_metal_amount'].setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate) *
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pure_wt) // pure weight changed at 18/3/2024
                // this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) // pure weight
            )
        );

        /**  set making amount (total amount) */
        let mkgvalue;
        if (argsData.totalAmt != null) {
            mkgvalue = argsData.totalAmt;
            localStorage.setItem(
                'fcn_li_total_amount',
                this.comFunc
                    .transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(mkgvalue))
                    .toString()
            );
        } else {
           

            // new calculation added 30/12/2023
            if (this.divisionMS == 'M') {
                switch (this.newLineItem?.MAKING_ON) {

                    case 'PCS':
                        mkgvalue =
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs) *
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
                        break;

                    case 'GROSS':
                     

                        mkgvalue =
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) *
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)

                        break;

                    case 'NET':
                        mkgvalue =
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) *
                            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
                        break;

                }
            } else {
                mkgvalue =
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) *
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);
            }
        }
       

        this.lineItemForm.controls['fcn_li_total_amount'].setValue(
            // Math.round(parseFloat(mkgvalue)).toFixed(2)

            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(mkgvalue)
            )
        );

        // set localstorage for get value
        localStorage.setItem(
            'fcn_li_total_amount',
            // Math.round(parseFloat(mkgvalue)).toFixed(2)
            this.comFunc
                .transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, mkgvalue)
                .toString()
        );

        localStorage.setItem('fcn_li_rate', this.lineItemForm.value.fcn_li_rate);

        /** set all total amount */
        let stoneAmt = this.comFunc.emptyToZero(
            this.lineItemForm.value.fcn_ad_stone_amount
        );
        let mkgAmt = this.comFunc.emptyToZero(
            this.lineItemForm.value.fcn_li_total_amount
            // this.lineItemForm.value.fcn_ad_making_amount
        );
        let mtlAmt = this.comFunc.emptyToZero(
            this.lineItemForm.value.fcn_ad_metal_amount
        );



        /**  set Gross amt */
        if (argsData.nettAmt == null) {
            if (this.divisionMS == 'M') {

                this.lineItemForm.controls.fcn_li_gross_amount.setValue(
                    this.comFunc.transformDecimalVB(
                        this.comFunc.allbranchMaster?.BAMTDECIMALS,
                        this.comFunc.emptyToZero(stoneAmt) + this.comFunc.emptyToZero(mkgAmt) + this.comFunc.emptyToZero(mtlAmt)
                    )
                );
            } else {

                /* divisionMS == s, set total amount to gross amt */
                this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
                   
                    this.comFunc.transformDecimalVB(
                        this.comFunc.allbranchMaster?.BAMTDECIMALS,
                        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) -
                        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount)
                    )
                   
                );
            }
        }

        if (argsData.nettAmt == null) {
            /** set tax amount */
            let taxAmount;
            taxAmount = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.getPercentage(
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage),
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
                )
            );
            this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
                // Math.round(parseFloat(value)).toFixed(2)
                this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, taxAmount)
            );
            this.li_tax_amount_val = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                taxAmount
            );

            /** set nett amount */
            const netAmtValue =
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) +
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);

            this.li_net_amount_val = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                netAmtValue
            );
            this.lineItemForm.controls['fcn_li_net_amount'].setValue(
                this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, netAmtValue)
            );

            localStorage.setItem('fcn_li_net_amount', netAmtValue.toString());

        } else {

        }


        this.lineItemForm.controls['fcn_li_rate'].setValue(
            this.comFunc.commaSeperation(this.comFunc
                .transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)))
        );
        this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
            this.comFunc.commaSeperation(
                this.comFunc.decimalQuantityFormat(
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
                    'METAL')
            )
        );
        this.lineItemForm.controls['fcn_li_stone_wt'].setValue(
            this.comFunc.commaSeperation(
                this.comFunc.decimalQuantityFormat(
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt),
                    'STONE')
            )
        );
        this.lineItemForm.controls['fcn_li_net_wt'].setValue(
            this.comFunc.commaSeperation(
                this.comFunc.decimalQuantityFormat(
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt),
                    'METAL')
            )
        );
        this.lineItemForm.controls['fcn_li_pure_wt'].setValue(
            this.comFunc.commaSeperation(
                this.comFunc.decimalQuantityFormat(
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pure_wt),
                    'METAL')
            )
        );
        this.lineItemForm.controls['fcn_li_total_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_total_amount)
        );
        this.lineItemForm.controls['fcn_ad_metal_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_ad_metal_amount)
        );
        this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_ad_stone_rate)
        );
        this.lineItemForm.controls['fcn_ad_stone_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_ad_stone_amount)
        );
        this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_gross_amount)
        );
        this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_discount_percentage || this.zeroAmtVal)
        );
        this.lineItemForm.controls['fcn_li_discount_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_discount_amount || this.zeroAmtVal)
        );
        this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_tax_amount)
        );
        this.lineItemForm.controls['fcn_li_net_amount'].setValue(
            this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_net_amount)
        );

    }
    getPercentage(percent: any, total: any) {
        return (parseFloat(percent.toString()) / 100) * parseFloat(total.toString());
    }


    storeDefaultValues(totGross: any, totTax: any, totNet: any, totMakeAmnt: any) {
        this.defaultGrossTotal = totGross;
        this.defaultTaxTotal = totTax;
        this.defaultNetTotal = totNet;
        this.defaultMakingCharge = totMakeAmnt;
    }

    openDialog(title: any, msg: any, okBtn: any, swapColor = false) {
        this.dialogBox = this.dialog.open(DialogboxComponent, {
            width: '40%',
            disableClose: true,
            data: { title, msg, okBtn, swapColor },
        });
    }

    setMetalRate(karatCode: any) {
        const value = this.karatRateDetails.filter(
            (data: any) => data.KARAT_CODE == karatCode
        )[0].KARAT_RATE;
        this.lineItemForm.controls.fcn_ad_metal_rate.setValue(this.comFunc.decimalQuantityFormat(value, 'METAL_RATE'));
    }

    managePcsGrossWt() {
        if (this.validatePCS == true) {
            if(!this.viewOnly)
            this.comFunc.formControlSetReadOnly('fcn_li_pcs', false);
            this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);

            this['lineItemForm'].controls['fcn_li_pcs'].setValidators([
                Validators.required,
                Validators.min(1),
            ]);
            if (this.divisionMS == 'M') {
                if (this.newLineItem.PCS_TO_GMS?.toString() == '0')
                    this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
                else this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
            }
        } else {
            this.comFunc.formControlSetReadOnly('fcn_li_pcs', true);
            this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);

            this.removeValidationsForForms(this.lineItemForm, ['fcn_li_pcs']);

            if (this.newLineItem.BLOCK_GRWT == true)
                this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
            else this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);

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


    changePCS(event: any) {
        const value = event.target.value;
        if (value != '' && this.lineItemService.validatePCS == true) {
           

            if (this.lineItemService.blockNegativeStock == 'B') {
                if (this.lineItemService.lineItemPcs < value) {
                    this.openDialog(
                        'Warning',
                        'Current Stock Qty Exceeding Available Stock Qty.',
                        true
                    );
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls['fcn_li_pcs'].setValue(
                                this.lineItemService.lineItemPcs
                            );
                            this.checkDivisionForPcs()


                            this.manageCalculations();
                        }

                    });
                } else {
                    this.manageCalculations();
                }
                this.checkDivisionForPcs()
            } else if (this.lineItemService.blockNegativeStock == 'W') {
                if (this.lineItemService.lineItemPcs < value) {
                    this.openDialog(
                        'Warning5',
                        'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
                        false
                    );
                    this.lineItemForm.controls['fcn_li_pcs'].setValue(
                        this.lineItemService.lineItemPcs
                    );
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'No') {
                            this.checkDivisionForPcs()

                            this.manageCalculations();

                        } else {
                            this.checkDivisionForPcs()
                            this.manageCalculations();
                          
                        }
                    });
                } else {

                    this.lineItemForm.controls['fcn_li_pcs'].setValue(
                        this.lineItemService.lineItemPcs
                    );
                    this.manageCalculations();
                }
                this.checkDivisionForPcs()
            } else {

                this.manageCalculations();
            }
        } else {
            if (this.validatePCS == true)
                this.lineItemForm.controls['fcn_li_gross_wt'].setValue(this.zeroMQtyVal);
            this.changeGrossWt({ target: { value: this.zeroMQtyVal } });

            
            this.manageCalculations();
        }
    }

    checkDivisionForPcs() {
        const validDivisionCodes = ['M', 'D', 'W'];
        const filteredValidationCodes = validDivisionCodes.filter((code) => code === this.lineItemService.divisionCode.toUpperCase())


        if (filteredValidationCodes.length > 0) {

            this.lineItemForm.controls['fcn_li_pcs'].setValue(
                this.lineItemService.lineItemPcs
            );
            this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                this.lineItemService.lineItemPcs
            );
        }


    }

    changeGrossWt(event: any) {
        const value = event.target.value;
        if (value != '') {


            if (this.lineItemService.blockNegativeStock == 'B') {
                if (this.lineItemService.lineItemGrossWt < value) {
                    this.openDialog(
                        'Warning',
                        'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
                        true
                    );
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                                this.lineItemService.lineItemGrossWt
                            );
                            // this.setNettWeight();
                            this.manageCalculations();
                        }
                    });
                } else {
                    //   this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
                    this.manageCalculations();
                }

            } else if (this.lineItemService.blockNegativeStock == 'W') {
                if (this.lineItemService.lineItemGrossWt < value) {
                    this.openDialog(
                        'Warning9',
                        'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
                        false
                    );
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'No') {
                            this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                                this.lineItemService.lineItemGrossWt
                            );
                            // this.setNettWeight();
                            this.manageCalculations();

                        } else {
                            // this.setNettWeight();
                            this.manageCalculations();
                        }
                    });
                } else {
                    this.manageCalculations();
                }
            } else {
                // blockNegativeStock = 'A'
                // this.setNettWeight();
                this.manageCalculations();
            }
        } else {
            // this.setNettWeight();
            this.manageCalculations();
        }
    }



    getExchangeNwtWt(event: any) {
        const value = event.target.value;
        if (value != '' && value != 0) {


          
        } else {
            // focus
            // this.setFocusBasedExchangeStone();
            this.openDialog('Warning3', this.comFunc.getMsgByID('MSG1303'), true);
        }
    }

    changeNettWt(event: any) {
        if (event.target.value != '') {
            const value = this.comFunc.transformDecimalVB(
                this.comFunc.mQtyDecimals,
                this.lineItemForm.value.fcn_li_gross_wt -
                this.lineItemForm.value.fcn_li_net_wt
            );
            this.lineItemForm.controls.fcn_li_stone_wt.setValue(value);
            // this.setStoneAmt();
            this.manageCalculations();
        } else {
            // this.lineItemForm.controls.fcn_li_stone_wt.setValue(0);
            this.lineItemForm.controls.fcn_li_stone_wt.setValue(0);
            // this.setStoneAmt();
            this.manageCalculations();
        }
    }

    changeStoneRate(event: any) {
        if (event.target.value != '') {
            // this.setStoneAmt();
            this.manageCalculations();
        } else {
            this.lineItemForm.controls.fcn_ad_stone_rate.setValue(0);
            // this.setStoneAmt();
            this.manageCalculations();
        }
    }

    changeStoneAmt(event: any) {
        if (event.target.value != '') {
            if (
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt) == 0

            ) {
                this.lineItemForm.controls.fcn_ad_stone_amount.setValue(this.zeroAmtVal);
            } else {
                const value = (
                    parseFloat(this.lineItemForm.value.fcn_ad_stone_amount) /
                    parseFloat(this.lineItemForm.value.fcn_li_stone_wt)
                );
                this.lineItemForm.controls.fcn_ad_stone_rate.setValue(
                    this.comFunc.decimalQuantityFormat(value, 'AMOUNT')
                );
                this.manageCalculations();
            }
            // this.setStoneAmt();
        } else {
            // this.lineItemForm.controls.fcn_li_stone_wt.setValue(0);
            this.lineItemForm.controls.fcn_ad_stone_rate.setValue(this.zeroAmtVal);
            // this.setStoneAmt();
        }
    }

    changeRate(event: any) {

        const karatComp22 = this.comFunc.allbranchMaster?.KARATCOMPANY22;
        const minBranchProfitPercentMetal = this.comFunc.allbranchMaster?.MINBRANCHPROFITPERCENTMETAL;

        const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));
        const value = event.target.value;
        if (event.target.value != '') {

            if (this.divisionMS == 'M') {

                let dblStockCost: any = this.comFunc.emptyToZero(this.newLineItem.STOCK_COST);
                let dblStockFcCost: any;
                let karatCode = this.newLineItem.KARAT_CODE;


                if (this.lineItemModalForSalesReturn || parseFloat(value) >= parseFloat(this.newLineItem.STOCK_COST)) {

                    this.rateFunc(value);
                }
                else {
                    // Rate Cannot be Less Than Cost
                    this.openDialog('Warning4', this.comFunc.getMsgByID('MSG1721'), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls.fcn_li_rate.setValue(
                                // ''
                                preVal
                                
                            );
                            this.renderer.selectRootElement('#fcn_li_rate').focus();
                        }
                    });
                }
            }
            let checkStockCostVal =
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) /
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

            if (this.divisionMS == 'S') {
                if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
                   
                    this.rateFunc(value);
                }
                else {
                    // Rate Cannot be Less Than Cost
                    this.openDialog('Warning4', this.comFunc.getMsgByID('MSG1721'), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls.fcn_li_net_amount.setValue(
                                this.comFunc.transformDecimalVB(
                                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                    preVal
                                )
                            );
                        }
                    });
                }
            }



        } else {
            this.renderer.selectRootElement('#fcn_li_rate').focus();
            this.lineItemForm.controls['fcn_li_total_amount'].setValue(this.zeroAmtVal);
            this.lineItemForm.controls['fcn_ad_amount'].setValue(this.zeroAmtVal);
            // this.setGrossAmt();
            this.manageCalculations();
        }
    }

    async rateFunc(value: any) {
        let isAuth: any = false;
        const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));

        if (this.lineItemService.blockMinimumPrice == 'B') {
            if (this.lineItemModalForSalesReturn || parseFloat(this.lineItemService.blockMinimumPriceValue) >= parseFloat(value)) {
                if (this.userwiseDiscount) {

                    this.rateFuncDetail('B', value);

                } else {
                    this.rateFuncDetail('B', value);
                }
            } else {
                this.manageCalculations();
            }
        }
        else if (this.lineItemService.blockMinimumPrice == 'W') {
            if (this.lineItemModalForSalesReturn || parseFloat(this.lineItemService.blockMinimumPriceValue) >= parseFloat(value)) {
                if (this.userwiseDiscount) {
                   
                    this.lineItemForm.controls.fcn_li_rate.setValue(
                        preVal
                    );
                    this.manageCalculations();
                    //   }
                } else {
                    this.rateFuncDetail('W', value);
                }
            }
            else {
                this.manageCalculations();
            }
        } else {
           
            this.lineItemForm.controls.fcn_li_rate.setValue(
                preVal
            );
            this.manageCalculations();
            //   }

        }
    }



    rateFuncDetail(bOrW: String, value: any) {
        const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));

        const makingAmount = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_total_amount'));


        this.openDialog(
            'Warning5',
            `${this.comFunc.getMsgByID('MSG1731')} ${this.vocDataForm.value.txtCurrency} ${this.lineItemService.blockMinimumPriceValue
            }`,
            bOrW == 'B' ? true : false
        );
        this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              
                this.lineItemForm.controls.fcn_li_rate.setValue(
                    preVal
                );
                this.manageCalculations({ totalAmt: makingAmount });
            }
            else if (data == 'No') {
                this.lineItemForm.controls.fcn_li_rate.setValue(
                    preVal

                );
                this.manageCalculations();

            } else {
                this.manageCalculations();
            }
        });
    }

    changeTotalAmt(event: any, nettAmt = null) {
        const totalAmtVal: any = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
        const val = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(event.target.value));
        if (event.target.value != '') {
            const value = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                (totalAmtVal / this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt))
            );
           
            const lsTotalAmt: any = localStorage.getItem('fcn_li_total_amount');
            this.validateMinSalePriceByTotalAmt(
                value,
                val,
                parseFloat(lsTotalAmt),
                nettAmt
            );
          
        } else {
            this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
            this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
            this.manageCalculations();
        }
    }
    validateMinSalePriceByTotalAmt(value: any, totalAmt: any, lsTotalAmt: any, nettAmt = null) {
       

        const preRateVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));
        const preTotalVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_total_amount'));
        const preNetAmtVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_net_amount'));

        const nonMetalPreRateVal = localStorage.getItem('fcn_li_rate');
        const nonMetalPreTotalVal = localStorage.getItem('fcn_li_total_amount');
        if (value != '') {

            if (this.lineItemModalForSalesReturn || parseFloat(value) >= parseFloat(this.newLineItem.STOCK_COST)) {

                if (this.lineItemService.blockMinimumPrice == 'B') {
                    if (this.lineItemModalForSalesReturn || parseFloat(this.lineItemService.blockMinimumPriceValue) >= parseFloat(value)) {
                        this.openDialog(
                            'Warning6',
                          
                            `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.lineItemService.blockMinimumPriceValue
                            } `,

                            true
                        );
                        this.dialogBox.afterClosed().subscribe((data: any) => {
                            if (data == 'OK') {
                               
                                this.lineItemForm.controls.fcn_li_total_amount.setValue(lsTotalAmt);
                                this.manageCalculations({ totalAmt: nonMetalPreTotalVal });
                            }
                        });
                    } else {
                        this.lineItemForm.controls.fcn_li_rate.setValue(value);
                        this.manageCalculations({ totalAmt: totalAmt, nettAmt });
                    }
                }
                else if (this.lineItemService.blockMinimumPrice == 'W') {
                    if (this.lineItemModalForSalesReturn || parseFloat(this.lineItemService.blockMinimumPriceValue) >= parseFloat(value)) {
                        this.openDialog(
                            'Warning7',
                            `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.lineItemService.blockMinimumPriceValue
                            }`,
                            false
                        );
                        this.dialogBox.afterClosed().subscribe((data: any) => {
                            if (data == 'No') {
                                this.lineItemForm.controls.fcn_li_total_amount.setValue(
                                    lsTotalAmt
                                );
                                const lsNettAmt = localStorage.getItem('fcn_li_net_amount')
                                this.manageCalculations();
                            } else {
                                this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
                                this.lineItemForm.controls.fcn_li_rate.setValue(value);
                                this.manageCalculations({ totalAmt: totalAmt, nettAmt });
                            }
                        });
                    } else {
                        this.lineItemForm.controls.fcn_li_rate.setValue(value);
                        this.manageCalculations({ totalAmt: totalAmt, nettAmt });
                    }
                } else {
                    this.lineItemForm.controls.fcn_li_rate.setValue(value);
                    this.manageCalculations({ totalAmt: totalAmt, nettAmt });
                }

            } else {
                // Rate Cannot be Less Than Cost
                this.openDialog('Warning8', this.comFunc.getMsgByID('MSG1721'), true);
                this.dialogBox.afterClosed().subscribe((data: any) => {
                    if (data == 'OK') {
                        if (this.divisionMS == 'M') {
                           
                            this.lineItemForm.controls.fcn_li_rate.setValue(
                                preRateVal
                            );
                            this.lineItemForm.controls.fcn_li_total_amount.setValue(
                                this.comFunc.emptyToZero(preTotalVal)
                            );
                            this.lineItemForm.controls.fcn_li_net_amount.setValue(
                                this.comFunc.transformDecimalVB(
                                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                    preNetAmtVal
                                )
                            );

                            this.manageCalculations({ totalAmt: preTotalVal });
                            // this.manageCalculations();
                            this.renderer.selectRootElement('#fcn_li_net_amount').focus();
                        }
                        else if (this.divisionMS == 'S') {

                            this.lineItemForm.controls.fcn_li_rate.setValue(
                                nonMetalPreRateVal
                            );

                            this.lineItemForm.controls.fcn_li_total_amount.setValue(
                                nonMetalPreTotalVal
                            );
                        }
                    }

                });
            }
        } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(0);
            this.lineItemForm.controls.fcn_li_total_amount.setValue(0);
            this.manageCalculations();
        }
    }


    changeDisAmount(event: any, nettAmt: any = null) {
        const preDisAmtVal =
            this.comFunc.decimalQuantityFormat(
                this.comFunc.emptyToZero(localStorage.getItem('fcn_li_discount_amount')),
                'AMOUNT')

        if (event.target.value != '') {
            const value =
          
                this.comFunc.transformDecimalVB(
                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                    (this.lineItemForm.value.fcn_li_discount_amount /
                        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)) *
                    100
                );

            this.lineItemForm.controls.fcn_li_discount_percentage.setValue(value);

            this.changeDisPer({ target: { value: value } }, event.target.value, nettAmt);
           
        } else {
            this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
            this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
            this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(0.0);

            this.manageCalculations();
        }
    }

    changeDisPer(event: any, discountAmt = null, nettAmt = null) {


        if (event.target.value != '') {
            let disAmt;
            if (discountAmt != null && nettAmt == null) {
                disAmt = discountAmt;
                this.disFunc(disAmt);
            }

            if (discountAmt == null && nettAmt == null) {
                const value = this.getPercentage(
                    this.lineItemForm.value.fcn_li_discount_percentage,
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
                );
                disAmt = this.comFunc.transformDecimalVB(
                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                    value
                );
                this.disFunc(disAmt);

            } else {
                disAmt = this.lineItemForm.value.fcn_li_discount_amount;

                this.manageCalculations({ disAmt: disAmt, nettAmt });
            }

     

        } else {
            this.lineItemForm.controls.fcn_li_discount_amount.setValue(0.0);
            this.manageCalculations();
        }
    }



    disFunc(disAmt: any) {
        this.lineItemForm.controls.fcn_li_discount_amount.setValue(
            disAmt
        );

        this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) -
                disAmt
            )
        );

        let taxAmount;
        taxAmount = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.getPercentage(
                parseFloat(this.lineItemForm.value.fcn_li_tax_percentage),
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
            )
        );
        this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, taxAmount)
        );


        /** set nett amount */
        const netAmtValue =
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) +
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);
        this.lineItemForm.controls['fcn_li_net_amount'].setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, netAmtValue)
        );
        localStorage.setItem('fcn_li_net_amount', netAmtValue.toString())

        this.validateMinSalePrice()
    }

    validateMinSalePrice() {
        const grossAmt = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount);
        const grossWt = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);
        let preDisAmtVal = this.comFunc.decimalQuantityFormat(
            this.comFunc.emptyToZero(localStorage.getItem('fcn_li_discount_amount')),
            'AMOUNT')
        const preDisPerVal =
            this.comFunc.decimalQuantityFormat(
                this.comFunc.emptyToZero(localStorage.getItem('fcn_li_discount_percentage')),
                'AMOUNT')


        const value = (grossAmt / grossWt).toString();




        let checkStockCostVal =
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) /
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

        if (this.divisionMS == 'S') {
            if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
                this.manageCalculations();
                
            }
            else {
                // Rate Cannot be Less Than Cost
                this.openDialog('Warning9', this.comFunc.getMsgByID('MSG1721'), true);
                this.dialogBox.afterClosed().subscribe((data: any) => {
                    if (data == 'OK') {
                        this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
                            preDisPerVal || this.zeroAmtVal
                           
                        );
                        if (parseFloat(preDisPerVal) == 0)
                            preDisAmtVal = 0;
                        this.lineItemForm.controls.fcn_li_discount_amount.setValue(
                            preDisAmtVal || this.zeroAmtVal
                        );
                        this.manageCalculations();
                    }
                });
            }
        }
        // }
    }


    changeStoneWt(event: any) {
        const value = event.target.value;
      
        if (value != '') {
            if (
                parseFloat(value) > parseFloat(this.lineItemForm.value.fcn_li_gross_wt)
            ) {
                this.openDialog(
                    'Warning',
                    'Stone weight cannot be exceeded Gross weight',
                    true
                );

                this.dialogBox.afterClosed().subscribe((data: any) => {
                    if (data == 'OK') {
                        this.lineItemForm.controls['fcn_li_stone_wt'].setValue(this.zeroMQtyVal);
                       
                        this.manageCalculations();
                    }
                });
            } else {
                
                this.manageCalculations();
            }
        } else {
            this.lineItemForm.controls.fcn_li_stone_wt.setValue(this.zeroMQtyVal);
           
            this.manageCalculations();
        }
    }
    setValToLocalStorage(event: any, name: any) {
        let checkStockCostVal =
            parseFloat(this.lineItemForm.value.fcn_li_net_amount) /
            parseFloat(this.lineItemForm.value.fcn_li_gross_wt);

        if (name == 'fcn_li_net_amount') {
            if (this.divisionMS == 'M') {

                if (
                    parseFloat(this.lineItemForm.value.fcn_li_net_amount) >
                    parseFloat(this.lineItemForm.value.fcn_ad_metal_amount)
                ) {
                    localStorage.setItem(name, event.target.value.toString());

                }
            }
            if (this.divisionMS == 'S') {

                if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
                    localStorage.setItem(name, event.target.value.toString());

                }
            }

        } else {
            localStorage.setItem(name, event.target.value.toString());
        }

    }

    changeGrossAmt(event: any) {
        const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_gross_amount'));
        if (event.target.value != '') {
            let totalAmt = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
            let grossAmt = this.comFunc.emptyToZero(event.target.value);
            if (this.divisionMS == 'S') {

                const taxAmt = this.getPercentage(
                    this.lineItemForm.value.fcn_li_tax_percentage,
                    this.lineItemForm.value.fcn_li_gross_amount
                );

                const value =
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) +
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);


                const nettAmt = this.comFunc.transformDecimalVB(
                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                    value
                );


                let checkStockCostVal =
                    this.comFunc.emptyToZero(nettAmt) /
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

                if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {

                    localStorage.setItem('fcn_li_gross_amount', this.comFunc.transformDecimalVB(
                        this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(event.target.value)).toString());

                    this.changeGrossFunc(totalAmt, grossAmt);


                } else {
                    // Rate Cannot be Less Than Cost
                    this.openDialog('Warning11', this.comFunc.getMsgByID('MSG1721'), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls.fcn_li_gross_amount.setValue(
                                this.comFunc.transformDecimalVB(
                                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                    preVal
                                )
                            );
                            // this.changeGrossFunc(totalAmt, preVal);
                            this.manageCalculations();
                        }
                    });
                }

            } else {

                let stoneAmt = this.comFunc.emptyToZero(
                    this.lineItemForm.value.fcn_ad_stone_amount
                );
                
                let mtlAmt = this.comFunc.emptyToZero(
                    this.lineItemForm.value.fcn_ad_metal_amount
                );
                let mkgAmt = grossAmt - (stoneAmt + mtlAmt)
                this.changeTotalAmt({ target: { value: mkgAmt } });
               

                this.setTaxAmt();
                this.setNettAmt();
            }
        } else {
        }
    }
    setTaxAmt() {
        const value = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS, this.getPercentage(
                this.lineItemForm.value.fcn_li_tax_percentage,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
            ));
        this.lineItemForm.controls['fcn_li_tax_amount'].setValue(value);
        this.li_tax_amount_val = value;
        this.setNettAmt();
    }
    setNettAmt() {

        const value =
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) +
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);
        const nettAmt = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            value
        );
        this.lineItemForm.controls['fcn_li_net_amount'].setValue(nettAmt);
        this.li_net_amount_val = nettAmt;


    }
    changeGrossFunc(totalAmt: any, grossAmt: any) {

        this.lineItemForm.controls.fcn_li_discount_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                parseFloat(totalAmt) - parseFloat(grossAmt)
            )
        );
        const disPer = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            (this.lineItemForm.value.fcn_li_discount_amount /
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)) *
            100
        );
        this.lineItemForm.controls.fcn_li_discount_percentage.setValue(disPer);

        this.setTaxAmt();

        this.setNettAmt();

    }
    async changeNettAmt(event: any) {

        
        const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_net_amount'));
        const netAmtVal = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount)
        if (event.target.value != '') {
            let checkStockCostVal =
                netAmtVal /
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

            if (this.divisionMS == 'M') {

                if (

                    netAmtVal >
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
                ) {
                    this.netAmtFunc(event);
                } else {
                    this.openDialog('Warning12', this.comFunc.getMsgByID('MSG1914'), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls.fcn_li_net_amount.setValue(
                                this.comFunc.commaSeperation(
                                    this.comFunc.transformDecimalVB(
                                        this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                        preVal
                                    )
                                )
                            );
                        }
                    });
                }
            }

            if (this.divisionMS == 'S') {

                if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
                    this.netAmtFunc(event);
                } else {
                    // Rate Cannot be Less Than Cost
                    this.openDialog('Warning13', this.comFunc.getMsgByID('MSG1721'), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                            this.lineItemForm.controls.fcn_li_net_amount.setValue(
                                this.comFunc.transformDecimalVB(
                                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                                    preVal
                                )
                            );
                        }
                    });
                }
            }

        } else {
            this.lineItemForm.controls['fcn_li_total_amount'].setValue(
                this.zeroAmtVal
            );
            this.lineItemForm.controls['fcn_ad_amount'].setValue(this.zeroAmtVal);
            // this.setGrossAmt();
            this.manageCalculations();
        }
    }

    netAmtFunc(event: any) {
        this.lineItemForm.controls.fcn_li_net_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(event.target.value)
            )
        );

        const taxAmt = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) *
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage)) /
            (100 + this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage))
        );
        const grossAmt =
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) -
                this.comFunc.emptyToZero(taxAmt));


        let totalAmt;
        if (this.divisionMS == 'M') {
            totalAmt = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                parseFloat(grossAmt) -
                (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount || 0) +
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount || 0))
            );
        } else {
            totalAmt = this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
            );
        }
       
        let discountAmt = this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            parseFloat(totalAmt) - parseFloat(grossAmt)
        );

        

        this.lineItemForm.controls.fcn_li_tax_amount.setValue(taxAmt);
        this.lineItemForm.controls.fcn_li_gross_amount.setValue(grossAmt);
        this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);


        if (this.divisionMS == 'M') {
            this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
            this.changeTotalAmt(
                { target: { value: totalAmt } },
                this.lineItemForm.value.fcn_li_net_amount
            );
        } else {
            if (parseFloat(discountAmt.toString()) < 0)
                discountAmt = this.zeroAmtVal;
            this.lineItemForm.controls.fcn_li_discount_amount.setValue(
                discountAmt
            );
            this.changeDisAmount(
                { target: { value: discountAmt } },
                this.lineItemForm.value.fcn_li_net_amount
            );

           
        }

    }


    addItemtoList(btn: any) {
        Object.values(this.lineItemForm.controls).forEach(control => {
            control.markAsTouched();
        });
        if (!this.lineItemForm.invalid) {
            if (
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) >=
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
            ) {
                this.updateBtn = false;

                if (this.newLineItem.STOCK_CODE == '') {
                    this.openDialog('Warning', 'Invalid Stock Code', true);
                } else {
                    let itemsLengths = this.ordered_items[this.ordered_items.length - 1];

                    if (
                        this.orderedItemEditId == '' ||
                        this.orderedItemEditId == undefined ||
                        this.orderedItemEditId == null
                    ) {
                        if (itemsLengths == undefined) itemsLengths = 1;
                        else itemsLengths = itemsLengths.ID + 1;
                        this.order_items_slno_length = itemsLengths;
                    } else {
                        itemsLengths = this.orderedItemEditId;
                        this.order_items_slno_length = itemsLengths;
                    }

                    var temp_resp = this.newLineItem;


                    var values: any = {
                        ID: this.order_items_slno_length,
                        sn_no: this.order_items_slno_length,
                        stock_code: this.newLineItem.STOCK_CODE,
                        mkg_amount: this.lineItemForm.value.fcn_ad_making_amount || 0,
                        // total_amount: temp_resp.PRICE1LC,
                        pcs: this.lineItemForm.value.fcn_li_pcs,
                        weight: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
                        description: this.lineItemForm.value.fcn_li_item_desc,
                        tax_amount: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount),
                        net_amount: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount),
                        pure_wt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pure_wt),
                        making_amt: this.lineItemForm.value.total_amount || 0,
                        // making_amt: this.lineItemForm.value.fcn_ad_making_amount || 0,
                        metal_rate: this.lineItemForm.value.fcn_ad_metal_rate || 0,
                        metal_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) || 0,
                        stone_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount) || 0,
                        dis_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount) || 0,
                        gross_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) || 0,
                        rate: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) || 0,
                        taxPer: this.lineItemForm.value.fcn_li_tax_percentage || 0,
                    };

                    values.total_amount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
                    // values.total_amount = this.lineItemForm.value.fcn_li_total_amount;
                    this.newLineItem.HSN_CODE = this.newLineItem.HSN_CODE;
                    this.newLineItem.GST_CODE = this.newLineItem.GST_CODE;
                    this.newLineItem.pcs = this.lineItemForm.value.fcn_li_pcs;
                    this.newLineItem.pure_wt = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pure_wt);
                    this.newLineItem.STONE_WT = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt);
                    this.newLineItem.total_amount =
                        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
                    this.newLineItem.divisionMS = this.divisionMS;

                    if (
                        this.orderedItemEditId == '' ||
                        this.orderedItemEditId == undefined ||
                        this.orderedItemEditId == null
                    ) {
                        this.ordered_items.push(values);
                        // this.orderedItemEditId = '';
                    } else {
                        const preitemIndex = this.ordered_items.findIndex((data) => {
                            
                            console.table(data.SRNO == this.orderedItemEditId);
                            return data.sn_no == this.orderedItemEditId;
                        });
                        if (preitemIndex != -1) {
                            values.sn_no = this.orderedItemEditId;

                            this.ordered_items[preitemIndex] = values;
                        }
                    }
                    this.sumTotalValues();
                    this.setPosItemData(this.order_items_slno_length, this.newLineItem);
                    this.newLineItem.STOCK_CODE = '';

                    this.li_division_val = '';
                    this.li_item_code_val = '';
                    this.li_item_desc_val = '';
                    this.li_location_val = '';
                    this.li_gross_wt_val = '';
                    this.li_stone_wt_val = '';
                    this.li_net_wt_val = '';
                    this.li_making_rate_val = '';
                    this.li_making_amount_val = '';
                    this.li_stone_rate_val = '';
                    this.li_stone_amount_val = '';
                    this.li_metal_rate_val = '';
                    this.li_metal_amount_val = '';
                    this.li_rate_val = '';
                    this.li_total_val = '';
                    this.li_discount_percentage_val = '';
                    this.li_discount_amount_val = '';
                    this.li_gross_amount_val = '';
                    this.li_tax_percentage_val = '';
                    this.li_tax_amount_val = '';
                    this.li_net_amount_val = '';
                    this.li_tag_val = '';

                    this.lineItemForm.reset();
                    this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
                    this.setRetailSalesDataPost();

                    if (btn == 'finish_btn') {
                        this.modal.dismiss('Cross click');
                    }

                }

            } else {
                this.openDialog('Warning', this.comFunc.getMsgByID('MSG1914'), true);
               
            }
        } else {
        
            this.snackBar.open('Please Fill Required Fields', '', {
                duration: 2000 // time in milliseconds
            });
        }
    }


    editTable = async (event: any) => {

        event.cancel = true;
        this.orderedItemEditId = event.sn_no;
        this.lineItemService.getData().subscribe(data => {
            this.currentLineItems = data;
        });
        const value: any = this.currentLineItems.filter(
            (data: any) => data.SRNO == event.sn_no
        )[0];


        this.updateBtn = true;

        this.newLineItem = value;


        this.snackBar.open('Loading...');

        let API = 'RetailSalesStockValidation?strStockCode=' + value.STOCK_CODE
            +
            '&strBranchCode=' + this.strBranchcode +
            '&strVocType=' + this.vocType + '&strUserName=' + this.strUser +
            '&strLocation=%27%27&strPartyCode=%27%27&strVocDate=' + this.convertDateToYMD(this.vocDataForm.value.vocdate)
        await
            this.suntechApi.getDynamicAPI(API)
                .subscribe(async (resp: any) => {
                    this.snackBar.dismiss();
                  
                    if (resp != null) {
                        if (resp.resultStatus.RESULT_TYPE == 'Success') {
                            let stockInfos = resp.stockInfo;

                            this.newLineItem.IS_BARCODED_ITEM = stockInfos.IS_BARCODED_ITEM;
                            this.newLineItem.DONT_SHOW_STOCKBAL = stockInfos.DONT_SHOW_STOCKBAL;
                            this.newLineItem.PCS_TO_GMS = stockInfos.PCS_TO_GMS;
                            this.newLineItem.GSTVATONMAKING = stockInfos.GSTVATONMAKING;
                            this.newLineItem.ALLOWEDITDESCRIPTION = stockInfos.ALLOWEDITDESCRIPTION;
                            //   this.disableSaveBtn = false;
                            this.validatePCS = stockInfos.VALIDATE_PCS;
                            this.managePcsGrossWt();

                            this.newLineItem.BLOCK_GRWT = this.comFunc.stringToBoolean(stockInfos.BLOCK_GRWT?.toString());
                            this.newLineItem.DIVISION = stockInfos.DIVISION;
                            this.newLineItem.MAKING_ON = stockInfos.MAKING_ON;
                            this.newLineItem.LESSTHANCOST = stockInfos.LESSTHANCOST;

                            this.lineItemService.isStoneIncluded = this.comFunc.stringToBoolean(stockInfos.STONE);
                            if (this.newLineItem.IS_BARCODED_ITEM != undefined && this.newLineItem.TPROMOTIONALITEM != undefined) {

                                if (!this.newLineItem?.IS_BARCODED_ITEM || this.comFunc.stringToBoolean(this.newLineItem?.TPROMOTIONALITEM.toString()))
                                    this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);

                            }

                        }
                    }

                })



        this.newLineItem.STOCK_CODE = value.STOCK_CODE;
        this.newLineItem.DIVISION = value.DIVISION_CODE;
        this.newLineItem.HSN_CODE = value.HSNCODE;
        this.newLineItem.GST_CODE = value.VATCODE;
        this.newLineItem.MAIN_STOCK_CODE = value.MAINSTOCKCODE;// changed at 16/3/2024
        // this.newLineItem.MAIN_STOCK_CODE = value.MainStockCode;
        this.newLineItem.STOCK_COST = value.STKTRANMKGCOST; // changed at 16/3/2024
        // this.newLineItem.STOCK_COST = value.StkTranMkgCost;
        // this.divisionMS = value.divisionMS;




        this.lineItemForm.controls.fcn_li_item_code.setValue(value.STOCK_CODE);
        this.lineItemForm.controls.fcn_li_item_desc.setValue(value.STOCK_DOCDESC);
        this.lineItemForm.controls.fcn_li_division.setValue(value.DIVISION_CODE);
        this.lineItemForm.controls.fcn_li_location.setValue(value.LOCTYPE_CODE);
        this.lineItemForm.controls.fcn_li_pcs.setValue(value.PCS);
        this.lineItemForm.controls.fcn_li_gross_wt.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                value.GROSSWT));
        this.lineItemForm.controls.fcn_li_stone_wt.setValue(

            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BSQTYDECIMALS,
                value.STONEWT));
        this.lineItemForm.controls.fcn_li_net_wt.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                value.NETWT));
        this.lineItemForm.controls.fcn_li_rate.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(value.MKG_RATEFC)));
        this.lineItemForm.controls.fcn_li_total_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, parseFloat(value.MKGVALUEFC)));
        this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.DISCOUNT)
        );
        this.lineItemForm.controls.fcn_li_discount_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.DISCOUNTVALUEFC)
        );
        this.lineItemForm.controls.fcn_li_gross_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.NETVALUEFC)
        );
        this.lineItemForm.controls.fcn_li_tax_percentage.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.VAT_PER
            )
        );
        this.lineItemForm.controls.fcn_li_tax_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.VAT_AMOUNTFC));
        this.lineItemForm.controls.fcn_li_net_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.TOTALWITHVATFC));

        this.lineItemForm.controls.fcn_li_purity.setValue(
            this.comFunc.decimalQuantityFormat(value.PURITY, 'PURITY')
        );

        this.lineItemForm.controls.fcn_li_pure_wt.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS, value.PUREWT)
        );


        this.lineItemForm.controls.fcn_ad_amount.setValue(

            value.MKGMTLNETRATE // changed at 18/3/2024
        );
        this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
        this.lineItemForm.controls.fcn_ad_rate.setValue(value.MKGMTLNETRATE); // changed at 18/3/2024
        this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TAGLINES);
        
        this.lineItemForm.controls.fcn_ad_stone_rate.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.STONE_RATEFC));
        this.lineItemForm.controls.fcn_ad_stone_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.STONEVALUEFC));
        this.lineItemForm.controls.fcn_ad_metal_rate.setValue(

            this.comFunc.decimalQuantityFormat(value.METAL_RATE, 'METAL_RATE')

        );
        this.lineItemForm.controls.fcn_ad_metal_amount.setValue(
            this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, value.METALVALUEFC));

        if (this.editOnly || this.viewOnly) {
            const divisionMS = this.comFunc.getDivisionMS(value.DIVISION_CODE);
            this.divisionMS = divisionMS;
        } else {
            this.divisionMS = value.DIVISIONMS;
        }
        if (!this.viewOnly) {
          
        }

        localStorage.setItem('fcn_li_rate', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate).toString());
        localStorage.setItem('fcn_li_total_amount', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount).toString());
        localStorage.setItem('fcn_li_net_amount', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount).toString());



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

        this.ordered_items.forEach(function (item) {
          

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



        // Metal purchase (Exchange)
        this.sumExchangeItem();
        this.sumRetailSalesReturn();
        this.order_total_exchange = total_exchange;

    
        this.order_items_total_net_amount = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.order_items_total_gross_amount -
            // total_sales_return_sum -
            this.invReturnSalesTotalNetTotal -
            total_exchange
        );

        this.grossAmountEvent.emit(this.order_items_total_gross_amount);

        this.totalTaxEvent.emit(this.order_items_total_tax);

        this.itemTotalEvent.emit(this.prnt_inv_total_gross_amt);

        this.netTotalEvent.emit(this.order_items_total_net_amount);


        this.order_items_total_net_amount_org = this.order_items_total_net_amount;
        this.netAmountEvent.emit(this.order_items_total_net_amount_org)
        this.sumReceiptItem();

    }

    // Receipt
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


        //Joins all the string into one and returns it
        return digitsGroup.join(' ');
    }


    setPosItemData(sno: any, data: any) {

        let temp_pos_item_data: any = {
            // new values
            // "UNIQUEID": 0,

            DIVISIONMS: data.divisionMS,
            SRNO: sno,
            DIVISION_CODE: data.DIVISION,
            STOCK_CODE: data.STOCK_CODE, // m
            GROSS_AMT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) || 0,
            PCS: data.pcs, //m
            GROSSWT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
            STONEWT: data.STONE_WT, // m
            NETWT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt), // m
            PURITY: data.PURITY, // m
            PUREWT: data.pure_wt, // m
            CHARGABLEWT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt), // net weight
            // CHARGABLEWT: data.NET_WT, // net weight
            MKG_RATEFC: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) || 0, //need
            MKG_RATECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate), this.vocDataForm.value.txtCurRate
            ), // cctofc rate

            MKGVALUEFC: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount), // metal amount
            MKGVALUECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount), this.vocDataForm.value.txtCurRate
            ), // metal amount
            RATE_TYPE: data.RATE_TYPE, //need_input
            METAL_RATE: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_rate
            ),

            METAL_RATE_GMSFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_rate
            ), //need_input
            METAL_RATE_GMSCC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate), this.vocDataForm.value.txtCurRate
            ),

            // "METAL_RATE_GMSFC": 18.1, // jeba
            // "METAL_RATE_GMSCC": 19.1, // jeba
            METALVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_amount
            ),

            METALVALUECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount), this.vocDataForm.value.txtCurRate
            ),
            STONE_RATEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_stone_rate
            ),
            STONE_RATECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate), this.vocDataForm.value.txtCurRate
            ),
            STONEVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_stone_amount
            ),
            STONEVALUECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount), this.vocDataForm.value.txtCurRate
            ),
            DISCOUNT: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_discount_percentage
            ),
            DISCOUNTVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_discount_amount
            ),
            DISCOUNTVALUECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount), this.vocDataForm.value.txtCurRate
            ),
            NETVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_gross_amount
            ),
            NETVALUECC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount), this.vocDataForm.value.txtCurRate
            ),
            // NETVALUEFC: this.comFunc.emptyToZero(
            //   this.lineItemForm.value.fcn_li_net_amount
            // ),
            // NETVALUECC: this.comFunc.FCToCC(
            //   this.comFunc.compCurrency,
            //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount)
            // ),
            PUDIFF: 0,
            STONEDIFF: 0,
            PONO: 0, //need_input
            LOCTYPE_CODE: this.lineItemForm.value.fcn_li_location, // need
            SUPPLIER: data.SUPPLIER || '',
            STOCK_DOCDESC: this.lineItemForm.value.fcn_li_item_desc,
            LOCKED: false,
            MCLENGTH: 0, //need_input
            MCUNIT: 0,
            POSSALESSR: '',
            PHYSICALSTOCK: '',
            METALAMT: '0',
            MAKINGAMT: '0',
            // METALAMT: `${this.comFunc.emptyToZero(
            //   this.lineItemForm.value.fcn_ad_metal_amount
            // )}`,
            // MAKINGAMT: `${this.comFunc.emptyToZero(
            //   this.lineItemForm.value.fcn_li_total_amount
            // )}`,
            STDIFFAC: '',
            STAMTAC: '',
            // STKTRANMKGCOST: '0',
            STKTRANMKGCOST: data.STOCK_COST,
            MAINSTOCKCODE: data.MAIN_STOCK_CODE, //need field
            MKGMTLNETRATE: this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) +
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
            ),

            MTL_SIZE: '',
            MTL_COLOR: '',
            MTL_DESIGN: '',
            SALESPERSON_CODE: this.vocDataForm.value.sales_person || '', //need
            STKTRN_LANDINGCOST: data.STOCK_COST, //need
            STKTRN_WASTAGERATE: 0, //need

            HSN_CODE: data.HSN_CODE,
            VATCODE: data.GST_CODE,

            VAT_PER: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_tax_percentage
            ),

            VAT_AMOUNTFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_tax_amount
            ),
            VAT_AMOUNTLC: this.comFunc.emptyToZero(
                this.comFunc.FCToCC(
                    this.vocDataForm.value.txtCurrency,
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount), this.vocDataForm.value.txtCurRate
                )
            ),
            TOTALWITHVATFC: this.comFunc.emptyToZero(
                // this.order_items_total_gross_amount,
                this.lineItemForm.value.fcn_li_net_amount
                
            ),
            TOTALWITHVATLC:
                this.comFunc.emptyToZero(
                    this.comFunc.FCToCC(
                        this.vocDataForm.value.txtCurrency,
                        this.comFunc.emptyToZero(
                            this.lineItemForm.value.fcn_li_net_amount
                           
                        ), this.vocDataForm.value.txtCurRate
                    )
                ) || 0,

            RS_PICTUREPATH: '',
            RSO_FIXED: false,
            RSORDERGROSSWT: 0,
            RUBY_WT: 0,
            RUBY_RATE: 0,
            RUBY_AMOUNTFC: 0,
            RUBY_AMOUNTCC: 0,
            EMERALD_WT: 0,
            EMERALD_RATE: 0,
            EMERALD_AMOUNTFC: 0,
            EMERALD_AMOUNTCC: 0,
            SAPPHIRE_WT: 0,
            SAPPHIRE_RATE: 0,
            SAPPHIRE_AMOUNTFC: 0,
            SAPPHIRE_AMOUNTCC: 0,
            ZIRCON_WT: 0,
            ZIRCON_RATE: 0,
            ZIRCON_AMOUNTFC: 0,
            ZIRCON_AMOUNTCC: 0,
            COLOR_STONE_WT: 0,
            COLOR_STONE_RATE: 0,
            COLOR_STONE_AMOUNTFC: 0,
            COLOR_STONE_AMOUNTCC: 0,
            SJEW_TAGLINES: this.lineItemForm.value.fcn_tab_details || '',
            DSALEPERSON_CODE: '',
            VAT_ACCODE: '',

            // Loyalty_Item: false,
            WASTE_PER: 0,

            DT_BRANCH_CODE: this.strBranchcode,
            DT_VOCNO: '0', // to 0
            DT_VOCTYPE: this.vocType, // change
            // "DT_VOCTYPE":  this.vocType, // change
            DT_YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
            DT_BLOCKPSRIMPORT: false,
            // GIFT_ITEM: false,

            // STOCKCHECKOTHERBRANCH: false,
            // DTREMARKS: '',
            SERVICE_STOCK_CODE: '',
            GSTMETALPER: 0.0,
            GSTMAKINGPER: 0.0,
            GSTOTHERPER: 0.0,
            GSTMETALAMT_CC: 0.0,
            GSTMAKINGAMT_CC: 0.0,
            GSTOTHERAMT_CC: 0.0,
            GSTMETALAMT_FC: 0.0,
            GSTMAKINGAMT_FC: 0.0,
            GSTOTHERAMT_FC: 0.0,
            TOTALWITHGST_CC: 0.0,
            TOTALWITHGST_FC: 0.0,

            EXTRA_STOCK_CODE: '001293413', //need
            // flagEStk: '0',
            OT_TRANSFER_TIME: '',
            // IssueGiftVoucher: false,

            MARGIN_PER: '0.000',
            MARGIN_AMTFC: '0.000',
            MARGIN_AMTCC: '0.000',
            CGST_PER: '0.00',
            CGST_AMOUNTFC: '0.000',
            CGST_AMOUNTCC: '0.000',
            SGST_PER: '0.000',
            SGST_AMOUNTFC: '0.000',
            SGST_AMOUNTCC: '0.000',
            IGST_PER: this.lineItemForm.value.fcn_li_tax_percentage || 0,
            IGST_AMOUNTFC: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount) || 0,
            IGST_AMOUNTCC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount), this.vocDataForm.value.txtCurRate
            ),
            CGST_ACCODE: '',
            SGST_ACCODE: '',
            IGST_ACCODE: '',
            TOTAL_AMOUNTFC: this.comFunc.emptyToZero(
                this.order_items_total_gross_amount
            ),
            TOTAL_AMOUNTCC: this.comFunc.FCToCC(
                this.vocDataForm.value.txtCurrency,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount), this.vocDataForm.value.txtCurRate
            ),
            CGST_CTRLACCODE: '',
            SGST_CTRLACCODE: '',
            IGST_CTRLACCODE: '',
            GST_GROUP: '',
            GST_CODE: data['GST_CODE'],
            SERVICE_ACCODE: '',
            WASTAGEPER: '0.00',
            WASTAGEQTY: '0.000',
            WASTAGEPUREWT: '0.000',
            WASTAGEAMOUNTFC: '0.000',
            WASTAGEAMOUNTCC: '0.000',
            // INCLUSIVE: false,
            // OLDRATE: '',
            // OLDAMOUNT: '',
            // DISC_USER_NAME: '',
            // DISC_AMOUNT: '0.000',
            // DISC_PERCENTAGE: '0.000',
            // KUNDAN_UNIT: '0',
            // KUNDAN_PCS: '0',
            // KUNDAN_CARAT: '0.000',
            // KUNDAN_WEIGHT: '0.000',
            // KUNDAN_RATEFC: '0.000',
            // KUNDAN_RATECC: '0.000',
            // KUNDANVALUEFC: '0.000',
            // KUNDANVALUECC: '0.000',
            // CESS_PER: '0.000',
            // CESS_AMOUNTFC: '0.000',
            // CESS_AMOUNTCC: '0.000',
            // ROS_FIXED: '0',
            // BATCHID: '0',
            // STAMP_RATE: '0.000000',
            // STAMP_AMOUNT: '0.00',
            // STAMP_AMOUNTCC: '0.00',
            // SET_REF: '',
            // LOYALTY_POINTS: '0.00',
            // SALES_TAGLINES: '',
            // GPC_STONEDIFF_AC: '',
            // GPC_STONEVALUESALES_AC: '',
            // GPC_POSSALES_AC: '',
            // GPC_KUNDANVALUESALES_AC: '',
            // GPC_POSSALESSR_AC: '',
            // GPC_METALAMT_AC: '',
            // GPC_PHYSICALSTOCK_AC: '',
            // GPC_WASTAGE_AC: '',
            // GPC_STAMPCHARGE_AC: '',
            // COUNTRY_CODE: '',
            // UNIT_CODE: '',
            // FLAGESTK: '0',
            "INCLUSIVE": false,
            "OLDRATE": '0',
            "OLDAMOUNT": '0',
            "DISC_USER_NAME": '0',
            "DISC_AMOUNT": '0.000',
            "DISC_PERCENTAGE": '0.000',
            "KUNDAN_UNIT": '0',
            "KUNDAN_PCS": '0',
            "KUNDAN_CARAT": '0.000',
            "KUNDAN_WEIGHT": '0.000',
            "KUNDAN_RATEFC": '0.000',
            "KUNDAN_RATECC": '0.000',
            "KUNDANVALUEFC": '0.000',
            "KUNDANVALUECC": '0.000',
            "CESS_PER": '0.000',
            "CESS_AMOUNTFC": '0.000',
            "CESS_AMOUNTCC": '0.000',
            "ROS_FIXED": '0',
            "BATCHID": '0',
            "STAMP_RATE": '0.000000',
            'STAMP_AMOUNT': '0.00',
            "STAMP_AMOUNTCC": '0.00',
            "SET_REF": '0',
            "LOYALTY_POINTS": '0.00',
            "SALES_TAGLINES":
                this.lineItemForm.value.fcn_tab_details || '',
            "GPC_STONEDIFF_AC": '0',
            "GPC_STONEVALUESALES_AC": '0',
            "GPC_POSSALES_AC": '0',
            "GPC_KUNDANVALUESALES_AC": '0',
            "GPC_POSSALESSR_AC": '0',
            "GPC_METALAMT_AC": '0',
            "GPC_PHYSICALSTOCK_AC": '0',
            "GPC_WASTAGE_AC": '0',
            "GPC_STAMPCHARGE_AC": '0',
            "COUNTRY_CODE": '',
            "UNIT_CODE": '0',
            "FLAGESTK": '0',
            "GPC_MAKINGAMT_AC": '0',
            "DTSALESPERSON_CODE": "0",

            // new fields added - 28-12-2023
            "COMPONENT_PRICE_TYPE": "",
            "DTREMARKS": "",
            "DUFIX_METALGROSSWT": 0,
            "DUFIX_DIAPCS": 0,
            "DUFIX_DIACARAT": 0,
            "DUFIX_STONEPCS": 0,
            "DUFIX_STONECARAT": 0,
            "DUFIX_METAL_WT": 0,
            "DUFIX_FINEGOLD": 0,
            "DUFIX_MASTERFINEGOLD": 0,
            "DUFIX_DIACTRATEFC": 0,
            "DUFIX_DIACTRATECC": 0,
            "DUFIX_DIAVALUEFC": 0,
            "DUFIX_DIAVALUECC": 0,
            "DUFIX_CLRSTNRATEFC": 0,
            "DUFIX_CLRSTNRATECC": 0,
            "DUFIX_CLRSTNVALUEFC": 0,
            "DUFIX_CLRSTNVALUECC": 0,
            "DUFIX_METALVALUEFC": 0,
            "DUFIX_METALVALUECC": 0,
            "DUFIX_LABOURFC": 0,
            "DUFIX_LABOURCC": 0,
            "DUFIX_HMCHARGEFC": 0,
            "DUFIX_HMCHARGECC": 0,
            "DUFIX_CERTCHARGEFC": 0,
            "DUFIX_CERTCHARGECC": 0,
            "DUFIX_DWASTAGE": 0,
            "DUFIX_PURITY": 0,
            "DUFIX_PUDIFF": 0,
            "DUFIX_DKARAT_CODE": "",
            "DUFIX_METLA_WT": 0,
            "DUFIX_DWASTAGEPER": 0,
            "DUFIX_DWASTAGEAMOUNTFC": 0,
            "DUFIX_DWASTAGEAMOUNTCC": 0,
            "DUFIX_PEARL_PCS": 0,
            "DUFIX_PEARL_WT": 0,
            "DUFIX_PEARL_AMTFC": 0,
            "DUFIX_PEARL_AMTCC": 0,
            "DUFIX_DLABUNIT": 0,
            "DUFIX_DLABRATEFC": 0,
            "DUFIX_DLABRATECC": 0,
            "DUFIX_DCHARGABLEWEIGHT": 0,
            "GIFT_ITEM": false,
            "HSNCODE": "",
            "LESSTHANCOST_USER": "",
            "NEWUNIQUEID": 0,
            "STOCKCHECKOTHERBRANCH": false,

            // new fields added - 03-02-2024 for posplanet save calculation
            "GSTVATONMAKING": data.GSTVATONMAKING,
            "EXCLUDEGSTVAT": data.EXCLUDEGSTVAT,

        };

        let _taxamount = 0;
        _taxamount = data.PRICE1LC * (this.branch_tax_percentage / 100);

        let _net_amount_val = +_taxamount + +data.PRICE1LC;


        if (
            this.orderedItemEditId == '' ||
            this.orderedItemEditId == undefined ||
            this.orderedItemEditId == null
        ) {
            this.currentLineItems.push(temp_pos_item_data);
            this.lineItemService.setData(this.currentLineItems);
        } else {
            const preitemIndex = this.currentLineItems.findIndex((data: any) => {
                return data.SRNO == this.orderedItemEditId;
            });
           
            if (preitemIndex != -1) {
                temp_pos_item_data.SRNO = this.orderedItemEditId;
                this.currentLineItems[preitemIndex] = temp_pos_item_data;
            }
           
           
            this.orderedItemEditId = '';
        }
        this.pos_main_data.RetailDetails = this.currentLineItems;
    }



    setRetailSalesDataPost() {

        this.retailSalesDataPost =
        {
            MID: this.retailSalesMID,
            BRANCH_CODE: this.strBranchcode,
            VOCTYPE: 'EST',
            // VOCTYPE: this.vocType,
            VOCNO: this.retailSaleDataVocNo,
            
            RATE_TYPE: '', //need_input
            METAL_RATE: 0, //need_input
            SALES_ORDER: 0, //need_input
            TOTAL_PCS: this.comFunc.emptyToZero(this.prnt_inv_total_pcs),
            TOTAL_GRWT: this.comFunc.emptyToZero(this.prnt_inv_total_weight),
            TOTAL_PUWT: this.comFunc.emptyToZero(this.prnt_inv_total_pure_weight),
            TOTAL_MKGVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.order_items_total_amount)
            ),
            TOTAL_MKGVALUE_CC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.CCToFC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.order_items_total_amount)
                )
            ),
            TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.prnt_inv_total_metal_amt)
            ),
            TOTAL_METALVALUE_CC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.CCToFC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.prnt_inv_total_metal_amt)
                )
            ),
            TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.prnt_inv_total_stone_amt
            ),
            TOTAL_STONEVALUE_CC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.CCToFC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.prnt_inv_total_stone_amt)
                )
            ),
            TOTAL_PUDIFF: 0, //need_input
            TOTAL_STONEDIFF: 0, //need_input
            TOTAL_DISCVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.prnt_inv_total_dis_amt
            ), //need_input
            TOTAL_DISCVALUE_CC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.CCToFC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.prnt_inv_total_dis_amt)
                )
            ), //need_input

            NETVALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            // NETVALUE_FC: this.comFunc.transformDecimalVB(
            //   this.comFunc.amtDecimals,
            //   this.prnt_inv_total_gross_amt
            // ),
            NETVALUE_CC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.CCToFC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.order_items_total_gross_amount)
                    // this.comFunc.emptyToZero(this.prnt_inv_total_gross_amt)
                )
            ),
            // SYSTEM_DATE: , // need_input // check in api -
            SYSTEM_DATE: new Date().toISOString(), // need_input // check in api -
            // SYSTEM_DATE: this.dummyDate , // need_input // check in api -
            SRETURNMID: 0, //need
            SRETURNVOCNO: 0, //need
            SRETURNVOCTYPE: '',
            SRETURN_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.invReturnSalesTotalNetTotal
            ), //need
            SRETURN_VALUE_CC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal)
            ), //need
            PURCHASEMID: 0, //need
            PURCHASEVOCNO: 0, //need
            PURCHASEVOCTYPE: '',
            PURCHASE_VALUE_FC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.order_total_exchange
            ), //need
            PURCHASE_VALUE_CC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.order_total_exchange)
            ), //need
            ADJUST_ADVANCE: 0, //need
            DISCOUNT: this.order_items_total_discount_amount, // need_input
            // SUBTOTAL: this.prnt_inv_net_total_without_tax,
            SUBTOTAL: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            NETTOTAL: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            RECEIPT_TOTAL: 0, //need_input
            REFUND: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            // REFUND: 0,
            NAVSEQNO: 0, //need
          
            REMARKS: '', //need_input
            ITEM_CURRENCY: this.comFunc.compCurrency,
            ITEM_CURR_RATE: 1,
            ADJUST_ADVANCECC: 0,
            DISCOUNTCC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.order_items_total_discount_amount)
            ), // need_input
            SUBTOTALCC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            NETTOTALCC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            RECEIPT_TOTALCC: 0, //need_input
            REFUNDCC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.order_items_total_gross_amount)
            ),
            // REFUNDCC: 0,
            PENDING: 1,
            POSDETAILS: '',
            CREDITAC: '',
            DELIVERYDATE: this.dummyDate, //need
            ORDERMID: 0, //need
            FLAG_UPDATED: 'N',
            FLAG_INPROCESS: 'N',
           
            ORDEREXEDATE: this.dummyDate, //need
            FLAG_EDIT_ALLOW: 'N',
            D2DTRANSFER: 'F',
            RSCUSTIDNO: '',

            // etc fields
            RS_FIXED: false, //need
            SALESREFERENCE: '',
            TRANS_CODES: '0',
            CONSIGNMENTPARTY: '0',
            TOTALVAT_AMOUNTFC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.order_items_total_tax
            ),
            TOTALVAT_AMOUNTLC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.order_items_total_tax
            ),
            RSSTATE: '',
            SALESFIXINGMID: '0',
            SALESFIXINGREF: '0',
            REDEMPTIONTOTALVALUECC: 0,
            GSTVATAMOUNTFC: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                this.order_items_total_tax
            ),
            GSTVATAMOUNTCC: this.comFunc.CCToFC(
                this.comFunc.compCurrency,
                this.order_items_total_tax
            ),
            CCPOSTINGDONE: '0',
            BALANCE_FC: 0, //need
            BALANCE_CC: 0, //need
            LOCALREMARKSNEW: '0',
            MACHINEID: "0",
            AUTOPOSTING: false,
            POSTDATE: this.dummyDate, //need
            INVREF: '0',
            SCHEMESALESFIXINGPUREWT: 0,
            BLOCKPSRIMPORT: false,
            INCLUDEVAT: false,
            WAYBILLNO: '',
            WAYBILLDATE: this.dummyDate, //need
            HTUSERNAME: this.strUser || '',
            REMARKSNEW: '',
            REC_MODE: '',
            GENSEQNO: 0, //need
            CCSALESCOMMISIONAmountCC: 0,
            CCSALESCOMMISIONAmountFC: 0,
            GroupRef: '',
            INTIALPROMOTION: false,
            POSORDERADVVATAMTLC: 0,
            POSORDERADVVATAMTFC: 0,
            FROM_TOUCH: false,
            Agent_Commission: false,
            AgentCommission_Per: 0,
            CALCULATE_LOYALTY: true,
            TRAYN: false,
            TRANO: "0",
            POSReferenceRepairInvoice: '',
            RSLOGINMID: '0',
            TRAYNREFUND: false,
            TRAYNREFUNDDATE: this.dummyDate, //need
            SERVICE_INVOICE: false,
            GJVREFERENCE: '',
            GJVMID: 0, //need
            holdbarcode: false,
            PROMO_CODE: '',
            VATAMOUNTFCROUND: 0,
            VATAMOUNTFCROUNDCC: 0,
            LIFETIMEWARRANTY: false,
            SALESORDER_VALIDITYDATE: this.dummyDate, //need
            EmiratesSkywardsMile: false,
            ONLINERATE: false,
            CERTIFICATEPRINTED: '0',
            OT_TRANSFER_TIME: '',
            PLANETRESPONEFLG: false,
            PLANETQRURL: '',
            VoucherRedeemed: '',
            QRCODEIMAGE: '',
            QRCODEVALUE: '',
            BOARDINGPASS: '',
            WITHOUTVAT: false,
            FLIGHTNO: '',
            BOARDINGFROM: '',
            BOARDINGDATE: this.dummyDate, //need
            // new values
            CITY:
                //   this.customerDetailForm.value.fcn_cust_detail_city ||
                // this.customerDetails?.CITY ||
                '',
            //STATE: this.customerDetails?.STATE || '',
            ADDRESS:
                //   this.customerDetailForm.value.fcn_cust_detail_address ||
                // this.customerDetails?.ADDRESS ||
                '',
            COUNTRY_CODE:
                // this.customerDetailForm.value.fcn_cust_detail_country ||
                // this.customerDetails?.COUNTRY_CODE ||
                '',
            //CUST_LANGUAGE: this.customerDetails?.CUST_LANGUAGE || '0',
            PRINT_COUNT: 0,
            GST_TOTALFC: 0,
            GST_TOTALCC: 0,
            GST_STATE_CODE: '0',
            //  PANNO: this.customerDetails?.PANCARDNO || '0',
            GST_NUMBER: '',
            TRA_ID_TYPE: '0',
            //  POSCUSTIDNO: this.customerDetails?.POSCUSTIDNO || '',
            POS_CREDITLIMIT_AUTHORIZED_USER: '',
            POS_CREDITLIMIT_AUTHORIZED_REMARK: '',
            TOTALCESS_AMOUNTFC: 0,
            TOTALCESS_AMOUNTCC: 0,
            FORM_60: false,
            COMP_WISE_INVOICE: false,
            REFBY_CUSTCODE: '0',
            PRINT_COUNT_ACCOPY: 0,
            PRINT_COUNT_CNTLCOPY: 0,


            "ESTIMATION_STATUS": "O", // 0 - O
            "POS_REFERENCE": "",

           
        };


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

    updateRetailSalesReturnVal() {
        if (!this.lineItemForm.invalid) {
            this.setRetailSalesRowData(this.order_items_slno_length, this.newLineItem);
            this.modalReferenceSalesReturn.close();
        } else {
            this.snackBar.open('Please Fill Required Fields', '', {
                duration: 2000 // time in milliseconds
            });
        }
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

      
        this.invReturnSalesTotalNetTotal = this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            // total_sum
            net_sum
            // +       total_tax_amt
        );
       
    }

    setRetailSalesRowData(sno: any, data: any) {
        let temp_pos_item_data: any = {
            DIVISIONMS: data.DIVISIONMS,
            DIVISION_CODE: data.DIVISION_CODE,
            STOCK_CODE: data.STOCK_CODE,
            GROSS_AMT: this.lineItemForm.value.fcn_li_gross_amount || 0,
            PCS: this.lineItemForm.value.fcn_li_pcs || 1,
            GROSSWT: this.lineItemForm.value.fcn_li_gross_wt,
            STONEWT: data.STONEWT,
            NETWT: this.lineItemForm.value.fcn_li_net_wt,
            PURITY: data.PURITY,
            PUREWT: data.PUREWT,
            CHARGABLEWT: data.NET_WT,
            MKG_RATEFC: this.lineItemForm.value.fcn_li_rate || 0,
            MKG_RATECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
            ),
            MKGVALUEFC: this.lineItemForm.value.fcn_li_total_amount,
            MKGVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
            ),
            METAL_RATE: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_rate
            ),
            METAL_RATE_GMSFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_rate
            ),
            METAL_RATE_GMSCC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate)
            ),
            METALVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_metal_amount
            ),
            METALVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
            ),
            STONE_RATEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_stone_rate
            ),
            STONE_RATECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate)
            ),
            STONEVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_ad_stone_amount
            ),
            STONEVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount)
            ),
            DISCOUNT: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_discount_percentage
            ),
            DISCOUNTVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_discount_amount
            ),
            DISCOUNTVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount)
            ),
            NETVALUEFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_gross_amount
            ),
            NETVALUECC: this.comFunc.FCToCC(
                this.comFunc.compCurrency,
                this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
            ),
            LOCTYPE_CODE: this.lineItemForm.value.fcn_li_location, // need
            SUPPLIER: data.SUPPLIER || '',
            STOCK_DOCDESC: this.lineItemForm.value.fcn_li_item_desc,
            LOCKED: false,
            StkTranMkgCost: data.STKTRANMKGCOST,
            MainStockCode: data.MAIN_STOCK_CODE, //need field
            MkgMtlNetRate: this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                parseFloat(this.lineItemForm.value.fcn_li_total_amount) +
                parseFloat(this.lineItemForm.value.fcn_ad_metal_amount)
            ),
            //DTSALESPERSON_CODE: this.vocDataForm.value.sales_person || '', //need
            StkTrn_LandingCost: data.STOCK_COST, //need
            HSNCODE: data.HSN_CODE,
            VATCODE: data.GST_CODE,
            VAT_PER: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_tax_percentage
            ),
            VAT_AMOUNTFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_tax_amount
            ),
            VAT_AMOUNTLC: this.comFunc.emptyToZero(
                this.comFunc.FCToCC(
                    this.comFunc.compCurrency,
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount)
                )
            ),
            TOTALWITHVATFC: this.comFunc.emptyToZero(
                this.lineItemForm.value.fcn_li_net_amount
            ),
            TOTALWITHVATLC:
                this.comFunc.emptyToZero(
                    this.comFunc.FCToCC(
                        this.comFunc.compCurrency,
                        this.comFunc.emptyToZero(
                            this.lineItemForm.value.fcn_li_net_amount
                        )
                    )
                ) || 0,
        };
        const preitemIndex = this.salesReturnsItems_forVoc.findIndex((data: any) => data.SRNO.toString() == this.salesReturnRowDataSRNO.toString());
        if (preitemIndex != -1) {
          
            this.salesReturnsItems_forVoc[preitemIndex] = { ...this.salesReturnsItems_forVoc[preitemIndex], ...temp_pos_item_data };
           
        } else {
            
        }
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