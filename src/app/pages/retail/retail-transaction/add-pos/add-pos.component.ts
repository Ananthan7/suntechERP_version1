/** This component used for POS insert, view, edit update. */

import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { environment } from '../../../environments/environment';
// import { SuntechapiService } from '../../suntechapi.service';
import { from, noop, Observable } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
// import { NgxBarcodeScannerService } from '@eisberg-labs/ngx-barcode-scanner';
// import { round } from 'lodash';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
// import Quagga from '@ericblade/quagga2';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { IndexedApiService } from 'src/app/services/indexed-api.service';

const baseUrl = environment.baseUrl;
const baseImgUrl = environment.baseImageUrl;
interface VocTypesEx {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-pos',
  templateUrl: './add-pos.component.html',
  styleUrls: ['./add-pos.component.scss']
})
export class AddPosComponent implements OnInit {
  @Input() content!: any;

  @ViewChild('print_invoice', { static: true }) printInvoiceDiv!: ElementRef;


  @ViewChild('mymodal') public mymodal!: NgbModal;
  @ViewChild('adjust_sale_return_modal')
  public adjust_sale_return_modal_ref!: NgbModalRef;
  @ViewChild('adjust_sale_return_modal')
  public adjust_sale_return_modal!: NgbModal;
  @ViewChild('oldgoldmodal') public oldgoldmodal!: NgbModal;
  @ViewChild('sales_payment_modal') public sales_payment_modal!: NgbModal;
  @ViewChild('more_customer_detail_modal')
  public more_customer_detail_modal!: NgbModal;
  @ViewChild('userAuthModal')
  public userAuthModal!: NgbModal;

  @ViewChild('userAttachmentModal')
  public userAttachmentModal!: NgbModal;

  @ViewChild('pendingSalesOrderModal')
  public pendingSalesOrderModal!: NgbModal;
  @ViewChild('salesEstimationModal')
  public salesEstimationModal!: NgbModal;
  selectedModal: NgbModalRef | undefined;

  // @ViewChild('scanner', { static: false }) scanner: BarcodeScannerLivestreamOverlayComponent;
  // @ViewChild(BarcodeScannerLivestreamComponent) scanner: BarcodeScannerLivestreamComponent;

  posMode: string = 'ADD';

  // baseImgUrl = baseImgUrl;
  maskVocDate: any = new Date();
  amlNameValidation;
  amlNameValidationData = false;

  value: any;
  barcode!: string;
  isSaved: boolean = false;

  selectedTabIndex = 0;

  showBoarding: boolean = false;

  private onChangeCallback: (_: any) => void = noop;

  viewOnly: boolean = false;
  editOnly: boolean = false;
  public isCustProcessing = false;

  lineItemModalForSalesReturn: boolean = false;
  salesReturnRowData: any;
  salesReturnRowDataSRNO: any;

  queryParams: any;
  fcn_returns_voc_type_val: any;
  fcn_returns_cust_code_val: any;
  fcn_exchange_division_val: any
  fcn_exchange_item_desc_val: any
  fcn_returns_voc_date_val: any
  fcn_returns_sales_man_val: any
  fcn_returns_cust_mobile_val: any
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
  dateControl = new FormControl('', [Validators.required]);
  // zeroAmtVal;
  // zeroMQtyVal;

  zeroAmtVal: any;
  zeroMQtyVal: any;

  salespersonName: string = '';
  branchOptions: string[] = [''];
  filteredBranchOptions!: Observable<any[]>;
  filteredSalesReturnBranchOptions!: Observable<any[]>;
  filteredAdvanceBranchOptions!: Observable<any[]>;
  filteredGiftModeBranchOptions!: Observable<any[]>;

  blockNegativeStock: any;
  blockNegativeStockValue: any;
  blockMinimumPrice: any;
  blockMinimumPriceValue: any;
  validatePCS: any;

  receiptModesTypes: any;
  receiptModesList: any;
  metalPurchaseDataPost: any = null;
  retailSalesDataPost: any = null;
  retailSReturnDataPost: any = null;

  lineItemPcs: any;
  lineItemGrossWt: any;

  // Dialog box
  dialogBox: any;
  dialogBoxResult: any;

  public noImage: any = ' environment._noImage';
  selectedOption: any = '3';
  title: any = 'appBootstrap';
  divisionMS: any = 'M';

  rs_WithReturnExchangeReceipt: any = {
    _retailSales: {},
    _retailReceipt: [],
    _retailsReturn: {},
    _metalPurchase: {},
  };

  vocTypesinExchange: VocTypesEx[] = [
    // { value: 'POS', viewValue: 'POS' },
    { value: 'POS', viewValue: 'POS' },
    { value: 'PS1', viewValue: 'PS1' },
  ];

  modalReference: any;
  modalReferenceSalesReturn: any;
  modalReferenceUserAuth!: NgbModalRef;
  modalReferenceUserAttachment!: NgbModalRef;
  modalRefePendingSalesOrder!: NgbModalRef;
  modalRefePendingSalesEstimation!: NgbModalRef;

  closeResult: any;
  karatRateDetails: any = [];
  orders: any[] = [];
  receiptDetailsList: any = [];

  receiptTotalNetAmt: any;
  balanceAmount: any;
  vatRoundOffAmt: any;

  dataForm = new FormGroup({
    vocdate: new FormControl(new Date(new Date())),
    sales_person: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required),
    id_type: new FormControl('', Validators.required),
    receipt_mode: new FormControl('', Validators.required),
    receipt_mode_cc: new FormControl('', Validators.required),
    receiptModeOthers: new FormControl('', Validators.required),
  });

  options_year: string[] = [];
  filteredOptions_year!: Observable<any[]>;
  filteredadvanceYear!: Observable<any[]>;

  salesPersonFilteredOptions!: Observable<any[]>;
  salesPersonOptions: any[] = [];

  idTypeFilteredOptions!: Observable<any[]>;
  idTypeOptions: any[] = [''];
  idTypeOptionList: any;

  exStockCodeFilteredOptions!: Observable<any[]>;
  exStockCodeOptions: any[] = [''];

  receiptModeOptions_Cash!: Observable<any[]>;
  recMode_Cash_Data: any[] = [''];

  receiptModeOptions_CC!: Observable<any[]>;
  recMode_CC_Data: any[] = [''];

  accountLookupList: any;

  receiptModeOptionsOthers!: Observable<any[]>;
  recModeOthersData: any[] = [''];

  receiptModeAdvanceOthers!: Observable<any[]>;
  recModeAdvanceData: any[] = [''];

  receiptModeGiftOptions!: Observable<string[]>;
  recModeGiftData: string[] = [''];

  customAcCodeListOptions!: Observable<any[]>;

  currentDate = new Date(new Date());

  currentStockCode: any;

  stoneWtPreVal = 0;

  customerDetails: any = {};

  customerDataForm: FormGroup;
  customerDetailForm: FormGroup;
  vocDataForm: FormGroup;
  lineItemForm: FormGroup;
  // additionalDetailsForm: FormGroup;
  salesReturnForm: FormGroup;
  exchangeForm: FormGroup;

  cashreceiptForm: FormGroup;
  creditCardReceiptForm: FormGroup;
  advanceReceiptForm: FormGroup;
  othersReceiptForm: FormGroup;
  giftReceiptForm: FormGroup;
  customerReceiptForm: FormGroup;

  boardingPassForm: FormGroup;
  invoiceWiseForm: FormGroup;

  authForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  attachmentForm: FormGroup = this.formBuilder.group({
    remarks: ['', Validators.required],
    docType: ['', Validators.required],
    expDate: ['', Validators.required],
    attachmentFile: [''],
  });

  pendingSalesOrderForm: FormGroup = this.formBuilder.group({
    branchTo: ['', Validators.required],
    orderNo: ['', Validators.required],
    customerCode: ['', Validators.required],
  });

  docTypeData: MasterSearchModel =
    {
      "PAGENO": 1,
      "RECORDS": 10,
      "LOOKUPID": 3,
      "ORDER_TYPE": 0,
      "WHERECONDITION": "TYPES='DOCUMENT TYPE'",
      "SEARCH_FIELD": "CODE",
      "SEARCH_VALUE": ""
    }


  // {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 3,
  //   SEARCH_FIELD: 'CODE',
  //   SEARCH_HEADING: 'Document Type',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "CODE<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }

  advanceReceiptDetails: any;
  exchangeFormMetalRateType = '';

  inv_customer_name: any;
  inv_cust_mobile_no: any;
  inv_sales_man: any;
  inv_bill_date: any;
  inv_number: any;
  inv_cust_id_no: any;

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

  // Metal purchase (Exchange) total var..
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

  prnt_inv_net_total_without_tax_sum: any;
  prnt_inv_total_tax_amount_sum: any;
  prnt_inv_net_total_with_tax_sum: any;
  prnt_received_amount: any;
  prnt_received_amount_words: any;

  // Current Line Item Details
  li_division_val: any;
  li_item_code_val: any;
  li_item_desc_val: any;
  li_location_val: any;
  li_pcs_val: any;
  li_gross_wt_val: any;
  li_stone_wt_val: any;
  li_net_wt_val: any;
  li_making_rate_val: any;
  li_making_amount_val: any;
  li_stone_rate_val: any;
  li_stone_amount_val: any;
  li_metal_rate_val: any;
  li_metal_amount_val: any;
  li_rate_val: any;
  li_total_val: any;
  li_discount_percentage_val: any;
  li_discount_amount_val: any;
  li_gross_amount_val: any;
  li_tax_percentage_val: any;
  li_tax_amount_val: any;
  li_net_amount_val: any;
  li_tag_val: any;

  curr_line_item_images: any;
  fcn_payments_cr_currency_val = 'AED';
  fcn_payments_cr_amount_val = 0.0;

  fcn_payments_cc_currency_val = 'AED';
  fcn_payments_cc_amount_val!: number;

  fcn_payments_billamount_val = 0.0;
  fcn_payments_paidamount_val = 0.0;
  fcn_payments_balanceamount_val = 0.0;

  templateform = {
    testmn: 0.0,
  };

  currentLineItems: any = [];
  currentsalesReturnItems: any = [];
  currentExchangeMetalPurchase: any[] = [];
  currentExchangeMetalPurchaseGst: any[] = [];

  salesReturnsItems_forVoc: any = [];

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

  ordered_items: any[] = [];
  order_items_slno_length: any;
  order_items_total_amount: any;
  order_items_total_tax: any;
  order_items_total_net_amount: any;
  order_items_total_gross_amount: any;
  order_items_total_discount_amount: any;
  // order_total_sales_returns: any = 0.0;
  order_total_exchange: any;
  // order_received_amount: any;

  receipt_items_slno_length: any;

  sales_returns_items: any = [];
  sales_returns_pre_items: any = [];
  sales_returns_items_slno_length: any = 0;
  sales_returns_total_amt: any = 0.0;
  sales_returns_items_total_amount: any;

  exchange_items: any[] = [];
  exchange_items_slno_length: any;
  exchange_items_total_amount: any;

  branch_tax_percentage: any;

  public pos_main_data: any = {};

  public retailsReturnMain: any = {};

  public metalPurchaseMain: any = {};

  public page_language: any = 'ENGLISH';
  public date_lbl: any = 'Date';
  public vocno_lbl: any = 'Voc No';
  public sales_person_lbl: any = 'Sales Person';
  public customer_name_lbl: any = 'Name';
  public mobile_lbl: any = 'Mobile';
  public slno_lbl: any = 'SL No.';

  // Type 1 = Vat, 2 = GST, 3 = No Tax
  public taxType = 1;
  public newDictionary: any;

  strBranchcode: any = '';
  strUser: any = '';
  vocType: any = '';
  mainVocType: any = '';
  baseYear: any = localStorage.getItem('YEAR') || '';
  updateBtn!: boolean;
  all_branch: any;
  orderedItemEditId: any;
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
  countryMaster: any = [];
  countryMasterOptions!: Observable<any[]>;
  stateMaster: any = [];
  stateMasterOptions!: Observable<any[]>;

  mobileCountryMaster: any = [];
  mobileCountryMasterOptions!: Observable<any[]>;

  cityMaster: any = [];
  cityMasterOptions!: Observable<any[]>;
  nationalityMaster: any = [];
  nationalityMasterOptions!: Observable<any[]>;
  genderList: any = [];

  enableJawahara: boolean = false;
  posIdNoCompulsory: boolean = false;

  _exchangeItemchange: any = {};
  srCustCode: any = ''; // sales return customer code

  isInvalidRecNo: boolean = false;

  posPlanetIssuing: boolean = false;
  userwiseDiscount: boolean = false;
  // quaggaConfig: any = Quagga.init({
  //   inputStream: {
  //     willReadFrequently: true,
  //     name: "Live",
  //     type: "LiveStream",
  //     target: document.querySelector('#myscanner')    // Or '#yourElement' (optional)
  //   },
  //   decoder: {
  //     readers: ["ean_reader"]
  //   }
  // }, function (err) {
  //   if (err) {
  //     console.log(err);
  //     alert(JSON.stringify(err));
  //     return
  //   }
  //   console.log("Initialization finished. Ready to start");
  //   Quagga.start();
  // });

  giftTypeOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Diamond', label: 'Diamond' },
  ];

  transAttachmentList: any[] = [];
  transAttachmentListData: any[] = [];

  transColumnList: any[] = [
    { title: 'MID', field: 'KYCrefmid' },
    { title: 'Voucher Type', field: 'VOCTYPE' },
    { title: 'Remarks', field: 'REMARKS' },
    // { title: 'Attachment', field: 'ATTACHMENT_PATH' },
    { title: 'Doc Type', field: 'DOC_TYPE' },
    { title: 'Expire Date', field: 'EXPIRE_DATE' },

    // { title: 'Sr #', field: 'SRNO' },
    // { title: 'Code', field: 'CODE' },
    // { title: 'Voucher Number', field: 'VOCNO' },
    // { title: 'Voucher Type', field: 'VOCTYPE' },
    // { title: 'Voucher Date', field: 'VOCDATE' },
    // { title: 'Reference MID', field: 'REFMID' },
    // { title: 'Remarks', field: 'REMARKS' },
    // { title: 'Attachment Path', field: 'ATTACHMENT_PATH' },
    // { title: 'Unique ID', field: 'UNIQUEID' },
    // { title: 'Attachment Type', field: 'ATTACH_TYPE' },
    // { title: 'Expire Date', field: 'EXPIRE_DATE' },
    // { title: 'Branch Code', field: 'BRANCH_CODE' },
    // { title: 'Year Month', field: 'YEARMONTH' },




    // { title: 'Doc Type', field: 'DOC_TYPE' },
    // { title: 'Subled Code', field: 'SUBLED_CODE' },
    // { title: 'Doc Active Status', field: 'DOC_ACTIVESTATUS' },
    // { title: 'Doc Last Renew By', field: 'DOC_LASTRENEWBY' },
    // { title: 'Doc Next Renew Date', field: 'DOC_NEXTRENEWDATE' },
    // { title: 'Doc Last Renew Date', field: 'DOC_LASTRENEWDATE' },
    // { title: 'Document Date', field: 'DOCUMENT_DATE' },
    // { title: 'Document Number', field: 'DOCUMENT_NO' },
    // { title: 'From KYC', field: 'FROM_KYC' },
  ];

  pendingOrderList: any[] = [];
  pendingOrderColumnList: any[] = [
    { title: 'Order No.', field: 'orderno' },
    { title: 'Order Date', field: 'orderdate' },
    { title: 'Delivery Date', field: 'deliverydate' },
    { title: 'Amount', field: 'amount' },
    { title: 'Cusomer Code', field: 'custcode' },
  ];

  estimationList: any[] = [];
  estimationColumnList: any[] = [
    { title: 'Estimation Date', field: 'orderdate' },
    { title: 'Estimation No.', field: 'orderno' },
    { title: 'Sales Man Code', field: 'custcode' },
    { title: 'Cusomer Code', field: 'custcode' },
    { title: 'Cusomer Mobile', field: 'custcode' },
    { title: 'Cusomer Name', field: 'custcode' },
    { title: 'Amount', field: 'amount' },
  ];

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'POS Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  get vocDateVal(): Date {
    return this.vocDataForm.controls.vocdate.value;
  }

  attachmentFile: any;


  constructor(
    private modalService: NgbModal,
    private suntechApi: SuntechAPIService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private renderer: Renderer2,
    public comFunc: CommonServiceService,
    private document: ElementRef,
    // public service: NgxBarcodeScannerService,
    private acRoute: ActivatedRoute,
    private indexedDb: IndexedDbService,

    public indexedApiService: IndexedApiService,

  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
    this.strUser = localStorage.getItem('username');
    this.baseYear = localStorage.getItem('YEAR');
    let branchParams: any = localStorage.getItem('BRANCH_PARAMETER')
    this.comFunc.allbranchMaster = JSON.parse(branchParams);

    this.amlNameValidation = this.comFunc.allbranchMaster.AMLNAMEVALIDATION;

    this.getBranchList();

    let isLayoutRTL = false;
    this.page_language = 'ARABIC';
    this.changeRtlLayout(isLayoutRTL);

    this.orders = [];
    this.order_items_total_net_amount = 0.0;


    this.customerDataForm = this.formBuilder.group({
      fcn_customer_mobile: ['', Validators.required],
      fcn_customer_name: ['', Validators.required],
      fcn_customer_id_number: ['', Validators.required],
      fcn_customer_id_type: ['', [Validators.required, this.autoCompleteValidator(() => this.idTypeOptions)]],
      fcn_customer_code: ['',],
      fcn_customer_exp_date: ['',],
      tourVatRefuncYN: ['',],
      tourVatRefundNo: ['',],
    });

    this.vocDataForm = this.formBuilder.group({
      fcn_voc_no: ['',],
      // fcn_voc_no: ['', Validators.required],
      sales_person: ['', [Validators.required, this.autoCompleteValidator(() => this.salesPersonOptions, 'SALESPERSON_CODE')]],
      vocdate: ['', Validators.required],
      txtCurrency: [],
      txtCurRate: [],

    });

    this.vocDataForm.controls['vocdate'].setValue(this.currentDate);

    this.lineItemForm = this.formBuilder.group({
      fcn_li_item_code: [{ value: '', autofocus: true }, Validators.required],
      fcn_li_item_desc: ['', Validators.required],
      fcn_li_division: ['', Validators.required],
      fcn_li_location: [''],
      fcn_li_gift_type: [''],
      // fcn_li_location: ['', Validators.required],
      fcn_li_pcs: [{ value: 0 }, [Validators.required, Validators.min(1)]],
      fcn_li_gross_wt: ['', [Validators.required, Validators.min(0)]],
      // fcn_li_gross_wt: [{ value: 0, disabled: true }, Validators.required],
      fcn_li_stone_wt: [0, Validators.required],
      fcn_li_net_wt: [0, Validators.required],
      // fcn_li_rate: ['', Validators.required,],
      fcn_li_rate: [{ value: 0 }, [Validators.required, Validators.min(0.1)]],
      fcn_li_total_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_discount_percentage: [0],
      fcn_li_discount_amount: [0],
      fcn_li_gross_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_tax_percentage: [0, Validators.required],
      fcn_li_tax_amount: [0, Validators.required],
      fcn_li_net_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_purity: [{ value: 0 }, Validators.required],
      fcn_li_pure_wt: [{ value: 0 }, Validators.required],
      // additional details
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


    this.salesReturnForm = this.formBuilder.group({
      fcn_returns_fin_year: ['', [Validators.required, this.autoCompleteValidator(() => this.options_year)]],
      fcn_returns_branch: ['', Validators.required],
      fcn_returns_voc_type: ['', Validators.required],
      fcn_returns_voc_no: ['', Validators.required],
      fcn_returns_voc_date: ['',],
      fcn_returns_sales_man: ['',],
      fcn_returns_cust_code: ['',],
      fcn_returns_cust_mobile: ['',],
      fcn_returns_cust_name: ['',],
    });

    this.exchangeForm = this.formBuilder.group({
      fcn_exchange_division: ['', Validators.required],
      fcn_exchange_item_code: ['', [Validators.required]],
      // fcn_exchange_item_code: ['', [Validators.required, this.autoCompleteValidator(() => this.exStockCodeOptions)]],
      fcn_exchange_item_desc: ['', Validators.required],
      fcn_exchange_pcs: [{ value: 0 }],
      // fcn_exchange_pcs: ['', Validators.required],
      fcn_exchange_gross_wt: [{ value: 0 }, Validators.required],
      fcn_exchange_stone_wt: [''],
      fcn_exchange_net_wt: [''],
      fcn_exchange_purity: [{ value: 0 }, Validators.required],
      fcn_exchange_pure_weight: [''],
      fcn_exchange_purity_diff: [''],
      fcn_exchange_stone_rate: [''],
      fcn_exchange_stone_amount: [''],
      fcn_exchange_metal_rate: [''],
      fcn_exchange_metal_amount: [''],
      fcn_exchange_chargeable_wt: [''],
      fcn_exchange_making_rate: [''],
      fcn_exchange_making_amt: [''],
      fcn_exchange_net_amount: [{ value: 0 }, Validators.required],
      fcn_exchange_scrap_bag_no: [''],
      fcn_exchange_scrap_bag_desc: [''],
      fcn_exchange_location: [''],
      fcn_exchange_jawahara: [''],
      fcn_exchange_resale_recycle: [''],
      fcn_exchange_cash_exchange: [''],

    });

    this.customerDetailForm = this.formBuilder.group({
      fcn_customer_detail_name: ['', Validators.required],
      fcn_customer_detail_fname: ['', Validators.required],
      fcn_customer_detail_mname: [''],
      fcn_customer_detail_lname: ['', [Validators.required, Validators.maxLength(100)]],
      fcn_cust_detail_gender: ['', Validators.required],
      fcn_cust_detail_marital_status: [''],
      fcn_cust_detail_dob: ['',
        [Validators.required]
      ],
      fcn_cust_detail_idType: ['', [Validators.required, this.autoCompleteValidator(() => this.idTypeOptions)]],
      fcn_cust_detail_phone: ['', Validators.required],
      fcn_cust_detail_phone2: [''],
      fcn_cust_detail_email: ['', [Validators.email]],
      fcn_cust_detail_address: ['', Validators.required],
      // fcn_cust_detail_address: [''],
      fcn_cust_detail_country: ['', [Validators.required, this.autoCompleteValidator(() => this.countryMaster, 'CODE')]],
      fcn_cust_detail_city: ['', [this.autoCompleteValidator(() => this.cityMaster, 'CODE')]],
      fcn_cust_detail_nationality: ['', [Validators.required, this.autoCompleteValidator(() => this.nationalityMaster, 'CODE')]],
      fcn_cust_detail_idcard: ['', Validators.required],
      fcn_cust_detail_designation: ['', Validators.required],
      fcn_cust_detail_company: [''],
      fcn_cust_detail_state: ['', [this.autoCompleteValidator(() => this.stateMaster, 'CODE')]],

      fcn_mob_code: ['', [Validators.required]],
      fcn_customer_exp_date: ['',],
    });

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
      advanceCustCode: ['', Validators.required],
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

    this.boardingPassForm = this.formBuilder.group({
      passDetails: ['', Validators.required],
      flightNo: ['', Validators.required],
      boardingTo: ['', [Validators.required]],
      boardingDate: ['', [Validators.required]],
      invoiceNo: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      vocType: ['', [Validators.required]],

    });
    this.invoiceWiseForm = this.formBuilder.group({
      serviceInv: ['', [Validators.required]],
      lifeTimeWarr: ['', [Validators.required]],
    });

    /**End Receipt forms  */

    this.inv_customer_name = 'Test Customer';
    this.inv_cust_mobile_no = '9189923023';
    this.inv_sales_man = 'SALESMAN';
    this.inv_bill_date = '22/03/2022';
    this.inv_number = 'SD23233SDF';

    this.receiptTotalNetAmt = '0.00';
    this.order_items_total_net_amount = '0.00';

    // let randomvocno = Math.floor(Math.random() * 100000000 + 1);
    let randomvocno = Math.floor(Math.random() * 1000000 + 1);
    // this.vocDataForm.controls['fcn_voc_no'].setValue(randomvocno);
    console.log(randomvocno, 'randomvocno');

    // this.getArgs();
    this.indexedDb.getAllData('compparams').subscribe((data) => {
      if (data.length > 0) {
        console.log('==============compparams======================');
        console.log(data);
        console.log('====================================');
        this.comFunc.allCompanyParams = data;
        this.comFunc.setCompParaValues();
        this.enableJawahara = this.comFunc.enableJawahara;
        this.posIdNoCompulsory = this.comFunc.posIdNoCompulsory;

        if (this.posIdNoCompulsory) {
          const validations = [Validators.required];
          this.addValidationsForForms(this.customerDataForm, 'fcn_customer_exp_date', validations);
          this.addValidationsForForms(this.customerDetailForm, 'fcn_customer_exp_date', validations);
        }
        this.getArgs();
      } else {
        this.getArgs();
      }
    });

    this.indexedDb.getAllData('branchCurrencyMaster').subscribe((data) => {
      if (data.length > 0) {
        console.log(' this.comFunc.allBranchCurrency', this.comFunc.allBranchCurrency);
        this.comFunc.allBranchCurrency = data;
      }
    });

    this.indexedDb.getAllData('messageBox').subscribe((data) => {

      if (data.length > 0) {
        this.comFunc.allMessageBoxData = data;

        console.log(this.comFunc.allMessageBoxData);
        console.log('==============allMessageBoxData======================');
      }
    });
    this.indexedDb.getAllData('comboFilter').subscribe((data) => {
      if (data.length > 0) {
        this.comFunc.comboFilter = data;
        console.log(data, 'data');

      }
    });
    this.indexedDb.getAllData('divisionMaster').subscribe((data) => {
      console.log('divisionMasterList', data);

      if (data.length > 0) {
        console.log('divisionMasterList', data);

        this.comFunc.divisionMasterList = data;
      }
    });
    this.indexedDb.getAllData('countryMaster').subscribe((data) => {
      if (data.length > 0) {
        this.comFunc.countryMaster = data;
      }
    });
    this.indexedDb.getAllData('nationalityMaster').subscribe((data) => {
      if (data.length > 0) {
        this.comFunc.nationalityMaster = data;
      }
    });
    this.indexedDb.getAllData('idMaster').subscribe((data) => {
      if (data.length > 0) {
        console.log('idMaster', data);
        this.comFunc.idMaster = data;
      }
    });
    // this.getReceiptModes();

    this.customerDetailForm.get('fcn_cust_detail_idType')?.valueChanges.subscribe((val) => {
      const res = this.idTypeOptionList.find((data: any) => data.CODE === val);
      const validations = [Validators.required];
      if (res) {
        if (res?.MINDIGITS != 0)
          validations.push(Validators.minLength(res.MINDIGITS));
        if (res?.MAXDIGITS != 0)
          validations.push(Validators.maxLength(res.MAXDIGITS));
      }
      this.addValidationsForForms(this.customerDetailForm, 'fcn_cust_detail_idcard', validations);

    });
    this.customerDataForm.get('fcn_customer_id_type')?.valueChanges.subscribe((val) => {
      const res = this.idTypeOptionList.find((data: any) => data.CODE === val);
      const validations = [Validators.required];
      if (res) {
        if (res?.MINDIGITS != 0)
          validations.push(Validators.minLength(res.MINDIGITS));
        if (res?.MAXDIGITS != 0)
          validations.push(Validators.maxLength(res.MAXDIGITS));
      }
      this.addValidationsForForms(this.customerDataForm, 'fcn_customer_id_number', validations);
      this.addValidationsForForms(this.customerDetailForm, 'fcn_cust_detail_idcard', validations);

    });


    this.setVoctypeMaster();

  }
  setVoctypeMaster() {
    let branch = localStorage.getItem('userbranch')
    this.indexedDb.getAllData('VocTypeMaster').subscribe((data) => {
      if (data.length == 0 || data.length == 1) {
        this.indexedApiService.getVocTypeMaster(branch);
      }
      this.comFunc.VocTypeMasterData = data;
    });
  }
  // async getAllCompanyParameters() {
  //   let map = new Map();
  //   this.suntechApi.getCompanyParameters().subscribe(async (resp) => {
  //     if (resp.status == 'Success') {
  //       this.suntechApi.setCompanyParamSubject('testsubject');
  //       this.comFunc.allCompanyParams = await resp.response;
  //       this.comFunc.allCompanyParams.filter((data) => {
  //         if (data.Parameter == 'AMTFORMAT')
  //           this.comFunc.amtFormat = data.PARAM_VALUE;
  //         if (data.Parameter == 'MQTYFORMAT')
  //           this.comFunc.mQtyFormat = data.PARAM_VALUE;
  //         if (data.Parameter == 'AMTDECIMALS')
  //           this.comFunc.amtDecimals = data.PARAM_VALUE;
  //         if (data.Parameter == 'MQTYDECIMALS')
  //           this.comFunc.mQtyDecimals = data.PARAM_VALUE;
  //         if (data.Parameter == 'POSSHOPCTRLAC')
  //           this.comFunc.basePartyCode = data.PARAM_VALUE;
  //         if (data.Parameter == 'COMPANYCURRENCY') {
  //           this.comFunc.compCurrency = data.PARAM_VALUE;
  //         }
  //         if (data.Parameter == 'POSKARATRATECHANGE') {
  //           this.comFunc.posKARATRATECHANGE = data.PARAM_VALUE;
  //           if (this.comFunc.posKARATRATECHANGE.toString() == '0') {
  //             this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
  //           }

  //         }

  //       });
  //       this.zeroAmtVal = this.comFunc.transformDecimalVB(
  //         this.comFunc.amtDecimals,
  //         0
  //       );
  //       this.zeroMQtyVal = this.comFunc.transformDecimalVB(
  //         this.comFunc.mQtyDecimals,
  //         0
  //       );
  //     }
  //   });
  // }
  checkIfYearOptionExists(control: AbstractControl) {
    const inputValue = control.value;
    // const optionExists = this.options_year.filter((data)=> data[''].toString() == inputValue.toString());
    console.log('============options_year========================');
    console.log(this.options_year, inputValue.toString());
    console.log('====================================');
    const optionExists = this.options_year.filter((data) =>
      data.toString().includes(inputValue.toString())
    );
    // const optionExists = this.options_year.includes(inputValue.toString());
    console.log('============optionExists========================');
    console.log(optionExists);
    console.log('====================================');
    return optionExists ? null : { optionNotFound: true };
  }

  getArgs() {
    console.log('======content==============================');
    console.log(this.content);
    console.log('====================================');

    // need to enable
    // this.vocType = this.comFunc.getqueryParamVocType()
    if (this.content != undefined)
      this.posMode = this.content?.FLAG;

    if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') {

      this.vocDataForm.controls.fcn_voc_no.setValue(this.content.VOCNO);
      this.vocDataForm.controls.vocdate.setValue(this.content.VOCDATE);
      this.getFinancialYear();

      this.strBranchcode = this.content.BRANCH_CODE;
      this.vocType = this.content.VOCTYPE;
      // this.baseYear = this.content.YEARMONTH;
      this.getRetailSalesMaster(this.content);
      if (this.content.FLAG == "EDIT") {
        this.editOnly = true
      }
      if (this.content.FLAG == 'VIEW') {
        this.viewOnly = true;
      }

    } else {
      this.getFinancialYear();
      this.generateVocNo();

    }

    // this.vocDataForm.get('vocdate')?.valueChanges.subscribe((val) => {
    //   this.getFinancialYear();
    // });

    // this.acRoute.queryParams.subscribe((params) => {
    //   if (params.vocNo) {
    //     this.queryParams = params;
    //     if (this.router.url.includes('view-pos')) {
    //       this.viewOnly = true;
    //       // this.setReadOnlyForViewMode();
    //     }
    //     if (this.router.url.includes('edit-pos')) this.editOnly = true;

    //     this.vocDataForm.controls.fcn_voc_no.setValue(params.vocNo);
    //     this.strBranchcode = params.branchCode;
    //     this.vocType = params.vocType;
    //     this.baseYear = params.yearMonth;
    //     this.getRetailSalesMaster(params);
    //   }
    // });
  }
  getRetailSalesMaster(data: any) {
    this.snackBar.open('Loading...');
    let API = `RetailSalesDataInDotnet/GetRetailSalesData/BranchCode=${data.BRANCH_CODE}/VocType=${data.VOCTYPE}/YearMonth=${data.YEARMONTH}/VocNo=${data.VOCNO}`
    this.suntechApi.getDynamicAPI(API).subscribe((res) => {
      this.snackBar.dismiss();
      console.log(res, 'getRetailSalesMaster');
      const posCustomer = res.response.customer;
      const retailSaleData = res.response.retailSales;
      const retailSReturnData = res.response.retailsReturn;
      const metalPurchaseData = res.response.metalPurchase;
      this.receiptDetailsList = res.response.retailReceipt;
      this.sumTotalValues();

      // const values = res.response;
      if (res.status == 'Success') {
        /**start set customer data */
        this.vocDataForm.controls['vocdate'].setValue(retailSaleData.VOCDATE);
        // this.vocDataForm.controls.vocdate.setHours(0,0,0);
        const karatRate = res.response.karatRate;
        this.retailSaleDataVocNo = retailSaleData.VOCNO;
        this.retailSReturnVocNo = retailSReturnData.VOCNO;
        this.metalPurchaseDataVocNo = metalPurchaseData.VOCNO;

        this.retailSalesMID = retailSaleData.MID;
        this.retailSReturnDataMID = retailSReturnData.MID;
        this.metalPurchaseDataMID = metalPurchaseData.MID;
        // alert(this.retailSaleDataVocNo);
        // alert(this.retailSReturnVocNo);
        // alert(this.metalPurchaseDataVocNo);
        this.karatRateDetails = karatRate;

        if (data.VOCNO == retailSaleData.VOCNO) {
          this.vocDataForm.controls['fcn_voc_no'].setValue(
            retailSaleData.VOCNO
          );
        } else {
          this.vocDataForm.controls['fcn_voc_no'].setValue(data.VOCNO);
        }
        // salesperson code
        this.vocDataForm.controls['sales_person'].setValue(
          retailSaleData.SALESPERSON_CODE
        );

        this.customerDataForm.controls['fcn_customer_name'].setValue(
          posCustomer.NAME
        );
        this.customerDataForm.controls['fcn_customer_id_type'].setValue(
          posCustomer.IDCATEGORY
          // posCustomer.CUST_TYPE
        );
        this.customerDataForm.controls['fcn_customer_id_number'].setValue(
          posCustomer.POSCUSTIDNO
        );
        this.customerDataForm.controls['fcn_customer_mobile'].setValue(
          posCustomer.MOBILE
        );


        this.customerDataForm.controls.tourVatRefuncYN.setValue(
          retailSaleData.TRAYN || false
        );
        this.customerDataForm.controls.tourVatRefundNo.setValue(
          retailSaleData.TRANO
        );


        this.inv_customer_name = posCustomer.NAME;
        this.inv_cust_mobile_no = posCustomer.MOBILE;

        this.customerDetailForm.controls.fcn_mob_code.setValue(
          posCustomer.MOBILECODE1
        );
        this.customerDataForm.controls.fcn_customer_code.setValue(
          posCustomer.CODE
        );
        this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
          posCustomer.MOBILE
        );
        this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
          posCustomer.EMAIL
        );
        this.customerDetailForm.controls['fcn_cust_detail_address'].setValue(
          posCustomer.ADDRESS
        );
        this.customerDetailForm.controls['fcn_cust_detail_country'].setValue(
          posCustomer.COUNTRY_CODE
        );
        this.getStateMasterByID(posCustomer.COUNTRY_CODE);


        this.customerDetailForm.controls['fcn_cust_detail_state'].setValue(
          posCustomer.STATE
        );

        this.getCityMasterByID(posCustomer.COUNTRY_CODE, posCustomer.STATE);
        this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
          posCustomer.CITY
        );

        this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
          posCustomer.NATIONAL_IDENTIFICATION_NO
        );

        // Customer data
        this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
          posCustomer.NAME
        );
        this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
          posCustomer.FIRSTNAME
        );
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
          posCustomer.MIDDLENAME
        );
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          posCustomer.LASTNAME
        );
        this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
          posCustomer.MOBILE1
        );
        this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
          posCustomer.GENDER
        );
        this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
          posCustomer.MARITAL_ST
        );
        this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
          posCustomer.MARITAL_ST
        );
        this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
          this.dummyDateCheck(posCustomer.DATE_OF_BIRTH)
        );
        this.customerDetailForm.controls.fcn_cust_detail_designation.setValue(
          posCustomer.DESIGNATION
        );
        this.customerDetailForm.controls.fcn_cust_detail_company.setValue(
          posCustomer.COMPANY
        );
        this.customerDetailForm.controls.fcn_cust_detail_nationality.setValue(
          posCustomer.NATIONALITY
        );
        this.customerDetailForm.controls.fcn_customer_exp_date.setValue(
          posCustomer.POSCUSTIDEXP_DATE
        );
        this.customerDataForm.controls.fcn_customer_exp_date.setValue(
          posCustomer.POSCUSTIDEXP_DATE
        );

        this.customerDetails = posCustomer;

        if (this.amlNameValidation)
          if (!posCustomer.AMLNAMEVALIDATION && posCustomer.DIGISCREENED) {
            this.amlNameValidationData = false;
          } else {
            this.amlNameValidationData = true;
            this.openDialog('Warning', 'Pending for approval', true);
          }
        /**end set customer data */

        this.boardingPassForm.controls.passDetails.setValue(retailSaleData.BOARDINGPASS);
        this.boardingPassForm.controls.flightNo.setValue(retailSaleData.FLIGHTNO);
        this.boardingPassForm.controls.boardingDate.setValue(retailSaleData.BOARDINGDATE);
        this.boardingPassForm.controls.boardingTo.setValue(retailSaleData.BOARDINGFROM);
        this.boardingPassForm.controls.boardingTo.setValue(retailSaleData.BOARDINGFROM);

        this.invoiceWiseForm.controls.lifeTimeWarr.setValue(retailSaleData.LIFETIMEWARRANTY);
        this.invoiceWiseForm.controls.serviceInv.setValue(retailSaleData.SERVICE_INVOICE);

        /**start set line item*/
        if (retailSaleData != null && retailSaleData.RetailDetails != null)
          retailSaleData.RetailDetails.map((data: any, index: any) => {
            console.log(
              '===============retailSalesDetails====================='
            );
            console.log(data, index);
            console.log('====================================');

            this.newLineItem = data;

            const values: any = {
              ID: data.SRNO,
              sn_no: data.SRNO,
              // sn_no: index + 1,
              stock_code: data.STOCK_CODE,
              // mkg_amount: ( || 0),
              total_amount: data.MKGVALUEFC || 0,
              pcs: data.PCS,
              weight: data.GROSSWT,
              description: data.STOCK_DOCDESC,
              tax_amount: data.VAT_AMOUNTFC,
              net_amount: data.TOTALWITHVATFC,
              // net_amount: data.NETVALUEFC,
              pure_wt: data.PUREWT,
              making_amt: data.MKGVALUEFC || 0,
              dis_amt: data.DISCOUNTVALUEFC || 0,
              // gross_amt: (data.GROSS_AMT || 0),
              rate: data.MKG_RATECC || 0,
              metal_rate: data.METAL_RATE || 0,
              taxPer: data.VAT_PER || 0,
              metal_amt: this.lineItemForm.value.fcn_ad_metal_amount || 0,
              stone_amt: this.lineItemForm.value.fcn_ad_stone_amount || 0,
            };

            // this.newLineItem.pcs = data.PCS;
            // this.newLineItem.pure_wt = data.PURITY;
            // this.newLineItem.STONEWT = data.STONE_WT;
            // this.newLineItem.total_amount = data.MKGVALUEFC;
            // this.newLineItem.divisionMS = data.divisionMS;
            this.order_items_slno_length = data.SRNO;
            this.ordered_items.push(values);
            this.currentLineItems.push(data);
            const divisionMS: any = this.comFunc.getDivisionMS(data.DIVISION_CODE);
            this.currentLineItems[index].divisionMS = divisionMS;
            if (divisionMS == 'M') {
              values.gross_amt = data.NETVALUEFC;
              this.currentLineItems[index].GROSS_AMT = data.NETVALUEFC;
            } else {
              values.gross_amt = data.MKGVALUEFC;
              this.currentLineItems[index].GROSS_AMT = data.MKGVALUEFC;
            }
            console.log(
              '==============currentLineItems val======================'
            );
            console.log(this.currentLineItems);
            console.log(this.currentLineItems[index]);
            console.log('====================================');
          });

        this.retailSalesDataPost = retailSaleData;
        this.retailSalesDataPost.RetailDetails = [];

        if (this.ordered_items.length >= 0)
          this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
        this.sumTotalValues();

        /**end set line item */

        /**start set sales return item */
        if (
          retailSReturnData != null &&
          retailSReturnData.retailSReturnDetails != null
        )
          retailSReturnData.retailSReturnDetails.map((data: any, index: any) => {
            console.log(
              '============retailSReturnDetails========================'
            );
            console.log(data, index);
            console.log('====================================');

            this.sales_returns_total_amt += parseFloat(
              parseFloat(data.TOTALWITHVATFC).toFixed(2)
            );
            const values: any = {
              rid: this.comFunc.generateNumber(),
              ID: data.SRNO,
              sn_no: data.SRNO,
              stock_code: data.STOCK_CODE,
              mkg_amount: data.MKG_RATEFC,
              total_amount: data.TOTALWITHVATFC,
              pcs: data.PCS,
              weight: data.GROSSWT,
              description: data.STOCK_DOCDESC,
              net_amount: data.NETVALUEFC,
              slsReturn: data,
              // new values
              making_amt: data.MKGVALUEFC,
              metal_amt: data.METALVALUEFC,
              pure_wt: data.PUREWT,
              stone_amt: data.STONEVALUEFC,
            };

            values.PUDIFF = data.PUDIFF;
            values.STONEDIFF = data.STONEDIFF;
            values.DISCOUNTVALUEFC = data.DISCOUNTVALUEFC;
            values.DISCOUNT = data.DISCOUNT;
            values.VAT_AMOUNTFC = data.VAT_AMOUNTFC;
            values.UNIQUEID = data.UNIQUEID;

            this.sales_returns_items.push(values);
            this.sales_returns_pre_items.push(values);
            this.sales_returns_items_slno_length = 1;
            this.currentsalesReturnItems.push(data);
            this.currentsalesReturnItems.rid = this.comFunc.generateNumber();
          });
        this.retailSReturnDataPost = retailSReturnData;
        // this.retailSReturnDataPost.retailSReturnDetails = [];

        this.sumTotalValues();
        /**end set sales return item */

        /**start set Metal purchase (Exchange) item */
        if (
          metalPurchaseData != null &&
          metalPurchaseData.metalPurchaseDetails != null
        )
          metalPurchaseData.metalPurchaseDetails.map((data: any, index: any) => {
            console.log(
              '============metalPurchaseDetail========================'
            );
            console.log(data, index);
            console.log('====================================');
            var values: any = {
              ID: data.SRNO,
              sn_no: data.SRNO,
              stock_code: data.STOCK_CODE,
              mkg_amount: data.MKGVALUEFC,
              total_amount: data.NETVALUEFC,
              pcs: data.PCS,
              weight: data.GROSSWT,
              description: data.STOCK_DOCDESC,
              tax_amount: '0',
              net_amount: data.NETVALUEFC,
              metalRate: data.METAL_RATE,
              metalAmt: data.METALVALUEFC,
              ozWeight: data.OZWT,

              gross_wt: data.GROSSWT || 0,
              pure_wt: data.PUREWT || 0,
              stone_amt: data.STONEVALUEFC,
              purity_diff: data.PUDIFF,
              METAL_RATE_TYPE: data.METAL_RATE_TYPE,
              METAL_RATE: data.METAL_RATE,
              METAL_RATE_PERGMS_ITEMKARAT: data.METAL_RATE_PERGMS_ITEMKARAT,
              OZWT: data.OZWT,
            };

            this.exchange_items.push(values);
            this.currentExchangeMetalPurchase.push(data);
          });
        this.metalPurchaseDataPost = metalPurchaseData;
        // this.metalPurchaseDataPost.metalPurchaseDetail = [];
        this.exchange_items_slno_length = this.exchange_items.length;
        this.sumTotalValues();
        /**end set Metal purchase (Exchange) item */
      } else {
      }
    });
  }
  // onStartButtonPress() {
  //   this.service.start(this.quaggaConfig, 0.1)
  // }

  // onError(error: any) {
  //   console.error(error);
  //   alert(JSON.stringify(error))
  //   // this.isError = true;
  // }
  // onStopButtonPress() {
  //   alert('value' + this.barcode);
  //   this.service.stop()
  // }

  private _filter(value: string): string[] {
    const filterValue = (value || '').toLowerCase();

    return this.branchOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  getBranchList() {
    this.suntechApi.getDynamicAPI('UseBranchNetMaster/' + this.strUser).subscribe((resp) => {
      this.all_branch = resp.response;
      // this.all_branch = resp.Result;
      console.log('branch', this.all_branch);
      var data = this.all_branch.map((t: any) => t.BRANCH_CODE);

      this.advanceReceiptForm.controls.advanceBranch.setValue(this.strBranchcode);

      this.branchOptions = data;
      this.filteredBranchOptions =
        this.dataForm.controls.branch.valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value))
        );
      this.filteredSalesReturnBranchOptions =
        this.salesReturnForm.controls.fcn_returns_branch.valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value))
        );
      this.filteredAdvanceBranchOptions =
        this.advanceReceiptForm.controls.advanceBranch.valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value))
        );
      this.filteredGiftModeBranchOptions =
        this.giftReceiptForm.controls.giftBranch.valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value))
        );
    });
  }
  changeRtlLayout(flag: any) {
    // console.log('change layout');
    // if (flag) {
    //   this.document.nativeElement.querySelector('body').classList.add('gradient-rtl');
    // } else {
    //   this.document.nativeElement.querySelector('body').classList.remove('gradient-rtl');
    // }
  }
  // scannerFunc() {
  //   console.log('====================================');
  //   console.log('this.scanner.isStarted', this.scanner.isStarted);
  //   console.log('====================================');
  //   if (this.scanner.isStarted)
  //     this.scanner.stop();
  //   else {
  //     this.scanner.start();
  //     // this.scanner.restart();
  //   }
  // }
  onStarted(started: any) {
    console.log(started);
  }
  // ngAfterViewInit() {
  //   this.scanner.show();
  //   // this.scanner.s
  // }

  onValueChanges(result: any) {
    alert(JSON.stringify(result));
    this.barcode = result.codeResult.code;
    alert(this.barcode);
    // this.lineItemForm.controls.fcn_li_item_code.setValue(result.codeResult.code);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.viewOnly) this.setReadOnlyForViewMode();
  }
  ngOnInit(): void {
    /* this.receiptDetailsList = [
      {
        mode: 'CASH',
        currency: 'AED',
        amount_lc: '0.000',
      },
    ];*/

    /*
    VocDate
    VocNo
    Sales Person
    Customer
    Mobile
    ID type - Missing
    ID - Missing

    Line Item
    Sales Return
    Exchanges
    Slno
    Stock Code
    Description
    Weight
    Pcs
    Mkg Amount
    Total  Amount
    Total Wt
    Total Quantity
    AED


    Item Details

    Division
    Item Code
    Item Desciption
    Location
    Pcs
    Gross Wt
    Stone Wt


    */


    // this.strBranchcode = this.content.BRANCH_CODE;
    this.vocType = this.comFunc.getqueryParamVocType();
    this.mainVocType = this.comFunc.getqueryParamVocType();
    // this.baseYear = this.content.YEARMONTH;

    let isLayoutRTL = false;
    this.page_language = 'ENGLISH';

    if (this.page_language != 'ENGLISH') {
      this.suntechApi.getDynamicAPI('LanguageDictionary').subscribe((resp) => {
        let temp_labels = resp.Result;
        console.log(temp_labels);
        let key = this.page_language;
        let date_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'VocDate'
        );
        console.log(date_lbl_val);
        let vocno_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'VocNo'
        );
        let sales_person_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'Sales Person'
        );
        let customer_name_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'Customer'
        );
        let mobile_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'Mobile'
        );
        let slno_lbl_val = temp_labels.find(
          ({ ENGLISH }: any) => ENGLISH === 'SlNo'
        );

        this.date_lbl = date_lbl_val[key];
        this.vocno_lbl = vocno_lbl_val[key];
        this.sales_person_lbl = sales_person_lbl_val[key];
        this.customer_name_lbl = customer_name_lbl_val[key];
        this.mobile_lbl = mobile_lbl_val[key];
        this.slno_lbl = slno_lbl_val[key];
      });
    }

    // this.suntechApi.getLanguageDictionaryWeb().subscribe((resp) => {
    //   this.newDictionary = this.convertDict(resp.Result);
    //   console.log(this.newDictionary);
    // });

    // this.suntechApi.getRetailSalesItemVatInfo('DMCC').subscribe((resp) => {
    //   let temp_tax_percentage = resp.Result[0];
    //   this.branch_tax_percentage = parseFloat(temp_tax_percentage.TAX_PER);
    // });
    this.getYearList();
    this.getKaratDetails();
    this.getSalesPersonMaster();
    this.getMasters();
    this.getIdMaster();
    this.getCreditCardList();
    this.getExchangeStockCodes();
    this.getMaritalStatus();
    this.getAccountLookup();


    // this.getComboFilters();


    this.posPlanetIssuing = this.comFunc.allbranchMaster.POSPLANETISSUING;
    this.userwiseDiscount = this.comFunc.getCompanyParamValue('USERWISEDISCOUNT').toString() == '0' ? false : true;

    this.vocDataForm.controls.txtCurrency.setValue(this.comFunc.compCurrency);
    this.vocDataForm.controls.txtCurRate.setValue(this.comFunc.getCurrRate(this.comFunc.compCurrency));
  }
  getKaratDetails() {
    if (!this.editOnly && !this.viewOnly) {
      this.suntechApi
        .getDynamicAPI('BranchKaratRate/' + this.strBranchcode)
        .subscribe((resp) => {
          if (resp.status == 'Success') {
            let temp_karatrate: any = resp.response;
            for (var i = 0; i < temp_karatrate.length; i++) {
              // let karat_codes = ['14', '18', '20', '21', '22', '24'];
              // if (karat_codes.includes(temp_karatrate[i].KARAT_CODE)) {
              if (temp_karatrate[i]['KARAT_RATE'].toString() != '0') {
                this.karatRateDetails.push(temp_karatrate[i]);
              }
            }
            this.karatRateDetails.sort((a: any, b: any) =>
              a.KARAT_CODE > b.KARAT_CODE ? 1 : -1
            );
            if (this.comFunc.posKARATRATECHANGE.toString() == '0') {
              this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
            }
            if (this.ordered_items.length >= 0)
              this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
          } else {
            this.karatRateDetails = [];
          }
        });
    }
  }

  getMaritalStatus() {
    this.maritalStatusList = this.comFunc.getComboFilterByID('Marital Status');
    this.genderList = this.comFunc.getComboFilterByID('gender');
    console.log('gender ', this.genderList);

  }
  changeKaratRate(event: any, index: any) {
    this.karatRateDetails[index].KARAT_RATE = parseFloat(event?.target.value);
  }
  convertDict(dict: any) {
    let respDict: any = {};
    for (let i = 0; i < dict.length; i++) {
      if (this.page_language == 'ENGLISH') {
        respDict[dict[i].LABEL_ID] = dict[i].ENGLISH;
      } else if (this.page_language == 'ARABIC') {
        respDict[dict[i].LABEL_ID] = dict[i].ARABIC;
      }
    }
    return respDict;
  }

  // savePayments() {
  //   let retailReceipt: any = {
  //     REFMID: '846231',
  //     // "RECEIPT_MODE": "STG",
  //     // "CURRENCY_CODE": "STG ",
  //     CURRENCY_RATE: '4.45000',
  //     // "AMOUNT_CC": "4450.00",
  //     Description: '',
  //     // "SRNO": "1",
  //     branch_code: this.strBranchcode,
  //     VOCTYPE: this.vocType,
  //     vocno: this.vocDataForm.value.fcn_voc_no,
  //     vocdate: this.convertDateWithTimeZero(
  //       new Date(this.vocDataForm.value.vocdate).toISOString()
  //     ),
  //     ARECVOCNO: '',
  //     ARECVOCTYPE: 'PCR',
  //     ARECMID: '-1',
  //     LOCKED: false,
  //     FYEARCODE: '2023',
  //     REC_BRANCHCODE: 'BR02', // need
  //     RdmLoyalty: '0',
  //     VATCODE: '',
  //     VATPER: 0.0, //need
  //     VATAMTLC: 0.0,
  //     VATAMTFC: 0.0,
  //     TOTAMTWITHOUTVATLC: 0.0, //need
  //     TOTAMTWITHOUTVATFC: 0.0,
  //     CCAPPROVALCODE: '',
  //     GIFT_CARDNO: '',
  //     OT_TRANSFER_TIME: '',
  //   };

  //   var receipt_items_length = this.receiptDetailsList.length;
  //   if (receipt_items_length == 0) this.receipt_items_slno_length = 1;
  //   else this.receipt_items_slno_length = this.receipt_items_slno_length + 1;

  //   let cash_amount = this.receiptTotalForm.value.fcn_payments_cr_amount;
  //   let cc_amount = this.receiptTotalForm.value.fcn_amount_cc;

  //   console.log(this.receiptTotalForm.value.fcn_payments_cr_amount);
  //   console.log(this.receiptTotalForm.value.fcn_payments_cr_currency);
  //   console.log(this.receiptTotalForm.value.fcn_payments_cr_receipt_mode);

  //   if (cash_amount != 0 && cash_amount > 0) {
  //     retailReceipt.SRNO = this.receipt_items_slno_length;
  //     retailReceipt.CURRENCY_CODE =
  //       this.receiptTotalForm.value.fcn_payments_cr_currency;
  //     retailReceipt.AMOUNT_FC = this.comFunc.transformDecimalVB(
  //       this.comFunc.amtDecimals,
  //       this.receiptTotalForm.value.fcn_payments_cr_amount
  //     );
  //     retailReceipt.AMOUNT_CC = this.comFunc.CCToFC(
  //       this.comFunc.compCurrency,
  //       this.receiptTotalForm.value.fcn_payments_cr_amount
  //     );
  //     retailReceipt.RECEIPT_MODE =
  //       this.receiptTotalForm.value.fcn_payments_cr_receipt_mode;
  //     this.receiptDetailsList.push(retailReceipt);
  //     this.sumTotalValues();
  //     this.receiptTotalForm.controls['fcn_payments_cr_amount'].setValue(0);
  //     let _balancetopay =
  //       this.order_items_total_net_amount - this.receiptTotalNetAmt;
  //     this.receiptTotalForm.controls[
  //       'fcn_payment_total_balanceamount'
  //     ].setValue(_balancetopay.toFixed(2));
  //   }

  //   if (cc_amount != 0 && cc_amount > 0) {
  //     retailReceipt.SRNO = this.receipt_items_slno_length;
  //     retailReceipt.CURRENCY_CODE = 'AED';
  //     retailReceipt.AMOUNT_FC = this.comFunc.transformDecimalVB(
  //       this.comFunc.amtDecimals,
  //       this.receiptTotalForm.value.fcn_amount_cc
  //     );
  //     retailReceipt.RECEIPT_MODE =
  //       this.receiptTotalForm.value.fcn_receipt_mode_cc;
  //     this.receiptDetailsList.push(retailReceipt);
  //     this.sumTotalValues();
  //     this.receiptTotalForm.controls['fcn_amount_cc'].setValue(0);
  //     let _balancetopay =
  //       this.order_items_total_net_amount - this.receiptTotalNetAmt;
  //     this.receiptTotalForm.controls[
  //       'fcn_payment_total_balanceamount'
  //     ].setValue(_balancetopay.toFixed(2));
  //   }

  //   console.log(this.receiptDetailsList);
  // }

  validateReceipt() {
    if (this.selectedTabIndex == 0) {
      return this.cashreceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 1) {
      return this.creditCardReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 2) {
      return this.advanceReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 3) {
      return this.othersReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 4) {
      return this.giftReceiptForm.invalid;
    } else {
      return this.customerReceiptForm.invalid;
    }
  }
  saveReceipt(type?: any) {
    const res = this.validateReceipt();


    if (this.selectedTabIndex == 2) {
      if (this.isInvalidRecNo) {
        this.snackBar.open('Invalid Receipt No.', 'OK', {
          duration: 2000
        });
        return;
      }
    } else {
      this.isInvalidRecNo = false;
    }

    if (!res) {
      // if (parseFloat(this.cashreceiptForm.value.receiptAmtFC) > 0) {

      var RECEIPT_MODE,
        ARECVOCNO,
        AMOUNT_FC,
        AMOUNT_CC,
        ARECMID,
        CARD_NO,
        IGST_PER,
        HSN_CODE,
        GST_CODE,
        IGST_ACCODE,
        IGST_AMOUNTFC,
        IGST_AMOUNTCC,
        REC_BRANCHCODE = '',
        FYEARCODE = '';

      if (this.selectedTabIndex == 0) {
        RECEIPT_MODE = this.cashreceiptForm.value.paymentsCash.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtLC));
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      } else if (this.selectedTabIndex == 1) {
        RECEIPT_MODE = this.creditCardReceiptForm.value.paymentsCreditCard.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC));
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = (this.creditCardReceiptForm.value.cardCCNo).toString();

        ARECMID = -1;
      } else if (this.selectedTabIndex == 2) {
        RECEIPT_MODE = this.advanceReceiptForm.value.paymentsAdvance.toString();
        ARECVOCNO = this.advanceReceiptForm.value.advanceRecNo;
        AMOUNT_FC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount));
        IGST_PER = this.advanceReceiptDetails['IGST_PER'];
        HSN_CODE = this.advanceReceiptDetails['HSN_CODE'];
        GST_CODE = this.advanceReceiptDetails['DT_GST_CODE'];
        IGST_ACCODE = this.advanceReceiptDetails['IGST_ACCODE'];
        IGST_AMOUNTFC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountFC);
        IGST_AMOUNTCC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountLC);
        // IGST_AMOUNTCC = baseCtrl.FCToCC(
        //     baseCtrl.compCurrency, this.comFunc.emptyToZero(receiptAmtLC.text));
        CARD_NO = '0';
        REC_BRANCHCODE = this.advanceReceiptForm.value.advanceBranch;
        FYEARCODE = this.advanceReceiptForm.value.advanceYear;
        ARECMID = this.advanceReceiptDetails['MID'];
      } else if (this.selectedTabIndex == 3) {
        RECEIPT_MODE = this.othersReceiptForm.value.paymentsOthers.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC));
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      } else if (this.selectedTabIndex == 4) {
        RECEIPT_MODE = this.giftReceiptForm.value.paymentsCreditGIftVoc.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC));
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        ARECMID = -1;

      } else if (this.selectedTabIndex == 5) {
        RECEIPT_MODE = this.customerReceiptForm.value.customAcCodeList.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtLC));
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      }

      let itemsLengths: any = this.receiptDetailsList[this.receiptDetailsList.length - 1];
      let receiptSrNO;

      if (
        this.receiptEditId == '' ||
        this.receiptEditId == undefined ||
        this.receiptEditId == null
      ) {
        if (itemsLengths == undefined) itemsLengths = 1;
        else {
          itemsLengths = parseInt(itemsLengths.SRNO) + 1;
        }
        receiptSrNO = itemsLengths;
      } else {
        itemsLengths = this.receiptEditId;
        receiptSrNO = itemsLengths;
      }

      var receiptDetails = {
        "SRNO": receiptSrNO,
        "REFMID": this.retailSalesMID || receiptSrNO,
        "VOCTYPE": "POS",
        "VOCNO": this.retailSaleDataVocNo ?? receiptSrNO,
        "VOCDATE": new Date().toISOString(),
        "BRANCH_CODE": this.strBranchcode,
        "REC_BRANCHCODE": REC_BRANCHCODE,
        "YEARMONTH": this.baseYear || localStorage.getItem('YEAR'),
        "RECEIPT_MODE": RECEIPT_MODE,
        "CURRENCY_CODE": this.comFunc.compCurrency,
        // "CURRENCY_RATE": this.comFunc.currencyRate ?? '1',
        "CURRENCY_RATE": '1',
        "AMOUNT_FC": AMOUNT_FC,
        "AMOUNT_CC": AMOUNT_CC,
        "DESCRIPTION": "",
        "FYEARCODE": this.baseYear || localStorage.getItem('YEAR'),
        // "FYEARCODE": "2023",

        "ARECVOCNO": ARECVOCNO,
        // "ARECVOCNO": advanceRecNo.text,
        "ARECVOCTYPE": "pcr", //doubt
        "ARECMID": ARECMID,
        "LOCKED": false,
        "RDMLOYALTY": "0",
        "VATCODE": "",
        "VATPER": "0.00",
        "VATAMTLC": "0.000",
        "VATAMTFC": "0.000",
        "TOTAMTWITHOUTVATLC": AMOUNT_CC,
        "TOTAMTWITHOUTVATFC": AMOUNT_FC,
        "CCAPPROVALCODE": "",
        "GIFT_CARDNO": "",
        "OT_TRANSFER_TIME": "",
        "CARD_NO": CARD_NO,
        "CARD_HOLDER": "0",
        "CARD_VALID": "0",
        "CREDITDAYS": "0",
        "VALUE_DATE": new Date().toISOString(),
        "SGST_ACCODE": "0",
        "IGST_ACCODE": IGST_ACCODE ?? "0",
        "CGST_CTRLACCODE": "0",
        "SGST_CTRLACCODE": "0",
        "IGST_CTRLACCODE": "0",
        "CGST_PER": "0.00",
        "CGST_AMOUNTFC": "0.000",
        "CGST_AMOUNTCC": "0.000",
        "SGST_PER": "0.00",
        "SGST_AMOUNTFC": "0.000",
        "SGST_AMOUNTCC": "0.000",
        "IGST_PER": IGST_PER ?? "0.00",
        "IGST_AMOUNTFC": IGST_AMOUNTFC ?? "0.000",
        "IGST_AMOUNTCC": IGST_AMOUNTCC ?? "0.000",
        "HSN_CODE": HSN_CODE ?? "0",
        "GST_CODE": GST_CODE ?? "0",
        "CGST_ACCODE": "0",
        "REC_COMM_AMOUNTFC": "0",
        "REC_COMM_AMOUNTCC": "0",
        "POS_CREDIT_ACCODE": "0",
        "POS_CREDIT_ACNAME": "0",
        "DT_YEARMONTH": this.baseYear || localStorage.getItem('YEAR'),
        // "DT_YEARMONTH": "2022",
        "RECEIPT_TYPE": "0",
        "GIFT_CARD_BRANCH": "0",
        "WOOCOMCARDID": "0",

        // new fields added 27-12-2023
        "NEWUNIQUEID": 0,

      };


      if (
        this.receiptEditId == '' ||
        this.receiptEditId == undefined ||
        this.receiptEditId == null
      ) {
        this.receiptDetailsList.push(receiptDetails);
      } else {
        const preitemIndex = this.receiptDetailsList.findIndex((data: any) => {
          console.table(data.SRNO == this.receiptEditId);
          return data.SRNO.toString() == this.receiptEditId.toString();
        });
        if (preitemIndex != -1) {
          receiptDetails.SRNO = this.receiptEditId;
          this.receiptDetailsList[preitemIndex] = receiptDetails;
        }
        this.receiptDetailsList[this.receiptEditId - 1] = receiptDetails;
        this.receiptEditId = '';
      }

      // this.sumReceiptItem();
      this.sumTotalValues();

      if (type == 'Continue') {
        this.setTabByIndex(this.selectedTabIndex, null);
        // recpCtrl.receiptItems = receiptDetails;
        // recpCtrl.receiptItemsChanged.value = !recpCtrl.receiptItemsChanged.value;

        // //  recpCtrl.receiptTotalNetAmt;
        // // recpCtrl.balanceAmount;
        // if (recpCtrl.balanceAmount == null) {
        //   netTotalAmount = recpCtrl.receiptTotalNetAmt.toString();
        //   receiptAmtFC.text = recpCtrl.receiptTotalNetAmt.toString();
        //   receiptAmtLC.text = recpCtrl.receiptTotalNetAmt.toString();
        // } else {
        //   netTotalAmount = recpCtrl.balanceAmount.toString();
        //   receiptAmtFC.text = recpCtrl.balanceAmount.toString();
        //   receiptAmtLC.text = recpCtrl.balanceAmount.toString();
        // }
      } else {
        this.modalReference.close();
      }
      this.selectedTabIndex = 0;
      // } else {
      //   this.snackBar.open('Please Fill Valid Amount');
      // }

    } else {
      this.snackBar.open('Please Fill All Fields', 'OK');
    }

  }
  close(data: any = null) {
    this.modalService.dismissAll(data);
  }
  removePayments(index: any) {
    this.openDialog('Warning', 'Are you sure want to remove this record?', false, true);
    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data != 'No') {
        this.receiptDetailsList.splice(index, 1);
        this.sumTotalValues();
      }
    });

  }

  customizeWeight(data: any) {
    console.log(data);
    return 'Wt: ' + data['value'];
    // return 'Total Wt: ' + data['value'];
  }
  customizeQty(data: any) {
    console.log(data);
    return 'Qty: ' + data['value'];
    // return 'Total Qty: ' + data['value'];
  }
  customizeDate(data: any) {
    // return "First: " + new DatePipe("en-US").transform(data.value, 'MMM dd, yyyy');
  }

  open(content: any, salesReturnEdit = false, receiptItemData = null, custForm = false) {
    this.lineItemModalForSalesReturn = false;
    this.updateBtn = false;
    if (!this.viewOnly && !this.editOnly) {
      this.salesReturnsItems_forVoc = [];
      // this.salesReturnEditCode = '';
      // this.salesReturnEditAmt = '';
    }
    // if (this.sales_returns_items.length == 0) {
    //   this.salesReturnsItems_forVoc = [];
    // }
    if (!salesReturnEdit) {
      this.salesReturnsItems_forVoc = [];
      this.salesReturnEditCode = '';
      this.salesReturnEditAmt = 0;
    } else {
    }
    this.salesReturnForm.reset();
    this.lineItemForm.reset();
    this.exchangeForm.reset();
    this.divisionMS = '';
    this.sales_returns_total_amt = 0;

    this.modalReference = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
    });
    if (this.modalService.hasOpenModals()) {
      if (
        content._declarationTContainer.localNames[0] ==
        'more_customer_detail_modal'
      ) {
        this.customerDetailForm.controls.fcn_cust_detail_phone.setValue(
          this.customerDataForm.value.fcn_customer_mobile
        );
        this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
          this.customerDataForm.value.fcn_customer_name
        );
        this.customerDetailForm.controls.fcn_cust_detail_idcard.setValue(
          this.customerDataForm.value.fcn_customer_id_number
        );
        this.customerDetailForm.controls.fcn_cust_detail_idType.setValue(
          this.customerDataForm.value.fcn_customer_id_type
        );
        this.customerDetailForm.controls.fcn_customer_exp_date.setValue(
          this.customerDataForm.value.fcn_customer_exp_date
        );
        setTimeout(() => {
          if (custForm == true)
            this.renderer.selectRootElement('#fcn_customer_detail_name')?.focus();
          else
            this.renderer.selectRootElement('#fcn_cust_detail_phone')?.focus();
        }, 100);
      }
      if (content._declarationTContainer.localNames[0] == 'oldgoldmodal')
        setTimeout(() => {
          this.renderer.selectRootElement('#fcn_exchange_item_code')?.focus();
        }, 100);
      if (content._declarationTContainer.localNames[0] == 'mymodal')
        setTimeout(() => {
          this.renderer.selectRootElement('#fcn_li_item_code')?.focus();
        }, 100);
      if (
        content._declarationTContainer.localNames[0] ==
        'adjust_sale_return_modal'
      )
        setTimeout(() => {
          this.renderer.selectRootElement('#fcn_returns_fin_year')?.focus();
        }, 100);
      if (
        content._declarationTContainer.localNames[0] ==
        'sales_payment_modal'
      ) {

        // this.setReceiptVal();
        if (receiptItemData == null) {
          this.selectedTabIndex = 0;
        }
        setTimeout(() => {
          this.setTabByIndex(this.selectedTabIndex, receiptItemData);
        }, 100);
        // setTimeout(() => {
        //   this.renderer.selectRootElement('#fcn_returns_fin_year')?.focus();
        // }, 100);
      }
    }
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
        this.salesReturnEditId = '';
        this.orderedItemEditId = '';
        this.exchangeItemEditId = '';
      },
      (reason: any) => {
        this.salesReturnEditId = '';
        this.orderedItemEditId = '';
        this.exchangeItemEditId = '';
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    this.li_division_val = '';
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
  }

  removeExchangeItemGrid(event: any) {
    console.log('remove row');
    this.exchange_items = this.exchange_items.filter(
      (data) => data.sn_no != event.data.sn_no
    );
    this.currentExchangeMetalPurchase =
      this.currentExchangeMetalPurchase.filter(
        (data) => data.SRNO != event.data.sn_no
      );
    this.setMetalPurchaseDataPost();

    // this.currentExchangeMetalPurchase.splice(event.data.sn_no, 1);
    // this.exchange_items.splice(event.data.sn_no, 1);
    this.sumTotalValues();
  }
  removeLineItemsGrid(event: any) {
    console.log('remove row');
    console.log('====================================');
    console.log(event);
    console.log('====================================');

    // this.ordered_items.splice(event.data.ID, 1);
    // this.currentLineItems.splice(event.data.ID, 1);
    this.ordered_items = this.ordered_items.filter(
      (data) => data.SRNO != event.data.sn_no
    );
    this.currentLineItems = this.currentLineItems.filter(
      (data: any) => data.SRNO != event.data.sn_no
    );
    if (this.comFunc.posKARATRATECHANGE.toString() == '0') {
      this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
    } else {
      if (this.ordered_items.length == 0)
        this.comFunc.formControlSetReadOnlyByClass('karat_code', false);
    }


    // this.ordered_items.splice((event.data.ID - 1), 1);
    // this.currentLineItems.splice((event.data.ID - 1), 1);
    // this.order_items_slno_length = this.ordered_items.length;
    this.sumTotalValues();

    this.setRetailSalesDataPost();
  }
  removeSalesReturnGrid(event: any) {
    // this.currentsalesReturnItems.splice(event.data.sn_no, 1);
    // this.sales_returns_items.splice(event.data.sn_no, 1);

    console.log('==============removeSalesReturnGrid======================');
    console.log(event.data);
    console.log(this.sales_returns_items);
    console.log(this.currentsalesReturnItems);
    console.log('====================================');

    this.sales_returns_items = this.sales_returns_items.filter(
      (data: any) => data.SRNO != event.data.sn_no
    );
    this.sales_returns_pre_items = this.sales_returns_pre_items.filter(
      (data: any) => data.SRNO != event.data.sn_no
    );
    this.currentsalesReturnItems = this.currentsalesReturnItems.filter(
      (data: any) => data.SRNO != event.data.sn_no
    );

    this.sales_returns_total_amt = this.sales_returns_items.reduce(
      (preVal: any, curVal: any) => parseFloat(preVal) + parseFloat(curVal.total_amount),
      0
    );

    console.log('==============removeSalesReturnGrid======================');
    console.log(event.data);
    console.log(this.sales_returns_items);
    console.log(this.currentsalesReturnItems);
    console.log('====================================');
    // this.currentsalesReturnItems.splice((event.data.sn_no - 1), 1);
    // this.sales_returns_items.splice((event.data.sn_no - 1), 1);
    this.sumTotalValues();
    this.setSalesReturnDetailsPostData();
  }

  editTable(event: any) {
    console.log(event);
    // console.log(event.component);
    // console.log(event.component.state());
    console.log(event.data);
    console.log(event.settings);
    this.orderedItemEditId = event.data.sn_no;
    event.cancel = true;
    //   event.settings.CommandButtonInitialize = (sender, e) =>
    //  {
    //      if ((e.ButtonType == event.settings.ColumnCommandButtonType.Update) || (e.ButtonType == event.settings.ColumnCommandButtonType.Cancel))
    //      {
    //          e.Visible = false;
    //      }
    //  };
    const value: any = this.currentLineItems.filter(
      (data: any) => data.SRNO == event.data.sn_no
    )[0];
    console.log(
      '===============editTable==currentLineItems==================='
    );
    console.log(value);
    console.log('====================================');
    event.component.refresh();

    // console.log(this.ordered_items);
    // console.log(this.newLineItem);
    // let alldata = [];
    // alldata.push(this.newLineItem)
    // console.log(alldata);

    // let result = alldata.filter((data)=>{ data.ID == event.data.ID})
    // console.log(result);
    console.log(this.li_item_code_val);

    // document.getElementsByClassName('dx-link-save')['style'].display = 'none';
    // var res = $('.dx-link dx-link-save').attr('display', 'none');
    // console.log(res);

    // $('.dx-link-save').hide();

    // console.log(event.target.value)
    this.open(this.mymodal);

    this.updateBtn = true;

    this.newLineItem = value;
    this.newLineItem.STOCK_CODE = value.STOCK_CODE;
    this.newLineItem.DIVISION = value.DIVISION_CODE;
    this.newLineItem.HSN_CODE = value.HSNCODE;
    this.newLineItem.GST_CODE = value.VATCODE;
    this.newLineItem.MAIN_STOCK_CODE = value.MainStockCode;
    this.newLineItem.STOCK_COST = value.StkTranMkgCost;
    // this.divisionMS = value.divisionMS;
    this.lineItemForm.controls.fcn_li_item_code.setValue(value.STOCK_CODE);
    this.lineItemForm.controls.fcn_li_item_desc.setValue(value.STOCK_DOCDESC);
    this.lineItemForm.controls.fcn_li_division.setValue(value.DIVISION_CODE);
    this.lineItemForm.controls.fcn_li_location.setValue(value.LOCTYPE_CODE);
    this.lineItemForm.controls.fcn_li_pcs.setValue(value.PCS);
    this.lineItemForm.controls.fcn_li_gross_wt.setValue(value.GROSSWT);
    this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);
    this.lineItemForm.controls.fcn_li_net_wt.setValue(value.NETWT);
    this.lineItemForm.controls.fcn_li_rate.setValue(value.MKG_RATEFC);
    this.lineItemForm.controls.fcn_li_total_amount.setValue(value.MKGVALUEFC);
    this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
      value.DISCOUNT
    );
    this.lineItemForm.controls.fcn_li_discount_amount.setValue(
      value.DISCOUNTVALUEFC
    );
    this.lineItemForm.controls.fcn_li_gross_amount.setValue(
      value.NETVALUEFC
    );
    // this.lineItemForm.controls.fcn_li_gross_amount.setValue(value.GROSS_AMT);
    this.lineItemForm.controls.fcn_li_tax_percentage.setValue(value.VAT_PER);
    this.lineItemForm.controls.fcn_li_tax_amount.setValue(value.VAT_AMOUNTFC);
    // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.NETVALUEFC);
    this.lineItemForm.controls.fcn_li_net_amount.setValue(value.TOTALWITHVATFC);
    this.lineItemForm.controls.fcn_li_purity.setValue(value.PURITY);
    this.lineItemForm.controls.fcn_li_pure_wt.setValue(value.PUREWT);
    this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);

    this.lineItemForm.controls.fcn_ad_amount.setValue(
      // value.TOTALWITHVATFC
      value.MkgMtlNetRate
    );
    this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
    this.lineItemForm.controls.fcn_ad_rate.setValue(value.MkgMtlNetRate);
    this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TAGLINES);
    // this.lineItemForm.controls.fcn_ad_making_rate.setValue(value.PUREWT);
    // this.lineItemForm.controls.fcn_ad_making_amount.setValue(value.PUREWT);
    this.lineItemForm.controls.fcn_ad_stone_rate.setValue(value.STONE_RATEFC);
    this.lineItemForm.controls.fcn_ad_stone_amount.setValue(value.STONEVALUEFC);
    this.lineItemForm.controls.fcn_ad_metal_rate.setValue(value.METAL_RATE);
    this.lineItemForm.controls.fcn_ad_metal_amount.setValue(value.METALVALUEFC);

    if (this.editOnly || this.viewOnly) {
      const divisionMS = this.comFunc.getDivisionMS(value.DIVISION_CODE);
      // this.currentLineItems.divisionMS = divisionMS;
      this.divisionMS = divisionMS;
    } else {
      this.divisionMS = value.DIVISIONMS;
    }
    this.managePcsGrossWt();
    if (!this.viewOnly) {
      // this.currentLineItems.splice((value.SRNO - 1), 1);
      // this.ordered_items.splice((value.SRNO - 1), 1);
    }

    // this.manageCalculations();
    // this.sumTotalValues();
    // this.li_division_val = '';
    // this.li_item_desc_val = '';
    // this.li_location_val = '';
    // this.li_gross_wt_val = '';
    // this.li_stone_wt_val = '';
    // this.li_net_wt_val = '';
    // this.li_making_rate_val = '';
    // this.li_making_amount_val = '';
    // this.li_stone_rate_val = '';
    // this.li_stone_amount_val = '';
    // this.li_metal_rate_val = '';
    // this.li_metal_amount_val = '';
    // this.li_rate_val = '';
    // this.li_total_val = '';
    // this.li_discount_percentage_val = '';
    // this.li_discount_amount_val = '';
    // this.li_gross_amount_val = '';
    // this.li_tax_percentage_val = '';
    // this.li_tax_amount_val = '';
    // this.li_net_amount_val = '';
    // this.li_tag_val = '';

    /* this.updateBtn = true;

    if(this.showDivisionModal){
    this.getSno = event.data['sNo'];
    this.dataForm.controls['mkg_amt'].setValue(event.data['MkgAmount']);
    this.dataForm.controls['net_amt'].setValue(event.data['TotalAmount']);
    this.dataForm.controls['pcs'].setValue(event.data['Qty']);
    this.dataForm.controls['net_wt'].setValue(event.data['Weight']);
    }else{
      this.getSno = event.data['sNo'];
      this.divisionForm.controls['mkg_amt'].setValue(event.data['MkgAmount']);
      this.divisionForm.controls['net_amt'].setValue(event.data['TotalAmount']);
      this.divisionForm.controls['pcs'].setValue(event.data['Qty']);
      this.divisionForm.controls['net_wt'].setValue(event.data['Weight']);
    } */
    // console.log(event.target.value)
    // this.li_item_code_val = this.lineItemForm.value.fcn_li_item_code;
    // // this.li_item_code_val = this.lineItemForm.value.fcn_li_item_code
    // this.lineItemForm.controls['fcn_li_item_code'].setValue(
    //   this.li_item_code_val
    // );

    // let events = {
    //   target: { value: this.lineItemForm.value.fcn_li_item_code },
    // };
    // console.log(events);

    // this.getStockDesc(events);
  }
  editTableSalesReturn(event: any) {
    this.salesReturnEditId = event.data.ID;
    event.cancel = true;
    const value: any = this.currentsalesReturnItems.filter(
      (data: any) => data.SRNO == event.data.sn_no
    )[0];
    console.log(
      '===============editTable==currentsalesReturnItems==================='
    );
    console.log(this.currentsalesReturnItems);
    console.log(value);
    console.log('====================================');
    event.component.refresh();

    this.open(this.adjust_sale_return_modal);

    // this.updateBtn = true;

    // alert(value.DT_VOCNO);
    this.open(this.adjust_sale_return_modal, true);

    const data = this.retailSReturnDataPost.SALESREFERENCE.split('-');
    this.salesReturnForm.controls.fcn_returns_fin_year.setValue(
      data[3]
      // value.DT_YEARMONTH
    );
    this.salesReturnForm.controls.fcn_returns_branch.setValue(
      // value.DT_BRANCH_CODE
      data[0]
    );
    this.salesReturnForm.controls.fcn_returns_voc_type.setValue(
      // value.DT_VOCTYPE
      data[1]
    );
    this.salesReturnForm.controls.fcn_returns_voc_no.setValue(data[2]);
    // this.salesReturnForm.controls.fcn_returns_voc_no.setValue(value.PONO);
    // this.salesReturnForm.controls.fcn_returns_voc_no.setValue(value.DT_VOCNO);
    this.searchVocNoSalRet();

    // const data = [
    //   {
    //     DIVISION_CODE: value.DIVISION_CODE,
    //     STOCK_CODE: value.STOCK_CODE,
    //     STOCK_DOCDESC: value.STOCK_DOCDESC,
    //     GROSSWT: value.GROSSWT,
    //     NETVALUEFC: value.NETVALUEFC,
    //     // additional values
    //     PCS: value.PCS,
    //     NETWT: value.NETWT,
    //     PURITY: value.PURITY,
    //     PUREWT: value.PUREWT,
    //     CHARGABLEWT: value.CHARGABLEWT,
    //     MKG_RATEFC: value.MKG_RATEFC,
    //     MKG_RATECC: value.MKG_RATECC,
    //     MKGVALUEFC: value.MKGVALUEFC,
    //     MKGVALUECC: value.MKGVALUECC,
    //     RATE_TYPE: value.RATE_TYPE || '',
    //     METAL_RATE: value.METAL_RATE,
    //     METAL_RATE_GMSFC: value.METAL_RATE_GMSFC,
    //     METAL_RATE_GMSCC: value.METAL_RATE_GMSCC,
    //     METALVALUEFC: value.METALVALUEFC,
    //     METALVALUECC: value.METALVALUECC,
    //     STONE_RATEFC: value.STONE_RATEFC,
    //     STONE_RATECC: value.STONE_RATECC,
    //     STONEVALUEFC: value.STONEVALUEFC,
    //     STONEVALUECC: value.STONEVALUECC,
    //     NETVALUECC: value.NETVALUECC,
    //     TOTALWITHVATFC: value?.TOTALWITHVATFC || 0,
    //     TOTALWITHVATLC: value?.TOTALWITHVATFC || 0,
    //   },
    // ];
    // this.salesReturnsItems_forVoc = data;
    // this.sales_returns_total_amt = value.TOTALWITHVATFC;
    // this.salesReturnEditCode = value.STOCK_CODE;
    // this.salesReturnEditAmt = value.TOTALWITHVATFC;

    // this.searchVocNoSalRet();
  }

  editTableExchangeItem(event: any) {
    this.exchangeItemEditId = event.data.sn_no;
    event.cancel = true;
    const value: any = this.currentExchangeMetalPurchase.filter(
      (data) => data.SRNO == event.data.sn_no
    )[0];
    console.log(
      '===============editTable==currentExchangeMetalPurchase==================='
    );
    console.log(value);
    console.log('====================================');
    event.component.refresh();

    this.open(this.oldgoldmodal);

    this.exchangeForm.controls.fcn_exchange_item_code.setValue(
      value.STOCK_CODE
    );
    // comment
    // this.getStockforExchange();
    // this.updateBtn = true;

    // alert(value.DT_VOCNO);
    this.exchangeForm.controls.fcn_exchange_pcs.setValue(value.PCS);
    this.exchangeForm.controls.fcn_exchange_gross_wt.setValue(value.GROSSWT);
    this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(value.STONEWT);
    this.exchangeForm.controls.fcn_exchange_net_wt.setValue(value.NETWT);
    this.exchangeForm.controls.fcn_exchange_purity.setValue(value.PURITY);
    this.exchangeForm.controls.fcn_exchange_purity_diff.setValue(value.PUDIFF);
    this.exchangeForm.controls.fcn_exchange_metal_rate.setValue(
      value.METAL_RATE
    );
    this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
      value.METALVALUEFC
    );
    this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(value.PUREWT);
    this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(
      value.STONE_RATEFC
    );
    this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(
      value.STONEVALUEFC
    );
    this.exchangeForm.controls.fcn_exchange_making_rate.setValue(
      value.MKG_RATEFC
    );
    this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
      value.MKGVALUEFC
    );
    this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
      value.NETVALUEFC
    );
    this.exchangeForm.controls.fcn_exchange_division.setValue(
      value.DIVISION_CODE
    );
    this.exchangeForm.controls.fcn_exchange_item_desc.setValue(
      value.STOCK_DOCDESC
    );
    this.exchangeForm.controls.fcn_exchange_chargeable_wt.setValue(
      value.CHARGABLEWT
    );
    // for jawahara
    this.exchangeForm.controls.fcn_exchange_scrap_bag_no.setValue(
      value.BAGNO
    );
    this.exchangeForm.controls.fcn_exchange_scrap_bag_desc.setValue(
      value.BAGREMARKS
    );
    this.exchangeForm.controls.fcn_exchange_location.setValue(
      value.LOCTYPE_CODE
    );
    this.exchangeForm.controls.fcn_exchange_jawahara.setValue(
      value.JAWAHARAYN.toString()
    );
    this.exchangeForm.controls.fcn_exchange_resale_recycle.setValue(
      value.RESALERECYCLE.toString()
    );
    this.exchangeForm.controls.fcn_exchange_cash_exchange.setValue(
      value.CASHEXCHANGE.toString()
    );

    this._exchangeItemchange.METAL_RATE_TYPE = value.RATE_TYPE;
    this._exchangeItemchange.METAL_RATE = value.METAL_RATE;
    this._exchangeItemchange.METAL_RATE_PERGMS_ITEMKARAT =
      value.METAL_RATE_PERGMS_ITEMKARAT;

    this.exchangeFormMetalRateType = value.RATE_TYPE;
    // this.sales_returns_items_slno_length = 1;
    // this.sales_returns_total_amt = value.NETVALUEFC;
    // this.salesReturnEditCode = value.STOCK_CODE;
    // this.salesReturnEditAmt = value.NETVALUEFC;
    // this.searchVocNoSalRet();
  }
  getSalesPersonMaster() {
    this.suntechApi.getDynamicAPI('SalesPersonMaster/GetSalespersonMasterList')
      .subscribe((resp: any) => {
        var data = resp.response;
        this.salesPersonOptions = data;

        const salesPerson = this.salesPersonOptions.filter(data => data['SALESPERSON_CODE'].toString().toLowerCase() == this.strUser.toString().toLowerCase());
        if (salesPerson.length > 0)
          this.vocDataForm.controls.sales_person.setValue(salesPerson[0]['SALESPERSON_CODE']);

        this.salesPersonFilteredOptions =
          this.vocDataForm.controls.sales_person.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterSalesPerson(value))
          );

      });
  }

  customerSave() {
    if (!this.isCustProcessing) {
      this.isCustProcessing = true;


      this.customerDetails.MOBILE =
        this.customerDetailForm.value.fcn_cust_detail_phone;
      this.customerDetails.EMAIL =
        this.customerDetailForm.value.fcn_cust_detail_email;
      this.customerDetails.ADDRESS =
        this.customerDetailForm.value.fcn_cust_detail_address;
      this.customerDetails.COUNTRY_CODE =
        this.customerDetailForm.value.fcn_cust_detail_country;
      this.customerDetails.CITY =
        this.customerDetailForm.value.fcn_cust_detail_city;
      this.customerDetails.STATE =
        this.customerDetailForm.value.fcn_cust_detail_state;
      this.customerDetails.NATIONAL_IDENTIFICATION_NO =
        this.customerDetailForm.value.fcn_cust_detail_idcard;

      this.customerDataForm.controls.fcn_customer_id_number.setValue(
        this.customerDetailForm.value.fcn_cust_detail_idcard
      );
      this.customerDetails.NAME =
        this.customerDetailForm.value.fcn_customer_detail_name;
      this.customerDataForm.controls.fcn_customer_name.setValue(
        this.customerDetailForm.value.fcn_customer_detail_name
      );
      this.customerDetails.FIRSTNAME =
        this.customerDetailForm.value.fcn_customer_detail_fname;
      this.customerDetails.MIDDLENAME =
        this.customerDetailForm.value.fcn_customer_detail_mname;
      this.customerDetails.LASTNAME =
        this.customerDetailForm.value.fcn_customer_detail_lname;
      this.customerDetails.MOBILE =
        this.customerDetailForm.value.fcn_cust_detail_phone;
      this.customerDataForm.controls.fcn_customer_mobile.setValue(
        this.customerDetailForm.value.fcn_cust_detail_phone
      );

      this.customerDetails.IDCATEGORY =
        // this.customerDetails.CUST_TYPE =
        this.customerDetailForm.value.fcn_cust_detail_idType;
      this.customerDataForm.controls.fcn_customer_id_type.setValue(
        this.customerDetailForm.value.fcn_cust_detail_idType
      );

      this.customerDetails.CODE =
        this.customerDataForm.value.fcn_customer_code;

      // this.modalService.
      // if (this.amlNameValidation) {

      // trigger form errors
      Object.values(this.customerDetailForm.controls).forEach(control => {
        control.markAsTouched();
      });


      if (this.posIdNoCompulsory && (this.customerDetailForm.value.fcn_customer_exp_date < this.currentDate)) {
        this.isCustProcessing = false;
        this.snackBar.open('Invalid Expiry Date', 'OK');
        return;
      }

      if (!this.customerDetailForm.invalid) {

        const posCustomer = {
          CODE: this.customerDataForm.value.fcn_customer_code || '0',
          // CODE: this.customerDetails?.CODE || '0',
          NAME: this.customerDataForm.value.fcn_customer_name || '',
          COMPANY: this.customerDetailForm.value.fcn_cust_detail_company
            // || this.customerDetails?.COMPANY
            || '',
          ADDRESS:
            this.customerDetailForm.value.fcn_cust_detail_address ||
            // this.customerDetails?.ADDRESS ||
            '',
          POBOX_NO: this.customerDetails?.POBOX_NO || '',
          STATE: this.customerDetailForm.value.fcn_cust_detail_state
            // || this.customerDetails?.STATE
            || '',
          CITY:
            this.customerDetailForm.value.fcn_cust_detail_city ||
            // this.customerDetails?.CITY ||
            '',
          ZIPCODE: this.customerDetails?.ZIPCODE || '',
          COUNTRY_CODE:
            this.customerDetailForm.value.fcn_cust_detail_country ||
            // this.customerDetails?.COUNTRY_CODE ||
            '',
          EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
          TEL1: this.customerDetails?.TEL1 || '',
          TEL2:
            // this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            this.customerDetails?.TEL2 ||
            '',
          MOBILE: `${this.customerDataForm.value.fcn_customer_mobile}` || '',
          FAX: this.customerDetails?.FAX || '',
          MARITAL_ST:
            this.customerDetailForm.value.fcn_cust_detail_marital_status ||
            // this.customerDetails?.MARITAL_ST ||
            'Unknown',
          WED_DATE: this.customerDetails?.WED_DATE || this.dummyDate,
          SPOUSE_NAME: this.customerDetails?.SPOUSE_NAME || '',
          REMARKS: this.customerDetails?.REMARKS || '',
          DATE_OF_BIRTH:
            this.customerDetailForm.value.fcn_cust_detail_dob ||
            // this.customerDetails?.DATE_OF_BIRTH ||
            this.dummyDate,

          OPENING_ON: this.customerDetails?.OPENING_ON || new Date(),
          GENDER:
            this.customerDetailForm.value.fcn_cust_detail_gender ||
            // this.customerDetails?.GENDER ||
            '',
          REGION: this.customerDetails?.REGION || '',
          NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
            //  || this.customerDetails?.NATIONALITY
            || '',
          RELIGION: this.customerDetails?.RELIGION || '',
          TYPE: this.customerDetails?.TYPE || '',
          CATEGORY: this.customerDetails?.CATEGORY || '',
          INCOME: this.customerDetails?.INCOME || 0,
          CUST_STATUS: this.customerDetails?.CUST_STATUS || '',
          MID: this.customerDetails?.MID || 0,
          PICTURE_NAME: this.customerDetails?.PICTURE_NAME || '',
          PICTURE: this.customerDetails?.PICTURE || '',
          SALVOCTYPE_NO: this.customerDetails?.SALVOCTYPE_NO || '',
          SALDATE: this.customerDetails?.SALDATE || this.dummyDate,
          SALAMOUNT: this.customerDetails?.SALAMOUNT || 0,
          SALBRLOC: this.customerDetails?.SALBRLOC || '',
          Branch_Code: this.customerDetails?.Branch_Code || '',
          TOTALSALES: this.customerDetails?.TOTALSALES || 0,
          POSCUSTIDNO:
            this.customerDataForm.value.fcn_customer_id_number ||
            // this.customerDetails?.POSCUSTIDNO ||
            '',
          POSSMAN: this.customerDetails?.POSSMAN || '',
          POSCustPrefix: this.customerDetails?.POSCustPrefix || '0',
          MOBILE1: this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            //  this.customerDetails?.MOBILE1 ||
            '',
          CUST_Language: this.customerDetails?.CUST_Language || '',
          CUST_TYPE:
            // this.customerDataForm.value.fcn_customer_id_type ||
            // this.customerDetails?.CUST_TYPE ||
            '',
          //  ( this.customerDetails?.CUST_Type == ''
          //     ? this.customerDataForm.value.fcn_customer_id_type
          //     : this.customerDetails?.CUST_Type || ''),
          FAVORITE_CELEB: this.customerDetails?.FAVORITE_CELEB || '',
          STAFF_COURTESY: this.customerDetails?.STAFF_COURTESY || '',
          PRODUCT_KNOWLEDGE: this.customerDetails?.PRODUCT_KNOWLEDGE || ' ',
          LOCATION_AMBIENCE: this.customerDetails?.LOCATION_AMBIENCE || '',
          VARIETY_QUALITY: this.customerDetails?.VARIETY_QUALITY || '',
          OVERALL_EXP: this.customerDetails?.OVERALL_EXP || '',
          PRODUCT_SELECTION: this.customerDetails?.PRODUCT_SELECTION || '',
          SERVICE: this.customerDetails?.SERVICE || '',
          MAKING_CHARGES: this.customerDetails?.MAKING_CHARGES || '',
          BRAND_NAME: this.customerDetails?.BRAND_NAME || '',
          BUY_BACK: this.customerDetails?.BUY_BACK || '',
          LOCATION_PARKING: this.customerDetails?.LOCATION_PARKING || '',
          SOURCE: this.customerDetails?.SOURCE || '',
          PREFERENCE_CONTACT: this.customerDetails?.PREFERENCE_CONTACT || '',
          // MOBILECODE1: this.customerDetails?.MOBILECODE1 || '',
          MOBILECODE1: this.customerDetailForm.value.fcn_mob_code.toString() || '',

          MOBILECODE2: this.customerDetails?.MOBILECODE2 || '',
          IDCATEGORY:
            this.customerDataForm.value.fcn_customer_id_type
            // || this.customerDetails?.IDCATEGORY
            || '',
          ADDRESS_OFFICIAL: this.customerDetails?.ADDRESS_OFFICIAL || '',
          ADDRESS_DELIVARY: this.customerDetails?.ADDRESS_DELIVARY || '',
          INTERESTED_IN: this.customerDetails?.INTERESTED_IN || '',
          BLOOD_GROUP: this.customerDetails?.BLOOD_GROUP || '',
          NO_OF_CHILDREN: this.customerDetails?.NO_OF_CHILDREN || 0,
          ZODIAC_SIGN: this.customerDetails?.ZODIAC_SIGN || '',
          DESIGNATION:
            this.customerDetailForm.value.fcn_cust_detail_designation
            // this.customerDetails?.DESIGNATION
            || '',
          LEVELFLAG: this.customerDetails?.LEVELFLAG || 0,
          INCOMERANGE: this.customerDetails?.INCOMERANGE || '',
          LAST_UPDATED_DATE:
            this.customerDetails?.LAST_UPDATED_DATE || this.dummyDate,
          TAXOFFICENO: this.customerDetails?.TAXOFFICENO || '',
          SALESMANNAME: this.customerDetails?.SALESMANNAME || '',
          DEFAULT_DISDIAMONDPERCENT:
            this.customerDetails?.DEFAULT_DISDIAMONDPERCENT,
          DEFAULT_DISMETALPERCENT:
            this.customerDetails?.DEFAULT_DISMETALPERCENT,
          LOYALTYALLOW: this.customerDetails?.LOYALTYALLOW || false,
          LOYALTYALLOWEMAIL: this.customerDetails?.LOYALTYALLOWEMAIL || false,
          LOYALTYALLOWSMS: this.customerDetails?.LOYALTYALLOWSMS || false,
          SENDPROMOTIONALEMAIL:
            this.customerDetails?.SENDPROMOTIONALEMAIL || false,
          LOYALTY_CODE: this.customerDetails?.LOYALTY_CODE || '',
          PREFERRED_COLOR: this.customerDetails?.PREFERRED_COLOR || '',
          PREFERRED_ITEM: this.customerDetails?.PREFERRED_ITEM || '',
          WRIST_SIZE: this.customerDetails?.WRIST_SIZE || '',
          FINGER_SIZE: this.customerDetails?.FINGER_SIZE || '',
          LOYALTY_POINT: this.customerDetails?.LOYALTY_POINT || 0,
          FIRSTNAME:
            this.customerDetailForm.value.fcn_customer_detail_fname ||
            // this.customerDetails?.FIRSTNAME ||
            '',
          MIDDLENAME:
            this.customerDetailForm.value.fcn_customer_detail_mname ||
            // this.customerDetails?.MIDDLENAME ||
            '',
          LASTNAME:
            this.customerDetailForm.value.fcn_customer_detail_lname ||
            // this.customerDetails?.LASTNAME ||
            '',
          POSKnownAbout: this.customerDetails?.POSKnownAbout || 0,
          CIVILID_IMGPATH: this.customerDetails?.CIVILID_IMGPATH || '',
          SUGGESTION: this.customerDetails?.SUGGESTION || '',
          AMLNAMEVALIDATION: this.customerDetails?.AMLNAMEVALIDATION || false,
          AML_TYPE: this.customerDetails?.AML_TYPE || false,
          UN_NUMBER: this.customerDetails?.UN_NUMBER || '',
          NAME_1: this.customerDetails?.NAME_1 || '',
          NAME_2: this.customerDetails?.NAME_2 || '',
          NAME_3: this.customerDetails?.NAME_3 || '',
          NAME_4: this.customerDetails?.NAME_4 || '',
          NAME_5: this.customerDetails?.NAME_5 || '',
          DOB_2: this.customerDetails?.DOB_2 || this.dummyDate,
          DOB_3: this.customerDetails?.DOB_3 || this.dummyDate,
          DOB_4: this.customerDetails?.DOB_4 || this.dummyDate,
          DOB_5: this.customerDetails?.DOB_5 || this.dummyDate,
          GOOD_QUALITY: this.customerDetails?.GOOD_QUALITY || '',
          LOW_QUALITY: this.customerDetails?.LOW_QUALITY || '',
          A_K_A: this.customerDetails?.A_K_A || '',
          F_K_A: this.customerDetails?.F_K_A || '',
          NATIONALITY_2: this.customerDetails?.NATIONALITY_2 || '',
          NATIONALITY_3: this.customerDetails?.NATIONALITY_3 || '',
          NATIONALITY_4: this.customerDetails?.NATIONALITY_4 || '',
          NATIONALITY_5: this.customerDetails?.NATIONALITY_5 || '',
          PASSPORT_NO_1: this.customerDetails?.PASSPORT_NO_1 || '',
          PASSPORT_NO_2: this.customerDetails?.PASSPORT_NO_2 || '',
          PASSPORT_NO_3: this.customerDetails?.PASSPORT_NO_3 || '',
          PASSPORT_NO_4: this.customerDetails?.PASSPORT_NO_4 || '',
          PASSPORT_NO_5: this.customerDetails?.PASSPORT_NO_5 || '',
          LISTED_ON_DATE:
            this.customerDetails?.LISTED_ON_DATE || this.dummyDate,
          NATIONAL_IDENTIFICATION_NO:
            this.customerDetailForm.value.fcn_cust_detail_idcard ||
            // this.customerDetails?.NATIONAL_IDENTIFICATION_NO ||
            '',
          OTHER_INFORMATION: this.customerDetails?.OTHER_INFORMATION || '',
          LINKS: this.customerDetails?.LINKS || '',
          FATHERNAME: this.customerDetails?.FATHERNAME || '',
          PROMO_NEEDED: this.customerDetails?.PROMO_NEEDED || '',
          PROMO_HOW_OFTEN: this.customerDetails?.PROMO_HOW_OFTEN || '',
          CHILDNAME1: this.customerDetails?.CHILDNAME1 || '',
          CHILDNAME2: this.customerDetails?.CHILDNAME2 || '',
          CHILDNAME3: this.customerDetails?.CHILDNAME3 || '',
          CHILDNAME4: this.customerDetails?.CHILDNAME4 || '',
          CHILDDATEOFBIRTH1:
            this.customerDetails?.CHILDDATEOFBIRTH1 || this.dummyDate,
          CHILDDATEOFBIRTH2:
            this.customerDetails?.CHILDDATEOFBIRTH2 || this.dummyDate,
          CHILDDATEOFBIRTH3:
            this.customerDetails?.CHILDDATEOFBIRTH3 || this.dummyDate,
          CHILDDATEOFBIRTH4:
            this.customerDetails?.CHILDDATEOFBIRTH4 || this.dummyDate,
          OTHERNAMES: this.customerDetails?.OTHERNAMES || '',
          AUTOCREATEMST: this.customerDetails?.AUTOCREATEMST || false,
          WUPMOBILECODE: this.customerDetails?.WUPMOBILECODE || '',
          WUPMOBILENO: this.customerDetails?.WUPMOBILENO || '',
          OCCUPATION:
            this.customerDetails?.OCCUPATION
            || '',
          ShowRoomAccessibility:
            this.customerDetails?.ShowRoomAccessibility || '',
          ProductRangeAvailability:
            this.customerDetails?.ProductRangeAvailability || '',
          DIGISCREENED: this.customerDetails?.DIGISCREENED || false,
          BR_CODE: this.customerDetails?.BR_CODE || '',
          SPOUSE_DATE_OF_BIRTH:
            this.customerDetails?.SPOUSE_DATE_OF_BIRTH || this.dummyDate,
          TEL_R_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.TEL_R_CODE
          )}`,
          TEL_O_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.TEL_O_CODE
          )}`,
          GST_NUMBER: `${this.comFunc.emptyToZero(
            this.customerDetails?.GST_NUMBER
          )}`,
          VAT_NUMBER: `${this.comFunc.emptyToZero(
            this.customerDetails?.VAT_NUMBER
          )}`,
          PARENT_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.PARENT_CODE
          )}`,
          REFERED_BY: `${this.comFunc.emptyToZero(
            this.customerDetails?.REFERED_BY
          )}`,
          CREDIT_LIMIT: this.customerDetails?.CREDIT_LIMIT || 0,
          CREDIT_LIMIT_STATUS:
            this.customerDetails?.CREDIT_LIMIT_STATUS || false,
          PANCARDNO: this.customerDetails?.PANCARDNO || '111111' || '',
          VOCTYPE: this.vocType || '',
          YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
          VOCNO: this.vocDataForm.value.fcn_voc_no || 0,
          VOCDATE: this.convertDateWithTimeZero(
            new Date(this.vocDataForm.value.vocdate).toISOString()
          ),
          // new values - poscustomer
          'OT_TRANSFER_TIME': this.customerDetails?.OT_TRANSFER_TIME || '',
          'COUNTRY_DESC': this.customerDetails?.COUNTRY_DESC || '',
          'STATE_DESC': this.customerDetails?.STATE_DESC || '',
          'CITY_DESC': this.customerDetails?.CITY_DESC || '',
          'FAVORITE_CELEB_DESC': this.customerDetails?.FAVORITE_CELEB_DESC || '',
          'RELIGION_DESC': this.customerDetails?.RELIGION_DESC || '',
          'CATEGORY_DESC': this.customerDetails?.CATEGORY_DESC || '',
          'CUST_STATUS_DESC': this.customerDetails?.CUST_STATUS_DESC || '',
          'NATIONALITY_DESC': this.customerDetails?.NATIONALITY_DESC || '',
          'TYPE_DESC': this.customerDetails?.TYPE_DESC || '',


          "BRANCH_CODE": this.strBranchcode || '',
          "DETAILS_JOHARA": this.customerDetails?.DETAILS_JOHARA || '',
          "DETAILS_FARAH": this.customerDetails?.DETAILS_FARAH || '',
          "DETAILS_JAWAHERALSHARQ": this.customerDetails?.DETAILS_JAWAHERALSHARQ || '',
          "FESTIVAL_EID": this.customerDetails?.FESTIVAL_EID || false,
          "FESTIVAL_CHRISTMAS": this.customerDetails?.FESTIVAL_CHRISTMAS || false,
          "FESTIVAL_DIWALI": this.customerDetails?.FESTIVAL_DIWALI || false,
          "FESTIVAL_NATIONALDAY": this.customerDetails?.FESTIVAL_NATIONALDAY || false,
          "FESTIVAL_ONAM": this.customerDetails?.FESTIVAL_ONAM || false,
          "FESTIVAL_PONGAL": this.customerDetails?.FESTIVAL_PONGAL || false,
          "FESTIVAL_NEWYEAR": this.customerDetails?.FESTIVAL_NEWYEAR || false,
          "REASON_OF_PURCHASE": this.customerDetails?.REASON_OF_PURCHASE || '',
          "AGE_GROUP": this.customerDetails?.AGE_GROUP || '',
          "GIFT_PURCHASED_FOR": this.customerDetails?.GIFT_PURCHASED_FOR || '',
          "PURCHASE_OCCASION": this.customerDetails?.PURCHASE_OCCASION || '',
          "NEXT_VISIT": this.customerDetails?.NEXT_VISIT || '',
          "SHOWROOMACCESSIBILITY": this.customerDetails?.SHOWROOMACCESSIBILITY || '',
          "PRODUCTRANGEAVAILABILITY": this.customerDetails?.PRODUCTRANGEAVAILABILITY || '',

          "LOOKING_FOR": this.customerDetails?.LOOKING_FOR || '',

          "POSCUSTIDEXP_DATE": this.customerDetailForm.value.fcn_customer_exp_date || this.dummyDate,

          // new fields added 27-12-2023
          "ATTACHMENT_FROM_SCANNER": true,
          "GOOD_QUALITY_A_K_A": "",
          "LOW_QUALITY_A_K_A": "",
          "POSKNOWNABOUT": 0
        };

        // const apiCtrl =
        //   posCustomer.CODE &&
        //     posCustomer.CODE != '' &&
        //     posCustomer.CODE.toString() != '0'
        //     ? `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`
        //     : 'PosCustomerMaster/InsertCustomerMaster';

        let apiCtrl;
        let method;
        let custResponse;
        if (
          posCustomer.CODE &&
          posCustomer.CODE !== '' &&
          posCustomer.CODE.toString() !== '0'
        ) {
          apiCtrl = `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`;
          custResponse = this.suntechApi.putDynamicAPI(apiCtrl, posCustomer)
        } else {
          apiCtrl = 'PosCustomerMaster/InsertCustomerMaster';
          custResponse = this.suntechApi.postDynamicAPI(apiCtrl, posCustomer)
        }


        custResponse.subscribe(async (data) => {

          this.isCustProcessing = false;

          if (data.status == 'Success') {
            this.customerDetails = await data.response;
            this.customerDataForm.controls['fcn_customer_name'].setValue(
              this.customerDetails.NAME
            );
            this.customerDataForm.controls['fcn_customer_id_type'].setValue(
              this.customerDetails.IDCATEGORY
              // this.customerDetails.CUST_TYPE
            );
            this.customerDataForm.controls['fcn_customer_id_number'].setValue(
              this.customerDetails.POSCUSTIDNO
            );
            this.inv_customer_name = this.customerDetails.NAME;
            this.inv_cust_mobile_no = this.customerDetails.MOBILE;
            this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
              this.customerDetails.MOBILE
            );
            this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
              this.customerDetails.EMAIL
            );
            this.customerDetailForm.controls[
              'fcn_cust_detail_address'
            ].setValue(this.customerDetails.ADDRESS);
            this.customerDetailForm.controls[
              'fcn_cust_detail_country'
            ].setValue(this.customerDetails.COUNTRY_CODE);
            this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
              this.customerDetails.CITY
            );
            this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
              this.customerDetails.NATIONAL_IDENTIFICATION_NO
            );
            // Customer data
            this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
              this.customerDetails.NAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
              this.customerDetails.FIRSTNAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
              this.customerDetails.MIDDLENAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
              this.customerDetails.LASTNAME
            );
            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              this.customerDetails.TEL2
            );
            this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
              this.customerDetails.GENDER
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
              this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
            );

            this.customerDataForm.controls.fcn_customer_code.setValue(
              this.customerDetails.CODE
            );

            // this.customerDetailForm.controls.fcn_customer_exp_date.setValue(
            //   this.customerDetails.POSCUSTIDEXP_DATE
            // );
            // this.customerDataForm.controls.fcn_customer_exp_date.setValue(
            //   this.customerDetails.POSCUSTIDEXP_DATE
            // );

            // this.snackBar.open('Customer details saved successfully');
            // this.snackBar.dismiss();
            this.snackBar.open('Customer details saved successfully', '', {
              duration: 1000 // time in milliseconds
            });

            // ${data.AMLDIGICOMPANYNAME}/${data.AMLDIGIUSERNAME}/${data.AMLDIGIPASSWORD}/${data.CODE}/${data.FIRSTNAME}/${data.MIDDLENAME}/${data.LASTNAME}/%27%27/${data.POSCustIDNo}/${data.NATIONALITY}/${data.DATE_OF_BIRTH}/${data.CUST_Type}/${data.AMLUSERID}/${data.AMLDIGITHRESHOLD}/${data.AMLDIGICOMPANYNAME}/1/${data.DIGIIPPATH}`);
            if (this.amlNameValidation && !this.customerDetails.DIGISCREENED) {
              this.isCustProcessing = true;

              // const custCodeWithAcCode =
              //   this.comFunc.allbranchMaster?.DIGICOMPACCODE &&
              //     this.comFunc.allbranchMaster?.DIGICOMPACCODE != ''
              //     ? `${this.comFunc.allbranchMaster?.DIGICOMPACCODE}/${this.customerDetails.CODE}`
              //     : this.customerDetails.CODE;


              const payload = {
                AMLDIGICOMPANYNAME: encodeURIComponent(
                  this.comFunc.allbranchMaster.AMLDIGICOMPANYNAME || ' '
                ),
                AMLDIGIUSERNAME: encodeURIComponent(
                  this.comFunc.allbranchMaster.AMLDIGIUSERNAME || ' '
                ),
                AMLDIGIPASSWORD: encodeURIComponent(
                  this.comFunc.allbranchMaster.AMLDIGIPASSWORD || ' '
                ),
                CODE: encodeURIComponent(this.customerDetails.CODE || ' '),
                FIRSTNAME:
                  ''
                // encodeURIComponent(this.customerDetails.FIRSTNAME)
                // || '%27%27'
                ,
                MIDDLENAME: ''
                // encodeURIComponent(this.customerDetails.MIDDLENAME)
                // || '%27%27'
                ,
                LASTNAME:
                  encodeURIComponent(
                    this.customerDetails.NAME //
                    // this.customerDetails.LASTNAME || ''
                  )
                  || ''
                ,
                NATIONALITY:
                  encodeURIComponent(this.customerDetails.NATIONALITY),
                // ||                '%27%27',
                // NATIONALITY:  encodeURIComponent(this.customerDetails.NATIONALITY || ' '),
                DATE_OF_BIRTH:
                  // this.comFunc.nullOrEmpty(

                  encodeURIComponent(
                    this.comFunc.convertDateToMDY(
                      this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
                    )
                  )
                ,
                // CUST_Type: this.comFunc.nullOrEmpty(
                //   encodeURIComponent(this.customerDetails.CUST_TYPE),
                //   '%27%27'),
                CUST_Type: encodeURIComponent('I'),

                // CUST_Type: encodeURIComponent(
                //   this.customerDetails.CUST_Type || ' '
                // ),
                AMLUSERID:
                  encodeURIComponent(this.comFunc.allbranchMaster.AMLUSERID)
                ,
                AMLDIGITHRESHOLD:
                  encodeURIComponent(
                    this.comFunc.allbranchMaster.AMLDIGITHRESHOLD
                  ) || '%27%27',
                DIGIIPPATH:
                  encodeURIComponent(this.comFunc.allbranchMaster.DIGIIPPATH) ||
                  '%27%27',
                Gender:
                  encodeURIComponent(this.customerDetails?.GENDER) ||
                  '%27%27',
                CustomerIdType:
                  encodeURIComponent(this.customerDetails?.IDCATEGORY) ||
                  '%27%27',
                CustomerIdNumber:
                  encodeURIComponent(this.customerDetails?.NATIONAL_IDENTIFICATION_NO) ||
                  '%27%27',
              };
              // this.snackBar.open('Loading...');

              // this.suntechApi.getAMLValidation(payload).subscribe(async (data) => {
              this.isCustProcessing = false;

              //   this.snackBar.open('Loading...');

              //   // data = JSON.parse(data);
              //   // console.log(data, typeof data);
              //   this.suntechApi
              //     .updateAMLDigiScreenValidation(
              //       this.customerDetails.CODE,
              //       true
              //     )
              //     .subscribe((resp) => {
              //       this.snackBar.dismiss();
              //       if (resp.status == "Success") {
              //         // this.customerDetails = resp.response;
              //         this.customerDetails.DIGISCREENED = resp.response != null ? resp.response?.DIGISCREENED : true;
              //       } else {
              //         this.snackBar.open('Digiscreen Failed');
              //       }

              //       console.log('====================================');
              //       console.log('resp', resp);
              //       console.log('====================================');
              //     });

              //   if (data.response.isMatched != null) {
              //     this.snackBar.dismiss();

              //     if (data.response.isMatched.toUpperCase() == 'YES') {
              //       // if (data.response == 'yes') {
              //       this.openDialog('Warning', 'We cannot proceed', true);
              //       this.dialogBox.afterClosed().subscribe((data) => {
              //         if (data == 'OK') {
              this.modalReference.close();
              //         }
              //       });
              //       // need to use put api
              //       this.amlNameValidationData = true;

              //       this.suntechApi
              //         .updateAMLNameValidation(this.customerDetails.CODE, true)
              //         .subscribe((resp) => {
              //           // this.customerDetails = resp.response;
              //           this.customerDetails.AMLNAMEVALIDATION =
              //             resp.response != null ? resp.response?.AMLNAMEVALIDATION : true;

              //           console.log('====================================');
              //           console.log('resp', resp);
              //           console.log('====================================');
              //         });
              //       // }
              //     } else {

              //       this.openDialog('Success', JSON.stringify(data.response), true);
              //       this.dialogBox.afterClosed().subscribe((data) => {
              //         if (data == 'OK') {
              //           this.modalReference.close();
              //         }
              //       });
              //       //proceed
              //       this.amlNameValidationData = false;
              //     }
              //   } else {
              //     this.openDialog('Warning', JSON.stringify(data.response), true);
              //     this.dialogBox.afterClosed().subscribe((data) => {
              //       if (data == 'OK') {
              //         this.modalReference.close();
              //       }
              //     });
              //     this.amlNameValidationData = true;

              //   }
              // });
            } else {
              this.isCustProcessing = false;

              this.modalReference.close();
            }
          } else {
            this.modalReference.close();
            this.customerDetails = {};
            this.snackBar.open(data.message, '', {
              duration: 2000 // time in milliseconds
            });
            this.modalReference.close();
          }
        });


      } else {
        this.isCustProcessing = false;
        alert(this.isCustProcessing);

        this.snackBar.open('Please Fill Required Fields', '', {
          duration: 2000 // time in milliseconds
        });
      }
    }
  }

  onCustomerNameFocus(value: any = null) {
    console.log(value);
    let _cust_mobile_no = value == null ? this.customerDataForm.value.fcn_customer_mobile : value;
    if (value != null) {
      this.customerDataForm.controls['fcn_customer_mobile'].setValue(
        value
      );
    }


    console.log('_cust_mobile_no ', _cust_mobile_no);
    if (_cust_mobile_no != '' && _cust_mobile_no != null) {

      let custMobile = `${this.customerDataForm.value.fcn_customer_mobile}`;

      // if (value == null) {
      this.customerDetails = {};
      this.customerDetailForm.reset();
      this.customerDataForm.reset({
        fcn_customer_mobile: custMobile,
      });
      this.customerDetailForm.reset({
        fcn_cust_detail_phone: custMobile,
      });
      // }
      this.suntechApi.getDynamicAPI('PosCustomerMaster/GetCustomerMaster/Mobile=' + _cust_mobile_no)
        .subscribe((resp) => {
          if (resp.status == 'Success') {
            // const result = resp[0];
            const result = resp.response;
            this.customerDataForm.controls['fcn_customer_name'].setValue(
              result.NAME
            );
            this.customerDataForm.controls['fcn_customer_id_type'].setValue(
              result.IDCATEGORY
              // result.CUST_TYPE
            );
            this.customerDataForm.controls['fcn_customer_id_number'].setValue(
              result.POSCUSTIDNO
            );
            this.inv_customer_name = result.NAME;
            this.inv_cust_mobile_no = _cust_mobile_no;

            this.customerDetailForm.controls.fcn_mob_code.setValue(
              result.MOBILECODE1
            );
            this.customerDataForm.controls.fcn_customer_code.setValue(
              result.CODE
            );

            this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
              result.MOBILE
            );
            this.customerDetailForm.controls['fcn_cust_detail_idType'].setValue(
              result.IDCATEGORY
              // result.CUST_TYPE
            );
            this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
              result.EMAIL
            );
            this.customerDetailForm.controls['fcn_cust_detail_address'].setValue(
              result.ADDRESS
            );
            this.customerDetailForm.controls['fcn_cust_detail_country'].setValue(
              result.COUNTRY_CODE
            );
            this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
              result.CITY
            );
            this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
              result.NATIONAL_IDENTIFICATION_NO
            );
            this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
              result.NAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
              result.FIRSTNAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
              result.MIDDLENAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
              result.LASTNAME
            );
            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              result.TEL2
            );
            this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
              result.GENDER
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              result.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              result.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
              this.dummyDateCheck(result.DATE_OF_BIRTH)
            );
            this.customerDetailForm.controls.fcn_cust_detail_designation.setValue(
              result.DESIGNATION
            );
            this.customerDetailForm.controls.fcn_cust_detail_company.setValue(
              result.COMPANY
            );
            this.customerDetailForm.controls.fcn_cust_detail_nationality.setValue(
              result.NATIONALITY
            );

            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              result.MOBILE1
            );

            this.customerDetailForm.controls.fcn_customer_exp_date.setValue(
              result.POSCUSTIDEXP_DATE
            );
            this.customerDataForm.controls.fcn_customer_exp_date.setValue(
              result.POSCUSTIDEXP_DATE
            );


            this.customerDetails = result;

            this.getUserAttachments();

            if (this.amlNameValidation)
              if (!result.AMLNAMEVALIDATION && result.DIGISCREENED) {
                this.amlNameValidationData = false;
              } else {
                this.amlNameValidationData = true;
                this.openDialog('Warning', 'Pending for approval', true);
              }
          } else {
            if (value == null) {
              this.openDialog('Warning', 'Need To Create Customer', true);
              this.dialogBox.afterClosed().subscribe((data: any) => {
                if (data == 'OK') {
                  this.open(this.more_customer_detail_modal, false, null, true);
                }
              });
            } else {
              this.renderer.selectRootElement('#fcn_customer_detail_name')?.focus();
            }

            this.amlNameValidationData = true;

            // this.customerDataForm.reset();

            // this.customerDetails = {};
            // this.customerDetailForm.reset();
            // let custMobile = `${this.customerDataForm.value.fcn_customer_mobile}`;
            // this.customerDataForm.reset({
            //   fcn_customer_mobile: custMobile,
            // });

          }
        });
    } else {
      this.amlNameValidationData = true;
      this.customerDetailForm.reset();
      this.customerDataForm.reset();
      this.customerDetails = {};
      this.inv_customer_name = '';
      this.customerDataForm.controls['fcn_customer_name'].setValue('');
      //alert('Enter valid mobile number');
    }

    this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;
    this.inv_cust_mobile_no = this.customerDataForm.value.fcn_customer_mobile;
    this.inv_sales_man = this.vocDataForm.value.sales_person;
    this.inv_bill_date = this.convertDate(this.vocDataForm.value.vocdate);
    this.inv_number = this.vocDataForm.value.fcn_voc_no;
  }


  getUserAttachments() {
    const custCode = this.customerDataForm.value.fcn_customer_code;

    this.snackBar.open('Loading...');
    // TransAttachments/GetTransAttachments
    let API = `TransAttachments/GetTransAttachments?VOCTYPE=${this.vocType}&CUSTOMER_CODE=${custCode}`
    // let API = `TransAttachments/GetTransAttachments?VOCTYPE=${this.vocType}&MID=${this.customerDetails?.MID}`
    // let API = `RetailSalesDataInDotnet/GetTransAttachmentMulti/${custCode}/${this.vocType}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        this.snackBar.dismiss();

        if (resp?.status.toString().trim() == 'Success') {
          this.transAttachmentList = resp.response;

          this.transAttachmentList.map(data => {

            const formData = new FormData();

            formData.append('VOCTYPE', data.VOCTYPE);
            formData.append('REFMID', data.REFMID);
            formData.append('ATTACHMENT_PATH', data.ATTACHMENT_PATH);
            formData.append('REMARKS', data.REMARKS || '');
            formData.append('EXPIRE_DATE', data.EXPIRE_DATE);
            formData.append('DOC_TYPE', data.DOC_TYPE);
            formData.append('VOCNO', data.VOCNO);
            formData.append('VOCDATE', data.VOCDATE);
            formData.append('ATTACH_TYPE', data.ATTACH_TYPE);
            formData.append('BRANCH_CODE', data.BRANCH_CODE);
            formData.append('YEARMONTH', data.YEARMONTH);
            formData.append('SUBLED_CODE', data.SUBLED_CODE);
            formData.append('DOC_ACTIVESTATUS', data.DOC_ACTIVESTATUS);
            formData.append('DOC_LASTRENEWBY', data.DOC_LASTRENEWBY);
            formData.append('DOC_NEXTRENEWDATE', data.DOC_NEXTRENEWDATE);
            formData.append('DOC_LASTRENEWDATE', data.DOC_LASTRENEWDATE);
            formData.append('DOCUMENT_DATE', data.DOCUMENT_DATE);
            formData.append('DOCUMENT_NO', data.DOCUMENT_NO);
            formData.append('FROM_KYC', data.FROM_KYC);

            this.transAttachmentListData.push(formData);

          });

        } else {
          this.transAttachmentList = [];
        }

      });

  }

  // private _filterSalesPerson(value: string): string[] {
  //     const filterValue = (value || '').toLowerCase();

  //   return this.salesPersonOptions.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }
  private _filterMasters(
    arrName: any,
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || '').toLowerCase();
    return arrName.filter(
      (option: any) =>
        option[optVal1].toLowerCase().includes(filterValue) ||
        option[optVal2].toLowerCase().includes(filterValue)
    );
  }

  private _filterSalesPerson(value: string): any[] {
    const filterValue = value.toLowerCase() || '';
    // console.log('SALESPERSON_CODE || DESCRIPTION : ' + value);
    return this.salesPersonOptions.filter(
      (option) =>
        option.SALESPERSON_CODE.toLowerCase().includes(filterValue) ||
        option.DESCRIPTION.toLowerCase().includes(filterValue)
    );
  }

  async getMasters() {

    const country = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('COUNTRY MASTER')}`;

    this.countryMaster = this.comFunc.countryMaster;
    this.countryMasterOptions =
      this.customerDetailForm.controls.fcn_cust_detail_country.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.countryMaster, value, 'CODE', 'DESCRIPTION')
        )
      );

    this.mobileCountryMaster = this.countryMaster.filter((data: any) => data.MOBILECOUNTRYCODE != '');
    this.mobileCountryMasterOptions =
      this.customerDetailForm.controls.fcn_mob_code.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.mobileCountryMaster, value, 'MOBILECOUNTRYCODE', 'DESCRIPTION')
        )
      );

    const city = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CITY MASTER')}`;
    //this.cityMaster = city;

    // this.cityMaster = this.comFunc.nationalityMaster;
    // this.cityMasterOptions =
    //   this.customerDetailForm.controls.fcn_cust_detail_city.valueChanges.pipe(
    //     startWith(''),
    //     map((value) =>
    //       this._filterMasters(this.cityMaster, value, 'CODE', 'DESCRIPTION')
    //     )
    //   );

    const nationality = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('NATIONALITY MASTER')}`;
    this.nationalityMaster = this.comFunc.nationalityMaster;
    this.nationalityMasterOptions =
      this.customerDetailForm.controls.fcn_cust_detail_nationality.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.nationalityMaster, value, 'CODE', 'DESCRIPTION')
        )
      );
  }
  async getIdMaster() {
    // const resp = this.comFunc.getMasterByID('ID MASTER');
    const resp = await this.comFunc.idMaster;
    console.log(this.comFunc.idMaster);
    var data = resp.map((t: any) => t.CODE);
    this.idTypeOptions = data;
    this.idTypeOptionList = resp;

    this.idTypeFilteredOptions =
      this.customerDataForm.controls.fcn_customer_id_type.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterIdType(value))
      );
    // this.suntechApi.getIdMasterList().subscribe((resp) => {
    //   console.log(resp);
    //   console.log(resp.Message);
    //   // this.all_sales_person = resp;
    //   var data = resp.map((t) => t.CODE);
    //   this.idTypeOptions = data;
    //   this.idTypeFilteredOptions =
    //     this.customerDataForm.controls.fcn_customer_id_type.valueChanges.pipe(
    //       startWith(''),
    //       map((value) => this._filterIdType(value))
    //     );
    // });
  }

  private _filterIdType(value: string): string[] {
    value = value != null ? value.toString().toLowerCase() : '';
    const filterValue = value;
    // const filterValue = value.toString().toLowerCase() || '';

    return this.idTypeOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  getExchangeStockCodes() {
    let API = `RetailsalesExchangeLookup?BRANCH_CODE=${this.strBranchcode}&STOCK_CODE=`
    this.suntechApi
      .getDynamicAPI(this.strBranchcode)
      .subscribe((resp) => {
        console.log(resp);
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

  getCreditCardList() {
    let userBranch = localStorage.getItem('userbranch');
    this.suntechApi.getDynamicAPI('CreditCardMaster/getPaymentButtons').subscribe((resp) => {
      // let _resp = resp.Result;
      this.receiptModesList = resp.paymentButtons;
      this.receiptModesTypes = resp.creditCardMaster;
      let _resp = resp.creditCardMaster;
      let recModeCash;
      let recModeCC;
      let recModeOthers;
      let recModeAdvance;
      let recModeGift;
      console.log(_resp);

      recModeCash = _resp.filter(function (value: any) {
        return (
          value.MODE == 0 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });

      recModeCC = _resp.filter(function (value: any) {
        return (
          value.MODE == 1 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });

      recModeOthers = _resp.filter(function (value: any) {
        return (
          value.MODE == 2 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });

      recModeAdvance = _resp.filter(function (value: any) {
        return (
          value.MODE == 3 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });
      recModeGift = _resp.filter(function (value: any) {
        return (
          value.MODE == 4 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });

      this.recMode_Cash_Data = recModeCash.map((t: any) => t.CREDIT_CODE);
      this.cashreceiptForm.controls.paymentsCash.setValue(this.recMode_Cash_Data[0]);
      this.receiptModeOptions_Cash =
        this.cashreceiptForm.controls.paymentsCash.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterRecModeCash(value))
        );

      this.recMode_CC_Data = recModeCC.map((t: any) => t.CREDIT_CODE);
      this.creditCardReceiptForm.controls.paymentsCreditCard.setValue(this.recMode_CC_Data[0]);

      this.receiptModeOptions_CC =
        this.creditCardReceiptForm.controls.paymentsCreditCard.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterRecModeCC(value))
        );

      this.recModeOthersData = recModeOthers.map((t: any) => t.CREDIT_CODE);
      this.othersReceiptForm.controls.paymentsOthers.setValue(this.recModeOthersData[0]);

      this.receiptModeOptionsOthers =
        this.othersReceiptForm.controls.paymentsOthers.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterRecModeOthers(value))
        );

      this.recModeAdvanceData = recModeAdvance.map((t: any) => t.CREDIT_CODE);
      this.advanceReceiptForm.controls.paymentsAdvance.setValue(this.recModeAdvanceData[0]);

      this.receiptModeAdvanceOthers =
        this.advanceReceiptForm.controls.paymentsAdvance.valueChanges.pipe(
          startWith(''),
          map((value) =>
            this._filterReceiptModes(this.recModeAdvanceData, value)
          )
        );

      this.recModeGiftData = recModeGift.map((t: any) => t.CREDIT_CODE);
      this.giftReceiptForm.controls.paymentsCreditGIftVoc.setValue(this.recModeGiftData[0]);

      this.receiptModeGiftOptions =
        this.giftReceiptForm.controls.paymentsCreditGIftVoc.valueChanges.pipe(
          startWith(''),
          map((value) =>
            this._filterReceiptModes(this.recModeGiftData, value)
          )
        );
    });
  }

  private _filterRecModeCash(value: string): string[] {
    console.log(value);
    const filterValue = (value || '').toLowerCase();

    return this.recMode_Cash_Data.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterRecModeCC(value: string): string[] {
    console.log(value);
    const filterValue = (value || '').toLowerCase();

    return this.recMode_CC_Data.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterRecModeOthers(value: string): string[] {
    console.log(value);
    const filterValue = (value || '').toLowerCase();

    return this.recModeOthersData.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }




  private _filterReceiptModes(arrName: any,
    value: string,): string[] {
    const filterValue = (value || '').toLowerCase();
    return arrName.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  changeSalesPerson(value: any) {
    this.salespersonName = this.salesPersonOptions.filter(
      (data) => data.SALESPERSON_CODE == value
    )[0]?.SP_SHORTNAME;
  }
  changeIdtype(val: any) {
    //this.customerDataForm.controls.id_number.setValue(val);
    //this.customerDataForm.controls['fcn_customer_id_number'].setValue(val);
  }

  setSalesReturnItems(slno: any, items: any) {
    // alert('data');

    // alert('items.STOCK_CODE '+items.STOCK_CODE)
    // alert('items.STOCK_DOCDESC '+items.STOCK_DOCDESC)
    let temp_sales_return_items: any = {
      // "STOCK_DOCDESC":"",
      // "LOCTYPE_CODE": "",
      // "RATE_TYPE": "",
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
      DT_YEARMONTH: this.salesReturnForm.value.fcn_returns_fin_year || localStorage.getItem('YEAR'),
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
      "DTSALESPERSON_CODE": items['DTSALESPERSON_CODE'] || '',


      // new fields added - 28-12-2023
      "COMPONENT_PRICE_TYPE": "",
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
      "GIFT_ITEM": true,
      "GSTMETALPER": 0,
      "GSTMAKINGPER": 0,
      "GSTOTHERPER": 0,
      "GSTMETALAMT_CC": 0,
      "GSTMAKINGAMT_CC": 0,
      "GSTOTHERAMT_CC": 0,
      "GSTMETALAMT_FC": 0,
      "HSNCODE": "",
      "LESSTHANCOST_USER": "",
      "NEWUNIQUEID": 0,
      "STOCKCHECKOTHERBRANCH": true,
      "VATCODE": ""

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
      //   // this.currentsalesReturnItems.findIndex(data => data.SRNO == temp_sales_return_items.SRNO)
      // );
      // console.log('====================================');
      const preitemIndex = this.currentsalesReturnItems.findIndex(
        (data: any) => data.SRNO == temp_sales_return_items.SRNO
      );
      // alert(preitemIndex);
      if (preitemIndex != -1) {
        temp_sales_return_items.SRNO = this.salesReturnEditId;

        this.currentsalesReturnItems[preitemIndex] = temp_sales_return_items;
      } else {
        this.currentsalesReturnItems.push(temp_sales_return_items);
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
    this.sumTotalValues();
    this.setSalesReturnDetailsPostData();
  }
  checkSelectedVal(stockCode: any, amtval: any, srNo: any) {

    return this.sales_returns_items.find(
      (data: any) => data.sn_no.toString() == srNo.toString()
      // data.stock_code == stockCode && data.total_amount == amtval
    );
  }
  changeRetailSalesReturnVal(value: any) {
    // this.salesReturnsItems_forVoc[index].TOTALWITHVATFC = parseFloat(value);
    // this.salesReturnsItems_forVoc[index].TOTALWITHVATLC = parseFloat(value);
    this.lineItemModalForSalesReturn = true;
    this.salesReturnRowDataSRNO = value.SRNO;
    this.modalReferenceSalesReturn = this.modalService.open(this.mymodal, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
    });
    console.log('changeRetailSalesReturnVal ', value);
    if (this.modalService.hasOpenModals()) {
      setTimeout(() => {
        this.renderer.selectRootElement('#fcn_li_item_code')?.focus();
        this.newLineItem = value;
        this.divisionMS = value.DIVISIONMS;
        this.lineItemForm.controls.fcn_li_item_code.setValue(value.STOCK_CODE);
        this.lineItemForm.controls.fcn_li_item_desc.setValue(value.STOCK_DOCDESC);
        this.lineItemForm.controls.fcn_li_division.setValue(value.DIVISION_CODE);
        this.lineItemForm.controls.fcn_li_location.setValue(value.LOCTYPE_CODE);
        this.lineItemForm.controls.fcn_li_pcs.setValue(value.PCS);
        this.lineItemForm.controls.fcn_li_gross_wt.setValue(value.GROSSWT);
        this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);
        this.lineItemForm.controls.fcn_li_net_wt.setValue(value.NETWT);
        this.lineItemForm.controls.fcn_li_rate.setValue(value.MKG_RATEFC);
        this.lineItemForm.controls.fcn_li_total_amount.setValue(value.MKGVALUEFC);
        this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
          value.DISCOUNT
        );
        this.lineItemForm.controls.fcn_li_discount_amount.setValue(
          value.DISCOUNTVALUEFC
        );
        this.lineItemForm.controls.fcn_li_gross_amount.setValue(
          value.NETVALUEFC
        );

        // this.lineItemForm.controls.fcn_li_tax_percentage.setValue(value.IGST_PER);
        this.lineItemForm.controls.fcn_li_tax_percentage.setValue(value.VAT_PER);
        this.lineItemForm.controls.fcn_li_tax_amount.setValue(value.VAT_AMOUNTFC);
        this.lineItemForm.controls.fcn_li_net_amount.setValue(value.TOTALWITHVATFC);
        // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.NETVALUEFC);
        this.lineItemForm.controls.fcn_li_purity.setValue(value.PURITY);
        this.lineItemForm.controls.fcn_li_pure_wt.setValue(value.PUREWT);
        this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);
        this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
        this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TagLines);
        this.lineItemForm.controls.fcn_ad_stone_rate.setValue(value.STONE_RATEFC);
        this.lineItemForm.controls.fcn_ad_stone_amount.setValue(value.STONEVALUEFC);
        this.lineItemForm.controls.fcn_ad_metal_rate.setValue(value.METAL_RATE);
        this.lineItemForm.controls.fcn_ad_metal_amount.setValue(value.METALVALUEFC);
        this.validatePCS = false;
        this.managePcsGrossWt();
        // this.manageCalculations();
      }, 100);
    }
  }
  addSalesReturnOnSelect(event: any, slsReturn: any, index: any) {
    // console.table(event);
    // console.table(slsReturn);
    let checked = event.target.checked;
    // let itemsLength = this.sales_returns_pre_items.length + 1;
    // let itemsLengths =
    //   this.sales_returns_pre_items[this.sales_returns_pre_items.length - 1];
    // // alert(JSON.stringify(itemsLengths));
    // if (itemsLengths == undefined) itemsLengths = 1;
    // else itemsLengths = itemsLengths.ID + 1;
    // alert(itemsLengths);
    let itemsLengths = slsReturn.SRNO;

    if (checked) {
      var values: any = {
        // ID: itemsLength,
        // sn_no: itemsLength,
        ID: itemsLengths,
        sn_no: itemsLengths,
        stock_code: '',
        mkg_amount: '',
        total_amount: slsReturn.TOTAL_AMOUNTFC,
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

      // for (var i = 0; i < this.salesReturnsItems_forVoc.length; i++) {
      //   var obj = this.salesReturnsItems_forVoc[i];
      //   if (i == index) {
      // if (obj.STOCK_CODE == stockCode && obj.NETVALUEFC == slsReturn.NETVALUEFC) {
      this.sales_returns_total_amt =
        parseFloat(this.sales_returns_total_amt) +
        parseFloat(this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          parseFloat(slsReturn.TOTAL_AMOUNTFC)
        ));
      console.log('====================================');
      // this.sales_returns_total_amt =
      //   parseFloat(this.sales_returns_total_amt) +
      //   parseFloat(
      //     this.comFunc.transformDecimalVB(
      //       this.comFunc.amtDecimals,
      //       parseFloat(slsReturn.TOTALWITHVATFC)
      //     )
      //   );
      values.stock_code = slsReturn.STOCK_CODE;
      values.mkg_amount = slsReturn.MKG_RATEFC;
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
      this.sales_returns_pre_items.push(values);
      // enable
      // this.setSalesReturnItems(
      //   itemsLength,
      //   slsReturn
      // );

      // }
      // }
    } else {
      // this.sales_returns_pre_items.filter((data) => {

      // });
      for (var i = 0; i < this.sales_returns_pre_items.length; i++) {
        var obj = this.sales_returns_pre_items[i];
        // if (obj.ID == itemsLength) {

        if (
          obj.sn_no.toString() == slsReturn.SRNO.toString(),
          obj.stock_code == slsReturn.STOCK_CODE &&
          obj.total_amount == slsReturn.TOTAL_AMOUNTFC
        ) {
          this.sales_returns_total_amt =
            parseFloat(this.sales_returns_total_amt) -
            parseFloat(this.sales_returns_pre_items[i].total_amount);
          this.sales_returns_pre_items.splice(i, 1);
          this.currentsalesReturnItems.splice(i, 1);
        }
      }
    }
  }
  // addItemtoSalesReturnOnSelect(event, slsReturn, index) {
  //   // index = index + this.sales_returns_pre_items.length;
  //   let checked = event.target.checked;
  //   let stockCode = event.target.defaultValue;
  //   console.log('=========slsReturn===========================');
  //   console.log(index, slsReturn);
  //   console.log('====================================');
  //   // alert(event.target.checked);
  //   // alert(event.target.defaultValue);
  //   // alert(index);

  //   console.log('salesReturnsItems_forVoc ', this.salesReturnsItems_forVoc);

  //   var items_length = this.sales_returns_pre_items.length;
  //   var ordered_items_length = this.sales_returns_pre_items.length;
  //   if (checked) {
  //     // alert('this.sales_returns_pre_items.length' + this.sales_returns_pre_items.length);
  //     // alert('this.sales_returns_items_slno_length' + this.sales_returns_items_slno_length);
  //     // alert("ordered_items_length" + ordered_items_length);

  //     // if (items_length == 0) this.sales_returns_items_slno_length = 1;
  //     // else
  //     //   this.sales_returns_items_slno_length =
  //     //     this.sales_returns_items_slno_length + 1;
  //     if (
  //       this.salesReturnEditId == '' ||
  //       this.salesReturnEditId == undefined ||
  //       this.salesReturnEditId == null
  //     ) {
  //       if (ordered_items_length == 0) {
  //         this.sales_returns_items_slno_length = 1;
  //       } else {
  //         this.sales_returns_items_slno_length =
  //           this.sales_returns_items_slno_length + 1;
  //       }
  //     } else {
  //       this.sales_returns_items_slno_length =
  //         this.salesReturnEditId + this.sales_returns_items_slno_length;
  //       // this.sales_returns_items_slno_length = this.salesReturnEditId  ;
  //     }

  //     // alert('this.sales_returns_items_slno_length' + this.sales_returns_items_slno_length);
  //     var values = {
  //       ID: this.sales_returns_items_slno_length,
  //       sn_no: this.sales_returns_items_slno_length,
  //       stock_code: '',
  //       mkg_amount: '',
  //       total_amount: '',
  //       pcs: '',
  //       weight: '',
  //       description: '',
  //       tax_amount: '',
  //       net_amount: '',
  //       // pure_wt: this.lineItemForm.value.fcn_li_pure_wt,
  //       // making_amt: this.lineItemForm.value.fcn_ad_making_amount || 0,
  //       // metal_amt: this.lineItemForm.value.fcn_ad_metal_amount || 0,
  //       // stone_amt: this.lineItemForm.value.fcn_ad_stone_amount || 0,
  //       // dis_amt: this.lineItemForm.value.fcn_li_discount_amount || 0,
  //     };

  //     // console.table(this.salesReturnsItems_forVoc);
  //     for (var i = 0; i < this.salesReturnsItems_forVoc.length; i++) {
  //       console.log(
  //         '===============salesReturnsItems_forVoc====================='
  //       );
  //       console.log(this.salesReturnsItems_forVoc);
  //       console.log('====================================');
  //       var obj = this.salesReturnsItems_forVoc[i];
  //       if (i == index) {
  //         // if (obj.STOCK_CODE == stockCode && obj.NETVALUEFC == slsReturn.NETVALUEFC) {
  //         this.sales_returns_total_amt += parseFloat(
  //           parseFloat(obj.NETVALUEFC).toFixed(2)
  //         );

  //         values.stock_code = obj.STOCK_CODE;
  //         values.mkg_amount = obj.MKG_RATEFC;
  //         values.total_amount = obj.NETVALUEFC;
  //         values.pcs = obj.PCS;
  //         values.weight = obj.NETWT;
  //         values.description = obj.STOCK_DOCDESC;
  //         values.tax_amount = '0';
  //         values.net_amount = obj.NETVALUEFC;
  //         if (
  //           this.salesReturnEditId == '' ||
  //           this.salesReturnEditId == undefined ||
  //           this.salesReturnEditId == null
  //         ) {
  //           this.sales_returns_pre_items.push(values);
  //           // alert(' this.sales_returns_pre_items.push' +  this.sales_returns_pre_items.length)
  //         } else {
  //           // alert(JSON.stringify(this.sales_returns_pre_items[this.salesReturnEditId - 1]))
  //           // let index = this.sales_returns_pre_items.indexOf("Apple");
  //           // const index = this.sales_returns_pre_items.filter((object) => {
  //           //   if (
  //           //     object.stock_code == stockCode &&
  //           //     obj.total_amount == slsReturn.NETVALUEFC
  //           //   )return object;
  //           // });
  //           // alert(JSON.stringify(index));
  //           // if (index.length == 0) this.sales_returns_pre_items.push(values);
  //           // else
  //           // alert(this.salesReturnEditId);
  //           // this.sales_returns_pre_items[this.salesReturnEditId] = values;
  //           this.orderedItemEditId = '';
  //           this.sales_returns_pre_items[this.salesReturnEditId - 1] = values;
  //         }
  //         this.setSalesReturnItems(
  //           this.sales_returns_items_slno_length,
  //           // this.salesReturnsItems_forVoc[i]
  //           slsReturn
  //         );
  //       }
  //     }

  //     // this.sales_returns_pre_items.push(values);

  //     console.log(
  //       '==============salesReturnsItems_forVoc======================'
  //     );
  //     console.log(this.salesReturnsItems_forVoc);
  //     console.log('====================================');

  //     // this.sales_returns_items.push(values);
  //     // console.table(values);
  //   } else {

  //     console.log('remove sales return item');
  //     for (var i = 0; i < this.sales_returns_pre_items.length; i++) {
  //       var obj = this.sales_returns_pre_items[i];
  //       if (obj.stock_code == stockCode) {
  //         console.log(i);
  //         console.log(
  //           'sales_returns_pre_items',
  //           this.sales_returns_pre_items[i].total_amount
  //         );
  //         console.log(
  //           'this.sales_returns_total_amt',
  //           this.sales_returns_total_amt
  //         );

  //         this.sales_returns_total_amt =
  //           this.sales_returns_total_amt -
  //           this.sales_returns_pre_items[i].total_amount;
  //         // this.sales_returns_total_amt -= this.sales_returns_pre_items[i].TOTAL_AMOUNTCC;

  //         this.sales_returns_pre_items.splice(i, 1);
  //         this.currentsalesReturnItems.splice(i, 1);

  //         // if (this.salesReturnEditId == '' || this.salesReturnEditId == undefined || this.salesReturnEditId == null) {
  //         // } else {
  //         //   this.salesReturnEditCode = '';
  //         //   this.salesReturnEditAmt = '';
  //         //   this.salesReturnsItems_forVoc = [];
  //         //   this.salesReturnForm.controls.fcn_returns_voc_no.setValue('');
  //         // }
  //         // this.setSalesReturnItems(
  //         //   this.sales_returns_items_slno_length,
  //         //   this.salesReturnsItems_forVoc
  //         // );
  //       }
  //     }
  //   }

  //   console.log(this.sales_returns_items);
  // }

  addItemtoSalesReturn() {
    // alert('test');

    Object.values(this.salesReturnForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (!this.salesReturnForm.invalid) {

      console.table(this.sales_returns_pre_items);
      const values = this.sales_returns_pre_items;
      this.sales_returns_items = values;
      console.log('******************');
      console.log(this.sales_returns_items);
      console.log(this.sales_returns_items[0]);
      // this.sales_returns_items.forEach((data, index) => {
      //   console.log('===============this.sales_returns_items.forEach=====================');
      //   console.log(data);
      //   data.ID = index + 1;
      //   data.sn_no = index + 1;

      //   console.log('====================================');
      //   // this.sales_returns_items[index].ID = index + 1;
      //   this.setSalesReturnItems(
      //     index + 1,
      //     data.slsReturn,
      //   )
      // });
      // this.currentsalesReturnItems.forEach((data, index) => {
      //   data.ID = index + 1;
      //   data.SRNO = index + 1;
      // });
      for (let i = 0; i < this.sales_returns_items.length; i++) {
        // this.sales_returns_items[i].ID = i + 1;
        // this.sales_returns_items[i].rid = this.comFunc.generateNumber();

        console.log('******************');
        console.log(this.sales_returns_items[i]);
        console.log(this.sales_returns_items[i].slsReturn);
        console.log('******************');
        this.setSalesReturnItems(
          this.sales_returns_items[i].ID,
          this.sales_returns_items[i].slsReturn
        );
      }

      console.log('=============sales_returns_items=======================');
      console.log(this.sales_returns_items);
      console.log(this.currentsalesReturnItems);
      console.log('====================================');
      // this.sumTotalValues();

      // console.log(this.sales_returns_items);
      // console.log(this.sales_returns_items_slno_length);

      // var items_length = this.sales_returns_items.length;
      // if (items_length == 0) this.sales_returns_items_slno_length = 1;
      // else
      //   this.sales_returns_items_slno_length =
      //     this.sales_returns_items_slno_length + 1;

      // var values = {
      //   ID: this.sales_returns_items_slno_length,
      //   sn_no: this.sales_returns_items_slno_length,
      //   stock_code: '',
      //   mkg_amount: '',
      //   total_amount: '',
      //   pcs: '',
      //   weight: '',
      //   description: '',
      //   tax_amount: '',
      //   net_amount: '',
      // };
      this.sumTotalValues();
      this.modalReference.close();
      // this.modalReference.dismiss();
    } else {
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000 // time in milliseconds
      });
    }
  }
  // addItemtoSalesReturn() {
  //   // alert('test');
  //   console.table(this.sales_returns_pre_items);
  //   this.sales_returns_items = this.sales_returns_pre_items;

  //   this.sales_returns_items.forEach((data, index) => {
  //     data.id = index + 1;
  //   });

  //   console.log('=============sales_returns_items=======================');
  //   console.log(this.sales_returns_items);
  //   console.log(this.currentsalesReturnItems);
  //   console.log('====================================');
  //   // this.sumTotalValues();

  //   // console.log(this.sales_returns_items);
  //   // console.log(this.sales_returns_items_slno_length);

  //   // var items_length = this.sales_returns_items.length;
  //   // if (items_length == 0) this.sales_returns_items_slno_length = 1;
  //   // else
  //   //   this.sales_returns_items_slno_length =
  //   //     this.sales_returns_items_slno_length + 1;

  //   // var values = {
  //   //   ID: this.sales_returns_items_slno_length,
  //   //   sn_no: this.sales_returns_items_slno_length,
  //   //   stock_code: '',
  //   //   mkg_amount: '',
  //   //   total_amount: '',
  //   //   pcs: '',
  //   //   weight: '',
  //   //   description: '',
  //   //   tax_amount: '',
  //   //   net_amount: '',
  //   // };
  //   this.sumTotalValues();
  //   this.modalReference.close();
  //   // this.modalReference.dismiss();
  // }

  setExchangeMetalItems(slno: any, data: any) {
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

      CHARGABLEWT: this.exchangeForm.value.fcn_exchange_chargeable_wt || 0, // net weight
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
      METAL_RATE: this.comFunc.emptyToZero(data.METAL_RATE),
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
      LOCTYPE_CODE: this.exchangeForm.value.fcn_exchange_location || '', // need_input
      // LOCTYPE_CODE: '', // need_input
      OZWT: data.ozWeight || 0, // need_input
      SUPPLIER: '', // need_input
      BATCHSRNO: 0, // need_input
      STOCK_DOCDESC: this.exchangeForm.value.fcn_exchange_item_desc || '',
      BAGNO: this.exchangeForm.value.fcn_exchange_scrap_bag_no.toString() || '',
      BAGREMARKS: this.exchangeForm.value.fcn_exchange_scrap_bag_desc || '',
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
      DT_VOCTYPE: 'POS', // change
      DT_YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
      SUPPLIERDISC: '',
      DTKarat: 0,
      JAWAHARAYN: this.exchangeForm.value.fcn_exchange_jawahara || 0,
      RESALERECYCLE: this.exchangeForm.value.fcn_exchange_resale_recycle || 0,
      CASHEXCHANGE: this.exchangeForm.value.fcn_exchange_cash_exchange || 0,
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

      // new values - metal purchase details
      // BASE_CONV_RATE: '',
      // WASTAGE_PURITY: '',
      // PUDIFF_AMTLC: '',
      // PUDIFF_AMTFC: '',
      // TAX_AMOUNTFC: '',
      // TAX_AMOUNTCC: '',
      // TAX_P: '',
      // LOT_NO: '',
      // BAR_NO: '',
      // TICKET_NO: '',
      // PENALTY: '0.000',
      // TOTAL_AMOUNTFC: '0.000',
      // TOTAL_AMOUNTCC: '0.000',
      // CGST_PER: '0.000',
      // CGST_AMOUNTFC: '0.000',
      // CGST_AMOUNTCC: '0.000',
      // SGST_PER: '0.000',
      // SGST_AMOUNTFC: '0.000',
      // SGST_AMOUNTCC: '0.000',
      // IGST_PER: '0.000',
      // IGST_AMOUNTFC: '0.000',
      // IGST_AMOUNTCC: '0.000',
      // CGST_ACCODE: '',
      // SGST_ACCODE: '',
      // IGST_ACCODE: '',
      // UNITWT: '0.000000',
      // CGST_CTRLACCODE: '',
      // SGST_CTRLACCODE: '',
      // IGST_CTRLACCODE: '',
      // HSN_CODE: '',
      // GST_ROUNDOFFFC: '0.00',
      // GST_ROUNDOFFCC: '0.00',
      // ROUNDOFF_ACCODE: '',
      // OLD_GOLD_TYPE: '',
      // OUTSIDEGOLD: 'False',
      // KUNDAN_PCS: '0',
      // KUNDAN_CARAT: '0.000',
      // KUNDAN_RATEFC: '0.000',
      // KUNDAN_RATECC: '0.000',
      // KUNDAN_WEIGHT: '0.000',
      // KUNDANVALUEFC: '0.000',
      // KUNDANVALUECC: '0.000',
      // KUNDAN_UNIT: '0',
      // TDS_CODE: '',
      // TDS_PER: '0.00',
      // TDS_TOTALFC: '0.000',
      // TDS_TOTALCC: '0.000',
      // SILVER_PURITY: '0.00000000',
      // SILVER_PUREWT: '0.000',
      // SILVER_RATE_TYPE: '',
      // SILVER_RATE: '0.000000',
      // SILVER_RATEFC: '0.000000',
      // SILVER_RATECC: '0.000000',
      // SILVER_VALUEFC: '0.000',
      // SILVER_VALUECC: '0.000',
      // OZGOLD_PUREWT: '0.000',
      // OZSILVER_PUREWT: '0.000',
      // CONV_FACTOR_OZ: '0.000000',
      // PUR_REF: '',
      // BATCHID: '1',
      // STAMPCHARGE_RATEFC: '0.000000',
      // STAMPCHARGE_RATECC: '0.000000',
      // STAMPCHARGE_AMTFC: '0.000',
      // STAMPCHARGE_AMTCC: '0.000',
      // STAMPCHARGE: 'False',
      // ACTUALGROSSWT: '439.600',
      // ACTUALPURITY: '0.75000000',
      // MELTINGLOSS: '0.000',
      // DRAFTIMPORTFLG: 'False',
      // FIXMID: '',
      // FIXVOCTYPE: '',
      // FIXVOCNO: '',
      // FIXBRANCH: '',
      // FIXYEARMONTH: '',
      // FIXSRNO: '',
      // FIX_STOCKCODE: '',
      // IMPORT_REF: '',
      // PRICE1CODE: '',
      // PRICE2CODE: '',
      // PRICE3CODE: '',
      // PRICE4CODE: '',
      // PRICE5CODE: '',
      // PRICE1_VALUECC: '0.000',
      // PRICE1_VALUEFC: '0.000',
      // PRICE2_VALUECC: '0.000',
      // PRICE2_VALUEFC: '0.000',
      // PRICE3_VALUECC: '0.000',
      // PRICE3_VALUEFC: '0.000',
      // PRICE4_VALUECC: '0.000',
      // PRICE4_VALUEFC: '0.000',
      // PRICE5_VALUECC: '0.000',
      // PRICE5_VALUEFC: '0.000',
      // MKGPREMIUMACCODE: '',
      // DETLINEREMARKS: '',
      // MUD_WT: '0.000',
      // GST_CODE: 'VAT',
      // HALLMARKING: '',
      // DISCAMTFC: '0.000',
      // DISCAMTCC: '0.000',
      // DISCPER: '0.000',
      // MARGIN_PER: '0.000',
      // MARGIN_AMTFC: '0.000',
      // MARGIN_AMTCC: '0.000',
      // Picture_Path: '',
      // ORIGINAL_COUNTRY: '',
      // DET_KPNO: '',
      // SERVICE_ACCODE: '',
      // taxcode: '',
      // COLOR: '',
      // CLARITY: '',
      // SIZE: '',
      // SHAPE: '',
      // SIEVE: '',
      // KPNUMBER: '',
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

      // new fields added - 27-12-2023
      "NEWUNIQUEID": 0,
      "DETAILPCS": 0,
      "D_REMARKS": "",
      "DONE_REEXPORTYN": true,

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
        (data) => data.SRNO == temp_exchange_items_metal.SRNO
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

  addItemtoExchange(btn: any) {

    Object.values(this.exchangeForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if (!this.exchangeForm.invalid) {

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
        if (
          this.exchangeItemEditId == '' ||
          this.exchangeItemEditId == undefined ||
          this.exchangeItemEditId == null
        ) {
          if (itemsLengths == undefined) itemsLengths = 1;
          else itemsLengths = itemsLengths.ID + 1;
          this.exchange_items_slno_length = itemsLengths;
        } else {
          itemsLengths = this.exchangeItemEditId;
          this.exchange_items_slno_length = itemsLengths;
        }

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
          METAL_RATE_TYPE: this._exchangeItemchange.METAL_RATE_TYPE,
          METAL_RATE: this._exchangeItemchange.METAL_RATE,
          METAL_RATE_PERGMS_ITEMKARAT:
            this._exchangeItemchange.METAL_RATE_PERGMS_ITEMKARAT,
          ozWeight: this.setOzWt(),
        };

        // this.exchange_items.push(values);
        if (
          this.exchangeItemEditId == '' ||
          this.exchangeItemEditId == undefined ||
          this.exchangeItemEditId == null
        ) {
          this.exchange_items.push(values);
        } else {
          // this.exchange_items[this.exchangeItemEditId - 1] = values;
          // this.exchangeItemEditId = '';
          // alert(this.exchangeItemEditId)
          const preitemIndex = this.exchange_items.findIndex((data) => {
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
        if (btn == 'saveBtn') this.modalReference.close();
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

    } else {
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000 // time in milliseconds
      });
    }
  }

  changeBranch(e: any) {
    console.log(this.dataForm.value.branch);
    let selectedBranch = this.dataForm.value.branch;
    if (selectedBranch != '') {
    }
  }

  exchangeStockCode(event: any) {
    if (event.target.value == '') {
      let _exchangeCode = this.exchangeForm.value.fcn_exchange_item_code;
      this.exchangeForm.reset({
        fcn_exchange_item_code: _exchangeCode,
      });
    } else {
      this.getStockforExchange();
    }
  }
  getStockforExchange() {
    this.standardPurity = 0;
    console.log(this.exchangeForm.value.fcn_exchange_item_code);

    let _exchangeCode = this.exchangeForm.value.fcn_exchange_item_code;
    console.log(_exchangeCode);

    // this.exchangeForm.reset({
    //   fcn_exchange_item_code: _exchangeCode,
    // });
    // this.exchangeForm.controls.fcn_exchange_item_code.setValue(_exchangeCode);
    // alert(_exchangeCode);
    let _exchangeItem: any;
    let _karatRateRec: any;
    let _karatCode: any;
    let API = `RetailsalesExchangeLookup?BRANCH_CODE=${this.strBranchcode}&STOCK_CODE=${_exchangeCode}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        this.renderer.selectRootElement('#fcn_exchange_gross_wt').focus();

        _exchangeItem = resp.response.filter((i: any) => i.STOCK_CODE == _exchangeCode.toUpperCase());

        this._exchangeItemchange = _exchangeItem[0];
        _karatCode = _exchangeItem[0].KARAT_CODE;
        _karatRateRec = this.karatRateDetails.filter(function (i: any) {
          return i.KARAT_CODE == _karatCode;
        });

        this.exchangeForm.controls['fcn_exchange_division'].setValue(
          _exchangeItem[0].DIVISION_CODE
        );
        this.exchangeForm.controls['fcn_exchange_item_desc'].setValue(
          _exchangeItem[0].STOCK_DESCRIPTION
        );
        this.exchangeForm.controls['fcn_exchange_purity'].setValue(
          parseFloat(_exchangeItem[0].PURITY)
        );
        this.standardPurity = this._exchangeItemchange.PURITY;
        this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue(
          // this.comFunc.transformDecimalVB(
          //   this.comFunc.amtDecimals,
          _exchangeItem[0].METAL_RATE_PERGMS_24KARAT
          // _exchangeItem[0].METAL_RATE_PERGMS_ITEMKARAT

          // ) // type not showing so this..
          // this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, _exchangeItem[0].METAL_RATE_PERGMS_24KARAT) // type not showing so this..
          //  this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, _exchangeItem[0].METAL_RATE)
          // _karatRateRec[0].KARAT_RATE
        );
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
      });
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
  // addValidationsForForms(form: FormGroup, controlsArr: string[], validations) {
  //   controlsArr.forEach(controlName => {
  //     const control = form.get(controlName);
  //     if (control) {
  //       control.setValidators([Validators.required]);
  //       control.updateValueAndValidity();
  //     }
  //   });
  // }

  addValidationsForForms(form: FormGroup, ctrlName: any, validations: any) {
    const control = form.get(ctrlName);
    if (control) {
      control.setValidators(validations);
      control.updateValueAndValidity();
    }
  }

  // addValidationsForForms(form: any, ctrlName: any, validations: any) {
  //   this[form].controls[ctrlName].setValidators(validations);
  //   this[form].controls[ctrlName].updateValueAndValidity();
  // }

  // removeValidationsForforms(form: any, controlsArr: any) {
  //   controlsArr.map((data: any) => {
  //     this[form].controls[data].clearValidators();
  //     this[form].controls[data].updateValueAndValidity();
  //   });
  // }
  // addValidationsForForms(form: any, controlsArr: any) {
  //   controlsArr.map((data: any) => {
  //     this[form].controls[data].setValidators([Validators.required]);
  //     this[form].controls[data].updateValueAndValidity();
  //   });
  // }
  setPosItemData(sno: any, data: any) {

    let temp_pos_item_data: any = {
      // new values
      // "UNIQUEID": 0,

      DIVISIONMS: data.divisionMS,
      SRNO: sno,
      DIVISION_CODE: data.DIVISION,
      STOCK_CODE: data.STOCK_CODE, // m
      GROSS_AMT: this.lineItemForm.value.fcn_li_gross_amount || 0,
      PCS: data.pcs, //m
      GROSSWT: this.lineItemForm.value.fcn_li_gross_wt,
      STONEWT: data.STONE_WT, // m
      NETWT: this.lineItemForm.value.fcn_li_net_wt, // m
      PURITY: data.PURITY, // m
      PUREWT: data.pure_wt, // m
      CHARGABLEWT: this.lineItemForm.value.fcn_li_net_wt, // net weight
      // CHARGABLEWT: data.NET_WT, // net weight
      MKG_RATEFC: this.lineItemForm.value.fcn_li_rate || 0, //need
      MKG_RATECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
      ), // cctofc rate

      MKGVALUEFC: this.lineItemForm.value.fcn_li_total_amount, // metal amount
      MKGVALUECC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
      ), // metal amount
      RATE_TYPE: data.RATE_TYPE, //need_input
      METAL_RATE: this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_metal_rate
      ),

      METAL_RATE_GMSFC: this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_metal_rate
      ), //need_input
      METAL_RATE_GMSCC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate)
      ),

      // "METAL_RATE_GMSFC": 18.1, // jeba
      // "METAL_RATE_GMSCC": 19.1, // jeba
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
        this.comFunc.amtDecimals,
        parseFloat(this.lineItemForm.value.fcn_li_total_amount) +
        parseFloat(this.lineItemForm.value.fcn_ad_metal_amount)
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

      // TOTALWITHVATFC: this.comFunc.emptyToZero(
      //   this.lineItemForm.value.fcn_li_net_amount
      // ),
      // TOTALWITHVATLC: this.comFunc.CCToFC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount)
      // ),
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
        // this.order_items_total_gross_amount,
        this.lineItemForm.value.fcn_li_net_amount
        // this.lineItemForm.value.fcn_ad_amount
        // + this.lineItemForm.value.fcn_li_tax_amount
      ),
      TOTALWITHVATLC:
        this.comFunc.emptyToZero(
          this.comFunc.FCToCC(
            this.comFunc.compCurrency,
            this.comFunc.emptyToZero(
              this.lineItemForm.value.fcn_li_net_amount
              // this.lineItemForm.value.fcn_li_net_amount
              // this.comFunc.emptyToZero(this.order_items_total_gross_amount)
              // this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_amount)
              // + this.comFunc.emptyToZero( this.lineItemForm.value.fcn_li_tax_amount)
            )
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
      DT_VOCTYPE: 'POS', // change
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
      IGST_AMOUNTFC: this.lineItemForm.value.fcn_li_tax_amount || 0,
      IGST_AMOUNTCC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.lineItemForm.value.fcn_li_tax_amount
      ),
      CGST_ACCODE: '',
      SGST_ACCODE: '',
      IGST_ACCODE: '',
      TOTAL_AMOUNTFC: this.comFunc.emptyToZero(
        this.order_items_total_gross_amount
      ),
      TOTAL_AMOUNTCC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.order_items_total_gross_amount)
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
      "GSTVATONMAKING" : data.GSTVATONMAKING,
      "EXCLUDEGSTVAT" : data.EXCLUDEGSTVAT,

    };
    console.log(data);

    let _taxamount = 0;
    _taxamount = data.PRICE1LC * (this.branch_tax_percentage / 100);

    let _net_amount_val = +_taxamount + +data.PRICE1LC;

    // commented
    // temp_pos_item_data.SRNO = sno;
    // temp_pos_item_data.STOCK_CODE = data.STOCK_CODE;
    // // temp_pos_item_data.DIVISION_CODE = data.DIVISION_CODE;
    // temp_pos_item_data.PCS = 1;
    // temp_pos_item_data.GROSSWT = data.GROSSWT;
    // temp_pos_item_data.NETWT = data.NET_WT;
    // temp_pos_item_data.MKG_RATEFC = data.PRICE1LC;
    // temp_pos_item_data.VAT_PER = this.branch_tax_percentage;
    // temp_pos_item_data.VAT_AMOUNTFC = parseFloat(_taxamount.toFixed(3));
    // temp_pos_item_data.NETVALUEFC = parseFloat(_net_amount_val.toFixed(3));
    // temp_pos_item_data.STOCK_DOCDESC = data.STOCK_DESCRIPTION;

    console.log(temp_pos_item_data);
    if (
      this.orderedItemEditId == '' ||
      this.orderedItemEditId == undefined ||
      this.orderedItemEditId == null
    ) {
      this.currentLineItems.push(temp_pos_item_data);
    } else {
      const preitemIndex = this.currentLineItems.findIndex((data: any) => {
        // console.table(data);
        console.table(data.SRNO == this.orderedItemEditId);
        return data.SRNO == this.orderedItemEditId;
      });
      console.log('====================================');
      console.log(preitemIndex);
      console.log('====================================');
      if (preitemIndex != -1) {
        temp_pos_item_data.SRNO = this.orderedItemEditId;
        this.currentLineItems[preitemIndex] = temp_pos_item_data;
      }
      console.log(
        '===========updatedcurrentLineItems========================='
      );
      console.log(this.currentLineItems);
      console.log(this.ordered_items);
      console.log('====================================');
      // this.currentLineItems[this.orderedItemEditId - 1] = temp_pos_item_data;
      this.orderedItemEditId = '';
    }
    this.pos_main_data.RetailDetails = this.currentLineItems;
    console.log(this.pos_main_data);
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
      DTSALESPERSON_CODE: this.vocDataForm.value.sales_person || '', //need
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
    // this.salesReturnRowData = temp_pos_item_data;
    const preitemIndex = this.salesReturnsItems_forVoc.findIndex((data: any) => data.SRNO.toString() == this.salesReturnRowDataSRNO.toString());
    if (preitemIndex != -1) {
      console.log('=================this.salesReturnsItems_forVoc[preitemIndex]===================');
      console.log(this.salesReturnsItems_forVoc[preitemIndex], temp_pos_item_data);
      console.log('====================================');
      this.salesReturnsItems_forVoc[preitemIndex] = { ...this.salesReturnsItems_forVoc[preitemIndex], ...temp_pos_item_data };
      // this.salesReturnsItems_forVoc[preitemIndex] = values;
      console.log('=================this.salesReturnsItems_forVoc[preitemIndex]===================');
      console.log(this.salesReturnsItems_forVoc[preitemIndex]);
      console.log('====================================');
    } else {
      console.log('============failed=====this.salesReturnsItems_forVoc[preitemIndex]===================');
      console.log(this.salesReturnsItems_forVoc[preitemIndex]);
      console.log('====================================');
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
    this.invReturnSalesTotalNetTotal = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      net_sum + total_tax_amt
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
      console.log('item---------------------', item);

      total_sum = total_sum + parseFloat(item.total_amount);
      tax_sum = tax_sum + parseFloat(item.tax_amount);
      net_sum = net_sum + parseFloat(item.net_amount);
      total_pcs = total_pcs + parseFloat(item.pcs);
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


    // added by moorthy jebu reference - 11-01-2024
    // if (StaticValues.strBRANCHTAXTYPE == Formcontrols.TaxType.VAT.ToString())
    // {
    let dblRounddiff = 0.00;
    let dblVatTot = 0.00;
    let dblVatAmtRd = 0.00;
    let intVocCCRoundoff = 2;

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
      total_exchange = total_exchange + parseFloat(item.net_amount);
      // total_exchange = total_exchange + parseFloat(item.total_amount);
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
    // alert('this.order_items_total_net_amount ' + this.order_items_total_net_amount);




    let IgstVatData: any = this.ordered_items.filter((data) => data.taxPer != 0 && data.taxPer != '');
    let IgstVatPer: number = 0;
    let taxType;
    if (IgstVatData.length > 0) {
      IgstVatPer = parseFloat(IgstVatData[0].taxPer);
    }

    if (this.comFunc.allbranchMaster.BRANCH_TAXTYPE == 'VAT') {

      if (this.comFunc.compCurrency == "AED" || this.comFunc.compCurrency == "BHD") {

        const vocTypeMaster = this.comFunc.getVoctypeMasterByVocTypeMain(this.strBranchcode, this.vocType, this.mainVocType)

        if (vocTypeMaster != null) {
          intVocCCRoundoff = vocTypeMaster.ROUNDOFFCC;
        }
        if (IgstVatPer > 0) {
          this.vatRoundOffAmt = 0.00;
          dblRounddiff = this.comFunc.emptyToZero(this.comFunc.transformDecimalVB(
            intVocCCRoundoff,
            ((parseFloat(this.order_items_total_gross_amount) * IgstVatPer) / (100.0 + IgstVatPer))));
          dblVatTot = this.comFunc.emptyToZero(this.order_items_total_tax);

          if ((dblRounddiff - dblVatTot) < 0.05) {
            this.vatRoundOffAmt = this.comFunc.CCToFC(this.comFunc.compCurrency, (dblRounddiff - dblVatTot));
            dblVatAmtRd = this.comFunc.emptyToZero(this.vatRoundOffAmt);
            this.order_items_total_tax = this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, (this.comFunc.emptyToZero(this.order_items_total_tax) + this.comFunc.emptyToZero(dblVatAmtRd)));

          }
        }
      }
    }


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

  addItemtoList(btn: any) {
    Object.values(this.lineItemForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if (!this.lineItemForm.invalid) {
      if (
        parseFloat(this.lineItemForm.value.fcn_li_net_amount) >=
        this.lineItemForm.value.fcn_ad_metal_amount
      ) {
        this.updateBtn = false;
        this.inv_cust_id_no =
          this.customerDataForm.value.fcn_customer_id_number;
        this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;
        if (this.newLineItem.STOCK_CODE == '') {
          // alert('Invalid Stock Code');
          // this.snackBar.open('Invalid Stock Code', 'OK');
          this.openDialog('Warning', 'Invalid Stock Code', true);
        } else {
          let itemsLengths = this.ordered_items[this.ordered_items.length - 1];
          // alert(JSON.stringify(itemsLengths));

          // alert(itemsLengths);
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

          console.log(this.newLineItem);

          var values: any = {
            ID: this.order_items_slno_length,
            sn_no: this.order_items_slno_length,
            stock_code: this.newLineItem.STOCK_CODE,
            mkg_amount: this.lineItemForm.value.fcn_ad_making_amount || 0,
            // total_amount: temp_resp.PRICE1LC,
            pcs: this.lineItemForm.value.fcn_li_pcs,
            weight: this.lineItemForm.value.fcn_li_gross_wt,
            description: this.lineItemForm.value.fcn_li_item_desc,
            tax_amount: this.lineItemForm.value.fcn_li_tax_amount,
            net_amount: this.lineItemForm.value.fcn_li_net_amount,
            pure_wt: this.lineItemForm.value.fcn_li_pure_wt,
            making_amt: this.lineItemForm.value.total_amount || 0,
            // making_amt: this.lineItemForm.value.fcn_ad_making_amount || 0,
            metal_rate: this.lineItemForm.value.fcn_ad_metal_rate || 0,
            metal_amt: this.lineItemForm.value.fcn_ad_metal_amount || 0,
            stone_amt: this.lineItemForm.value.fcn_ad_stone_amount || 0,
            dis_amt: this.lineItemForm.value.fcn_li_discount_amount || 0,
            gross_amt: this.lineItemForm.value.fcn_li_gross_amount || 0,
            rate: this.lineItemForm.value.fcn_li_rate || 0,
            taxPer: this.lineItemForm.value.fcn_li_tax_percentage || 0,
          };

          values.total_amount = this.lineItemForm.value.fcn_li_total_amount;
          // values.total_amount = this.lineItemForm.value.fcn_li_total_amount;
          this.newLineItem.HSN_CODE = this.newLineItem.HSN_CODE;
          this.newLineItem.GST_CODE = this.newLineItem.GST_CODE;
          this.newLineItem.pcs = this.lineItemForm.value.fcn_li_pcs;
          this.newLineItem.pure_wt = this.lineItemForm.value.fcn_li_pure_wt;
          this.newLineItem.STONE_WT = this.lineItemForm.value.fcn_li_stone_wt;
          this.newLineItem.total_amount =
            this.lineItemForm.value.fcn_li_total_amount;
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
              // console.table(data);
              console.table(data.SRNO == this.orderedItemEditId);
              return data.sn_no == this.orderedItemEditId;
            });
            if (preitemIndex != -1) {
              values.sn_no = this.orderedItemEditId;

              this.ordered_items[preitemIndex] = values;
            }
          }
          console.log(this.ordered_items);
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
            this.modalReference.close();
          }

        }

      } else {
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1914'), true);
        // this.dialogBox.afterClosed().subscribe((data) => {
        //   if (data == 'OK') {
        //     this.lineItemForm.controls.fcn_li_net_amount.setValue(
        //       this.comFunc.transformDecimalVB(
        //         this.comFunc.amtDecimals,
        //         localStorage.getItem('fcn_li_net_amount')
        //       ))
        //   }
        // });
      }
    } else {
      console.log('====================================');
      console.log(this.lineItemForm.controls.fcn_li_gross_wt.errors);
      console.log('====================================');
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000 // time in milliseconds
      });
    }
  }

  updateRetailSalesReturnVal() {
    Object.values(this.lineItemForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if (!this.lineItemForm.invalid) {
      this.setRetailSalesRowData(this.order_items_slno_length, this.newLineItem);
      this.modalReferenceSalesReturn.close();
    } else {
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000 // time in milliseconds
      });
    }
  }


  async getStockDesc(event: any) {
    // var strBranchcode = localStorage.getItem('userbranch');
    // var strUser = localStorage.getItem('username');
    // var strBranchcode = 'MOE';
    // var strUser = 'Admin';
    console.log('====================================');
    console.log('called', event.target.value);
    console.log('====================================');

    this.li_tax_amount_val = 0.0;
    var gross_amount_val = 0.0;
    this.li_net_amount_val = 0.0;
    this.currentStockCode = event.target.value;

    // form rest before stockcode change
    this.lineItemForm.reset();
    this.lineItemForm.reset();
    this.lineItemForm.controls.fcn_li_item_code.setValue(this.currentStockCode);
    console.log('called', event.target.value);

    this.snackBar.open('Loading...');


    if (event.target.value != '') {
      if (this.comFunc.compAcCode == 'JHO001') {
        const stockExist = await this.checkStockCodeForParticularDate(event.target.value);
        if (stockExist)
          return;
      }

      let API = 'RetailSalesStockValidation?strStockCode=' + event.target.value +
        '&strBranchCode=' + this.strBranchcode +
        '&strVocType=POS' + '&strUserName=' + this.strUser +
        '&strLocation=%27%27&strPartyCode=%27%27&strVocDate=' + this.convertDateToYMD(this.vocDataForm.value.vocdate)
      this.suntechApi.getDynamicAPI(API)
        .subscribe((resp) => {
          this.snackBar.dismiss();
          if (resp != null) {
            const stockInfoResult = resp.resultStatus;
            const stockInfos = resp.stockInfo;
            const stockInfoPrice = resp.priceInfo;
            let stockInfoTaxes = resp.taxInfo;
            if (stockInfoTaxes.length == 0 || stockInfoTaxes === null) {
              stockInfoTaxes = [{
                HSN_COD: 0,
                GST_CODE: 0,
                IGST_PER: 0,
                IGST_ACCODE: 0,
              }];
            }
            // if (resp.status == 'Success') {
            if (stockInfoResult.RESULT_TYPE == 'Success') {
              this.newLineItem = stockInfos;
              this.newLineItem.HSN_CODE = stockInfoTaxes[0]?.HSN_CODE;
              this.newLineItem.GST_CODE = stockInfoTaxes[0]?.GST_CODE;
              this.newLineItem.STOCK_DESCRIPTION = stockInfos.DESCRIPTION;
              this.newLineItem.STOCK_COST = stockInfoPrice.STOCK_COST;

              this.divisionMS = stockInfos.DIVISIONMS;
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
              // this.lineItemForm.controls['fcn_li_gross_wt'].setValue(stockInfos.MKG_STOCKVALUE);
              this.lineItemForm.controls['fcn_li_pcs'].setValue(
                stockInfos.BALANCE_PCS
              );
              this.lineItemPcs = stockInfos.BALANCE_PCS;
              this.lineItemGrossWt = this.comFunc.transformDecimalVB(
                this.comFunc.mQtyDecimals,
                this.comFunc.emptyToZero(stockInfos.BALANCE_QTY)
              );
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                stockInfos.BALANCE_QTY
              );
              this.lineItemForm.controls['fcn_li_stone_wt'].setValue(
                stockInfos.STONE_WT || 0
              ); // need field
              this.lineItemForm.controls['fcn_li_net_wt'].setValue(
                stockInfos.NET_WT
              ); // need field
              // this.lineItemForm.controls['fcn_li_stone_wt'].setValue(stockInfoPrice.STONE_WT); // need field
              this.lineItemForm.controls.fcn_li_rate.enable();
              // this.lineItemForm.controls.fcn_li_pcs.enable();
              this.lineItemForm.controls['fcn_li_tax_percentage'].setValue(
                stockInfoTaxes[0].IGST_PER
              );
              this.lineItemForm.controls['fcn_li_purity'].setValue(
                stockInfos.PURITY
              );

              this.blockNegativeStock = stockInfos.BLOCK_NEGATIVESTOCK;
              this.blockNegativeStockValue = stockInfos.BALANCE_QTY;
              this.blockMinimumPrice = stockInfos.BLOCK_MINIMUMPRICE;
              this.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals,
                stockInfoPrice.MIN_SAL_PRICE
              );
              this.validatePCS = stockInfos.VALIDATE_PCS;
              this.managePcsGrossWt();

              // this.lineItemForm.controls['fcn_li_rate'].setValue(stockInfos.RATE); // got value =0
              this.lineItemForm.controls['fcn_li_rate'].setValue(
                parseFloat(stockInfos.RATE).toFixed(2)
              );
              this.lineItemForm.controls['fcn_ad_rate'].setValue(
                parseFloat(stockInfos.RATE).toFixed(2)
              );

              this.renderer.selectRootElement('#fcn_li_total_amount').focus();

              this.curr_line_item_images = stockInfos.PICTURE_NAME;


              if (this.divisionMS == 'M') {
                this.lineItemForm.controls['fcn_ad_making_rate'].setValue(
                  parseFloat(stockInfoPrice.SELLING_PRICE).toFixed(2)
                ); //calculation

                // this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(0); //calculation
                this.lineItemForm.controls['fcn_ad_metal_rate'].setValue(0); //need field
                this.lineItemForm.controls['fcn_ad_rate_type'].setValue(
                  stockInfos.RATE_TYPE != 'NULL' ? stockInfos.RATE_TYPE : ''
                );

                this.lineItemForm.controls['fcn_tab_details'].setValue(
                  stockInfos.TAGLINES
                );
                this.li_tag_val = stockInfos.TAGLINES;
                // this.lineItemForm.controls['fcn_ad_making_amount'].setValue(stockInfos.MKG_STOCKVALUE);
                // this.lineItemForm.controls['fcn_li_total_amount'].setValue(stockInfoPrice.SELLING_PRICE);
                // need
                // this.lineItemForm.controls['fcn_li_rate'].setValue(this.setRate()); // need
                this.lineItemForm.controls['fcn_li_rate'].setValue(
                  this.comFunc.transformDecimalVB(
                    this.comFunc.amtDecimals,
                    stockInfoPrice.SELLING_PRICE
                  )
                );
                // this.lineItemForm.controls['fcn_ad_amount'].setValue(stockInfoPrice.SELLING_PRICE);

                this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(
                  this.comFunc.emptyToZero(stockInfoPrice.STONE_SALES_PRICE)
                );

                this.setMetalRate(stockInfos.KARAT_CODE);
                this.manageCalculations();
              } else {
                this.lineItemForm.controls['fcn_li_rate'].setValue(
                  this.comFunc.transformDecimalVB(
                    this.comFunc.amtDecimals,
                    stockInfoPrice.SELLING_PRICE
                  )
                );
                this.lineItemForm.controls['fcn_li_total_amount'].setValue(
                  this.comFunc.transformDecimalVB(
                    this.comFunc.amtDecimals,
                    stockInfoPrice.SELLING_PRICE
                  )
                );

                this.manageCalculations();
              }

              this.li_tax_amount_val =
                this.lineItemForm.value.fcn_li_tax_amount;
              this.li_net_amount_val =
                this.lineItemForm.value.fcn_li_net_amount;
              // this.li_tag_val = this.newLineItem.TAG_LINES;


              if (!this.newLineItem?.IS_BARCODED_ITEM || this.comFunc.stringToBoolean(this.newLineItem.TPROMOTIONALITEM))
                this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);
              else
                this.setMakingValidation();


            } else {
              // this.snackBar.open('Invalid Stock Code', 'OK');
              this.openDialog(
                'Failed',
                // this.comFunc.getMsgByID(stockInfoResult.MESSAGE_ID.toString()),
                this.comFunc.getMsgByID('MSG1464'),
                true
              );
            }
          }
        });

      // this.suntechApi
      //   .getPOS_RetailSalesItemImage(event.target.value)
      //   .subscribe((resp) => {
      //     if (resp.Status == 'Failed') {
      //       //alert('Invalid Stock Code');
      //     } else {
      //       this.curr_line_item_images = resp.response[0].imagepath;
      //       // this.curr_line_item_images = resp.Result[0].imagepath;
      //     }
      //   });
    }

    // this.lineItemForm.controls['fcn_li_pcs'].setValue(1);
  }

  setMakingValidation() {
    this.addValidationsForForms(this.lineItemForm, 'fcn_li_rate', [
      Validators.required,
      Validators.min(0.1),
    ]);
    this.addValidationsForForms(this.lineItemForm, 'fcn_li_total_amount', [
      Validators.required,
      Validators.min(1),
    ]);
  }

  searchVocNoSalRet() {

    this.getRetailSReturn_EvnFn({
      target: {
        value: this.salesReturnForm.value.fcn_returns_voc_no,
      },
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

      //  this.fcn_returns_voc_no_val = event.target.value;
      console.log(this.salesReturnForm.value.fcn_returns_fin_year);
      console.log(this.salesReturnForm.value.fcn_returns_branch);
      console.log(this.salesReturnForm.value.fcn_returns_voc_type);
      console.log(this.salesReturnForm.value.fcn_returns_voc_no);
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
              let _vocdate = _response?.VOCDATE?.split(' ');
              // let _vocdate = _response?.POS_VOCDATE?.split(' ');
              // let _vocdate = _response.POS_BRANCH_CODE.split(' ');
              for (let i = 0; i < this.salesReturnsItems_forVoc.length; i++) {
                for (let j = 0; j < this.sales_returns_items.length; j++) {
                  if (this.salesReturnsItems_forVoc[i].SRNO.toString() == this.sales_returns_items[j].sn_no.toString()) {
                    this.salesReturnsItems_forVoc[i]['TOTAL_AMOUNTFC'] =
                      // this.salesReturnsItems_forVoc[i]['TOTALWITHVATFC'] =
                      this.sales_returns_items[j]['total_amount']
                  }
                }
              }
              this.salesReturnForm.controls['fcn_returns_sales_man'].setValue(
                _response.SALESPERSON_CODE
              );
              this.salesReturnForm.controls['fcn_returns_cust_code'].setValue(
                _response.POSCUSTCODE
              );
              this.srCustCode = _response.POSCUSTCODE;

              this.salesReturnForm.controls['fcn_returns_cust_mobile'].setValue(
                _response.MOBILE
              );

              this.salesReturnForm.controls['fcn_returns_cust_name'].setValue(
                _response.PARTYNAME
              );
              this.salesReturnForm.controls['fcn_returns_voc_date'].setValue(
                _vocdate[0]
              );
              console.table(this.sales_returns_items);
              console.table(this.sales_returns_pre_items);
              this.sales_returns_total_amt = this.sales_returns_items.reduce(
                (preVal: any, curVal: any) =>
                  parseFloat(preVal) + parseFloat(curVal.total_amount),
                0
              );
              this.sales_returns_pre_items = this.sales_returns_items;
              // if (
              //   this.salesReturnEditId == '' ||
              //   this.salesReturnEditId == undefined ||
              //   this.salesReturnEditId == null
              // ) {
              // } else {
              //   // console.log('===============salesReturnEditId=====================');
              //   // console.log(this.sales_returns_items[(parseInt(this.salesReturnEditId) - 1)]);
              //   // console.log('====================================');
              //   // alert(this.salesReturnEditId);

              //   // this.salesReturnsItems_forVoc
              //   console.table(this.sales_returns_items);
              //   const value =
              //     this.sales_returns_items[this.salesReturnEditId - 1];
              //   if (value != null && value != undefined) {
              //     this.salesReturnEditCode = value.stock_code;
              //     this.salesReturnEditAmt = value.total_amount;
              //     this.sales_returns_total_amt = value.total_amount;

              //     // this.sales_returns_pre_items.push(value);
              //     // this.sales_returns_items.push(value);
              //     // this.sales_returns_pre_items.ID = value.SRNO;
              //     // this.sales_returns_items.ID = value.SRNO;
              //     // this.sales_returns_items_slno_length = 1;
              //     // alert('this.sales_returns_pre_items ' + this.sales_returns_pre_items.length);

              //     // const val = this.salesReturnsItems_forVoc.filter((data) => {
              //     //   if (data.STOCK_CODE == this.salesReturnEditCode && data.NETVALUEFC == this.salesReturnEditAmt) {
              //     //     return data;
              //     //   }
              //     // })
              //     // if (val.length != 0)
              //     //   this.salesReturnsItems_forVoc = val;
              //   }
              // }
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  convertDate(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('-');
  }
  convertDateWithTimeZero(date: any) {
    return date.split('T')[0] + 'T00:00:00.000Z';
  }
  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
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

  // getReceiptModes() {
  //   this.suntechApi.getReceiptModes().subscribe((res) => {
  //     if (res.status == 'Success') {
  //       this.receiptModesList = res.paymentButtons;
  //     } else {
  //       this.receiptModesList = {};
  //     }
  //   });
  // }

  managePcsGrossWt() {
    if (this.validatePCS == true) {
      this.comFunc.formControlSetReadOnly('fcn_li_pcs', false);
      this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      this['lineItemForm'].controls['fcn_li_pcs'].setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    } else {
      this.comFunc.formControlSetReadOnly('fcn_li_pcs', true);
      this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
      this.removeValidationsForForms(this.lineItemForm, ['fcn_li_pcs']);

      if (this.newLineItem.BLOCK_GRWT == true)
        this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      else this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
    }
    //   if (stockInfos.BLOCK_GRWT == true)
    //   this.lineItemForm.controls.fcn_li_gross_wt.disable();
    // else this.lineItemForm.controls.fcn_li_gross_wt.enable();
  }

  validateBeforePrint() {
    let _status = [];
    console.log(
      'order_items_total_net_amount',
      this.order_items_total_net_amount
    );
    console.log(
      'invReturnSalesTotalNetTotal',
      this.invReturnSalesTotalNetTotal
    );
    console.log(this.receiptTotalNetAmt);

    if (this.order_items_total_net_amount.toString() != '0.00') {
      if (parseFloat(this.order_items_total_net_amount) > 0) {
        if (parseFloat(this.order_items_total_net_amount) != parseFloat(this.receiptTotalNetAmt)) {
          _status[0] = false;
          _status[1] = 'Invalid Received Amount';
        } else {
          _status[0] = true;
          _status[1] = 'Received Amount';
        }
      }
    } else {
      _status[0] = false;
      _status[1] = 'Invalid Invoice Data';
    }
    return _status;
  }

  saveOrder() {
    Object.values(this.vocDataForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.customerDataForm.controls).forEach(control => {
      control.markAsTouched();
    });
    // this.postRetailSalesMaster();

    /*********** Need to enable this validation ****** */
    let _validate: any = this.validateBeforePrint();
    if (_validate[0]) {
      // this.rs_WithReturnExchangeReceipt._retailSales = this.pos_main_data;
      // this.rs_WithReturnExchangeReceipt._retailReceipt = this.receiptDetailsList;
      // this.rs_WithReturnExchangeReceipt._retailsReturn = this.retailsReturnMain;
      // this.rs_WithReturnExchangeReceipt._metalPurchase = this.metalPurchaseMain;
      // console.log(this.rs_WithReturnExchangeReceipt);
      // alert('Bill Saved');
      this.postRetailSalesMaster();
      // this.snackBar.open('Bill Saved', 'OK');
    } else {
      // alert(_validate[1]);
      this.snackBar.open(_validate[1], 'OK');
    }
  }
  setKaratList() {
    this.karatRateDetails.map((data: any, i: any) => {
      data.RefMID = i + 1; //need_input
      data.SrNo = i + 1;
      data.VOCTYPE = 'POS';
      data.DT_VOCTYPE = 'POS';
      data.DT_BRANCH_CODE = this.strBranchcode;
      data.DT_VOCNO = 0;
      data.DT_YEARMONTH = this.baseYear || localStorage.getItem('YEAR');
      data.OT_TRANSFER_TIME = new Date();
      // new fields added - 27-12-2023
      data.ORIGINALKARAT_RATE = data.ORIGINALKARAT_RATE || 0;

    });
    console.log('================this.karatRateDetails====================');
    console.log(this.karatRateDetails);
    console.log('====================================');
  }

  postRetailSalesMaster() {
    console.log('====================this.karatRateDetails================');
    console.log(this.karatRateDetails);
    console.log('====================================');
    if (this.amlNameValidation)
      if (!this.customerDetails.AMLNAMEVALIDATION && this.customerDetails.DIGISCREENED) {
        this.amlNameValidationData = false;
      }
    // else {
    //   this.amlNameValidationData = true;
    //   this.openDialog('Warning', 'Customer Pending for approval', true);
    //   return true;
    // }

    this.setRetailSalesDataPost();
    this.setDetailsData();
    if (!this.viewOnly && !this.editOnly) this.setKaratList();
    // this.setSalesReturnDetailsPostData();
    // this.setMetalPurchaseDataPost();

    // alert(this.retailSalesDataPost.VOCNO);
    // alert(this.retailSReturnDataPost.VOCNO);
    // alert(this.metalPurchaseDataPost.VOCNO);

    Object.values(this.vocDataForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.customerDataForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // console.log('==================fcn_customer_exp_date,currentDate==================');
    //   console.log(this.customerDataForm.value.fcn_customer_exp_date, this.currentDate);
    //   console.log('====================================');

    if (this.posIdNoCompulsory && (this.customerDataForm.value.fcn_customer_exp_date < this.currentDate)) {
      this.isSaved = false;
      this.snackBar.open('Invalid Expiry Date', 'OK');
      return;
    }

    if (
      !this.vocDataForm.invalid &&
      this.customerDataForm.value.fcn_customer_mobile != '' &&
      this.customerDataForm.value.fcn_customer_name != '' &&
      this.vocDataForm.value.sales_person != '' &&
      this.currentLineItems.length > 0
    ) {
      // alert('this.currentsalesReturnItems.length ' + this.currentsalesReturnItems.length);
      // alert('this.currentExchangeMetalPurchase.length ' + this.currentExchangeMetalPurchase.length);
      // alert(this.currentsalesReturnItems.length)
      // alert(this.currentExchangeMetalPurchase.length)
      if (this.currentsalesReturnItems.length == 0)
        this.retailSReturnDataPost = null;
      if (this.currentExchangeMetalPurchase.length == 0)
        this.metalPurchaseDataPost = null;

      if (this.validateSalesReturnCust()) {
        return;
      }

      const postData = {
        karatRate: this.karatRateDetails,
        customer: {
          CODE: this.customerDetails?.CODE || '0',
          NAME: this.customerDataForm.value.fcn_customer_name || '',
          COMPANY: this.customerDetailForm.value.fcn_cust_detail_company
            // || this.customerDetails?.COMPANY
            || '',
          ADDRESS:
            this.customerDetailForm.value.fcn_cust_detail_address ||
            // this.customerDetails?.ADDRESS ||
            '',
          POBOX_NO: this.customerDetails?.POBOX_NO || '',
          STATE: this.customerDetails?.STATE || '',
          CITY:
            this.customerDetailForm.value.fcn_cust_detail_city ||
            // this.customerDetails?.CITY ||
            '',
          ZIPCODE: this.customerDetails?.ZIPCODE || '',
          COUNTRY_CODE:
            this.customerDetailForm.value.fcn_cust_detail_country ||
            // this.customerDetails?.COUNTRY_CODE ||
            '',
          EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
          TEL1: this.customerDetails?.TEL1 || '',
          TEL2:
            // this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            this.customerDetails?.TEL2 ||
            '',
          MOBILE: `${this.customerDataForm.value.fcn_customer_mobile}` || '',
          FAX: this.customerDetails?.FAX || '',
          MARITAL_ST:
            this.customerDetailForm.value.fcn_cust_detail_marital_status ||
            // this.customerDetails?.MARITAL_ST ||
            'Unknown',
          WED_DATE: this.customerDetails?.WED_DATE || this.dummyDate,
          SPOUSE_NAME: this.customerDetails?.SPOUSE_NAME || '',
          REMARKS: this.customerDetails?.REMARKS || '',
          DATE_OF_BIRTH:
            this.customerDetailForm.value.fcn_cust_detail_dob ||
            // this.customerDetails?.DATE_OF_BIRTH ||
            this.dummyDate,

          OPENING_ON: this.customerDetails?.OPENING_ON || this.dummyDate,
          GENDER:
            this.customerDetailForm.value.fcn_cust_detail_gender ||
            // this.customerDetails?.GENDER ||
            '',
          REGION: this.customerDetails?.REGION || '',
          NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
            //  || this.customerDetails?.NATIONALITY
            || '',
          RELIGION: this.customerDetails?.RELIGION || '',
          TYPE: this.customerDetails?.TYPE || '',
          CATEGORY: this.customerDetails?.CATEGORY || '',
          INCOME: this.customerDetails?.INCOME || 0,
          CUST_STATUS: this.customerDetails?.CUST_STATUS || '',
          MID: this.customerDetails?.MID || 0,
          PICTURE_NAME: this.customerDetails?.PICTURE_NAME || '',
          PICTURE: this.customerDetails?.PICTURE || '',
          SALVOCTYPE_NO: this.customerDetails?.SALVOCTYPE_NO || '',
          SALDATE: this.customerDetails?.SALDATE || this.dummyDate,
          SALAMOUNT: this.customerDetails?.SALAMOUNT || 0,
          SALBRLOC: this.customerDetails?.SALBRLOC || '',
          Branch_Code: this.customerDetails?.Branch_Code || '',
          TOTALSALES: this.customerDetails?.TOTALSALES || 0,
          POSCUSTIDNO:
            this.customerDataForm.value.fcn_customer_id_number ||
            // this.customerDetails?.POSCustIDNo ||
            '',
          POSSMAN: this.customerDetails?.POSSMAN || '',
          POSCUSTPREFIX: this.customerDetails?.POSCUSTPREFIX || '0',
          MOBILE1:
            this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            // this.customerDetails?.MOBILE1 ||
            '',
          CUST_LANGUAGE: this.customerDetails?.CUST_LANGUAGE || '',
          CUST_TYPE:
            // this.customerDataForm.value.fcn_customer_id_type ||
            // this.customerDetails?.CUST_TYPE ||
            '',
          //  ( this.customerDetails?.CUST_Type == ''
          //     ? this.customerDataForm.value.fcn_customer_id_type
          //     : this.customerDetails?.CUST_Type || ''),
          FAVORITE_CELEB: this.customerDetails?.FAVORITE_CELEB || '',
          STAFF_COURTESY: this.customerDetails?.STAFF_COURTESY || '',
          PRODUCT_KNOWLEDGE: this.customerDetails?.PRODUCT_KNOWLEDGE || ' ',
          LOCATION_AMBIENCE: this.customerDetails?.LOCATION_AMBIENCE || '',
          VARIETY_QUALITY: this.customerDetails?.VARIETY_QUALITY || '',
          OVERALL_EXP: this.customerDetails?.OVERALL_EXP || '',
          PRODUCT_SELECTION: this.customerDetails?.PRODUCT_SELECTION || '',
          SERVICE: this.customerDetails?.SERVICE || '',
          MAKING_CHARGES: this.customerDetails?.MAKING_CHARGES || '',
          BRAND_NAME: this.customerDetails?.BRAND_NAME || '',
          BUY_BACK: this.customerDetails?.BUY_BACK || '',
          LOCATION_PARKING: this.customerDetails?.LOCATION_PARKING || '',
          SOURCE: this.customerDetails?.SOURCE || '',
          PREFERENCE_CONTACT: this.customerDetails?.PREFERENCE_CONTACT || '',
          MOBILECODE1: this.customerDetailForm.value.fcn_mob_code.toString() || '',
          // MOBILECODE1: this.customerDetails?.MOBILECODE1 || '',
          MOBILECODE2: this.customerDetails?.MOBILECODE2 || '',
          IDCATEGORY:
            this.customerDataForm.value.fcn_customer_id_type
            // || this.customerDetails?.IDCATEGORY
            || '',
          ADDRESS_OFFICIAL: this.customerDetails?.ADDRESS_OFFICIAL || '',
          ADDRESS_DELIVARY: this.customerDetails?.ADDRESS_DELIVARY || '',
          INTERESTED_IN: this.customerDetails?.INTERESTED_IN || '',
          BLOOD_GROUP: this.customerDetails?.BLOOD_GROUP || '',
          NO_OF_CHILDREN: this.customerDetails?.NO_OF_CHILDREN || 0,
          ZODIAC_SIGN: this.customerDetails?.ZODIAC_SIGN || '',
          DESIGNATION:
            this.customerDetailForm.value.fcn_cust_detail_designation
            // this.customerDetails?.DESIGNATION 
            || '',
          LEVELFLAG: this.customerDetails?.LEVELFLAG || 0,
          INCOMERANGE: this.customerDetails?.INCOMERANGE || '',
          LAST_UPDATED_DATE:
            this.customerDetails?.LAST_UPDATED_DATE || this.dummyDate,
          TAXOFFICENO: this.customerDetails?.TAXOFFICENO || '',
          SALESMANNAME: this.customerDetails?.SALESMANNAME || '',
          DEFAULT_DISDIAMONDPERCENT:
            this.customerDetails?.DEFAULT_DISDIAMONDPERCENT,
          DEFAULT_DISMETALPERCENT:
            this.customerDetails?.DEFAULT_DISMETALPERCENT,
          LOYALTYALLOW: this.customerDetails?.LOYALTYALLOW || false,
          LOYALTYALLOWEMAIL: this.customerDetails?.LOYALTYALLOWEMAIL || false,
          LOYALTYALLOWSMS: this.customerDetails?.LOYALTYALLOWSMS || false,
          SENDPROMOTIONALEMAIL:
            this.customerDetails?.SENDPROMOTIONALEMAIL || false,
          LOYALTY_CODE: this.customerDetails?.LOYALTY_CODE || '',
          PREFERRED_COLOR: this.customerDetails?.PREFERRED_COLOR || '',
          PREFERRED_ITEM: this.customerDetails?.PREFERRED_ITEM || '',
          WRIST_SIZE: this.customerDetails?.WRIST_SIZE || '',
          FINGER_SIZE: this.customerDetails?.FINGER_SIZE || '',
          LOYALTY_POINT: this.customerDetails?.LOYALTY_POINT || 0,
          FIRSTNAME:
            this.customerDetailForm.value.fcn_customer_detail_fname ||
            // this.customerDetails?.FIRSTNAME ||
            '',
          MIDDLENAME:
            this.customerDetailForm.value.fcn_customer_detail_mname ||
            // this.customerDetails?.MIDDLENAME ||
            '',
          LASTNAME:
            this.customerDetailForm.value.fcn_customer_detail_lname ||
            // this.customerDetails?.LASTNAME ||
            '',
          POSKnownAbout: this.customerDetails?.POSKnownAbout || 0,
          CIVILID_IMGPATH: this.customerDetails?.CIVILID_IMGPATH || '',
          SUGGESTION: this.customerDetails?.SUGGESTION || '',
          AMLNAMEVALIDATION: this.customerDetails?.AMLNAMEVALIDATION || false,
          AML_TYPE: this.customerDetails?.AML_TYPE || false,
          UN_NUMBER: this.customerDetails?.UN_NUMBER || '',
          NAME_1: this.customerDetails?.NAME_1 || '',
          NAME_2: this.customerDetails?.NAME_2 || '',
          NAME_3: this.customerDetails?.NAME_3 || '',
          NAME_4: this.customerDetails?.NAME_4 || '',
          NAME_5: this.customerDetails?.NAME_5 || '',
          DOB_2: this.customerDetails?.DOB_2 || this.dummyDate,
          DOB_3: this.customerDetails?.DOB_3 || this.dummyDate,
          DOB_4: this.customerDetails?.DOB_4 || this.dummyDate,
          DOB_5: this.customerDetails?.DOB_5 || this.dummyDate,
          GOOD_QUALITY: this.customerDetails?.GOOD_QUALITY || '',
          LOW_QUALITY: this.customerDetails?.LOW_QUALITY || '',
          A_K_A: this.customerDetails?.A_K_A || '',
          F_K_A: this.customerDetails?.F_K_A || '',
          NATIONALITY_2: this.customerDetails?.NATIONALITY_2 || '',
          NATIONALITY_3: this.customerDetails?.NATIONALITY_3 || '',
          NATIONALITY_4: this.customerDetails?.NATIONALITY_4 || '',
          NATIONALITY_5: this.customerDetails?.NATIONALITY_5 || '',
          PASSPORT_NO_1: this.customerDetails?.PASSPORT_NO_1 || '',
          PASSPORT_NO_2: this.customerDetails?.PASSPORT_NO_2 || '',
          PASSPORT_NO_3: this.customerDetails?.PASSPORT_NO_3 || '',
          PASSPORT_NO_4: this.customerDetails?.PASSPORT_NO_4 || '',
          PASSPORT_NO_5: this.customerDetails?.PASSPORT_NO_5 || '',
          LISTED_ON_DATE:
            this.customerDetails?.LISTED_ON_DATE || this.dummyDate,
          NATIONAL_IDENTIFICATION_NO:
            this.customerDetailForm.value.fcn_cust_detail_idcard ||
            // this.customerDetails?.NATIONAL_IDENTIFICATION_NO ||
            '',
          OTHER_INFORMATION: this.customerDetails?.OTHER_INFORMATION || '',
          LINKS: this.customerDetails?.LINKS || '',
          FATHERNAME: this.customerDetails?.FATHERNAME || '',
          PROMO_NEEDED: this.customerDetails?.PROMO_NEEDED || '',
          PROMO_HOW_OFTEN: this.customerDetails?.PROMO_HOW_OFTEN || '',
          CHILDNAME1: this.customerDetails?.CHILDNAME1 || '',
          CHILDNAME2: this.customerDetails?.CHILDNAME2 || '',
          CHILDNAME3: this.customerDetails?.CHILDNAME3 || '',
          CHILDNAME4: this.customerDetails?.CHILDNAME4 || '',
          CHILDDATEOFBIRTH1:
            this.customerDetails?.CHILDDATEOFBIRTH1 || this.dummyDate,
          CHILDDATEOFBIRTH2:
            this.customerDetails?.CHILDDATEOFBIRTH2 || this.dummyDate,
          CHILDDATEOFBIRTH3:
            this.customerDetails?.CHILDDATEOFBIRTH3 || this.dummyDate,
          CHILDDATEOFBIRTH4:
            this.customerDetails?.CHILDDATEOFBIRTH4 || this.dummyDate,
          OTHERNAMES: this.customerDetails?.OTHERNAMES || '',
          AUTOCREATEMST: this.customerDetails?.AUTOCREATEMST || false,
          WUPMOBILECODE: this.customerDetails?.WUPMOBILECODE || '',
          WUPMOBILENO: this.customerDetails?.WUPMOBILENO || '',
          OCCUPATION:
            //  this.customerDetailForm.value.fcn_cust_detail_designation
            this.customerDetails?.OCCUPATION
            || '',
          ShowRoomAccessibility:
            this.customerDetails?.ShowRoomAccessibility || '',
          ProductRangeAvailability:
            this.customerDetails?.ProductRangeAvailability || '',
          DIGISCREENED: this.customerDetails?.DIGISCREENED || false,
          BR_CODE: this.customerDetails?.BR_CODE || '',
          SPOUSE_DATE_OF_BIRTH:
            this.customerDetails?.SPOUSE_DATE_OF_BIRTH || this.dummyDate,
          TEL_R_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.TEL_R_CODE
          )}`,
          TEL_O_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.TEL_O_CODE
          )}`,
          GST_NUMBER: `${this.comFunc.emptyToZero(
            this.customerDetails?.GST_NUMBER
          )}`,
          VAT_NUMBER: `${this.comFunc.emptyToZero(
            this.customerDetails?.VAT_NUMBER
          )}`,
          PARENT_CODE: `${this.comFunc.emptyToZero(
            this.customerDetails?.PARENT_CODE
          )}`,
          REFERED_BY: `${this.comFunc.emptyToZero(
            this.customerDetails?.REFERED_BY
          )}`,
          CREDIT_LIMIT: this.customerDetails?.CREDIT_LIMIT || 0,
          CREDIT_LIMIT_STATUS:
            this.customerDetails?.CREDIT_LIMIT_STATUS || false,
          PANCARDNO: this.customerDetails?.PANCARDNO || '111111' || '',
          VOCTYPE: this.vocType || '',
          YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
          VOCNO: this.vocDataForm.value.fcn_voc_no || 0,
          VOCDATE: this.convertDateWithTimeZero(
            new Date(this.vocDataForm.value.vocdate).toISOString()
          ),
          // new values - poscustomer
          'OT_TRANSFER_TIME': this.customerDetails?.OT_TRANSFER_TIME || '',
          'COUNTRY_DESC': this.customerDetails?.COUNTRY_DESC || '',
          'STATE_DESC': this.customerDetails?.STATE_DESC || '',
          'CITY_DESC': this.customerDetails?.CITY_DESC || '',
          'FAVORITE_CELEB_DESC': this.customerDetails?.FAVORITE_CELEB_DESC || '',
          'RELIGION_DESC': this.customerDetails?.RELIGION_DESC || '',
          'CATEGORY_DESC': this.customerDetails?.CATEGORY_DESC || '',
          'CUST_STATUS_DESC': this.customerDetails?.CUST_STATUS_DESC || '',
          'NATIONALITY_DESC': this.customerDetails?.NATIONALITY_DESC || '',
          'TYPE_DESC': this.customerDetails?.TYPE_DESC || '',

          "BRANCH_CODE": this.strBranchcode || '',
          "DETAILS_JOHARA": this.customerDetails?.DETAILS_JOHARA || '',
          "DETAILS_FARAH": this.customerDetails?.DETAILS_FARAH || '',
          "DETAILS_JAWAHERALSHARQ": this.customerDetails?.DETAILS_JAWAHERALSHARQ || '',
          "FESTIVAL_EID": this.customerDetails?.FESTIVAL_EID || false,
          "FESTIVAL_CHRISTMAS": this.customerDetails?.FESTIVAL_CHRISTMAS || false,
          "FESTIVAL_DIWALI": this.customerDetails?.FESTIVAL_DIWALI || false,
          "FESTIVAL_NATIONALDAY": this.customerDetails?.FESTIVAL_NATIONALDAY || false,
          "FESTIVAL_ONAM": this.customerDetails?.FESTIVAL_ONAM || false,
          "FESTIVAL_PONGAL": this.customerDetails?.FESTIVAL_PONGAL || false,
          "FESTIVAL_NEWYEAR": this.customerDetails?.FESTIVAL_NEWYEAR || false,
          "REASON_OF_PURCHASE": this.customerDetails?.REASON_OF_PURCHASE || '',
          "AGE_GROUP": this.customerDetails?.AGE_GROUP || '',
          "GIFT_PURCHASED_FOR": this.customerDetails?.GIFT_PURCHASED_FOR || '',
          "PURCHASE_OCCASION": this.customerDetails?.PURCHASE_OCCASION || '',
          "NEXT_VISIT": this.customerDetails?.NEXT_VISIT || '',
          "SHOWROOMACCESSIBILITY": this.customerDetails?.SHOWROOMACCESSIBILITY || '',
          "PRODUCTRANGEAVAILABILITY": this.customerDetails?.PRODUCTRANGEAVAILABILITY || '',

          "LOOKING_FOR": this.customerDetails?.LOOKING_FOR || '',

          "POSCUSTIDEXP_DATE": this.customerDataForm.value.fcn_customer_exp_date || this.dummyDate,

          // new fields added 27-12-2023
          "ATTACHMENT_FROM_SCANNER": true,
          "GOOD_QUALITY_A_K_A": "",
          "LOW_QUALITY_A_K_A": "",
          "POSKNOWNABOUT": 0
        },
        retailReceipt: this.receiptDetailsList,
        // "retailReceipt": this.receiptDetailsList.length > 0 ? this.receiptDetailsList : '',
        metalPurchase: this.metalPurchaseDataPost,
        retailsReturn: this.retailSReturnDataPost,
        retailSales: this.retailSalesDataPost,

        "additionalInfo": {
          "giftInfo": [
            {
              "GIFT_TYPE": this.lineItemForm.value.fcn_li_gift_type || '',
              "GIFT_CODE": this.giftTypeOptions.find(e => e.value == this.lineItemForm.value.fcn_li_gift_type)
            }
          ]
        },
        "doctranslog": [ // doubt
          {
            "MID": 0,
            "VOCTYPE": this.vocType,
            "REFMID": this.vocDataForm.value.fcn_voc_no,
            "USERNAME": this.strUser,
            "MODE": this.posMode, // ADD,EDIT,DELETE
            "DATETIME": this.comFunc.cDateFormat(new Date()),
            "REMARKS": "", // reason
            "SYSTEMNAME": "",
            "VOCNO": this.vocDataForm.value.fcn_voc_no || 0,
            "VOCDATE": this.comFunc.cDateFormat(this.vocDataForm.value.vocdate),
            "BRANCH_CODE": this.strBranchcode,
            "MODECHECKED": false,
            "FROM_BRANCH_CODE": this.strBranchcode,
            "AUTH_TOTAL_AMT": 0,
            "AUTH_MAKING_AMT": 0,
            "AUTH_METAL_AMT": 0,
            "AUTH_GROSSWT": 0,
            "AUTH_PUREWT": 0,
            "TVMODECHECKED": false,
            "STOCK_CODE": "",
            "YEARMONTH": this.baseYear,
            "UNIQUEID": "",
            "GROUPSUMMARY": "",
            "PRINTMODECHECKED": false,
            "PARTY_CODE": "",
            "TRANS_REMARKS": "",
            "TOTAL_AMOUNTCC": 0,
            "AUTHORISED_TIME": this.comFunc.cDateFormat(new Date()),
            "AUTHORISED_PERSON": "",
            "EXEVERSIONMONTHYEAR": ""
          }
        ]
        // "transattachment": [
        //   {
        //     "VOCNO": 0,
        //     "VOCTYPE": "string",
        //     "VOCDATE": "2023-12-22T05:22:31.297Z",
        //     "REFMID": 0,
        //     "SRNO": 0,
        //     "REMARKS": "string",
        //     "ATTACHMENT_PATH": "string",
        //     "UNIQUEID": "string",
        //     "CODE": "string",
        //     "ATTACH_TYPE": "string",
        //     "EXPIRE_DATE": "2023-12-22T05:22:31.297Z",
        //     "BRANCH_CODE": "string",
        //     "YEARMONTH": "string",
        //     "DOC_TYPE": "string",
        //     "SUBLED_CODE": "string",
        //     "DOC_ACTIVESTATUS": true,
        //     "DOC_LASTRENEWBY": "string",
        //     "DOC_NEXTRENEWDATE": "2023-12-22T05:22:31.297Z",
        //     "DOC_LASTRENEWDATE": "2023-12-22T05:22:31.297Z",
        //     "DOCUMENT_DATE": "2023-12-22T05:22:31.297Z",
        //     "DOCUMENT_NO": "string",
        //     "FROM_KYC": true,


        //   }
        // ]

      };
      this.isSaved = true;
      this.snackBar.open('Processing...');


      // this.submitAttachment(); // added here for testing purpose
      // this.posPlanetFileInsert(); // added here for testing purpose


      if (this.editOnly) {
        let API = `RetailSalesDataInDotnet/UpdateRetailSalesData?strBranchCode=${this.content.BRANCH_CODE}&strVocType=${this.content.VOCTYPE}&strYearMonth=${this.content.YEARMONTH}&intVocNo=${this.content.VOCNO}`
        this.suntechApi.putDynamicAPI(API, postData)
          .subscribe(
            (res) => {
              this.snackBar.dismiss();
              // try {
              if (res != null) {
                if (res.status == 'SUCCESS') {
                  this.snackBar.open('POS Updated Successfully', 'OK');

                  this.vocDataForm.controls['fcn_voc_no'].setValue(res.response.retailSales.VOCNO);

                  // this.close('reloadMainGrid');
                  if (this.posPlanetIssuing)
                    this.posPlanetFileInsert();

                  this.submitAttachment();

                } else {
                  this.isSaved = false;
                  this.snackBar.open(res.message, 'OK');
                }
              } else {
                this.isSaved = false;
              }
            },
            (error) => {
              console.log(error.error);
              this.isSaved = false;
              this.snackBar.open('Failed', 'OK');
            }
          );
      } else {
        this.suntechApi.postDynamicAPI('RetailSalesDataInDotnet/InsertRetailSalesData', postData).subscribe(
          (res) => {
            this.snackBar.dismiss();
            // try {
            if (res != null) {
              if (res.status == 'SUCCESS') {
                // this.close('reloadMainGrid');

                this.vocDataForm.controls['fcn_voc_no'].setValue(res.response.retailSales.VOCNO);

                if (this.posPlanetIssuing)
                  this.posPlanetFileInsert();

                this.submitAttachment();

                this.snackBar.open('POS Saved', 'OK');
                setTimeout(() => {
                  // location.reload();
                  // this.router.navigateByUrl('/pos');
                }, 500);
              } else {
                this.isSaved = false;
                this.snackBar.open(res.message, 'OK');
                // this.snackBar.open(res.message, 'OK');
              }
            } else {
              this.isSaved = false;
            }
            // (error) => {
            //   console.log(error.error);
            //          this.isSaved = false;
            //   this.snackBar.open('Failed', 'OK');
            // }
            // } catch (error) {
            //   this.isSaved = false;
            //   this.snackBar.open('Failed', 'OK');
            // }
          },
          (error) => {
            console.log(error.error);
            this.isSaved = false;
            this.snackBar.open('Failed', 'OK');
          }
        );
      }

      // this.retailsReturnMain.BRANCH_CODE = this.strBranchcode;
      // this.retailsReturnMain.VOCTYPE = this.vocType;
      // const postData =  this.retailsReturnMain;
    } else {
      //  alert('data '+ JSON.stringify(this.vocDataForm.controls.vocdate.errors))
      if (this.vocDataForm.controls.vocdate.errors != null)
        this.openDialog('Warning', 'You cannot Enter the Future Date', true);
      else if (this.vocDataForm.value.sales_person == '') {
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1767'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.renderer.selectRootElement('#sales_person').focus();
          }
        });
      } else {
        this.openDialog('Warning', 'Please fill customer details', true);
      }
    }
  }

  addNew() {
    // localStorage.setItem('AddNewFlag', '1')
    // this.content.FLAG = null;
    // location.reload();
    this.modalService.dismissAll('OpenModal');

    // if (this.router.url.includes('edit-pos')) this.router.navigateByUrl('/add-pos');
    // if (this.router.url.includes('view-pos')) this.router.navigateByUrl('/add-pos');
    // else location.reload();

    // location.reload();
    // this.router.navigateByUrl('/add-estimation');
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl('/add-pos', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([currentUrl]);
    // });
  }
  cancelBill() {
    location.reload();
  }
  backToList() {
    this.router.navigateByUrl('/pos');
  }


  async sendToEmail() {
    try {

      let _validate: any = this.validateBeforePrint();
      if (_validate[0]) {
        const printContent: any = this.printInvoiceDiv.nativeElement;
        const canvas = await html2canvas(printContent);
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imageData, 'PNG', 10, 10, 190, 0);
        const pdfContent = pdf.output('datauristring');
        const mailtoLink = document.createElement('a');
        mailtoLink.href = 'mailto:?subject=Invoice&body=Please find attached invoice.'
          // +'&attachment='
          + encodeURIComponent(this.printInvoiceDiv.nativeElement.innerHtml);
        // + encodeURIComponent(pdfContent);
        window.location.href = mailtoLink.href;

      } else {
        console.log(_validate[1]);
      }


    } catch (error) {
      console.log('======error email==============================');
      console.log(error);
      console.log('====================================');
    }
  }

  // async generatePdf(printContent: HTMLElement): Promise<string> {
  //   try {
  //     const pdf = new jsPDF();
  //     const pdfPromise = new Promise<string>((resolve) => {
  //       pdf.html(printContent.innerHTML, {
  //         callback: () => {
  //           resolve(pdf.output('datauristring'));
  //         },
  //       });
  //     });

  //     return await pdfPromise;
  //   } catch (error) {
  //     return '';
  //   }
  // }


  printInvoice() {
    let _validate: any = this.validateBeforePrint();
    if (_validate[0]) {
      const printContent: any = document.getElementById('print_invoice');
      var WindowPrt: any = window.open(
        '',
        '_blank',
        `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
      );
      /* WindowPrt.document.write(
        '<html><title>SunTech</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"><style>.anim-rotate {animation: anim-rotate 1s linear infinite;}@keyframes anim-rotate {100% {transform: rotate(360deg);}}.anim-close-card {animation: anim-close-card 1.4s linear;}@keyframes anim-close-card {100% {opacity: 0.3;transform: scale3d(.3, .3, .3);}}.card {box-shadow: $card-shadow;margin-bottom: 30px;transition: all 0.3s ease-in-out;&:hover {box-shadow: 0 0 25px -5px #9e9c9e;}.card-header {border-bottom: $card-header-border;position: relative;+.card-body {padding-top: 0;}h5 {margin-bottom: 0;color: $theme-heading-color;font-size: 14px;font-weight: 700;display: inline-block;margin-right: 10px;line-height: 1.1;position: relative;}.card-header-right {right: 10px;top: 10px;display: inline-block;float: right;padding: 0;position: absolute;@media only screen and (max-width: 575px) {display: none;}.dropdown-menu {margin-top: 0;li {cursor: pointer;a {font-size: 14px;text-transform: capitalize;}}}.btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;color: #888;i {margin-right: 0;}&:after {display: none;}&:focus {box-shadow: none;outline: none;}}// custom toggler .btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;padding: 0;width: 20px;height: 20px;right: 8px;top: 8px;&.mobile-menu span {background-color: #888;height: 2px;border-radius: 5px;&:after, &:before {border-radius: 5px;height: 2px;background-color: #888;}}}.nav-pills {padding: 0;box-shadow: none;background: transparent;}}}.card-footer {padding: 0px !important;background-color: none !important ;border-top: 0px !important}}.card-block, .card-body {padding: 20px 25px;}&.card-load {position: relative;overflow: hidden;.card-loader {position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;background-color: rgba(256, 256, 256,0.7);z-index: 999;i {margin: 0 auto;color: $primary-color;font-size: 24px;align-items: center;display: flex;}}}&.full-card {z-index: 99999;border-radius: 0;}}h4 {margin-bottom: 5px;}.btn-sm, .btn-group-sm>.btn {font-size: 12px;}.view-group {display: -ms-flexbox;display: flex;-ms-flex-direction: row;flex-direction: row;padding-left: 0;margin-bottom: 0;}.thumbnail {height: 180px;margin-bottom: 30px;padding: 0px;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;}.item.list-group-item {float: none;width: 100%;background-color: #fff;margin-bottom: 30px;-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding: 0 1rem;border: 0;}.item.list-group-item .img-event {float: left;width: 30%;}.item.list-group-item .list-group-image {margin-right: 10px;}.item.list-group-item .thumbnail {margin-bottom: 0px;width: 100%;display: inline-block;}.item.list-group-item .caption {float: left;width: 70%;margin: 0;}.item.list-group-item:before, .item.list-group-item:after {display: table;content: " ";}.item.list-group-item:after {clear: both;}.card-title {margin-bottom: 5px;}h4 {font-size: 18px;}.card .card-block, .card .card-body {padding: 10px;}.caption p {margin-bottom: 5px;}.price {font-weight: 500;font-size: 1.25rem;color: #826d22;}.list-group-item .img-fluid {max-width: 75% !important;height: auto;}.list-group-item .img-event {text-align: center;}@media (min-width: 400px) {.list-group-item .table_comp_w {width: 50%;margin-top: -20%;margin-left: 35%;}}:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-infix {padding: .5em 0 .5em 0 !important;}:host ::ng-deep .mat-form-field-wrapper {padding-bottom: 0.34375em;}.prod_weight td, .prod_weight th {padding: 5px 0px;font-size: 12px;}.prod_weight th {background-color: #ededf1;}.prod_weight td {color: #b3852d;}    table, th, td {border: 1px solid black; border-collapse: collapse;  }    th, td {    padding: 5px;    text-align: left;    }</style><body><div>'
      );*/

      // SunTech - POS
      WindowPrt.document.write(
        '<html><head><title>SunTech - POS ' +
        new Date().toISOString() +
        '</title></head><style> table, th, td { border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;text-align: left;}</style><body><div>'
      );
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.write('</div></body></html>');
      WindowPrt.document.close();
      WindowPrt.focus();



      setTimeout(() => {
        WindowPrt.print();
      }, 800);
      console.log('printing... end ');
      console.log(printContent.innerHTML);
      //WindowPrt.close();
    } else {
      // alert(_validate[1]);
      this.snackBar.open(_validate[1], 'OK');
    }
  }
  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  changePCS(event: any) {
    const value = event.target.value;
    if (value != '' && this.validatePCS == true) {
      this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      // this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);

      if (this.blockNegativeStock == 'B') {
        if (this.lineItemPcs < value) {
          this.openDialog(
            'Warning',
            'Current Stock Qty Exceeding Available Stock Qty.',
            true
          );
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls['fcn_li_pcs'].setValue(
                this.lineItemPcs
              );
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                this.lineItemPcs
              );

              this.manageCalculations();
            }
            // this.setTotalAmount();
            // this.changeGrossWt({target:{value }});

            // this.setGrossAmt();
            // this.setRate();
          });
        } else {
          this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
          this.manageCalculations();
        }
      } else if (this.blockNegativeStock == 'W') {
        if (this.lineItemPcs < value) {
          this.openDialog(
            'Warning',
            'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
            false
          );
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'No') {
              this.lineItemForm.controls['fcn_li_pcs'].setValue(
                this.lineItemPcs
              );
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                this.lineItemPcs
              );

              this.manageCalculations();

              // this.setTotalAmount();

              // this.changeGrossWt({target:{value:this.lineItemPcs }});

              // this.setGrossAmt();
              // this.setRate();
            } else {
              // this.changeGrossWt({ target: { value: this.lineItemPcs } });

              // this.setGrossAmt();
              // this.setRate();
              // this.setTotalAmount();
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
              this.manageCalculations();
            }
          });
        } else {
          this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
          this.manageCalculations();
        }
      } else {
        // blockNegativeStock = 'A'
        // this.setGrossAmt();
        // this.setRate();
        // this.changeGrossWt({target:{value:0 }});
        // this.setTotalAmount();
        this.manageCalculations();
      }
    } else {
      if (this.validatePCS == true)
        this.lineItemForm.controls['fcn_li_gross_wt'].setValue(0);
      this.changeGrossWt({ target: { value: this.zeroMQtyVal } });

      // this.setGrossAmt();
      // this.setRate();
      // this.setTotalAmount();
      this.manageCalculations();
    }
  }
  changeGrossWt(event: any) {
    this.lineItemForm.controls.fcn_li_gross_wt.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.mQtyDecimals,
        this.comFunc.emptyToZero(event.target.value)
      )
    );
    console.log('====================================');
    console.log(
      this.comFunc.transformDecimalVB(
        this.comFunc.mQtyDecimals,
        this.comFunc.emptyToZero(event.target.value)
      )
    );
    console.log('====================================');
    const value = event.target.value;
    if (value != '' && this.validatePCS == false) {
      if (this.blockNegativeStock == 'B') {
        if (this.lineItemGrossWt < value) {
          this.openDialog(
            'Warning',
            'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
            true
          );
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                this.lineItemGrossWt
              );
              // this.setNettWeight();
              this.manageCalculations();
            }
          });
        } else {
          // this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
          this.manageCalculations();
        }
      } else if (this.blockNegativeStock == 'W') {
        if (this.lineItemGrossWt < value) {
          this.openDialog(
            'Warning',
            'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
            false
          );
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'No') {
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                this.lineItemGrossWt
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
  async validateMinSalePriceByTotalAmt(value: any, totalAmt: any, lsTotalAmt: any, nettAmt: any = null) {
    // alert(this.lineItemForm.value.fcn_li_net_amount)
    if (value != '') {

      let isAuth: any = false;

      // alert('validateMinSalePriceByTotalAmt parseFloat(value)'+parseFloat(value)+'STOCK_COST' +this.newLineItem.STOCK_COST );
      if (this.lineItemModalForSalesReturn || parseFloat(value) >= parseFloat(this.newLineItem.STOCK_COST)) {

        if (this.blockMinimumPrice == 'B') {
          if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
            if (this.userwiseDiscount) {
              isAuth = await this.openAuthModal();
              if (isAuth) {
                this.validateMinSalePriceByTotalAmtFunc('B', value, totalAmt, lsTotalAmt, nettAmt);
              } else {
                this.lineItemForm.controls.fcn_li_rate.setValue('');
                this.renderer.selectRootElement('#fcn_li_rate').focus();
              }
            } else {
              this.validateMinSalePriceByTotalAmtFunc('B', value, totalAmt, lsTotalAmt, nettAmt);
            }
          } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(value);
            this.manageCalculations({ totalAmt: totalAmt, nettAmt });
          }
        }
        else if (this.blockMinimumPrice == 'W') {
          if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
            if (this.userwiseDiscount) {
              isAuth = await this.openAuthModal();
              if (isAuth) {
                this.validateMinSalePriceByTotalAmtFunc('W', value, totalAmt, lsTotalAmt, nettAmt);
              } else {
                this.lineItemForm.controls.fcn_li_rate.setValue('');
                this.renderer.selectRootElement('#fcn_li_rate').focus();
              }
            } else {
              this.validateMinSalePriceByTotalAmtFunc('W', value, totalAmt, lsTotalAmt, nettAmt);
            }
          } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(value);
            // this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
            this.manageCalculations({ totalAmt: totalAmt, nettAmt });
          }
        } else {
          // blockMinimumPrice = 'A'
          this.lineItemForm.controls.fcn_li_rate.setValue(value);
          this.manageCalculations({ totalAmt: totalAmt, nettAmt });
        }

      } else {
        // alert('STOCK_COST' + this.newLineItem.STOCK_COST + 'rate' + value);
        // Rate Cannot be Less Than Cost
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls.fcn_li_rate.setValue(
              ''
              // this.comFunc.transformDecimalVB(
              //   this.comFunc.amtDecimals,
              //   this.zeroAmtVal
              // )
            );
            this.renderer.selectRootElement('#fcn_li_rate').focus();
          }
        });
      }

    } else {
      this.lineItemForm.controls.fcn_li_rate.setValue(0);
      this.lineItemForm.controls.fcn_li_total_amount.setValue(0);
      this.manageCalculations();
    }

  }

  validateMinSalePriceByTotalAmtFunc(bOrW: String, value: any, totalAmt: any, lsTotalAmt: any, nettAmt: any = null) {

    this.openDialog(
      'Warning',
      // 'The rate is below to the minimum price, Do you want to Continue?',
      `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
      }`,
      bOrW == 'B' ? true : false
    );

    this.dialogBox.afterClosed().subscribe((data: any) => {

      if (data == 'OK') {
        this.lineItemForm.controls.fcn_li_total_amount.setValue(lsTotalAmt);
        this.manageCalculations();
      }
      if (data == 'No') {
        // document.execCommand('undo', true, null);
        this.lineItemForm.controls.fcn_li_total_amount.setValue(
          lsTotalAmt
        );
        const lsNettAmt = localStorage.getItem('fcn_li_net_amount')
        // alert('lsNettAmt'+lsNettAmt);
        this.manageCalculations();
        // this.manageCalculations({ nettAmt: lsNettAmt });
      } else {
        this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
        this.lineItemForm.controls.fcn_li_rate.setValue(value);
        this.manageCalculations({ totalAmt: totalAmt, nettAmt });
      }
    });


  }
  validateMinSalePrice() {
    const grossAmt = this.lineItemForm.value.fcn_li_gross_amount;
    const grossWt = this.lineItemForm.value.fcn_li_gross_wt;
    const value = (grossAmt / grossWt).toString();
    // const value = (grossAmt / grossWt).toFixed(2);
    // alert(this.blockMinimumPriceValue + '_' + value);
    console.log('==============validateMinSalePrice======================');
    console.log(value);
    console.log('====================================');


    // if (value != '') {

    let checkStockCostVal =
      parseFloat(this.lineItemForm.value.fcn_li_net_amount) /
      parseFloat(this.lineItemForm.value.fcn_li_gross_wt);

    // alert('checkStockCostVal ' + checkStockCostVal + 'STOCK_COST ' + this.newLineItem.STOCK_COST);
    if (this.divisionMS == 'S') {
      if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
        this.manageCalculations();
        // if (this.blockMinimumPrice == 'B') {
        //   if (parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
        //     this.openDialog(
        //       'Warning',
        //       `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
        //       }`,
        //       // 'The rate is below to the minimum price, Do you want to Continue?','
        //       true
        //     );
        //     this.dialogBox.afterClosed().subscribe((data) => {
        //       if (data == 'OK') {
        //         this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(
        //           0
        //         );
        //         // this.changeDisPer({ target: { value: 0 } });
        //         this.manageCalculations();
        //       }
        //     });
        //   } else {
        //     this.manageCalculations();
        //   }
        // }
        // else if (this.blockMinimumPrice == 'W') {
        //   if (parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
        //     this.openDialog(
        //       'Warning',
        //       // 'The rate is below to the minimum price, Do you want to Continue?',
        //       `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
        //       }`,
        //       false
        //     );
        //     this.dialogBox.afterClosed().subscribe((data) => {
        //       if (data == 'No') {
        //         this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(
        //           0
        //         );
        //         // this.changeDisPer({ target: { value: 0 } });
        //         this.manageCalculations();

        //       } else {
        //         this.manageCalculations();
        //       }
        //     });
        //   }
        //   else {
        //     this.manageCalculations();
        //   }
        // } else {
        //   // blockMinimumPrice = 'A'
        //   this.manageCalculations();
        // }
      }
      else {
        // Rate Cannot be Less Than Cost
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
              this.zeroAmtVal
              // this.comFunc.transformDecimalVB(
              //   this.comFunc.amtDecimals,

              // )
            );
            this.lineItemForm.controls.fcn_li_discount_amount.setValue(
              this.zeroAmtVal
            );
            this.manageCalculations();
          }
        });
      }
    }
    // }
  }

  disFunc(disAmt: any) {
    // this.manageCalculations({ disAmt: disAmt, nettAmt });
    this.lineItemForm.controls.fcn_li_discount_amount.setValue(
      // Math.round(parseFloat(value)).toFixed(2)
      disAmt
    );


    this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        parseFloat(this.lineItemForm.value.fcn_li_total_amount) -
        disAmt
      )
    );

    let taxAmount;
    taxAmount = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      this.getPercentage(
        parseFloat(this.lineItemForm.value.fcn_li_tax_percentage),
        parseFloat(this.lineItemForm.value.fcn_li_gross_amount)
      )
    );
    this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
      this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, taxAmount)
    );


    /** set nett amount */
    const netAmtValue =
      parseFloat(this.lineItemForm.value.fcn_li_gross_amount) +
      parseFloat(this.lineItemForm.value.fcn_li_tax_amount);
    this.lineItemForm.controls['fcn_li_net_amount'].setValue(
      this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, netAmtValue)
    );
    localStorage.setItem('fcn_li_net_amount', netAmtValue.toString())

    this.validateMinSalePrice()
  }
  changeDisPer(event: any, discountAmt = null, nettAmt = null) {
    // alert(event.target.value);
    // alert('disAmt '+discountAmt );

    if (event.target.value != '') {
      let disAmt;
      if (discountAmt != null && nettAmt == null) {
        disAmt = discountAmt;
        this.disFunc(disAmt);
      }

      if (discountAmt == null && nettAmt == null) {
        const value = this.getPercentage(
          this.lineItemForm.value.fcn_li_discount_percentage,
          this.lineItemForm.value.fcn_li_total_amount
        );
        disAmt = this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          value
        );
        this.disFunc(disAmt);

      } else {
        disAmt = this.lineItemForm.value.fcn_li_discount_amount;
        // alert('********disAmt******' + disAmt);
        // alert('********grossAmt******' + this.lineItemForm.value.fcn_li_gross_amount);
        // alert('********nettAmt****** ' + nettAmt + 'type ' + typeof nettAmt);
        this.manageCalculations({ disAmt: disAmt, nettAmt });
      }

      // this.setGrossAmt();
      // alert('pre nettAmt ' + this.lineItemForm.value.fcn_li_net_amount)
      // alert('nettAmt ' + parseFloat(disAmt) + parseFloat(this.lineItemForm.value.fcn_li_gross_amount))


      // need to enable
      // this.validateMinSalePrice();

    } else {
      this.lineItemForm.controls.fcn_li_discount_amount.setValue(0.0);
      // this.setGrossAmt();
      this.manageCalculations();
    }
  }
  async rateFunc(value: any) {
    let isAuth: any = false;
    // if(this.userwiseDiscount)
    isAuth = await this.openAuthModal();
    // alert(`validated ${isAuth}`);

    if (this.blockMinimumPrice == 'B') {
      if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
        if (this.userwiseDiscount) {
          isAuth = await this.openAuthModal();
          if (isAuth) {
            this.rateFuncDetail('B', value);
          } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(
              this.zeroAmtVal
            );
            this.manageCalculations();
          }
        } else {
          this.rateFuncDetail('B', value);
        }
      } else {
        this.manageCalculations();
      }
    }
    else if (this.blockMinimumPrice == 'W') {
      if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
        if (this.userwiseDiscount) {
          isAuth = await this.openAuthModal();
          if (isAuth) {
            this.rateFuncDetail('W', value);
          } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(
              this.zeroAmtVal
            );
            this.manageCalculations();
          }
        } else {
          this.rateFuncDetail('W', value);
        }
      }
      else {
        this.manageCalculations();
      }
    } else {
      // blockMinimumPrice = 'A'
      this.manageCalculations();
    }
  }

  rateFuncDetail(bOrW: String, value: any) {
    this.openDialog(
      'Warning',
      `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
      }`,
      // 'The rate is below to the minimum price, Do you want to Continue?','
      bOrW == 'B' ? true : false
    );
    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data == 'OK') {
        // this.lineItemForm.controls.fcn_li_rate.setValue(
        //   this.blockMinimumPriceValue
        // );
        this.lineItemForm.controls.fcn_li_rate.setValue(
          this.zeroAmtVal
        );
        this.manageCalculations();
      }
      if (data == 'No') {
        this.lineItemForm.controls.fcn_li_rate.setValue(
          this.zeroAmtVal
        );
        this.manageCalculations();

      } else {
        this.manageCalculations();
      }
    });
  }

  changeRate(event: any) {

    const karatComp22 = this.comFunc.allbranchMaster?.KARATCOMPANY22;
    const minBranchProfitPercentMetal = this.comFunc.allbranchMaster?.MINBRANCHPROFITPERCENTMETAL;

    const preVal = localStorage.getItem('fcn_li_rate');
    const value = event.target.value;
    if (event.target.value != '') {

      if (this.divisionMS == 'M') {

        let dblStockCost: any = this.comFunc.emptyToZero(this.newLineItem.STOCK_COST);
        let dblStockFcCost: any;
        let karatCode = this.newLineItem.KARAT_CODE;

        if (this.comFunc.compCurrency == 'AED') {

          if ((dblStockCost <= 5) && (this.comFunc.compAcCode == "JHO001") && (karatComp22 == false)) {
            if (karatCode.toString() == "24") {
              dblStockFcCost = dblStockCost + 1;
            }
            else {
              dblStockFcCost = dblStockCost + 5;
            }
          }
          else
            if ((dblStockCost <= .5) && (this.comFunc.compAcCode == "JHROR1")) {
              dblStockCost = dblStockCost + .5;
            }
            else {
              dblStockFcCost = dblStockCost + (dblStockCost * minBranchProfitPercentMetal / 100.00);
            }
        }
        else {
          if ((dblStockCost <= 5) && (this.comFunc.compAcCode == "JHO001") && (karatComp22 == false)) {
            if (karatCode == "24") {
              dblStockFcCost =
                this.comFunc.CCToFC(this.vocDataForm.value.txtCurrency, (dblStockCost + 1), this.vocDataForm.value.txtCurRate);
            }
            else {

              dblStockFcCost =
                this.comFunc.CCToFC(this.vocDataForm.value.txtCurrency, (dblStockCost + 5), this.vocDataForm.value.txtCurRate);
            }
          }
          else {
            dblStockFcCost =
              this.comFunc.CCToFC(this.vocDataForm.value.txtCurrency, (dblStockCost + (dblStockCost * minBranchProfitPercentMetal / 100.00)), this.vocDataForm.value.txtCurRate);
          }
        }

        this.lineItemForm.controls.fcn_li_rate.setValue(dblStockFcCost);
        if (!this.newLineItem.LESSTHANCOST) {

          // if (blnCheckBulk == false && blnLessThanCost == false) //doubt
          {
            if (this.comFunc.emptyToZero(this.vocDataForm.value.txtCurRate) < dblStockFcCost) {

              this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
              this.dialogBox.afterClosed().subscribe((data: any) => {
                if (data == 'OK') {
                  this.lineItemForm.controls.fcn_li_rate.setValue(
                    ''
                  );
                  this.renderer.selectRootElement('#fcn_li_rate').focus();
                }
              });
              return;
            }
          }
        }

        // if (this.lineItemModalForSalesReturn || parseFloat(value) >= parseFloat(this.newLineItem.STOCK_COST)) {

        //   this.rateFunc(value);
        // }
        // else {
        //   // alert('STOCK_COST' + this.newLineItem.STOCK_COST + 'rate' + value);
        //   // Rate Cannot be Less Than Cost
        //   this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
        //   this.dialogBox.afterClosed().subscribe((data: any) => {
        //     if (data == 'OK') {
        //       this.lineItemForm.controls.fcn_li_rate.setValue(
        //         ''
        //         // this.comFunc.transformDecimalVB(
        //         //   this.comFunc.amtDecimals,
        //         //   this.zeroAmtVal
        //         // )
        //       );
        //       this.renderer.selectRootElement('#fcn_li_rate').focus();
        //     }
        //   });
        // }
      }
      let checkStockCostVal =
        parseFloat(this.lineItemForm.value.fcn_li_net_amount) /
        parseFloat(this.lineItemForm.value.fcn_li_gross_wt);

      if (this.divisionMS == 'S') {
        if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
          this.rateFunc(value);
        }
        else {
          // Rate Cannot be Less Than Cost
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls.fcn_li_net_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.amtDecimals,
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
  changeTotalAmt(event: any, nettAmt = null) {
    const val = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      event.target.value
    );
    if (event.target.value != '') {
      const value = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.lineItemForm.value.fcn_li_total_amount /
        this.lineItemForm.value.fcn_li_gross_wt
      );
      // this.lineItemForm.controls.fcn_li_rate.setValue(value);
      // this.manageCalculations();
      // alert(value);
      const lsTotalAmt: any = localStorage.getItem('fcn_li_total_amount');
      this.validateMinSalePriceByTotalAmt(
        value,
        val,
        parseFloat(lsTotalAmt),
        nettAmt
      );
      // if (this.lineItemForm.value.fcn_li_stone_wt != '' || this.lineItemForm.value.fcn_li_stone_wt != 0 && this.divisionMS == 'M') {
      //   this.renderer.selectRootElement('#fcn_ad_stone_amount').focus();
      // }
    } else {
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
      // this.setGrossAmt();
      this.manageCalculations();
    }
  }

  /** start Calculations for exchange item */
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
  setExMetalAmt() {
    this.exchangeForm.controls['fcn_exchange_metal_amount'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.mQtyDecimals,
        // _exchangeMetalRate * _exchangeNetWt
        this.exchangeForm.value.fcn_exchange_metal_rate *
        this.exchangeForm.value.fcn_exchange_pure_weight
      )
    );
  }

  setOzWt() {
    this.ozWeight = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      parseFloat(this.exchangeForm.value.fcn_exchange_pure_weight || 0) /
      31.1035
    );
    return this.ozWeight;
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
  changeExchangeNettWt(event: any) {
    if (event.target.value != '') {
      this.setExchangeStoneWt();
      this.setExchangePureWt();
      this.setExchangeMakingAmt();
      this.setExStoneAmt();
      this.setExNetAmt();
    } else {
      this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(
        this.zeroAmtVal
      );
    }
  }
  changeExMakingRate(event: any) {
    if (event.target.value != '') {
      this.setExchangeMakingAmt();
    } else {
      this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
        this.zeroAmtVal
      );
      this.setExchangeMakingAmt();
    }
  }

  changeExchangeStoneWt(event: any) {
    const value = event.target.value;
    if (value != '') {
      this.setExchangeNettWt();
      this.setExchangePureWt();
      this.setExStoneAmt();
      this.setExNetAmt();
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
      // this.setExchangeNettWt();
      // this.setExchangePureWt();
      // this.setExStoneAmt();
      // this.setExNetAmt();
    } else {
      this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
        this.zeroMQtyVal
      );
    }
  }
  /** end Calculations for exchange item */
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

  changeGrossFunc(totalAmt: any, grossAmt: any) {

    this.lineItemForm.controls.fcn_li_discount_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        parseFloat(totalAmt) - parseFloat(grossAmt)
      )
    );
    const disPer = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      (this.lineItemForm.value.fcn_li_discount_amount /
        this.lineItemForm.value.fcn_li_total_amount) *
      100
    );
    this.lineItemForm.controls.fcn_li_discount_percentage.setValue(disPer);

    this.setTaxAmt();

    this.setNettAmt();

  }
  changeGrossAmt(event: any) {
    const preVal = localStorage.getItem('fcn_li_gross_amount');
    if (event.target.value != '') {
      let totalAmt = this.lineItemForm.value.fcn_li_total_amount;
      let grossAmt = event.target.value;
      if (this.divisionMS == 'S') {

        const taxAmt = this.getPercentage(
          this.lineItemForm.value.fcn_li_tax_percentage,
          this.lineItemForm.value.fcn_li_gross_amount
        );

        const value =
          parseFloat(this.lineItemForm.value.fcn_li_gross_amount) +
          parseFloat(this.lineItemForm.value.fcn_li_tax_amount);


        const nettAmt = this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          value
        );

        // alert(`grossAmt ${grossAmt} value ${value} nettAmt ${nettAmt} `);

        let checkStockCostVal =
          parseFloat(nettAmt) /
          parseFloat(this.lineItemForm.value.fcn_li_gross_wt);

        if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {

          localStorage.setItem('fcn_li_gross_amount', this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals, event.target.value).toString());

          this.changeGrossFunc(totalAmt, grossAmt);


        } else {
          // Rate Cannot be Less Than Cost
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls.fcn_li_gross_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.amtDecimals,
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
        // let mkgAmt = this.comFunc.emptyToZero(
        //   this.lineItemForm.value.fcn_li_total_amount
        // );
        let mtlAmt = this.comFunc.emptyToZero(
          this.lineItemForm.value.fcn_ad_metal_amount
        );
        let mkgAmt = parseFloat(grossAmt) - (stoneAmt + mtlAmt)
        this.changeTotalAmt({ target: { value: mkgAmt } });
        // console.log(stoneAmt, mkgAmt, mtlAmt);
        // this.lineItemForm.controls.fcn_ad_amount.setValue(
        //   (parseFloat(stoneAmt) + parseFloat(mkgAmt) + parseFloat(mtlAmt)).toFixed(
        //     2
        //   )
        // );

        this.setTaxAmt();
        this.setNettAmt();
      }
    } else {
    }
  }

  netAmtFunc(event: any) {
    this.lineItemForm.controls.fcn_li_net_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        event.target.value
      )
    );

    const taxAmt = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) *
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage)) /
      (100 + this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage))
    );
    const grossAmt =
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        parseFloat(this.lineItemForm.value.fcn_li_net_amount) -
        parseFloat(taxAmt));


    let totalAmt;
    if (this.divisionMS == 'M') {
      totalAmt = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        parseFloat(grossAmt) -
        (parseFloat(this.lineItemForm.value.fcn_ad_stone_amount || 0) +
          parseFloat(this.lineItemForm.value.fcn_ad_metal_amount || 0))
      );
    } else {
      totalAmt = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.lineItemForm.value.fcn_li_total_amount
      );
    }

    // Math.round(
    //   grossAmt -
    //   (parseFloat(
    //     this.lineItemForm.value.fcn_ad_stone_amount || 0
    //   ) +
    //     parseFloat(
    //       this.lineItemForm.value.fcn_ad_metal_amount || 0
    //     ))
    // ).toFixed(2);
    // alert('totalAmt ' + totalAmt);
    console.log(grossAmt, totalAmt, taxAmt);
    const discountAmt = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      parseFloat(totalAmt) - parseFloat(grossAmt)
    );

    // alert(discountAmt);

    // this.lineItemForm.controls.fcn_li_tax_amount.setValue(taxAmt);
    // this.lineItemForm.controls.fcn_li_gross_amount.setValue(grossAmt);

    this.lineItemForm.controls.fcn_li_tax_amount.setValue(taxAmt);
    this.lineItemForm.controls.fcn_li_gross_amount.setValue(grossAmt);
    this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);

    console.log('dis amount', discountAmt);
    // alert(`taxamt ${taxAmt} grossamt ${grossAmt} totaamt ${totalAmt} disAmt ${discountAmt}`);

    if (this.divisionMS == 'M') {
      this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
      this.changeTotalAmt(
        { target: { value: totalAmt } },
        this.lineItemForm.value.fcn_li_net_amount
      );
    } else {
      this.lineItemForm.controls.fcn_li_discount_amount.setValue(
        discountAmt
      );
      this.changeDisAmount(
        { target: { value: discountAmt } },
        this.lineItemForm.value.fcn_li_net_amount
      );
    }

  }
  async changeNettAmt(event: any) {

    // console.log('==============changeNettAmt======================');
    // console.log(localStorage.getItem('fcn_li_net_amount'));
    // console.log('====================================');
    const preVal = localStorage.getItem('fcn_li_net_amount');
    if (event.target.value != '') {
      let checkStockCostVal =
        parseFloat(this.lineItemForm.value.fcn_li_net_amount) /
        parseFloat(this.lineItemForm.value.fcn_li_gross_wt);
      // alert('checkStockCostVal '+ checkStockCostVal +' STOCK_COST' + parseFloat(this.newLineItem.STOCK_COST));

      if (this.divisionMS == 'M') {

        if (
          // this.lineItemModalForSalesReturn ||

          parseFloat(this.lineItemForm.value.fcn_li_net_amount) >
          parseFloat(this.lineItemForm.value.fcn_ad_metal_amount)
        ) {
          this.netAmtFunc(event);
        } else {
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1914'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls.fcn_li_net_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.amtDecimals,
                  preVal
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
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls.fcn_li_net_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.amtDecimals,
                  preVal
                )
              );
            }
          });
        }
      }

      // this.lineItemForm.controls.fcn_li_rate.setValue(value);
      // this.manageCalculations();
      // alert(value);
      // const lsTotalAmt = localStorage.getItem('fcn_li_total_amount');
      // this.validateMinSalePriceByTotalAmt(value, parseFloat(event.target.value).toFixed(2), parseFloat(lsTotalAmt).toFixed(2));
    } else {
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(
        this.zeroAmtVal
      );
      this.lineItemForm.controls['fcn_ad_amount'].setValue(this.zeroAmtVal);
      // this.setGrossAmt();
      this.manageCalculations();
    }
  }

  changeDisAmount(event: any, nettAmt: any = null) {
    if (event.target.value != '') {
      const value =
        // (
        //   (this.lineItemForm.value.fcn_li_discount_amount /
        //     this.lineItemForm.value.fcn_li_total_amount) *
        //   100
        // ).toFixed(2);
        this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          (this.lineItemForm.value.fcn_li_discount_amount /
            this.lineItemForm.value.fcn_li_total_amount) *
          100
        );

      this.lineItemForm.controls.fcn_li_discount_percentage.setValue(value);
      console.log('dis amount', value);
      // alert('dis per' + value.toString());
      // alert('nettAmt '+nettAmt);
      this.changeDisPer({ target: { value: value } }, event.target.value, nettAmt);

      // this.validateMinSalePrice();
      // const lsTotalAmt = localStorage.getItem('fcn_li_total_amount');
      // this.validateMinSalePriceByTotalAmt(value, parseFloat(event.target.value).toFixed(2),  parseFloat(lsTotalAmt).toFixed(2));
    } else {
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(0.0);

      // this.setGrossAmt();
      this.manageCalculations();
    }
  }

  manageCalculations(
    argsData: any = { totalAmt: null, nettAmt: null, disAmt: null }
  ) {
    console.log('====================================');
    console.log('manageCalculations', argsData);
    console.log('====================================');

    /** set nett weight */
    this.lineItemForm.controls['fcn_li_net_wt'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.mQtyDecimals,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) -
        this.comFunc.emptyToZero(
          parseFloat(this.lineItemForm.value.fcn_li_stone_wt)
        )
      )
    );

    /**  set pure weight */
    this.lineItemForm.controls.fcn_li_pure_wt.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.mQtyDecimals,
        this.lineItemForm.value.fcn_li_net_wt *
        this.lineItemForm.value.fcn_li_purity
      )
    );

    /** set stone amount */
    this.lineItemForm.controls['fcn_ad_stone_amount'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt) *
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate)
      )
    );

    /** set metal amount */
    this.lineItemForm.controls['fcn_ad_metal_amount'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate) *
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt)
      )
    );

    /**  set making amount (total amount) */
    let mkgvalue;
    if (argsData.totalAmt != null) {
      // alert(argsData.totalAmt + '_' + argsData.nettAmt)
      mkgvalue = argsData.totalAmt;
    } else {
      // mkgvalue =
      //   this.lineItemForm.value.fcn_li_rate *
      //   this.lineItemForm.value.fcn_li_gross_wt;

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
          this.lineItemForm.value.fcn_li_rate *
          this.lineItemForm.value.fcn_li_gross_wt;
      }
    }

    // const mkgvalue = (
    //   this.lineItemForm.value.fcn_li_rate *
    //   this.lineItemForm.value.fcn_li_gross_wt
    // ).toFixed(2);

    this.lineItemForm.controls['fcn_li_total_amount'].setValue(
      // Math.round(parseFloat(mkgvalue)).toFixed(2)

      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        parseFloat(mkgvalue)
      )
    );

    // set localstorage for get value
    localStorage.setItem(
      'fcn_li_total_amount',
      // Math.round(parseFloat(mkgvalue)).toFixed(2)
      this.comFunc
        .transformDecimalVB(this.comFunc.amtDecimals, mkgvalue)
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


    console.log('====================================');
    console.log(stoneAmt, mkgAmt, mtlAmt);
    console.log('====================================');



    /**  set Gross amt */
    if (argsData.nettAmt == null) {
      if (this.divisionMS == 'M') {
        // console.log('====================================');
        // console.log(
        //   typeof this.lineItemForm.value.fcn_ad_amount,
        //   this.lineItemForm.value.fcn_ad_amount,
        //   typeof this.lineItemForm.value.fcn_li_discount_amount,
        //   this.lineItemForm.value.fcn_li_discount_amount
        // );
        // console.log('====================================');
        // this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
        //   // Math.round(
        //   //   this.lineItemForm.value.fcn_ad_amount -
        //   //   this.lineItemForm.value.fcn_li_discount_amount
        //   // ).toFixed(2)
        //   this.comFunc.transformDecimalVB(
        //     this.comFunc.amtDecimals,
        //     this.lineItemForm.value.fcn_ad_amount -
        //     this.lineItemForm.value.fcn_li_discount_amount
        //   )
        // );
        this.lineItemForm.controls.fcn_li_gross_amount.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.comFunc.emptyToZero(stoneAmt) + this.comFunc.emptyToZero(mkgAmt) + this.comFunc.emptyToZero(mtlAmt)
          )
        );
      } else {
        /* divisionMS == s, set total amount to gross amt */
        this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
          // Math.round(
          //   this.lineItemForm.value.fcn_li_total_amount -
          //   this.lineItemForm.value.fcn_li_discount_amount
          // ).toFixed(2)
          this.comFunc.transformDecimalVB(
            this.comFunc.amtDecimals,
            this.lineItemForm.value.fcn_li_total_amount -
            this.lineItemForm.value.fcn_li_discount_amount
          )
        );
      }
    }

    if (argsData.nettAmt == null) {
      /** set tax amount */
      let taxAmount;
      taxAmount = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.getPercentage(
          parseFloat(this.lineItemForm.value.fcn_li_tax_percentage),
          parseFloat(this.lineItemForm.value.fcn_li_gross_amount)
        )
      );
      this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
        // Math.round(parseFloat(value)).toFixed(2)
        this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, taxAmount)
      );
      this.li_tax_amount_val = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        taxAmount
      );

      /** set nett amount */
      const netAmtValue =
        parseFloat(this.lineItemForm.value.fcn_li_gross_amount) +
        parseFloat(this.lineItemForm.value.fcn_li_tax_amount);
      this.lineItemForm.controls['fcn_li_net_amount'].setValue(
        this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, netAmtValue)
      );
      this.li_net_amount_val = this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        netAmtValue
      );
      this.lineItemForm.controls['fcn_li_net_amount'].setValue(
        this.comFunc.transformDecimalVB(this.comFunc.amtDecimals, netAmtValue)
      );

    } else {

      // taxAmount = this.lineItemForm.value.fcn_li_tax_amount;
    }

    // this.li_tax_amount_val = Math.round(parseFloat(value)).toFixed(2);

    // this.li_net_amount_val =  Math.round(netAmtValue).toFixed(2);
  }

  setNettWeight() {
    this.lineItemForm.controls['fcn_li_net_wt'].setValue(
      (
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) -
        this.comFunc.emptyToZero(
          parseInt(this.lineItemForm.value.fcn_li_stone_wt)
        )
      ).toFixed(2)
    );
    this.setPurityWeight();
    this.setMetalAmt();
    if (this.divisionMS == 'M') {
      this.getAllTotalAmt();
    } else this.setTotalAmount();
  }
  setGrossAmt() {
    this.lineItemForm.controls['fcn_li_gross_amount'].setValue(
      Math.round(
        this.lineItemForm.value.fcn_li_total_amount -
        this.lineItemForm.value.fcn_li_discount_amount
      ).toFixed(2)
    );
    this.setTaxAmt();
  }
  setTaxAmt() {
    const value = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals, this.getPercentage(
        this.lineItemForm.value.fcn_li_tax_percentage,
        this.lineItemForm.value.fcn_li_gross_amount
      ));
    this.lineItemForm.controls['fcn_li_tax_amount'].setValue(value);
    this.li_tax_amount_val = value;
    this.setNettAmt();
  }
  setNettAmt() {

    const value =
      parseFloat(this.lineItemForm.value.fcn_li_gross_amount) +
      parseFloat(this.lineItemForm.value.fcn_li_tax_amount);
    console.log('value', value);
    const nettAmt = this.comFunc.transformDecimalVB(
      this.comFunc.amtDecimals,
      value
    );
    this.lineItemForm.controls['fcn_li_net_amount'].setValue(nettAmt);
    // this.order_items_total_gross_amount = value;
    this.li_net_amount_val = nettAmt;


  }
  setPurityWeight() {
    this.lineItemForm.controls.fcn_li_pure_wt.setValue(
      (
        this.lineItemForm.value.fcn_li_net_wt *
        this.lineItemForm.value.fcn_li_purity
      ).toFixed(2)
    );
  }
  setStoneAmt() {
    this.lineItemForm.controls['fcn_ad_stone_amount'].setValue(
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_stone_wt) *
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate)
    );
    // this.getAllTotalAmt();
    if (this.divisionMS == 'M') this.getAllTotalAmt();
    else this.setTotalAmount();
  }
  setMetalAmt() {
    this.lineItemForm.controls['fcn_ad_metal_amount'].setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate) *
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt)
      )
    );
    // this.lineItemForm.controls['fcn_ad_metal_amount'].setValue((this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate) * this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_purity)).toFixed(2));
  }
  setMakingAmt() {
    // console.log('====================================');
    // console.log(this.lineItemForm.value.fcn_ad_making_rate, this.lineItemForm.value.fcn_li_gross_wt);
    // console.log('====================================');
    this.lineItemForm.controls['fcn_ad_making_amount'].setValue(
      (
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_making_rate) *
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)
      ).toFixed(2)
    );
  }
  setRate() {
    const value = (
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) /
      this.lineItemForm.value.fcn_li_gross_wt
    ).toFixed(2);
    this.lineItemForm.controls.fcn_li_rate.setValue(value);
    // this.setGrossAmt();
  }
  setTotalAmount() {
    const value = (
      this.lineItemForm.value.fcn_li_rate *
      this.lineItemForm.value.fcn_li_gross_wt
    ).toFixed(2);
    this.lineItemForm.controls['fcn_li_total_amount'].setValue(value);
    // this.setGrossAmt();
  }

  getAllTotalAmt() {
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


    this.lineItemForm.controls.fcn_ad_amount.setValue(
      (this.comFunc.emptyToZero(stoneAmt) + this.comFunc.emptyToZero(mkgAmt) + this.comFunc.emptyToZero(mtlAmt)).toFixed(
        2
      )
    );
    // this.lineItemForm.controls.fcn_li_total_amount.setValue(
    //   (parseFloat(stoneAmt) + parseFloat(mkgAmt) + parseFloat(mtlAmt)).toFixed(
    //     2
    //   )
    // );
    this.setGrossAmt();
  }
  getPercentage(percent: any, total: any) {
    return (parseFloat(percent.toString()) / 100) * parseFloat(total.toString());
    // return ((percent / 100) * total).toFixed(2);
  }
  setMetalRate(karatCode: any) {
    const value: any = this.karatRateDetails.filter(
      (data: any) => data.KARAT_CODE == karatCode
    )[0].KARAT_RATE;
    this.lineItemForm.controls.fcn_ad_metal_rate.setValue(value);
  }
  changeStoneWt(event: any) {
    const value = event.target.value;
    // alert(value + '_' + this.lineItemForm.value.fcn_li_gross_wt);
    if (value != '') {
      if (
        parseFloat(value) > parseFloat(this.lineItemForm.value.fcn_li_gross_wt)
      ) {
        this.openDialog(
          'Warning',
          'Stone weight cannot be exceeded Gross weight',
          true
        );
        // this.stoneWtPreVal = 0;

        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls['fcn_li_stone_wt'].setValue(this.zeroMQtyVal);
            // this.lineItemForm.controls['fcn_li_stone_wt'].setValue(this.stoneWtPreVal);
            //  this.lineItemForm.controls['fcn_li_stone_wt'].valueChanges
            //   .pipe(startWith(1), pairwise()).subscribe(
            //     ([prevValue, selectedValue]) => {
            //       console.log('prev val => ' + prevValue); // previous value
            //       console.log('curr val => ' + selectedValue); // new value
            //       this.stoneWtPreVal = prevValue;
            //       // this.lineItemForm.controls['fcn_li_stone_wt'].setValue(prevValue)
            //     }
            //   );
            // this.lineItemForm.controls['fcn_li_stone_wt'].valueChanges
            //   .pipe(startWith(2), pairwise()).subscribe(
            //     ([prevValue, selectedValue]) => {
            //       console.log('prev val => ' + prevValue); // previous value
            //       console.log('curr val => ' + selectedValue); // new value
            //       this.stoneWtPreVal = prevValue;
            //       this.lineItemForm.controls['fcn_li_stone_wt'].setValue(prevValue)
            //     }
            //   );
            // this.setNettWeight();
            this.manageCalculations();
          }
        });
      } else {
        // this.setStoneAmt();
        // this.setNettWeight();
        this.manageCalculations();
      }
    } else {
      this.lineItemForm.controls.fcn_li_stone_wt.setValue(this.zeroMQtyVal);
      // this.setStoneAmt();
      // this.setNettWeight();
      this.manageCalculations();
    }
  }

  // enforceMinMax(el) {
  //   if (el.value != '') {
  //     if (parseFloat(el.value) < parseFloat(el.min)) {
  //       el.value = el.min;
  //       // this.lineItemForm.controls['fcn_li_net_wt'].setValue(el.min);
  //     }
  //     if (
  //       parseFloat(el.value) >
  //       parseFloat(this.lineItemForm.value.fcn_li_gross_wt)
  //     ) {
  //       // el.value = this.lineItemForm.value.fcn_li_gross_wt;
  //       this.lineItemForm.controls['fcn_li_net_wt'].setValue(
  //         this.lineItemForm.value.fcn_li_gross_wt
  //       );
  //     }
  //     // if (parseFloat(el.value) > parseFloat(el.max)) {
  //     //   el.value = el.max;
  //     // }
  //   }
  // }

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
  changeStoneAmt(event: any) {
    if (event.target.value != '') {
      if (
        this.lineItemForm.value.fcn_li_gross_wt == 0 ||
        this.lineItemForm.value.fcn_li_gross_wt == ''
      ) {
        this.lineItemForm.controls.fcn_ad_stone_amount.setValue(0);
      } else {
        const value = (
          this.lineItemForm.value.fcn_ad_stone_amount /
          this.lineItemForm.value.fcn_li_stone_wt
        ).toFixed(2);
        this.lineItemForm.controls.fcn_ad_stone_rate.setValue(value);
      }
      // this.setStoneAmt();
    } else {
      // this.lineItemForm.controls.fcn_li_stone_wt.setValue(0);
      this.lineItemForm.controls.fcn_ad_stone_rate.setValue(0);
      // this.setStoneAmt();
    }
  }

  setDetailsData() {
    if (this.retailSalesDataPost.RetailDetails.length > 0)
      this.retailSalesDataPost.RetailDetails.forEach((data: any) => {
        data.DTSALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
        data.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
      }

      );
    if (this.metalPurchaseDataPost != null && this.metalPurchaseDataPost != '') {
      this.metalPurchaseDataPost.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
      this.metalPurchaseDataPost.SALESPERSON_NAME = this.salespersonName || '';
    }
    if (this.retailSReturnDataPost != null && this.retailSReturnDataPost != '') {
      this.retailSReturnDataPost.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
      if (this.retailSReturnDataPost?.retailSReturnDetails?.length > 0) {
        this.retailSReturnDataPost.retailSReturnDetails.forEach((data: any) => {
          data.DTSALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
          data.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
        });
      } else {
        this.srCustCode = '';
      }
    }
  }

  setRetailSalesDataPost() {
    // alert(this.customerDetails?.CODE );
    // alert(this.invReturnSalesTotalNetTotal)
    // alert(this.order_total_exchange)
    this.retailSalesDataPost = {
      MID: this.retailSalesMID,
      BRANCH_CODE: this.strBranchcode,
      VOCTYPE: 'POS',
      // VOCTYPE: this.vocType,
      VOCNO: this.retailSaleDataVocNo,
      VOCDATE: this.convertDateWithTimeZero(
        new Date(this.vocDataForm.value.vocdate).toISOString()
      ),
      YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
      PARTYNAME: this.customerDataForm.value.fcn_customer_name,
      // "PARTYNAME": "Urwashi Jani",
      TEL1: this.customerDetails?.TEL1 || '',
      TEL2: this.customerDetails?.TEL2 || '',
      SALESPERSON_CODE: this.vocDataForm.value.sales_person || '', //need
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
        this.prnt_inv_total_gross_amt
      ),
      NETVALUE_CC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.comFunc.CCToFC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.prnt_inv_total_gross_amt)
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
      SRETURN_VALUE_CC: this.comFunc.FCToCC(
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
      PURCHASE_VALUE_CC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.order_total_exchange)
      ), //need
      ADJUST_ADVANCE: 0, //need
      DISCOUNT: this.order_items_total_discount_amount, // need_input
      SUBTOTAL: this.prnt_inv_net_total_without_tax,
      NETTOTAL: this.order_items_total_gross_amount,
      RECEIPT_TOTAL: 0, //need_input
      REFUND: 0,
      NAVSEQNO: 0, //need
      MOBILE: this.customerDataForm.value.fcn_customer_mobile,
      POBOX: this.customerDetails?.POBOX_NO || '',
      EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
      REMARKS: '', //need_input
      POSCUSTCODE: this.customerDetails?.CODE || '',
      ITEM_CURRENCY: this.comFunc.compCurrency,
      ITEM_CURR_RATE: 1,
      ADJUST_ADVANCECC: 0,
      DISCOUNTCC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.order_items_total_discount_amount)
      ), // need_input
      SUBTOTALCC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.prnt_inv_net_total_without_tax)
      ),
      NETTOTALCC: this.comFunc.CCToFC(
        this.comFunc.compCurrency,
        this.comFunc.emptyToZero(this.order_items_total_gross_amount)
      ),
      RECEIPT_TOTALCC: 0, //need_input
      REFUNDCC: 0,
      PENDING: 1,
      POSDETAILS: '',
      CREDITAC: '',
      DELIVERYDATE: this.dummyDate, //need
      ORDERMID: 0, //need
      FLAG_UPDATED: 'N',
      FLAG_INPROCESS: 'N',
      NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
        //  || this.customerDetails?.NATIONALITY
        || '',
      TYPE: this.customerDetails?.TYPE || '',
      ORDEREXEDATE: this.dummyDate, //need
      FLAG_EDIT_ALLOW: 'N',
      D2DTRANSFER: 'F',
      RSCUSTIDNO: this.customerDetails?.CODE || '',
      POSKnownAbout: this.customerDetails?.POSKnownAbout || 0,

      // etc fields
      RS_FIXED: false, //need
      SALESREFERENCE: '',
      TRANS_CODES: '',
      CONSIGNMENTPARTY: '',
      TOTALVAT_AMOUNTFC: this.comFunc.transformDecimalVB(
        this.comFunc.amtDecimals,
        this.order_items_total_tax
      ),
      TOTALVAT_AMOUNTLC: this.comFunc.FCToCC(
        this.comFunc.compCurrency,
        this.order_items_total_tax
      ),
      RSSTATE: '',
      SALESFIXINGMID: '0',
      SALESFIXINGREF: '',
      REDEMPTIONTOTALVALUECC: 0,
      GSTVATAMOUNTFC: 0,
      GSTVATAMOUNTCC: 0,
      CCPOSTINGDONE: '0',
      BALANCE_FC: 0, //need
      BALANCE_CC: 0, //need
      LOCALREMARKSNEW: '',
      MACHINEID: '',
      AUTOPOSTING: true,
      POSTDATE: this.dummyDate, //need
      INVREF: '0',
      SCHEMESALESFIXINGPUREWT: 0,
      BLOCKPSRIMPORT: false,
      INCLUDEVAT: false,
      WAYBILLNO: '',
      WAYBILLDATE: this.dummyDate, //need
      HTUSERNAME: '',
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
      TRAYN: this.customerDataForm.value.tourVatRefuncYN || false,
      TRANO: this.customerDataForm.value.tourVatRefundNo || '',
      POSReferenceRepairInvoice: '',
      RSLOGINMID: '0',
      TRAYNREFUND: false,
      TRAYNREFUNDDATE: this.dummyDate, //need
      SERVICE_INVOICE: this.invoiceWiseForm.value.serviceInv || false,
      GJVREFERENCE: '',
      GJVMID: 0, //need
      holdbarcode: false,
      PROMO_CODE: '',
      VATAMOUNTFCROUND: this.comFunc.emptyToZero(this.vatRoundOffAmt),
      VATAMOUNTFCROUNDCC:
        this.comFunc.FCToCC(
          this.comFunc.compCurrency,
          this.comFunc.emptyToZero(this.vatRoundOffAmt)
        ),
      LIFETIMEWARRANTY: this.invoiceWiseForm.value.lifeTimeWarr || false,
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
      BOARDINGPASS: this.boardingPassForm.value.passDetails || '',
      WITHOUTVAT: false,
      FLIGHTNO: this.boardingPassForm.value.flightNo || '',
      BOARDINGFROM: this.boardingPassForm.value.boardingTo || '',
      BOARDINGDATE: this.boardingPassForm.value.boardingDate || this.dummyDate, //need
      // new values
      CITY:
        this.customerDetailForm.value.fcn_cust_detail_city ||
        // this.customerDetails?.CITY ||
        '',
      STATE: this.customerDetails?.STATE || '',
      ADDRESS:
        this.customerDetailForm.value.fcn_cust_detail_address ||
        // this.customerDetails?.ADDRESS ||
        '',
      COUNTRY_CODE:
        this.customerDetailForm.value.fcn_cust_detail_country ||
        // this.customerDetails?.COUNTRY_CODE ||
        '',
      CUST_Language: this.customerDetails?.CUST_Language || '',
      PRINT_COUNT: 0,
      GST_TOTALFC: 0,
      GST_TOTALCC: 0,
      GST_STATE_CODE: '',
      PANNO: '',
      GST_NUMBER: '',
      TRA_ID_TYPE: '',
      POSCUSTIDNO: '',
      POS_CREDITLIMIT_AUTHORIZED_USER: '',
      POS_CREDITLIMIT_AUTHORIZED_REMARK: '',
      TOTALCESS_AMOUNTFC: 0,
      TOTALCESS_AMOUNTCC: 0,
      FORM_60: false,
      COMP_WISE_INVOICE: false,
      REFBY_CUSTCODE: '',
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      SOURCEOFWEALTHANDFUNDS: '',
      "AGENT_COMMISSION": false,
      "EMIRATESSKYWARDSMILE": false,
      "HOLDBARCODE": false,
      "AGENTCOMMISSION_PER": 0,
      "CCSALESCOMMISIONAMOUNTCC": 0,
      "CCSALESCOMMISIONAMOUNTFC": 0,
      "POSREFERENCEREPAIRINVOICE": "",
      "BOOKVOCNO": "",
      "DTREMARKS": "",
      "GROUPREF": "",
      "NEWMID": 0,
      RetailDetails: this.currentLineItems,
    };
    console.log('====================================');
    console.log(this.retailSalesDataPost);
    console.log('====================================');
    // alert(this.retailSalesDataPost.POSCUSTCODE);
  }
  setMetalPurchaseDataPost() {
    this.metalPurchaseDataPost = {
      'POPCUSTCODE': this.customerDetails['CODE'] || '',
      MID: this.metalPurchaseDataMID,
      BRANCH_CODE: this.strBranchcode,
      VOCTYPE: 'POP',
      // VOCTYPE: this.vocType,
      // VOCNO: this.vocDataForm.value.fcn_voc_no,
      VOCNO: this.metalPurchaseDataVocNo,
      VOCDATE: this.convertDateWithTimeZero(
        new Date(this.vocDataForm.value.vocdate).toISOString()
      ),
      YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
      PARTYCODE: this.comFunc.basePartyCode,
      PARTY_CURRENCY: this.comFunc.compCurrency,
      PARTY_CURR_RATE: 1,
      ITEM_CURRENCY: this.comFunc.compCurrency,
      ITEM_CURR_RATE: 1,
      VALUE_DATE: this.vocDataForm.value.vocdate,
      SALESPERSON_CODE: this.vocDataForm.value.sales_person, //need
      RATE_TYPE: this._exchangeItemchange?.METAL_RATE_TYPE || '', //need_input
      METAL_RATE: this.exchangeForm.value.fcn_exchange_metal_rate || 0, //need_input
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
      FLAG_EDIT_ALLOW: 'Y',
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
      PartyRoundValueFc: 0, //need_input
      ItemRoundValueFc: 0,
      H_Shipper: '',
      H_Miner: '',
      H_Basis: '',
      H_Destination: '',
      H_ShipmentMode: '',
      H_AirwayBill: '',
      VATAmountFCRound: 0,
      VATONMAKING: false, //need_input
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

      // new values - metal purchase header
      // PARTYADDRESS: '',
      // REP_REF: '',
      // BASE_CURRENCY: '',
      // BASE_CURR_RATE: '0',
      // BASE_CONV_RATE: '',
      // INCLUSIVE: '0',
      // PRINT_COUNT: '0',
      // DOC_REF: '',
      // FIXED_QTY: '0.000',
      // GST_REGISTERED: 'False',
      // GST_STATE_CODE: '',
      // GST_NUMBER: '',
      // GST_TYPE: '',
      // GST_TOTALFC: '0.000',
      // GST_TOTALCC: '0.000',
      // CUSTOMER_MOBILE: '',
      // CUSTOMER_EMAIL: '',
      // GST_GROUP: '',
      // FIXING_PROCESS: 'False',
      // TOTAL_ADDL_TAXFC: '0.000',
      // TOTAL_ADDL_TAXCC: '0.000',
      // REF_JOBCREATED: 'False',
      // EXCLUDEVAT: 'False',
      // TEST_BRANCH_CODE: '',
      // TEST_VOCTYPE: '',
      // TEST_VOCNO: '0',
      // TEST_YEARMONTH: '',
      // TDS_CODE: '',
      // TDS_APPLICABLE: 'False',
      // TDS_TOTALFC: '0.000',
      // TDS_TOTALCC: '0.000',

      // SHIPPER_CODE: '',
      // SHIPPER_NAME: '',
      // ORIGIN_COUNTRY: '',
      // DESTINATION_STATE: '',
      // DESTINATION_COUNTRY: '',
      // MINING_COMP_CODE: '',
      // MINING_COMP_NAME: '',
      // AIRWAY_BILLNO: '',
      // AIRWAY_BILLDATE: '16/07/2019 4:00:46 PM',
      // AIRWAY_WEIGHT: '0.000',
      // ARIVAL_DATE: '16/07/2019 4:00:46 PM',
      // CLEARENCE_DATE: '16/07/2019 4:00:46 PM',
      // BOE_FILLINGDATE: '16/07/2019 4:00:46 PM',
      // BOE_NO: '',
      // PO_IMP: '0',
      // SILVER_RATE_TYPE: '',
      // SILVER_RATE: '0.000000',
      // TOTAL_SILVERWT: '0.000',
      // TOTAL_SILVERVALUE_FC: '0.000',
      // TOTAL_SILVERVALUE_CC: '0.000',
      // PO_REFNO: '',
      // MINING_COMP_REFNO: '',
      // PARTY_ROUNDOFF: '0.000',
      // TRANSPORTER_CODE: '',
      // VEHICLE_NO: '',
      // LR_NO: '',
      // AIR_BILL_NO: '',
      // SHIPCODE: '',
      // SHIPDESC: '',
      // STAMPCHARGE: 'False',
      // TOTSTAMP_AMTFC: '0.000',
      // TOTSTAMP_AMTCC: '0.000',
      // TOTSTAMP_PARTYAMTFC: '0.000',
      // REFPURIMPORT: '',
      // BOE_EXPIRY_DATE: '01/01/1900 12:00:00 AM',
      // H_BILLOFENTRYREF: '',
      // SUB_LED_ACCODE: '',
      // ACTIVITY_CODE: '',
      // TCS_ACCODE: '',
      // TCS_AMOUNT: '0.000',
      // TCS_AMOUNTCC: '0.000',
      // TCS_APPLICABLE: 'False',
      // DISCOUNTPERCENTAGE: '0.000',
      // CUSTOMER_CODE: '',
      // IMPORTINPURCHASE: 'False',
      // SL_CODE: '',
      // SL_DESCRIPTION: '',
      // CNT_ORIGIN: '',
      // FREIGHT_RATE: '',
      // TDS_PER: '0.000',
      // TDS_TOPARTY: 'False',
      // LONDONFIXING_TYPE: '0',
      // LONDONFIXING_RATE: '0.000',
      // PARTYROUNDOFF: '0.000',
      // NOTIONAL_PARTY: 'False',
      // METAL_CONV_CURR: '',
      // METAL_CONV_RATE: '0.000000',
      // CHECK_HEDGINGBAL: 'False',
      // IMPORTINSALES: 'False',
      // AUTOGENMID: '',
      // AUTOGENVOCTYPE: '',
      // AUTOGENREF: '',
      // PRINT_COUNT_ACCOPY: '0',
      // PRINT_COUNT_CNTLCOPY: '0',
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


      // new fields added 27-12-2023
      "DISCOUNT_PERGRM": 0,
      "EXCLUDE_VAT": true,
      "H_AIRWAYBILL": "",
      "H_BASIS": "",
      "H_DESTINATION": "",
      "H_MINER": "",
      "H_SHIPMENTMODE": "",
      "H_SHIPPER": "",
      "INTERNALFIXEDQTY": 0,
      "ITEMROUNDVALUEFC": 0,
      "NEWMID": 0,
      "PARTYROUNDVALUEFC": 0,
      "PARTYTRANSWISE_METALVATONMAKING": true,
      "PLACEOFSUPPLY": "",
      "POSPRICESFIXED": true,
      "SHIPMENTCOMPANY": "",
      "SHIPMENTPORT": "",
      "TAX_APPLICABLE": true,
      "TRANSFER_BRANCH": "",
      "VATAMOUNTFCROUND": 0,
      "VATAMOUNTFCROUNDCC": 0,

      metalPurchaseDetails: this.currentExchangeMetalPurchase,

    };
  }
  setSalesReturnDetailsPostData() {
    this.retailSReturnDataPost = {
      MID: this.retailSReturnDataMID,
      BRANCH_CODE: this.strBranchcode,
      VOCTYPE: 'PSR',
      // VOCTYPE: this.vocType,
      // VOCNO: this.vocDataForm.value.fcn_voc_no,
      VOCNO: this.retailSReturnVocNo,

      VOCDATE: this.convertDateWithTimeZero(
        new Date(this.vocDataForm.value.vocdate).toISOString()
      ),
      YEARMONTH: this.baseYear || localStorage.getItem('YEAR'),
      PARTYNAME: this.customerDataForm.value.fcn_customer_name,
      TEL1: this.customerDetails?.TEL1 || '',
      TEL2: this.customerDetails?.TEL2 || '',
      SALESPERSON_CODE: this.vocDataForm.value.sales_person, //need
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
      // DISCOUNT: this.invReturnSalesTotalDisPer, //need_input
      SUBTOTAL: this.invReturnSalesTotalNetAmt, //need_input
      ROUNDOFF: 0,
      NETTOTAL: this.invReturnSalesTotalNetTotal, //need_input
      RECEIPT_TOTAL: this.invReturnSalesTotalNetTotal, //need
      REFUND: 0,
      FLAG_EDIT_ALLOW: 'N',
      NAVSEQNO: 0, //need
      MOBILE: this.customerDataForm.value.fcn_customer_mobile,
      POBOX: this.customerDetails?.POBOX_NO || '',
      EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
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
      NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
        //  || this.customerDetails?.NATIONALITY
        || '',
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
      // GSTVATAMOUNTFC: this.invReturnSalesTotalTaxAmt,
      // GSTVATAMOUNTCC: this.comFunc.CCToFC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.invReturnSalesTotalTaxAmt)
      // ),
      CCPOSTINGDONE: 0,

      LOCALREMARKSNEW: '',
      AUTOPOSTING: false,
      MACHINEID: '',
      POSTDATE: this.vocDataForm.value.vocdate, //need
      INVREF: 0,
      SCHEMESALESFIXINGPUREWT: 0,
      INCLUDEVAT: false,
      WAYBILLNO: '',
      WAYBILLDATE: this.dummyDate, //need
      HTUSERNAME: this.strUser || '', //need
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
      CERTIFICATEPRINTED: 0,
      BOARDINGPASS: '',
      WITHOUTVAT: false,
      FLIGHTNO: '',
      BOARDINGFROM: '',
      BOARDINGDATE: this.dummyDate,
      BOOKVOCNO: '',

      CITY:
        this.customerDetailForm.value.fcn_cust_detail_city ||
        // this.customerDetails?.CITY ||
        '',
      STATE: this.customerDetails?.STATE || '',
      ADDRESS:
        this.customerDetailForm.value.fcn_cust_detail_address ||
        // this.customerDetails?.ADDRESS ||
        '',
      COUNTRY_CODE:
        this.customerDetailForm.value.fcn_cust_detail_country ||
        // this.customerDetails?.COUNTRY_CODE ||
        '',
      CUST_Language: this.customerDetails?.CUST_Language || '',

      // PRINT_COUNT: '0',
      // GST_TOTALFC: '0.000',
      // GST_TOTALCC: '0.000',
      // PANNO: '',
      // GST_STATE_CODE: '',
      // GST_NUMBER: '',
      // EXCLUDEGSTVAT: '0',
      // TRA_ID_TYPE: '',
      // POSCUSTIDNO: '',
      // TOTALCESS_AMOUNTCC: '0.000',
      // TOTALCESS_AMOUNTFC: '0.000',
      // FORM_60: 'False',
      // COMP_WISE_INVOICE: 'False',
      // SERVICE_INVOICE: 'False',
      // REFBY_CUSTCODE: '',
      // PRINT_COUNT_ACCOPY: '0',
      // PRINT_COUNT_CNTLCOPY: '0',

      'PRINT_COUNT': 0,
      'GST_TOTALFC': 0,
      'GST_TOTALCC': 0,
      'GST_STATE_CODE': '0',
      'PANNO': '0',
      'GST_NUMBER': '',
      'TRA_ID_TYPE': '0',
      'POSCUSTIDNO': '0',
      "POS_CREDITLIMIT_AUTHORIZED_USER": '0',
      "POS_CREDITLIMIT_AUTHORIZED_REMARK": '0',
      'TOTALCESS_AMOUNTFC': 0,
      'TOTALCESS_AMOUNTCC': 0,
      'FORM_60': false,
      'COMP_WISE_INVOICE': false,
      'REFBY_CUSTCODE': '0',
      'PRINT_COUNT_ACCOPY': 0,
      'PRINT_COUNT_CNTLCOPY': 0,

      // new fields added 28-12-2023
      "AGENT_COMMISSION": true,
      "AGENTCOMMISSION_PER": 0,
      "EMIRATESSKYWARDSMILE": true,
      "NEWMID": 0,
      "PLANETRESPONSEFLG": true,
      "POSREFERENCEREPAIRINVOICE": "",

      retailSReturnDetails: this.currentsalesReturnItems,
    };
  }

  /** start customer detail form */
  nameChange(event: any, source: any = null) {
    const value = event.target.value.toString().trim();
    // event.target.value = value;
    if (value != '') {
      this.amlNameValidationData = false;

      const res = value.split(/\s+/);
      event.target.value = res.join(' ');

      this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
        res[0]
      );
      if (res.length == 1) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          ''
        );
      }
      if (res.length == 2) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          res[1]
        );
      }
      if (res.length > 2) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
          res[1]
        );
        res.splice(0, 2);
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          res.join(' ')
        );
      }
      if (source != 'byAPI')
        this.renderer.selectRootElement('#fcn_cust_detail_phone')?.focus();
    } else {
      this.customerDetailForm.controls.fcn_customer_detail_fname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_lname.setValue('');
      this.amlNameValidationData = true;
    }
  }
  /**  end customer detail form */
  setReadOnlyForViewMode() {
    this.comFunc.formControlSetReadOnly('fcn_li_pcs', false);
    this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
  }
  dateFilter = (d: Date | null): boolean => {
    console.log(d);
    const date = (d || new Date()).toLocaleDateString();
    return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date);
  };
  restrictInput(event: KeyboardEvent) {
    const key = event.charCode || event.charCode;
    const isNumber = key >= 48 && key <= 57;
    const isSlash = key === 47;
    const isBackspace = key === 8;
    if (!isNumber && !isSlash && !isBackspace) {
      event.preventDefault();
    }
  }
  todate(value: any) {
    console.log(value);
    // this.vocDataForm.get('vocdate').setValue(new Date(value));
  }
  onBlur() {
    console.log('====================================');
    console.log(this.vocDataForm.controls.vocdat);
    console.log('====================================');
    if (this.vocDataForm.controls.vocdate) {
      this.onChangeCallback(this.vocDataForm.controls.vocdate);
    }
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
        if (resp.status != 'Failed') {

          var data = resp.response?.map((t: any) => t.fyearcode);
          this.options_year = data;
          this.filteredOptions_year =
            this.salesReturnForm.controls.fcn_returns_fin_year.valueChanges.pipe(
              startWith(''),
              map((value) => this._filteryear(value))
            );
          this.filteredadvanceYear =
            this.advanceReceiptForm.controls.advanceYear.valueChanges.pipe(
              startWith(''),
              map((value) => this._filteryear(value))
            );
        }
        this.advanceReceiptForm.controls.advanceYear.setValue(this.baseYear);

      });
  }

  getAccountLookup() {
    this.suntechApi.getDynamicAPI('AccountLookup/GetAccountLookupWithAccMode/R').subscribe((resp) => {
      // this.suntechApi.getDynamicAPI('AccountLookup').subscribe((resp) => {
      let resVal;
      if (resp['status'] == 'Success') {
        resVal = resp.response;
      } else {
        resVal = [];
      }

      this.accountLookupList = resVal;
      this.customAcCodeListOptions =
        this.customerReceiptForm.controls.customAcCodeList.valueChanges.pipe(
          startWith(''),
          map((value) =>
            this._filterMasters(this.accountLookupList, value, 'ACCODE', 'ACCOUNT_HEAD')
            // this._filterMasters(this.accountLookupList, value, 'CODE', 'DESCRIPTION')
          )
        );

    });
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

    console.log('============this.order_items_total_net_amount========================');
    console.log(this.order_items_total_net_amount, this.receiptTotalNetAmt);
    console.log('====================================');
    // if (this.balanceAmount >= 0 &&  this.order_items_total_net_amount != 0.00) {
    // if (this.balanceAmount >= 0) {
    //   alert(this.balanceAmount + " - " + this.order_items_total_net_amount)
    //   this.snackBar.open('Invalid Amount', 'Ok');
    // }

    this.prnt_received_amount = this.receiptTotalNetAmt;
    this.prnt_received_amount_words = this.numToWord(this.prnt_received_amount);

    // recpCtrl.receiptTotalNetAmt = receiptTotalNetAmt;
    // recpCtrl.balanceAmount = balanceAmount;
  }

  editReceiptItem(index: any, data: any) {
    this.receiptEditId = data['SRNO'];
    const resmode = this.receiptModesTypes
      .filter((ele: any) => ele['CREDIT_CODE'] == data['RECEIPT_MODE'])
    let modeIndex;
    if (resmode.length > 0)
      modeIndex = resmode[0]['MODE'];
    else
      modeIndex = 5;

    if (modeIndex == 0) {
      this.selectedTabIndex = 0;
    }
    else if (modeIndex == 1) {
      this.selectedTabIndex = 1;
    }
    else if (modeIndex == 2) {
      this.selectedTabIndex = 3;
    }
    else if (modeIndex == 3) {
      this.selectedTabIndex = 2;
    }
    else if (modeIndex == 4) {
      this.selectedTabIndex = 4;
    } else {
      this.selectedTabIndex = 5;
    }
    this.open(this.sales_payment_modal, false, data);
  }

  setTabByIndex(index: any, data?: any) {

    this.selectedTabIndex = index;
    if (this.receiptModesList?.BTN_CASH == true && this.selectedTabIndex == 0) {
      if (data != null && data != undefined && data != undefined) {
        this.cashreceiptForm.controls.paymentsCash.setValue(
          data['RECEIPT_MODE'].toString());
        this.cashreceiptForm.controls.cashAmtFC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_FC']).toString());
        this.cashreceiptForm.controls.cashAmtLC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_CC']).toString());
      }
      else {
        if (this.balanceAmount != null) {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
        } else {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
        }

      }

      this.renderer.selectRootElement('#cashAmtFC').focus();


    }
    if (this.receiptModesList?.['BTN_CREDITCARD'] == true && this.selectedTabIndex == 1) {
      if (data != null && data != undefined) {
        this.creditCardReceiptForm.controls.paymentsCreditCard.setValue(
          data['RECEIPT_MODE'].toString());
        this.creditCardReceiptForm.controls.cardCCNo.setValue(
          this.comFunc.emptyToZero(data['CARD_NO'].toString()));
        this.creditCardReceiptForm.controls.cardAmtFC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_FC']).toString());
      }
      else {
        if (this.balanceAmount != null) {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
        } else {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
        }
      }
      this.renderer.selectRootElement('#cardCCNo').focus();
    }
    if (this.receiptModesList?.['BTN_ADVANCE'] == true && this.selectedTabIndex == 2) {

      if (data != null && data != undefined) {
        this.advanceReceiptForm.controls.paymentsAdvance.setValue(
          data['RECEIPT_MODE'].toString());
        this.advanceReceiptForm.controls.advanceYear.setValue(
          this.comFunc.emptyToZero(data['FYEARCODE'].toString()));
        this.advanceReceiptForm.controls.advanceBranch.setValue(
          data['REC_BRANCHCODE'].toString());

        this.advanceReceiptForm.controls.advanceRecNo.setValue(
          this.comFunc.emptyToZero(data['ARECVOCNO'].toString()));

        this.advanceReceiptForm.controls.advanceAmount.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_FC'].toString()));

        this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
          data['IGST_AMOUNTFC']);
        this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
          data['IGST_AMOUNTCC']);
      } else {
        this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
          this.zeroAmtVal);
        this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
          this.zeroAmtVal);
      }


      this.renderer.selectRootElement('#advanceRecNo').focus();


    }
    if (this.receiptModesList?.['BTN_OTHERS'] == true && this.selectedTabIndex == 3) {
      if (data != null && data != undefined) {
        this.othersReceiptForm.controls.paymentsOthers.setValue(
          data['RECEIPT_MODE'].toString());
        this.othersReceiptForm.controls.othersAmtFC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_FC']).toString());
      }
      else {
        if (this.balanceAmount != null) {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
        } else {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
        }

      }
    }

    if (this.receiptModesList?.['BTN_GIFT'] == true && this.selectedTabIndex == 4) {
      this.giftReceiptForm.controls.paymentsCreditGIftVoc.setValue(
        this.comFunc.emptyToZero(data['RECEIPT_MODE']).toString());

      this.advanceReceiptForm.controls.giftBranch.setValue(
        data['REC_BRANCHCODE'].toString());

      this.advanceReceiptForm.controls.advanceRecNo.setValue(
        this.comFunc.emptyToZero(data['ARECVOCNO'].toString()));

      this.giftReceiptForm.controls.giftAmtFC.setValue(
        this.comFunc.emptyToZero(data['AMOUNT_FC']).toString());

    }
    if (this.receiptModesList?.['BTN_CUSTOMER'] == true && this.selectedTabIndex == 5) {
      if (data != null && data != undefined) {
        this.customerReceiptForm.controls.customAcCodeList.setValue(
          data['RECEIPT_MODE'].toString());
        this.customerReceiptForm.controls.customerAmtFC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_FC']).toString());
        this.customerReceiptForm.controls.customerAmtLC.setValue(
          this.comFunc.emptyToZero(data['AMOUNT_CC']).toString());
      }
      else {
        if (this.balanceAmount != null) {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.emptyToZero(this.balanceAmount).toString());
        } else {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
        }

      }
    }

  }


  // setReceiptVal() {
  //   this.receiptTotalForm.controls.receiptAmtFC.setValue(
  //     this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
  //   this.receiptTotalForm.controls.receiptAmtLC.setValue(
  //     this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
  // }

  changeAdvanceVocNo(event: any) {
    // const value = event.target.value;
    const value = this.advanceReceiptForm.value.advanceRecNo;
    if (value != '') {
      this.snackBar.open('Loading...');
      let API = `AdvanceReceipt/GetAdvanceReceipt/${this.advanceReceiptForm.value.advanceBranch}/PCR/${this.advanceReceiptForm.value.advanceYear}/${this.advanceReceiptForm.value.advanceRecNo}/${this.advanceReceiptForm.value.advanceCustCode}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'] == 'Success') {
            this.isInvalidRecNo = false;

            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.comFunc.emptyToZero(res['response']['BALANCE_FC']).toString());
            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.comFunc.emptyToZero(res['response']['GST_TOTALFC']).toString());
            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.comFunc.emptyToZero(res['response']['GST_TOTALCC']).toString());
            this.advanceReceiptDetails = res['response'];
          } else {
            this.isInvalidRecNo = true;
            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.zeroAmtVal);
            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.zeroAmtVal);
            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.zeroAmtVal);
            this.advanceReceiptDetails = {};

            this.snackBar.open('Invalid Receipt No.', 'OK', {
              duration: 2000
            });
          }
        });
    } else {
      this.advanceReceiptForm.controls.advanceAmount.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptDetails = {};
    }

  }
  changeGiftVocNo(event: any) {
    const value = event.target.value;
    const vocType = this.giftReceiptForm.value.paymentsCreditGIftVoc;
    if (value != '') {
      this.snackBar.open('Loading...');
      let API = `ValidateGiftVocNo/ValidateGiftVocNo/${value}/${vocType}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'].toString().trim() == 'Success') {
            this.isInvalidRecNo = false;
            const result = res.response;

            this.giftReceiptForm.controls.giftAmtFC.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.amtDecimals, this.comFunc.emptyToZero(res.VoucherAmountFc).toString()));

            this.giftReceiptForm.controls.giftBranch.setValue(result.BRANCH_CODE);

          } else {
            this.isInvalidRecNo = true;
            this.giftReceiptForm.controls.giftAmtFC.setValue(
              this.zeroAmtVal);


            this.snackBar.open(res.message, 'OK', {
              duration: 2000
            });
            // this.snackBar.open('Invalid Receipt No.', 'OK', {
            //   duration: 2000
            // });
          }
        });
    } else {
      this.advanceReceiptForm.controls.advanceAmount.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptDetails = {};
    }

  }

  changeCustAcCode(value: any) {
    console.log('====================================');
    console.log('val ', value);
    console.log('====================================');
    // this.receiptTotalForm.controls.customerAccode.setValue(
    //   value);

    // this.accountLookupList.filter((data)=> data.)
  }
  changeReceiptAmtFC(event: any, formName: keyof AddPosComponent, fieldName?: any) {
    this[formName].controls[fieldName].setValue(event.target.value);
  }


  changeCountry(value: any) {
    this.getStateMasterByID(value);
  }
  changeState(value: any) {
    this.getCityMasterByID(this.customerDetailForm.value.fcn_cust_detail_country, value);
  }

  getCityMasterByID(countryCode: any, stateCode: any) {
    let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CITY MASTER')}/${encodeURIComponent(countryCode)}/${encodeURIComponent(stateCode)}`
    this.suntechApi.getDynamicAPI(API).
      subscribe(async data => {
        if (data.status == "Success") {
          this.cityMaster = data.response;
          this.cityMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_city.valueChanges.pipe(
              startWith(''),
              map((value) =>
                this._filterMasters(this.cityMaster, value, 'CODE', 'DESCRIPTION')
              )
            );
        } else {
          this.cityMaster = [];
        }

      });

  }

  getStateMasterByID(countryCode: any) {
    let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('STATE MASTER')}/${encodeURIComponent(countryCode)}`

    this.suntechApi.getDynamicAPI(API).
      subscribe(async data => {
        if (data.status == "Success") {
          this.stateMaster = data.response;
          this.stateMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_state.valueChanges.pipe(
              startWith(''),
              map((value) =>
                this._filterMasters(this.stateMaster, value, 'CODE', 'DESCRIPTION')
              )
            );
        } else {
          this.stateMaster = [];
        }
      });
  }

  dummyDateCheck(date: any) {
    if (this.dummyDateArr.includes(date))
      return '';
    else
      return date;
  }

  autoCompleteValidator(optionsProvider: any, field: any = null) {
    return (control: AbstractControl) => {
      const options = optionsProvider();
      const inputValue = control.value;
      if (!options || !Array.isArray(options)) {
        return null;
      }
      if (field == null) {
        if (control.value && options.length > 0 && !options.includes(control.value)) {
          return { notInOptions: true };
        }
      } else {
        if (inputValue && options.length > 0 && !options.some(option => option[field] === inputValue)) {
          return { notInOptions: true };
        }
      }
      return null;
    };
  }

  validateSalesReturnCust(): boolean {
    if (
      this.customerDataForm.value.fcn_customer_code !== null &&
      this.customerDataForm.value.fcn_customer_code !== '' &&
      this.srCustCode !== null &&
      this.srCustCode !== ''
    ) {
      if (this.customerDataForm.value.fcn_customer_code != this.srCustCode) {
        this.openDialog('warning', 'Invalid voucher No.', true);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum?VocType=${this.vocType}&BranchCode=${this.strBranchcode}&strYEARMONTH=${this.baseYear}&vocdate=${this.convertDateToYMD(this.vocDataForm.value.vocdate)}&blnTransferDummyDatabase=false`;
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.vocDataForm.controls['fcn_voc_no'].setValue(resp.newvocno);
        }
      });
  }
  async checkStockCodeForParticularDate(stockCode: any): Promise<boolean> {
    const API = `RetailSalesDataInDotnet/CheckStockCodeForParticularDate/${this.strBranchcode}/${stockCode}/${this.comFunc.cDateFormat(this.vocDataForm.value.vocdate)}`;

    return new Promise<boolean>((resolve) => {
      this.suntechApi.getDynamicAPI(API)
        .subscribe((resp) => {
          if (resp.response == true) {
            this.snackBar.open(resp.message, 'OK', { duration: 5000 });
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  getCustDetails() {
    const API = `UserEmiratesIdData/GetUserEmiratesIdDataWithBranch/${this.strBranchcode}`;
    // const API = `UserEmiratesIdData/GetUserEmiratesIdDataWithBranch/HO`;
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (resp.status == 'Success' && resp.response != null) {
          const res = resp.response;
          this.customerDataForm.controls['fcn_customer_name'].setValue(
            res.FULLNAMEENGLISH
          );
          this.nameChange({ target: { value: res.FULLNAMEENGLISH } }, 'byAPI');

          this.customerDataForm.controls['fcn_customer_id_number'].setValue(
            res.IDNUMBER
          );

          this.customerDataForm.controls['fcn_customer_exp_date'].setValue(
            this.comFunc.cDateFormat(res.DATEOFEXPIRY)
          );
          this.customerDetailForm.controls['fcn_cust_detail_dob'].setValue(
            this.comFunc.cDateFormat(res.DATEOFBIRTH)
          );
          this.customerDetailForm.controls['fcn_cust_detail_nationality'].setValue(
            res.NATIONALITYENGLISH
          );

          const genderVal = res.GENDER.toString().charAt(0).toUpperCase();
          if (genderVal == 'M') {
            res.GENDER = 'Male';
          } else if (genderVal == 'F') {
            res.GENDER = 'Female';
          } else {
            res.GENDER = 'Unknown';
          }

          this.customerDetailForm.controls['fcn_cust_detail_gender'].setValue(
            res.GENDER
          );


        } else {
          this.snackBar.open(resp.message, 'OK')
        }
      });
  }

  submitAuth() {
    if (!this.authForm.invalid) {
      this.modalReferenceUserAuth.close(true);
    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    }

  }

  openAuthModal() {

    return new Promise((resolve) => {

      this.modalReferenceUserAuth = this.modalService.open(
        this.userAuthModal,
        {
          size: "lg",
          backdrop: true,
          keyboard: false,
          windowClass: "modal-full-width",
        }
      );

      this.modalReferenceUserAuth.result.then((result) => {
        if (result) {
          console.log("Result :", result);
          resolve(true);
        } else {
          resolve(false);
        }
      },
        (reason) => {
          console.log(`Dismissed ${reason}`);
          resolve(false);

        }
      );
    });


  }

  openAttachment(url: string) {
    window.open(url, '_blank');
  }

  importSalesEstimation() {
    this.modalRefePendingSalesEstimation = this.modalService.open(
      this.salesEstimationModal,
      {
        size: "lg",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );

    this.modalRefePendingSalesEstimation.result.then((result) => {
      if (result) {
        console.log("Result :", result);
      } else {
      }
    },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );
  }
  importSalesOrder() {
    this.modalRefePendingSalesOrder = this.modalService.open(
      this.pendingSalesOrderModal,
      {
        size: "lg",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );

    this.modalRefePendingSalesOrder.result.then((result) => {
      if (result) {
        console.log("Result :", result);
      } else {
      }
    },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );
  }

  openUserAttachmentModal() {

    this.modalReferenceUserAttachment = this.modalService.open(
      this.userAttachmentModal,
      {
        size: "lg",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );

    this.modalReferenceUserAttachment.result.then((result) => {
      if (result) {
        console.log("Result :", result);
      } else {
      }
    },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );

  }


  onFileSelected(event: any) {
    const file: File = event.target.files;
    console.log(file);
    this.attachmentFile = file;
  }


  saveAttachment() {
    if (!this.attachmentForm.invalid) {
      const formData = new FormData();

      formData.append('VOCNO', this.vocDataForm.value.fcn_voc_no);
      formData.append('VOCTYPE', this.vocType);
      formData.append('VOCDATE', this.convertDateWithTimeZero(new Date(this.vocDataForm.value.vocdate).toISOString()));
      formData.append('REFMID', this.vocDataForm.value.fcn_voc_no);
      formData.append('ATTACHMENT_PATH', '');

      formData.append('SRNO', '1');
      formData.append('REMARKS', this.attachmentForm.value.remarks || '');
      formData.append('UNIQUEID', '1');
      formData.append('CODE', '');
      formData.append('ATTACH_TYPE', this.attachmentFile[0].name.split('.')[1] || ''); //pass extension
      formData.append('EXPIRE_DATE', this.convertDateToYMD(this.attachmentForm.value.expDate));
      formData.append('BRANCH_CODE', this.strBranchcode);
      formData.append('YEARMONTH', this.baseYear);
      formData.append('DOC_TYPE', this.attachmentForm.value.docType || '');
      formData.append('SUBLED_CODE', this.customerDataForm.value.fcn_customer_code || '');
      formData.append('DOC_ACTIVESTATUS', 'false');
      formData.append('DOC_LASTRENEWBY', '');
      formData.append('DOC_NEXTRENEWDATE', '');
      formData.append('DOC_LASTRENEWDATE', '');
      formData.append('DOCUMENT_DATE', '');
      formData.append('DOCUMENT_NO', '');
      formData.append('FROM_KYC', 'false');

      for (let i = 0; i < this.attachmentFile.length; i++) {
        formData.append(`Model.Images[${i}].Image.File`, this.attachmentFile[i], this.attachmentFile[i].name);
      }

      this.transAttachmentListData.push(formData);

      this.transAttachmentList.push({
        "REFMID": 0,
        "REMARKS": this.attachmentForm.value.remarks || '',
        "ATTACHMENT_PATH": "",
        "DOC_TYPE": this.attachmentForm.value.docType || '',
        "EXPIRE_DATE": this.convertDateToYMD(this.attachmentForm.value.expDate) || this.dummyDate,
        "VOCTYPE": this.vocType
      });

      this.attachmentForm.reset();
      this.attachmentFile = null;

      // this.submitAttachment();
    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    }
  }
  submitAttachment() {
    // if (!this.attachmentForm.invalid) {
    const modifiedFormData = new FormData();
    const res = this.transAttachmentListData.map((data, i) => {
      let j = 0;
      data.forEach((value: any, key: any) => {
        if (key.includes('Model.Images')) {
          modifiedFormData.append(`Model.modelData[${i}].Images[${j}].Image.File`, value);
          j++;
        }
        else if (['SRNO', 'UNIQUEID', 'CODE'].includes(key))
          modifiedFormData.append(`Model.modelData[${i}].Data.${key}`, (i + 1).toString());
        else
          modifiedFormData.append(`Model.modelData[${i}].Data.${key}`, value);


      });
    });

    this.snackBar.open('Loading...');
    this.suntechApi.postDynamicAPI('TransAttachments/InsertTransAttachments', modifiedFormData).subscribe(
      (res) => {
        this.snackBar.dismiss();
        if (res != null) {
          if (res.status == 'SUCCESS') {

            this.snackBar.open(res.message, 'OK', { duration: 2000 });

          } else {

          }
        }

      });


    // attachmentFile

    // } else {
    //   this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    // }

  }

  docTypeSelected(e: any) {
    console.log(e);
    this.attachmentForm.controls.docType.setValue(e.CODE);
  }

  branchSelected(e: any) {
    this.pendingSalesOrderForm.controls.branchTo.setValue(e.BRANCH_CODE);
  }

  customerCodeSelected(e: any) {
    this.pendingSalesOrderForm.controls.customerCode.setValue(e.CODE);
  }

  posPlanetFileInsert() {
    let netAmt: number = 0;
    let totalBeforeVat: number = 0;
    let totalVat: number = 0;

    const res = this.nationalityMaster.filter((data: any) => data.CODE == this.customerDetailForm.value.fcn_cust_detail_nationality  )
    const natinality = res.length > 0 ? res[0].DESCRIPTION : '';
    const items = this.currentLineItems.filter((data: any) => data.DIVISION != 'X' && data.EXCLUDEGSTVAT == false && data.GSTVATONMAKING == false).map((data: any, i: any) => {

      totalBeforeVat += parseFloat(data.GROSS_AMT);
      netAmt += parseFloat(data.TOTALWITHVATFC);
      totalVat += parseFloat(data.VAT_AMOUNTFC);

      return {
        "Description": data.STOCK_DOCDESC,
        "Quantity": data.PCS || '', //doubt -c 
        "GrossAmount": data.TOTALWITHVATFC,// total amount with vat
        // "GrossAmount": data.GROSS_AMT, //doubt
        "Code": data.STOCK_CODE, //doubt
        "UnitPrice": data.TOTALWITHVATFC, //doubt - c -total amount with vat
        "NetAmount": data.TOTALWITHVATFC, //  total amount with vat
        "VatRate": data.VAT_PER, //doubt -c
        "VatCode": data.VATCODE,
        "VatAmount": data.VAT_AMOUNTFC,
        "MerchandiseGroup": this.comFunc.allbranchMaster.PLANETMERCHANTGROUP, //doubt - branchmaster merchandise
        "TaxRefundEligible": true, //doubt -c
        "SerialNumber": (i + 1).toString() //doubt - srno  - c

      }

    });
    console.log('items', items);
    console.log('summary ', netAmt, totalBeforeVat, totalVat);



    // skip Divison - X
    let postData = {
      // "Version": environment.app_version,
      "Version": '2.0',
      "ReceiptNumber": this.vocDataForm.value.fcn_voc_no.toString(),
      "Date": this.convertDateWithTimeZero(new Date(this.vocDataForm.value.vocdate).toISOString()) || '',
      "Terminal": this.comFunc.allbranchMaster.PLANETTERMINALID, // branchmaster terminal ID
      "Type": "RECEIPT", // c 
      "Order": {
        // "Total": this.order_items_total_gross_amount, // doubt total + vat // net amont - lineitem
        // "TotalBeforeVAT": this.comFunc.transformDecimalVB(
        //   this.comFunc.amtDecimals,
        //   this.prnt_inv_total_gross_amt //  total without vat
        // ),
        // "VatIncl": this.comFunc.transformDecimalVB(
        //   this.comFunc.amtDecimals,
        //   this.order_items_total_tax
        // ), //doubt - total vat amount - c
        "Total": this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          netAmt
        ),
        "TotalBeforeVAT": this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          totalBeforeVat
        ),
        "VatIncl": this.comFunc.transformDecimalVB(
          this.comFunc.amtDecimals,
          totalVat
        ),
        "Items": items,

      },
      "Shopper": {
        "FirstName": this.customerDetailForm.value.fcn_customer_detail_fname || '',
        "LastName": this.customerDetailForm.value.fcn_customer_detail_lname || '',
        "Gender": this.customerDetailForm.value.fcn_cust_detail_gender || '',
        "Nationality": natinality || '',
        "CountryOfResidence": this.customerDetailForm.value.fcn_cust_detail_nationality || '', // doubt - c
        "PhoneNumber": (this.customerDetailForm.value.fcn_mob_code || '') + this.customerDetailForm.value.fcn_cust_detail_phone || '', // with mobile code infornt
        "Email": this.customerDetailForm.value.fcn_cust_detail_email || '',
        "Birth": {
          "Date": this.customerDetailForm.value.fcn_cust_detail_dob || ''
        },
        "ShopperIdentityDocument": {
          "Number": this.customerDataForm.value.fcn_customer_id_number,
          "ExpirationDate": this.convertDateToYMD(this.customerDataForm.value.fcn_customer_exp_date),
          "IssuedBy": "",
          // passport , idcard
          "Type": this.customerDataForm.value.fcn_customer_id_type == 'ID_CARD' ? 'ID_CARD' : 'PASSPORT'
        }

      }
    };


    const API = `POSPlanetFile/CreatePOSPlanetFile/${this.strBranchcode}/${this.vocType}/${this.baseYear}/${this.vocDataForm.value.fcn_voc_no}`;
    this.suntechApi.postDynamicAPI(API, postData)
      .subscribe((resp) => {
        if (resp.status == "Success") {

        }
      });
  }

  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear?VOCDATE=${this.comFunc.cDateFormat(this.vocDataForm.value.vocdate)}`;
    const res = await this.suntechApi.getDynamicAPI(API).toPromise()
    // .subscribe((resp) => {
    console.log(res);
    if (res.status == "Success") {
      this.baseYear = res.BaseFinancialyear;
    }
    // });

  }
}
