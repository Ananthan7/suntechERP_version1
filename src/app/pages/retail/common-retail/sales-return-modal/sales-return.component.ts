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
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})
export class SalesReturnModal implements OnInit {
  @Input() modalTitle: string = 'Default Title';
  @Input() filteredSalesReturnBranchOptions!: Observable<string[]>;
  @Input() modal!: NgbModalRef;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() salesReturnsItemsChange = new EventEmitter<any[]>();
  @Output() salesReturnItemsChange = new EventEmitter<any>();

  @Input() orderedItems!: any[];
  @Input() editItemDetail: any;
  @Input() viewOnlyDetail: any;
  @Input() updatedGridItem: any;

  salesReturnsItems_forVoc: any = [];
  exchange_items: any[] = [];
  sales_returns_items: any = [];
  sales_returns_pre_items: any = [];
  currentsalesReturnItems: any = [];
  sales_returns_items_slno_length: any = 0;
  sales_returns_total_amt: any = 0.0;
  sales_returns_items_total_amount: any;
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

  customerDetails: any = {};

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
  viewOnly: boolean = false;
  zeroAmtVal!: any;
  zeroMQtyVal!: any;
  blockNegativeStock: any;
  blockNegativeStockValue: any;
  blockMinimumPrice: any;
  blockMinimumPriceValue: any;


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
  karatRateDetails: any = [];
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
  filteredOptions_year!: Observable<string[]>;
  vocTypesinSalesReturn: any = [];
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


  editOnly: boolean = false;
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

  // dummyDate = '01-01-1753T00:00:00';
  // zeroAmtVal;
  // zeroMQtyVal;


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
  options_year: string[] = [''];
  filteredadvanceYear!: Observable<string[]>;

  salesReturnForm: FormGroup = this.formBuilder.group({
    fcn_returns_fin_year: ['', Validators.required],
    fcn_returns_branch: ['', Validators.required],
    fcn_returns_voc_type: ['', Validators.required],
    fcn_returns_voc_no: ['', Validators.required],
    fcn_returns_voc_date: ['',],
    fcn_returns_sales_man: ['',],
    fcn_returns_cust_code: ['',],
    fcn_returns_cust_mobile: ['',],
  });

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public comFunc: CommonServiceService,
    private suntechApi: SuntechAPIService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private inDb: IndexedDbService,
    public lineItemService: ItemDetailService,
  ) {
  }

  ngOnInit(): void {
    this.ordered_items = this.orderedItems;
    this.setInitialValues()
  }
  setInitialValues() {
    console.log(this.updatedGridItem, 'updatedGridItem');
    this.strBranchcode = localStorage.getItem('userbranch');
    this.strUser = localStorage.getItem('username');
    this.baseYear = localStorage.getItem('year');
    let branchParams: any = localStorage.getItem('BRANCH_PARAMETER')
    this.getYearList();
    this.getSalesReturnVocTypes();
    if (this.comFunc.nullToString(this.updatedGridItem[0]?.FLAG) == 'EDIT') {
      this.sales_returns_items.push(this.updatedGridItem[0])
      this.editTableSalesReturn()
      return
    }
    this.updatedGridItem = {}
    this.salesReturnForm.controls.fcn_returns_branch.setValue(this.comFunc.branchCode)
  }
  editTableSalesReturn(event?: any) {
    let data = this.updatedGridItem[0]
    this.salesReturnEditId = data.ID;
    // event.cancel = true;
    const value: any = this.currentsalesReturnItems.filter(
      (data: any) => data.SRNO == data.sn_no
    )[0];

    // event.component.refresh();

    // const data = this.retailSReturnDataPost.SALESREFERENCE.split('-');

    this.salesReturnForm.controls.fcn_returns_fin_year.setValue(
      // data[3]
      data.slsReturn.POS_YEARMONTH
    );
    this.salesReturnForm.controls.fcn_returns_branch.setValue(
      data.slsReturn.POS_BRANCH_CODE
      // data[0]
    );
    this.salesReturnForm.controls.fcn_returns_voc_type.setValue(
      data.slsReturn.POS_VOCTYPE
      // data[1]
    );
    this.salesReturnForm.controls.fcn_returns_voc_no.setValue(data.slsReturn.POS_VOCNO);
    this.searchVocNoSalRet();
  }

  private _filteryear(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    return this.options_year.filter((option) =>
      option.toString().toLowerCase().includes(filterValue)
    );
  }
  getYearList() {
    let API = `FinancialYear?branchcode=${this.strBranchcode}&strusername=${this.strUser}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        var data = resp.response.map((t: any) => t.fyearcode);
        this.options_year = data;
        this.filteredOptions_year = this.salesReturnForm.controls.fcn_returns_fin_year.valueChanges.pipe(
          startWith(''),
          map((value) => this._filteryear(value))
        );
        let currentYear = this.comFunc.currentDate.getFullYear()
        this.salesReturnForm.controls.fcn_returns_fin_year.setValue(currentYear)
      });
  }

  changeBranch(e: any) {
  }

  getSalesReturnVocTypes() {
    const API = `UspGetSubVouchers`;
    const postData = {
      "strBranchCode": this.strBranchcode,
      "strMainVocType": "POS"
    };
    // let voc = this.comFunc.getqueryParamVocType()
    this.suntechApi.postDynamicAPI(API, postData)
      .subscribe((res: any) => {
        if (res.status == "Success") {
          this.vocTypesinSalesReturn = res.dynamicData[0];
          if (this.comFunc.nullToString(this.updatedGridItem[0]?.FLAG) == 'EDIT') {
            this.salesReturnForm.controls.fcn_returns_voc_type.setValue(
              this.updatedGridItem[0]?.slsReturn.POS_VOCTYPE
            );
          } else {
            this.salesReturnForm.controls.fcn_returns_voc_type.setValue(this.vocTypesinSalesReturn[0].VOCTYPE)
          }
        }
      });
  }


  getRetailSReturn_EvnFn(event: any) {
    Object.values(this.salesReturnForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if (!this.salesReturnForm.invalid) {

      this.sales_returns_total_amt = 0;
      this.salesReturnEditCode = '';
      this.salesReturnEditAmt = '';
      let _response;

      let fin_year = this.salesReturnForm.value.fcn_returns_fin_year;
      let branch = this.salesReturnForm.value.fcn_returns_branch;
      let voc_type = this.salesReturnForm.value.fcn_returns_voc_type;
      let voc_no = this.salesReturnForm.value.fcn_returns_voc_no;

      if (event.target.value != '') {
        let API = 'RetailSReturnLookUp?strBranchCode=' + branch + '&strVoctype=' + voc_type +
          '&intVocNo=' + voc_no + '&stryearmonth=' + fin_year
        this.suntechApi.getDynamicAPI(API)
          .subscribe((resp: any) => {
            if (resp.status == 'Failed') {
              // alert('Invalid Data');
              this.snackBar.open('Invalid Data', 'OK');
              this.salesReturnsItems_forVoc = [];


              this.salesReturnForm.controls['fcn_returns_sales_man'].setValue('');
              this.salesReturnForm.controls['fcn_returns_cust_code'].setValue('');
              this.salesReturnForm.controls['fcn_returns_cust_mobile'].setValue(
                ''
              );
            } else {
              _response = resp.response[0];
              this.salesReturnsItems_forVoc = resp.response;
              let _vocdate = _response.VOCDATE.split(' ');
              console.log(this.salesReturnsItems_forVoc, 'this.salesReturnsItems_forVoc');
              console.log(this.sales_returns_items, 'sales_returns_items');

              for (let i = 0; i < this.salesReturnsItems_forVoc.length; i++) {
                for (let j = 0; j < this.sales_returns_items.length; j++) {
                  if (this.salesReturnsItems_forVoc[i].SRNO.toString() == this.sales_returns_items[j].sn_no.toString()) {
                    this.salesReturnsItems_forVoc[i]['NETVALUEFC'] =
                      // this.salesReturnsItems_forVoc[i]['TOTAL_AMOUNTFC'] =
                      // this.salesReturnsItems_forVoc[i]['TOTALWITHVATFC'] =
                      this.sales_returns_items[j]['net_amount']
                    // this.sales_returns_items[j]['total_amount']
                  }
                  this.salesReturnsItems_forVoc[i].ISSELECTED = false
                  if (this.sales_returns_items[j].ISSELECTED) {
                    this.salesReturnsItems_forVoc[i].ISSELECTED = this.sales_returns_items[j].ISSELECTED
                  }
                }
              }
              console.log(this.salesReturnsItems_forVoc, 'this.salesReturnsItems_forVoc');

              this.salesReturnForm.controls['fcn_returns_sales_man'].setValue(
                _response.SALESPERSON_CODE
              );
              this.salesReturnForm.controls['fcn_returns_cust_code'].setValue(
                _response.POSCUSTCODE
              );
              this.salesReturnForm.controls['fcn_returns_cust_mobile'].setValue(
                _response.MOBILE
              );
              this.salesReturnForm.controls['fcn_returns_voc_date'].setValue(
                _vocdate[0]
              );
              this.sales_returns_total_amt = this.sales_returns_items.reduce(
                (preVal: any, curVal: any) =>
                  parseFloat(preVal) + parseFloat(curVal.net_amount),
                // parseFloat(preVal) + parseFloat(curVal.total_amount),
                0
              );
              this.sales_returns_pre_items = this.sales_returns_items;

            }
          });
      } else {
        // alert('Invalid Data');
        this.snackBar.open('Invalid Data', 'OK');
      }
    } else {
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000 // time in milliseconds
      });
    }
  }

  changeRetailSalesReturnVal(value: any) {

  }

  searchVocNoSalRet() {
    this.getRetailSReturn_EvnFn({
      target: {
        value: this.salesReturnForm.value.fcn_returns_voc_no,
      },
    });

  }
  /**USE: pass data to parent table when checked */
  checkSelectedVal(stockCode: any, amtval: any, srNo: any) {
    let item = this.sales_returns_items.find(
      (data: any) => data.sn_no.toString() == srNo.toString()
      // data.stock_code == stockCode && data.total_amount == amtval
    );
    return item;
  }


  addSalesReturnOnSelect(event: any, slsReturn: any, index: any) {
    let checked = event.target.checked;

    let itemsLengths = slsReturn.SRNO;

    if (checked) {
      var values: any = {
        // ID: itemsLength,
        // sn_no: itemsLength,
        ID: itemsLengths,
        sn_no: itemsLengths,
        stock_code: '',
        mkg_amount: '',
        total_amount: slsReturn.NETVALUEFC,

        pcs: '',
        weight: '',
        description: '',
        tax_amount: '',
        net_amount: '',
        slsReturn: {},
        // new values
        making_amt: slsReturn.MKGVALUEFC,
        metal_amt: slsReturn.METALVALUEFC,
        pure_wt: slsReturn.PUREWT,
        stone_amt: slsReturn.STONEVALUEFC,
      };

      this.sales_returns_total_amt =
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals, (
          parseFloat(this.sales_returns_total_amt) +
          parseFloat(slsReturn.NETVALUEFC)

        ));

      values.stock_code = slsReturn.STOCK_CODE;
      values.mkg_amount = slsReturn.MKG_RATEFC;
      //values.total_amount = slsReturn.TOTAL_AMOUNTFC;
      values.total_amount = slsReturn.TOTAL_AMOUNTFC;

      values.pcs = slsReturn.PCS;
      values.weight = slsReturn.GROSSWT;
      values.description = slsReturn.STOCK_DOCDESC;
      values.tax_amount = '0';
      values.net_amount = slsReturn.NETVALUEFC;
      values.slsReturn = slsReturn;
      // new values();
      values.PUDIFF = slsReturn.PUDIFF;
      values.STONEDIFF = slsReturn.STONEDIFF;
      values.DISCOUNTVALUEFC = slsReturn.DISCOUNTVALUEFC;
      values.DISCOUNT = slsReturn.DISCOUNT;
      values.VAT_AMOUNTFC = slsReturn.VAT_AMOUNTFC;
      values.UNIQUEID = slsReturn.UNIQUEID;
      let checkstokcode: any[] = this.sales_returns_pre_items.filter((item: any) => item.stock_code == slsReturn.STOCK_CODE)
      console.log(values, 'values');
      if (checkstokcode.length == 0) {
        this.sales_returns_pre_items.push(values);
      }
    } else {

      for (var i = 0; i < this.sales_returns_pre_items.length; i++) {
        var obj = this.sales_returns_pre_items[i];
        // if (obj.ID == itemsLength) {

        if (
          obj.sn_no.toString() == slsReturn.SRNO.toString(),
          obj.stock_code == slsReturn.STOCK_CODE
          //  &&
          // obj.total_amount == slsReturn.TOTAL_AMOUNTFC
        ) {
          this.sales_returns_total_amt =
            parseFloat(this.sales_returns_total_amt) -
            parseFloat(this.sales_returns_pre_items[i].net_amount);
          // parseFloat(this.sales_returns_pre_items[i].total_amount);
          this.sales_returns_pre_items.splice(i, 1);
          this.currentsalesReturnItems.splice(i, 1);
        }
      }
    }
  }
  /**USE: Add row item to parent grid on save click */
  addItemtoSalesReturn() {
    if (this.sales_returns_items.length == 0) {
      this.comFunc.showSnackBarMsg('PLEASE SELECT ITEM')
      return
    }
    const values = this.sales_returns_pre_items;
    // if(this.updatedGridItem.length>0){
    //   this.sales_returns_items = values.filter((item:any)=> item.stock_code != this.updatedGridItem[0].stock_code);
    // }else{
    this.sales_returns_items = values
    // }

    for (let i = 0; i < this.sales_returns_items.length; i++) {
      this.setSalesReturnItems(
        this.sales_returns_items[i].ID,
        this.sales_returns_items[i].slsReturn
      );
    }
    this.sumTotalValues();
    console.log(this.sales_returns_items, 'data to parent');

    this.salesReturnsItemsChange.emit(this.sales_returns_items);
    this.modal.dismiss('Cross click');
  }

  setSalesReturnItems(slno: any, items: any) {
    let temp_sales_return_items: any = {
      rid: this.comFunc.generateNumber(),
      UNIQUEID: items.UNIQUEID,
      SRNO: slno,
      DIVISION_CODE: items.DIVISION_CODE,
      STOCK_CODE: items.STOCK_CODE || '',
      PCS: items.PCS,
      GROSSWT: items.GROSSWT,
      STONEWT: items.STONEWT, //need_field

      NETWT: items.NETWT,
      PURITY: items.PURITY,
      PUREWT: items.PUREWT,
      CHARGABLEWT: items.CHARGABLEWT,
      MKG_RATEFC: items.MKG_RATEFC,
      MKG_RATECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.MKG_RATECC)
      ),
      MKGVALUEFC: items.MKGVALUEFC,
      MKGVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.MKGVALUECC)
      ),
      RATE_TYPE: items.RATE_TYPE || '',
      METAL_RATE: items.METAL_RATE,
      METAL_RATE_GMSFC: items.METAL_RATE_GMSFC,
      METAL_RATE_GMSCC: items.METAL_RATE_GMSCC,
      METALVALUEFC: items.METALVALUEFC,
      METALVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.METALVALUECC)
      ),
      STONE_RATEFC: items.STONE_RATEFC,
      STONE_RATECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.STONE_RATECC)
      ),
      STONEVALUEFC: items.STONEVALUEFC,
      STONEVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.STONEVALUECC)
      ),
      DISCOUNT: items.DISCOUNT, //need_field
      DISCOUNTVALUEFC: items.DISCOUNTVALUEFC,
      DISCOUNTVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.DISCOUNTVALUECC)
      ),
      NETVALUEFC: items.NETVALUEFC,
      NETVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(items.NETVALUECC)
      ),

      PUDIFF: this.comFunc.emptyToZero(items.PUDIFF), //need_input
      STONEDIFF: this.comFunc.emptyToZero(items.STONEDIFF),
      PONO: items?.PONO || 0,
      LOCTYPE_CODE: items.LOCTYPE_CODE || '',
      SUPPLIER: items?.SUPPLIER || '',
      STOCK_DOCDESC: items.STOCK_DOCDESC || '',
      // PONO: this.salesReturnForm.value.fcn_returns_voc_no,
      // PONO: '0',
      LOCKED: false,
      // LOCKED: this.comFunc.stringToBoolean(items?.LOCKED) || false,
      MCLENGTH: items?.MCLENGTH || 0,
      MCUNIT: items?.MCUNIT || 0,
      POSSALESSR: items?.POSSALESSR || '',
      PHYSICALSTOCK: items?.PHYSICALSTOCK || '',
      METALAMT: items?.METALAMT || '',
      MAKINGAMT: items?.MAKINGAMT || '',
      STDIFFAC: items?.STDIFFAC || '', //need_input
      STAMTAC: items?.STAMTAC || '',
      STKTRANMKGCOST: items?.STKTRANMKGCOST || 0,
      MAINSTOCKCODE: items?.MAINSTOCKCODE || '',
      MKGMTLNETRATE: items?.MKGMTLNETRATE || 0,
      RSO_FIXED: this.comFunc.stringToBoolean(items?.RSO_FIXED) || false,
      RSORDERGROSSWT: items?.RSORDERGROSSWT || 0,
      RUBY_WT: items?.RUBY_WT || 0,
      RUBY_RATE: items?.RUBY_RATE || 0,
      RUBY_AMOUNTFC: items?.RUBY_AMOUNTFC || 0,
      RUBY_AMOUNTCC: items?.RUBY_AMOUNTCC || 0,
      EMERALD_WT: items?.EMERALD_WT || 0,
      EMERALD_RATE: items?.EMERALD_RATE || 0,
      EMERALD_AMOUNTFC: items?.EMERALD_AMOUNTFC || 0,
      EMERALD_AMOUNTCC: items?.EMERALD_AMOUNTCC || 0,
      SAPPHIRE_WT: items?.SAPPHIRE_WT || 0,
      SAPPHIRE_RATE: items?.SAPPHIRE_RATE || 0,
      SAPPHIRE_AMOUNTFC: items?.SAPPHIRE_AMOUNTFC || 0,
      SAPPHIRE_AMOUNTCC: items?.SAPPHIRE_AMOUNTCC || 0,
      ZIRCON_WT: items?.ZIRCON_WT || 0,
      ZIRCON_RATE: items?.ZIRCON_RATE || 0,
      ZIRCON_AMOUNTFC: items?.ZIRCON_AMOUNTFC || 0,
      ZIRCON_AMOUNTCC: items?.ZIRCON_AMOUNTCC || 0,
      COLOR_STONE_WT: items?.COLOR_STONE_WT || 0,
      COLOR_STONE_RATE: items?.COLOR_STONE_RATE || 0,
      COLOR_STONE_AMOUNTFC: items?.COLOR_STONE_AMOUNTFC || 0,
      COLOR_STONE_AMOUNTCC: items?.COLOR_STONE_AMOUNTCC || 0,
      SJEW_TAGLINES: items?.SJEW_TAGLINES || '',
      MTL_SIZE: items?.MTL_SIZE || '',
      MTL_COLOR: items?.MTL_COLOR || '',
      MTL_DESIGN: items?.MTL_DESIGN || '',
      SALESPERSON_CODE: items?.SALESPERSON_CODE || '', //need to checck
      VAT_ACCODE: items?.VAT_ACCODE || '',
      VAT_PER: items?.VAT_PER || 0,
      TOTALWITHVATFC: items?.TOTAL_AMOUNTFC || 0,
      TOTALWITHVATLC: items?.TOTAL_AMOUNTLC || 0,
      VAT_AMOUNTLC: items?.VAT_AMOUNTLC || 0,
      VAT_AMOUNTFC: items?.VAT_AMOUNTFC || 0,
      LOYALTY_ITEM: false,
      // LOYALTY_ITEM: this.comFunc.stringToBoolean(items?.LOYALTY_ITEM) || false,
      WASTE_PER: items?.WASTE_PER || 0,
      STKTRN_LANDINGCOST: items?.STKTRN_LANDINGCOST || 0,
      STKTRN_WASTAGERATE: items?.STKTRN_WASTAGERATE || 0,
      DT_BRANCH_CODE: this.salesReturnForm.value.fcn_returns_branch,
      DT_VOCNO: this.salesReturnForm.value.fcn_returns_voc_no,
      DT_VOCTYPE: this.salesReturnForm.value.fcn_returns_voc_type,
      DT_YEARMONTH: this.salesReturnForm.value.fcn_returns_fin_year.toString(),
      // GIFT_ITEM: this.comFunc.stringToBoolean(items?.GIFT_ITEM) || false,
      // HSNCODE: items?.HSNCODE || '',
      // VATCODE: items?.VATCODE || '',
      // STOCKCHECKOTHERBRANCH:
      //   this.comFunc.stringToBoolean(items?.STOCKCHECKOTHERBRANCH) || false,
      // GSTMETALPER: items?.GSTMETALPER || 0,
      // GSTMAKINGPER: items?.GSTMAKINGPER || 0,
      // GSTOTHERPER: items?.GSTOTHERPER || 0,
      // GSTMETALAMT_CC: items?.GSTMETALAMT_CC || 0,
      // GSTMAKINGAMT_CC: items?.GSTMAKINGAMT_CC || 0,
      // GSTOTHERAMT_CC: items?.GSTOTHERAMT_CC || 0,
      // GSTMETALAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, items?.GSTMETALAMT_FC) || 0,
      // GSTMAKINGAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, items?.GSTMAKINGAMT_FC) || 0,
      // GSTOTHERAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, items?.GSTOTHERAMT_FC) || 0,
      // TOTALWITHGST_CC: this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, items?.TOTALWITHGST_CC) || 0,
      // TOTALWITHGST_FC: this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, items?.TOTALWITHGST_FC) || 0,
      GSTMAKINGAMT_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          items?.GSTMAKINGAMT_FC
        ) || 0,
      GSTOTHERAMT_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          items?.GSTOTHERAMT_FC
        ) || 0,
      TOTALWITHGST_CC:
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          items?.TOTALWITHGST_CC
        ) || 0,
      TOTALWITHGST_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          items?.TOTALWITHGST_FC
        ) || 0,
      EXTRA_STOCK_CODE: '',
      // EXTRA_STOCK_CODE: items?.EXTRA_STOCK_CODE || '',
      FLAGESTK: items?.FLAGESTK || 0,
      OT_TRANSFER_TIME: items?.OT_TRANSFER_TIME || '',
      // IssueGiftVoucher:
      //   this.comFunc.stringToBoolean(items?.ISSUEGIFTVOUCHER) || false,
      "COMPONENT_PRICE_TYPE": "",
      "CGST_PER": this.comFunc.emptyToZero(items['CGST_PER']),
      "CGST_AMOUNTFC": this.comFunc.emptyToZero(items['CGST_AMOUNTFC']),
      "CGST_AMOUNTCC": this.comFunc.emptyToZero(items['CGST_AMOUNTCC']),
      "SGST_PER": this.comFunc.emptyToZero(items['SGST_PER']),
      "SGST_AMOUNTFC": this.comFunc.emptyToZero(items['SGST_AMOUNTFC']),
      "SGST_AMOUNTCC": this.comFunc.emptyToZero(items['SGST_AMOUNTCC']),
      "IGST_PER": this.comFunc.emptyToZero(items['IGST_PER']),
      "IGST_AMOUNTFC": this.comFunc.emptyToZero(items['IGST_AMOUNTFC']),
      "IGST_AMOUNTCC": this.comFunc.emptyToZero(items['IGST_AMOUNTCC']),
      "CGST_ACCODE": items['CGST_ACCODE'] || '',
      // "CGST_ACCODE": this.comFunc.emptyToZero(items['CGST_ACCODE']),
      // "SGST_ACCODE": this.comFunc.emptyToZero(items['SGST_ACCODE']),
      "SGST_ACCODE": items['SGST_ACCODE'] || '',
      "IGST_ACCODE": items['IGST_ACCODE'] || '',
      "TOTAL_AMOUNTFC": items['TOTAL_AMOUNTFC'] || 0,
      "TOTAL_AMOUNTCC": items['TOTAL_AMOUNTLC'] || 0,
      "CGST_CTRLACCODE": items['CGST_CTRLACCODE'] || '',
      "SGST_CTRLACCODE": items['SGST_CTRLACCODE'] || '',
      "IGST_CTRLACCODE": items['IGST_CTRLACCODE'] || '',
      "GST_GROUP": items['GST_GROUP'] || '',
      "GST_CODE": items['GST_CODE'] || '',
      "HSN_CODE": items['HSN_CODE'] || '',
      "SERVICE_ACCODE": items['SERVICE_ACCODE'] || '',
      "WASTAGEPER": this.comFunc.emptyToZero(items['WASTAGEPER']),
      "WASTAGEQTY": this.comFunc.emptyToZero(items['WASTAGEQTY']),
      "WASTAGEPUREWT": this.comFunc.emptyToZero(items['WASTAGEPUREWT']),
      "WASTAGEAMOUNTFC": this.comFunc.emptyToZero(items['WASTAGEAMOUNTFC']),
      "WASTAGEAMOUNTCC": this.comFunc.emptyToZero(items['WASTAGEAMOUNTCC']),
      "DIVISIONMS": items['DIVISIONMS'] || ' ',
      "DUFIX_CERTCHARGECC": 0,
      "DUFIX_CERTCHARGEFC": 0,
      "DUFIX_CLRSTNRATECC": 0,
      "DUFIX_CLRSTNRATEFC": 0,
      "DUFIX_CLRSTNVALUECC": 0,
      "DUFIX_CLRSTNVALUEFC": 0,
      "DUFIX_DCHARGABLEWEIGHT": 0,
      "DUFIX_DIACARAT": 0,
      "DUFIX_DIACTRATECC": 0,
      "DUFIX_DIACTRATEFC": 0,
      "DUFIX_DIAPCS": 0,
      "DUFIX_DIAVALUECC": 0,
      "DUFIX_DIAVALUEFC": 0,
      "DUFIX_DKARAT_CODE": "",
      "DUFIX_DLABRATECC": 0,
      "DUFIX_DLABRATEFC": 0,
      "DUFIX_DLABUNIT": 0,
      "DUFIX_DWASTAGE": 0,
      "DUFIX_DWASTAGEAMOUNTCC": 0,
      "DUFIX_DWASTAGEAMOUNTFC": 0,
      "DUFIX_DWASTAGEPER": 0,
      "DUFIX_FINEGOLD": 0,
      "DUFIX_HMCHARGECC": 0,
      "DUFIX_HMCHARGEFC": 0,
      "DUFIX_LABOURCC": 0,
      "DUFIX_LABOURFC": 0,
      "DUFIX_MASTERFINEGOLD": 0,
      "DUFIX_METAL_WT": 0,
      "DUFIX_METALGROSSWT": 0,
      "DUFIX_METALVALUECC": 0,
      "DUFIX_METALVALUEFC": 0,
      "DUFIX_METLA_WT": 0,
      "DUFIX_PEARL_AMTCC": 0,
      "DUFIX_PEARL_AMTFC": 0,
      "DUFIX_PEARL_PCS": 0,
      "DUFIX_PEARL_WT": 0,
      "DUFIX_PUDIFF": 0,
      "DUFIX_PURITY": 0,
      "DUFIX_STONECARAT": 0,
      "DUFIX_STONEPCS": 0,
      "GIFT_ITEM": true,

      "GSTMAKINGAMT_CC": 0,
      "INCLUSIVE": true,
      "GSTMAKINGPER": 0,
      "GSTMETALAMT_CC": 0,
      "GSTMETALAMT_FC": 0,
      "GSTMETALPER": 0,
      "GSTOTHERAMT_CC": 0,
      "LESSTHANCOST_USER": "",
      "NEWUNIQUEID": 0,
      "STOCKCHECKOTHERBRANCH": true,
      "VATCODE": "",
      "GSTOTHERPER": 0,
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
      // LOYALTY_POINTS: '0.00',
      // SALES_TAGLINES: '',
      // COUNTRY_CODE: '',
      "OLDRATE": this.comFunc.emptyToZero(items['OLDRATE']),
      "OLDAMOUNT": this.comFunc.emptyToZero(items['OLDAMOUNT']),
      "DISC_USER_NAME": items['DISC_USER_NAME'] || '',
      "DISC_AMOUNT": this.comFunc.emptyToZero(items['DISC_AMOUNT']),
      "DISC_PERCENTAGE": this.comFunc.emptyToZero(items['DISC_PERCENTAGE']),
      "KUNDAN_UNIT": this.comFunc.emptyToZero(items['KUNDAN_UNIT']),
      "KUNDAN_PCS": this.comFunc.emptyToZero(items['KUNDAN_PCS']),
      "KUNDAN_CARAT": this.comFunc.emptyToZero(items['KUNDAN_CARAT']),
      "KUNDAN_WEIGHT": this.comFunc.emptyToZero(items['KUNDAN_WEIGHT']),
      "KUNDAN_RATEFC": this.comFunc.emptyToZero(items['KUNDAN_RATEFC']),
      "KUNDAN_RATECC": this.comFunc.emptyToZero(items['KUNDAN_RATECC']),
      "KUNDANVALUEFC": this.comFunc.emptyToZero(items['KUNDANVALUEFC']),
      "KUNDANVALUECC": this.comFunc.emptyToZero(items['KUNDANVALUECC']),
      "CESS_PER": this.comFunc.emptyToZero(items['CESS_PER']),
      "CESS_AMOUNTFC": this.comFunc.emptyToZero(items['CESS_AMOUNTFC']),
      "CESS_AMOUNTCC": this.comFunc.emptyToZero(items['CESS_AMOUNTCC']),
      "ROS_FIXED": this.comFunc.emptyToZero(items['ROS_FIXED']),
      "BATCHID": this.comFunc.emptyToZero(items['BATCHID']),
      "STAMP_RATE": this.comFunc.emptyToZero(items['STAMP_RATE']),
      "STAMP_AMOUNT": this.comFunc.emptyToZero(items['STAMP_AMOUNT']),
      "STAMP_AMOUNTCC": this.comFunc.emptyToZero(items['STAMP_AMOUNTCC']),
      "LOYALTY_POINTS": this.comFunc.emptyToZero(items['LOYALTY_POINTS']),
      "SALES_TAGLINES": items['SALES_TAGLINES'] || '',
      "COUNTRY_CODE": items['COUNTRY_CODE'] || '',
      "DTSALESPERSON_CODE": items['DTSALESPERSON_CODE'] || ''
    };

    // temp_sales_return_items.SRNO = slno;

    // need to update
    if (
      this.salesReturnEditId == '' ||
      this.salesReturnEditId == undefined ||
      this.salesReturnEditId == null
    ) {
      // console.log('=================indexOf===================');
      // console.log(
      //   // this.currentsalesReturnItems.filter(data=> data.SRNO == temp_sales_return_items.SRNO),
      //   // this.currentsalesReturnItems.findIndex((data: any) => data.SRNO == temp_sales_return_items.SRNO)
      // );
      // console.log('====================================');
      const preitemIndex = this.currentsalesReturnItems.findIndex(
        (data: any) => data.SRNO == temp_sales_return_items.SRNO
      );
      // alert(preitemIndex);
      if (preitemIndex != -1) {
        temp_sales_return_items.SRNO = this.salesReturnEditId;

        this.currentsalesReturnItems[preitemIndex] = temp_sales_return_items;
        this.salesReturnItemsChange.emit(this.currentsalesReturnItems);

      } else {
        this.currentsalesReturnItems.push(temp_sales_return_items);
        this.salesReturnItemsChange.emit(this.currentsalesReturnItems);

      }
    } else {
      // this.currentsalesReturnItems[this.salesReturnEditId - 1] =
      //   temp_sales_return_items;
      temp_sales_return_items.SRNO = this.salesReturnEditId;

      const preitemIndex = this.currentsalesReturnItems.findIndex(
        (data: any) => data.SRNO == temp_sales_return_items.SRNO
      );
      if (preitemIndex != -1) {
        temp_sales_return_items.SRNO = this.salesReturnEditId;

        this.currentsalesReturnItems[preitemIndex] = temp_sales_return_items;
      }
      this.salesReturnEditId = '';
    }

    console.log('================currentsalesReturnItems====================');
    // console.log(this.currentsalesReturnItems);
    console.log('====================================');
    // this.retailsReturnMain.RetailsReturnDetails = this.currentsalesReturnItems;
    console.log(this.retailsReturnMain);
    this.sumTotalValues();
    this.setSalesReturnDetailsPostData();
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

    //this.exchange_items.forEach(function (item) {

    //total_exchange = total_exchange + parseFloat(item.total_amount);
    //});

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
    // this.prnt_inv_net_total_with_tax = this.order_items_total_net_amount;

    // this.receiptTotalForm.controls['fcn_payment_total_bill'].setValue(
    //   this.order_items_total_net_amount
    // );
    // this.receiptTotalForm.controls['fcn_payments_cr_amount'].setValue(
    //   this.order_items_total_net_amount
    // );
    // this.receiptDetailsList.forEach(function (item) {
    //   total_received_amount =
    //     total_received_amount + parseFloat(item.AMOUNT_FC || 0);
    // });

    // this.receiptTotalNetAmt = total_received_amount.toFixed(2);
    // // this.receiptTotalNetAmt = this.order_items_total_net_amount.toFixed(2);

    // this.receiptTotalForm.controls['fcn_payment_total_paidamount'].setValue(
    //   this.receiptTotalNetAmt
    // );

    // this.prnt_received_amount = this.receiptTotalNetAmt;
    // this.prnt_received_amount_words = this.numToWord(this.prnt_received_amount);
    // console.log(this.prnt_received_amount_words);
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
    console.log(
      this.invReturnSalesTotalPcs,
      this.invReturnSalesTotalWeight,
      this.invReturnSalesTotalPureWeight,
      this.invReturnSalesTotalMakingAmt,
      this.invReturnSalesTotalMetalAmt,
      this.invReturnSalesTotalStoneAmt,
      this.invReturnSalesTotalNetAmt,
      this.invReturnSalesTotalPurityDiff,
      this.invReturnSalesTotalStoneDiff,
      this.invReturnSalesTotalDisAmt,
      this.invReturnSalesTotalDisPer,
      this.invReturnSalesTotalNetTotal
    );
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

  convertDateWithTimeZero(date: any) {
    return date.split('T')[0] + 'T00:00:00.000Z';
  }
  setSalesReturnDetailsPostData() {
    this.retailSReturnDataPost = {
      MID: this.retailSReturnDataMID,
      BRANCH_CODE: this.strBranchcode,
      VOCTYPE: 'PSR',

      VOCNO: this.retailSReturnVocNo,

      // VOCDATE: this.convertDateWithTimeZero(
      //  new Date(this.vocDataForm.value.vocdate).toISOString()
      //),
      YEARMONTH: this.baseYear,
      //PARTYNAME: this.customerDataForm.value.fcn_customer_name,
      TEL1: this.customerDetails?.TEL1 || '',
      TEL2: this.customerDetails?.TEL2 || '',
      // SALESPERSON_CODE: this.vocDataForm.value.sales_person, //need
      RATE_TYPE: '', //need_input
      METAL_RATE: 0, //need_input
      SALES_ORDER: 0, //need_input
      TOTAL_PCS: this.comFunc.emptyToZero(this.invReturnSalesTotalPcs),
      TOTAL_GRWT: this.comFunc.emptyToZero(this.invReturnSalesTotalWeight),
      TOTAL_PUWT: this.comFunc.emptyToZero(this.invReturnSalesTotalPureWeight),
      TOTAL_MKGVALUE_FC: this.comFunc.emptyToZero(
        this.invReturnSalesTotalMakingAmt
      ),
      TOTAL_MKGVALUE_CC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMakingAmt)
      ),
      TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMetalAmt)
      ),
      TOTAL_METALVALUE_CC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMetalAmt)
      ),
      TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.invReturnSalesTotalStoneAmt
      ),
      TOTAL_STONEVALUE_CC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalStoneAmt)
      ),
      TOTAL_PUDIFF: this.invReturnSalesTotalPurityDiff, //need
      TOTAL_STONEDIFF: this.invReturnSalesTotalStoneDiff, //need
      TOTAL_DISCVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.invReturnSalesTotalDisAmt
      ), //need
      TOTAL_DISCVALUE_CC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalDisAmt)
      ), //need
      // TOTAL_DISCVALUE_FC: this.prnt_inv_total_dis_amt, //need
      NETVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.invReturnSalesTotalNetAmt
      ),
      NETVALUE_CC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetAmt)
      ),
      REMARKS: `S/Return Ref : ${this.salesReturnForm.value.fcn_returns_voc_type} - ${this.salesReturnForm.value.fcn_returns_voc_no}`,
      // REMARKS: `S/Return Ref : ${this.salesReturnForm.value.fcn_returns_voc_type} - ${this.salesReturnForm.value.fcn_returns_voc_no} - ${this.currentsalesReturnItems[0].UNIQUEID}`,
      SYSTEM_DATE: new Date().toISOString(),
      // SYSTEM_DATE: '',
      RETURNMID: 0,
      RETURNVOCNO: 0,
      RETURNVOCTYPE: '',
      RETURN_VALUE_FC: 0,
      RETURN_VALUE_CC: 0,

      PURCHASEMID: 0, //need
      PURCHASEVOCNO: 0, //need
      PURCHASEVOCTYPE: '',
      PURCHASE_VALUE_FC: 0, //need
      PURCHASE_VALUE_CC: 0, //need
      ADJUST_ADVANCE: 0, //need

      DISCOUNT: 0,

      SUBTOTAL: this.invReturnSalesTotalNetAmt, //need_input
      ROUNDOFF: 0,
      NETTOTAL: this.invReturnSalesTotalNetTotal, //need_input
      RECEIPT_TOTAL: this.invReturnSalesTotalNetTotal, //need
      REFUND: 0,
      FLAG_EDIT_ALLOW: 'N',
      NAVSEQNO: 0, //need
      // MOBILE: this.customerDataForm.value.fcn_customer_mobile,
      POBOX: this.customerDetails?.POBOX_NO || '',
      //EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
      POSCUSTCODE: this.customerDetails?.CODE || '',
      ITEM_CURRENCY: this.comFunc.compCurrency,
      ITEM_CURR_RATE: 1,
      ADJUST_ADVANCECC: 0, //need_input

      DISCOUNTCC: 0, //need_input
      SUBTOTALCC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetAmt)
      ),
      NETTOTALCC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal)
      ),
      RECEIPT_TOTALCC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal)
      ), //need_input
      REFUNDCC: 0, //need_input
      FLAG_UPDATED: 'N',
      FLAG_INPROCESS: 'N',
      // NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality

      // || '',
      TYPE: this.customerDetails?.TYPE || '',

      D2DTRANSFER: 'F',
      SALESREFERENCE: `${this.salesReturnForm.value.fcn_returns_branch}-${this.salesReturnForm.value.fcn_returns_voc_type}-${this.salesReturnForm.value.fcn_returns_voc_no}-${this.salesReturnForm.value.fcn_returns_fin_year}`, // need_input update from api -
      // SalesReference: '', // need_input update from api -
      RSCUSTIDNO: this.customerDetails?.POSCUSTIDNO || '',
      TRANS_CODES: '',
      CONSIGNMENTPARTY: '',
      TOTALVAT_AMOUNTFC: this.invReturnSalesTotalTaxAmt,
      TOTALVAT_AMOUNTLC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalTaxAmt)
      ),

      RSSTATE: '',

      GSTVATAMOUNTFC: 0,
      GSTVATAMOUNTCC: 0,

      CCPOSTINGDONE: 0,

      LOCALREMARKSNEW: '',
      AUTOPOSTING: false,
      MACHINEID: '',
      //POSTDATE: this.vocDataForm.value.vocdate, 
      INVREF: 0,
      SCHEMESALESFIXINGPUREWT: 0,
      INCLUDEVAT: false,
      WAYBILLNO: '',
      WAYBILLDATE: this.dummyDate, //need
      HTUSERNAME: this.strUser || '', //need
      REMARKSNEW: '',
      REC_MODE: '',
      GENSEQNO: 0, //need
      GroupRef: '',
      INTIALPROMOTION: false,
      POSORDERADVVATAMTLC: 0,
      POSORDERADVVATAMTFC: 0,
      FROM_TOUCH: false,
      AGENT_COMMISSION: false,
      AGENTCOMMISSION_PER: 0,
      CALCULATE_LOYALTY: false,
      TRAYN: false,
      TRANO: '',
      POSReferenceRepairInvoice: '',
      RSLOGINMID: 0,
      VATAMOUNTFCROUND: 0,
      ONLINERATE: false,
      EmiratesSkywardsMile: false,
      PLANETQRURL: '',
      OT_TRANSFER_TIME: '',
      VoucherRedeemed: '',
      QRCODEIMAGE: '',
      QRCODEVALUE: '',
      BOARDINGPASS: '',
      WITHOUTVAT: false,
      FLIGHTNO: '',
      BOARDINGFROM: '',
      BOARDINGDATE: this.dummyDate, //need
      BOOKVOCNO: '',

      //   CITY:
      //    this.customerDetailForm.value.fcn_cust_detail_city ||

      //  '',
      STATE: this.customerDetails?.STATE || '',
      //  ADDRESS:
      //    this.customerDetailForm.value.fcn_cust_detail_address ||

      //   '',
      //  COUNTRY_CODE:
      //     this.customerDetailForm.value.fcn_cust_detail_country ||

      //   '',
      CUST_LANGUAGE: this.customerDetails?.CUST_LANGUAGE || '',


      'PRINT_COUNT': 0,
      'GST_TOTALFC': 0,
      'GST_TOTALCC': 0,
      'GST_STATE_CODE': '0',
      PANNO: this.customerDetails?.PANCARDNO || '0',
      'GST_NUMBER': '',
      'SERVICE_INVOICE': true,
      'POSREFERENCEREPAIRINVOICE': '',
      'PLANETRESPONEFLG': true,
      'PLANETRESPONSEFLG': true,
      'NEWMID': 0,
      'DISCOUNTUSERNAME': '',
      'EINVOICEFLG': true,
      'EINVOICEQRIMAGE': '',
      'EINVOICERESPONSE': '',
      'EMIRATESSKYWARDSMILE': true,
      'EXCLUDEGSTVAT': 0,
      'TRA_ID_TYPE': '0',
      'POSCUSTIDNO': '0',
      'POS_CREDITLIMIT_AUTHORIZED_USER': '0',
      'POS_CREDITLIMIT_AUTHORIZED_REMARK': '0',
      'TOTALCESS_AMOUNTFC': 0,
      'TOTALCESS_AMOUNTCC': 0,
      'FORM_60': false,
      'COMP_WISE_INVOICE': false,
      'REFBY_CUSTCODE': '0',
      'PRINT_COUNT_ACCOPY': 0,
      'PRINT_COUNT_CNTLCOPY': 0,



      retailSReturnDetails: this.currentsalesReturnItems,
    };
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

