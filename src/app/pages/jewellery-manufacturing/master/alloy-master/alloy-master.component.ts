import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-alloy-master',
  templateUrl: './alloy-master.component.html',
  styleUrls: ['./alloy-master.component.scss']
})
export class AlloyMasterComponent implements OnInit {
  @Input() content!: any;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  tableData: any[] = [];
  isChecked: boolean = false;
  userName = localStorage.getItem('username');
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  image: string | ArrayBuffer | null | undefined;
  url: any;
  dele: boolean = false;
  isDisableSaveBtn: boolean = false;

  numericValue!: number;
  branchCode: any = localStorage.getItem('userbranch');
  currencyDt: any;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = true;
  isEditable: boolean = false;

  alloyMastereForm: FormGroup = this.formBuilder.group({
    mid: [],
    code: ['', [Validators.required]],
    costCenter: ['', [Validators.required]],
    type: [''],
    category: [''],
    subCategory: [''],
    brand: [''],
    vendor: [''],
    currency: ['', [Validators.required]],
    currencyRate: [''],
    createdOn: [new Date(), ''],
    createdBy: [''],
    priceScheme: [''],
    pricenumber: [''],
    PRICE1: [''],
    price1per: ['0'],
    price1Fc: [''],
    price1Lc: [''],
    price2code: [''],
    price2per: ['0'],
    price2Fc: [''],
    price2Lc: [''],
    price3code: [''],
    price3per: ['0'],
    price3Fc: [''],
    price3Lc: [''],
    price4code: [''],
    price4per: ['0'],
    price4Fc: [''],
    price4Lc: [''],
    price5code: [''],
    price5per: ['0'],
    price5Fc: [''],
    price5Lc: [''],
    description: ['', [Validators.required]],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes: [''],
    divCode: [''],
    hsncode: [''],
    lasttransaction: [''],
    fristtransaction: [''],
    vendorRef: [''],
    weightAvgCostFC: [''],
    weightAvgCostLC: [''],
    allowpcs: [''],
    excludeTransferWt: [''],
    silveralloy: [''],
    picture_name: ['']
  });
  mode!: string;


  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.branchCode = this.commonService.branchCode;
    this.currencyDt = this.commonService.compCurrency;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ngOnInit(): void {
    this.dele = true;
    this.setupFormSubscription();
    this.alloyMastereForm.controls.createdBy.setValue(this.userName);
    console.log(this.userName);

    this.renderer.selectRootElement('#code')?.focus();
    this.setCompanyCurrency()

    // console.log(this.content.FLAG);

    if (this.content.FLAG == 'EDIT') {
      this.isDisabled = !this.isDisabled;
      this.editMode = true;
      this.editableMode = true;
      this.dele = false;
      this.setInitialValues()
    } else if (this.content.FLAG == 'VIEW') {
      // this.alloyMastereForm.disable()
      this.isDisabled = true;
      this.editMode = true;
      this.viewMode = true
      this.setInitialValues()
    }
  }

  setupFormSubscription(): void {
    if (this.alloyMastereForm.get('price1Lc') && this.alloyMastereForm.get('price1Fc')) {
      this.alloyMastereForm.get('price1Lc')!.valueChanges.subscribe(value => {
        // Update value of price1Fc whenever price1Lc changes
        this.alloyMastereForm.get('price1Fc')!.setValue(value);
      });
    }
    if (this.alloyMastereForm.get('price2Lc') && this.alloyMastereForm.get('price1Fc')) {
      this.alloyMastereForm.get('price2Lc')!.valueChanges.subscribe(value => {
        // Update value of price1Fc whenever price1Lc changes
        this.alloyMastereForm.get('price2Fc')!.setValue(value);
      });
    }
    if (this.alloyMastereForm.get('price3Lc') && this.alloyMastereForm.get('price1Fc')) {
      this.alloyMastereForm.get('price3Lc')!.valueChanges.subscribe(value => {
        // Update value of price1Fc whenever price1Lc changes
        this.alloyMastereForm.get('price3Fc')!.setValue(value);
      });
    }
    if (this.alloyMastereForm.get('price4Lc') && this.alloyMastereForm.get('price1Fc')) {
      this.alloyMastereForm.get('price4Lc')!.valueChanges.subscribe(value => {
        // Update value of price1Fc whenever price1Lc changes
        this.alloyMastereForm.get('price4Fc')!.setValue(value);
      });
    }
    if (this.alloyMastereForm.get('price5Lc') && this.alloyMastereForm.get('price1Fc')) {
      this.alloyMastereForm.get('price5Lc')!.valueChanges.subscribe(value => {
        // Update value of price1Fc whenever price1Lc changes
        this.alloyMastereForm.get('price5Fc')!.setValue(value);
      });
    }
  }

  @ViewChild('codeInput')
  codeInput!: ElementRef;

  // ngAfterViewInit(): void {
  //   this.codeInput.nativeElement.focus();
  // }

  setInitialValues() {
    console.log(this.content, 'content');
    // 'DiamondStockMaster/GetDiamondStockMasterWithMid/2649104'
    this.alloyMastereForm.controls.code.setValue(this.content.STOCK_CODE)
    this.alloyMastereForm.controls.description.setValue(this.content.STOCK_DESCRIPTION)
    this.alloyMastereForm.controls.description.setValue(this.content.STOCK_DESCRIPTION)
    this.alloyMastereForm.controls.brand.setValue(this.content.BRAND_CODE)
    this.alloyMastereForm.controls.category.setValue(this.content.CATEGORY_CODE)
    this.alloyMastereForm.controls.costCenter.setValue(this.content.COST_CODE)
    this.alloyMastereForm.controls.brand.setValue(this.content.DESIGN_CODE)
    this.alloyMastereForm.controls.color.setValue(this.content.COLOR)
    this.alloyMastereForm.controls.type.setValue(this.content.TYPE_CODE)
    this.alloyMastereForm.controls.subCategory.setValue(this.content.SUBCATEGORY_CODE)
    this.alloyMastereForm.controls.vendor.setValue(this.content.SALESCODE)
    this.alloyMastereForm.controls.PRICE1.setValue(this.content.PRICE1PER)
    this.alloyMastereForm.controls.price2code.setValue(this.content.PRICE2PER)
    this.alloyMastereForm.controls.price3code.setValue(this.content.PRICE3PER)
    this.alloyMastereForm.controls.price4code.setValue(this.content.PRICE4PER)
    this.alloyMastereForm.controls.price5code.setValue(this.content.PRICE5PER)
    this.alloyMastereForm.controls.hsncode.setValue(this.content.HSN_CODE)
    this.alloyMastereForm.controls.allowpcs.setValue(this.viewchangeYorN(this.content.ALLOW_ZEROPCS))
    this.alloyMastereForm.controls.excludeTransferWt.setValue(this.viewchangeYorN(this.content.EXCLUDE_TRANSFER_WT))
    this.alloyMastereForm.controls.silveralloy.setValue(this.viewchangeYorN(this.content.ALLOW_NEGATIVE))

  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.alloyMastereForm.controls.currency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
    this.alloyMastereForm.controls.currencyRate.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
  }
  onFileChanged(event: any) {
    this.image = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result;
      };
    }
  }

  setValueweightAvgCost() {
    this.alloyMastereForm.controls.weightAvgCostFC.setValue(this.alloyMastereForm.value.weightAvgCostLC)
  }

  codeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'prefix_code',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='S'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,

  }

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPE = 'CONSUMABLE ITEMS' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 31,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  BrandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER' AND DIV_Y=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER' AND DIV_Y=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Vendor',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE = '" + this.branchCode + "' AND AC_OnHold = 0 ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,

  }



  masterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Master Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  priceSchemeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 177,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Scheme',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  HSNCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  codeEnabled() {
    if (this.alloyMastereForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  onchangeCheckBox(e: any) {
    console.log(e);

    if (e == true) {
      return true;
    } else {
      return false;
    }
  }
  viewchangeYorN(e: any) {
    console.log(e);

    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' AND ${LOOKUPDATA.WHERECONDITION}`
    }
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.alloyMastereForm.controls[FORMNAME].setValue('')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
  priceSchemeValidatePriceDetails(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.priceScheme.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "066",
      "parameter": {
        "PRICE_SCHEME_CODE": this.alloyMastereForm.value.priceScheme,
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") { //
          let data = result.dynamicData[0]
          console.log(data);

          data.forEach((item: any, i: any) => {
            //  this.alloyMastereForm.controls[item.PRICE_NUMBER].setValue(item.PRICE_CODE)
            if (item.PRICE_NUMBER == 'PRICE1') {
              this.alloyMastereForm.controls.price1per.setValue(item.PRICE_PER)
              this.alloyMastereForm.controls.PRICE1.setValue(item.PRICE_CODE)
            }
            if (item.PRICE_NUMBER == 'PRICE2') {
              this.alloyMastereForm.controls.price2per.setValue(item.PRICE_PER)
              this.alloyMastereForm.controls.price2code.setValue(item.PRICE_CODE)
            }
            if (item.PRICE_NUMBER == 'PRICE3') {
              this.alloyMastereForm.controls.price3per.setValue(item.PRICE_PER)
              this.alloyMastereForm.controls.price3code.setValue(item.PRICE_CODE)
            }
            if (item.PRICE_NUMBER == 'PRICE4') {
              this.alloyMastereForm.controls.price4per.setValue(item.PRICE_PER)
              this.alloyMastereForm.controls.price4code.setValue(item.PRICE_CODE)
            }
            if (item.PRICE_NUMBER == 'PRICE5') {
              this.alloyMastereForm.controls.price5per.setValue(item.PRICE_PER)
              this.alloyMastereForm.controls.price5code.setValue(item.PRICE_CODE)
            }
          });
        }
      }, err => {
        this.commonService.toastErrorByMsgId('Server Error')
      })
    this.subscriptions.push(Sub)
  }
  priceCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price.setValue(e.PREFIX_CODE);
  }

  currencyDataSelected(e: any) {
    console.log(e);
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls['currency'].setValue(e.CURRENCY_CODE);
    this.alloyMastereForm.controls['currencyRate'].setValue(e.CONV_RATE);

  }


  subcategoryCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.subCategory.setValue(e.CODE);
  }

  brandCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.brand.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.color.setValue(data.CODE)
  }


  vendorCodeSelected(e: any) {
    console.log(e);
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.vendor.setValue(e['ACCOUNT HEAD']);
    this.alloyMastereForm.controls.vendorRef.setValue(e.ACCODE);
  }

  typeCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.type.setValue(e.CODE);
  }

  categoryCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.category.setValue(e.CODE);
  }

  codeSelected(e: any) {
    this.alloyMastereForm.controls.code.setValue(e.PREFIX_CODE)
    this.alloyMastereForm.controls.description.setValue(e.DESCRIPTION)
    this.prefixCodeValidate()
  }
  prefixCodeValidate() {
    const code = this.alloyMastereForm.value.code;
    if (!code) {
      // Handle case where code is empty
      return;
    }
    let API = `PrefixMaster/GetPrefixMasterDetail/${code}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          let data = result.response;
          this.alloyMastereForm.controls.costCenter.setValue(data.COST_CODE)
          this.alloyMastereForm.controls.type.setValue(data.TYPE_CODE)
          this.alloyMastereForm.controls.category.setValue(data.CATEGORY_CODE)
          this.alloyMastereForm.controls.subCategory.setValue(data.SUBCATEGORY_CODE)
          this.alloyMastereForm.controls.brand.setValue(data.BRAND_CODE)
          this.alloyMastereForm.controls.description.setValue(data.DESCRIPTION)
          this.alloyMastereForm.controls.code.setValue(data.PREFIX_CODE + data.LAST_NO)
        } else {
          // this.alloyMastereForm.controls.code.setValue('')
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        // this.alloyMastereForm.controls.code.setValue('')
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  checkStockCode(): boolean {
    // if(this.content.FLAG == 'VIEW' || this.content.FLAG == 'EDIT'){
    //   return true;
    // }else{
    if (this.alloyMastereForm.value.code == '') {
      this.commonService.toastErrorByMsgId('Please enter the Prefix Code');
      return true
    }
    return false
    // } 
  }
  checkCode() {
    if (this.alloyMastereForm.value.code == '') {
      this.commonService.toastErrorByMsgId('Please enter the Prefix Code');
      return true;
    }
    return false;
  }

  priceSchemeValidate(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.priceScheme.setValue(e.PRICE_CODE)
    let API = 'PriceSchemeMaster/GetPriceSchemeMasterList/' + this.alloyMastereForm.value.priceScheme
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          let data = result.response;
          this.alloyMastereForm.controls.PRICE1.setValue(data.PRICE1)
          this.alloyMastereForm.controls.price2code.setValue(data.PRICE2)
          this.alloyMastereForm.controls.price3code.setValue(data.PRICE3)
          this.alloyMastereForm.controls.price4code.setValue(data.PRICE4)
          this.alloyMastereForm.controls.price5code.setValue(data.PRICE5)
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  costCenterSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.costCenter.setValue(e.COST_CODE);

  }
  /** checking for same account code selection */
  private isSamepriceCodeSelected(PRICE_CODE: any): boolean {
    return (
      this.alloyMastereForm.value.PRICE1 === PRICE_CODE ||
      this.alloyMastereForm.value.price2code === PRICE_CODE ||
      this.alloyMastereForm.value.price3code === PRICE_CODE ||
      this.alloyMastereForm.value.price4code === PRICE_CODE ||
      this.alloyMastereForm.value.price5code === PRICE_CODE
    );
  }


  priceCodeone(e: any) {
    if (this.checkStockCode()) return
    if (this.alloyMastereForm.value.price2code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price3code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.PRICE1) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
  }

  priceTwoCode(e: any) {
    if (this.checkStockCode()) return
    if (this.alloyMastereForm.value.price2code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price3code === this.alloyMastereForm.value.price2code || this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.price2code || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price2code) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
  }

  priceThreeCode(e: any) {
    if (this.checkStockCode()) return
    if (this.alloyMastereForm.value.price3code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price3code === this.alloyMastereForm.value.price2code || this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.price3code || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price3code) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
  }


  priceFourCode(e: any) {
    if (this.checkStockCode()) return
    if (this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.price2code || this.alloyMastereForm.value.price4code === this.alloyMastereForm.value.price3code || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price4code) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
  }

  priceFiveCode(e: any) {
    if (this.checkStockCode()) return
    if (this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.PRICE1 || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price2code || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price3code || this.alloyMastereForm.value.price5code === this.alloyMastereForm.value.price4code) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
  }

  priceOneCodeSelected(e: any) {
    if (this.checkStockCode()) return
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
    this.alloyMastereForm.controls.PRICE1.setValue(e.PRICE_CODE);
  }

  priceTwoCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price2code.setValue(e.PRICE_CODE);
  }

  priceThreeCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price3code.setValue(e.PRICE_CODE);
  }

  priceFourCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price4code.setValue(e.PRICE_CODE);

  }
  priceFiveCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same Price code');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price5code.setValue(e.PRICE_CODE);
  }

  HSNCenterSelected(e: any) {
    this.checkStockCode()
    this.alloyMastereForm.controls.hsncode.setValue(e.CODE);
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

  }
  setPostData() {
    let postData = {
      ITEM: 'Y',
      STOCK_CODE: this.commonService.nullToString(this.alloyMastereForm.value.code),
      STOCK_DESCRIPTION: this.commonService.nullToString(this.alloyMastereForm.value.description),
      CURRENCY_CODE: this.commonService.nullToString(this.alloyMastereForm.value.currency),
      CC_RATE: this.commonService.emptyToZero(this.alloyMastereForm.value.currencyRate),
      COST_CODE: this.commonService.nullToString(this.alloyMastereForm.value.costCenter),
      TYPE_CODE: this.commonService.nullToString(this.alloyMastereForm.value.type),
      CATEGORY_CODE: this.commonService.nullToString(this.alloyMastereForm.value.category),
      SUBCATEGORY_CODE: this.commonService.nullToString(this.alloyMastereForm.value.subCategory),
      BRAND_CODE: this.commonService.nullToString(this.alloyMastereForm.value.brand),
      COUNTRY_CODE: this.commonService.nullToString(this.alloyMastereForm.value.country),
      SUPPLIER_CODE: "",
      SUPPLIER_REF: this.commonService.nullToString(this.alloyMastereForm.value.vendorRef),
      DESIGN_CODE: this.commonService.nullToString(this.alloyMastereForm.value.design),
      SET_REF: this.commonService.nullToString(this.alloyMastereForm.value.design),
      PICTURE_NAME: this.commonService.nullToString(this.alloyMastereForm.value.picture_name),
      PICTURE_NAME1: this.commonService.nullToString(this.alloyMastereForm.value.picturename1),
      STOCK_FCCOST: this.commonService.emptyToZero(this.alloyMastereForm.value.weightAvgCostFC),
      STOCK_LCCOST: this.commonService.emptyToZero(this.alloyMastereForm.value.weightAvgCostLC),
      PRICE1PER: this.alloyMastereForm.value.PRICE1,
      PRICE2PER: this.commonService.nullToString(this.alloyMastereForm.value.price2code),
      PRICE3PER: this.commonService.nullToString(this.alloyMastereForm.value.price3code),
      PRICE4PER: this.commonService.nullToString(this.alloyMastereForm.value.price4code),
      PRICE5PER: this.commonService.nullToString(this.alloyMastereForm.value.price5code),
      PRICE1FC: this.commonService.emptyToZero(this.alloyMastereForm.value.price1Fc),
      PRICE1LC: this.commonService.emptyToZero(this.alloyMastereForm.value.price1Lc),
      PRICE2FC: this.commonService.emptyToZero(this.alloyMastereForm.value.price2Fc),
      PRICE2LC: this.commonService.emptyToZero(this.alloyMastereForm.value.price2Lc),
      PRICE3FC: this.commonService.emptyToZero(this.alloyMastereForm.value.price3Fc),
      PRICE3LC: this.commonService.emptyToZero(this.alloyMastereForm.value.price3Lc),
      PRICE4FC: this.commonService.emptyToZero(this.alloyMastereForm.value.price4Fc),
      PRICE4LC: this.commonService.emptyToZero(this.alloyMastereForm.value.price4Lc),
      PRICE5FC: this.commonService.emptyToZero(this.alloyMastereForm.value.price5Fc),
      PRICE5LC: this.commonService.emptyToZero(this.alloyMastereForm.value.price5Lc),
      CHARGE1FC: 0,
      CHARGE1LC: 0,
      CHARGE2FC: 0,
      CHARGE2LC: 0,
      CHARGE3FC: 0,
      CHARGE3LC: 0,
      CHARGE4FC: 0,
      CHARGE4LC: 0,
      CHARGE5FC: 0,
      CHARGE5LC: 0,
      SHORT_ID: "",
      COLOR: this.commonService.nullToString(this.alloyMastereForm.value.color),
      CLARITY: this.commonService.nullToString(this.alloyMastereForm.value.clarity),
      SIZE: this.commonService.nullToString(this.alloyMastereForm.value.size),
      SIEVE: "",
      SHAPE: "",
      GRADE: "",
      FLUOR: this.commonService.nullToString(this.alloyMastereForm.value.fluorescence),
      FINISH: "",
      CERT_BY: this.commonService.nullToString(this.alloyMastereForm.value.certificateby),
      CERT_NO: this.commonService.nullToString(this.alloyMastereForm.value.certificateno),
      CERT_DATE: 0,
      GRIDLE: "",
      CULET: "",
      TWIDTH: 0,
      CRHEIGHT: 0,
      PAVDEPTH: 0,
      OVERALL: this.commonService.nullToString(this.alloyMastereForm.value.overall),
      MEASURE: "",
      CERT_PICTURE_NAME: "",
      TAG_LINES: "",
      COMMENTS: "",
      WATCH_TYPE: 0,
      PEARL_TYPE: 0,
      STRAP_TYPE: "",
      STRAP_COLOR: "",
      GW: 0,
      MODEL_NO: "",
      MODEL_YEAR: 0,
      OPENED_ON:this.commonService.formatDateTime(this.currentDate),
      OPENED_BY: this.commonService.nullToString(this.alloyMastereForm.value.userName),
      FIRST_TRN:this.commonService.formatDDMMYY(this.currentDate),
      LAST_TRN: this.commonService.formatDDMMYY(this.currentDate),
      MID: this.content?.MID || 0,
      PRINTED: 0,  
      PURVOCTYPE_NO: "",
      PURPARTY: "",
      PURDATE: 0,
      PURAMOUNT: 0,
      PURBRLOC: "",
      SALVOCTYPE_NO: "",
      SALPARTY: this.commonService.nullToString(this.alloyMastereForm.value.salesman),
      SALDATE: 0,
      SALAMOUNT: 0,
      SALBRLOC: "",
      METAL_TOTALGROSSWT: 0,
      METAL_TOTALAMOUNT: 0,
      METAL_TOTALMAKING: 0,
      LOOSE_TOTALWT: 0,
      LOOSE_TOTALAMOUNT: 0,
      COLOR_TOTALWT: 0,
      COLOR_TOTALAMOUNT: 0,
      PEARL_TOTALWT: 0,
      PEARL_TOTALAMOUNT: 0,
      MANF_MID: 0,
      MANF_BR_VOCTYPE_NO: "",
      WATCH_REFNO: "",
      WATCH_MODELNAME: "",
      WATCH_MODELNO: "",
      WATCH_MATERIAL: "",
      WATCH_DIALCOLOR: "",
      WATCH_BAZEL: "",
      WATCH_MOVEMENT: "",
      WATCH_STATUS: "",
      WATCH_WEIGHT: "",
      UNIT: "",
      PCS_PERUNIT: this.commonService.emptyToZero(this.alloyMastereForm.value.PCSunit),
      TAG_LINESWOENTER: "",
      PICTURE_NAME_THUMBNAIL: "",
      GOLDSMITH: "",
      STONESETTER: "",
      STD_LCCOST: 0,
      TAG1: "",
      TAG2: "",
      TAG3: "",
      TAG4: "",
      TAG5: "",
      WEIGHT_PER_PCS: 0,
      DETAILDESCRIPTION: "",
      PROD_CUSTOMER_CODE: "",
      TDWT: 0,
      RD: 0,
      TB: 0,
      PR: 0,
      MQ: 0,
      SO: 0,
      OT: 0,
      RUBY: 0,
      EMERALD: 0,
      SAPHIRE: 0,
      WATCH_SERIALNO: "",
      CERT_PRINTED: 0,
      NOQTYCHANGE: 0,
      STYLE: this.commonService.nullToString(this.alloyMastereForm.value.style),
      CUSTOMERSKU: "",
      INITIAL_BRPURVOCTYPE_NO: "null",
      STOCK_DESCRIPTION_OTHERS: this.commonService.nullToString(this.alloyMastereForm.value.otherdesc),
      TIME_CODE: this.commonService.nullToString(this.alloyMastereForm.value.time),
      RANGE_CODE: this.commonService.nullToString(this.alloyMastereForm.value.range),
      COMMENTS_CODE: "",
      NOTES: "",
      ASK: "",
      SELL: "",
      CUT: "",
      POLISH: "",
      SYMMETRY: "",
      UDF1: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_1),
      UDF2: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_2),
      UDF3: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_3),
      UDF4: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_4),
      UDF5: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_5),
      UDF6: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_6),
      UDF7: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_7),
      UDF8: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_8),
      UDF9: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_9),
      UDF10: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_10),
      UDF11: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_11),
      UDF12: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_12),
      UDF13: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_13),
      UDF14: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_14),
      UDF15: this.commonService.nullToString(this.alloyMastereForm.value.userdefined_15),
      PROMOTIONALITEM: 0,
      EXCLUDEGSTVAT: 0,
      RRR_CARAT: 0,
      RRR_PERCENT: 0,
      NACRE: "",
      SURFACE: "",
      MATCHING: "",
      TREATMENT: "",
      CUTSTYLE_CROWN: "",
      CUTSTYLE_PAVILION: "",
      TRANSPARENCY: "",
      CONCLUSION: "",
      SPECIES: "",
      VARIETY: "",
      CERTIFICATETYPE: "",
      SOURCETYPE: "",
      CHARACTERISTIC: "",
      TONE_SATURATION: "",
      SHAPEAPPAREL: "",
      DIA_PCS: this.commonService.emptyToZero(this.alloyMastereForm.value.diamondsPcs),
      DIA_CARAT: this.commonService.emptyToZero(this.alloyMastereForm.value.diamondsCarat),
      DIA_VALUEFC: this.commonService.emptyToZero(this.alloyMastereForm.value.diamondsFC),
      DIA_VALUECC: this.commonService.emptyToZero(this.alloyMastereForm.value.diamondsLC),
      COLOR_PCS: this.commonService.emptyToZero(this.alloyMastereForm.value.colorstonePcs),
      COLOR_CARAT: this.commonService.emptyToZero(this.alloyMastereForm.value.colorstoneCarat),
      COLOR_VALUEFC: this.commonService.emptyToZero(this.alloyMastereForm.value.colorstoneFC),
      COLOR_VALUECC: this.commonService.emptyToZero(this.alloyMastereForm.value.colorstoneLC),
      PEARL_PCS: this.commonService.emptyToZero(this.alloyMastereForm.value.pearlsPcs),
      PEARL_CARAT: this.commonService.emptyToZero(this.alloyMastereForm.value.pearlsCarat),
      PEARL_VALUEFC: this.commonService.emptyToZero(this.alloyMastereForm.value.pearlsFC),
      PEARL_VALUECC: this.commonService.emptyToZero(this.alloyMastereForm.value.pearlsLC),
      OTSTONES_PCS: this.commonService.emptyToZero(this.alloyMastereForm.value.otstonesPcs),
      OTSTONES_CARAT: this.commonService.emptyToZero(this.alloyMastereForm.value.otstonesCarat),
      OTSTONES_VALUEFC: this.commonService.emptyToZero(this.alloyMastereForm.value.otstonesFC),
      OTSTONES_VALUECC: this.commonService.emptyToZero(this.alloyMastereForm.value.otstonesLC),
      METAL_GROSSWT: this.commonService.emptyToZero(this.alloyMastereForm.value.metalGrams),
      METAL_VALUEFC: this.commonService.emptyToZero(this.alloyMastereForm.value.metalFC),
      METAL_VALUECC: this.commonService.emptyToZero(this.alloyMastereForm.value.metalLC),
      TOTPCS: this.commonService.emptyToZero(this.alloyMastereForm.value.totalPcs),
      TOTCARAT: this.commonService.emptyToZero(this.alloyMastereForm.value.totalCarat),
      TOTGMS: this.commonService.emptyToZero(this.alloyMastereForm.value.totalGrams),
      TOTVFC: this.commonService.emptyToZero(this.alloyMastereForm.value.totalFC),
      TOTVLC: this.commonService.emptyToZero(this.alloyMastereForm.value.totalLC),
      TOTALFC: 0,
      TOTALCC: 0,
      LAST_EDT_BY: this.commonService.nullToString(this.alloyMastereForm.value.lasteditby),
      LAST_EDT_ON: "null",
      UNITCODE: "",
      UNITWT: 0,
      CHKUNIT: 0,
      CHKCOMPONENTSUMMARY: "",
      CHKCOMPONENTDETAIL: "",
      CMBNATURE: "",
      CMBTYPE: "",
      RFID_TAG: "",
      SKUDESCRIPTION: "",
      ON_OFF: 0,
      NOTFORSALES: 0,
      TRANSFERED_WEB: 0,
      CALCULATE_COSTING: 0,
      QUALITY_CODE: "",
      PARENTSTOCK_CODE: "",
      PARTNER_CODE: "",
      KPNUMBER: "",
      HSN_CODE: this.commonService.nullToString(this.alloyMastereForm.value.HSNcode),
      ITEM_ONHOLD: 0,
      POS_CUST_CODE: "",
      CONSIGNMENT: 0,
      POSGROSSWT: this.commonService.emptyToZero(this.alloyMastereForm.value.grossWt),
      HANDLING_CHARGEFC: 0,
      HANDLING_CHARGELC: 0,
      ORG_COSTFC: 0,
      ORG_COSTLC: 0,
      VATONMARGIN: 0,
      SALESPERSON_CODE: "",
      ORDSALESPERSON_CODE: "",
      BATCH_STOCK: 0,
      BATCH_PREFIX: "",
      SIEVE_SET: "",
      MODEL_CODE: this.commonService.nullToString(this.alloyMastereForm.value.modelcode),
      NOOF_PLAT: this.commonService.emptyToZero(this.alloyMastereForm.value.noofplat),
      PLAT_CHARGESFC: 0,
      PLAT_CHARGESLC: 0,
      CERT_CHARGESLC: 0,
      CERT_CHARGESFC: 0,
      UNFIX_DIAMOND_ITEM: 0,
      ALLOW_WITHOUT_RATE: 0,
      RRR_STOCK_REF: "",
      MARKETCOSTFC: this.commonService.emptyToZero(this.alloyMastereForm.value.marketcost),
      MARKETCOSTLC: 0,
      RRR_PRICE_UPDATED: true,
      RRR_PRICE_UPDDATE:  this.commonService.formatDateTime(this.currentDate),
      SALESCODE: 0,
      RRR_PUR_CARAT: 0,
      RRR_PUR_PERCENT: 0,
      RRR_SAL_PERCENT: 0,
      RRR_OTHER_PERCENT: 0,
      SET_PICTURE_NAME: "",
      PACKET_ITEM: 0,
      PACKET_WT: 0,
      SALES_TAGLINES: "",
      ALLOW_ZEROPCS: this.onchangeCheckBox(this.alloyMastereForm.value.allowpcs),
      NOOF_CERT: this.commonService.emptyToZero(this.alloyMastereForm.value.noofcert),
      ADDITIONAL_RATEFC: 0,
      ADDITIONAL_RATELC: 0,
      WBOXWOUTBOX: 0,
      ALLOW_NEGATIVE: 0,
      EXCLUDE_TRANSFER_WT: this.onchangeCheckBox(this.alloyMastereForm.value.allowpcs),
      WT_VAR_PER: 0,
      HALLMARKING: this.commonService.nullToString(this.alloyMastereForm.value.hallmarking),
      WOO_CATEGORY_ID: 0,
      DESIGN_DESC: "",
      COST_CENTER_DESC: "",
      SUPPLIER_DESC: "",
      ORDSALESPERSON_DESC: "",
      COUNTRY_DESC: "",
      TYPE_DESC: this.commonService.nullToString(this.alloyMastereForm.value.Type),
      CATEGORY_DESC: "",
      SUBCATEGORY_DESC: "",
      BRAND_DESC: "",
      COLOR_DESC: "",
      FLUORESCENCE_DESC: "",
      CLARITY_DESC: "",
      RANGE_DESC: "",
      STYLE_DESC: "",
      HSN_DESC: "",
      TIME_DESC: "",
      SIZE_DESC: "",
      SIEVE_SET_DESC: "",
      SIEVE_DESC: "",
      SHAPE_DESC: "",
      FINISH_DESC: "",
      GRADE_DESC: "",
      CUT_DESC: "",
      POLISH_DESC: "",
      SYMMETRY_DESC: "",
      UNITCODE_DESC: "",
      CERT_BY_DESC: "",
      STRAP_TYPE_DESC: "",
      WATCH_MATERIAL_DESC: "",
      STRAP_COLOR_DESC: "",
      WATCH_DIALCOLOR_DESC: "",
      WATCH_BAZEL_DESC: "",
      WATCH_MOVEMENT_DESC: "",
      UDF1_DESC: "",
      UDF2_DESC: "",
      UDF3_DESC: "",
      UDF4_DESC: "",
      UDF5_DESC: "",
      UDF6_DESC: "",
      UDF7_DESC: "",
      UDF8_DESC: "",
      UDF9_DESC: "",
      UDF10_DESC: "",
      UDF11_DESC: "",
      UDF12_DESC: "",
      UDF13_DESC: "",
      UDF14_DESC: "",
      UDF15_DESC: "",
      INITIAL_PURVOCTYPE_NO: "",
      YIELD: 0,
      MINE_REF: "",
      MAIN_STOCK_CODE: "",
      METALKARAT: "",
      UNQ_DESIGN_ID: "",
      CHARGE6FC: 0,
      CHARGE6LC: 0,
      CHARGE7FC: 0,
      CHARGE7LC: 0,
      CHARGE8FC: 0,
      CHARGE8LC: 0,
      CHARGE9FC: 0,
      CHARGE9LC: 0,
      CHARGE10FC: 0,
      CHARGE10LC: 0,
      MANUFACTURE_ITEM: 0,
      diamondStockDetails: [
        {
          UNIQUEID: 0,
          SRNO: 0,
          METALSTONE: "",
          DIVCODE: "",
          KARAT: "",
          CARAT: 0,
          GROSS_WT: 0,
          PCS: 0,
          RATE_TYPE: "",
          CURRENCY_CODE: "",
          RATE: 0,
          AMOUNTFC: 0,
          AMOUNTLC: 0,
          MAKINGRATE: 0,
          MAKINGAMOUNT: 0,
          COLOR: "",
          CLARITY: "",
          SIEVE: "",
          SHAPE: "",
          TMPDETSTOCK_CODE: "",
          DSIZE: "",
          LABCHGCODE: "",
          PRICECODE: "",
          DESIGN_CODE: "",
          DETLINEREMARKS: "",
          MFTSTOCK_CODE: "",
          STOCK_CODE: "",
          METALRATE: 0,
          LABOURCODE: "",
          STONE_TYPE: "",
          STONE_WT: 0,
          NET_WT: 0,
          LOT_REFERENCE: "",
          INCLUDEMETALVALUE: true,
          FINALVALUE: 0,
          PERCENTAGE: 0,
          HANDLING_CHARGEFC: 0,
          HANDLING_CHARGELC: 0,
          PROCESS_TYPE: "",
          SELLING_RATE: 0,
          LAB_RATE: 0,
          LAB_AMTFC: 0,
          LAB_AMTLC: 0,
          SIEVE_SET: "",
          PURITY: 0,
          PUREWT: 0,
          RRR_STOCK_REF: "",
          FINALVALUELC: 0,
          LABCHGCODE1: "",
          LABCHGCODE2: "",
          LABRATE1: 0,
          LABRATE2: 0,
          CERT_REF: "",
          FROMEXISTINGSTOCK: 0,
          INSERTEDSTOCKCODE: "",
          INSERTEDSTOCKCOST: 0,
          POLISHED: "",
          RAPPRICE: 0,
          PIQUE: "",
          GRAINING: "",
          FLUORESCENCE: "",
          WEIGHT: 0,
        },
      ],
    };
    console.log(postData, 'postData');

    return postData
  }
  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }
    if (this.alloyMastereForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = "DiamondStockMaster/InsertDiamondStockMaster";
    let postData
    postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2239') || 'Saved Successfully',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.alloyMastereForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else if (result.status == "Failed") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2239') || 'Code Already Exists',
            text: '',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
            }
          });
        }
        else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }



  updateMeltingType() {
    let API = 'DiamondStockMaster/UpdateDiamondStockMaster/' + this.content.STOCK_CODE;
    let postdata
    postdata = this.setPostData()
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postdata)
      .subscribe((result) => {
        if (result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2186') || 'Updated Successfully',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.alloyMastereForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (this.content && this.content.FLAG == 'VIEW' && this.content.FLAG == 'EDIT') return
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'DiamondStockMaster/DeleteDiamondStockMaster/' + this.alloyMastereForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.alloyMastereForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.alloyMastereForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  calculatePriceFCDetails(event: any){
    console.log("Input changed: ", event.target.value);
    var currencyRate = event.target.value;
    var weightAvgCostFC = this.alloyMastereForm.value.weightAvgCostFC;
    this.alloyMastereForm.controls.price1Fc.setValue(currencyRate * weightAvgCostFC); 
    this.alloyMastereForm.controls.price2Fc.setValue(currencyRate * weightAvgCostFC); 
    this.alloyMastereForm.controls.price3Fc.setValue(currencyRate * weightAvgCostFC); 
    this.alloyMastereForm.controls.price4Fc.setValue(currencyRate * weightAvgCostFC); 
    this.alloyMastereForm.controls.price5Fc.setValue(currencyRate * weightAvgCostFC); 
  } 
  
}
