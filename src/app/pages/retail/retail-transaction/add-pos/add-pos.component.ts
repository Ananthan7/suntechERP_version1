/** This component used for POS insert, view, edit update. */

import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, Input, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { environment } from '../../../environments/environment';
// import { SuntechapiService } from '../../suntechapi.service';
import { empty, from, noop, Observable, Subscription } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
// import { NgxBarcodeScannerService } from '@eisberg-labs/ngx-barcode-scanner';
// import { round } from 'lodash';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//@ts-ignore
import html2pdf from 'html2pdf.js';

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
import { AuditTrailComponent } from 'src/app/shared/common/audit-trail/audit-trail.component';
import { AuditTrailModel } from 'src/app/shared/data/audit-trial-model';
import { ItemDetailService } from 'src/app/services/modal-service.service';
import { PlanetService } from 'src/app/services/planet-integration.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { MatSelectChange } from '@angular/material/select';
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

const baseUrl = environment.baseUrl;
const baseImgUrl = environment.baseImageUrl;
interface VocTypesEx {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-pos',
  templateUrl: './add-pos.component.html',
  styleUrls: ['./add-pos.component.scss'],
})
export class AddPosComponent implements OnInit {

  @ViewChild("salesPersonCode") salesPersonCode!: MasterSearchComponent;
  @ViewChild('signaturePadCanvas', { static: false }) signaturePadElement!: ElementRef;
  signaturePad!: SignaturePad | undefined;
  private subscriptions: Subscription[] = [];

  @ViewChild(AuditTrailComponent) auditTrailComponent?: AuditTrailComponent;
  @Input() content!: any;

  @ViewChild('print_invoice', { static: true }) printInvoiceDiv!: ElementRef;
  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;

  attachedImageList: any = [];
  @ViewChild('mymodal') public mymodal!: NgbModal;
  public adjust_sale_return_modal_ref!: NgbModalRef;
  @ViewChild('adjust_sale_return_modal', { static: true })
  public adjust_sale_return_modal!: TemplateRef<any>; // Use TemplateRef if it's an ng-template

  public adjustSaleReturnModalRef!: NgbModalRef;
  @ViewChild('oldgoldmodal') public oldgoldmodal!: NgbModal;
  @ViewChild('sales_payment_modal') public sales_payment_modal!: NgbModal;
  @ViewChild('more_customer_detail_modal')
  public more_customer_detail_modal!: NgbModal;
  @ViewChild('userAuthModal')
  public userAuthModal!: NgbModal;

  @ViewChild('paramGrid')
  public paramGrid!: NgbModal;

  @ViewChild('userAttachmentModal')
  public userAttachmentModal!: NgbModal;

  @ViewChild('pendingSalesOrderModal')
  public pendingSalesOrderModal!: NgbModal;
  @ViewChild('salesEstimationModal')
  public salesEstimationModal!: NgbModal;
  selectedModal: NgbModalRef | undefined;
  private cssFilePath = '../../../assets/estimation_pdf.scss';
  // @ViewChild('scanner', { static: false }) scanner: BarcodeScannerLivestreamOverlayComponent;
  // @ViewChild(BarcodeScannerLivestreamComponent) scanner: BarcodeScannerLivestreamComponent;
  selectedItemsCount: number = 0;
  LOCKVOUCHERNO: boolean = true;
  isSignaturePadInitialized = false;
  voucherDetails: any;
  minDate: any;
  maxDate: any;
  isCustomerDetailsAdd:Boolean=false;
  isDiscountAmountTrigger: boolean = false;
  isloading: boolean = false;
  RECEIPT_MODEL: any = {}
  disableSaveBtn: boolean = false;
  isRateCannotLessCost: boolean = false;
  isNewButtonDisabled: boolean = true;
  blockRepeatedBarcode: boolean = false;
  allowDescription: boolean = false;
  isGrossWtEditable: boolean = true;
  isPcsEditable: boolean = true;
  editLineItem: boolean = false;
  amountDecimalFormat: any;
  metalDecimalFormat: any;
  weightDecimalFormat: any;
  gridAmountDecimalFormat: any;
  hideEsignButton: boolean = false;
  hideEsignView: boolean = true;
  isPartialAMLValidation: boolean = false;
  disableEsignButton: boolean = false;
  gridWeghtDecimalFormat: any;
  isOrderPullingRowSelected: boolean = false;
  isEstiPullingRowSelected: boolean = false;
  selectedPendingOrder: any;
  selectedEstimation: any;
  advanceRecieptVoucherNumberList: any[] = [];
  posMode: string = 'ADD';
  accountHeadDetails = '';
  // baseImgUrl = baseImgUrl;
  maskVocDate: any = new Date();
  amlNameValidation;
  amlNameValidationData = false;
  detectDiscountChange = false;
  isGiftTypeRequired: boolean = false;
  value: any;
  barcode!: string;
  isSaved: boolean = false;

  selectedTabIndex = 0;
  receiptDetailView: boolean = false;

  showBoarding: boolean = false;

  private onChangeCallback: (_: any) => void = noop;

  viewOnly: boolean = false;
  editOnly: boolean = false;
  isNewCustomer: boolean = false;
  public isCustProcessing = false;
  isNoDiscountAllowed: boolean = false;

  isRevCalculationBlock: boolean = false;
  isNetAmountChange: boolean = false;
  lineItemModalForSalesReturn: boolean = false;
  salesReturnRowData: any;
  salesReturnRowDataSRNO: any;
  midForInvoce: any = 0;
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
  existingCustomerDetails: any;
  dummyDate = '1900-01-01T00:00:00';
  dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];

  // dummyDate = '01-01-1753T00:00:00';
  dateControl = new FormControl('', [Validators.required]);
  // zeroAmtVal;
  // zeroMQtyVal;

  zeroAmtVal: any;
  zeroMQtyVal: any;
  zeroSQtyVal: any;

  salespersonName: string = '';
  salespersonDescName: string = '';
  branchOptions: string[] = [''];
  filteredBranchOptions!: Observable<any[]>;
  filteredSalesReturnBranchOptions!: Observable<any[]>;
  filteredAdvanceBranchOptions!: Observable<any[]>;
  filteredGiftModeBranchOptions!: Observable<any[]>;

  itemDivision: string = "";
  blockNegativeStock: any = "";
  blockNegativeStockValue: any;
  blockMinimumPrice: any;
  blockMinimumPriceValue: any;
  validatePCS: any;
  enablePieces: boolean = false;

  receiptModesTypes: any;
  receiptModesList: any;
  metalPurchaseDataPost: any = null;
  retailSalesDataPost: any = null;
  retailSReturnDataPost: any = null;

  commisionDetailsWithPayments: any[] = [];
  commisionForCreditCardPayments: any = 0;

  lineItemPcs: any;
  divisionCode: any;
  lineItemGrossWt: any;

  // Dialog box
  dialogBox: any;
  dialogBoxResult: any;
  isStoneIncluded: any;
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

  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,

  };

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  vocTypesinSalesReturn: any = [
    // { value: 'POS', viewValue: 'POS' },
    // { value: 'POS', viewValue: 'POS' },
    // { value: 'PS1', viewValue: 'PS1' },
  ];
  // vocTypesinSalesReturn: VocTypesEx[] = [
  //   // { value: 'POS', viewValue: 'POS' },
  //   { value: 'POS', viewValue: 'POS' },
  //   { value: 'PS1', viewValue: 'PS1' },
  // ];

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
  selectedSchemeIdCollection: any = [];

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
  filteredOptionsMobCode!: Observable<any[]>;
  filteredOptionsCountry!: Observable<any[]>;
  salesPersonFilteredOptions!: Observable<any[]>;
  salesPersonOptions: any[] = [];
  schemeList: any[] = [];
  netTotal: any;
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
  voucherNumber: string = "";
  currentDate = new Date(new Date());
  isPrintingEnabled: boolean = false;
  currentStockCode: any;

  stoneWtPreVal = 0;
  isCustomerFindsOnCode: boolean = false;
  isCCTransaction: boolean = false;
  customerDetails: any = {};
  remarks: string = ''; 
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
  schemeReceiptForm: FormGroup;
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
    orderNo: [''],
    customerCode: [''],
  });

  itemcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 51,
    SEARCH_FIELD: "STOCK_CODE",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Item Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  itemcodeSelected(value: any) {
    this.lineItemForm.controls.fcn_li_item_code.setValue(value.STOCK_CODE);
    this.lineItemForm.controls.fcn_li_item_desc.setValue(value.DESCRIPTION);
    this.getStockDesc({
      target: {
        value: value.STOCK_CODE
      }
    });
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.lineItemForm.controls.fcn_li_division.setValue(e.DIVISION_CODE);

  }
  isDisabled: boolean = true;

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
  advanceRecieptAmount = '0.00';
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
  isAllowWithoutRate: boolean = false;
  isPromotionalItem: boolean = false;
  currentLineItems: any = [];
  currentsalesReturnItems: any = [];
  currentExchangeMetalPurchase: any[] = [];
  currentExchangeMetalPurchaseGst: any[] = [];

  salesReturnsItems_forVoc: any = [];
  advancePartyCode: string = "";
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
  order_items_total_net_amount_org: any;
  order_items_total_gross_amount: any;
  order_items_total_discount_amount: string = '0.00';
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
  autoPosting: any;
  isAutoPosting: boolean = false;
  baseYear: any = '';
  updateBtn!: boolean;
  all_branch: any;
  orderedItemEditId: any;
  salesReturnEditId: any;
  salesReturnEditCode: any = '';
  salesReturnVocNumber: any = '';
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

  currencyMaster: any = [];
  currencyMasterOptions!: Observable<any[]>;
  selectedCurrencyData: any;
  sortedCountryList: any;
  yearCollection: any;

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
  isInvalidGIftVocNo: boolean = false;

  maxGiftAmount: number = 0;
  giftVocNo: string = "";

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

  giftTypeOptions: any = [
    // { value: 'Cash', label: 'Cash' },
    // { value: 'Gold', label: 'Gold' },
    // { value: 'Diamond', label: 'Diamond' },
  ];

  transAttachmentList: any[] = [];
  transAttachmentListData: any[] = [];

  transColumnList: any[] = [
    { title: 'MID', field: 'KYCrefmid' },
    { title: 'Voucher Type', field: 'VOCTYPE' },
    { title: 'Remarks', field: 'REMARKS' },
    // { title: 'Attachment', field: 'ATTACHMENT_PATH' },
    { title: 'Doc Type', field: 'DOC_TYPE' },
    { title: 'Expiry Date', field: 'EXPIRE_DATE' },

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
  estimationList: any[] = [];
  pendingOrderList: any[] = [];
  pendingOrderColumnList: any[] = [
    { title: 'Order No.', field: 'VOCNO', alignment: 'right' },
    { title: 'Order Date', field: 'VOCDATE', alignment: 'left' },
    { title: 'Delivery Date', field: 'DELIVERYDATE', alignment: 'left' },
    {
      title: 'Amount',
      field: 'NETVALUE_CC',
      alignment: 'right',
      format: {
        type: 'fixedPoint',
        precision: 2,
      },
    },
    { title: 'Customer Code', field: 'POSCUSTCODE', alignment: 'left' },
  ];

  estimationColumnList: any[] = [
    { title: 'Estimation Date', field: 'orderdate' },
    { title: 'Estimation No.', field: 'orderno' },
    { title: 'Sales Man Code', field: 'custcode' },
    { title: 'Customer Code', field: 'custcode' },
    { title: 'Customer Mobile', field: 'custcode' },
    { title: 'Customer Name', field: 'custcode' },
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




  get vocDateVal(): Date {
    return this.vocDataForm.controls.vocdate.value;
  }

  attachmentFile: any;
  parameterDetails: any[] = [];
  constructor(
    private modalService: NgbModal,
    private suntechApi: SuntechAPIService,
    private planetService: PlanetService,
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
    private activeModal: NgbActiveModal,
    public indexedApiService: IndexedApiService,
    public lineItemService: ItemDetailService,

  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
    this.strUser = localStorage.getItem('username');
    this.baseYear = localStorage.getItem('YEAR');
    let branchParams: any = localStorage.getItem('BRANCH_PARAMETER')
    this.comFunc.allbranchMaster = JSON.parse(branchParams);
    this.isGiftTypeRequired = this.comFunc.allbranchMaster.BRNCHSHOW_GIFTMODULE ? this.comFunc.allbranchMaster.BRNCHSHOW_GIFTMODULE : false;
    this.isPartialAMLValidation = this.comFunc.allbranchMaster.PARTIALAMLSCANNING;
    this.amlNameValidation = this.comFunc.allbranchMaster.AMLNAMEVALIDATION;

    this.getBranchList();

    let isLayoutRTL = false;
    this.page_language = 'ARABIC';
    this.changeRtlLayout(isLayoutRTL);

    this.orders = [];
    this.order_items_total_net_amount = 0.0;
    this.order_items_total_net_amount_org = 0.0;


    this.customerDataForm = this.formBuilder.group({
      fcn_customer_mobile: ['', Validators.required],
      fcn_customer_name: ['', Validators.required],
      fcn_customer_id_number: ['', Validators.required],
      fcn_customer_id_type: ['', [Validators.required, this.autoCompleteValidator(() => this.idTypeOptions)]],
      fcn_customer_code: ['',],
      fcn_customer_exp_date: ['', Validators.required],
      tourVatRefuncYN: [false],
      tourVatRefundNo: ['']
    });

    this.vocDataForm = this.formBuilder.group({
      fcn_voc_no: ['',],
      // fcn_voc_no: ['', Validators.required],
      voc_type: [''],
      voc_no: [1],
      sales_person: ['', [Validators.required, this.autoCompleteValidator(() => this.salesPersonOptions, 'SALESPERSON_CODE')]],
      vocdate: ['', Validators.required],
      txtCurrency: [],
      txtCurRate: [],

    });

    this.vocDataForm.controls['vocdate'].setValue(this.currentDate);

    this.lineItemForm = this.formBuilder.group({
      fcn_li_item_code: ['', { autofocus: true }, Validators.required],
      fcn_li_item_desc: ['', Validators.required],
      fcn_li_division: [{ value: '', disabled: true }, Validators.required],
      fcn_li_location: [''],
      fcn_li_gift_type: [''],
      // fcn_li_location: ['', Validators.required],
      fcn_li_pcs: [0, Validators.required],
      fcn_li_gross_wt: ['', [Validators.required, Validators.min(0)]],
      // fcn_li_gross_wt: [{ value: 0, disabled: true }, Validators.required],
      fcn_li_stone_wt: [0, Validators.required],
      fcn_li_net_wt: [0, Validators.required],
      // fcn_li_rate: ['', Validators.required,],
      fcn_li_rate: [0, [Validators.required]],
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
      fcn_exchange_net_amount:  [''],
      fcn_exchange_scrap_bag_no: [''],
      fcn_exchange_scrap_bag_desc: [''],
      fcn_exchange_location: [''],
      fcn_exchange_jawahara: [''],
      fcn_exchange_resale_recycle: [''],
      fcn_exchange_cash_exchange: [''],

    });

    this.customerDetailForm = this.formBuilder.group({
      fcn_customer_detail_name: ['', Validators.required],
      fcn_customer_detail_fname: [''],
      fcn_customer_detail_mname: [''],
      fcn_customer_detail_lname: [''],
      fcn_cust_detail_gender: [''],
      fcn_cust_detail_marital_status: [''],
      fcn_cust_detail_dob: ['',
        [Validators.required]
      ],
      fcn_cust_detail_idType: ['', [Validators.required, this.autoCompleteValidator(() => this.idTypeOptions)]],
      fcn_cust_detail_phone: ['', Validators.required],
      fcn_cust_detail_phone2: [''],
      fcn_cust_detail_email: ['', [Validators.email]],
      fcn_cust_detail_address: [''],
      // fcn_cust_detail_address: [''],
      fcn_cust_detail_country: ['', [Validators.required]],
      fcn_cust_detail_city: ['', [this.autoCompleteValidator(() => this.cityMaster, 'CODE')]],
      fcn_cust_detail_nationality: ['', [Validators.required, this.autoCompleteValidator(() => this.nationalityMaster, 'CODE')]],
      fcn_cust_detail_idcard: ['', Validators.required],
      fcn_cust_detail_designation: ['', Validators.required],
      fcn_cust_detail_company: [''],
      fcn_cust_detail_state: ['', [this.autoCompleteValidator(() => this.stateMaster, 'CODE')]],

      fcn_mob_code: ['', [Validators.required]],
      fcn_customer_exp_date: ['', [Validators.required]],
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

    this.schemeReceiptForm = this.formBuilder.group({
      scheme_rec_mode: ['', Validators.required],
      scheme_code: ['', Validators.required],
      scheme_name: ['', Validators.required],
      schemeNo: ['', Validators.required],
      schemeAmtFC: ['', [Validators.required, Validators.min(0.1)]],

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
    this.order_items_total_net_amount_org = '0.00';

    // let randomvocno = Math.floor(Math.random() * 100000000 + 1);
    let randomvocno = Math.floor(Math.random() * 1000000 + 1);
    // this.vocDataForm.controls['fcn_voc_no'].setValue(randomvocno);
    console.log(randomvocno, 'randomvocno');

    this.customerDetailForm.controls.fcn_mob_code.setValue(this.comFunc.allbranchMaster.MOBILECOUNTRY_CODE);

    // this.getArgs();
    this.indexedDb.getAllData('compparams').subscribe((data) => {
      if (data.length > 0) {
        console.log('==============compparams======================');
        console.log(data);
        console.log('====================================');
        this.comFunc.allCompanyParams = data;

        let companyParameter = '';
        let companyParameterNewCustomer = this.comFunc.allCompanyParams.find((item: any) => item.PARAMETER === 'POSCUSTDETAILSADDNEW');
        let companyParameterObject = this.comFunc.allCompanyParams.find((item: any) => item.PARAMETER === 'POSSHOPCTRLAC');
        let allowRepeatedStocks=this.comFunc.allCompanyParams.find((item: any) =>
          item.PARAMETER === 'DONTALLOW2BARCODES')
        this.blockRepeatedBarcode = this.comFunc.numberToBoolean(Number(allowRepeatedStocks.PARAM_VALUE));
        if (companyParameterNewCustomer) {
          this.isCustomerDetailsAdd = this.comFunc.numberToBoolean(Number(companyParameterNewCustomer.PARAM_VALUE));

        }

        if (companyParameterObject) {
          companyParameter = companyParameterObject.PARAM_VALUE;
          this.getAccountHead(companyParameter);

        }
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
    // this.indexedDb.getAllData('comboFilter').subscribe((data) => {
    //   if (data.length > 0) {
    //     this.comFunc.comboFilter = data;
    //     console.log(data, 'data');

    //   }
    // });
    this.indexedDb.getAllData('divisionMaster').subscribe((data) => {
      console.log('divisionMasterList', data);

      if (data.length > 0) {
        console.log('divisionMasterList', data);

        this.comFunc.divisionMasterList = data;
      }
    });
    // this.indexedDb.getAllData('countryMaster').subscribe((data) => {
    //   if (data.length > 0) {
    //     this.comFunc.countryMaster = data;
    //   }
    // });
    // this.indexedDb.getAllData('nationalityMaster').subscribe((data) => {
    //   if (data.length > 0) {
    //     this.comFunc.nationalityMaster = data;
    //   }
    // });
    // this.indexedDb.getAllData('idMaster').subscribe((data) => {
    //   if (data.length > 0) {
    //     console.log('idMaster', data);
    //     this.comFunc.idMaster = data;
    //   }
    // });
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

    this.zeroAmtVal = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      0
    );
    this.zeroMQtyVal = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      0
    );
    this.zeroSQtyVal = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BSQTYDECIMALS,
      0
    );
  }



  getAccountHead(parameterValue: string) {

    // const API = `AccountMaster/${parameterValue}`;
    // this.suntechApi.getDynamicAPI(API)

    const API = `AccountMaster`;
    // let sub: Subscription = this.suntechApi.getDynamicAPI(`AccountMaster`)
    this.suntechApi.getDynamicAPI(API).subscribe((res: any) => {
      if (res.status == "Success") {
        console.log('res', res);
        this.accountHeadDetails = res.response.ACCOUNT_HEAD;

      }
    });
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



  SchemeMasterFindData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 72,
    SEARCH_FIELD: "SCH_SCHEME_CODE",
    SEARCH_HEADING: "Scheme Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "SCH_SCHEME_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

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
  //           this.comFunc.allbranchMaster?.BAMTDECIMALS = data.PARAM_VALUE;
  //         if (data.Parameter == 'MQTYDECIMALS')
  //           this.comFunc.allbranchMaster?.BMQTYDECIMALS = data.PARAM_VALUE;
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
  //         this.comFunc.allbranchMaster?.BAMTDECIMALS,
  //         0
  //       );
  //       this.zeroMQtyVal = this.comFunc.transformDecimalVB(
  //         this.comFunc.allbranchMaster?.BMQTYDECIMALS,
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

  afterSave(value: any) {
    if (value) {
      this.vocDataForm.reset()
      this.close('reloadMainGrid')
    }
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  
  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  deleteSaleRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.MID) {
      this.comFunc.toastErrorByMsgId('MSG2347');
      return;
    }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = `RetailSales/DeleteRetailSales/${this.content.BRANCH_CODE}/${this.content.VOCTYPE}/${this.content.VOCNO}/${this.content.YEARMONTH}`;
        let Sub: Subscription = this.suntechApi.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog('Voucher '+ this.content?.VOCNO + ' Deleted successfully');
              } else {
                this.comFunc.toastErrorByMsgId('MSG2272');
              }
            } else {
              this.comFunc.toastErrorByMsgId('MSG1880');
            }
          }, err => {
            this.comFunc.toastErrorByMsgId('MSG1531')
          });
        this.subscriptions.push(Sub);
      }
    });
  }

  async getArgs() {
    console.log('======content==============================');
    console.log(this.content);
    console.log('====================================');
    // need to enable
    // this.vocType = this.comFunc.getqueryParamVocType()
    if (this.content != undefined)
      this.posMode = this.content?.FLAG;

    if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW'||this.content?.FLAG == 'DELETE') {
      this.LOCKVOUCHERNO = true;
      this.vocDataForm.controls.fcn_voc_no.setValue(this.content.VOCNO);
      this.vocDataForm.controls.vocdate.setValue(this.content.VOCDATE);
      this.voucherNumber = this.content.VOCNO ?? "";
      await this.getFinancialYear();

      this.strBranchcode = this.content.BRANCH_CODE;
      this.vocType = this.content.VOCTYPE;
      this.vocDataForm.controls.voc_type.setValue(this.vocType);
      // this.baseYear = this.content.YEARMONTH;
      this.getRetailSalesMaster(this.content);
      if (this.content.FLAG == "EDIT") {
        this.editOnly = true;
        this.enableFormControls(true);
        this.voucherDetails = this.comFunc.getVoctypeMasterByVocTypeMain(this.strBranchcode, this.vocDataForm.value.voc_type, this.mainVocType)
        console.log(this.voucherDetails)
      }
      else if (this.content.FLAG == 'VIEW') {
        this.viewOnly = true;

      }  
      else if (this.content.FLAG == 'DELETE') {
      this.viewOnly = true;
      this.deleteSaleRecord()
      }

      console.log('!this.viewOnly && !this.editOnly', this.viewOnly, this.editOnly);



    } else {
      await this.getFinancialYear();
      await this.generateVocNo();
      this.voucherDetails = this.comFunc.getVoctypeMasterByVocTypeMain(this.strBranchcode, this.vocDataForm.value.voc_type, this.mainVocType)
      // this.setVoucherTypeMaster();
    }

    if (!this.viewOnly && !this.editOnly && !this.amlNameValidation && this.isCustomerDetailsAdd)
      this.open(this.mymodal);

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

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.vocDataForm.controls.vocdate.setValue(new Date(date))
    }
  }


  getRetailSalesMaster(data: any) {

    this.snackBar.open('Loading...');

    // let param={
    //   BranchCode:data.BRANCH_CODE,
    //   VocType:data.VOCTYPE,
    //   YearMonth:data.YEARMONTH,
    //   VocNo:data.VOCNO,
    //   Mid:data.MID

    // }
    // let sub: Subscription = this.suntechApi.getDynamicAPIwithParams('RetailSalesDataInDotnet/GetRetailSalesData',param)

    let API = `RetailSalesDataInDotnet/GetRetailSalesData/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.YEARMONTH}/${data.VOCNO}/${data.MID}`
    console.log('getRetailSalesMaster vocno', data.VOCNO);
    this.suntechApi.getDynamicAPI(API)
      .subscribe((res) => {
        this.snackBar.dismiss();
        // console.log(res, 'getRetailSalesMaster');
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
          this.metalPurchaseDataVocNo = metalPurchaseData?.VOCNO;

          this.retailSalesMID = retailSaleData.MID;
          this.retailSReturnDataMID = retailSReturnData.MID;
          this.metalPurchaseDataMID = metalPurchaseData?.MID;
          // alert(this.retailSaleDataVocNo);
          // alert(this.retailSReturnVocNo);
          // alert(this.metalPurchaseDataVocNo);
          this.karatRateDetails =
            // karatRate;

            karatRate.map((item: any) => {
              item.KARAT_RATE = this.comFunc.decimalQuantityFormat(item.KARAT_RATE, 'AMOUNT');
              item.POPKARAT_RATE = this.comFunc.decimalQuantityFormat(item.POPKARAT_RATE, 'AMOUNT');
              return item;
            });

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
          this.getUserAttachments();

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
            this.dummyDateCheck(posCustomer.POSCUSTIDEXP_DATE)
          );
          this.customerDataForm.controls.fcn_customer_exp_date.setValue(
            this.dummyDateCheck(posCustomer.POSCUSTIDEXP_DATE)
          );

          this.customerDetails = posCustomer;

          if (this.amlNameValidation)
            if (!posCustomer.AMLNAMEVALIDATION && posCustomer.DIGISCREENED) {
              this.amlNameValidationData = false;
            } else {
              this.amlNameValidationData = true;
              if (!this.viewOnly)
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
            retailSaleData.RetailDetails.forEach((data: any, index: any) => {
              data.SRNO = index + 1;
            });

          retailSaleData.RetailDetails.map((data: any, index: any) => {
            console.log(
              '===============retailSalesDetails====================='
            );
            console.log(data, index);
            console.log('====================================');

            this.newLineItem = data;
            // this.newLineItem.IGST_ACCODE_NON_POS = retailSaleData?.RetailDetails?.[0]?.IGST_ACCODE ?? '';
            // this.newLineItem.HSN_CODE = retailSaleData?.RetailDetails?.[0]?.HSN_CODE ?? '';


            const values: any = {
              ID: data.SRNO,
              sn_no: data.SRNO,
              // sn_no: index + 1,
              stock_code: data.STOCK_CODE,
              // mkg_amount: ( || 0),
              total_amount: data.DIVISION_CODE == 'D' ? (data.MKGVALUEFC - data.DISCOUNTVALUEFC) : data.MKGVALUEFC || 0,
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
              metal_rate: data.METALVALUECC || 0,
              taxPer: data.VAT_PER || 0,
              metal_amt: data.METALVALUECC,
              // this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) || 0,
              stone_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount) || 0,
            };

            this.newLineItem.PCS = data.PCS;
            // this.newLineItem.pure_wt = data.PURITY;
            // this.newLineItem.STONEWT = data.STONE_WT;
            // this.newLineItem.total_amount = data.MKGVALUEFC;
            // this.newLineItem.divisionMS = data.divisionMS;
            this.order_items_slno_length = data.ID;
            this.ordered_items.push(values);
            this.currentLineItems.push(data);
            const divisionMS: any = this.comFunc.getDivisionMS(data.DIVISION_CODE);
            this.currentLineItems[index].divisionMS = divisionMS;
            if (divisionMS == 'M') {
              values.gross_amt = data.TOTAL_AMOUNTCC;
              this.currentLineItems[index].GROSS_AMT = data.TOTAL_AMOUNTCC;
            } else {
              values.gross_amt = data.MKGVALUEFC - data.DISCOUNTVALUECC;
              this.currentLineItems[index].GROSS_AMT = data.MKGVALUEFC - data.DISCOUNTVALUECC;
            }

          });

          this.order_items_total_discount_amount = retailSaleData.DISCOUNT;

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

    this.suntechApi.getDynamicAPICustom('UseBranchNetMaster/' + this.strUser).subscribe((resp) => {
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

      this.salesReturnForm.controls.fcn_returns_branch.setValue(this.strBranchcode);
      this.advanceReceiptForm.controls.advanceBranch.setValue(this.strBranchcode);
      this.giftReceiptForm.controls.giftBranch.setValue(this.strBranchcode);
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

  ngAfterViewChecked(): void {
    if (!this.isSignaturePadInitialized && !this.hideEsignView && this.signaturePadElement) {
      this.initializeSignaturePad()
        .then(() => {
          console.log('Signature pad initialized');
        })
        .catch((error) => {
          console.error('Signature pad initialization failed:', error);
        });
    }
  }

  initializeSignaturePad(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.signaturePadElement && !this.isSignaturePadInitialized) {
        const canvasElement = this.signaturePadElement.nativeElement;

        canvasElement.width = 450;
        canvasElement.height = 200;

        canvasElement.style.width = '100%';
        canvasElement.style.height = 'auto';

        this.signaturePad = new SignaturePad(canvasElement, {
          backgroundColor: 'white',
          penColor: 'black',
          minWidth: 0.5,
          maxWidth: 2.0,
        });

        this.isSignaturePadInitialized = true;
        resolve();
      } else {
        reject('Signature pad element not found or already initialized');
      }
    });
  }


  openEsign() {
    this.hideEsignView = false;
    this.isSignaturePadInitialized = false;
  }

  cancelEsign() {
    this.hideEsignView = true;
  }

  onValueChanges(result: any) {
    alert(JSON.stringify(result));
    this.barcode = result.codeResult.code;
    alert(this.barcode);
    // this.lineItemForm.controls.fcn_li_item_code.setValue(result.codeResult.code);
  }




  onChanges(): void {
    this.customerDataForm.value.tourVatRefuncYN.valueChanges.subscribe((isChecked: any) => {
      const tourVatRefundNoControl = this.customerDataForm.value.tourVatRefundNo;
      if (isChecked) {
        tourVatRefundNoControl.enable();
      } else {
        tourVatRefundNoControl.disable();
      }
    });
  }
  async ngOnInit(): Promise<void> {
    this.isNewButtonDisabled = true;

    this.fetchPramterDetails();
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
    this.autoPosting = this.comFunc.getAutopostingFlag();
    this.isAutoPosting = this.comFunc.stringToBoolean(this.autoPosting);
    this.vocType = this.comFunc.getqueryParamVocType();
    this.mainVocType = this.comFunc.getqueryParamMainVocType();
    // this.baseYear = this.content.YEARMONTH;
    this.vocDataForm.controls.voc_type.setValue(this.vocType);

    let isLayoutRTL = false;
    this.page_language = 'ENGLISH';
    this.getPartyCode();
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
    this.getMobCodeMaster();
    this.getCountryMaster();
    this.getSalesPersonMaster();
    this.getMasters();
    this.getBranchCurrencyList();
    this.getIdMaster();
    this.getCreditCardList();
    this.getExchangeStockCodes();
    this.getMaritalStatus();
    this.getAccountLookup();
    this.checkDiscountEligible();
    // this.onChanges();
    // this.getComboFilters();


    this.posPlanetIssuing = this.comFunc.allbranchMaster.POSPLANETISSUING;
    this.userwiseDiscount = this.comFunc.getCompanyParamValue('USERWISEDISCOUNT').toString() == '0' ? false : true;

    this.vocDataForm.controls.txtCurrency.setValue(this.comFunc.compCurrency);

    this.vocDataForm.controls.txtCurRate.setValue(
      this.comFunc.decimalQuantityFormat(this.comFunc.getCurrRate(this.comFunc.compCurrency), 'RATE'))


    // this.findCurDataByCode(this.comFunc.compCurrency, true);


    this.getSalesReturnVocTypes();

    // this.metalDecimalFormat = {
    //   type: 'fixedPoint',
    //   precision: Number(this.comFunc.allCompanyParameters[0].MRATEDECIMALS),
    // };
    this.amountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comFunc.allbranchMaster?.BAMTDECIMALS,
    };
    this.weightDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comFunc.allbranchMaster?.BMQTYDECIMALS,
    };
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comFunc.allbranchMaster?.BAMTDECIMALS,
      currency: this.comFunc.compCurrency
    };

  }

  getKaratDetails() {
    if (!this.editOnly && !this.viewOnly) {
      this.suntechApi
        .getDynamicAPI(`BranchKaratRate/${this.strBranchcode}`)
        .subscribe((resp) => {
          if (resp.status == 'Success') {
            let temp_karatrate: any = resp.response;
            for (var i = 0; i < temp_karatrate.length; i++) {
              // let karat_codes = ['14', '18', '20', '21', '22', '24'];
              // if (karat_codes.includes(temp_karatrate[i].KARAT_CODE)) {
              if (temp_karatrate[i]['KARAT_RATE'].toString() != '0') {
                temp_karatrate[i]['POPKARAT_RATE'] =
                  this.comFunc.transformDecimalVB(
                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                    temp_karatrate[i]['POPKARAT_RATE'])
                temp_karatrate[i]['KARAT_RATE'] =
                  this.comFunc.transformDecimalVB(
                    this.comFunc.allbranchMaster?.BAMTDECIMALS,
                    temp_karatrate[i]['KARAT_RATE'])

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
    console.log(this.ordered_items)
  }

  getMaritalStatus() {
    this.maritalStatusList = this.comFunc.getComboFilterByID('Marital Status').filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );
    this.genderList = this.comFunc.getComboFilterByID('gender').filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );

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
  //       this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
  //       this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
  addReceiptFormValidation() {

    this.addValidationsForForms(this.cashreceiptForm, 'cashAmtFC', [
      Validators.required, Validators.min(0.1)
    ]);
    this.addValidationsForForms(this.creditCardReceiptForm, 'cardAmtFC', [
      Validators.required, Validators.min(0.1)
    ]);
    this.addValidationsForForms(this.advanceReceiptForm, 'advanceAmount', [
      Validators.required, Validators.min(0.1)
    ]);
    this.addValidationsForForms(this.othersReceiptForm, 'othersAmtFC', [
      Validators.required, Validators.min(0.1)
    ]);
    this.addValidationsForForms(this.giftReceiptForm, 'giftAmtFC', [
      Validators.required, Validators.min(0.1)
    ]);
    this.addValidationsForForms(this.customerReceiptForm, 'customerAmtFC', [
      Validators.required, Validators.min(0.1)
    ]);
  }

  removeReceiptFormValidation() {
    this.removeValidationsForForms(this.cashreceiptForm, ['cashAmtFC']);
    this.removeValidationsForForms(this.creditCardReceiptForm, ['cardAmtFC']);
    this.removeValidationsForForms(this.advanceReceiptForm, ['advanceAmount']);
    this.removeValidationsForForms(this.othersReceiptForm, ['othersAmtFC']);
    this.removeValidationsForForms(this.giftReceiptForm, ['giftAmtFC']);
    this.removeValidationsForForms(this.customerReceiptForm, ['customerAmtFC']);
  }

  validateReceipt() {

    if (this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal) != 0 || this.comFunc.emptyToZero(this.order_total_exchange)) {

      this.removeReceiptFormValidation();
    } else {
      this.addReceiptFormValidation();
    }

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
    }

    else if (this.selectedTabIndex == 5) {
      return this.customerReceiptForm.invalid;
    }

    else {
      return this.schemeReceiptForm.invalid;
    }
  }
  saveReceipt(type?: any) {

    console.log(
      'invReturnSalesTotalNetTotal',
      this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal),
      'order_total_exchange',
      this.comFunc.emptyToZero(this.order_total_exchange)
    );



    const res = this.validateReceipt();

    this.addReceiptFormValidation();

    if (this.selectedTabIndex == 2 && this.isInvalidRecNo) {
      this.snackBar.open('Invalid Receipt No.', 'OK', {
        duration: 2000
      });
    } else if (this.selectedTabIndex == 4 && this.isInvalidGIftVocNo) {
      this.snackBar.open('Invalid Gift Voc No.', 'OK', {
        duration: 2000
      });
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
      let PAYMENT_MODE = '';
      let COMMISSION_RATE = 0;
      let IGST_AMOUNT = 0;
      let SCHEME_ID = '';
      let SCHEME_CODE = '';

      if (this.selectedTabIndex == 0) {
        RECEIPT_MODE = this.cashreceiptForm.value.paymentsCash.toString();
        ARECVOCNO = '';
        this.isCCTransaction = false;
        AMOUNT_FC = this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtLC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        PAYMENT_MODE = 'CASH'
        ARECMID = 0;
      } else if (this.selectedTabIndex == 1) {
        RECEIPT_MODE = this.creditCardReceiptForm.value.paymentsCreditCard.toString();
        this.isCCTransaction = true;
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC);
        COMMISSION_RATE = this.comFunc.emptyToZero(AMOUNT_FC * (this.commisionForCreditCardPayments / 100));
        IGST_AMOUNT = parseFloat(this.comFunc.emptyToZero(COMMISSION_RATE * (5 / 100)).toFixed(2));
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = (this.creditCardReceiptForm.value.cardCCNo).toString();
        PAYMENT_MODE = 'CARD'
        ARECMID = 0;
      } else if (this.selectedTabIndex == 2) {
        RECEIPT_MODE = this.advanceReceiptForm.value.paymentsAdvance.toString();
        ARECVOCNO = this.advanceReceiptForm.value.advanceRecNo;
        this.isCCTransaction = false;
        AMOUNT_FC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount), this.vocDataForm.value.txtCurRate);
        IGST_PER = this.advanceReceiptDetails['IGST_PER'] ?? 0;
        HSN_CODE = this.advanceReceiptDetails['HSN_CODE'] ?? "";
        GST_CODE = this.advanceReceiptDetails['DT_GST_CODE'] ?? "";
        IGST_ACCODE = this.advanceReceiptDetails['IGST_ACCODE'] ?? "";
        IGST_AMOUNTFC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountFC);
        IGST_AMOUNTCC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountLC);
        // IGST_AMOUNTCC = baseCtrl.FCToCC(
        //     baseCtrl.compCurrency, this.comFunc.emptyToZero(receiptAmtLC.text));
        CARD_NO = '0';
        PAYMENT_MODE = 'ADVANCE';
        REC_BRANCHCODE = this.advanceReceiptForm.value.advanceBranch;
        FYEARCODE = this.advanceReceiptForm.value.advanceYear;
        ARECMID = this.advanceReceiptDetails['MID'] ?? 0;
      } else if (this.selectedTabIndex == 3) {
        RECEIPT_MODE = this.othersReceiptForm.value.paymentsOthers.toString();
        ARECVOCNO = '';
        this.isCCTransaction = false;
        AMOUNT_FC = this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        PAYMENT_MODE = 'OTHERS'
        CARD_NO = '0';

        ARECMID = 0;
      } else if (this.selectedTabIndex == 4) {
        RECEIPT_MODE = this.giftReceiptForm.value.paymentsCreditGIftVoc.toString();
        ARECVOCNO = this.giftReceiptForm.value.giftVocNo || "";
        this.isCCTransaction = false;
        AMOUNT_FC = this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        PAYMENT_MODE = 'GIFT'
        ARECMID = 0;

      } else if (this.selectedTabIndex == 5) {
        RECEIPT_MODE = this.customerReceiptForm.value.customAcCodeList.toString();
        ARECVOCNO = '';
        this.isCCTransaction = false;
        AMOUNT_FC = this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtLC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        PAYMENT_MODE = 'CUSTOMER'
        ARECMID = 0;
      }

      //SCHEME_UPDATE
      else if (this.selectedTabIndex == 6) {
        RECEIPT_MODE = this.schemeReceiptForm.value.scheme_rec_mode.toString();
        ARECVOCNO = this.schemeReceiptForm.value.schemeNo || "";
        this.isCCTransaction = false;

        AMOUNT_FC = this.comFunc.emptyToZero(this.schemeReceiptForm.value.schemeAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.schemeReceiptForm.value.schemeAmtFC), this.vocDataForm.value.txtCurRate);

        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        PAYMENT_MODE = 'SADV';
        ARECMID = 0;
        SCHEME_ID = this.schemeReceiptForm.value.scheme_name;
        SCHEME_CODE = this.schemeReceiptForm.value.scheme_code;
      }

      this.receiptDetailsList?.forEach((e: any, i: any) => {
        e.SRNO = i + 1;
      });
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

      AMOUNT_FC = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        AMOUNT_FC
      )
      AMOUNT_CC = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        AMOUNT_CC
      )
      var receiptDetails = {
        "SRNO": receiptSrNO,
        "REFMID": this.retailSalesMID || receiptSrNO,
        "VOCTYPE": this.vocType,
        "VOCNO": this.retailSaleDataVocNo ?? receiptSrNO,
        "VOCDATE": new Date().toISOString(),
        "BRANCH_CODE": this.strBranchcode,
        "REC_BRANCHCODE": this.strBranchcode,
        "YEARMONTH": this.baseYear,
        "RECEIPT_MODE": RECEIPT_MODE,
        "CURRENCY_CODE": this.comFunc.compCurrency,
        // "CURRENCY_RATE": this.comFunc.currencyRate ?? '1',
        "CURRENCY_RATE": '1',
        "AMOUNT_FC": AMOUNT_FC,
        "AMOUNT_CC": AMOUNT_CC,
        "DESCRIPTION": "",
        "FYEARCODE": this.baseYear,
        // "FYEARCODE": "2023",

        "ARECVOCNO": ARECVOCNO,
        // "ARECVOCNO": advanceRecNo.text,
        "ARECVOCTYPE": "PCR", //doubt
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
        "CARD_HOLDER": this.isCCTransaction ? this.customerDataForm.value.fcn_customer_name : '',
        "CARD_VALID": "0",
        "CREDITDAYS": "0",
        "VALUE_DATE": new Date().toISOString(),
        "SGST_ACCODE": "0",
        "IGST_ACCODE": IGST_ACCODE.toString() ?? "0",
        "CGST_CTRLACCODE": "0",
        "SGST_CTRLACCODE": "0",
        "IGST_CTRLACCODE": "0",
        "CGST_PER": "0.00",
        "CGST_AMOUNTFC": "0.000",
        "CGST_AMOUNTCC": "0.000",
        "SGST_PER": "0.00",
        "SGST_AMOUNTFC": "0.000",
        "SGST_AMOUNTCC": "0.000",
        "IGST_PER": this.isCCTransaction ? this.newLineItem.IGST_PER : '0',
        "IGST_AMOUNTFC": IGST_AMOUNTFC,
        "IGST_AMOUNTCC": IGST_AMOUNTCC,
        "HSN_CODE": this.isCCTransaction ? this.newLineItem.HSN_CODE : '',
        "GST_CODE": this.isCCTransaction ? this.newLineItem.GST_CODE.toString() : '',
        "CGST_ACCODE": "0",
        "REC_COMM_AMOUNTFC": COMMISSION_RATE,
        "REC_COMM_AMOUNTCC": COMMISSION_RATE,
        "POS_CREDIT_ACCODE": "0",
        "POS_CREDIT_ACNAME": "0",
        "DT_YEARMONTH": this.baseYear,
        // "DT_YEARMONTH": "2022",
        "RECEIPT_TYPE": PAYMENT_MODE,
        "GIFT_CARD_BRANCH": "0",
        "WOOCOMCARDID": "0",

        // new fields added 27-12-2023
        "NEWUNIQUEID": 0,
        "SCHEME_CODE": SCHEME_CODE,
        "SCHEME_ID": SCHEME_ID

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

      console.log(this.receiptDetailsList)

      this.selectedSchemeIdCollection = this.receiptDetailsList
        .map((detail: any) => detail.SCHEME_ID)
        .filter((schemeId: any) => schemeId !== "");
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
      console.log('receipt detail', this.receiptDetailsList);
    } else {
      this.snackBar.open('Please Fill All Fields', 'OK', {
        duration: 2000
      });

      // this.snackBar.open('Please Fill All Fields', 'OK');
    }

  }

  public salesRetClose(data: any = null) {
    if (this.viewOnly) {
      this.adjustSaleReturnModalRef.close(data); 
    } else {
      this.openDialog('Warning', this.comFunc.getMsgByID('MSG1212'), false);

      this.dialogBox.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {
          let stockCodesToRemove = this.salesReturnsItems_forVoc.map((item: any) => item.STOCK_CODE);

          this.sales_returns_items = this.sales_returns_items.filter((item: any) => !stockCodesToRemove.includes(item.stock_code));
          
          this.adjustSaleReturnModalRef.close(data);
        }
      });
    }
  }

  close(data: any = null) {

    // this.openDialog(
    //   'Warning',
    //   'Are you sure want to close ?',
    //   false
    // );
    if (this.viewOnly) {
      this.activeModal.close('reloadMainGrid');
    } else {
      this.openDialog('Warning', this.comFunc.getMsgByID('MSG1212'), false);

      this.dialogBox.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {

          this.activeModal.close();

        }
      });
    }

  }

  removePayments(index: any) {
    this.openDialog('Warning', 'Are you sure want to remove this record?', false, true);
    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data != 'No') {
        const removedRecord = this.receiptDetailsList[index];
        const arecVocNo = removedRecord.ARECVOCNO;

        const vocNoIndex = this.advanceRecieptVoucherNumberList.indexOf(arecVocNo);
        if (vocNoIndex > -1) {
          this.advanceRecieptVoucherNumberList.splice(vocNoIndex, 1);
        }

        this.receiptDetailsList.splice(index, 1);
        this.receiptDetailsList?.forEach((e: any, i: any) => {
          e.SRNO = i + 1;
        });

        const schemeIdToRemove = removedRecord.SCHEME_ID;
        const schemeIdIndex = this.selectedSchemeIdCollection.indexOf(schemeIdToRemove);
        if (schemeIdIndex > -1) {
          this.selectedSchemeIdCollection.splice(schemeIdIndex, 1);
        }

        this.sumTotalValues();
      }
    });
  }
  // removePayments(index: any) {
  //   this.openDialog('Warning', 'Are you sure want to remove this record?', false, true);
  //   this.dialogBox.afterClosed().subscribe((data: any) => {
  //     if (data != 'No') {
  //       this.advanceRecieptVoucherNumber = this.receiptDetailsList?.find((e: any) => e.RECEIPT_TYPE == "ADVANCE") ? 0 : this.advanceRecieptVoucherNumber;

  //       this.receiptDetailsList.splice(index, 1);
  //       this.receiptDetailsList?.forEach((e: any, i: any) => {
  //         e.SRNO = i + 1;
  //       });
  //       this.sumTotalValues();
  //     }
  //   });

  // }

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
  closeAddCustomerModal() {
    // this.resetCustomerData()
    this.customerDetailForm.patchValue(this.existingCustomerDetails);
    // this.modal.dismiss('Cross click')
    this.modalReference.dismiss();
    this.isNewCustomer = false;
  }

  closeExchange() {

    if(this.viewOnly){
      this.modalReference.dismiss();
    }

    else {
      this.openDialog('Warning', this.comFunc.getMsgByID('MSG1212'), false);

      this.dialogBox.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {

          this.modalReference.dismiss();

        }
      });
    }

    
  }

  closeItemModal() {

    if(this.viewOnly){
      this.modalReference.dismiss();
      this.isNetAmountChange = false;
      this.editLineItem = false;
    }

    else {
      this.openDialog('Warning', this.comFunc.getMsgByID('MSG1212'), false);

      this.dialogBox.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {
          this.editLineItem=false;
          this.modalReference.dismiss();

        }
      });
    }

    
  }
  open(content: any, salesReturnEdit = false, receiptItemData = null, custForm = false, receiptDetailView = false, isNewCustomer = false, isNewItem = false) {
    this.lineItemModalForSalesReturn = false;
    this.isNewCustomer = isNewCustomer;
    this.updateBtn = false;
    if ((!this.viewOnly && !this.editOnly || isNewItem) && !this.editLineItem) {
      this.salesReturnsItems_forVoc = [];
      this.salesReturnForm.reset();
      this.lineItemForm.reset();
      this.exchangeForm.reset();
      this.divisionMS = '';
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
    // this.salesReturnForm.reset();
    // this.lineItemForm.reset();
    // this.exchangeForm.reset();
    // this.divisionMS = '';
    this.sales_returns_total_amt = 0;

    if (!this.viewOnly) {
      this.salesReturnForm.controls.fcn_returns_branch.setValue(this.strBranchcode);
      this.salesReturnForm.controls.fcn_returns_fin_year.setValue(this.baseYear);
      this.salesReturnForm.controls.fcn_returns_voc_type.setValue(this.vocType);
    }

    if (content._declarationTContainer.localNames[0] !==
      'adjust_sale_return_modal')
      this.modalReference = this.modalService.open(content, {
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false,
      });
    else {
      this.adjustSaleReturnModalRef = this.modalService.open(this.adjust_sale_return_modal, {
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false,
      });
    }


    if (this.modalService.hasOpenModals()) {
      if (
        content._declarationTContainer.localNames[0] ==
        'more_customer_detail_modal'
      ) {
        this.customerDetailForm.patchValue(this.existingCustomerDetails);
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
          this.dummyDateCheck(this.customerDataForm.value.fcn_customer_exp_date)
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
          if ((this.editOnly || this.viewOnly || this.editLineItem) && this.lineItemForm.value.fcn_li_item_code) {
            this.enableFormControls(true);
          }
          else
            this.enableFormControls(false)
          this.renderer.selectRootElement('#fcn_li_item_code')?.focus();
        }, 100);
      if (
        content._declarationTContainer.localNames[0] ==
        'adjust_sale_return_modal'
      )
        setTimeout(() => {
          this.renderer.selectRootElement('#fcn_returns_voc_no')?.focus();
        }, 100);
      if (
        content._declarationTContainer.localNames[0] ==
        'sales_payment_modal'
      ) {

        // this.setReceiptVal();
        this.receiptDetailView = receiptDetailView;
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
        this.imageURL = []
        this.closeResult = `Closed with: ${result}`;
        this.salesReturnEditId = '';
        this.orderedItemEditId = '';
        this.exchangeItemEditId = '';
        this.receiptDetailView = false;
      },
      (reason: any) => {
        this.imageURL = []
        this.salesReturnEditId = '';
        this.orderedItemEditId = '';
        this.exchangeItemEditId = '';
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.receiptDetailView = false;

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



  deletedItemBackup: any = null;

  removeLineItemsGrid(event: any) {
    this.deletedItemBackup = {
      item: event.data,
      index: this.ordered_items.findIndex(item => item.ID === event.data.ID)
    };




    this.ordered_items = this.ordered_items.filter(item => item.sn_no !== event.data.sn_no);
    this.currentLineItems = this.currentLineItems.filter((item: any) => item.SRNO !== event.data.sn_no);

    this.ordered_items.forEach((item, index) => {
      item.sn_no = index + 1;
      item.ID = index + 1;
    });

    this.currentLineItems.forEach((item: any, index: any) => {
      item.SRNO = index + 1;
      item.ID = index + 1;
    });

    if (this.comFunc.posKARATRATECHANGE.toString() == '0') {
      this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
    } else {
      if (this.ordered_items.length == 0)
        this.comFunc.formControlSetReadOnlyByClass('karat_code', false);
    }


    this.sumTotalValues();

    this.setRetailSalesDataPost();
    console.log(this.currentLineItems)

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
      (preVal: any, curVal: any) => parseFloat(preVal) + parseFloat(curVal.net_amount),
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

  editTable = async (event: any, isSalesReturn: boolean = false) => {
    // this.newLineItem.ALLOWEDITDESCRIPTION=false;
    this.editLineItem = true;
    this.allowDescription = false;
    console.log(event);
    this.enableFormControls(true);
    // console.log(event.component);
    // console.log(event.component.state());
    console.log(event.data);
    console.log(event.settings);
    this.orderedItemEditId = event.data.sn_no;
    event.cancel = true;
    this.isRevCalculationBlock = false;

    //   event.settings.CommandButtonInitialize = (sender, e) =>
    //  {
    //      if ((e.ButtonType == event.settings.ColumnCommandButtonType.Update) || (e.ButtonType == event.settings.ColumnCommandButtonType.Cancel))
    //      {
    //          e.Visible = false;
    //      }
    //  };
    let value: any;
    if (!isSalesReturn) {
      value = this.currentLineItems.filter(
        (data: any) => data.SRNO === event.data.sn_no
      )[0];
    } else {
      value = this.sales_returns_items.filter(
        (data: any) => data.slsReturn.SRNO === event.data.sn_no
      )[0]?.slsReturn;

    }

    console.log(
      '===============editTable==currentLineItems==================='
    );
    console.log(value);
    console.log('====================================');
    event.component.refresh();
    this.isAllowWithoutRate = value.ALLOW_WITHOUT_RATE;
    this.isPromotionalItem = value.TPROMOTIONALITEM;

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
    // this.open(this.mymodal);

    this.updateBtn = true;

    this.newLineItem = value;


    // if (this.editOnly == true || this.viewOnly == true) {
    this.snackBar.open('Loading...');

    this.disableSaveBtn = true;

    let API = `RetailSalesStockValidation/${value.STOCK_CODE}/${this.strBranchcode}/${this.vocType}/${this.strUser}/%27%27/%27%27/${this.convertDateToYMD(this.vocDataForm.value.vocdate)}`;

    try {
      const resp = await this.suntechApi.getDynamicAPI(API).toPromise();
      this.snackBar.dismiss();
      console.log('===========edit====getPOSStockCodeValidation=====================');
      console.log(resp);
      console.log('====================================');
      if (resp != null) {
        if (resp.resultStatus.RESULT_TYPE == 'Success') {
          let stockInfos = resp.stockInfo;
          console.log(stockInfos);

          this.newLineItem.IS_BARCODED_ITEM = stockInfos.IS_BARCODED_ITEM;
          this.newLineItem.DONT_SHOW_STOCKBAL = stockInfos.DONT_SHOW_STOCKBAL;
          this.newLineItem.PCS_TO_GMS = stockInfos.PCS_TO_GMS;
          this.newLineItem.GSTVATONMAKING = stockInfos.GSTVATONMAKING;
          this.newLineItem.TPROMOTIONALITEM = stockInfos.TPROMOTIONALITEM;
          this.isStoneIncluded = stockInfos.STONE;
          this.newLineItem.STONE = stockInfos.STONE;
          this.allowDescription = stockInfos.ALLOWEDITDESCRIPTION;
          this.disableSaveBtn = false;
          this.validatePCS = stockInfos.VALIDATE_PCS;
          this.enablePieces = stockInfos.ENABLE_PCS;
          this.lineItemPcs = stockInfos.BALANCE_PCS;
          this.blockNegativeStock = stockInfos.BLOCK_NEGATIVESTOCK;
          const stoneCondition = this.comFunc.stringToBoolean(this.newLineItem.STONE?.toString());
          this.toggleStoneAndNetWtFields(stoneCondition);

          this.blockMinimumPrice = stockInfos.BLOCK_MINIMUMPRICE;
          this.blockMinimumPriceValue = this.comFunc.emptyToZero(resp.priceInfo.MIN_SAL_PRICE) != 0 ? this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            resp.priceInfo.MIN_SAL_PRICE
          ) : this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            resp.priceInfo.STOCK_COST
          );


          if (stockInfos.DIVISIONMS == 'M') this.setMetalRate(stockInfos.KARAT_CODE,'sales');
          this.newLineItem.BLOCK_GRWT = this.comFunc.stringToBoolean(stockInfos.BLOCK_GRWT?.toString());
          this.newLineItem.DIVISION = stockInfos.DIVISION;
          this.divisionCode = stockInfos.DIVISION;
          this.newLineItem.MAKING_ON = stockInfos.MAKING_ON;
          this.newLineItem.LESSTHANCOST = stockInfos.LESSTHANCOST;
          this.newLineItem.TPROMOTIONALITEM = stockInfos.TPROMOTIONALITEM;
          this.managePcsGrossWt();

          this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);


          // if (this.newLineItem.IS_BARCODED_ITEM != undefined && this.newLineItem.TPROMOTIONALITEM != undefined) {


          //   if (!this.newLineItem?.IS_BARCODED_ITEM || this.comFunc.stringToBoolean(this.newLineItem?.TPROMOTIONALITEM.toString())) {
          //     this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);
          //   } else {
          //     this.setMakingValidation();
          //   }
          // }

          this.focusAndSetReadOnly(stockInfos);
        }
      }
    } catch (error) {
      console.error('Error during API call:', error);
      this.snackBar.dismiss();
    }
    // }


    this.newLineItem.STOCK_CODE = value.STOCK_CODE;
    this.newLineItem.DIVISION = value.DIVISION_CODE;
    this.newLineItem.HSN_CODE = value.HSNCODE ?? value.HSN_CODE ?? "";
    this.newLineItem.GST_CODE = value.VATCODE ?? value.GST_CODE ?? "";
    this.newLineItem.MAIN_STOCK_CODE = value.MAINSTOCKCODE;// changed at 16/3/2024
    // this.newLineItem.MAIN_STOCK_CODE = value.MainStockCode;
    console.log('edit af data', value)
    this.newLineItem.STOCK_COST = value.STKTRANMKGCOST; // changed at 16/3/2024
    // this.newLineItem.STOCK_COST = value.StkTranMkgCost;
    // this.divisionMS = value.divisionMS;
    this.itemDivision = value.DIVISION_CODE;
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
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.MKGVALUEFC));
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
        this.comFunc.allbranchMaster?.BAMTDECIMALS, (value.GROSS_AMT?? (this.comFunc.emptyToZero(value.MKGVALUEFC) - this.comFunc.emptyToZero(value.DISCOUNTVALUECC))))
    );

    // this.lineItemForm.controls.fcn_li_gross_amount.setValue(
    //   this.comFunc.transformDecimalVB(
    //     this.comFunc.allbranchMaster?.BAMTDECIMALS, (value.TOTAL_AMOUNTFC - value.DISCOUNTVALUECC))
    // );
    //  this.lineItemForm.controls.fcn_li_gross_amount.setValue(value.GROSS_AMT);
    this.lineItemForm.controls.fcn_li_tax_percentage.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.IGST_PER
      )
    );
    this.lineItemForm.controls.fcn_li_tax_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.VAT_AMOUNTFC));
    // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.NETVALUEFC);
    this.lineItemForm.controls.fcn_li_net_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.TOTALWITHVATFC));

    this.lineItemForm.controls.fcn_li_purity.setValue(
      this.comFunc.decimalQuantityFormat(value.PURITY, 'PURITY')

    );

    this.lineItemForm.controls.fcn_li_pure_wt.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BMQTYDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) *
        this.lineItemForm.value.fcn_li_purity
      )
    );

    // this.lineItemForm.controls.fcn_li_pure_wt.setValue(value.PUREWT);
    // this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);

    this.lineItemForm.controls.fcn_ad_amount.setValue(
      // value.TOTALWITHVATFC

      value.MKGMTLNETRATE // changed at 18/3/2024
    );
    this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
    this.lineItemForm.controls.fcn_ad_rate.setValue(value.MKGMTLNETRATE); // changed at 18/3/2024
    this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TAGLINES);
    // this.lineItemForm.controls.fcn_ad_making_rate.setValue(value.PUREWT);
    // this.lineItemForm.controls.fcn_ad_making_amount.setValue(value.PUREWT);
    this.lineItemForm.controls.fcn_ad_stone_rate.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.STONE_RATEFC));
    this.lineItemForm.controls.fcn_ad_stone_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.STONEVALUEFC));

    // this.lineItemForm.controls.fcn_ad_metal_rate.setValue(

    //   this.comFunc.decimalQuantityFormat(value.METAL_RATE, 'METAL_RATE')

    // );
    this.lineItemForm.controls.fcn_ad_metal_amount.setValue(
      this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, value.METALVALUEFC));

    if (this.editOnly || this.viewOnly) {
      const divisionMS = this.comFunc.getDivisionMS(value.DIVISION_CODE);
      // this.currentLineItems.divisionMS = divisionMS;
      this.divisionMS = divisionMS;
    } else {
      this.divisionMS = value.DIVISIONMS;
    }
    if (!this.viewOnly) {
      // this.currentLineItems.splice((value.SRNO - 1), 1);
      // this.ordered_items.splice((value.SRNO - 1), 1);
    }

    localStorage.setItem('fcn_li_rate', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate).toString());
    localStorage.setItem('fcn_li_total_amount', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount).toString());
    localStorage.setItem('fcn_li_net_amount', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount).toString());
    this.imageURL = [];
    this.getStockImage();
    this.setGiftType();
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

    this.lineItemCommaSeparation();
    this.open(this.mymodal);
  }
  metalRateChange() {
    let form = this.exchangeForm.value
    let amount = (this.comFunc.emptyToZero(form.fcn_exchange_metal_rate) *
      this.comFunc.emptyToZero(form.fcn_exchange_chargeable_wt))
    this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
      this.comFunc.setCommaSerperatedNumber(amount, 'AMOUNT')
    )
  }

  public openAdjustSaleReturnModal() {
    this.adjustSaleReturnModalRef = this.modalService.open(this.adjust_sale_return_modal, { size: 'lg' });
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
    // this.open(this.adjust_sale_return_modal, true);

    const data = this.retailSReturnDataPost.SALESREFERENCE.split('-');
    this.salesReturnForm.controls.fcn_returns_fin_year.setValue(
      data[3]
      // value.DT_YEARMONTH
    );
    this.salesReturnForm.controls.fcn_returns_branch.setValue(
      // value.DT_BRANCH_CODE
      data[0].replace('$', '')
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
    this.getStockforExchange();
    // this.updateBtn = true;

    // alert(value.DT_VOCNO);
    this.exchangeForm.controls.fcn_exchange_pcs.setValue(value.PCS);
    this.exchangeForm.controls.fcn_exchange_gross_wt.setValue(
      this.comFunc.decimalQuantityFormat(value.GROSSWT, 'METAL')
    );
    this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(
      this.comFunc.decimalQuantityFormat(value.STONEWT, 'STONE')
    );
    this.exchangeForm.controls.fcn_exchange_net_wt.setValue(
      // value.NETWT
      this.comFunc.decimalQuantityFormat(value.NETWT, 'METAL')

    );
    this.exchangeForm.controls.fcn_exchange_purity.setValue(
      this.comFunc.decimalQuantityFormat(value.PURITY, 'PURITY')
    );
    this.exchangeForm.controls.fcn_exchange_purity_diff.setValue(
      this.comFunc.decimalQuantityFormat(value.PUDIFF, 'AMOUNT')
      // value.PUDIFF
    );
    this.exchangeForm.controls.fcn_exchange_metal_rate.setValue(
      // value.METAL_RATE
      this.editOnly || this.viewOnly ?
        this.comFunc.decimalQuantityFormat(value.METAL_RATE, 'METAL_RATE') :
        this.comFunc.decimalQuantityFormat(this.exchange_items[this.exchangeItemEditId - 1].metalRate, 'METAL_RATE')

    );
    this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
      this.comFunc.decimalQuantityFormat(value.METALVALUEFC, 'AMOUNT')
      // value.METALVALUEFC
    );
    this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(
      this.comFunc.decimalQuantityFormat(value.PUREWT, 'METAL')
      // value.PUREWT
    );
    this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(
      this.comFunc.decimalQuantityFormat(value.STONE_RATEFC, 'AMOUNT')
      // value.STONE_RATEFC
    );
    this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(
      // value.STONEVALUEFC
      this.comFunc.decimalQuantityFormat(value.STONEVALUEFC, 'AMOUNT')

    );
    this.exchangeForm.controls.fcn_exchange_making_rate.setValue(
      // value.MKG_RATEFC
      this.comFunc.decimalQuantityFormat(value.MKG_RATEFC, 'AMOUNT')

    );
    this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
      // value.MKGVALUEFC
      this.comFunc.decimalQuantityFormat(value.MKGVALUEFC, 'AMOUNT')

    );
    this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
      // value.NETVALUEFC
      this.comFunc.decimalQuantityFormat(value.NETVALUEFC, 'AMOUNT')

    );
    this.exchangeForm.controls.fcn_exchange_division.setValue(
      value.DIVISION_CODE
    );
    this.exchangeForm.controls.fcn_exchange_item_desc.setValue(
      value.STOCK_DOCDESC
    );
    this.exchangeForm.controls.fcn_exchange_chargeable_wt.setValue(
      // value.CHARGABLEWT
      this.comFunc.decimalQuantityFormat(value.CHARGABLEWT, 'METAL')

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

    this.setExchangeCommaSep();

  }

  private _filterMobCodes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.sortedCountryList.filter((option: any) =>
      option.MOBILECOUNTRYCODE.toLowerCase().includes(filterValue)
    );
  }

  private _filterCountry(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.sortedCountryList.filter((option: any) =>
      option.CODE_DESC.toLowerCase().includes(filterValue)
    );
  }

  getCountryMaster() {

    this.filteredOptionsCountry = this.customerDetailForm.controls.fcn_cust_detail_country.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || ''))
    );
  }

  getMobCodeMaster() {

    this.filteredOptionsMobCode = this.customerDetailForm.controls.fcn_mob_code.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMobCodes(value || ''))
    );
  }

  getSalesPersonMaster() {



    let sub: Subscription = this.suntechApi.getDynamicAPI('SalesPersonMaster/GetSalespersonMasterList')

      // this.suntechApi.getDynamicAPI('SalesPersonMaster/GetSalespersonMasterList')
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
          COUNTRY_CODE: (this.customerDetails.COUNTRY_CODE || '').split('-')[0],

          // COUNTRY_CODE:
          //   this.customerDetails.COUNTRY_CODE ||
          //   // this.customerDetails?.COUNTRY_CODE ||
          //   '',
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
          YEARMONTH: this.baseYear,
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
          "ATTACHMENT_FROM_SCANNER": true, // need to discuss
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

          // this.suntechApi.getDynamicAPICustom('AccountLookup/GetAccountLookupWithAccMode/R').subscribe
          custResponse = this.suntechApi.putDynamicAPI(`PosCustomerMaster/UpdateCustomerMaster/${posCustomer.CODE}`, posCustomer)
        } else {
          apiCtrl = 'PosCustomerMaster/InsertCustomerMaster';
          custResponse = this.suntechApi.postDynamicAPI(`PosCustomerMaster/InsertCustomerMaster`, posCustomer)

          // custResponse = this.suntechApi.postDynamicAPICustom(apiCtrl, posCustomer)
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
              this.customerDetails.MOBILE1
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

            this.customerDetailForm.controls.fcn_customer_exp_date.setValue(
              this.dummyDateCheck(this.customerDetails.POSCUSTIDEXP_DATE)
            );
            this.customerDataForm.controls.fcn_customer_exp_date.setValue(
              this.dummyDateCheck(this.customerDetails.POSCUSTIDEXP_DATE)
            );
            this.existingCustomerDetails = this.setCustomerDPatchValues(this.customerDetails);

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
              this.isCustProcessing = false;
              this.modalReference.close();
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

        this.snackBar.open('Please Fill Required Fields', '', {
          duration: 2000 // time in milliseconds
        });
      }
    }
  }
  resetCustomerData() {
    this.customerDetailForm.reset();
    this.customerDataForm.reset();
    this.customerDetails = {};
    this.inv_customer_name = '';
    this.customerDataForm.controls['fcn_customer_name'].setValue('');
  }
  onCustomerNameFocus(value: any = null, advanceCustomerCode: boolean = false) {
    console.log(value);
    let _cust_mobile_no = value == null ? this.customerDataForm.value.fcn_customer_mobile : value;
    if (value != null && !this.isCustomerFindsOnCode) {
      this.customerDataForm.controls['fcn_customer_mobile'].setValue(
        value
      );
    }

    if (value != null && this.isCustomerFindsOnCode) {
      this.customerDataForm.controls.fcn_customer_code.setValue(
        value
      );

    }


    console.log('_cust_mobile_no ', _cust_mobile_no);
    if (_cust_mobile_no != '' && _cust_mobile_no != null || advanceCustomerCode || this.isCustomerFindsOnCode) {

      let custMobile = this.customerDataForm.value.fcn_customer_mobile ? `${this.customerDataForm.value.fcn_customer_mobile}` : "";

      // if (value == null) {
      this.customerDetails = {};
      this.customerDetailForm.reset();
      this.customerDataForm.reset({
        fcn_customer_mobile: custMobile,
        fcn_customer_code: this.isCustomerFindsOnCode ? value : "",
      });
      this.customerDetailForm.reset({
        fcn_cust_detail_phone: custMobile,
      });
      // }
      let API = this.isCustomerFindsOnCode
        ? `PosCustomerMaster/GetCustomerByCode/${this.customerDataForm.value.fcn_customer_code}`
        : (!advanceCustomerCode
          ? `PosCustomerMaster/GetCustomerMaster/${_cust_mobile_no}`
          : `PosCustomerMaster/GetCustomerByCode/${this.advanceReceiptForm.value.advanceCustCode}`);


      // let API = !advanceCustomerCode ? `PosCustomerMaster/GetCustomerMaster/${_cust_mobile_no}` : `PosCustomerMaster/GetCustomerByCode/${this.advanceReceiptForm.value.advanceCustCode}`;
      this.suntechApi.getDynamicAPI(API)
        .subscribe((resp) => {
          if (resp.status == 'Success') {
            // const result = resp[0];

            const result = resp.response;
            if (advanceCustomerCode) {
              this.customerDataForm.controls['fcn_customer_mobile'].setValue(
                result.MOBILE
              );
            }
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
              `${result.COUNTRY_CODE}-${result.COUNTRY_DESC}`
              // result.COUNTRY_CODE
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
              result.MOBILE1
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
              this.dummyDateCheck(result.POSCUSTIDEXP_DATE)
            );
            this.customerDataForm.controls.fcn_customer_exp_date.setValue(
              this.dummyDateCheck(result.POSCUSTIDEXP_DATE)
            );
            this.existingCustomerDetails = this.setCustomerDPatchValues(result);

            this.customerDetails = result;
            this.isCustomerDetailsAdd=true;
            this.isCustomerDetailsEmpty();

            this.getUserAttachments();

            if (this.amlNameValidation)
              if (!result.AMLNAMEVALIDATION && result.DIGISCREENED) {
                this.amlNameValidationData = false;
              } else {
                this.amlNameValidationData = true;
                // if(!this.viewOnly)
                // this.openDialog('Warning', 'Customer already existing, Do you want to continue?', true);
              }
            this.isCustomerFindsOnCode = false;
          } else {
            if ((value == null && !this.isNewCustomer) || this.isCustomerFindsOnCode) {
              this.openDialog('Warning', 'Need To Create Customer', true);
              this.dialogBox.afterClosed().subscribe((data: any) => {
                if (data == 'OK') {
                  this.open(this.more_customer_detail_modal, false, null, true, true);
                  this.isNewCustomer = false;
                  if (advanceCustomerCode)
                    this.advanceReceiptForm.controls.advanceCustCode.setValue('');
                  if (this.isCustomerFindsOnCode)
                    this.customerDataForm.controls.fcn_customer_code.setValue(value);
                }
              });
              this.isCustomerFindsOnCode = false;
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
      this.resetCustomerData()
      //alert('Enter valid mobile number');
    }

    this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;
    this.inv_cust_mobile_no = this.customerDataForm.value.fcn_customer_mobile;
    this.inv_sales_man = this.vocDataForm.value.sales_person;
    this.inv_bill_date = this.convertDate(this.vocDataForm.value.vocdate);
    this.inv_number = this.vocDataForm.value.fcn_voc_no;
  }

  setCustomerDPatchValues(customerData: any): any {
    return {
      fcn_customer_mobile: customerData.MOBILE,
      fcn_customer_name: customerData.NAME,
      fcn_customer_id_type: customerData.IDCATEGORY,
      fcn_customer_id_number: customerData.POSCUSTIDNO,
      fcn_mob_code: customerData.MOBILECODE1,
      fcn_customer_code: customerData.CODE,
      fcn_cust_detail_phone: customerData.MOBILE,
      fcn_cust_detail_idType: customerData.IDCATEGORY,
      fcn_cust_detail_email: customerData.EMAIL,
      fcn_cust_detail_address: customerData.ADDRESS,
      fcn_cust_detail_country: `${customerData.COUNTRY_CODE}` || "",
      fcn_cust_detail_city: customerData.CITY,
      fcn_cust_detail_idcard: customerData.NATIONAL_IDENTIFICATION_NO,
      fcn_customer_detail_name: customerData.NAME,
      fcn_customer_detail_fname: customerData.FIRSTNAME,
      fcn_customer_detail_mname: customerData.MIDDLENAME,
      fcn_customer_detail_lname: customerData.LASTNAME,
      fcn_cust_detail_phone2: customerData.MOBILE1,
      fcn_cust_detail_gender: customerData.GENDER,
      fcn_cust_detail_marital_status: customerData.MARITAL_ST,
      fcn_cust_detail_dob: this.dummyDateCheck(customerData.DATE_OF_BIRTH),
      fcn_cust_detail_designation: customerData.DESIGNATION,
      fcn_cust_detail_company: customerData.COMPANY,
      fcn_cust_detail_nationality: customerData.NATIONALITY,
      fcn_customer_exp_date: this.dummyDateCheck(customerData.POSCUSTIDEXP_DATE)
    };
  }


  getUserAttachments() {
    const custCode = this.customerDataForm.value.fcn_customer_code;

    this.snackBar.open('Loading...');
    // TransAttachments/GetTransAttachments
    let API = `TransAttachments/GetTransAttachments/${this.vocType}/${this.comFunc.nullToString(custCode)}`
    // let API = `TransAttachments/GetTransAttachments?VOCTYPE=${this.vocType}&MID=${this.customerDetails?.MID}`
    // let API = `RetailSalesDataInDotnet/GetTransAttachmentMulti/${custCode}/${this.vocType}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        this.snackBar.dismiss();

        if (resp?.status.toString().trim() == 'Success') {
          this.transAttachmentList = resp.response || [];

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
    arrName: any[],
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || '').toLowerCase();
    const uniqueCodes = new Set();

    return arrName.filter((option: any) => {
      const matches =
        option[optVal1].toLowerCase().includes(filterValue) ||
        (optVal2 && option[optVal2].toLowerCase().includes(filterValue));

      if (matches && !uniqueCodes.has(option[optVal1])) {
        uniqueCodes.add(option[optVal1]);
        return true;
      }
      return false;
    });
  }

  // private _filterMasters(
  //   arrName: any,
  //   value: string,
  //   optVal1: any,
  //   optVal2: any = null
  // ): any[] {
  //   const filterValue = (value || '').toLowerCase();
  //   return arrName.filter(
  //     (option: any) =>
  //       option[optVal1].toLowerCase().includes(filterValue) ||
  //       option[optVal2].toLowerCase().includes(filterValue)
  //   );
  // }

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
    this.countryMaster = this.comFunc.countryMaster;
    console.log(JSON.stringify(this.countryMaster))
    this.sortedCountryList = Array.from(
      new Map(
        this.countryMaster.map((item: any) => [
          item.MOBILECOUNTRYCODE,
          {
            CODE: item.CODE,
            DESCRIPTION: item.DESCRIPTION,
            MOBILECOUNTRYCODE: item.MOBILECOUNTRYCODE,
            CODE_DESC: `${item.CODE}-${item.DESCRIPTION}`
          }
        ])
      ).values()
    );



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

    this.nationalityMasterOptions =
      this.customerDetailForm.controls.fcn_cust_detail_nationality.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.nationalityMaster, value, 'CODE', 'DESCRIPTION')
        )
      );

    this.customerDetailForm.controls.fcn_cust_detail_country.valueChanges.subscribe(
      (selectedCountryCode) => {
        this.updateMobileCountryCode(selectedCountryCode);
      }
    );

    this.customerDetailForm.controls.fcn_mob_code.valueChanges.subscribe(
      (selectedMobileCountryCode) => {
        this.updateCountryCode(selectedMobileCountryCode);
      }
    );
  }

  updateMobileCountryCode(selectedCountryCode: string): void {
    const selectedCountry = this.countryMaster.find(
      (option: any) => option.CODE === selectedCountryCode
    );

    if (selectedCountry) {
      this.customerDetailForm.controls.fcn_mob_code.setValue(selectedCountry.MOBILECOUNTRYCODE);
    } else {
      this.customerDetailForm.controls.fcn_mob_code.setValue(''); // Clear the code if no country is selected
    }
  }

  updateCountryCode(selectedMobileCountryCode: string): void {
    const selectedMobileCountry = this.mobileCountryMaster.find(
      (option: any) => option.MOBILECOUNTRYCODE === selectedMobileCountryCode
    );

    if (selectedMobileCountry) {
      this.customerDetailForm.controls.fcn_cust_detail_country.setValue(selectedMobileCountry.CODE);
    } else {
      this.customerDetailForm.controls.fcn_cust_detail_country.setValue('');
    }
  }


  async getIdMaster() {
    // const resp = this.comFunc.getMasterByID('ID MASTER');
    const resp = await this.comFunc.idMaster;
    console.log('idMaster', this.comFunc.idMaster);
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
    const filterValue = value != null ? value.toString().toLowerCase() : '';
    const uniqueOptions = new Set<string>();

    return this.idTypeOptions.filter((option) => {
      const lowerCaseOption = option.toLowerCase();
      const matches = lowerCaseOption.includes(filterValue);

      if (matches && !uniqueOptions.has(lowerCaseOption)) {
        uniqueOptions.add(lowerCaseOption);
        return true;
      }
      return false;
    });
  }


  // private _filterIdType(value: string): string[] {
  //   value = value != null ? value.toString().toLowerCase() : '';
  //   const filterValue = value;
  //   // const filterValue = value.toString().toLowerCase() || '';

  //   return this.idTypeOptions.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }

  getExchangeStockCodes() {

    let API = `RetailsalesExchangeLookup/${this.strBranchcode}`
    this.suntechApi
      .getDynamicAPI(API)
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
    this.suntechApi.getDynamicAPI(`CreditCardMaster/getPaymentButtons`).subscribe((resp) => {
      // let _resp = resp.Result;
      this.receiptModesList = resp.paymentButtons;
      this.receiptModesTypes = resp.creditCardMaster;
      let _resp = resp.creditCardMaster;
      let recModeCash;
      let recModeCC;
      let recModeOthers;
      let recModeAdvance;
      let recModeSchemeAdvance;
      let recModeGift;
      console.log(_resp);

      this.commisionDetailsWithPayments = _resp.map((item: any) => ({
        CREDIT_CODE: item.CREDIT_CODE,
        COMMISION: item.COMMISION
      }));

      console.log(this.commisionDetailsWithPayments)
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
          value.MODE == 2 &&
          (value.CC_BRANCHCODE == '' || value.CC_BRANCHCODE == userBranch)
        );
      });

      //SCHEME_UPDATE
      recModeSchemeAdvance = _resp.filter(function (value: any) {
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
      this.commisionForCreditCardPayments = (this.commisionDetailsWithPayments.find(item => item.CREDIT_CODE === this.recMode_CC_Data[0]) || { COMMISION: 0 }).COMMISION;


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
      //SCHME_UPDATED
      this.schemeReceiptForm.controls.scheme_rec_mode.setValue(
        recModeSchemeAdvance.map((t: any) => t.CREDIT_CODE)[0]
      );


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
    if (value != '')
      this.commisionForCreditCardPayments = (this.commisionDetailsWithPayments.find(item => item.CREDIT_CODE.toLowerCase() === filterValue) || { COMMISION: 0 }).COMMISION;

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
    this.salespersonDescName = this.salesPersonOptions.filter(
      (data) => data.SALESPERSON_CODE == value
    )[0]?.DESCRIPTION;
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

      NETWT: this.divisionMS == "S" ? 0 : items.NETWT,
      PURITY: items.PURITY,
      PUREWT: items.PUREWT,
      CHARGABLEWT: this.divisionMS == "M"||this.newLineItem.DIVISION == 'D' ? 0 : items.CHARGABLEWT,
      MKG_RATEFC: items.MKG_RATEFC,
      MKG_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.MKG_RATECC), this.vocDataForm.value.txtCurRate
      ),
      MKGVALUEFC: items.MKGVALUEFC,
      MKGVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.MKGVALUECC), this.vocDataForm.value.txtCurRate
      ),
      RATE_TYPE: this.newLineItem.RATE_TYPE,
      METAL_RATE: this.newLineItem.METAL_RATE,

      METAL_RATE_GMSFC: items.METAL_RATE_GMSFC,
      METAL_RATE_GMSCC: items.METAL_RATE_GMSCC,
      METALVALUEFC: items.METALVALUEFC,
      METALVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.METALVALUECC), this.vocDataForm.value.txtCurRate
      ),
      STONE_RATEFC: items.STONE_RATEFC,
      STONE_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.STONE_RATECC), this.vocDataForm.value.txtCurRate
      ),
      STONEVALUEFC: items.STONEVALUEFC,
      STONEVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.STONEVALUECC), this.vocDataForm.value.txtCurRate
      ),
      DISCOUNT: items.DISCOUNT, //need_field
      DISCOUNTVALUEFC: items.DISCOUNTVALUEFC,
      DISCOUNTVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(items.DISCOUNTVALUECC), this.vocDataForm.value.txtCurRate
      ),
      NETVALUEFC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.sales_returns_total_amt
      ),
      NETVALUECC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.sales_returns_total_amt
      ),
      PUDIFF: this.comFunc.emptyToZero(items.PUDIFF), //need_input
      STONEDIFF: this.comFunc.emptyToZero(items.STONEDIFF),
      PONO: items?.PONO || 0,
      LOCTYPE_CODE: items.LOCTYPE_CODE || '',
      SUPPLIER: '',
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
      STKTRANMKGCOST: 0,
      //  items?.STKTRANMKGCOST || 0,
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
      TOTALWITHVATFC: 0,
      //  items?.TOTAL_AMOUNTFC || 0,
      TOTALWITHVATLC: items?.TOTAL_AMOUNTLC || 0,
      VAT_AMOUNTLC: 0,
      // items?.VAT_AMOUNTLC || 0,
      VAT_AMOUNTFC: 0,
      //  items?.VAT_AMOUNTFC || 0,
      LOYALTY_ITEM: false,
      // LOYALTY_ITEM: this.comFunc.stringToBoolean(items?.LOYALTY_ITEM) || false,
      WASTE_PER: items?.WASTE_PER || 0,
      STKTRN_LANDINGCOST: 0,
      //  items?.STKTRN_LANDINGCOST || 0,
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
      // GSTMETALAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, items?.GSTMETALAMT_FC) || 0,
      // GSTMAKINGAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, items?.GSTMAKINGAMT_FC) || 0,
      // GSTOTHERAMT_FC: this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, items?.GSTOTHERAMT_FC) || 0,
      // TOTALWITHGST_CC: this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, items?.TOTALWITHGST_CC) || 0,
      // TOTALWITHGST_FC: this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, items?.TOTALWITHGST_FC) || 0,
      GSTMAKINGAMT_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          items?.GSTMAKINGAMT_FC
        ) || 0,
      GSTOTHERAMT_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          items?.GSTOTHERAMT_FC
        ) || 0,
      TOTALWITHGST_CC:
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          items?.TOTALWITHGST_CC
        ) || 0,
      TOTALWITHGST_FC:
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          items?.TOTALWITHGST_FC
        ) || 0,
      EXTRA_STOCK_CODE: '',
      // EXTRA_STOCK_CODE: items?.EXTRA_STOCK_CODE || '',
      FLAGESTK: items?.FLAGESTK || 0,
      OT_TRANSFER_TIME: items?.OT_TRANSFER_TIME ? this.parseDate(items.OT_TRANSFER_TIME) : '',
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
      "IGST_ACCODE": this.newLineItem.IGST_ACCODE_NON_POS?.toString() ?? '',
      // items['IGST_ACCODE'] || '',
      "TOTAL_AMOUNTFC": this.sales_returns_items.reduce((acc: any, curr: any) => acc + parseFloat(curr.mkg_amount), 0) || 0,
      //  items['TOTAL_AMOUNTFC'] || 0,
      "TOTAL_AMOUNTCC": this.sales_returns_items.reduce((acc: any, curr: any) => acc + parseFloat(curr.mkg_amount), 0) || 0,
      //  items['TOTAL_AMOUNTLC'] || 0,
      "CGST_CTRLACCODE": items['CGST_CTRLACCODE'] || '',
      "SGST_CTRLACCODE": items['SGST_CTRLACCODE'] || '',
      "IGST_CTRLACCODE": items['IGST_CTRLACCODE'] || '',
      "GST_GROUP": 'R',
      // items['GST_GROUP'] || '',
      "GST_CODE": items['GST_CODE'].toString() || '',
      "HSN_CODE": items['HSN_CODE'] || '',
      "SERVICE_ACCODE": items['SERVICE_ACCODE'] || '',
      "WASTAGEPER": this.comFunc.emptyToZero(items['WASTAGEPER']),
      "WASTAGEQTY": this.comFunc.emptyToZero(items['WASTAGEQTY']),
      "WASTAGEPUREWT": this.comFunc.emptyToZero(items['WASTAGEPUREWT']),
      "WASTAGEAMOUNTFC": this.comFunc.emptyToZero(items['WASTAGEAMOUNTFC']),
      "WASTAGEAMOUNTCC": this.comFunc.emptyToZero(items['WASTAGEAMOUNTCC']),
      "DIVISIONMS": '',
      // items['DIVISIONMS'] || ' ',
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
      "DTSALESPERSON_CODE": items['SALESPERSON_CODE'] || '',


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
      "GIFT_ITEM": false,
      //  true,
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
      "STOCKCHECKOTHERBRANCH": false,
      // true,
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

    let item = this.sales_returns_items.find(
      (data: any) => data.sn_no.toString() == srNo.toString()
      // data.stock_code == stockCode && data.total_amount == amtval
    );
    return item;

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
        // this.lineItemForm.controls.fcn_li_gross_wt.setValue(value.GROSSWT);
        // this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);
        // this.lineItemForm.controls.fcn_li_net_wt.setValue(value.NETWT);
        // this.lineItemForm.controls.fcn_li_rate.setValue(value.MKG_RATEFC);
        // this.lineItemForm.controls.fcn_li_total_amount.setValue(value.MKGVALUEFC);
        // this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
        //   value.DISCOUNT
        // );
        // this.lineItemForm.controls.fcn_li_discount_amount.setValue(
        //   value.DISCOUNTVALUEFC
        // );
        // this.lineItemForm.controls.fcn_li_gross_amount.setValue(
        //   value.NETVALUEFC
        // );

        // // this.lineItemForm.controls.fcn_li_tax_percentage.setValue(value.IGST_PER);
        // this.lineItemForm.controls.fcn_li_tax_percentage.setValue(value.VAT_PER);
        // this.lineItemForm.controls.fcn_li_tax_amount.setValue(value.VAT_AMOUNTFC);
        // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.TOTALWITHVATFC);
        // // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.NETVALUEFC);
        // this.lineItemForm.controls.fcn_li_purity.setValue(value.PURITY);
        // this.lineItemForm.controls.fcn_li_pure_wt.setValue(value.PUREWT);
        // this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);
        // this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
        // this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TagLines);
        // this.lineItemForm.controls.fcn_ad_stone_rate.setValue(value.STONE_RATEFC);
        // this.lineItemForm.controls.fcn_ad_stone_amount.setValue(value.STONEVALUEFC);
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
            this.comFunc.allbranchMaster?.BAMTDECIMALS, value.MKGVALUEFC));
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
        // this.lineItemForm.controls.fcn_li_gross_amount.setValue(value.GROSS_AMT);
        this.lineItemForm.controls.fcn_li_tax_percentage.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS, value.VAT_PER));
        this.lineItemForm.controls.fcn_li_tax_amount.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS, value.VAT_AMOUNTFC));
        // this.lineItemForm.controls.fcn_li_net_amount.setValue(value.NETVALUEFC);
        this.lineItemForm.controls.fcn_li_net_amount.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS, value.TOTALWITHVATFC));

        this.lineItemForm.controls.fcn_li_purity.setValue(
          // value.PURITY
          this.comFunc.decimalQuantityFormat(value.PURITY, 'PURITY')
        );
        this.lineItemForm.controls.fcn_li_pure_wt.setValue(value.PUREWT);
        // this.lineItemForm.controls.fcn_li_stone_wt.setValue(value.STONEWT);

        this.lineItemForm.controls.fcn_ad_rate_type.setValue(value.RATE_TYPE);
        this.lineItemForm.controls.fcn_tab_details.setValue(value.SJEW_TAGLINES);
        // this.lineItemForm.controls.fcn_ad_making_rate.setValue(value.PUREWT);
        // this.lineItemForm.controls.fcn_ad_making_amount.setValue(value.PUREWT);
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

        this.lineItemForm.controls.fcn_ad_rate.setValue(value.MKGMTLNETRATE); // changed at 20/3/2024
        this.lineItemForm.controls.fcn_ad_amount.setValue(
          value.MKGMTLNETRATE // changed at 20/3/2024
        );
        this.validatePCS = false;
        this.enablePieces = false;
        this.managePcsGrossWt();
        // this.manageCalculations();
      }, 100);
    }
  }

 


  addSalesReturnOnSelect(event: any, slsReturn: any, index: any) {

    if (event.target.checked) {
      this.selectedItemsCount++;
    } else {
      this.selectedItemsCount--;
    }
    console.log(this.selectedItemsCount)
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
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          parseFloat(slsReturn.TOTALWITHVATFC)
        ));
      console.log('====================================');
      // this.sales_returns_total_amt =
      //   parseFloat(this.sales_returns_total_amt) +
      //   parseFloat(
      //     this.comFunc.transformDecimalVB(
      //       this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
            parseFloat(this.sales_returns_pre_items[i].slsReturn.TOTALWITHVATFC);
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
      this.adjustSaleReturnModalRef.close();
      // this.modalReference.close();
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
      GROSSWT: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt) || 0,
      STONEWT: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt) || 0, // m
      NETWT: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt) || 0, // m
      PURITY: this.exchangeForm.value.fcn_exchange_purity || 0, // m
      // PUREWT: (this.exchangeForm.value.fcn_exchange_purity || 0), // m
      // PUDIFF: 0.0,
      PUREWT: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight) || 0,

      CHARGABLEWT: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_chargeable_wt) || 0, // net weight
      MKG_RATEFC: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_rate) || 0, //need
      MKG_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_rate), this.vocDataForm.value.txtCurRate
      ),

      // this.comFunc.CCToFC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
      // ), // cctofc rate

      MKGVALUEFC: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_amt), // metal amount
      MKGVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_amt), this.vocDataForm.value.txtCurRate
      ), // metal amount
      // MKGVALUEFC: this.comFunc.emptyToZero(data.mkg_amount), // metal amount
      // MKGVALUECC: this.comFunc.FCToCC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(data.mkg_amount)
      // ), // metal amount
      RATE_TYPE: '',
      // data.METAL_RATE_TYPE || '',
      METAL_RATE: data.metalRate,
      //  this.comFunc.emptyToZero(data.METAL_RATE),
      // METAL_RATE: this.comFunc.emptyToZero(data.metalRate),

      METAL_RATE_GMSFC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(data.METAL_RATE_PERGMS_ITEMKARAT)
      ), //need
      METAL_RATE_GMSCC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(data.METAL_RATE_PERGMS_ITEMKARAT), this.vocDataForm.value.txtCurRate
      ), //need
      METALVALUEFC: this.comFunc.emptyToZero(data.metalAmt),
      METALVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(data.metalAmt), this.vocDataForm.value.txtCurRate
      ),
      STONE_RATEFC: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_rate) || 0,
      STONE_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(
          this.exchangeForm.value.fcn_exchange_stone_rate
        ), this.vocDataForm.value.txtCurRate
      ),
      STONEVALUEFC: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_amount) || 0,
      STONEVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(
          this.exchangeForm.value.fcn_exchange_stone_amount
        ), this.vocDataForm.value.txtCurRate
      ),
      NETVALUEFC: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_amount),
      NETVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(
          this.exchangeForm.value.fcn_exchange_net_amount
        ), this.vocDataForm.value.txtCurRate
      ),
      PUDIFF: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_purity_diff) || 0, // need_input
      STONEDIFF: 0.0, //need_input
      PONO: 0, // need_input
      LOCTYPE_CODE: this.exchangeForm.value.fcn_exchange_location || '', // need_input
      // LOCTYPE_CODE: '', // need_input
      OZWT: data.ozWeight || 0, // need_input
      SUPPLIER: '', // need_input
      BATCHSRNO: 0, // need_input
      STOCK_DOCDESC: this.exchangeForm.value.fcn_exchange_item_desc.toUpperCase() || '',
      BAGNO: this.exchangeForm.value.fcn_exchange_scrap_bag_no?.toString() || '',
      BAGREMARKS: this.exchangeForm.value.fcn_exchange_scrap_bag_desc || '',
      WASTAGEPER: 0.0,
      WASTAGEQTY: 0.0,
      WASTAGEAMOUNTFC: 0.0,
      WASTAGEAMOUNTCC: 0.0,
      MKGMTLNETRATE: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        data.METAL_RATE_PERGMS_ITEMKARAT
      ),
      // MKGMTLNETRATE: this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
      BARCODE: data.stock_code,
      ORDER_STATUS: false,
      PORDER_REF: '',
      BARCODEDPCS: '0',
      DT_BRANCH_CODE: this.strBranchcode,
      DT_VOCNO: 0, // to 0
      DT_VOCTYPE: this.vocType, // change
      DT_YEARMONTH: this.baseYear,
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
      "BATCHID": '0',
      "STAMPCHARGE_RATEFC": '0.000000',
      "STAMPCHARGE_RATECC": '0.000000',
      "STAMPCHARGE_AMTFC": '0.000',
      "STAMPCHARGE_AMTCC": '0.000',
      "STAMPCHARGE": false,
      "ACTUALGROSSWT": '0',
      "ACTUALPURITY": '0',
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
      "GST_CODE": '',
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
      "DONE_REEXPORTYN": false,

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
      let _exchangeMetalAmt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_amount);
      let _exchangeMkgAmt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_amt);
      let _exchangeNetAmt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_amount);

      let _exchangePcs = this.exchangeForm.value.fcn_exchange_pcs;
      let _exchangeWeight = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt);

      console.log(_exchangeMetalAmt);


      if (
        this.exchangeForm.value.fcn_exchange_item_code != '' &&
        _exchangeMetalAmt > 0 &&
        // _exchangeMetalAmt != '' &&
        _exchangeNetAmt > 0
        //  &&
        // _exchangeNetAmt != ''
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
          gross_wt: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt) || 0,
          pure_wt: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight) || 0,
          stone_amt: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_amount) || 0,
          purity_diff: this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_purity_diff) || 0,
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
        this.exchangeForm.controls['fcn_exchange_pcs'].setValue('');
        this.exchangeForm.controls['fcn_exchange_gross_wt'].setValue('');
        this.exchangeForm.controls['fcn_exchange_stone_wt'].setValue('');
        this.exchangeForm.controls['fcn_exchange_net_wt'].setValue('');
        this.exchangeForm.controls['fcn_exchange_chargeable_wt'].setValue('');
        this.exchangeForm.controls['fcn_exchange_purity'].setValue('');
        this.exchangeForm.controls['fcn_exchange_pure_weight'].setValue('');
        this.exchangeForm.controls['fcn_exchange_purity_diff'].setValue('');
        this.exchangeForm.controls['fcn_exchange_stone_rate'].setValue('');
        this.exchangeForm.controls['fcn_exchange_stone_amount'].setValue('');
        this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue('');
        this.exchangeForm.controls['fcn_exchange_making_rate'].setValue('');
        this.exchangeForm.controls['fcn_exchange_making_amt'].setValue('');
        this.exchangeForm.controls['fcn_exchange_metal_amount'].setValue('');
        this.exchangeForm.controls['fcn_exchange_net_amount'].setValue('');
        this.exchangeForm.controls['fcn_exchange_scrap_bag_no'].setValue('');
        this.exchangeForm.controls['fcn_exchange_scrap_bag_desc'].setValue('');
        this.exchangeForm.controls['fcn_exchange_location'].setValue('');
        this.exchangeForm.controls['fcn_exchange_jawahara'].setValue('');
        this.exchangeForm.controls['fcn_exchange_resale_recycle'].setValue('');
        this.exchangeForm.controls['fcn_exchange_cash_exchange'].setValue('');
        if (btn == 'saveBtn') this.modalReference.close();
        this.sumTotalValues();

        this.setMetalPurchaseDataPost();
      } else {
        // alert('Invalid Metal Amount');
        if (this.exchangeForm.value.fcn_exchange_item_code == '') {
          this.openDialog('Warning', 'Stock code should not be empty', true);
        }
        if (_exchangeMetalAmt == 0)
          this.openDialog('Warning', 'Invalid Metal Amount', true);
        if (_exchangeNetAmt == 0)
          // if (_exchangeNetAmt == '' || 0)
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




    let API = `RetailsalesExchangeLookup/${this.strBranchcode}/${_exchangeCode}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.renderer.selectRootElement('#fcn_exchange_gross_wt').select();

          // if (!this.editOnly && !this.viewOnly) {

            _exchangeItem = resp.response.filter((i: any) => i.STOCK_CODE == _exchangeCode.toUpperCase());

            this._exchangeItemchange = _exchangeItem[0];
            _karatCode = _exchangeItem[0].KARAT_CODE;
            _karatRateRec = this.karatRateDetails.filter(function (i: any) {
              return i.KARAT_CODE == _karatCode;
            });

            this.exchangeForm.controls['fcn_exchange_pcs'].setValue(
              _exchangeItem[0].PCS
            );

            this.exchangeForm.controls['fcn_exchange_division'].setValue(
              _exchangeItem[0].DIVISION_CODE
            );
            this.exchangeForm.controls['fcn_exchange_item_code'].setValue(
              _exchangeItem[0].STOCK_CODE
            );
            this.exchangeForm.controls['fcn_exchange_item_desc'].setValue(
              _exchangeItem[0].STOCK_DESCRIPTION
            );
            this.exchangeForm.controls['fcn_exchange_purity'].setValue(
              this.comFunc.decimalQuantityFormat(_exchangeItem[0].PURITY, 'PURITY')

              // _exchangeItem[0].PURITY
            );
            this.standardPurity = this._exchangeItemchange.PURITY;

            this.setMetalRate(_exchangeItem[0].KARAT_CODE,'exchange');
            
            // this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue(
            //   this.comFunc.decimalQuantityFormat(_exchangeItem[0].METAL_RATE_PERGMS_ITEMKARAT, 'METAL_RATE')
            // );

            this.exchangeFormMetalRateType = _exchangeItem[0].METAL_RATE_TYPE;
          // }

          this.toggleExchangeFormControls(_exchangeItem[0].INCLUDE_STONE);


          // if (_exchangeItem[0].INCLUDE_STONE == false) {
          //   // this.exchangeForm.con
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_stone_rate', true);
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_stone_wt', true);
          //   this.comFunc.formControlSetReadOnly(
          //     'fcn_exchange_stone_amount',
          //     true
          //   );
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_net_wt', true);
          //   this.comFunc.formControlSetReadOnly(
          //     'fcn_exchange_chargeable_wt',
          //     true
          //   );
          //   // this.exchangeForm.controls.fcn_exchange_stone_wt.disable();
          //   // this.exchangeForm.controls.fcn_exchange_stone_wt.clearValidators();
          //   this.removeValidationsForForms(this.exchangeForm, [
          //     'fcn_exchange_stone_wt',
          //     'fcn_exchange_stone_rate',
          //     'fcn_exchange_stone_amount',
          //     'fcn_exchange_net_wt',
          //     'fcn_exchange_chargeable_wt',
          //   ]);
          //   // this.exchangeForm.controls.fcn_exchange_stone_wt.clearValidators();
          //   // this.exchangeForm.controls.fcn_exchange_stone_wt.updateValueAndValidity();

          //   // focus
          //   // this.renderer.selectRootElement('#fcn_exchange_purity').focus();
          // } else {
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_net_wt', false);
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_stone_wt', false);
          //   this.comFunc.formControlSetReadOnly('fcn_exchange_stone_rate', false);
          //   this.comFunc.formControlSetReadOnly(
          //     'fcn_exchange_stone_amount',
          //     false
          //   );
          //   this.comFunc.formControlSetReadOnly(
          //     'fcn_exchange_chargeable_wt',
          //     false
          //   );

          //   // focus
          //   // this.renderer.selectRootElement('#fcn_exchange_stone_wt').focus();
          // }
        }
        else {
          // this.viewOnly = true;
          this.openDialog(
            'Failed',
            this.comFunc.getMsgByID('MSG1464'),
            true
          );
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

  // removeValidationsForForms(form: any, controlsArr: any) {
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
  setPosItemData(sno: any, data: any, isPulled = false) {
    let fcn_li_rate = isPulled ? data.MKG_RATECC : this.lineItemForm.value.fcn_li_rate;

    fcn_li_rate = (fcn_li_rate === null || fcn_li_rate === 0 || fcn_li_rate === '') ? 0 : parseFloat(fcn_li_rate.toString().replace(/,/g, ''));



    let fcn_ad_metal_rate = isPulled ? this.comFunc.decimalQuantityFormat(data.METAL_RATE, 'METAL_RATE') : this.lineItemForm.value.fcn_ad_metal_rate;

    fcn_ad_metal_rate = (fcn_ad_metal_rate === null || fcn_ad_metal_rate === 0 || fcn_ad_metal_rate === '') ? 0 : parseFloat(fcn_ad_metal_rate.replace(/,/g, ''));

    let newSRNO = isPulled ? data.SRNO : sno;

    while (this.currentLineItems.some((item: any) => item.SRNO === newSRNO)) {
      newSRNO++;
    }


    let temp_pos_item_data: any = {
      // new values
      // "UNIQUEID": 0,

      DIVISIONMS: data.DIVISIONMS,
      SRNO: newSRNO,
      DIVISION_CODE: isPulled ? data.DIVISION_CODE : data.DIVISION,
      STOCK_CODE: data.STOCK_CODE, // m
      GROSS_AMT: isPulled ? data.NETVALUECC : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) || 0,
      PCS: data.PCS,
      GROSSWT: isPulled ? data.GROSSWT : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
      STONEWT: isPulled ? data.STONEWT : data.STONE_WT, // m
      NETWT: isPulled
        ? data.METAL_RATE_GMSFC
        : (data.divisionMS == "S" || data.DIVISIONMS == "S"
          ? 0
          : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt)),
      PURITY: data.PURITY, // m
      PUREWT: isPulled ? data.METAL_RATE_GMSFC : data.pure_wt, // m
      CHARGABLEWT: isPulled
        ? data.DIVISIONMS
        : (data.divisionMS == "M"||this.newLineItem.DIVISION == 'D'
          ? 0
          : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt)),
      MKG_RATEFC: isPulled ? data.MKG_RATEFC : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) || 0, //need
      MKG_RATECC: isPulled ? data.MKG_RATECC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate), this.vocDataForm.value.txtCurRate
      ), // cctofc rate

      MKGVALUEFC: isPulled ? data.MKGVALUEFC : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount), // metal amount
      MKGVALUECC: isPulled ? data.MKGVALUECC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount), this.vocDataForm.value.txtCurRate
      ), // metal amount
      RATE_TYPE: isPulled ? data.RATE_TYPE : (this.newLineItem.RATE_TYPE ?? ""),

      //  data.divisionMS == "S" ? '' : data.RATE_TYPE, //need_input
      METAL_RATE: isPulled ? data.METAL_RATE : this.lineItemForm.value.fcn_ad_metal_rate ?? 0,

      // this.comFunc.emptyToZero(
      //   this.lineItemForm.value.fcn_ad_metal_rate
      // ),

      METAL_RATE_GMSFC: isPulled ? data.METAL_RATE_GMSFC : this.lineItemForm.value.fcn_ad_metal_rate ?? 0,
      METAL_RATE_GMSCC: isPulled ? data.METAL_RATE_GMSCC : this.lineItemForm.value.fcn_ad_metal_rate ?? 0,

      // "METAL_RATE_GMSFC": 18.1, // jeba
      // "METAL_RATE_GMSCC": 19.1, // jeba
      METALVALUEFC: isPulled ? data.METALVALUEFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_metal_amount
      ),

      METALVALUECC: isPulled ? data.METALVALUECC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount), this.vocDataForm.value.txtCurRate
      ),
      STONE_RATEFC: isPulled ? data.STONE_RATEFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_stone_rate
      ),
      STONE_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_rate), this.vocDataForm.value.txtCurRate
      ),
      STONEVALUEFC: isPulled ? data.STONEVALUEFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_stone_amount
      ),
      STONEVALUECC: isPulled ? data.STONEVALUECC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount), this.vocDataForm.value.txtCurRate
      ),
      DISCOUNT: isPulled ? data.DISCOUNT : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_discount_percentage
      ),
      DISCOUNTVALUEFC: isPulled ? data.DISCOUNTVALUEFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_discount_amount
      ),
      DISCOUNTVALUECC: isPulled ? data.DISCOUNTVALUECC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount), this.vocDataForm.value.txtCurRate
      ),
      NETVALUEFC: isPulled ? data.NETVALUEFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_net_amount
      ),
      NETVALUECC: isPulled ? data.NETVALUECC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_net_amount
      ),

      // this.comFunc.FCToCC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount), this.vocDataForm.value.txtCurRate
      // ),
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
      LOCTYPE_CODE: isPulled ? data.LOCTYPE_CODE : this.lineItemForm.value.fcn_li_location, // need
      SUPPLIER: data.SUPPLIER || '',
      STOCK_DOCDESC: isPulled ? data.STOCK_DOCDESC : this.lineItemForm.value.fcn_li_item_desc,
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
      STKTRANMKGCOST: isPulled ? (data.STKTRANMKGCOST?.toString() || "0") : (data.STOCK_COST?.toString() || "0"),
      //  data.STOCK_COST,
      MAINSTOCKCODE: isPulled ? data.MAINSTOCKCODE : data.MAIN_STOCK_CODE, //need field
      MKGMTLNETRATE: isPulled ? data.MKGMTLNETRATE : this.comFunc.emptyToZero(fcn_ad_metal_rate + fcn_li_rate),
      // MKGMTLNETRATE:this.comFunc.emptyToZero(parseFloat(this.lineItemForm.value.fcn_ad_metal_rate)+parseFloat(this.lineItemForm.value.fcn_li_rate)),

      MTL_SIZE: '',
      MTL_COLOR: '',
      MTL_DESIGN: '',
      SALESPERSON_CODE: isPulled ? data.DTSALESPERSON_CODE : this.vocDataForm.value.sales_person || '', //need
      STKTRN_LANDINGCOST: 0,
      //  data.STOCK_COST, //need
      STKTRN_WASTAGERATE: 0, //need

      HSN_CODE: data.HSN_CODE,
      VATCODE: data.GST_CODE ? data.GST_CODE.toString() : '',

      VAT_PER: isPulled ? data.VAT_PER : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_tax_percentage
      ),

      // TOTALWITHVATFC: this.comFunc.emptyToZero(
      //   this.lineItemForm.value.fcn_li_net_amount
      // ),
      // TOTALWITHVATLC: this.comFunc.CCToFC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount)
      // ),
      VAT_AMOUNTFC: isPulled ? data.VAT_AMOUNTFC : this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_li_tax_amount
      ),
      VAT_AMOUNTLC: isPulled ? data.VAT_AMOUNTLC : this.comFunc.emptyToZero(
        this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount), this.vocDataForm.value.txtCurRate
        )
      ),
      TOTALWITHVATFC: isPulled ? data.TOTALWITHVATFC : this.comFunc.emptyToZero(
        // this.order_items_total_gross_amount,
        this.lineItemForm.value.fcn_li_net_amount
        // this.lineItemForm.value.fcn_ad_amount
        // + this.lineItemForm.value.fcn_li_tax_amount
      ),
      TOTALWITHVATLC: isPulled ? data.TOTALWITHVATLC :
        this.comFunc.emptyToZero(
          this.comFunc.FCToCC(
            this.vocDataForm.value.txtCurrency,
            this.comFunc.emptyToZero(
              this.lineItemForm.value.fcn_li_net_amount
              // this.lineItemForm.value.fcn_li_net_amount
              // this.comFunc.emptyToZero(this.order_items_total_gross_amount)
              // this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_amount)
              // + this.comFunc.emptyToZero( this.lineItemForm.value.fcn_li_tax_amount)
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
      DT_YEARMONTH: this.baseYear,
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

      EXTRA_STOCK_CODE: '',
      // '001293413', //need
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
      IGST_PER: isPulled ? data.IGST_PER : this.lineItemForm.value.fcn_li_tax_percentage || 0,
      IGST_AMOUNTFC: isPulled ? data.IGST_AMOUNTFC : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount) || 0,
      IGST_AMOUNTCC: isPulled ? data.IGST_AMOUNTCC : this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount), this.vocDataForm.value.txtCurRate
      ),
      CGST_ACCODE: '',
      SGST_ACCODE: '',
      IGST_ACCODE: this.newLineItem.IGST_ACCODE ? this.newLineItem.IGST_ACCODE.toString() : "",
      TOTAL_AMOUNTFC: isPulled ? data.TOTAL_AMOUNTFC : this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) +
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
      ),
      TOTAL_AMOUNTCC: isPulled ? data.TOTAL_AMOUNTCC : this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) +
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
      ),
      CGST_CTRLACCODE: '',
      SGST_CTRLACCODE: '',
      IGST_CTRLACCODE: '',
      GST_GROUP: this.newLineItem.IGST_PER ? 'R' : '',
      GST_CODE: data['GST_CODE'].toString(),
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
      "SALES_TAGLINES": this.newLineItem.TAGLINES ?? '',
      // this.lineItemForm.value.fcn_tab_details || '',
      "GPC_STONEDIFF_AC": this.newLineItem.GPC_STONEDIFF ?? '',
      "GPC_STONEVALUESALES_AC": this.newLineItem.GPC_STONEDIFFVALUE ?? '',
      "GPC_POSSALES_AC": this.newLineItem.GPC_POSSALES_AC ?? '',
      "GPC_KUNDANVALUESALES_AC": this.newLineItem.GPC_KUNDANVALUESALES_AC ?? '',
      "GPC_POSSALESSR_AC": this.newLineItem.GPC_POSSALESSR_AC ?? '',
      "GPC_METALAMT_AC": this.newLineItem.GPC_METALAMT_AC ?? '',
      "GPC_PHYSICALSTOCK_AC": this.newLineItem.GPC_PHYSICALSTOCK_AC ?? '',
      "GPC_WASTAGE_AC": this.newLineItem.GPC_WASTAGE_AC ?? '',
      "GPC_STAMPCHARGE_AC": this.newLineItem.GPC_STAMPCHARGE_AC ?? '',
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
    console.log(temp_pos_item_data);

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
      GROSS_AMT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) || 0,
      PCS: this.lineItemForm.value.fcn_li_pcs || 1,
      GROSSWT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
      STONEWT: data.STONEWT,
      NETWT: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt),
      PURITY: data.PURITY,
      PUREWT: data.PUREWT,
      CHARGABLEWT: data.NET_WT,
      MKG_RATEFC: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) || 0,
      MKG_RATECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate), this.vocDataForm.value.txtCurRate
      ),
      MKGVALUEFC: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount),
      MKGVALUECC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount), this.vocDataForm.value.txtCurRate
      ),
      METAL_RATE: this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_metal_rate
      ),
      METAL_RATE_GMSFC: this.comFunc.emptyToZero(
        this.lineItemForm.value.fcn_ad_metal_rate
      ),
      METAL_RATE_GMSCC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_rate), this.vocDataForm.value.txtCurRate
      ),
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
      LOCTYPE_CODE: this.lineItemForm.value.fcn_li_location, // need
      SUPPLIER: data.SUPPLIER || '',
      STOCK_DOCDESC: this.lineItemForm.value.fcn_li_item_desc,
      LOCKED: false,
      StkTranMkgCost: data.STKTRANMKGCOST,
      MainStockCode: data.MAIN_STOCK_CODE, //need field
      MkgMtlNetRate: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) +
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
      ),
      DTSALESPERSON_CODE: this.vocDataForm.value.sales_person || '', //need
      StkTrn_LandingCost: data.STOCK_COST, //need
      HSNCODE: data.HSN_CODE,
      VATCODE: data.GST_CODE ? data.GST_CODE.toString() : '',
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
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      net_sum
      // + total_tax_amt
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
    // this.prnt_inv_total_gross_amt = total_sum-total_dis_amt;
    this.prnt_inv_total_gross_amt = total_gross_amt;
    // total_sum + total_metal_amt + total_stone_amt;
    //  this.prnt_inv_total_gross_amt = net_sum-this.order_items_total_tax;

    this.prnt_inv_net_total_without_tax = total_sum;
    this.order_items_total_amount = total_sum;
    this.prnt_inv_total_tax_amount = tax_sum;
    this.order_items_total_tax = tax_sum;

    this.order_items_total_gross_amount = net_sum;
    // this.prnt_inv_total_gross_amt = net_sum-tax_sum;
    this.order_items_total_discount_amount = '0.00';


    // added by moorthy jebu reference - 11-01-2024
    // if (StaticValues.strBRANCHTAXTYPE == Formcontrols.TaxType.VAT.ToString())
    // {
    let dblRounddiff = 0.00;
    let dblVatTot = 0.00;
    let dblVatAmtRd = 0.00;
    let intVocCCRoundoff = 2;

    this.order_items_total_gross_amount = net_sum;
    // this.order_items_total_discount_amount = this.zeroAmtVal;
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
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      this.order_items_total_gross_amount -
      // total_sales_return_sum -
      this.invReturnSalesTotalNetTotal -
      total_exchange
    );
    this.netTotal = this.order_items_total_discount_amount ? this.order_items_total_gross_amount - Number(this.order_items_total_discount_amount) : this.order_items_total_gross_amount;

    this.order_items_total_net_amount_org = this.order_items_total_net_amount;

    this.netTotal = this.order_items_total_net_amount;


    let IgstVatData: any = this.ordered_items.filter((data) => data.taxPer != 0 && data.taxPer != '');
    let IgstVatPer: number = 0;
    let taxType;
    if (IgstVatData.length > 0) {
      IgstVatPer = parseFloat(IgstVatData[0].taxPer);
    }

    if (this.comFunc.allbranchMaster.BRANCH_TAXTYPE == 'VAT') {

      if (this.comFunc.compCurrency == "AED" || this.comFunc.compCurrency == "BHD") { // need to check & change

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

          if (this.vocDataForm.value.txtCurrency && ((dblRounddiff - dblVatTot) < 0.05)) {
            this.vatRoundOffAmt = this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.CCToFC(
                this.vocDataForm.value.txtCurrency,
                (dblRounddiff - dblVatTot),
                this.vocDataForm.value.txtCurRate
              )
            );
            dblVatAmtRd = this.comFunc.emptyToZero(this.vatRoundOffAmt);
            this.order_items_total_tax = this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              (this.comFunc.emptyToZero(this.order_items_total_tax) + this.comFunc.emptyToZero(dblVatAmtRd))
            );
          }


          // if ((dblRounddiff - dblVatTot) < 0.05) {
          //   this.vatRoundOffAmt = this.comFunc.transformDecimalVB(
          //     this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.CCToFC(this.vocDataForm.value.txtCurrency, (dblRounddiff - dblVatTot), this.vocDataForm.value.txtCurRate));
          //   dblVatAmtRd = this.comFunc.emptyToZero(this.vatRoundOffAmt);
          //   this.order_items_total_tax = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, (this.comFunc.emptyToZero(this.order_items_total_tax) + this.comFunc.emptyToZero(dblVatAmtRd)));

          // }
        }
      }
    }


    this.sumReceiptItem();

    this.changeFinalDiscount({ target: { value: this.order_items_total_discount_amount } });


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

  addItemtoList(btn: any, apiData: any = null) {
    Object.values(this.lineItemForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (!this.lineItemForm.invalid || apiData) {
      if (
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) >=
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) || apiData
      ) {
        this.updateBtn = false;
        this.inv_cust_id_no = this.customerDataForm.value.fcn_customer_id_number;
        this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;

        let itemsToAdd = apiData ? apiData : [this.newLineItem];
        let lastSRNO: number = 0; // To keep track of the last SRNO

        itemsToAdd.forEach((item: any) => {
          let newSRNO = this.orderedItemEditId ? this.orderedItemEditId : this.calculateNextSRNO(); // Use existing SRNO for editing

          if (!this.orderedItemEditId) {
            while (this.ordered_items.some(orderedItem => orderedItem.sn_no === newSRNO)) {
              newSRNO++;
            }
            lastSRNO = newSRNO;
          }

          if (this.newLineItem.STOCK_CODE == '' || (!apiData && !this.lineItemForm.value.fcn_li_item_code)) {
            this.openDialog('Failed', this.comFunc.getMsgByID('MSG1816'), true);
            this.dialogBox.afterClosed().subscribe((data: any) => {
              if (data == 'OK') {
                this.lineItemForm.controls['fcn_li_item_code'].setValue('');
                this.renderer.selectRootElement('#fcn_li_item_code').focus();
              }
            });
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

            var values: any = {
              ID: newSRNO,
              sn_no: newSRNO,
              stock_code: item.STOCK_CODE || this.newLineItem.STOCK_CODE,
              mkg_amount: this.lineItemForm.value.fcn_ad_making_amount || item.MKGVALUECC || 0,
              pcs: this.lineItemForm.value.fcn_li_pcs || item.PCS || 0,
              weight: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) || item.GROSSWT || 0,
              description: this.lineItemForm.value.fcn_li_item_desc || item.STOCK_DOCDESC || '',
              tax_amount: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount) || 0,
              net_amount: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) || item.NETVALUECC || 0,
              pure_wt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pure_wt) || item.PUREWT || 0,
              making_amt: this.lineItemForm.value.total_amount || item.MKGVALUECC || 0,
              metal_rate: this.lineItemForm.value.fcn_ad_metal_rate || item.METAL_RATE || 0,
              metal_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) || item.METALVALUECC || 0,
              stone_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount) || item.STONEVALUECC || 0,
              dis_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount) || item.DISCOUNTVALUECC || 0,
              gross_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) || 0,
              rate: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) || 0,
              taxPer: this.lineItemForm.value.fcn_li_tax_percentage || 0,
            };
            values.total_amount = this.newLineItem.DIVISION == 'D' ?
              this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) : this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);

            this.newLineItem.PCS = values.pcs
            if (
              this.orderedItemEditId == '' ||
              this.orderedItemEditId == undefined ||
              this.orderedItemEditId == null
            ) {
              this.ordered_items.push(values);
            } else {
              const preitemIndex = this.ordered_items.findIndex((data) => {
                return data.sn_no == this.orderedItemEditId;
              });
              if (preitemIndex != -1) {
                values.sn_no = this.orderedItemEditId;
                this.ordered_items[preitemIndex] = values;
              }
            }
          }
        });

        // Use the lastSRNO after the loop
        this.sumTotalValues();

        if (apiData && apiData.length > 0) {
          apiData.forEach((detail: any, index: any) => {
            this.setPosItemData(index + 1, detail, true);
          });
        } else {
          // Handle the case where isPulled is false or there are no details
          this.setPosItemData(lastSRNO, this.newLineItem, false);
        }
        this.newLineItem.STOCK_CODE = '';

        this.lineItemForm.reset();
        this.isNetAmountChange = false;

        if (btn == 'finish_btn') {
          this.modalReference.close();
          this.imageURL = []
        } else {
          this.enableFormControls(false);
          try { this.renderer.selectRootElement('#fcn_li_item_code', true).focus(); } catch (e) { console.warn('The selector "#fcn_li_item_code" did not match any elements.'); }
          // this.renderer.selectRootElement('#fcn_li_item_code').focus();
          this.imageURL = []
        }
      } else {
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1914'), true);
      }
    } else {
      console.log(this.lineItemForm.controls.fcn_li_gross_wt.errors);
      this.snackBar.open('Please Fill Required Fields', '', {
        duration: 2000
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
  imageURL: any[] = []
  getStockImage() {
    let API = `RetailSalesItemImage/${this.lineItemForm.value.fcn_li_item_code}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp: any) => {
        console.log(resp.response);
        let data = resp.response
        data.forEach((element: any) => {
          this.imageURL.push(element.imagepath)
        });
      })
  }


  focusAndSetReadOnly(stockInfos: any): void {
    this.isGrossWtEditable = true;
    this.isPcsEditable = true;
    const isDivisionX = this.newLineItem.DIVISION === 'X';
    const excludeQtyValidations = ['M', 'D', 'W', 'N'];
    if (
      (excludeQtyValidations.some(v => this.newLineItem.DIVISION.toUpperCase().includes(v)))) {
      this.isGrossWtEditable = false;
      this.isPcsEditable = true;
    } else
      if (this.validatePCS == true || this.enablePieces == true)
        this.isPcsEditable = true;
      else
        this.isPcsEditable = false;
        if (!isDivisionX && 
           stockInfos.ENABLE_PCS &&
          excludeQtyValidations.some(v => this.newLineItem.DIVISION.toUpperCase().includes(v))) {
            if(this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs)==0)
          this.renderer.selectRootElement('#fcn_li_pcs')?.select();
        else{
          if (!isDivisionX && stockInfos.ENABLE_PCS && excludeQtyValidations.some(v => this.newLineItem.DIVISION.toUpperCase().includes(v))) {
            if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs) == 0) {
              this.renderer.selectRootElement('#fcn_li_pcs')?.select();
            } else {
              const element = this.renderer.selectRootElement('#fcn_li_net_amount');
              element.focus();  
              setTimeout(() => element.select(), 0);  
            }
          }
          
        }
        // this.renderer.selectRootElement('#fcn_li_net_amount')?.select();
        }
    // if (!isDivisionX &&
    //   this.comFunc.emptyToZero(stockInfos.BALANCE_PCS) < 1 &&
    //   stockInfos.ENABLE_PCS &&
    //   this.newLineItem.DIVISION !== 'X' &&
    //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) === 0 &&
    //   excludeQtyValidations.some(v => this.newLineItem.DIVISION.toUpperCase().includes(v))) {
    //   this.renderer.selectRootElement('#fcn_li_pcs').focus();
    // }
     else {
      if (this.divisionMS == 'M') this.renderer.selectRootElement('#fcn_li_total_amount')?.select();

      if(this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) === 0 &&
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) === 0 &&this.itemDivision!=='L'){
        this.renderer.selectRootElement('#fcn_li_gross_wt')?.select();

      }

      else if(this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) === 0 &&
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) === 0 && !['L', 'C', 'P'].includes(this.itemDivision)){

        this.renderer.selectRootElement('#fcn_li_rate')?.select();

      }


      else if (['L', 'C', 'P'].includes(this.itemDivision)) {
        if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) === 0 &&
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate) === 0) {
          this.renderer.selectRootElement('#fcn_li_gross_wt')?.select();
        }

        else {
          this.renderer.selectRootElement('#fcn_li_rate')?.select();
        }
      }

      else{
        this.renderer.selectRootElement('#fcn_li_net_amount')?.select();

      }
    }

    if (isDivisionX) {

      this.lineItemForm.controls.fcn_li_gross_wt.setValue(
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BMQTYDECIMALS,
          1));
      this.isGrossWtEditable = false;
      this.isPcsEditable = false;
      // this.comFunc.formControlSetReadOnly('fcn_li_pcs', true);
      this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      this.renderer.selectRootElement('#fcn_li_rate')?.select();

    }
  }


  async getStockDesc(event: any) {
    this.imageURL = [];
    this.getStockImage();
    // this.enableFormControls(false);
    this.li_tax_amount_val = 0.0;
    var gross_amount_val = 0.0;
    this.li_net_amount_val = 0.0;
    this.currentStockCode = event.target.value;

    // form rest before stockcode change
    this.lineItemForm?.reset();
    this.lineItemForm.controls.fcn_li_item_code.setValue(this.currentStockCode);
    console.log('called', event.target.value);



    if (event.target.value != '') {
      this.snackBar.open('Loading...');

      if (this.comFunc.compAcCode == 'JHO001') {
        const stockExist = await this.checkStockCodeForParticularDate(event.target.value);
        if (stockExist) {
          this.snackBar.dismiss();
          return;
        }
      }
      try {


        let API = `RetailSalesStockValidation/${event.target.value}/${this.strBranchcode}/${this.vocType}/${this.strUser}/%27%27/%27%27/${this.convertDateToYMD(this.vocDataForm.value.vocdate)}`
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
                this.enableFormControls(true);
                this.newLineItem = stockInfos;
                this.isRevCalculationBlock = false;

                // need field from jebaraj
                if (!this.newLineItem.DONT_ALLOW_DUPLICATE) {

                  const res = this.ordered_items.filter((data: any) => data.stock_code == this.newLineItem.STOCK_CODE);
                  if (res.length > 0) {




                    if (this.blockRepeatedBarcode) {
                      this.openDialog(
                        'Warning',
                        this.comFunc.getMsgByID('MSG1890'),
                        true
                      );
                      this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {

                          this.lineItemForm.controls.fcn_li_item_code.setValue('');
                          this.renderer.selectRootElement('#fcn_li_item_code').focus();
                          return;
                        }

                      });
                    }

                    else {
                      this.openDialog(
                        'Warning',
                        this.comFunc.getMsgByID('MSG1889'),
                        false
                      );
                      this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'No') {
                          this.lineItemForm.controls.fcn_li_item_code.setValue('');
                          this.lineItemForm.reset();
                          this.renderer.selectRootElement('#fcn_li_item_code').focus();
                          return;

                        }
                        else{
                          this.focusAndSetReadOnly(stockInfos);
                        }
                      });
                    }



                    // this.snackBar.open('Stock Already Exists', 'OK', {
                    //   duration: 2000
                    // });
                    // this.lineItemForm.controls.fcn_li_item_code.setValue('');
                    // this.renderer.selectRootElement('#fcn_li_item_code').focus();
                    // return;

                  }

                }
                this.newLineItem.HSN_CODE = stockInfoTaxes[0]?.HSN_CODE;
                this.newLineItem.GST_CODE = stockInfoTaxes[0]?.GST_CODE;
                this.newLineItem.STOCK_DESCRIPTION = stockInfos.DESCRIPTION;
                this.newLineItem.STOCK_COST = stockInfoPrice.STOCK_COST;
                this.newLineItem.IGST_ACCODE = stockInfoTaxes[0]?.POS_TAX_ACCODE;
                this.newLineItem.IGST_ACCODE_NON_POS = stockInfoTaxes[0]?.IGST_ACCODE;
                this.newLineItem.IGST_PER = stockInfoTaxes[0]?.IGST_PER;
                this.isPromotionalItem = stockInfos.TPROMOTIONALITEM;
                this.blockNegativeStock = stockInfos.BLOCK_NEGATIVESTOCK;
                // this.newLineItem.GPC_POSSALES_AC = stockInfos[0]?.GPC_POSSALES_AC;
                // this.newLineItem.GPC_STONEDIFF_AC = stockInfos[0]?.GPC_STONEDIFF_AC;
                // this.newLineItem.GPC_STONEVALUESALES_AC = stockInfos[0]?.GPC_STONEVALUESALES_AC;
                // this.newLineItem.GPC_KUNDANVALUESALES_AC = stockInfos[0]?.GPC_KUNDANVALUESALES_AC;
                // this.newLineItem.GPC_POSSALESSR_AC = stockInfos[0]?.GPC_POSSALESSR_AC;
                // this.newLineItem.GPC_METALAMT_AC = stockInfos[0]?.GPC_METALAMT_AC;
                //   this.newLineItem.GPC_PHYSICALSTOCK_AC = stockInfos[0]?.GPC_PHYSICALSTOCK_AC;
                this.newLineItem.TAGLINES = stockInfos?.TAGLINES;

                this.divisionMS = stockInfos.DIVISIONMS;
                this.itemDivision = stockInfos.DIVISION;

                this.lineItemForm.controls['fcn_tab_details'].setValue(
                  stockInfos.TAGLINES??""
                );
                this.li_tag_val = stockInfos.TAGLINES??"";

                this.setGiftType();
                const validDivisionCodes = ['M', 'D', 'W', 'P', 'N'];


                this.isStoneIncluded = stockInfos.STONE;
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
                const filteredValidationCodes = validDivisionCodes.filter(
                  (code) => code === stockInfos.DIVISION.toUpperCase()
                );


                this.lineItemGrossWt = this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                  this.comFunc.emptyToZero(stockInfos.BALANCE_QTY)
                );
                this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                  stockInfos.BALANCE_QTY
                );
                // this.setGrossWtFocus();
                this.lineItemForm.controls['fcn_li_stone_wt'].setValue(
                  stockInfos.STONE_WT || this.zeroSQtyVal
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
                this.blockNegativeStockValue = stockInfos.BALANCE_QTY;
                this.blockMinimumPrice = stockInfos.BLOCK_MINIMUMPRICE;
                this.blockMinimumPriceValue = this.comFunc.emptyToZero(resp.priceInfo.MIN_SAL_PRICE) != 0 ? this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS,
                  resp.priceInfo.MIN_SAL_PRICE
                ) : this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS,
                  resp.priceInfo.STOCK_COST
                );
                // this.blockMinimumPriceValue = this.comFunc.transformDecimalVB(
                //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
                //   stockInfoPrice.MIN_SAL_PRICE
                // );
                this.validatePCS = stockInfos.VALIDATE_PCS;
                this.enablePieces = stockInfos.ENABLE_PCS;
                this.managePcsGrossWt();
                this.curr_line_item_images = stockInfos.PICTURE_NAME;
                // this.lineItemForm.controls['fcn_li_rate'].setValue(stockInfos.RATE); // got value =0
                this.lineItemForm.controls['fcn_li_rate'].setValue(
                  parseFloat(stockInfos.RATE).toFixed(2)
                );
                this.lineItemForm.controls['fcn_ad_rate'].setValue(
                  parseFloat(stockInfos.RATE).toFixed(2)
                );

                this.focusAndSetReadOnly(stockInfos);

                // const excludeQtyValidations = ['M', 'D', 'W'];
                // if (this.comFunc.emptyToZero(stockInfos.BALANCE_PCS) < 1 && stockInfos.ENABLE_PCS &&
                //   this.newLineItem.DIVISION != "X" &&
                //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) != 0 &&
                //   excludeQtyValidations.some(v => this.newLineItem.DIVISION.toUpperCase().includes(v))) {
                //   this.renderer.selectRootElement('#fcn_li_pcs').focus();
                // }

                // else {
                //   this.renderer.selectRootElement('#fcn_li_total_amount').focus();
                // }




                // if(this.newLineItem.DIVISION=="X"){
                //   this.comFunc.formControlSetReadOnly('fcn_li_pcs', true);
                //   this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
                // }

                if (this.divisionMS == 'M') {
                  this.lineItemForm.controls['fcn_ad_making_rate'].setValue(
                    parseFloat(stockInfoPrice.SELLING_PRICE).toFixed(2)
                  ); //calculation

                  // this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(0); //calculation
                  this.lineItemForm.controls['fcn_ad_metal_rate'].setValue(
                    this.comFunc.decimalQuantityFormat(this.zeroAmtVal, 'METAL_RATE')

                  ); //need field

                  console.log(this.lineItemForm.controls)
                  console.log(this.zeroAmtVal)
                  console.log(this.comFunc.decimalQuantityFormat(this.zeroAmtVal, 'METAL_RATE'))
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
                      this.comFunc.allbranchMaster?.BAMTDECIMALS,
                      stockInfoPrice.SELLING_PRICE
                    )
                  );
                  // this.lineItemForm.controls['fcn_ad_amount'].setValue(stockInfoPrice.SELLING_PRICE);

                  this.lineItemForm.controls['fcn_ad_stone_rate'].setValue(
                    this.comFunc.emptyToZero(stockInfoPrice.STONE_SALES_PRICE)
                  );

                  this.setMetalRate(stockInfos.KARAT_CODE,'sales');

                  this.manageCalculations();
                } else {

                  // if (filteredValidationCodes.length > 0) {
                  //   this.changePCS({ target: { value: 1 } },true);
                  // }

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
                this.setGrossWtFocus();
                this.li_tax_amount_val =
                  this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);
                this.li_net_amount_val =
                  this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount);
                // this.li_tag_val = this.newLineItem.TAG_LINES;

                   this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);


                // if (!this.newLineItem?.IS_BARCODED_ITEM || this.comFunc.stringToBoolean(this.newLineItem.TPROMOTIONALITEM.toString()))
                //   this.removeValidationsForForms(this.lineItemForm, ['fcn_li_rate', 'fcn_li_total_amount']);
                // else{
                //   this.setMakingValidation();
                // }
                

                const stoneCondition = this.comFunc.stringToBoolean(this.newLineItem.STONE?.toString());
                this.toggleStoneAndNetWtFields(stoneCondition);


                // if (this.comFunc.stringToBoolean(this.newLineItem.STONE?.toString()) == false) {

                //   this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', true);
                //   this.comFunc.formControlSetReadOnly('fcn_li_net_wt', true);
                //   this.removeValidationsForForms(this.lineItemForm, ['fcn_li_stone_wt', 'fcn_li_net_wt']);
                // } else {

                //   this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', false);
                //   this.comFunc.formControlSetReadOnly('fcn_li_net_wt', false);
                //   this.addValidationsForForms(this.lineItemForm, 'fcn_li_stone_wt', [
                //     Validators.required,
                //   ]);
                //   this.addValidationsForForms(this.lineItemForm, 'fcn_li_net_wt', [
                //     Validators.required,
                //   ]);
                // }




                
                // this.renderer.selectRootElement('#fcn_li_net_amount').focus();

              } else {
                this.enableFormControls(false);
                // this.snackBar.open('Invalid Stock Code', 'OK');
                this.openDialog(
                  'Failed',
                  // this.comFunc.getMsgByID(stockInfoResult.MESSAGE_ID.toString()),
                  this.comFunc.getMsgByID('MSG1464'),
                  true
                );
                this.dialogBox.afterClosed().subscribe((data: any) => {
                  if (data == 'OK') {
                    this.lineItemForm.controls['fcn_li_item_code'].setValue('');
                    this.renderer.selectRootElement('#fcn_li_item_code').focus();
                  }

                });


              }
            }
          });
      } catch (error) {
        console.log('========error============================');
        console.log(error);
        console.log('====================================');
      }
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
    else {
      this.blockNegativeStock = "";
      this.lineItemForm.reset();
      this.openDialog(
        'Failed',
        this.comFunc.getMsgByID('MSG1816'),
        true
      );
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.lineItemForm.controls['fcn_li_item_code'].setValue('');
          this.renderer.selectRootElement('#fcn_li_item_code').focus();
        }

      });
      this.enableFormControls(false);
    }

    // this.lineItemForm.controls['fcn_li_pcs'].setValue(1);
  }

  toggleStoneAndNetWtFields(stoneCondition: boolean): void {
    console.log(this.isStoneIncluded);
    console.log(stoneCondition)
    if (!stoneCondition) {
      this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', true);
      this.comFunc.formControlSetReadOnly('fcn_li_net_wt', true);
      this.removeValidationsForForms(this.lineItemForm, ['fcn_li_stone_wt', 'fcn_li_net_wt']);
    } else {
      this.comFunc.formControlSetReadOnly('fcn_li_stone_wt', false);
      this.comFunc.formControlSetReadOnly('fcn_li_net_wt', false);
      this.addValidationsForForms(this.lineItemForm, 'fcn_li_stone_wt', [Validators.required]);
      this.addValidationsForForms(this.lineItemForm, 'fcn_li_net_wt', [Validators.required]);
    }
  }

  toggleExchangeFormControls(includeStone: boolean): void {
    const controlsToToggle = [
      'fcn_exchange_stone_wt',
      'fcn_exchange_stone_rate',
      'fcn_exchange_stone_amount',
      'fcn_exchange_net_wt',
      'fcn_exchange_chargeable_wt'
    ];

    if (!includeStone) {
      controlsToToggle.forEach(control => {
        this.comFunc.formControlSetReadOnly(control, true);
      });
      this.removeValidationsForForms(this.exchangeForm, controlsToToggle);
    } else {
      controlsToToggle.forEach(control => {
        this.comFunc.formControlSetReadOnly(control, false);
      });
    }
  }


  setMakingValidation() {
    this.addValidationsForForms(this.lineItemForm, 'fcn_li_rate', [
      Validators.required,
      Validators.min(0.1),
    ]);
    this.addValidationsForForms(this.lineItemForm, 'fcn_li_total_amount', [
      Validators.required,
      Validators.min(0.1),
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
      this.salesReturnVocNumber = '';

      //  this.fcn_returns_voc_no_val = event.target.value;
      console.log(this.salesReturnForm.value.fcn_returns_fin_year);
      console.log(this.salesReturnForm.value.fcn_returns_branch);
      console.log(this.salesReturnForm.value.fcn_returns_voc_type);
      console.log(this.salesReturnForm.value.fcn_returns_voc_no);
      this.salesReturnVocNumber = this.salesReturnForm.value.fcn_returns_voc_no;
      let _response;

      let fin_year = this.salesReturnForm.value.fcn_returns_fin_year;
      let branch = this.salesReturnForm.value.fcn_returns_branch;
      let voc_type = this.salesReturnForm.value.fcn_returns_voc_type;
      let voc_no = this.salesReturnForm.value.fcn_returns_voc_no;

      if (event.target.value != '') {
        let API = `RetailSReturnLookUp/${branch}/${voc_type}/${voc_no}/${fin_year}`

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
                  parseFloat(preVal) + parseFloat(curVal.net_amount),
                // parseFloat(preVal) + parseFloat(curVal.slsReturn.TOTALWITHVATFC),
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
    this.isGrossWtEditable = true;
    if (this.validatePCS == true || this.enablePieces == true || this.newLineItem.DIVISION != 'G') {
      // if (!this.viewOnly&& this.newLineItem.DIVISION !='X')
      //   this.isPcsEditable=true;
      // this.comFunc.formControlSetReadOnly('fcn_li_pcs', false);

      this['lineItemForm'].controls['fcn_li_pcs'].setValidators([
        Validators.required,
        Validators.min(1),
      ]);

      const validDivisionCodes = ['M', 'D', 'W'];
      const filteredValidationCodes = validDivisionCodes.filter((code) => code === this.newLineItem.DIVISION.toUpperCase())

      if (filteredValidationCodes.length > 0) {
        this.isGrossWtEditable = false;
        // this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      }
      else {
        this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
        this.removeValidationsForForms(this.lineItemForm, ['fcn_li_pcs']);
      }

      // if (this.divisionMS == 'M') {
      //   if (this.newLineItem.PCS_TO_GMS?.toString() == '0')
      //     this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);
      //   else this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      // }
    } else {
      this.isPcsEditable = false;
      // this.comFunc.formControlSetReadOnly('fcn_li_pcs', true);
      this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);

      this.removeValidationsForForms(this.lineItemForm, ['fcn_li_pcs']);

      if (this.newLineItem.BLOCK_GRWT == true)
        this.isGrossWtEditable = false;
      // this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', true);
      else this.comFunc.formControlSetReadOnly('fcn_li_gross_wt', false);

    }

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
      // if (parseFloat(this.order_items_total_net_amount) > 0) {
      if (parseFloat(this.order_items_total_net_amount) != this.comFunc.emptyToZero(this.receiptTotalNetAmt)) {
        _status[0] = false;
        _status[1] = 'Invalid Received Amount';
      } else {
        _status[0] = true;
        _status[1] = 'Received Amount';
      }
      // }else{
      // alert('tot net amt -ve value')

      // }
    } else {
      _status[0] = false;
      _status[1] = 'Invalid Invoice Data';
      // alert('tot net amt 0')
    }
    return _status;
  }

  saveOrder(type?: any) {
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
      this.postRetailSalesMaster(type);
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
      data.POPKARAT_RATE = Number(data.POPKARAT_RATE);
      data.WSKARAT_RATE = Number(data.WSKARAT_RATE);
      data.VOCTYPE = this.vocType;
      data.DT_VOCTYPE = this.vocType;
      data.DT_BRANCH_CODE = this.strBranchcode;
      data.DT_VOCNO = 0;
      data.DT_YEARMONTH = this.baseYear;
      data.OT_TRANSFER_TIME = new Date();
      // new fields added - 27-12-2023
      data.ORIGINALKARAT_RATE = Number(data.POPKARAT_RATE) || 0;

    });
    console.log('================this.karatRateDetails====================');
    console.log(this.karatRateDetails);
    console.log('====================================');
  }
  saveAndContinue(type: any) {
    this.isPrintingEnabled = false;
    if (type == 'continue') {
      this.resetSalesReturnGrid()
      this.salesReturnForm.reset();
      this.lineItemForm.reset();
      this.exchangeForm.reset();
      this.customerDetailForm.reset();
      this.customerDetailForm.reset();
      this.customerDataForm.reset();
      this.ordered_items = [];
      this.sales_returns_items = [];
      this.exchange_items = [];
      this.viewOnly=false;
      this.open(this.mymodal, false, null, false, false);
      this.renderer.selectRootElement('#fcn_li_item_code')?.focus();
    }
    else {
      this.isPrintingEnabled = true;
      this.viewOnly=true;
    }
  }

  resetSalesReturnGrid() {
    this.sales_returns_items.forEach((element: any, index: any) => {
      element.sn_no = index + 1
    });
  }
  // saveAndContinue(type: any) {
  //   if (type == 'continue') {
  //     this.addNew();
  //   } else {
  //     this.close('reloadMainGrid');
  //   }
  // }
  postRetailSalesMaster(type: any) {
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
      !this.customerDataForm.invalid &&
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

      // if (this.validateSalesReturnCust()) {
      //   return;
      // }

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
            this.customerDetails.COUNTRY_CODE ||
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
          YEARMONTH: this.baseYear,
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
          "strSchemeRedeem": this.selectedSchemeIdCollection.join(","),
          "giftInfo": [
            {
              "GIFT_TYPE": this.giftReceiptForm.value.paymentsCreditGIftVoc || '',
              "GIFT_CODE": this.giftReceiptForm.value.giftVocNo || '',
              "REDEEMAMOUNTCC": this.giftReceiptForm.value.giftAmtFC || '',
              "TOTALSALESAMOUNT": this.order_items_total_net_amount.toString() || '',


              // "GIFT_TYPE": this.lineItemForm.value.fcn_li_gift_type || '',
              // "GIFT_CODE": this.giftTypeOptions.find((e: any) => e.value == this.lineItemForm.value.fcn_li_gift_type)
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
        let API = `RetailSalesDataInDotnet/UpdateRetailSalesData/${this.content.BRANCH_CODE}/${this.content.VOCTYPE}/${this.content.YEARMONTH}/${this.content.VOCNO}`
        this.suntechApi.putDynamicAPI(API, postData)
          .subscribe(
            (res) => {
              this.snackBar.dismiss();
              // try {
              if (res != null) {
                if (res.status == 'SUCCESS') {
                  this.snackBar.open('POS Updated Successfully', 'OK');
                  this.isNewButtonDisabled = false;
                  this.vocDataForm.controls['fcn_voc_no'].setValue(res.response.retailSales.VOCNO);

                  // this.close('reloadMainGrid');
                  if (this.posPlanetIssuing && this.customerDataForm.value.tourVatRefuncYN && this.customerDataForm.value.tourVatRefundNo == '') {
                    this.posPlanetFileInsert();
                    this.createPlanetPOSVoidFile(); // need to check
                  }

                  this.submitAttachment();

                  this.saveAndContinue(type);
                  let mid;
                  mid = res.response.retailSales.MID;

                  if (mid) {
                    this.AccountPosting(mid);
                  }

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
        this.suntechApi.postDynamicAPI(`RetailSalesDataInDotnet/InsertRetailSalesData`, postData).subscribe(
          (res) => {
            this.snackBar.dismiss();
            // try {
            if (res != null) {
              if (res.status == 'SUCCESS') {
                // this.close('reloadMainGrid');
                this.isNewButtonDisabled = false;

                this.vocDataForm.controls['fcn_voc_no'].setValue(res.response.retailSales.VOCNO);

                console.log('==================tourVatRefuncYN==================');
                const traNo = this.customerDataForm.value.tourVatRefundNo || '';
                console.log(this.posPlanetIssuing, this.customerDataForm.value.tourVatRefuncYN, traNo);
                console.log('====================================');
                if (this.posPlanetIssuing && this.customerDataForm.value.tourVatRefuncYN && traNo == '') { // check tourist vat refund checkbox && trno should empty

                  this.posPlanetFileInsert();

                }

                this.submitAttachment();

                this.snackBar.open('POS Saved', 'OK');
                // this.AccountPosting();

                this.saveAndContinue(type);
                // let mid;
                // mid = res.response.retailSales.MID;
                this.midForInvoce = res.response.retailSales.MID;
                // this.content.MID = res.response.retailSales.MID;
                // console.log(this.content.MID)
                if (this.midForInvoce) {
                  this.AccountPosting(this.midForInvoce);
                }

                // console.log(this.content.MID, 'middddddddddd');

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

  AccountPosting(mid: any) {
    // if (!this.content) return
    let params = {
      BRANCH_CODE: this.comFunc.nullToString(this.strBranchcode),
      VOCTYPE: this.comFunc.nullToString(this.vocDataForm.value.voc_type),
      VOCNO: this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
      YEARMONTH: this.comFunc.nullToString(this.baseYear),
      MID: mid,
      ACCUPDATEYN: 'Y',
      USERNAME: this.comFunc.userName,
      MAINVOCTYPE: this.comFunc.getqueryParamMainVocType(),
      HEADER_TABLE: this.comFunc.getqueryParamTable(),


    }

    let API = `AccountPosting/${params.BRANCH_CODE}/${params.VOCTYPE}/${params.VOCNO}/${params.YEARMONTH}/${params.MID}/${params.ACCUPDATEYN}/${params.USERNAME}/${params.MAINVOCTYPE}/${params.HEADER_TABLE}/${this.content?.FLAG === 'Edit' ? 'E' : 'A'}/${environment.app_version}/${this.remarks || 'N'}`;

    


    let Sub: Subscription = this.suntechApi.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.comFunc.toastSuccessByText(result.message || 'Posting Done')
        } else {
          this.comFunc.toastSuccessByText(result.message)
        }
      },
        (err) => this.comFunc.toastErrorByMsgId("Server Error")
      );
    // this.subscriptions.push(Sub);
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

  printReceiptDetailsWeb() {
    let _validate = this.validateBeforePrint();
    if (_validate[0] === false) {
      if (typeof _validate[1] === 'string') {
        this.snackBar.open(_validate[1], 'OK');
      } else {
        console.error('Error message is not a string:', _validate[1]);
      }
      return;
    }
    let postData = {
      "MID": this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
      "BRANCH_CODE": this.comFunc.nullToString(this.strBranchcode),
      "VOCNO": this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
      "VOCTYPE": this.comFunc.nullToString(this.vocDataForm.value.voc_type),
      "YEARMONTH": this.comFunc.nullToString(this.baseYear),
    };
    this.suntechApi.postDynamicAPI(`UspReceiptDetailsWeb`, postData)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.dynamicData;
        var WindowPrt = window.open(' ', ' ', 'width=900px, height=800px');
        if (WindowPrt === null) {
          console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
          return;
        }
        let printContent = data[0][0].HTMLOUT;
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();

        WindowPrt.onload = function () {
          if (WindowPrt && WindowPrt.document.head) {
            let styleElement = WindowPrt.document.createElement('style');
            styleElement.textContent = `
                        @page {
                            size: A5 landscape;
                        }
                        body {
                            margin: 0mm;
                        }
                    `;
            WindowPrt.document.head.appendChild(styleElement);

            setTimeout(() => {
              if (WindowPrt) {
                WindowPrt.print();
              } else {
                console.error('Print window was closed before printing could occur.');
              }
            }, 800);
          }
        };
      });
  }


  // printReceiptDetailsWeb() {
  //   let _validate = this.validateBeforePrint();
  //   if (_validate[0] === false) {
  //     if (typeof _validate[1] === 'string') {
  //       this.snackBar.open(_validate[1], 'OK');
  //     } else {
  //       console.error('Error message is not a string:', _validate[1]);
  //     }
  //     return
  //   }
  //   let postData = {
  //     "MID": this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
  //     "BRANCH_CODE": this.comFunc.nullToString(this.strBranchcode),
  //     "VOCNO": this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
  //     "VOCTYPE": this.comFunc.nullToString(this.vocDataForm.value.voc_type),
  //     "YEARMONTH": this.comFunc.nullToString(this.baseYear),
  //   }
  //   this.suntechApi.postDynamicAPI(`UspReceiptDetailsWeb`, postData)
  //     .subscribe((result: any) => {
  //       console.log(result);
  //       let data = result.dynamicData
  //       var WindowPrt = window.open(' ', ' ', 'width=' + '900px' + ', height=' + '800px');
  //       if (WindowPrt === null) {
  //         console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
  //         return;
  //       }
  //       let printContent = data[0][0].HTMLOUT;
  //       WindowPrt.document.write(printContent);

  //       WindowPrt.document.close();
  //       WindowPrt.focus();

  //       setTimeout(() => {
  //         if (WindowPrt) {
  //           WindowPrt.print();
  //         } else {
  //           console.error('Print window was closed before printing could occur.');
  //         }
  //       }, 800);
  //     })
  // }






  printInvoice() {
    let _validate = this.validateBeforePrint();
    if (_validate[0] === true) {
      const printContent = document.getElementById('print_invoice');
      if (!printContent) {
        console.error('Print content element not found');
        return;
      }

      var WindowPrt = window.open('', '_blank', 'width=300,height=600');
      if (WindowPrt === null) {
        console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
        return;
      }

      WindowPrt.document.write('<html><head><title>SunTech - POS ' + new Date().toISOString() + '</title></head>');

      const linkElement = WindowPrt.document.createElement('link');
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.setAttribute('type', 'text/css');
      linkElement.setAttribute('href', this.cssFilePath);
      WindowPrt.document.head.appendChild(linkElement);
      // WindowPrt.document.body.prepend(qrCodeElement);
      // WindowPrt.document.body.append(qrCodeElement);
      WindowPrt.document.write(printContent.innerHTML);
      // WindowPrt.document.write(qrCodeElement.outerHTML);
      WindowPrt.document.write('</div></body></html>');


      WindowPrt.document.close();
      WindowPrt.focus();

      // WindowPrt.document.write('<style>body { width: 280px; font-family: "Courier New", Courier, monospace; font-size: 12px; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 5px; text-align: left; } </style>');
      // WindowPrt.document.write('<body>');
      // WindowPrt.document.write(printContent.innerHTML);
      // WindowPrt.document.write('</body></html>');
      // WindowPrt.document.close();
      // WindowPrt.focus();

      setTimeout(() => {
        if (WindowPrt) {
          WindowPrt.print();
        } else {
          console.error('Print window was closed before printing could occur.');
        }
      }, 800);

      console.log('printing... end ');
      console.log(printContent.innerHTML);
    } else {
      if (typeof _validate[1] === 'string') {
        this.snackBar.open(_validate[1], 'OK');
      } else {
        console.error('Error message is not a string:', _validate[1]);
      }
    }
  }
  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(
      DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  clearDiscountValues() {
    this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(this.zeroAmtVal);
    this.lineItemForm.controls['fcn_li_discount_amount'].setValue(this.zeroAmtVal);
  }

  changePCS(event: any, divisionBasedAutoUpdation: boolean = false) {
    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_pcs'));
    this.isNetAmountChange = false;
    const value = this.comFunc.emptyToZero(event.target.value);

    if (this.comFunc.emptyToZero(event.target.value) == 0 && this.newLineItem.IS_BARCODED_ITEM) {
      if (!['L', 'C', 'P'].includes(this.itemDivision)) {
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1563'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls['fcn_li_pcs'].setValue(
              preVal
            );
            this.manageCalculations();
            this.renderer.selectRootElement('#fcn_li_pcs').select();
          }
        });
      }
      else {
        this.lineItemForm.controls['fcn_li_pcs'].setValue(
          event.target.value
        );
      }


    }

    else if (event.target.value != '' && this.validatePCS == true || this.enablePieces) {
      const validDivisionCodes = ['M', 'D', 'W', 'N'];
      const filteredValidationCodes = validDivisionCodes.filter((code) => code === this.newLineItem.DIVISION.toUpperCase())
      if (filteredValidationCodes.length > 0 && this.comFunc.emptyToZero(event.target.value) === 0) {

        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1560'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls['fcn_li_pcs'].setValue(
              preVal
            );
            this.lineItemForm.controls['fcn_li_gross_wt'].setValue(

              preVal
            );
            this.manageCalculations();
            this.calculateTaxAmount();
            this.calculateNetAmount();
            this.renderer.selectRootElement('#fcn_li_pcs').select();

          }
        });
      }

      // if(!this.comFunc.emptyToZero(event.target.value))
      // this.clearDiscountValues();
      this.manageCalculations();

      if (this.blockNegativeStock == 'B') {
        if (this.comFunc.emptyToZero(this.lineItemPcs) < value) {
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
              this.checkDivisionForPcs(value);
              this.manageCalculations();
              this.detectDiscountChange = true;
              this.updateDiscountAmount();
            }

          });
        } else {
          this.checkDivisionForPcs(value);
          this.manageCalculations();
          this.detectDiscountChange = true;
          this.updateDiscountAmount();
        }
      } else if (this.blockNegativeStock == 'W') {
        if (this.divisionMS != "M") {
          if (this.comFunc.emptyToZero(this.lineItemPcs) < value) {
            if (!divisionBasedAutoUpdation) {
              this.openDialog(
                'Warning',
                'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
                false
              );

              this.dialogBox.afterClosed().subscribe((data: any) => {
                if (data == 'No') {
                  // this.checkDivisionForPcs(value)
                  this.lineItemForm.controls['fcn_li_pcs'].setValue(
                    preVal
                  );
                  if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs) == 0 &&
                    this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) == 0)

                    this.renderer.selectRootElement('#fcn_li_pcs')?.select();

                  this.manageCalculations();

                  if (filteredValidationCodes.length > 0 && this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs) !== 0 &&
                  this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) !== 0)
                  this.renderer.selectRootElement('#fcn_li_net_amount')?.select();

              }else {


                  if (!['L', 'C', 'P'].includes(this.itemDivision)) {
                    this.checkDivisionForPcs(value);
                    this.manageCalculations();
                    this.detectDiscountChange = true;
                    this.updateDiscountAmount();
                    this.calculateTaxAmount();
                    this.calculateNetAmount();
                    this.lineItemCommaSeparation();
                      if (filteredValidationCodes.length > 0)
                    this.renderer.selectRootElement('#fcn_li_net_amount')?.select();

                  }


                }
              });
            }
            else {
              this.checkDivisionForPcs(value);
              this.manageCalculations();
              this.detectDiscountChange = true;
              this.updateDiscountAmount();
            }
          } else {

            // this.lineItemForm.controls['fcn_li_pcs'].setValue(
            //   this.lineItemPcs
            // );
            this.checkDivisionForPcs(value);
            this.manageCalculations();
            this.detectDiscountChange = true;
            this.updateDiscountAmount();
            this.calculateTaxAmount();
            this.calculateNetAmount();
          }
        }
        else {
          this.lineItemForm.controls['fcn_li_pcs'].setValue(
            value
          );


        }
      }
      else if (this.blockNegativeStock == 'A') {
        this.checkDivisionForPcs(value);
        this.manageCalculations();
        this.detectDiscountChange = true;
        this.updateDiscountAmount();
      }

      else {

        this.manageCalculations();
      }
    } else {
      if (this.validatePCS == true || this.enablePieces)
        this.lineItemForm.controls['fcn_li_gross_wt'].setValue(this.zeroMQtyVal);
      this.changeGrossWt({ target: { value: this.zeroMQtyVal } });


      this.manageCalculations();
    }
  }


  checkDivisionForPcs(pcs: any) {
    const validDivisionCodes = ['M', 'D', 'W', 'N'];
    const filteredValidationCodes = validDivisionCodes.filter((code) => code === this.newLineItem.DIVISION.toUpperCase())

    if (filteredValidationCodes.length > 0) {

      this.lineItemForm.controls['fcn_li_pcs'].setValue(
        // this.lineItemPcs
        pcs
      );
      this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
        // this.lineItemPcs
        pcs
      );
    }
    this.controlNetAmountReverseCalc();

  }

  checkItemCode() {

    if (!this.lineItemForm.value.fcn_li_item_code) {
      this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
        this.zeroMQtyVal
      );
      this.renderer.selectRootElement('#fcn_li_item_code').focus();
    }

  }

  changeGrossWt(event: any) {
    this.isNetAmountChange = false;
    const value = this.comFunc.emptyToZero(event.target.value);
    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_gwt'));
    this.checkItemCode();
    this.setGrossWtFocus();
    if (event.target.value != '' && this.lineItemForm.value.fcn_li_item_code) {
      if (this.comFunc.emptyToZero(event.target.value) == 0) {

        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1308'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {

            this.lineItemForm.controls.fcn_li_gross_wt.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BMQTYDECIMALS,
                preVal
              )
            );
            this.manageCalculations();
          }
        });

      }
      if (this.blockNegativeStock == 'B') {
        if (this.comFunc.emptyToZero(this.lineItemGrossWt) < value) {
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
          //   this.lineItemForm.controls['fcn_li_gross_wt'].setValue(value);
          this.manageCalculations();
        }

      } else if (this.blockNegativeStock == 'W') {
        if (this.comFunc.emptyToZero(this.lineItemGrossWt) < value) {
          this.openDialog(
            'Warning',
            'Current Stock Qty Exceeding Available Stock Qty. Do You Wish To Continue?',
            false
          );
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'No') {
              this.lineItemForm.controls['fcn_li_gross_wt'].setValue(
                preVal
              );
              // this.setNettWeight();
              this.manageCalculations();
              this.renderer.selectRootElement('#fcn_li_gross_wt')?.select();

            } else {
              // this.setNettWeight();
              this.manageCalculations();
              this.renderer.selectRootElement('#fcn_li_rate')?.select();
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

  validateMinSalePriceByTotalAmt(value: any, totalAmt: any, lsTotalAmt: any, nettAmt = null) {


    const preRateVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));
    const preTotalVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_total_amount'));
    const preNetAmtVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_net_amount'));

    const nonMetalPreRateVal = localStorage.getItem('fcn_li_rate');
    const nonMetalPreTotalVal = localStorage.getItem('fcn_li_total_amount');
    if (value != '') {

      if (this.lineItemModalForSalesReturn || this.comFunc.emptyToZero(value) >= this.comFunc.emptyToZero(this.blockMinimumPriceValue)) {

        // if (this.lineItemModalForSalesReturn || parseFloat(value) >= parseFloat(this.newLineItem.STOCK_COST)) {

        if (this.blockMinimumPrice == 'B') {
          this.lineItemForm.controls.fcn_li_rate.setValue(value);
          this.manageCalculations({ totalAmt: totalAmt, nettAmt });
          // if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
          //    this.manageCalculations();
          //   this.openDialog(
          //     'Warning',

          //     `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
          //     } `,

          //     true
          //   );
          //   this.dialogBox.afterClosed().subscribe((data: any) => {
          //     if (data == 'OK') {

          //       this.lineItemForm.controls.fcn_li_total_amount.setValue(lsTotalAmt);
          //       this.manageCalculations({ totalAmt: nonMetalPreTotalVal });
          //     }
          //   });
          // } else {
          //   this.lineItemForm.controls.fcn_li_rate.setValue(value);
          //   this.manageCalculations({ totalAmt: totalAmt, nettAmt });
          // }
        }
        else if (this.blockMinimumPrice == 'W') {
          if (this.lineItemModalForSalesReturn || parseFloat(this.blockMinimumPriceValue) >= parseFloat(value)) {
            // this.openDialog(
            //   'Warning',
            //   `${this.comFunc.getMsgByID('MSG1731')} ${this.comFunc.compCurrency} ${this.blockMinimumPriceValue
            //   }`,
            //   false
            // );
            // this.dialogBox.afterClosed().subscribe((data: any) => {
            //   if (data == 'No') {
            //     this.lineItemForm.controls.fcn_li_total_amount.setValue(
            //       lsTotalAmt
            //     );
            //     const lsNettAmt = localStorage.getItem('fcn_li_net_amount')
            //     this.manageCalculations();
            //   } else {
            //     this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
            //     this.lineItemForm.controls.fcn_li_rate.setValue(value);
            //     this.manageCalculations({ totalAmt: totalAmt, nettAmt });
            //   }
            // });
          } else {
            this.lineItemForm.controls.fcn_li_rate.setValue(value);
            this.manageCalculations({ totalAmt: totalAmt, nettAmt });
          }
        } else {
          this.lineItemForm.controls.fcn_li_rate.setValue(value);
          this.manageCalculations({ totalAmt: totalAmt, nettAmt });
        }
        this.detectDiscountChange = true;
        if (this.divisionMS != 'M')
          this.updateDiscountAmount();
      } else {

        if(this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs)==0 &&
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)==0 && this.newLineItem.DIVISION !== 'X'){
          this.lineItemForm.controls.fcn_li_total_amount.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.zeroAmtVal
            )
          );
          this.renderer.selectRootElement('#fcn_li_gross_wt').select();

        }
        // Rate Cannot be Less Than Cost
        else{
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {



            let lastDiscountPercentage = this.comFunc.emptyToZero(localStorage.getItem('discountPercentage'));
            let lastDiscountamount = this.comFunc.emptyToZero(localStorage.getItem('discountAmount'));
            this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountPercentage)
            );

            this.lineItemForm.controls.fcn_li_discount_amount.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountamount)

            );



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
              this.renderer.selectRootElement('#fcn_li_net_amount').select();
            }
            else if (this.divisionMS == 'S') {

              this.lineItemForm.controls.fcn_li_rate.setValue(
                this.comFunc.commaSeperation(nonMetalPreRateVal)

              );

              this.lineItemForm.controls.fcn_li_total_amount.setValue(
                this.comFunc.commaSeperation(nonMetalPreTotalVal)

              );
            }
          }

        });
      }
      }
    } else {
      this.lineItemForm.controls.fcn_li_rate.setValue(0);
      this.lineItemForm.controls.fcn_li_total_amount.setValue(0);
      this.manageCalculations();
    }
  }




  async validateMinSalePriceByTotalAmtFunc(bOrW: String, value: any, totalAmt: any, lsTotalAmt: any, nettAmt: any = null) {

    lsTotalAmt = this.comFunc.emptyToZero(lsTotalAmt);
    nettAmt = this.comFunc.emptyToZero(nettAmt);
    // alert('called validateMinSalePriceByTotalAmtFunc')
    console.log('validateMinSalePriceByTotalAmtFunc nettAmt', nettAmt, 'lsTotalAmt', lsTotalAmt, 'totalAmt', totalAmt);
    // alert('lsTotalAmt '+lsTotalAmt);
    this.openDialog(
      'Warning',
      // 'The rate is below to the minimum price, Do you want to Continue?',
      `${this.comFunc.getMsgByID('MSG1731')} ${this.vocDataForm.value.txtCurrency} ${this.blockMinimumPriceValue
      }`,
      bOrW == 'B' ? true : false
    );

    await this.dialogBox.afterClosed().subscribe((data: any) => {

      if (data == 'OK') {
        this.lineItemForm.controls.fcn_li_total_amount.setValue(lsTotalAmt);
        // this.manageCalculations();
        this.manageCalculations({ totalAmt: lsTotalAmt });

      }
      else if (data == 'No') {
        // document.execCommand('undo', true, null);
        this.lineItemForm.controls.fcn_li_total_amount.setValue(
          lsTotalAmt
        );
        const lsNettAmt = localStorage.getItem('fcn_li_net_amount')
        // alert('lsNettAmt'+lsNettAmt);
        // this.manageCalculations();
        this.manageCalculations({ totalAmt: lsTotalAmt });

        // this.manageCalculations({ nettAmt: lsNettAmt });
      } else {
        this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
        this.lineItemForm.controls.fcn_li_rate.setValue(value);
        this.manageCalculations({ totalAmt: totalAmt, nettAmt });
      }
    });


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
      if ((this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST) || (this.newLineItem.DIVISION === 'X'&& this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount) <= this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) &&
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_percentage) <= 100))) {
        this.manageCalculations();
        if(this.newLineItem.DIVISION === 'X'){
          this.removeValidationsForForms(this.lineItemForm, ['fcn_li_net_amount']);
        }

      }
      else {
        if(this.newLineItem.DIVISION === 'X'){

          this.openDialog('Warning', this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount) >
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
          || this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_percentage) > 100 ?
          this.comFunc.getMsgByID('MSG1203') :
          this.comFunc.getMsgByID('MSG1721'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
              preDisPerVal || this.zeroAmtVal

            );
            if (parseFloat(preDisPerVal) == 0)
              preDisAmtVal = 0;
            this.lineItemForm.controls.fcn_li_discount_amount.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, preDisAmtVal || this.zeroAmtVal)
              
            );
            this.manageCalculations();
          }
        });

        }
        else{
        // Rate Cannot be Less Than Cost
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
              preDisPerVal || this.zeroAmtVal

            );
            if (parseFloat(preDisPerVal) == 0)
              preDisAmtVal = 0;

            this.lineItemForm.controls.fcn_li_discount_amount.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, preDisAmtVal || this.zeroAmtVal)
              
            );
           
            this.manageCalculations({isDiscoutStored:true});
          }
        });
      }
      }
    }
    // }
  }


  disFunc(disAmt: any) {
    this.lineItemForm.controls.fcn_li_discount_amount.setValue(
      this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
      disAmt)
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
  changeDisPer(event: any, discountAmt = null, nettAmt = null,isDiscountAmountChange:boolean=false) {
    this.isDiscountAmountTrigger=isDiscountAmountChange ? true:false;

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
  rateFuncDetail(bOrW: String, value: any) {
    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));

    const makingAmount = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_total_amount'));

    // this.manageCalculations();
    this.openDialog(
      'Warning',
      `${this.comFunc.getMsgByID('MSG1731')} ${this.vocDataForm.value.txtCurrency} ${this.blockMinimumPriceValue
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

  async rateFunc(value: any) {
    let isAuth: any = false;
    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));
    console.log(this.blockMinimumPriceValue);
    console.log(this.blockMinimumPrice);
    if (this.blockMinimumPrice == 'B') {
      if (this.lineItemModalForSalesReturn || this.comFunc.emptyToZero(this.blockMinimumPriceValue) > this.comFunc.emptyToZero(value)) {
        if (this.userwiseDiscount) {

          this.rateFuncDetail('B', value);

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

      // this.lineItemForm.controls.fcn_li_rate.setValue(
      //   preVal
      // );
      this.manageCalculations();
      //   }

    }
  }

  storeDiscount() {
    if (this.lineItemForm.value.fcn_li_discount_percentage || this.lineItemForm.value.fcn_li_discount_amount) {
      localStorage.setItem('discountPercentage', this.lineItemForm.value.fcn_li_discount_percentage);
      localStorage.setItem('discountAmount', this.lineItemForm.value.fcn_li_discount_amount);
    }

  }



  changeRate(event: any) {
    console.log(this.comFunc.emptyToZero(event.target.value))
    this.isNetAmountChange = false;
    // this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
    //   this.zeroAmtVal

    // );
    // this.lineItemForm.controls.fcn_li_discount_amount.setValue(
    //   this.zeroAmtVal

    // );
    const karatComp22 = this.comFunc.allbranchMaster?.KARATCOMPANY22;
    const minBranchProfitPercentMetal = this.comFunc.allbranchMaster?.MINBRANCHPROFITPERCENTMETAL;

    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_rate'));
    const value = event.target.value;
    this.storeDiscount();
    // if (preVal != this.comFunc.emptyToZero(event.target.value)) {
    //   this.clearDiscount();
    // }
    if (event.target.value != '') {

      if (this.divisionMS == 'M') {

        let dblStockCost: any = this.comFunc.emptyToZero(this.newLineItem.STOCK_COST);
        let dblStockFcCost: any;
        let karatCode = this.newLineItem.KARAT_CODE;

        if (this.lineItemModalForSalesReturn || this.comFunc.emptyToZero(value) >= this.comFunc.emptyToZero(dblStockCost)) {

          this.rateFunc(value);
        }
        else {
          // Rate Cannot be Less Than Cost
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {
              this.lineItemForm.controls.fcn_li_rate.setValue(
                // ''
                preVal

              );
              let lastDiscountPercentage = this.comFunc.emptyToZero(localStorage.getItem('discountPercentage'));
              let lastDiscountamount = this.comFunc.emptyToZero(localStorage.getItem('discountAmount'));
              this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountPercentage)
              );

              this.lineItemForm.controls.fcn_li_discount_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountamount)

              );

              this.manageCalculations();

              this.renderer.selectRootElement('#fcn_li_rate').select();
            }
          });
        }
      }
      let checkStockCostVal =
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) /
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

      //Changes as per Jebraj's Input on 17/07/2024

 
      if (this.divisionMS == 'S') {
        const isPromotional = this.isPromotionalItem && this.isAllowWithoutRate && this.comFunc.emptyToZero(value) >= 0;
        const isValidValue = this.comFunc.emptyToZero(value) >= this.comFunc.emptyToZero(this.blockMinimumPriceValue) && this.newLineItem.DIVISION !== 'X';
        const isDivisionXValid = this.newLineItem.DIVISION === 'X' && this.comFunc.emptyToZero(value) > 0;

        if (isPromotional || isValidValue || isDivisionXValid) {
          this.rateFunc(value);
        }
        // if (((this.isPromotionalItem && this.isAllowWithoutRate && this.comFunc.emptyToZero(value) >= 0)) || 
        // (this.comFunc.emptyToZero(value) >= this.comFunc.emptyToZero(this.blockMinimumPriceValue) && this.newLineItem.DIVISION !== 'X') ||
        //  (this.newLineItem.DIVISION == 'X' && this.comFunc.emptyToZero(value) >= 0)) {

        //   this.rateFunc(value);
        // }
        else {
          // Rate Cannot be Less Than Cost

          if(this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs)==0 &&
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)==0 && this.newLineItem.DIVISION !== 'X'){
            this.lineItemForm.controls.fcn_li_rate.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.zeroAmtVal
              )
            );
            this.renderer.selectRootElement('#fcn_li_gross_wt').select();

          }
          else{
          this.openDialog('Warning', this.comFunc.emptyToZero(value) != 0 ? this.comFunc.getMsgByID('MSG1721') : this.comFunc.getMsgByID('MSG1723'), true);
          this.dialogBox.afterClosed().subscribe((data: any) => {
            if (data == 'OK') {

              this.lineItemForm.controls.fcn_li_rate.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS,
                  preVal
                )
              );

              let lastDiscountPercentage = this.comFunc.emptyToZero(localStorage.getItem('discountPercentage'));
              let lastDiscountamount = this.comFunc.emptyToZero(localStorage.getItem('discountAmount'));
              this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountPercentage)
              );

              this.lineItemForm.controls.fcn_li_discount_amount.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS, lastDiscountamount)

              );

              this.manageCalculations();
              this.renderer.selectRootElement('#fcn_li_rate')?.select();
              // this.lineItemForm.controls.fcn_li_net_amount.setValue(
              //   this.comFunc.transformDecimalVB(
              //     this.comFunc.allbranchMaster?.BAMTDECIMALS,
              //     preVal
              //   )
              // );
              if(this.newLineItem.DIVISION == 'X')
                this.renderer.selectRootElement('#fcn_li_rate')?.select();
            }
          });
        }
        }
      }



    } else {
      this.renderer.selectRootElement('#fcn_li_rate').select();
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(this.zeroAmtVal);
      this.lineItemForm.controls['fcn_ad_amount'].setValue(this.zeroAmtVal);
      // this.setGrossAmt();
      this.manageCalculations();
    }
  }



  changeTotalAmt(event: any, nettAmt = null) {
    this.isNetAmountChange = false;
    // this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
    //   this.zeroAmtVal

    // );
    // this.lineItemForm.controls.fcn_li_discount_amount.setValue(
    //   this.zeroAmtVal

    // );

    const totalAmtVal: any = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
    const val = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      this.comFunc.emptyToZero(event.target.value));
    const lsTotalAmt: any = localStorage.getItem('fcn_li_total_amount');
    if (lsTotalAmt != this.comFunc.emptyToZero(event.target.value)) {
      this.storeDiscount()
      // this.clearDiscount();
    }
    if (event.target.value != '') {
      const value = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        (totalAmtVal / this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt))
      );

      if ((!this.comFunc.stringToBoolean(this.isPromotionalItem)
        && !this.isAllowWithoutRate
        && this.comFunc.emptyToZero(value) === 0)) {
        // Handle the case here
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1917'), true);
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls.fcn_li_total_amount.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.lineItemForm.value.fcn_li_rate
              )
            );
            this.renderer.selectRootElement('#fcn_li_total_amount')?.select();
            // this.changeGrossFunc(totalAmt, preVal);
            // this.manageCalculations();
          }
        });

      }
      else {
        this.validateMinSalePriceByTotalAmt(
          value,
          val,
          parseFloat(lsTotalAmt),
          nettAmt
        );
        // this.manageCalculations();
      }

    } else {
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
      this.clearDiscount();
      this.manageCalculations();
    }
  }

  clearDiscount() {
    this.lineItemForm.controls.fcn_li_discount_percentage.setValue(
      this.zeroAmtVal

    );
    this.lineItemForm.controls.fcn_li_discount_amount.setValue(
      this.zeroAmtVal

    );
  }

  /** start Calculations for exchange item */
  getExchangeNwtWt(event: any) {
    const value = event.target.value;
    if (value != '' && value != 0) {
      let _exchangeGrossWt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt);
      let _exchangeStoneWt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt);
      let _exchangePureWt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight);
      let _exchangeNetWt = _exchangeGrossWt - _exchangeStoneWt;
      let _exchangeMetalRate = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_rate);
      this.exchangeForm.controls['fcn_exchange_net_wt'].setValue(
        this.comFunc.decimalQuantityFormat(
          _exchangeNetWt, 'METAL'
        )
      );
      // this.exchangeForm.controls['fcn_exchange_pcs'].setValue(
      //   "0"
      // );
      this.exchangeForm.controls['fcn_exchange_chargeable_wt'].setValue(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(event.target.value), 'METAL'
        )
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
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        // _exchangeMetalRate * _exchangeNetWt
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_rate) *
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_chargeable_wt)
      )
    );
  }

  setOzWt() {
    this.ozWeight = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BSQTYDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight || 0) /
      31.1035
    );
    return this.ozWeight;
  }
  setFocusBasedExchangeStone() {
    if (this._exchangeItemchange.INCLUDE_STONE == false) {
      // focus
      this.renderer.selectRootElement('#fcn_exchange_purity').select();
    } else {
      // focus
      this.renderer.selectRootElement('#fcn_exchange_stone_wt').select();
    }
  }

  setExchangeMakingAmt() {
    let _exchangeGrossWt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt);
    let _exchangeNetWt = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt);
    let _exchangeMakingRate = this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_rate);

    if (!this.comFunc.allbranchMaster?.MAKINGCHARGESONNET) {
      this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          _exchangeGrossWt * _exchangeMakingRate
        )
      );
      this.setExNetAmt();
    } else {
      this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          _exchangeNetWt * _exchangeMakingRate
        )
      );
      this.setExNetAmt();
    }
    this.setExNetAmt();
  }
  changeStoneRate(event: any) {
    this.isNetAmountChange = false;
    if (event.target.value != '') {
      // this.setStoneAmt();
      this.manageCalculations();
    } else {
      this.lineItemForm.controls.fcn_ad_stone_rate.setValue(this.zeroAmtVal);
      // this.setStoneAmt();
      this.manageCalculations();
    }
  }
  changeExPurity(event: any) {
    // alert('called')
    // && this.comFunc.enforceMinMax(event.target)
    const value = event.target.value;
    // this.exchangeForm.controls.fcn_exchange_purity.setValue(
    //   this.comFunc.decimalQuantityFormat(value, 'PURITY')
    // );
    if (value != '') {
      if (value <= this._exchangeItemchange?.PURITY_FROM) {
        // this.exchangeForm.controls.fcn_exchange_purity.setValue(event.target.min);
        this.exchangeForm.controls.fcn_exchange_purity.setValue(
          this.comFunc.decimalQuantityFormat(this.standardPurity, 'PURITY')
          // this.standardPurity
        );
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1696'), true);
      }
      else if (value >= this._exchangeItemchange?.PURITY_TO) {
        this.openDialog('Warning', this.comFunc.getMsgByID('MSG1699'), true);
        this.exchangeForm.controls.fcn_exchange_purity.setValue(
          // this.standardPurity
          this.comFunc.decimalQuantityFormat(this.standardPurity, 'PURITY')

        );
      } else {
        this.exchangeForm.controls.fcn_exchange_purity.setValue(
          this.comFunc.decimalQuantityFormat(value, 'PURITY')
        );
      }
      this.setExchangePureWt();
      this.setExPurityDiff();
      this.setExMetalAmt();
    } else {
      this.exchangeForm.controls.fcn_exchange_purity.setValue(
        // this.standardPurity
        this.comFunc.decimalQuantityFormat(this.standardPurity, 'PURITY')
      );
      this.setExchangePureWt();
      this.setExPurityDiff();
      this.setExMetalAmt();
    }
  }
  changeExStoneAmount(event: any) {
    const value = event.target.value;

    if (event.target.value != '') {

      const res = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(value) /
        this.comFunc.emptyToZero(
          this.exchangeForm.value.fcn_exchange_stone_wt
        )
      );

      this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(res);
      this.setExNetAmt();


    } else {
      const value = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        0
      );
      this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(value);
      this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(value);
      this.setExNetAmt();
    }
  }
  changeExchangeStoneRate(event: any) {
    const value = event.target.value;
    if (event.target.value != '') {
      const res = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(
          this.exchangeForm.value.fcn_exchange_stone_wt
        ) * this.comFunc.emptyToZero(value)
      );
      this.setExStoneAmt();
      this.setExNetAmt();
    } else {
      const value = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        0
      );
      this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(value);
      this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(value);
      this.setExNetAmt();
    }
  }
  setExStoneAmt() {
    const res = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt) *
      this.comFunc.emptyToZero(
        this.exchangeForm.value.fcn_exchange_stone_rate
      )
    );
    this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(res);
  }

  changeExchangeMetalAmt(event: any) {
    if (event.target.value != '') {


      let allowedMetalRate = this.exchangeForm.value.fcn_exchange_chargeable_wt * this.exchangeForm.value.fcn_exchange_metal_rate;
      // this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
      //   this.comFunc.transformDecimalVB(
      //     this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //     this.comFunc.emptyToZero(event.target.value)
      //   )
      // );

      if (this.exchangeForm.value.fcn_exchange_metal_amount > allowedMetalRate) {

        const baseMessage = this.comFunc.getMsgByID('MSG2203');
        this.openDialog(
          'Warning',
          `${baseMessage}: ${allowedMetalRate}`,
          true
        );

        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(allowedMetalRate)
              )
            );
          }

        });
      } else {

        this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(event.target.value)
          )
        );

        const value =

          this.comFunc.decimalQuantityFormat(
            this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_amount) /
            this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt)
            , 'METAL_RATE')


        this.exchangeForm.controls.fcn_exchange_metal_rate.setValue(value);
        this.setExNetAmt();
      }

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
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_metal_amount || 0) +
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_amt || 0) +
        this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_amount || 0)
      )
    );
    this.setExchangeCommaSep();
  }
  setExchangeCommaSep() {

    this.exchangeForm.controls.fcn_exchange_gross_wt.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt), 'METAL'))
    );
    this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt),
          'STONE')
      )
    );
    this.exchangeForm.controls.fcn_exchange_net_wt.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt),
          'METAL')));
    this.exchangeForm.controls.fcn_exchange_chargeable_wt.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_chargeable_wt),
          'METAL')));
    this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight),
          'METAL')));
    this.exchangeForm.controls.fcn_exchange_purity_diff.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.decimalQuantityFormat(
          this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_purity_diff),
          'METAL')));
    this.exchangeForm.controls.fcn_exchange_stone_rate.setValue(
      this.comFunc.commaSeperation(this.exchangeForm.value.fcn_exchange_stone_rate ?? this.zeroAmtVal)
    );
    this.exchangeForm.controls.fcn_exchange_stone_amount.setValue(
      this.comFunc.commaSeperation(this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_amount)) ?? this.zeroAmtVal)
    );
    this.exchangeForm.controls.fcn_exchange_making_rate.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_making_rate)))
    );
    this.exchangeForm.controls.fcn_exchange_making_amt.setValue(
      this.comFunc.commaSeperation(this.exchangeForm.value.fcn_exchange_making_amt ?? this.zeroAmtVal)
    );
    this.exchangeForm.controls.fcn_exchange_metal_amount.setValue(
      this.comFunc.commaSeperation(this.exchangeForm.value.fcn_exchange_metal_amount ?? this.zeroAmtVal)
    );
    this.exchangeForm.controls.fcn_exchange_net_amount.setValue(
      this.comFunc.commaSeperation(this.exchangeForm.value.fcn_exchange_net_amount ?? this.zeroAmtVal)
    );
  }
  changeExchangeNettWt(event: any) {
    if (event.target.value != '') {
      this.setExchangeStoneWt();
      this.setExchangePureWt();
      this.setExchangeMakingAmt();
      this.setExStoneAmt();

      this.setExMetalAmt();

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

      this.setExchangeMakingAmt();
      this.setExMetalAmt();

      this.setExNetAmt();


    } else {
      this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(
        this.zeroSQtyVal
      );
    }
  }

  setExchangeStoneWt() {
    const stoneWt = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt) -
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt)
    );
    this.exchangeForm.controls.fcn_exchange_stone_wt.setValue(stoneWt);
  }
  setExchangeNettWt() {
    const stoneWt = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_gross_wt) -
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_stone_wt)
    );
    this.exchangeForm.controls.fcn_exchange_net_wt.setValue(stoneWt);
    this.setExPurityDiff();

  }
  setExchangePureWt() {
    const value = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt) *
      parseFloat(this.exchangeForm.value.fcn_exchange_purity)
    );
    this.exchangeForm.controls.fcn_exchange_pure_weight.setValue(value);
    this.setExPurityDiff();
  }
  setExPurityDiff() {
    const standardValue = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_net_wt) * parseFloat(this.standardPurity)
    );
    // console.log('')
    const pureWeight = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BMQTYDECIMALS,
      parseFloat(standardValue) -
      this.comFunc.emptyToZero(this.exchangeForm.value.fcn_exchange_pure_weight)
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
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) /
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt);

    if (name == 'fcn_li_net_amount') {
      if (this.divisionMS == 'M') {

        if (
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount) >
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount)
        ) {
          localStorage.setItem(name, event.target.value.toString());

        }
      }
      if (this.divisionMS == 'S') {

        if (this.lineItemModalForSalesReturn || checkStockCostVal >= parseFloat(this.newLineItem.STOCK_COST)) {
          localStorage.setItem(name, event.target.value.toString());

        }
      }

    } else if (name == 'fcn_li_discount_percentage' || name == 'fcn_li_discount_amount') {
      const disPerVal = this.lineItemForm.value.fcn_li_discount_percentage;
      if (disPerVal != null && disPerVal != '') {
        localStorage.setItem('fcn_li_discount_percentage', disPerVal.toString());
        localStorage.setItem('fcn_li_discount_amount', this.lineItemForm.value.fcn_li_discount_amount.toString());
      }
    }
    else {
      localStorage.setItem(name, event.target.value.toString());
    }

  }

  changeVocNumber(vocNum: any) {
    if (this.comFunc.emptyToZero(vocNum.target.value) == 0) {
      const warning = "Voucher number cannot be 0"
      this.openDialog('Warning', warning, true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.vocDataForm.controls.fcn_voc_no.setValue(
            localStorage.getItem('voucherNumber')
          );
          this.manageCalculations();
        }
      });
    }
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

  changeGrossAmt(event: any) {
    this.isNetAmountChange = false;
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
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
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

  netAmtFunc(event: any) {

    this.lineItemForm.value.fcn_li_discount_percentage



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
    let grossAmount = '';

    if (this.divisionMS == 'M') {
      totalAmt = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        parseFloat(grossAmt) -
        (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount || 0) +
          this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount || 0))
      );
    } else {
      grossAmount = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
      );
      totalAmt = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)
      );
    }

    // let discountAmt =  this.comFunc.transformDecimalVB(
    //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
    //   parseFloat(grossAmount)-parseFloat(totalAmt)
    //   // parseFloat(totalAmt) - parseFloat(grossAmt)
    // );


    if(this.newLineItem.DIVISION !== 'X'){
    this.lineItemForm.controls.fcn_li_tax_amount.setValue(taxAmt);  //1047
    this.lineItemForm.controls.fcn_li_gross_amount.setValue(grossAmt);
    this.lineItemForm.controls.fcn_li_total_amount.setValue(totalAmt);
    // this.lineItemForm.controls.fcn_li_rate.setValue(totalAmt);

    let discountAmt = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      parseFloat(totalAmt) - parseFloat(grossAmt)
      // parseFloat(totalAmt) - parseFloat(grossAmt)
    );





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
        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
        discountAmt)
      );
      this.changeDisAmount(
        { target: { value: discountAmt } },
        this.lineItemForm.value.fcn_li_net_amount
      );

    }
    }
    else{
      this.lineItemForm.controls.fcn_li_tax_amount.setValue(taxAmt);  
      this.lineItemForm.controls.fcn_li_gross_amount.setValue(grossAmt);
      this.lineItemForm.controls.fcn_li_total_amount.setValue(grossAmt);
      this.lineItemForm.controls.fcn_li_rate.setValue(grossAmt);
      this.clearDiscountValues();
    }
    let inputAmount = parseFloat(event.target.value?.replace(/,/g, '') || '0');
    let grossAmtValue = parseFloat(localStorage.getItem('fcn_li_net_amount')?.replace(/,/g, '') || '0');
    if (inputAmount > grossAmtValue) {
      // this.lineItemForm.controls.fcn_li_total_amount.setValue(this.lineItemForm.value.fcn_li_gross_amount);

      // this.lineItemForm.controls.fcn_li_total_amount.setValue(this.comFunc.commaSeperation(this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) -
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) + this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount))))

      // this.lineItemForm.controls.fcn_li_rate.setValue(this.comFunc.commaSeperation(this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) /
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)))
      // )
      // this.lineItemForm.controls.fcn_li_rate.setValue(this.lineItemForm.value.fcn_li_gross_amount);

      // this.lineItemForm.controls.fcn_li_discount_amount.setValue(this.zeroAmtVal);
      // this.lineItemForm.controls.fcn_li_discount_percentage.setValue(this.zeroAmtVal);
    }
  }

  controlNetAmountReverseCalc() {
    if (this.enablePieces && this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) == 0 && this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_pcs) == 0) {
      this.isRevCalculationBlock = true;
    }
    else {
      this.isRevCalculationBlock = false;
    }
  }

  async changeNettAmt(event: any) {
    const preVal = this.comFunc.emptyToZero(localStorage.getItem('fcn_li_net_amount'));
    const netAmtVal = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_amount);


    const permittedNetAmount = netAmtVal - (this.lineItemForm.value.fcn_li_tax_percentage / 100) * netAmtVal;

    if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) <= permittedNetAmount && this.divisionMS == 'S' && this.newLineItem.DIVISION !== 'X') {



      this.openDialog('Warning', this.comFunc.getMsgByID('MSG1443'), true);
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
          this.manageCalculations();
        }
      });
    }

    else {

      if (!this.isRevCalculationBlock) {
        this.isNetAmountChange = true;




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
              this.openDialog('Warning', this.comFunc.getMsgByID('MSG1914'), true);
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

            if (this.lineItemModalForSalesReturn || checkStockCostVal >= this.comFunc.emptyToZero(this.newLineItem.STOCK_COST)) {
              this.netAmtFunc(event);
            } else {
              // Rate Cannot be Less Than Cost
              this.openDialog('Warning', this.comFunc.getMsgByID('MSG1721'), true);
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
    }
  }

  changeDisAmount(event: any, nettAmt: any = null) {
    this.isDiscountAmountTrigger=true;
    const preDisAmtVal =
      this.comFunc.decimalQuantityFormat(
        this.comFunc.emptyToZero(localStorage.getItem('fcn_li_discount_amount')),
        'AMOUNT')

    if (event.target.value != '') {
      const value =

        this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount) /
            this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount)) *
          100
        );

      this.lineItemForm.controls.fcn_li_discount_percentage.setValue(value);

      this.changeDisPer({ target: { value: value } }, event.target.value, nettAmt,true);

    } else {
      this.lineItemForm.controls['fcn_li_total_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_ad_amount'].setValue(0.0);
      this.lineItemForm.controls['fcn_li_discount_percentage'].setValue(0.0);

      this.manageCalculations();
    }
  }
  manageCalculations(
    argsData: any = { totalAmt: null, nettAmt: null, disAmt: null,isDiscoutStored:false }
  ) {
    console.log('====================================');
    console.log('manageCalculations', argsData);
    console.log('====================================');

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
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) // pure weight changed at 18/3/2024
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
            console.log('GROSS',
              this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt),
              this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_rate)
            );

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
    // const mkgvalue = (
    //   this.lineItemForm.value.fcn_li_rate *
    //   this.lineItemForm.value.fcn_li_gross_wt
    // ).toFixed(2);

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



    this.isNetAmountChange ? localStorage.setItem('fcn_li_rate', ((this.lineItemForm.value.fcn_li_total_amount / this.lineItemForm.value.fcn_li_gross_wt).toString())) :
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

        this.setGrossAmount();

        


        // this.lineItemForm.controls['fcn_li_gross_amount'].setValue(

        //   this.comFunc.transformDecimalVB(
        //     this.comFunc.allbranchMaster?.BAMTDECIMALS,
        //     this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount) -
        //     this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount)
        //   )

        // );
      }
    }

    if (argsData.nettAmt == null) {

      this.calculateTaxAmount();
      this.calculateNetAmount();
      /** set tax amount */
      // let taxAmount;
      // taxAmount = this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //   this.getPercentage(
      //     this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage),
      //     this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount)
      //   )
      // );
      // this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
      //   // Math.round(parseFloat(value)).toFixed(2)
      //   this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, taxAmount)
      // );
      // this.li_tax_amount_val = this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //   taxAmount
      // );

      // const netAmtValue =
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount) +
      //   this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);

      // this.li_net_amount_val = this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //   netAmtValue
      // );
      // this.lineItemForm.controls['fcn_li_net_amount'].setValue(
      //   this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, netAmtValue)
      // );

      // localStorage.setItem('fcn_li_net_amount', netAmtValue.toString());


    } else {

      // taxAmount = this.lineItemForm.value.fcn_li_tax_amount;
    }
    if (this.divisionMS != "M") {
      if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_percentage))
        this.detectDiscountChange =this.isDiscountAmountTrigger?false: true;
        !argsData.isDiscoutStored ? this.updateDiscountAmount() : null;

      this.calculateTaxAmount();
      if(!this.isNetAmountChange)
        this.calculateNetAmount();
    }
    this.lineItemCommaSeparation();

  }


  calculateTaxAmount() {
    const taxPercentage = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_percentage);
    const grossAmount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount);

    const taxAmount = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      this.getPercentage(taxPercentage, grossAmount)
    );

    this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
      this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, taxAmount)
    );

    this.li_tax_amount_val = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      taxAmount
    );
  }


  calculateNetAmount() {
    const grossAmount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_amount);
    const taxAmount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_tax_amount);

    const netAmtValue = grossAmount + taxAmount;

    this.lineItemForm.controls['fcn_li_net_amount'].setValue(
      this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, netAmtValue)
    );

    this.li_net_amount_val = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      netAmtValue
    );

    localStorage.setItem('fcn_li_net_amount', netAmtValue.toString());
  }


  setGrossAmount() {
    const totalAmount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_total_amount);
    const discountAmount = this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_amount);

    const grossAmount = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      totalAmount - discountAmount
    );

    this.lineItemForm.controls['fcn_li_gross_amount'].setValue(this.comFunc.commaSeperation(grossAmount));
    // this.calculateTaxAmount();
    // this.calculateNetAmount();
  }
  lineItemCommaSeparation() {
    this.isNetAmountChange ? this.lineItemForm.controls['fcn_li_rate'].setValue(
      this.comFunc.commaSeperation(this.comFunc
        .transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(((this.lineItemForm.value.fcn_li_total_amount / this.lineItemForm.value.fcn_li_gross_wt)))))
    ) : this.lineItemForm.controls['fcn_li_rate'].setValue(
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
      this.comFunc.decimalQuantityFormat(
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_percentage),
        'AMOUNT') || this.zeroAmtVal

    );
    // if (this.divisionMS != "M") {
    //   if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_discount_percentage))
    //     this.detectDiscountChange = true;
    //   this.updateDiscountAmount();
    //   this.calculateTaxAmount();
    //   this.calculateNetAmount();
    // }


    this.lineItemForm.controls['fcn_li_tax_amount'].setValue(
      this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_tax_amount)
    );
    this.lineItemForm.controls['fcn_li_net_amount'].setValue(
      this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_net_amount)
    );

  }

  updateDiscountAmount(): void {
    if (this.detectDiscountChange) {
      const totalAmountString = this.lineItemForm.value.fcn_li_total_amount.replace(/,/g, '');
      const discountPercentageString = this.lineItemForm.value.fcn_li_discount_percentage.toString();

      const totalAmount = parseFloat(totalAmountString);
      const discountPercentage = parseFloat(discountPercentageString);

      const discountAmount = (totalAmount * (discountPercentage / 100)).toFixed(2);

      this.lineItemForm.controls['fcn_li_discount_amount'].setValue(
        this.comFunc.commaSeperation(discountAmount) || this.zeroAmtVal
      );
      this.setGrossAmount();
      this.detectDiscountChange = false;
    } else {
      this.lineItemForm.controls['fcn_li_discount_amount'].setValue(
        this.comFunc.commaSeperation(this.lineItemForm.value.fcn_li_discount_amount) || this.zeroAmtVal
      );
    }
  }

  setNettWeight() {
    this.lineItemForm.controls['fcn_li_net_wt'].setValue(
      (
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) -
        this.comFunc.emptyToZero(
          this.lineItemForm.value.fcn_li_stone_wt
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
    console.log('value', value);
    const nettAmt = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS,
      value
    );
    this.lineItemForm.controls['fcn_li_net_amount'].setValue(nettAmt);
    // this.order_items_total_gross_amount = value;
    this.li_net_amount_val = nettAmt;


  }
  setPurityWeight() {
    this.lineItemForm.controls.fcn_li_pure_wt.setValue(
      (
        this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_net_wt) *
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
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
      this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)
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
  setMetalRate(karatCode: any,screen:any) {
    const exchangeMetalRate: any = this.karatRateDetails.filter(
      (data: any) => data.KARAT_CODE == karatCode
    )[0].POPKARAT_RATE;

    const salesMetalRate: any = this.karatRateDetails.filter(
      (data: any) => data.KARAT_CODE == karatCode
    )[0].KARAT_RATE;

    if (screen === "sales") {
      this.lineItemForm.controls['fcn_ad_metal_rate'].setValue(
        this.comFunc.decimalQuantityFormat(salesMetalRate, 'METAL_RATE')
      );
    } else {
      this.exchangeForm.controls['fcn_exchange_metal_rate'].setValue(
        this.comFunc.decimalQuantityFormat(exchangeMetalRate, 'METAL_RATE')
      );
      this._exchangeItemchange.METAL_RATE_PERGMS_ITEMKARAT = exchangeMetalRate;
    }
    
    
  }
  changeStoneWt(event: any) {
    this.isNetAmountChange = false;
    const value = event.target.value;
    // alert(value + '_' + this.lineItemForm.value.fcn_li_gross_wt);
    if (value != '') {
      if (
        this.comFunc.emptyToZero(value) > this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt)
      ) {
        this.openDialog(
          'Warning',
          'Stone weight cannot be exceeded Gross weight',
          true
        );
        // this.stoneWtPreVal = 0;

        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.lineItemForm.controls['fcn_li_stone_wt'].setValue(this.zeroSQtyVal);
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
      this.lineItemForm.controls.fcn_li_stone_wt.setValue(this.zeroSQtyVal);
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
    this.isNetAmountChange = false;
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
    this.isNetAmountChange = false;
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
  setDetailsData() {
    if (this.retailSalesDataPost.RetailDetails.length > 0)
      this.retailSalesDataPost.RetailDetails.forEach((data: any) => {
        data.DTSALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
        data.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
      }

      );
    if (this.metalPurchaseDataPost != null && this.metalPurchaseDataPost != '') {
      this.metalPurchaseDataPost.SALESPERSON_CODE = this.vocDataForm.value.sales_person || '';
      this.metalPurchaseDataPost.SALESPERSON_NAME = this.salespersonDescName || '';
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
      VOCTYPE: this.vocType,
      // VOCTYPE: this.vocType,
      VOCNO: this.retailSaleDataVocNo,
      VOCDATE: this.convertDateWithTimeZero(
        new Date(this.vocDataForm.value.vocdate).toISOString()
      ),
      YEARMONTH: this.baseYear,
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
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.order_items_total_amount)
      ),
      TOTAL_MKGVALUE_CC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.CCToFC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.order_items_total_amount), this.vocDataForm.value.txtCurRate
        )
      ),
      TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.prnt_inv_total_metal_amt)
      ),
      TOTAL_METALVALUE_CC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.CCToFC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.prnt_inv_total_metal_amt), this.vocDataForm.value.txtCurRate
        )
      ),
      TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.prnt_inv_total_stone_amt
      ),
      TOTAL_STONEVALUE_CC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.CCToFC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.prnt_inv_total_stone_amt), this.vocDataForm.value.txtCurRate
        )
      ),
      TOTAL_PUDIFF: 0, //need_input
      TOTAL_STONEDIFF: 0, //need_input
      TOTAL_DISCVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.prnt_inv_total_dis_amt
      ), //need_input
      TOTAL_DISCVALUE_CC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.CCToFC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.prnt_inv_total_dis_amt), this.vocDataForm.value.txtCurRate
        )
      ), //need_input
      NETVALUE_FC: this.order_items_total_gross_amount,
      NETVALUE_CC: this.order_items_total_gross_amount,
      // SYSTEM_DATE: , // need_input // check in api -
      SYSTEM_DATE: new Date().toISOString(), // need_input // check in api -
      // SYSTEM_DATE: this.dummyDate , // need_input // check in api -
      SRETURNMID: 0, //need
      SRETURNVOCNO: 0, //need
      SRETURNVOCTYPE: '',
      SRETURN_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.invReturnSalesTotalNetTotal
      ), //need
      SRETURN_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal), this.vocDataForm.value.txtCurRate
      ), //need
      PURCHASEMID: 0, //need
      PURCHASEVOCNO: 0, //need
      PURCHASEVOCTYPE: '',
      PURCHASE_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.order_total_exchange
      ), //need
      PURCHASE_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.order_total_exchange), this.vocDataForm.value.txtCurRate
      ), //need
      ADJUST_ADVANCE: 0, //need
      DISCOUNT: this.order_items_total_discount_amount || this.zeroAmtVal, // need_input
      SUBTOTAL: 0,
      // this.order_items_total_gross_amount,
      NETTOTAL: this.comFunc.emptyToZero(this.receiptTotalNetAmt),
      RECEIPT_TOTAL: this.comFunc.emptyToZero(this.receiptTotalNetAmt),
      // this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //   this.comFunc.CCToFC(
      //     this.vocDataForm.value.txtCurrency,
      //     this.comFunc.emptyToZero(this.receiptTotalNetAmt),
      //   )
      // ),
      // this.receiptTotalNetAmt, //need_input
      REFUND: 0,
      NAVSEQNO: 0, //need
      MOBILE: this.customerDataForm.value.fcn_customer_mobile,
      POBOX: this.customerDetails?.POBOX_NO || '',
      EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
      REMARKS: '', //need_input
      POSCUSTCODE: this.customerDetails?.CODE || '',
      ITEM_CURRENCY: this.vocDataForm.value.txtCurrency,
      ITEM_CURR_RATE: this.vocDataForm.value.txtCurRate || 1,
      ADJUST_ADVANCECC: 0,
      DISCOUNTCC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.CCToFC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.order_items_total_discount_amount), this.vocDataForm.value.txtCurRate
        ),
      ),
      // need_input
      SUBTOTALCC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.order_items_total_gross_amount), this.vocDataForm.value.txtCurRate
      ),
      NETTOTALCC: this.comFunc.emptyToZero(this.receiptTotalNetAmt),
      //  this.comFunc.CCToFC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.comFunc.emptyToZero(this.order_items_total_gross_amount), this.vocDataForm.value.txtCurRate
      // ),
      RECEIPT_TOTALCC: this.comFunc.emptyToZero(this.receiptTotalNetAmt),
      REFUNDCC: 0,
      // PENDING: 1,
      POSDETAILS: '',
      CREDITAC: '',
      // DELIVERYDATE: this.dummyDate, //need
      ORDERMID: 0, //need
      FLAG_UPDATED: 'N',
      FLAG_INPROCESS: 'N',
      NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
        //  || this.customerDetails?.NATIONALITY
        || '',
      TYPE: this.customerDetails?.TYPE || '',
      // ORDEREXEDATE: this.dummyDate, //need
      FLAG_EDIT_ALLOW: 'Y',
      D2DTRANSFER: 'F',
      // RSCUSTIDNO: this.customerDetails?.CODE || '',
      POSKnownAbout: this.customerDetails?.POSKnownAbout || 0,

      // etc fields
      RS_FIXED: false, //need
      SALESREFERENCE: `${this.salesReturnForm.value.fcn_returns_branch.toUpperCase()}-${this.salesReturnForm.value.fcn_returns_voc_type}-${this.salesReturnVocNumber}-${this.baseYear}`,
      TRANS_CODES: '',
      CONSIGNMENTPARTY: '',
      TOTALVAT_AMOUNTFC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.order_items_total_tax
      ),
      TOTALVAT_AMOUNTLC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.order_items_total_tax, this.vocDataForm.value.txtCurRate
      ),
      RSSTATE: '',
      SALESFIXINGMID: '0',
      SALESFIXINGREF: '',
      REDEMPTIONTOTALVALUECC: 0,
      GSTVATAMOUNTFC: this.comFunc.emptyToZero(this.order_items_total_tax),
      // this.comFunc.FCToCC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.order_items_total_tax, this.vocDataForm.value.txtCurRate
      // ),
      GSTVATAMOUNTCC: this.comFunc.emptyToZero(this.order_items_total_tax),
      // this.comFunc.FCToCC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.order_items_total_tax, this.vocDataForm.value.txtCurRate
      // ),
      CCPOSTINGDONE: '0',
      BALANCE_FC: 0, //need
      BALANCE_CC: 0, //need
      LOCALREMARKSNEW: '',
      MACHINEID: '',
      AUTOPOSTING: this.isAutoPosting,
      POSTDATE: this.dummyDate, //need
      INVREF: '0',
      SCHEMESALESFIXINGPUREWT: 0,
      BLOCKPSRIMPORT: false,
      INCLUDEVAT: false,
      WAYBILLNO: '',
      // WAYBILLDATE: this.dummyDate, //need
      HTUSERNAME: this.strUser,
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
      // CALCULATE_LOYALTY: true,
      TRAYN: this.customerDataForm.value.tourVatRefuncYN || false,
      TRANO: this.customerDataForm.value.tourVatRefundNo || '',
      POSReferenceRepairInvoice: '',
      RSLOGINMID: '0',
      TRAYNREFUND: false,
      // TRAYNREFUNDDATE: this.dummyDate, //need
      SERVICE_INVOICE: this.invoiceWiseForm.value.serviceInv || false,
      GJVREFERENCE: '',
      GJVMID: 0, //need
      holdbarcode: false,
      PROMO_CODE: '',
      VATAMOUNTFCROUND: this.comFunc.emptyToZero(this.vatRoundOffAmt),
      VATAMOUNTFCROUNDCC:
        this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.vatRoundOffAmt), this.vocDataForm.value.txtCurRate
        ),
      LIFETIMEWARRANTY: this.invoiceWiseForm.value.lifeTimeWarr || false,
      // SALESORDER_VALIDITYDATE: this.dummyDate, //need
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
      // BOARDINGDATE: this.boardingPassForm.value.boardingDate || this.dummyDate, //need
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
        this.customerDetails.COUNTRY_CODE ||
        // this.customerDetails?.COUNTRY_CODE ||
        '',
      CUST_Language: this.customerDetails?.CUST_Language || '',
      PRINT_COUNT: 0,
      GST_TOTALFC: 0,
      GST_TOTALCC: 0,
      GST_STATE_CODE: '',
      PANNO: this.customerDetails.PANCARDNO,
      GST_NUMBER: '',
      TRA_ID_TYPE: '',
      POSCUSTIDNO: this.customerDetails.POSCUSTIDNO,
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
      POSCUSTIDEXP_DATE: this.customerDataForm.value.fcn_customer_exp_date,
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
      YEARMONTH: this.baseYear,
      PARTYCODE: this.comFunc.basePartyCode,
      PARTY_CURRENCY: this.comFunc.compCurrency,
      PARTY_CURR_RATE: 1,
      ITEM_CURRENCY: this.vocDataForm.value.txtCurrency,
      ITEM_CURR_RATE: this.vocDataForm.value.txtCurRate || 1,
      VALUE_DATE: this.vocDataForm.value.vocdate,
      SALESPERSON_CODE: this.vocDataForm.value.sales_person, //need
      RATE_TYPE: this.newLineItem.RATE_TYPE,
      METAL_RATE: this.newLineItem.METAL_RATE,
      FIXED: 1,
      TOTAL_PCS: this.comFunc.emptyToZero(this.invMetalPurchaseTotalPcs),
      TOTAL_GRWT: this.comFunc.emptyToZero(
        this.invMetalPurchaseTotalGrossWeight
      ),
      TOTAL_PUWT: this.comFunc.emptyToZero(
        this.invMetalPurchaseTotalPureWeight
      ),

      TOTAL_MKGVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalMakingAmt)
      ),
      TOTAL_MKGVALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalMakingAmt), this.vocDataForm.value.txtCurRate
      ),
      // TOTAL_MKGVALUE_FC: this.comFunc.emptyToZero(
      //   this.order_total_exchange
      // ),
      // TOTAL_MKGVALUE_CC: this.comFunc.FCToCC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.order_total_exchange)
      // ),
      TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalMetalAmt)
      ),
      TOTAL_METALVALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalMetalAmt), this.vocDataForm.value.txtCurRate
      ),
      TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.invMetalPurchaseTotalStoneAmt
      ),
      TOTAL_STONEVALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalStoneAmt), this.vocDataForm.value.txtCurRate
      ),
      TOTAL_PUDIFF: this.comFunc.emptyToZero(
        this.invMetalPurchaseTotalPurityDiff
      ), //need
      TOTAL_STONEDIFF: 0, //need_input
      ITEM_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
      ), //need_input,
      ITEM_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt), this.vocDataForm.value.txtCurRate
      ), //need_input
      PARTY_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
      ), //need_input
      PARTY_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt), this.vocDataForm.value.txtCurRate
      ), //need_input
      NET_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
      ),
      NET_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt), this.vocDataForm.value.txtCurRate
      ),
      ADDL_VALUE_FC: 0,
      ADDL_VALUE_CC: 0,
      GROSS_VALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt)
      ),
      GROSS_VALUE_CC: this.comFunc.FCToCC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invMetalPurchaseTotalNetAmt), this.vocDataForm.value.txtCurRate
      ), //need_input
      REMARKS: `Metal Purchase Ref :POS-${this.vocDataForm.value.fcn_voc_no}`,
      FLAG_EDIT_ALLOW: 'N',
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
      HHACCOUNT_HEAD: this.accountHeadDetails ? this.accountHeadDetails : '',
      OUSTATUS: true,
      OUSTATUSNEW: 1, //need_input
      CURRRECMID: 0, //NEED_INPUT
      CURRRECVOCTYPE: '', //NEED_INPUT
      CURRRECREF: '', //need_input
      CURRRECAMOUNTFC: 0,
      CURRRECAMOUNTCC: 0,
      TOTAL_DISCOUNTWT: 0, //need_input
      CUSTOMER_NAME: this.customerDataForm.value.fcn_customer_name || '', //need_input
      MACHINEID: '', //need_input
      AUTOPOSTING: this.isAutoPosting,
      AUTHORIZEDPOSTING: true,
      CANCELLEDPOSTING: false,
      PURITYQUALITYCHECK: false,
      CREDITDAY: 0,
      POSTDATE: this.vocDataForm.value.vocdate, //need
      SALESPERSON_NAME: '',
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
      POSCUSTIDNO: this.customerDetails.POSCUSTIDNO,
      HVAT_AMOUNT_CC: 0,
      HVAT_AMOUNT_FC: 0,
      HTOTALAMOUNTWITHVAT_CC: 0,
      HTOTALAMOUNTWITHVAT_FC: 0,
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
      CUSTOMER_ADDRESS: '',
      // this.customerDetailForm.value.fcn_cust_detail_address || '',
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
      'CUSTOMER_MOBILE': this.customerDataForm.value.fcn_customer_mobile,
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
      'AIRWAY_BILLDATE': this.vocDataForm.value.vocdate,
      'AIRWAY_WEIGHT': '0.000',
      'ARIVAL_DATE': this.vocDataForm.value.vocdate,
      'CLEARENCE_DATE': this.vocDataForm.value.vocdate,
      'BOE_FILLINGDATE': this.vocDataForm.value.vocdate,
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
      "EXCLUDE_VAT": false,
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
      "PARTYTRANSWISE_METALVATONMAKING": false,
      "PLACEOFSUPPLY": "",
      "POSPRICESFIXED": false,
      "SHIPMENTCOMPANY": "",
      "SHIPMENTPORT": "",
      "TAX_APPLICABLE": false,
      "TRANSFER_BRANCH": "",
      "VATAMOUNTFCROUND": 0,
      "VATAMOUNTFCROUNDCC": 0,
      "POSCUSTIDEXP_DATE": this.customerDetails.POSCUSTIDEXP_DATE,

      metalPurchaseDetails: this.currentExchangeMetalPurchase,

    };
  }
  setSalesReturnDetailsPostData() {
    let formattedPostingDate = `${(new Date()).getDate().toString().padStart(2, '0')}/${((new Date()).getMonth() + 1).toString().padStart(2, '0')}/${(new Date()).getFullYear()} ${(new Date()).getHours()}:${(new Date()).getMinutes().toString().padStart(2, '0')}:${(new Date()).getSeconds().toString().padStart(2, '0')} ${(new Date()).getHours() >= 12 ? 'PM' : 'AM'}`;

    let formattedBoardingDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`;
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
      YEARMONTH: this.baseYear,
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
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMakingAmt), this.vocDataForm.value.txtCurRate
      ),
      TOTAL_METALVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMetalAmt)
      ),
      TOTAL_METALVALUE_CC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalMetalAmt), this.vocDataForm.value.txtCurRate
      ),
      TOTAL_STONEVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.invReturnSalesTotalStoneAmt
      ),
      TOTAL_STONEVALUE_CC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalStoneAmt), this.vocDataForm.value.txtCurRate
      ),
      TOTAL_PUDIFF: this.invReturnSalesTotalPurityDiff, //need
      TOTAL_STONEDIFF: this.invReturnSalesTotalStoneDiff, //need
      TOTAL_DISCVALUE_FC: this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.invReturnSalesTotalDisAmt
      ), //need
      TOTAL_DISCVALUE_CC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalDisAmt), this.vocDataForm.value.txtCurRate
      ), //need
      // TOTAL_DISCVALUE_FC: this.prnt_inv_total_dis_amt, //need
      NETVALUE_FC: this.invReturnSalesTotalNetTotal,
      // this.comFunc.transformDecimalVB(
      //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
      //   this.invReturnSalesTotalNetAmt
      // ),
      NETVALUE_CC: this.invReturnSalesTotalNetTotal,
      //  this.comFunc.CCToFC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.comFunc.emptyToZero(this.invReturnSalesTotalNetAmt), this.vocDataForm.value.txtCurRate
      // ),
      REMARKS: `S/Return Ref : ${this.salesReturnForm.value.fcn_returns_voc_type} - ${this.vocDataForm.value.fcn_voc_no}`,
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
      SUBTOTAL: this.invReturnSalesTotalNetTotal,
      ROUNDOFF: 0,
      NETTOTAL: this.invReturnSalesTotalNetTotal, //need_input
      RECEIPT_TOTAL: 0,
      // this.invReturnSalesTotalNetTotal, //need
      REFUND: 0,
      FLAG_EDIT_ALLOW: 'N',
      NAVSEQNO: 0, //need
      MOBILE: this.customerDataForm.value.fcn_customer_mobile,
      POBOX: this.customerDetails?.POBOX_NO || '',
      EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
      POSCUSTCODE: this.customerDetails?.CODE || '',
      ITEM_CURRENCY: this.vocDataForm.value.txtCurrency,
      ITEM_CURR_RATE: this.vocDataForm.value.txtCurRate || 1,
      ADJUST_ADVANCECC: 0, //need_input

      DISCOUNTCC: 0, //need_input
      SUBTOTALCC: this.invReturnSalesTotalNetTotal,
      //  this.comFunc.FCToCC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.comFunc.emptyToZero(this.invReturnSalesTotalNetAmt), this.vocDataForm.value.txtCurRate
      // ),
      NETTOTALCC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal), this.vocDataForm.value.txtCurRate
      ),
      RECEIPT_TOTALCC: 0,
      // this.comFunc.CCToFC(
      //   this.vocDataForm.value.txtCurrency,
      //   this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal), this.vocDataForm.value.txtCurRate
      // ), //need_input
      REFUNDCC: 0, //need_input
      FLAG_UPDATED: 'N',
      FLAG_INPROCESS: 'N',
      NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
        //  || this.customerDetails?.NATIONALITY
        || '',
      TYPE: this.customerDetails?.TYPE || '',

      D2DTRANSFER: 'F',
      SALESREFERENCE: `${this.salesReturnForm.value.fcn_returns_branch.toUpperCase()}-${this.salesReturnForm.value.fcn_returns_voc_type}-${this.salesReturnForm.value.fcn_returns_voc_no}-${this.salesReturnForm.value.fcn_returns_fin_year}`,
      RSCUSTIDNO: '',
      //  this.customerDetails?.POSCUSTIDNO || '',
      TRANS_CODES: '',
      CONSIGNMENTPARTY: '',
      TOTALVAT_AMOUNTFC: this.invReturnSalesTotalTaxAmt,
      TOTALVAT_AMOUNTLC: this.comFunc.CCToFC(
        this.vocDataForm.value.txtCurrency,
        this.comFunc.emptyToZero(this.invReturnSalesTotalTaxAmt), this.vocDataForm.value.txtCurRate
      ),

      RSSTATE: '',

      GSTVATAMOUNTFC: this.invReturnSalesTotalTaxAmt,
      GSTVATAMOUNTCC: this.invReturnSalesTotalTaxAmt,
      // GSTVATAMOUNTFC: this.invReturnSalesTotalTaxAmt,
      // GSTVATAMOUNTCC: this.comFunc.CCToFC(
      //   this.comFunc.compCurrency,
      //   this.comFunc.emptyToZero(this.invReturnSalesTotalTaxAmt)
      // ),
      CCPOSTINGDONE: 0,

      LOCALREMARKSNEW: '',
      AUTOPOSTING: this.isAutoPosting,
      MACHINEID: '',
      POSTDATE: this.dummyDate,
      //  formattedPostingDate,
      INVREF: 0,
      SCHEMESALESFIXINGPUREWT: 0,
      INCLUDEVAT: false,
      WAYBILLNO: '',
      WAYBILLDATE: this.dummyDate,
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
      // formattedBoardingDate,
      // `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`,
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
        COUNTRY_CODE: (this.customerDetails.COUNTRY_CODE || '').split('-')[0],

      // COUNTRY_CODE:
      //   this.customerDetails.COUNTRY_CODE ||
      //   // this.customerDetails?.COUNTRY_CODE ||
      //   '',
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
      'PANNO': this.customerDetails.PANCARDNO,
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
      "IGST_ACCODE": this.newLineItem.IGST_ACCODE_NON_POS?.toString() ?? '',

      // new fields added 28-12-2023
      "AGENT_COMMISSION": false,
      // true,
      "AGENTCOMMISSION_PER": 0,
      "EMIRATESSKYWARDSMILE": false,
      // true,
      "NEWMID": 0,
      "PLANETRESPONSEFLG": false,
      //  true,
      "POSREFERENCEREPAIRINVOICE": "",
      "POSCUSTIDEXP_DATE": this.customerDetails.POSCUSTIDEXP_DATE,
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
        this.renderer.selectRootElement('moblieNumber')?.focus();
    } else {
      this.customerDetailForm.controls.fcn_customer_detail_fname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_lname.setValue('');
      this.amlNameValidationData = true;
    }
  }
  /**  end customer detail form */
  setReadOnlyForViewMode() {
    this.isPcsEditable = true;
    // this.comFunc.formControlSetReadOnly('fcn_li_pcs', false);
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
    let API = `FinancialYear/${this.strBranchcode}/${this.strUser}`
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status != 'Failed') {

          var data = resp.response?.map((t: any) => t.fyearcode);
          this.options_year = data;




          this.yearCollection = data.map((item: any) => ({
            YEAR: item
          }));
          console.log(this.yearCollection)

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
      this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, totalNetAmount);
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
    this.prnt_received_amount_words = this.numToWord(this.comFunc.emptyToZero(this.prnt_received_amount));

    this.receiptTotalNetAmt = this.comFunc.commaSeperation(this.comFunc
      .transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
        this.receiptTotalNetAmt
      )
    )
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
      this.selectedTabIndex = 6;
    }
    else if (modeIndex == 4) {
      this.selectedTabIndex = 4;
    } else {
      this.selectedTabIndex = 5;
    }
    this.open(this.sales_payment_modal, false, data);
  }
  // ==================updatePaymentItems
  updatePaymentItems(event: any) {
    console.log(event, 'event');

  }
  //=====================
  setTabByIndex(index: any, data?: any) {

    // this.order_items_total_net_amount = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.order_items_total_net_amount);
    // this.balanceAmount = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.balanceAmount);

    this.selectedTabIndex = index;

    // if (data != null && data != undefined && data != undefined) {
    //   data['AMOUNT_FC'] = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, data['AMOUNT_FC'] );
    // }

    // if (this.receiptDetailView) {

    //   let modeIndex: number;

    //   switch (this.selectedTabIndex) {
    //     case 0:
    //       modeIndex = 0;
    //       break;
    //     case 1:
    //       modeIndex = 1;
    //       break;
    //     case 2:
    //       modeIndex = 3;
    //       break;
    //     case 3:
    //       modeIndex = 2;
    //       break;
    //     case 4:
    //       modeIndex = 4;
    //       break;
    //     default:
    //       modeIndex = 5;
    //   }

    //   const filteredReceipts = this.receiptDetailsList.filter((data: any) =>
    //     this.receiptModesTypes.some((modeType: any) =>
    //       (data.RECEIPT_MODE.toString() == modeType.CREDIT_CODE.toString()) &&
    //       (modeType.MODE == modeIndex)
    //     )
    //   );
    //   data = filteredReceipts[0];
    //   // console.log('receiptModeListData ', filteredReceipts);

    // }



    if (this.receiptModesList?.BTN_CASH == true && this.selectedTabIndex == 0) {
      if (data != null && data != undefined && data != undefined) {
        this.cashreceiptForm.controls.paymentsCash.setValue(
          data['RECEIPT_MODE'].toString());
        this.cashreceiptForm.controls.cashAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
        this.cashreceiptForm.controls.cashAmtLC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_CC']).toString()));
      }
      else {
        if (this.balanceAmount != null) {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
        } else {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
        }

      }

      this.renderer.selectRootElement('#cashAmtFC').focus();


    }
    if (this.receiptModesList?.['BTN_CREDITCARD'] == true && this.selectedTabIndex == 1) {
      if (data != null && data != undefined) {

        this.creditCardReceiptForm.controls.paymentsCreditCard.setValue(
          data['RECEIPT_MODE'].toString());
        this.creditCardReceiptForm.controls.cardCCNo.setValue(data['CARD_NO'].toString());
        this.creditCardReceiptForm.controls.cardAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
      }
      else {
        this.creditCardReceiptForm.controls.cardCCNo.setValue(
          '');
        if (this.balanceAmount != null) {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
        } else {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
        }
      }
      this.renderer.selectRootElement('#cardCCNo').focus();
    }
    if (this.receiptModesList?.['BTN_ADVANCE'] == true && this.selectedTabIndex == 2) {

      this.advanceReceiptForm.controls.advanceRecNo.setValue(
        '');
      this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        '');
      this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        '');


      this.customerDataForm.value.fcn_customer_code ? this.advanceReceiptForm.controls.advanceCustCode.setValue(
        this.customerDataForm.value.fcn_customer_code) : this.advanceReceiptForm.controls.advanceCustCode.setValue(
          '')


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
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC'].toString())));

        localStorage.setItem('advanceAmount',
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC'].toString())));

        this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
          data['IGST_AMOUNTFC']);
        this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
          data['IGST_AMOUNTCC']);
      } else {

        if (this.balanceAmount != null) {
          this.advanceReceiptForm.controls.advanceAmount.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
          localStorage.setItem('advanceAmount',
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount.toString())));


        } else {
          this.advanceReceiptForm.controls.advanceAmount.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));

          localStorage.setItem('advanceAmount',
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero((this.order_items_total_net_amount).toString())));

        }




        // this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        //   this.zeroAmtVal);
        // this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        //   this.zeroAmtVal);
      }


      this.renderer.selectRootElement('#advanceRecNo').focus();


    }
    if (this.receiptModesList?.['BTN_OTHERS'] == true && this.selectedTabIndex == 3) {
      if (data != null && data != undefined) {
        this.othersReceiptForm.controls.paymentsOthers.setValue(
          data['RECEIPT_MODE'].toString());
        this.othersReceiptForm.controls.othersAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
      }
      else {
        if (this.balanceAmount != null) {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
        } else {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
        }

      }
    }

    if (this.receiptModesList?.['BTN_GIFT'] == true && this.selectedTabIndex == 4) {
      this.giftReceiptForm.controls.giftVocNo.setValue(
        '');

      this.giftReceiptForm.controls.giftAmtFC.setValue(
        '');


      if (data != null && data != undefined) {

        this.giftReceiptForm.controls.paymentsCreditGIftVoc.setValue(
          data?.RECEIPT_MODE);

        this.giftReceiptForm.controls.giftBranch.setValue(
          data['REC_BRANCHCODE']);

        this.giftReceiptForm.controls.giftVocNo.setValue(
          data['ARECVOCNO']);

        this.giftReceiptForm.controls.giftAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
      }
    }
    if (this.receiptModesList?.['BTN_CUSTOMER'] == true && this.selectedTabIndex == 5) {
      if (data != null && data != undefined) {
        this.customerReceiptForm.controls.customAcCodeList.setValue(
          data['RECEIPT_MODE'].toString());
        this.customerReceiptForm.controls.customerAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
        this.customerReceiptForm.controls.customerAmtLC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_CC']).toString()));
      }
      else {

        if (this.balanceAmount != null) {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.balanceAmount).toString()));
        } else {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount).toString()));
        }

      }
    }
    //SCHME_UPDATED

    if (this.receiptModesList?.['BTN_SCHEME'] == true && this.selectedTabIndex == 6) {

      this.schemeReceiptForm.controls.scheme_code.setValue(
        '');

      this.schemeReceiptForm.controls.scheme_name.setValue(
        '');

      this.schemeReceiptForm.controls.schemeNo.setValue(
        '');

      this.schemeReceiptForm.controls.schemeAmtFC.setValue(
        '');


      if (data != null && data != undefined) {

        this.schemeReceiptForm.controls.scheme_code.setValue(
          data?.SCHEME_CODE);

        this.schemeReceiptForm.controls.scheme_name.setValue(
          data?.SCHEME_ID);

        this.schemeReceiptForm.controls.schemeNo.setValue(
          data['ARECVOCNO']);

        this.schemeReceiptForm.controls.schemeAmtFC.setValue(
          this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(data['AMOUNT_FC']).toString()));
      }
    }


    this.setReceiptItemCommaSeparation();

  }
  setReceiptItemCommaSeparation() {
    this.cashreceiptForm.controls.cashAmtFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtFC))));
    this.cashreceiptForm.controls.cashAmtLC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtLC))));


    this.creditCardReceiptForm.controls.cardAmtFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC))));


    this.advanceReceiptForm.controls.advanceAmount.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount))));

    this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountFC))))

    this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountLC))))

    this.othersReceiptForm.controls.othersAmtFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC))));


    this.giftReceiptForm.controls.giftAmtFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC))));

    this.customerReceiptForm.controls.customerAmtFC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtFC))));

    this.customerReceiptForm.controls.customerAmtLC.setValue(
      this.comFunc.commaSeperation(
        this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtLC))));

  }

  // setReceiptVal() {
  //   this.receiptTotalForm.controls.receiptAmtFC.setValue(
  //     this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
  //   this.receiptTotalForm.controls.receiptAmtLC.setValue(
  //     this.comFunc.emptyToZero(this.order_items_total_net_amount).toString());
  // }


  changeCustomerCode(event: any) {

    this.onCustomerNameFocus(null, true)

  }

  changeAdvanceAmount(event: any) {

    const advanceAmount = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
      this.comFunc.emptyToZero(localStorage.getItem('advanceAmount')).toString());

    if (!this.advanceReceiptForm.value.advanceRecNo) {

      this.openDialog('Warning', "Reciept Number Can not be empty", true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.advanceReceiptForm.controls.advanceAmount.setValue(advanceAmount);
        }
      });

    }

    else if (this.advanceReceiptForm.value.advanceRecNo && this.comFunc.emptyToZero(this.advanceRecieptAmount) < this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount))
      this.openDialog('Warning', "Advance amount exceeded", true);
    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data == 'OK') {
        this.advanceReceiptForm.controls.advanceAmount.setValue(this.advanceRecieptAmount);
      }
    });

  }


  checkAdvanceReciept(vocNo: any) {
    if (this.advanceRecieptVoucherNumberList.includes(this.comFunc.emptyToZero(vocNo))) {
      this.openDialog('Warning', "Selected Voucher Number already exists", true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data === 'OK') {
          this.advanceReceiptForm.controls.advanceRecNo.setValue('');
        }
      });
    }
  }


  // checkAdvanceReciept(vocNo:any){
  //   if(this.comFunc.emptyToZero(vocNo)==this.advanceRecieptVoucherNumber){
  //     this.openDialog('Warning',"Selected Voucher Number already exist", true);
  //     this.dialogBox.afterClosed().subscribe((data: any) => {
  //       if (data == 'OK') {
  //         this.advanceReceiptForm.controls.advanceRecNo.setValue('');
  //       }
  //     });
  //   }

  // }

  changeAdvanceVocNo(event: any) {
    // const value = event.target.value;

    this.checkAdvanceReciept(event.target.value);

    const value = this.advanceReceiptForm.value.advanceRecNo;
    if (value !== '' && !this.advanceRecieptVoucherNumberList.includes(this.comFunc.emptyToZero(event.target.value))) {

      this.snackBar.open('Loading...');
      let API = `AdvanceReceipt/GetAdvanceReceipt/${this.advanceReceiptForm.value.advanceBranch}/PCR/${this.advanceReceiptForm.value.advanceYear}/${this.advanceReceiptForm.value.advanceRecNo}/${this.advancePartyCode}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'] == 'Success') {
            this.isInvalidRecNo = false;
            if (!this.advanceReceiptForm.value.advanceCustCode)
              this.advanceReceiptForm.controls.advanceCustCode.setValue(res['response']['POSCUSTOMERCODE']);

            if (res['response']['POSCUSTOMERCODE'] && !this.customerDataForm.value.fcn_customer_code)
              this.onCustomerNameFocus(null, true)
            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(res['response']['BALANCE_FC']).toString()));

            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(res['response']['GST_TOTALFC']).toString()));

            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
                this.comFunc.emptyToZero(res['response']['GST_TOTALCC']).toString()));

            this.advanceRecieptAmount = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(res['response']['BALANCE_FC']).toString());

            this.advanceRecieptVoucherNumberList.push(res['response']['VOCNO']);
            this.advanceReceiptDetails = res['response'];
          } else {
            this.isInvalidRecNo = true;
            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.advanceRecieptAmount);
            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.zeroAmtVal);
            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.zeroAmtVal);

            this.advanceReceiptForm.controls.advanceRecNo.setValue(
              '')

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

  changeGiftVoucherAmount(data: any) {

    console.log(data.target.value);

    if (data.target.value > this.comFunc.emptyToZero(this.maxGiftAmount)) {

      this.openDialog('Warning', `Amount Exceed than Gift Voucher Amount ${this.maxGiftAmount} in ${this.giftVocNo}`, true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.giftReceiptForm.controls.giftAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.maxGiftAmount).toString()));

        }
      });

    }


  }

  changeGiftVocNo(event: any) {
    const value = event.target.value;
    const vocType = this.giftReceiptForm.value.paymentsCreditGIftVoc;
    console.log(this.ordered_items);
    let concatenatedCodes = this.currentLineItems.map((item: any) => `${item.DIVISION_CODE},`).join('');

    if (value != '') {
      this.snackBar.open('Loading...');
      let API = `ValidateGiftVocNo/ValidateGiftVocNo/${value}/${concatenatedCodes}/${parseFloat(this.order_items_total_net_amount)}/${this.strBranchcode}`;
      // let API = `ValidateGiftVocNo/ValidateGiftVocNo/${value}/${vocType}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'].toString().trim() == 'Success') {
            this.isInvalidGIftVocNo = false;
            if (res.dynamicData[0][0].RESULT_STATUS == 'FAILED') {

              this.openDialog('Warning', this.comFunc.getMsgByID(res.dynamicData[0][0].MESSAGE_ID), true);
              this.dialogBox.afterClosed().subscribe((data: any) => {
                if (data == 'OK') {
                  this.giftReceiptForm.controls.giftVocNo.setValue(
                    '');

                  this.giftReceiptForm.controls.giftAmtFC.setValue(
                    '');
                }
              });

            }
            else {

              const result = res.dynamicData[1][0];

              this.maxGiftAmount = res.dynamicData[1][0].VoucherAmountCC;
              this.giftVocNo = res.dynamicData[1][0].GIFTVOUCHERNO;

              this.giftReceiptForm.controls.giftAmtFC.setValue(
                this.comFunc.transformDecimalVB(
                  this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(res.dynamicData[1][0].VoucherAmountCC).toString()));

              this.giftReceiptForm.controls.giftBranch.setValue(result.BRANCH_CODE);
            }


          } else {
            this.isInvalidGIftVocNo = true;
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
    const value = this.comFunc.emptyToZero(event.target.value);
    const upValue = this.comFunc.commaSeperation(this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS, value));

    event.target.value = upValue;
    this[formName].controls[fieldName].setValue(
      upValue
    );


  }


  changeCountry(value: any) {
    this.getStateMasterByID(value);
  }
  changeState(value: any) {
    this.getCityMasterByID(this.customerDetailForm.value.fcn_cust_detail_country, value);
  }

  getCityMasterByID(countryCode: any, stateCode: any) {
    let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CITY MASTER')}/${encodeURIComponent(this.comFunc.nullToString(countryCode))}/${this.comFunc.nullToString(encodeURIComponent(stateCode))}`
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

  ValidatingVocNo(vocNum:any) {
    if (this.content?.FLAG == 'VIEW') return
    this.comFunc.showSnackBarMsg('MSG81447');
    if (this.comFunc.emptyToZero(vocNum.target.value) == 0) {
      const warning = "Voucher number cannot be 0"
      this.openDialog('Warning', warning, true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.vocDataForm.controls.fcn_voc_no.setValue(
            localStorage.getItem('voucherNumber')
          );
          this.manageCalculations();
        }
      });
    }
    else{
      let API = `ValidatingVocNo/${this.comFunc.getqueryParamMainVocType()}/${this.vocDataForm.value.fcn_voc_no}`
      API += `/${this.comFunc.branchCode}/${this.comFunc.getqueryParamVocType()}`
      API += `/${this.comFunc.yearSelected}`
      this.isloading = true;
      let Sub: Subscription = this.suntechApi.getDynamicAPI(API)
        .subscribe((result) => {
          this.isloading = false;
          this.comFunc.closeSnackBarMsg()
          let data = this.comFunc.arrayEmptyObjectToString(result.dynamicData[0])
          if (data && data[0]?.RESULT == 0) {
            this.comFunc.toastErrorByMsgId('MSG2007');
  
            this.generateVocNo()
            return
          }
  
          else{
            
            this.openDialog('Warning',this.comFunc.getMsgByID(data[0].STATUS_MESSAGE), true);
            this.dialogBox.afterClosed().subscribe((data: any) => {
              if (data == 'OK') {
                this.vocDataForm.controls.fcn_voc_no.setValue(
                  localStorage.getItem('voucherNumber')
                );
                this.manageCalculations();
              }
            });
          }
        }, err => {
          this.isloading = false;
          this.generateVocNo()
          this.comFunc.toastErrorByMsgId('MSG2272')
  
        })
      this.subscriptions.push(Sub)
    }
    
  }

  generateVocNo() {
    // getDynamicAPIwithParams

    //  let param = { 
    //   VocType:this.vocType,
    //   BranchCode:this.strBranchcode,
    //   strYEARMONTH:this.baseYear,
    //   vocdate:this.convertDateToYMD(this.vocDataForm.value.vocdate),
    //   blnTransferDummyDatabase:false




    //   }
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.vocType}/${this.strBranchcode}/${this.baseYear}/${this.convertDateToYMD(this.vocDataForm.value.vocdate)}`;
    this.suntechApi.getDynamicAPI(API)
      // let sub: Subscription = this.suntechApi.getDynamicAPIwithParams('GenerateNewVoucherNumber/GenerateNewVocNum',param)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.vocDataForm.controls['fcn_voc_no'].setValue(resp.newvocno);
          this.voucherNumber = resp.newvocno;
          localStorage.setItem('voucherNumber', resp.newvocno)
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

  getPartyCode() {

    const API = `AdvanceReceiptParty/${this.strBranchcode}`;
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          console.log('resp', resp.Accode);
          this.advancePartyCode = resp.Accode;
        }
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
      this.snackBar.open('Loading...');
      let API = 'ValidatePassword/ValidateEditDelete';
      const postData = {
        // "Username": this.authForm.value.username,
        "Username": localStorage.getItem('username') || '',
        "Password": this.authForm.value.password
      };
      this.suntechApi.postDynamicAPICustom(API, postData).subscribe((resp: any) => {
        this.snackBar.dismiss();
        if (resp.status == 'Success') {
          this.modalReferenceUserAuth.close(true);
          this.authForm.reset();

        } else {
          this.snackBar.open(resp.message, 'OK', { duration: 2000 })
        }
      });

    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    }

  }
  customGroupValue(rowData: any) {
    return rowData.PARAMETER;
  }

  fetchPramterDetails() {
    this.snackBar.open('Loading...');
    let API = 'ParamValueUsage';
    const postData = {
      "ANGULARCOMPONENTID": "add-pos.component"
    };
    this.suntechApi.gettingParameterDetails(API, postData).subscribe((resp: any) => {
      this.snackBar.dismiss();
      if (resp.Status == 'Success') {
        console.log(resp);
        this.parameterDetails = resp.dynamicData[0];
        // this.modalReferenceUserAuth.close(true);
        // this.authForm.reset();

      } else {
        this.snackBar.open(resp.message, 'OK', { duration: 2000 })
      }
    });
  }

  openParamterDetails() {
    return new Promise((resolve) => {

      this.modalReferenceUserAuth = this.modalService.open(
        this.paramGrid,
        {
          size: 'lg',
          ariaLabelledBy: 'modal-basic-title',
          backdrop: false,
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

  openAuthModal() {
    this.authForm.reset();
    return new Promise((resolve) => {

      this.modalReferenceUserAuth = this.modalService.open(
        this.userAuthModal,
        {
          size: "lg",
          backdrop: false,
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

  openAttachment(url: any) {
    console.log('Opening URL:', url.displayValue);
    window.open(url.displayValue, '_blank');
  }

  deleteAttachment(data: any) {
    const index = this.transAttachmentList.findIndex((item: any) => item.UNIQUEID === data.data.UNIQUEID);
    if (index !== -1) {
      this.transAttachmentList.splice(index, 1);
      this.transAttachmentList = [...this.transAttachmentList];
    }
  }

  onFileSelected(input: any) {
    console.log(input.target.files);
    if (input.target.files.length > 0) {
      for (let f = 0; f < input.target.files.length; f++) {
        const file: File = input.target.files[f];
        // this.uploadFilesDt.push(file);
        const url = URL.createObjectURL(file);
        this.attachedImageList.push({ file, url });
        // this.isImageUpdated = true;
      }


    }
  }

  importSalesEstimation() {
    this.estimationList = [];
    this.importEstimationList();

  }

  pullSalesOrder() {
    const orderNo = this.pendingSalesOrderForm.value.orderNo ?? 0;
    const branchTo = this.pendingSalesOrderForm.value.branchTo;
    const customerCode = this.pendingSalesOrderForm.value.customerCode ?? 0;

    // if (!orderNo && !customerCode) {
    //   this.snackBar.open('Please fill either "Order No." or "Customer Code" before searching.', 'Close', {
    //     duration: 3000,
    //   });
    //   return;
    // }

    if (orderNo) {
      this.snackBar.open('Loading...');

      this.suntechApi.getDynamicAPI(`PendingSalesOrder/GetPendingSalesOrder/${branchTo}/${orderNo}/${customerCode}`)
        .subscribe((resp) => {
          if (resp.status === 'Success') {
            this.pendingOrderList = resp.dynamicData[0];
            this.snackBar.dismiss();

          } else {
            this.snackBar.open('No Data Found', 'Close', {
              duration: 3000,
            });
            return;
          }
        });
    } else {
      this.snackBar.open('Loading...');
      this.suntechApi
        .getDynamicAPI(`PendingSalesOrder/GetPendingSalesOrder/${branchTo}/${orderNo}/${customerCode}`)
        .subscribe((resp) => {
          if (resp.status === 'Success') {
            this.pendingOrderList = resp.dynamicData[0];
            this.snackBar.dismiss();

          } else {
            this.snackBar.open('No Data Found', 'Close', {
              duration: 3000,
            });
            return;
          }
        });
    }
  }

  importSalesOrder() {
    this.pendingOrderList = [];
    this.isOrderPullingRowSelected = false;
    this.pendingSalesOrderForm.reset();
    this.pendingSalesOrderForm.controls.branchTo.setValue(this.strBranchcode);
    this.modalRefePendingSalesOrder = this.modalService.open(
      this.pendingSalesOrderModal,
      {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false,
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


  clearSignature() {
    this.signaturePad?.clear();
  }

  saveSignature() {
    if (this.signaturePad?.isEmpty()) {
      alert('Please provide a signature first.');
    } else {
      const dataURL = this.signaturePad?.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');


      const API = `RetailSalesESignature/InsertRetailSalesESignature`;
      const postData = {
        "MID": 0,
        "BRANCH_CODE": this.comFunc.nullToString(this.strBranchcode),
        "VOCNO": this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
        "VOCTYPE": this.comFunc.nullToString(this.vocDataForm.value.voc_type),
        "YEARMONTH": this.comFunc.nullToString(this.baseYear),
        "REFMID": this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
        "CUST_CODE":this.customerDetails.CODE??this.customerDataForm.value.fcn_customer_code,
        "SIGN": dataURL
      };

      this.suntechApi.postDynamicAPI(API, postData)
        .subscribe((res: any) => {
          if (res.status == "Success") {
            console.log(res);
            this.snackBar.open('Esigned successfully', '', {
              duration: 1000
            });
            this.hideEsignView = true;
            this.disableEsignButton = true;
          }
        });
    }
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




  saveAttachment() {
    if (!this.attachmentForm.invalid && this.attachedImageList.length) {
      const formData = new FormData();

      const uniqueId = this.generateUniqueId();

      formData.append('VOCNO', this.vocDataForm.value.fcn_voc_no);
      formData.append('VOCTYPE', this.vocType);
      formData.append('VOCDATE', this.convertDateWithTimeZero(new Date(this.vocDataForm.value.vocdate).toISOString()));
      formData.append('REFMID', this.vocDataForm.value.fcn_voc_no);
      formData.append('ATTACHMENT_PATH', '');

      formData.append('SRNO', '1');
      formData.append('REMARKS', this.attachmentForm.value.remarks || '');
      formData.append('UNIQUEID', uniqueId);
      formData.append('CODE', '');
      formData.append('ATTACH_TYPE', this.attachedImageList[0].file.type || '');
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

      for (let i = 0; i < this.attachedImageList.length; i++) {
        formData.append(`Model.Images[${i}].Image.File`, this.attachedImageList[i].file, this.attachedImageList[i].file.name);
      }

      this.transAttachmentListData.push(formData);

      this.transAttachmentList.push({
        "REFMID": 0,
        "REMARKS": this.attachmentForm.value.remarks || '',
        "ATTACHMENT_PATH": this.attachedImageList ? this.attachedImageList[0].url : '',
        "DOC_TYPE": this.attachmentForm.value.docType || '',
        "EXPIRE_DATE": this.convertDateToYMD(this.attachmentForm.value.expDate) || this.dummyDate,
        "VOCTYPE": this.vocType,
        "UNIQUEID": uniqueId
      });

      this.attachmentForm.reset();
      this.attachmentForm.markAsPristine();
      this.attachmentForm.markAsUntouched();
    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 });
    }
  }

  generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
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

    // this.snackBar.open('Loading...');
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

    const res = this.nationalityMaster.filter((data: any) => data.CODE == this.customerDetailForm.value.fcn_cust_detail_nationality)
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

        "UnitPrice": (Number(data.TOTALWITHVATFC) || 0) - (Number(data.VAT_AMOUNTFC) || 0),
        "NetAmount": (Number(data.TOTALWITHVATFC) || 0) - (Number(data.VAT_AMOUNTFC) || 0),

        // "UnitPrice": data.TOTALWITHVATFC, 
        // "NetAmount": data.TOTALWITHVATFC, 
        "VatRate": data.VAT_PER, //doubt -c
        "VatCode": data.VATCODE ? data.GST_CODE.toString() : '',
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
        //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
        //   this.prnt_inv_total_gross_amt //  total without vat
        // ),
        // "VatIncl": this.comFunc.transformDecimalVB(
        //   this.comFunc.allbranchMaster?.BAMTDECIMALS,
        //   this.order_items_total_tax
        // ), //doubt - total vat amount - c
        "Total": this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          netAmt
        ),
        "TotalBeforeVAT": this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
          totalBeforeVat
        ),
        "VatIncl": this.comFunc.transformDecimalVB(
          this.comFunc.allbranchMaster?.BAMTDECIMALS,
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
          // In retail sales
          // update trno value to field
          // planeturl - 
          // /PLANETRESPONEFLG = true  
          this.planetService.getPlanetPOSUpdateTag(this.strBranchcode, this.vocType, this.baseYear, this.vocDataForm.value.fcn_voc_no);

          // this.getPlanetPOSUpdateTag();

        }
      });
  }


  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear/${this.convertDateToYMD(this.vocDataForm.value.vocdate)}`;
    const res = await this.suntechApi.getDynamicAPI(API).toPromise();
    console.log(res);
    if (res.status == "Success") {
      this.baseYear = res.BaseFinancialyear;
    }
  }

  // call after edit save
  createPlanetPOSVoidFile() {
    const API = `POSPlanetFile/CreatePlanetPOSVoidFile/${this.strBranchcode}/${this.vocType}/${this.baseYear}/${this.vocDataForm.value.fcn_voc_no}`;
    this.suntechApi.postDynamicAPI(API, {})
      .subscribe((res: any) => {
        if (res.status == "Success") {
        }
      });
  }

  // getPlanetPOSUpdateTag() {
  //   const API = `POSPlanetFile/GetPlanetPOSUpdateTag/${this.strBranchcode}/${this.vocType}/${this.baseYear}/${this.vocDataForm.value.fcn_voc_no}`;
  //   this.suntechApi.getDynamicAPI(API)
  //     .subscribe((res: any) => {
  //       if (res.status == "Success") {
  //       }
  //     });
  // }

  getSalesReturnVocTypes() {
    //     http://94.200.156.234:85/api/UspGetSubVouchers
    // {

    // }
    const API = `UspGetSubVouchers`;
    const postData = {
      "strBranchCode": this.strBranchcode,
      "strMainVocType": this.mainVocType
    };

    this.suntechApi.postDynamicAPI(API, postData)
      .subscribe((res: any) => {
        if (res.status == "Success") {
          this.vocTypesinSalesReturn = res.dynamicData[0];
          console.log('this.vocTypesinSalesReturn', this.vocTypesinSalesReturn);

        }
      });
  }

  changeFinalDiscount(event: any) {
    this.isNetAmountChange = false;
    const value = event.target.value;
    const posRoundOffRange = Number(localStorage.getItem('POSROUNDOFFRANGE')) || 0;

    const numValue = Number(value);

    if (numValue > posRoundOffRange || numValue < -posRoundOffRange) {
      this.openDialog('Warning', this.comFunc.getMsgByID('MSG7676'), true);
      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.order_items_total_discount_amount = '0.00';
        }
      });
    } else {
      if (value !== '') {

        let res: any = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount_org) +
          this.comFunc.emptyToZero(value));


        this.netTotal = res;
        this.sumReceiptItem();
        // this.order_items_total_net_amount = value;


      } else {
        this.netTotal = this.order_items_total_net_amount_org;
        this.sumReceiptItem();

      }
    }
  }

  // changeFinalDiscount(event: any) {
  //   // this.order_items_total_discount_amount =
  //   // this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(event.target.value))

  //   event.target.value = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(event.target.value))
  //   const value = event.target.value;

  //   this.order_items_total_discount_amount = value;

  //   if (value != '') {

  //     let res: any = this.comFunc.transformDecimalVB(this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(this.order_items_total_net_amount_org) +
  //       this.comFunc.emptyToZero(value));

  //     this.order_items_total_net_amount = res;
  //     this.sumReceiptItem();

  //   } else {
  //     this.order_items_total_net_amount = this.order_items_total_net_amount_org
  //     this.sumReceiptItem();
  //   }
  //   // this.order_items_total_discount_amount = this.comFunc.commaSeperation(this.order_items_total_discount_amount);

  // }

  getBranchCurrencyList() {
    // let param={

    // }
    //     let sub: Subscription = this.suntechApi.getDynamicAPIwithParams('CurrencyMaster/GetCurrencyMasterList',param)

    const API = `CurrencyMaster/GetCurrencyMasterList`;
    this.suntechApi.getDynamicAPI(API)
      .subscribe((res: any) => {
        if (res.status == "Success") {
          this.currencyMaster = res.response;
          this.currencyMasterOptions =
            this.vocDataForm.controls.txtCurrency.valueChanges.pipe(
              startWith(''),
              map((value) =>
                this._filterMasters(this.currencyMaster, value, 'CURRENCY_CODE', 'DESCRIPTION')
              )
            );
        }
      });
  }

  changeCurrency(e: any) {
    const value = e.option.value;
    this.findCurDataByCode(value, true);
  }
  findCurDataByCode(value: any, setData: boolean = false) {
    const res = this.currencyMaster.filter((data: any) => data.CURRENCY_CODE == value);
    if (setData) {
      if (res.length > 0) {
        this.selectedCurrencyData = res[0];
        this.vocDataForm.controls.txtCurRate.setValue(this.comFunc.decimalQuantityFormat(res[0].CONV_RATE, 'RATE'));

        this.addValidationsForForms(this.vocDataForm, 'txtCurRate', [
          Validators.required,
          Validators.min(res[0].MIN_CONV_RATE),
          Validators.max(res[0].MAX_CONV_RATE),
        ]);
      }
    } else {
      return res;
    }
  }
  changeCurRate(e: any) {
    this.isNetAmountChange = false;
    console.log(e);
    let value = e.target.value;
    if (value != '') {
      let minVal = null;
      let maxVal = null;
      // if(this.vocDataForm.controls.txtCurRate.hasError('min')){
      //   minVal = this.vocDataForm.get("txtCurRate")?.getError("min").min;
      // }
      // if(this.vocDataForm.controls.txtCurRate.hasError('max')){
      //   minVal = this.vocDataForm.get("txtCurRate")?.getError("max").max;
      // }

      if (parseFloat(value) <= parseFloat(this.selectedCurrencyData.MIN_CONV_RATE)) {

        this.vocDataForm.controls.txtCurRate.setValue(
          this.comFunc.decimalQuantityFormat(this.selectedCurrencyData.MIN_CONV_RATE, 'RATE'))
      }
      if (parseFloat(value) >= parseFloat(this.selectedCurrencyData.MAX_CONV_RATE)) {

        this.vocDataForm.controls.txtCurRate.setValue(
          this.comFunc.decimalQuantityFormat(this.selectedCurrencyData.MAX_CONV_RATE, 'RATE'))

      }


    } else {
      // e.target.value = this.selectedCurrencyData.CONV_RATE;
      this.vocDataForm.controls.txtCurRate.setValue(
        this.comFunc.decimalQuantityFormat(this.selectedCurrencyData.CONV_RATE, 'RATE'))


    }
    return true;
  }

  clearField() {
    if (this.order_items_total_discount_amount === '0.00') {
      this.order_items_total_discount_amount = '';
    }
  }

  formatValue(value: string): string {
    if (value && !isNaN(Number(value))) {
      return parseFloat(value).toFixed(2);
    }
    return value;
  }

  checkDiscountEligible() {
    let posRoundOffRange = Number(localStorage.getItem('POSROUNDOFFRANGE')) || 0;
    if (posRoundOffRange == 0) {
      this.isNoDiscountAllowed = true;
    }
    else
      this.isNoDiscountAllowed = false;
  }

  setGrossWtFocus() {
    if (this.comFunc.emptyToZero(this.lineItemForm.value.fcn_li_gross_wt) == 0 && this.newLineItem.DIVISION=='G' && !this.validatePCS && this.lineItemForm.value.fcn_li_item_code && this.newLineItem.DIVISION != "X") {
      this.renderer.selectRootElement('#fcn_li_gross_wt').select();
      this.snackBar.open('Gross Wt should not 0', 'OK', {
        duration: 2000
      });
    }
    else {
      this.checkItemCode();
    }
  }

  

  setGiftType() {
    if (this.divisionMS == 'M') {
      this.giftTypeOptions = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Gold', label: 'Gold' },
      ];
    } else {
      this.giftTypeOptions = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Diamond', label: 'Diamond' },
      ];
    }
  }

  auditTrailClick() {
    let params: AuditTrailModel = {
      BRANCH_CODE: this.comFunc.nullToString(this.strBranchcode),
      VOCTYPE: this.comFunc.nullToString(this.vocDataForm.value.voc_type),
      VOCNO: this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
      MID: this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
      YEARMONTH: this.comFunc.nullToString(this.baseYear),
    }
    this.auditTrailComponent?.showDialog(params)
  }
  @ViewChild('content1', { static: true }) el!: ElementRef;

  exportPdf() {
    //  let htmlContent="<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap\"rel=\"stylesheet\"></head><body> <image src=assets/images/logo-dark.jpg width=\"100\"/>\n</body></html>";


    let postData = {
      "MID": this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
      "BRANCH_CODE": this.comFunc.nullToString(this.strBranchcode),
      "VOCNO": this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
      "VOCTYPE": this.comFunc.nullToString(this.vocDataForm.value.voc_type),
      "YEARMONTH": this.comFunc.nullToString(this.baseYear),
    }
    this.suntechApi.postDynamicAPI(`UspReceiptDetailsWeb`, postData)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.dynamicData

        let htmlContent = data[0][0].HTMLOUT2;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        //   const style = document.createElement('style');
        //   style.innerHTML = `
        //     #tempDiv {
        //       display: flex;
        //       justify-content: center;
        //       align-items: center;
        //       flex-direction: column;
        //       margin: 0 auto;
        //       text-align: center;
        //       width: 100%;
        //       height: 100%;
        //     }
        //   `;

        //   // Append the style to tempDiv
        //   tempDiv.appendChild(style);

        //   const options = {
        //     margin: [0.5, 0.5], // Set equal margins for top/bottom and left/right
        //     filename: 'POS_Receipt.pdf',
        //     image: { type: 'jpeg', quality: 0.98 },
        //     html2canvas: { scale: 2 },
        //     jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        //   };
        //   html2pdf().from(tempDiv).set(options).save();
        // });

        const options = {
          margin: 0.5,
          filename: 'POS_Receipt.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        html2pdf().from(tempDiv).set(options).save();


      })


    // const element = this.el.nativeElement;

    // // Calculate the content dimensions
    // const contentWidth = element.scrollWidth;
    // const contentHeight = element.scrollHeight;

    // // Configure html2pdf options
    // const options = {
    //   margin: [10, 10], // top and bottom margins
    //   filename: 'Product_Group_Journey.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2, useCORS: true },
    //   jsPDF: { unit: 'px', format: [contentWidth, contentHeight], orientation: 'portrait' }
    // };

    // html2pdf().from(element).set(options).save();
  }
  exportInvoiceToPdf(): void {
    let postData = {
      "MID": this.content ? this.comFunc.emptyToZero(this.content?.MID) : this.midForInvoce,
      "BRANCH_CODE": this.comFunc.nullToString(this.strBranchcode),
      "VOCNO": this.comFunc.emptyToZero(this.vocDataForm.value.fcn_voc_no),
      "VOCTYPE": this.comFunc.nullToString(this.vocDataForm.value.voc_type),
      "YEARMONTH": this.comFunc.nullToString(this.baseYear),
    };

    this.suntechApi.postDynamicAPI(`UspReceiptDetailsWeb`, postData)
      .subscribe((result: any) => {
        console.log(result);
        // let data = result.dynamicData;
        // let printContent = data[0][0].HTMLOUT2;

        // // Update the HTML content with the data received from API
        // document.getElementById('select123')!.innerHTML = printContent;

        // Generate the PDF after content update
        this.lineItemService.generatePdf('select123', 'userCard.pdf');
      });
  }


  enableFormControls(enable: boolean) {
    Object.keys(this.lineItemForm.controls).forEach((controlName: any) => {
      if (controlName !== 'fcn_li_item_code') {
        if (enable) {
          this.lineItemForm.get(controlName)?.enable();
        } else {
          this.lineItemForm.get(controlName)?.disable();
        }
      }
    });
    this.lineItemForm.get('fcn_li_division')?.disable();
  }

  schemeCodeSelected(e: any) {
    console.log(e);

    if (this.selectedSchemeIdCollection.includes(e.SCH_CUSTOMER_ID)) {
      this.snackBar.open('Scheme ID already exists', 'Close', { duration: 3000 });
      this.resetSchemeFormControls();
      return;
    }

    this.schemeReceiptForm.controls.scheme_code.setValue(e.SCH_SCHEME_CODE);
    this.schemeReceiptForm.controls.scheme_name.setValue(e.SCH_CUSTOMER_ID);

    let postData = {
      "SCHEMECODE": e.SCH_SCHEME_CODE,
      "POSCUSTCODE": this.customerDetails?.CODE,
      "BRANCH": this.comFunc.nullToString(this.strBranchcode),
      "VOCDATE": this.convertDateWithTimeZero(
        new Date(this.vocDataForm.value.vocdate).toISOString()
      ),
      "SCHEMEREDEEM": ""
    };

    this.suntechApi.postDynamicAPI(`RetailSalesDataInDotnet/SchemeCodeValidation`, postData)
      .subscribe((result: any) => {
        console.log(result);
        if (result.status == 'Success') {
          this.schemeList = result.response;
          this.schemeReceiptForm.controls.schemeNo.setValue(this.schemeList[0].ARECVOCNO);
          this.schemeReceiptForm.controls.schemeAmtFC.setValue(this.schemeList[0].AMOUNT_FC);
        }
        else {
          this.snackBar.open(result.message);
          this.resetSchemeFormControls();

        }


      });
  }

  resetSchemeFormControls() {
    this.schemeReceiptForm.controls.scheme_name.reset();
    this.schemeReceiptForm.controls.scheme_code.reset();
    this.schemeReceiptForm.controls.schemeNo.reset();
    this.schemeReceiptForm.controls.schemeAmtFC.reset();
  }

  calculateNextSRNO(): number {
    const srnos = this.currentLineItems.map((item: any) => item.SRNO);
    const maxSRNO = srnos.length > 0 ? Math.max(...srnos) : 0;
    return maxSRNO + 1;
  }

  onSelectionChanged(event: any) {
    this.selectedPendingOrder = event.selectedRowsData[0];
    this.isOrderPullingRowSelected = true;
  }

  onApplyPendOrder() {
    if (this.selectedPendingOrder) {

      console.log('Selected Row Data:', this.selectedPendingOrder);
      this.fetchSalesOrderDetails(this.selectedPendingOrder.VOCNO, this.selectedPendingOrder.MID, this.selectedPendingOrder.VOCTYPE);
      this.modalReference.close();

    }
  }

  fetchSalesOrderDetails(vocNo: string, mid: any, vocType: any) {
    this.snackBar.open('Loading...');
    // this.suntechApi.getDynamicAPI(`RetailSalesOrder/GetRetailSalesOrder/moe/ops/2024/27/13`)

    this.suntechApi.getDynamicAPI(`RetailSalesOrder/GetRetailSalesOrder/${this.strBranchcode}/${vocType}/${this.baseYear}/${vocNo}/${mid}`)
      .subscribe((resp) => {
        if (resp.status === 'Success') {
          this.newLineItem = resp.response.salesOrder.Details[0];
          const salesOrderDetails = resp.response.salesOrder.Details;
          const existingStockCodes = this.ordered_items.map(item => item.stock_code);

          const newEntries = salesOrderDetails.filter(
            (detail: any) => !existingStockCodes.includes(detail.STOCK_CODE)
          );

          if (newEntries.length === 0) {

            this.openDialog(
              'Warning',
              'Order already exists',
              true
            );
            this.dialogBox.afterClosed().subscribe((data: any) => {
              if (data == 'OK') {
                this.lineItemForm.controls['fcn_li_item_code'].setValue('');
                this.renderer.selectRootElement('#fcn_li_item_code').focus();
              }

            });

          } else {
            this.addItemtoList('save_btn', newEntries);
            this.modalRefePendingSalesOrder.dismiss('Dismissed by user');
          }

          this.onCustomerNameFocus(resp.response.customer.MOBILE, false);
          this.snackBar.dismiss();
        }
        else {
          this.snackBar.open('No Data Found', 'Close', {
            duration: 3000,
          });
          return;
        }
      });
  }

  importEstimationList() {
    if (!this.customerDataForm.value.fcn_customer_code) {
      let message = "Please add customer details"
      this.openDialog('Warning', message, true);

      this.dialogBox.afterClosed().subscribe((action: any) => {

      });
    }
    else {
      const postData = {
        "strBranchCode": this.strBranchcode,
        "strYearMonth": this.baseYear,
        "strVocDate": this.convertDateToYMD(this.vocDataForm.value.vocdate),
        "strCustCode": this.customerDataForm.value.fcn_customer_code,
        "strEstMid": [
          0
        ]
      };

      this.suntechApi.postDynamicAPI('/RetailEstimationNet/EstimationListLoad', postData).subscribe((result) => {
        console.log(result);
        if (result.status == 'Success' && result.response != null) {
          this.estimationList = result.response;
          this.openEstimationModal();
        }
        else {
          this.estimationList = [];
          this.openDialog('Warning', this.comFunc.getMsgByID('MSG81534'), true);

          this.dialogBox.afterClosed().subscribe((action: any) => {

          });
        }
      });

    }
  }


  openEstimationModal() {
    this.modalRefePendingSalesEstimation = this.modalService.open(
      this.salesEstimationModal,
      {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false,

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

  onEstimationEntryChange(event: any) {
    this.selectedEstimation = event.selectedRowsData[0];
    this.isEstiPullingRowSelected = true;
  }



  onApplyEstimation() {
    if (this.selectedEstimation) {

      console.log('Selected Row Data:', this.selectedEstimation);
      this.fetchEstimationDetails(this.selectedEstimation.MID);

    }
  }

  fetchEstimationDetails(mid: any) {
    this.snackBar.open('Loading...');
    this.suntechApi.getDynamicAPI(`RetailEstimationNet/EstimationImport/${mid}`)

      // this.suntechApi.getDynamicAPI(`RetailSalesOrder/GetRetailSalesOrder/${this.strBranchcode}/${this.mainVocType}/${this.baseYear}/${vocNo}/${mid}`)
      .subscribe((resp) => {
        if (resp.status === 'Success') {

          const retailSaleData = resp.response[0].estimation;
          const retailSReturnData = resp.response[0].retailsReturn;
          const metalPurchaseData = resp.response[0].salesreturn;





          retailSaleData.estimationDetail.map((data: any, index: any) => {
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
              total_amount: data.DIVISION_CODE == 'D' ? (data.MKGVALUEFC - data.DISCOUNTVALUEFC) : data.MKGVALUEFC || 0,
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
              metal_rate: data.METALVALUECC || 0,
              taxPer: data.VAT_PER || 0,
              metal_amt: data.METALVALUECC,
              // this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_metal_amount) || 0,
              stone_amt: this.comFunc.emptyToZero(this.lineItemForm.value.fcn_ad_stone_amount) || 0,
            };

            this.newLineItem.PCS = data.PCS;
            this.order_items_slno_length = data.ID;
            this.ordered_items.push(values);
            this.currentLineItems.push(data);
            const divisionMS: any = this.comFunc.getDivisionMS(data.DIVISION_CODE);
            this.currentLineItems[index].divisionMS = divisionMS;
            if (divisionMS == 'M') {
              values.gross_amt = data.TOTAL_AMOUNTCC;
              this.currentLineItems[index].GROSS_AMT = data.TOTAL_AMOUNTCC;
            } else {
              values.gross_amt = data.MKGVALUEFC - data.DISCOUNTVALUECC;
              this.currentLineItems[index].GROSS_AMT = data.MKGVALUEFC - data.DISCOUNTVALUECC;
            }

          });

          this.order_items_total_discount_amount = retailSaleData.DISCOUNT;

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

          this.snackBar.dismiss();
          this.modalRefePendingSalesEstimation.dismiss('Dismissed by user');

        } else {
          this.snackBar.open('No Data Found', 'Close', {
            duration: 3000,
          });
          return;
        }
      });
  }






  onCountryCodeSelection(event: any, isCountrySelection: Boolean) {
    if (isCountrySelection) {
      const selectedOption = this.sortedCountryList.find((item: any) => item.CODE_DESC === event);
      if (selectedOption) {

        this.customerDetailForm.controls['fcn_mob_code'].setValue(selectedOption.MOBILECOUNTRYCODE);
      }
    }
    else {
      const selectedOption = this.sortedCountryList.find((item: any) => item.MOBILECOUNTRYCODE === event.option.value);
      if (selectedOption) {

        this.customerDetailForm.controls['fcn_cust_detail_country'].setValue(selectedOption.CODE_DESC);
      }
    }

  }


  triggerCustomerEntry(data: any) {
    this.isCustomerFindsOnCode = true;
    this.onCustomerNameFocus(data.target.value, true);
  }


  triggerCustomerMasterSearch(e: any) {
    this.isCustomerFindsOnCode = true;
    this.onCustomerNameFocus(e.CODE, true);

  }

  isCustomerDetailsEmpty(): boolean {
    return Object.keys(this.customerDetails).length === 0;
  }

  openSalesModalAfterAML() {

    if (this.isCustomerDetailsAdd && !this.isCustomerDetailsEmpty)
      this.triggerAmlValidation();

    else {

      if (this.isPartialAMLValidation) {
        this.openDialog(
          'Alert',
          this.comFunc.getMsgByID('MSG81396'),
          false
        );
        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'No') {

            this.open(this.mymodal, false, null, false, false, false, true);

          } else {
          }
        });
      }
      else {
        this.open(this.mymodal, false, null, false, false, false, true);

      }


    }


  }

  triggerAmlValidation(){
    this.openDialog('Warning', "Please fill the customer Details", true);
    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data == 'OK') {
        this.renderer.selectRootElement('#fcn_customer_mobile').select();

      }
    });
  }

  openTab(event: any, formControlName: string) {
    console.log(event);

    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "enteredby":
        this.salesPersonCode.showOverlayPanel(event);
        break;
     
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }



  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string, isCurrencyField: boolean) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;

    if (event.target.value === '' || this.viewOnly === true) {
  
        return;
    }

    let param = {
        "PAGENO": LOOKUPDATA.PAGENO,
        "RECORDS": LOOKUPDATA.RECORDS,
        "LOOKUPID": LOOKUPDATA.LOOKUPID,
        "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
        "searchField": LOOKUPDATA.SEARCH_FIELD,
        "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    this.comFunc.showSnackBarMsg('MSG81447');

    let Sub: Subscription = this.suntechApi.postDynamicAPI('MasterLookUp', param)
        .subscribe((result) => {
            this.comFunc.closeSnackBarMsg();
            let data = result.dynamicData[0];

            if (data && data.length > 0) {
                if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE !== '') {
                    let searchResult = this.comFunc.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);

                    if (searchResult && searchResult.length > 0) {
                        let matchedItem = searchResult[0];

                        this.vocDataForm.controls.sales_person.setValue(matchedItem.SALESPERSON_CODE);
                          
                       
                    } else {
                        this.comFunc.toastErrorByMsgId('No data found');
                        LOOKUPDATA.SEARCH_VALUE = '';
                        this.vocDataForm.controls.sales_person.setValue('');
                  
                    }
                }
            }
            else {
              this.comFunc.toastErrorByMsgId('No data found');
              LOOKUPDATA.SEARCH_VALUE = '';
              this.vocDataForm.controls.sales_person.setValue('');
        
          }
        }, err => {
            this.comFunc.toastErrorByMsgId('MSG2272');
            this.vocDataForm.controls.sales_person.setValue('');
        });

    this.subscriptions.push(Sub);
}

enteredBySelected(e: any) {

  this.vocDataForm.controls.sales_person.setValue(e.SALESPERSON_CODE);

}



 parseDate(dateString: string): string {
  const [day, month, year, hour, minute, second, period] = dateString.split(/[/\s:]+/);
  const hours = period === 'PM' && parseInt(hour) < 12 ? parseInt(hour) + 12 : parseInt(hour);
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minute), parseInt(second)).toISOString();
}


}

