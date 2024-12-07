import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';


@Component({
  selector: 'app-alloy-master',
  templateUrl: './alloy-master.component.html',
  styleUrls: ['./alloy-master.component.scss']
})
export class AlloyMasterComponent implements OnInit {
  @ViewChild('overlaycodeSearch') overlaycodeSearch!: MasterSearchComponent;
  @ViewChild('overlaycostCenterSearch') overlaycostCenterSearch!: MasterSearchComponent;
  @ViewChild('overlaytypeSearch') overlaytypeSearch!: MasterSearchComponent;

  @ViewChild('overlaycategorySearch') overlaycategorySearch!: MasterSearchComponent;
  @ViewChild('overlaysubCategorySearch') overlaysubCategorySearch!: MasterSearchComponent;
  @ViewChild('overlaybrandSearch') overlaybrandSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaycurrencySearch') overlaycurrencySearch!: MasterSearchComponent;
  @ViewChild('overlayhsncodeSearch') overlayhsncodeSearch!: MasterSearchComponent;
  @ViewChild('overlayvendorSearch') overlayvendorSearch!: MasterSearchComponent;
  @ViewChild('overlayPriceScheme') overlayPriceScheme!: MasterSearchComponent;

  @ViewChild('overlayprice1codeSearch') overlayprice1codeSearch!: MasterSearchComponent;
  @ViewChild('overlayprice2codeSearch') overlayprice2codeSearch!: MasterSearchComponent;
  @ViewChild('overlayprice3codeSearch') overlayprice3codeSearch!: MasterSearchComponent;
  @ViewChild('overlayprice4codeSearch') overlayprice4codeSearch!: MasterSearchComponent;
  @ViewChild('overlayprice5codeSearch') overlayprice5codeSearch!: MasterSearchComponent;



  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;
  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  viewMode: boolean = false;
  isDisabled: boolean = false;
  tableData: any[] = [];
  price1Array: any = [];
  price2Array: any = [];
  price3Array: any = [];
  price4Array: any = [];
  price5Array: any = [];
  priceSchemeDetails: any[] = []

  isChecked: boolean = false;
  currentDate = new Date();
  image: string | ArrayBuffer | null | undefined;
  url: any;
  isDisableSaveBtn: boolean = false;
  isCurrencySelected: boolean = false;
  isWeightAvgCost: boolean = false;

  numericValue!: number;
  branchCode: any = localStorage.getItem('userbranch');
  currencyDt: any;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = true;
  prefixMasterDetail: any;
  curr_type: boolean = true;
  // master search data starts
  codeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'CODE',
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
    LOAD_ONCLICK: true,
  }
  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    SEARCH_HEADING: 'Account Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE = '" + this.branchCode + "' AND AC_OnHold = 0 ",
    // WHERE BRANCH_CODE = 'DMCC' AND AC_OnHold = 0
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    WHERECONDITION: "TYPES = 'HSN MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency type',
    SEARCH_VALUE: '',
    // WHERECONDITION: "CURRENCY_CODE<> ''",
    WHERECONDITION: `CMBRANCH_CODE = '${this.branchCode}'`,
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
  // master search data ends
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
    price1code: [''],
    price1per: [''],
    price1Fc: [''],
    price1Lc: [''],
    price2code: [''],
    price2per: [''],
    price2Fc: [''],
    price2Lc: [''],
    price3code: [''],
    price3per: [''],
    price3Fc: [''],
    price3Lc: [''],
    price4code: [''],
    price4per: [''],
    price4Fc: [''],
    price4Lc: [''],
    price5code: [''],
    price5per: [''],
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
    selectMasterOnly: [true],
    picture_name: [''],
    FLAG: ['']
  });
  mode!: string;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.branchCode = this.commonService.branchCode;
    this.currencyDt = this.commonService.compCurrency;
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.alloyMastereForm.controls.createdBy.setValue(this.commonService.userName);
    this.isCurrencySelected = true;

    if (this.content?.FLAG) {
      this.setAllInitialValues()
      if (this.content.FLAG == 'EDIT') {
        this.isDisabled = !this.isDisabled;
        this.editMode = true;
        this.editableMode = true;
      } else if (this.content.FLAG == 'VIEW') {
        // this.alloyMastereForm.disable()
        this.isCurrencySelected = true;
        this.isDisabled = true;
        this.editMode = true;
        this.viewMode = true
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteAlloyMaster()
      }
    } else {
      this.renderer.selectRootElement('#code')?.focus();
    }
    this.setCompanyCurrency();
  }

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  price1LcChange() {
    if (this.checkCode1Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.CCToFC(form.currency, form.price1Lc)
    this.alloyMastereForm.get('price1Fc')!.setValue(
      this.commonService.decimalQuantityFormat(curr, 'THREE')
    );
    // Update percentage calculation
    this.alloyMastereForm.get('price1per')!.setValue(this.percentageCalculate(form.price1Lc));
    console.log(this.percentageCalculate(form.price1Lc));

  }

  price2LcChange() {
    if (this.checkCode2Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.CCToFC(form.currency, form.price2Lc)
    this.alloyMastereForm.get('price2Fc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'THREE'));
    // Update percentage calculation
    this.alloyMastereForm.get('price2per')!.setValue(this.percentageCalculate(form.price2Lc));
    console.log(this.percentageCalculate(form.price2Lc));
  }

  price3LcChange() {
    if (this.checkCode3Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.CCToFC(form.currency, form.price3Lc)
    this.alloyMastereForm.get('price3Fc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'THREE'));
    // Update percentage calculation
    this.alloyMastereForm.get('price3per')!.setValue(this.percentageCalculate(form.price3Lc));
  }

  price4LcChange() {
    if (this.checkCode4Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.CCToFC(form.currency, form.price4Lc)
    this.alloyMastereForm.get('price4Fc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'THREE'));
    // Update percentage calculation
    this.alloyMastereForm.get('price4per')!.setValue(this.percentageCalculate(form.price4Lc));
  }

  price5LcChange() {
    if (this.checkCode5Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.CCToFC(form.currency, form.price5Lc)
    this.alloyMastereForm.get('price5Fc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'THREE'));
    // Update percentage calculation
    this.alloyMastereForm.get('price5per')!.setValue(this.percentageCalculate(form.price5Lc));
  }

  price1FcChange() {
    if (this.checkCode1Price()) return
    const form = this.alloyMastereForm.value;
    let curr = this.commonService.FCToCC(form.currency, form.price1Fc)
    this.alloyMastereForm.get('price1Lc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'AMOUNT'));

    // Update percentage calculation
    this.alloyMastereForm.get('price1per')!.setValue(this.percentageCalculate(form.price1Fc));

  }

  price2FcChange() {
    if (this.checkCode2Price()) return

    const form = this.alloyMastereForm.value;
    let curr = this.commonService.FCToCC(form.currency, form.price2Fc)
    this.alloyMastereForm.get('price2Lc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'AMOUNT'));
    console.log(curr);
    // Update percentage calculation
    this.alloyMastereForm.get('price2per')!.setValue(this.percentageCalculate(form.price2Fc));
    console.log(this.percentageCalculate(form.price2Fc));
  }

  price3FcChange() {
    if (this.checkCode3Price()) return

    const form = this.alloyMastereForm.value;
    let curr = this.commonService.FCToCC(form.currency, form.price3Fc)
    this.alloyMastereForm.get('price3Lc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'AMOUNT'));
    console.log(curr);
    // Update percentage calculation
    this.alloyMastereForm.get('price3per')!.setValue(this.percentageCalculate(form.price3Fc));
    console.log(this.percentageCalculate(form.price3Fc));
  }

  price4FcChange() {
    if (this.checkCode4Price()) return

    const form = this.alloyMastereForm.value;
    let curr = this.commonService.FCToCC(form.currency, form.price4Fc)
    this.alloyMastereForm.get('price4Lc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'AMOUNT'));
    console.log(curr);
    // Update percentage calculation
    this.alloyMastereForm.get('price4per')!.setValue(this.percentageCalculate(form.price4Fc));
    console.log(this.percentageCalculate(form.price4Fc));
  }

  price5FcChange() {
    if (this.checkCode5Price()) return

    const form = this.alloyMastereForm.value;
    let curr = this.commonService.FCToCC(form.currency, form.price5Fc)
    this.alloyMastereForm.get('price5Lc')!.setValue(this.commonService.decimalQuantityFormat(curr, 'AMOUNT'));
    console.log(curr);
    // Update percentage calculation
    this.alloyMastereForm.get('price5per')!.setValue(this.percentageCalculate(form.price5Fc));
    console.log(this.percentageCalculate(form.price5Fc));
  }


  setFormValues() {
    this.alloyMastereForm.controls.code.setValue(this.content.STOCK_CODE)
    this.alloyMastereForm.controls.description.setValue(this.content.STOCK_DESCRIPTION)
    this.alloyMastereForm.controls.description.setValue(this.content.STOCK_DESCRIPTION)
    this.alloyMastereForm.controls.brand.setValue(this.content.BRAND_CODE)
    this.alloyMastereForm.controls.category.setValue(this.content.CATEGORY_CODE)
    this.alloyMastereForm.controls.costCenter.setValue(this.content.COST_CODE)
    //this.alloyMastereForm.controls.brand.setValue(this.content.DESIGN_CODE)
    this.alloyMastereForm.controls.color.setValue(this.content.COLOR)
    this.alloyMastereForm.controls.type.setValue(this.content.TYPE_CODE)
    this.alloyMastereForm.controls.subCategory.setValue(this.content.SUBCATEGORY_CODE)
    this.alloyMastereForm.controls.vendor.setValue(this.content.SUPPLIER_CODE)
    this.alloyMastereForm.controls.vendorRef.setValue(this.content.SUPPLIER_REF)

    // this.commonService.decimalQuantityFormat(0, 'METAL')
    this.alloyMastereForm.controls.price1Lc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE1LC))

    this.alloyMastereForm.controls.price2Lc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE2LC))

    this.alloyMastereForm.controls.price3Lc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE3LC))

    this.alloyMastereForm.controls.price4Lc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE4LC))

    this.alloyMastereForm.controls.price5Lc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE5FC))

    this.alloyMastereForm.controls.price1Fc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE1FC))

    this.alloyMastereForm.controls.price2Fc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE2FC))

    this.alloyMastereForm.controls.price3Fc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE3FC))

    this.alloyMastereForm.controls.price4Fc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE4FC))

    this.alloyMastereForm.controls.price5Fc.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE5FC))


    this.alloyMastereForm.controls.weightAvgCostFC.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.STOCK_FCCOST))

    this.alloyMastereForm.controls.weightAvgCostLC.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.STOCK_LCCOST));

    this.alloyMastereForm.controls.hsncode.setValue(this.content.HSN_CODE)
    this.alloyMastereForm.controls.allowpcs.setValue(this.viewchangeYorN(this.content.ALLOW_ZEROPCS))
    this.alloyMastereForm.controls.excludeTransferWt.setValue(this.viewchangeYorN(this.content.EXCLUDE_TRANSFER_WT))
    this.alloyMastereForm.controls.silveralloy.setValue(this.viewchangeYorN(this.content.ALLOW_NEGATIVE))
  }


  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.alloyMastereForm.controls.currency.setValue(CURRENCY_CODE);

    if (this.commonService.allBranchCurrency && this.commonService.allBranchCurrency.length > 0) {
      const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
      if (CURRENCY_RATE.length > 0) {
        this.alloyMastereForm.controls.currencyRate.setValue(this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE'));
      } else {
        console.error("No matching currency rate found for the given currency code.");
      }
    } else {
      console.error("allBranchCurrency is not defined or empty.");
    }
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

  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.alloyMastereForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }

  calculateWeightAvgCostFC(event: any) {
    let form = this.alloyMastereForm.value;
    let weightAvgCostLC = this.commonService.FCToCC(form.currency, event.target.value);
    this.setValueWithDecimal('weightAvgCostLC', weightAvgCostLC, 'AMOUNT')
    if (this.alloyMastereForm.value.priceScheme != "") {
      this.fillPriceSchemeDetails();
    } else {
      this.validateStockLC();
    }
  }

  calculateWeightAvgCostLC(event: any) {
    this.isWeightAvgCost = true;
    let form = this.alloyMastereForm.value;
    let weightAvgCostFC = this.commonService.CCToFC(form.currency, event.target.value);
    this.setValueWithDecimal('weightAvgCostFC', weightAvgCostFC, 'AMOUNT')
    if (this.alloyMastereForm.value.priceScheme != "") {
      this.fillPriceSchemeDetails();
    } else {
      this.validateStockLC()
    }
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
    if (e == true) {
      return true;
    } else {
      return false;
    }
  }
  viewchangeYorN(e: any) {
    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }


  checkCostCenter(event: any) {


  }
  selectMasterOnlyChange(event: any) {
    this.codeData.VIEW_ICON = this.alloyMastereForm.value.selectMasterOnly;
  }
  alloyCodeValidate(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    if (this.alloyMastereForm.value.selectMasterOnly) {
      this.validateLookupField(event, LOOKUPDATA, FORMNAME)
    } else {
      this.checkCodeExists()
    }
  }
  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value

    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    // this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.alloyMastereForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.showOverleyPanel(event, FORMNAME)
          return
        }
        this.alloyMasterFormChecks(FORMNAME)// for validations
        if(FORMNAME == 'priceScheme'){

          let postData = {
            "SPID": "066",
            "parameter": {
              "PRICE_SCHEME_CODE": this.alloyMastereForm.value.priceScheme,
            }
          }
          // if(this.alloyMastereForm.value.price5code.length > 0) return
          let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
            .subscribe((result) => {
              if (result.status == "Success") {
                this.priceSchemeDetails = result.dynamicData[0] || []
                if (this.priceSchemeDetails?.length > 0) {
                  this.resetAllPriceDetails();
                  this.fillPriceSchemeDetails();
                } else {
                  this.commonService.toastErrorByMsgId('MSG1531')
                }

              }
            }, err => {
              this.commonService.toastErrorByMsgId('MSG1531')
            })
          this.subscriptions.push(Sub)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**use: for checking form validations */
  alloyMasterFormChecks(FORMNAME: string) {
    switch (FORMNAME) {
      case 'code':
        this.prefixCodeValidate()
        break;
      case 'price1code':
        this.setPriceCodeFromAPI(this.alloyMastereForm.value.price1code, FORMNAME)
        break;
      case 'price2code':
        this.setPriceCodeFromAPI(this.alloyMastereForm.value.price2code, FORMNAME)
        break;
      case 'price3code':
        this.setPriceCodeFromAPI(this.alloyMastereForm.value.price3code, FORMNAME)
        break;
      case 'price4code':
        this.setPriceCodeFromAPI(this.alloyMastereForm.value.price4code, FORMNAME)
        break;
      case 'price5code':
        this.setPriceCodeFromAPI(this.alloyMastereForm.value.price5code, FORMNAME)
        break;
      case 'currency':
        if (this.alloyMastereForm.value.priceScheme != "") {
          this.fillPriceSchemeDetails();
        } else {
          this.validateStockLC()
        }
        break;
      default:
        break;
    }
  }
  resetAllPriceDetails() {
    this.alloyMastereForm.controls.price1code.reset(); //
    this.alloyMastereForm.controls.price2code.reset();
    this.alloyMastereForm.controls.price3code.reset();
    this.alloyMastereForm.controls.price4code.reset();
    this.alloyMastereForm.controls.price5code.reset();
    this.alloyMastereForm.controls.price1Lc.reset();
    this.alloyMastereForm.controls.price1Fc.reset();
    this.alloyMastereForm.controls.price1per.reset();
    this.alloyMastereForm.controls.price2Lc.reset();
    this.alloyMastereForm.controls.price2Fc.reset();
    this.alloyMastereForm.controls.price2per.reset();
    this.alloyMastereForm.controls.price2per.reset();
    this.alloyMastereForm.controls.price3Lc.reset();
    this.alloyMastereForm.controls.price3Fc.reset();
    this.alloyMastereForm.controls.price3per.reset();
    this.alloyMastereForm.controls.price4Lc.reset();
    this.alloyMastereForm.controls.price4Fc.reset();
    this.alloyMastereForm.controls.price4per.reset();
    this.alloyMastereForm.controls.price5Lc.reset();
    this.alloyMastereForm.controls.price5Fc.reset();
    this.alloyMastereForm.controls.price5per.reset();
  }
  priceSchemeValidate(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.priceScheme.setValue(e.PRICE_CODE)

    let postData = {
      "SPID": "066",
      "parameter": {
        "PRICE_SCHEME_CODE": this.alloyMastereForm.value.priceScheme,
      }
    }
    // if(this.alloyMastereForm.value.price5code.length > 0) return
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.priceSchemeDetails = result.dynamicData[0] || []
          if (this.priceSchemeDetails?.length > 0) {
            this.resetAllPriceDetails();
            this.fillPriceSchemeDetails();
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  fillPriceSchemeDetails() {
    if (this.viewMode) {
      return; // Exit the function early if in viewMode
    }
    // this.resetAllPriceDetails()
    let form = this.alloyMastereForm.value;
    this.priceSchemeDetails.forEach((item: any, i: any) => {
      // this.alloyMastereForm.controls[item.PRICE_NUMBER].setValue(item.PRICE_CODE)
      if (item.PRICE_NUMBER == 'PRICE1') {
        this.alloyMastereForm.controls.price1code.setValue(item.PRICE_CODE)
        this.alloyMastereForm.controls.price1Lc.setValue(this.TagPrice_Calculation(item));
        this.alloyMastereForm.controls.price1Fc.setValue(
          this.commonService.CCToFC(form.currency, this.alloyMastereForm.controls.price1Lc.value)
        );
        this.alloyMastereForm.controls.price1per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price1Lc));
      }
      if (item.PRICE_NUMBER == 'PRICE2') {
        this.alloyMastereForm.controls.price2code.setValue(item.PRICE_CODE)
        this.alloyMastereForm.controls.price2Lc.setValue(this.TagPrice_Calculation(item));
        this.alloyMastereForm.controls.price2Fc.setValue(
          this.commonService.CCToFC(form.currency, this.alloyMastereForm.controls.price2Lc.value)
        );
        this.alloyMastereForm.controls.price2per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price2Lc));
      }
      if (item.PRICE_NUMBER == 'PRICE3') {
        this.alloyMastereForm.controls.price3code.setValue(item.PRICE_CODE)
        this.alloyMastereForm.controls.price3Lc.setValue(this.TagPrice_Calculation(item));
        this.alloyMastereForm.controls.price3Fc.setValue(
          this.commonService.CCToFC(form.currency, this.alloyMastereForm.controls.price3Lc.value)
        );
        this.alloyMastereForm.controls.price3per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price3Lc))
        console.log(this.alloyMastereForm.controls.price3per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price3Lc)));

      }
      if (item.PRICE_NUMBER == 'PRICE4') {
        this.alloyMastereForm.controls.price4code.setValue(item.PRICE_CODE)
        this.alloyMastereForm.controls.price4Lc.setValue(this.TagPrice_Calculation(item));
        this.alloyMastereForm.controls.price4Fc.setValue(
          this.commonService.CCToFC(form.currency, this.alloyMastereForm.controls.price4Lc.value)
        );
        this.alloyMastereForm.controls.price4per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price4Lc))
      }
      if (item.PRICE_NUMBER == 'PRICE5') {
        this.alloyMastereForm.controls.price5code.setValue(item.PRICE_CODE)
        this.alloyMastereForm.controls.price5Lc.setValue(this.TagPrice_Calculation(item));
        this.alloyMastereForm.controls.price5Fc.setValue(
          this.commonService.CCToFC(form.currency, this.alloyMastereForm.controls.price5Lc.value)
        );
        this.alloyMastereForm.controls.price5per.setValue(this.percentageCalculate(this.alloyMastereForm.value.price5Lc))
      }
    });
  }

  priceSchemeValuevation() {
    if (this.alloyMastereForm.controls.price1code.value === "") {
      alert('This Aleat')
    }
  }



  percentageCalculate(strpriceLC: any) {
    let weightAvgCostLC = this.commonService.emptyToZero(this.alloyMastereForm.value.weightAvgCostLC)
    let avgPercentage = ((parseInt(strpriceLC) - weightAvgCostLC) / weightAvgCostLC) * 100
    console.log(avgPercentage)
    return avgPercentage.toFixed(1)
  }

  /** price calculation */
  TagPrice_Calculation(item: any) {
    let form = this.alloyMastereForm.value
    let strpriceLC: any = this.commonService.emptyToZero(form.weightAvgCostLC)
    let weightAvgCostLC = this.commonService.emptyToZero(form.weightAvgCostLC)
    let ADDLVALUE = this.commonService.emptyToZero(item.ADDLVALUE)
    if (item.ADDLVALUE_SIGN != "") {
      switch (item.ADDLVALUE_SIGN) {
        case "+":
          strpriceLC = (weightAvgCostLC + ADDLVALUE);
          break;
        case "-":
          strpriceLC = (weightAvgCostLC - ADDLVALUE);
          break;
        case "*":
          strpriceLC = (weightAvgCostLC * ADDLVALUE);
          break;
        case "/":
          strpriceLC = (weightAvgCostLC / ADDLVALUE);
          break;
        default:
          strpriceLC = (weightAvgCostLC);
          break;
      }
    }
    let PriceMethod = this.commonService.emptyToZero(item.PRICE_METHOD);
    let PRICE_VALUE = this.commonService.emptyToZero(item.PRICE_VALUE);

    switch (PriceMethod) {
      case 1://FIXED
        strpriceLC = item.PRICE_VALUE;
        if (item.PRICE_ROUDOFF) strpriceLC = strpriceLC.toFixed(item.ROUNDOFF_DIGIT);
        return strpriceLC;
      case 0://COST
        switch (item.PRICE_SIGN) {
          case "+":
            strpriceLC = (strpriceLC + PRICE_VALUE);
            break;
          case "-":
            strpriceLC = (strpriceLC - PRICE_VALUE);
            break;
          case "*":
            strpriceLC = (strpriceLC * PRICE_VALUE);
            break;
          case "/":
            strpriceLC = (strpriceLC / PRICE_VALUE);
            break;
          case "+%":
            strpriceLC = (strpriceLC + ((strpriceLC * PRICE_VALUE) / 100));
            break;
          case "/%"://Added By Manish for Diamant requirement JIRA SUN-389
            strpriceLC = ((strpriceLC * 100) / PRICE_VALUE);
            break;
        }
        strpriceLC = this.commonService.emptyToZero(strpriceLC)
        switch (item.FINALPRICE_SIGN) {
          case "+":
            strpriceLC = (this.commonService.emptyToZero(strpriceLC) + item.FINALPRICE_VALUE);
            if (item.PRICE_ROUDOFF) strpriceLC = this.commonService.emptyToZero(strpriceLC).toFixed(item.ROUNDOFF_DIGIT);
            break;
          case "-":
            strpriceLC = (this.commonService.emptyToZero(strpriceLC) - item.FINALPRICE_VALUE);
            if (item.PRICE_ROUDOFF) strpriceLC = this.commonService.emptyToZero(strpriceLC).toFixed(item.ROUNDOFF_DIGIT);
            break;
          case "*":
            strpriceLC = (this.commonService.emptyToZero(strpriceLC) * item.FINALPRICE_VALUE);
            if (item.PRICE_ROUDOFF) strpriceLC = this.commonService.emptyToZero(strpriceLC).toFixed(item.ROUNDOFF_DIGIT);
            break;
          case "/":
            strpriceLC = (this.commonService.emptyToZero(strpriceLC) / item.FINALPRICE_VALUE);
            if (item.PRICE_ROUDOFF) strpriceLC = this.commonService.emptyToZero(strpriceLC).toFixed(item.ROUNDOFF_DIGIT);
            break;
        }
        return this.commonService.decimalQuantityFormat(strpriceLC, 'AMOUNT')
    }
    return this.commonService.decimalQuantityFormat(strpriceLC, 'AMOUNT')
  }





  currencySelectedAed() {
    if (this.alloyMastereForm.controls.currency.value != "AED") {
      this.isCurrencySelected = false;
    } else {
      this.isCurrencySelected = true;
    }
  }

  currencyDataSelected(e: any, controller?: any) {
    debugger
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls['currency'].setValue(e.CURRENCY_CODE);
    this.alloyMastereForm.controls['currencyRate'].setValue(e.CONV_RATE);
    if (e.CURRENCY_CODE != "AED") {
      this.isCurrencySelected = false;
    } else {
      this.isCurrencySelected = true;
    }
    if (this.alloyMastereForm.value.priceScheme != "") {
      this.fillPriceSchemeDetails();
    } else {
      this.validateStockLC();
    }
    if (controller) {
      let value = this.alloyMastereForm.value.weightAvgCostLC
      let form = this.alloyMastereForm.value;
      let weightAvgCostFC = this.commonService.CCToFC(form.currency, value);
      this.setValueWithDecimal('weightAvgCostFC', weightAvgCostFC, 'AMOUNT')
    }
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
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.vendor.setValue(e.ACCODE);
    this.alloyMastereForm.controls.vendorRef.setValue(e.ACCOUNT_HEAD);
  }

  typeCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.type.setValue(e.CODE);
  }

  categoryCodeSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.category.setValue(e.CODE);
  }

  // priceCodeSelected(e: any) {
  //   if (this.checkStockCode()) return
  //   this.alloyMastereForm.controls.price.setValue(e.PREFIX_CODE);
  // }

  updatePrefixMaster() {
    if (!this.prefixMasterDetail) {
    }
    //console.log(this.prefixMasterDetail.PREFIX_CODE);
    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.prefixMasterDetail.PREFIX_CODE
    // let API = 'PrefixMaster/UpdatePrefixMaster/' + this.alloyMastereForm.value.code.toUpperCase();
    let postData = this.prefixMasterDetail

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            console.log('Last number updated')
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  codeSelected(e: any) {
    const code = e.PREFIX_CODE.toUpperCase();
    const description = e.DESCRIPTION.toUpperCase();
    this.alloyMastereForm.controls.code.setValue(code)
    this.alloyMastereForm.controls.description.setValue(description)
    this.prefixCodeValidate()
  }

  prefixCodeValidate() {
    const code = this.alloyMastereForm.value.code;
    if (!code) return;
    let API = `PrefixMaster/GetPrefixMasterDetail/${code}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          this.prefixMasterDetail = result.response;
          this.prefixMasterDetail.PREFIX_CODE = this.prefixMasterDetail.PREFIX_CODE.toUpperCase();
          this.prefixMasterDetail.DESCRIPTION = this.prefixMasterDetail.DESCRIPTION.toUpperCase();
          this.alloyMastereForm.controls.costCenter.setValue(this.prefixMasterDetail.COST_CODE)//same in software
          this.alloyMastereForm.controls.type.setValue(this.prefixMasterDetail.TYPE_CODE)
          this.alloyMastereForm.controls.category.setValue(this.prefixMasterDetail.CATEGORY_CODE)
          this.alloyMastereForm.controls.subCategory.setValue(this.prefixMasterDetail.SUBCATEGORY_CODE)
          this.alloyMastereForm.controls.brand.setValue(this.prefixMasterDetail.BRAND_CODE)
          this.alloyMastereForm.controls.description.setValue(this.prefixMasterDetail.DESCRIPTION)
          this.prefixMasterDetail.LAST_NO = this.incrementAndPadNumber(this.prefixMasterDetail.LAST_NO, 1)
          this.alloyMastereForm.controls.code.setValue(this.prefixMasterDetail.PREFIX_CODE + this.prefixMasterDetail.LAST_NO)
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
  incrementAndPadNumber(input: any, incrementBy: any) {
    // Convert the input to an integer and increment it
    let incrementedValue = parseInt(input, 10) + incrementBy;

    // Convert the incremented value back to a string and pad with leading zeros
    let paddedValue = incrementedValue.toString().padStart(input.length, '0');

    return paddedValue;
  }


  checkStockCode(): boolean {
    // if(this.content.FLAG == 'VIEW' || this.content.FLAG == 'EDIT'){
    //   return true;
    // }else{
    if (this.alloyMastereForm.value.code == '') {
      this.commonService.toastErrorByMsgId('MSG1628');
      return true
    }
    return false
    // } 
  }
  checkCode() {
    if (this.alloyMastereForm.value.code == '') {
      this.commonService.toastErrorByMsgId('MSG1628');
      return true;
    }
    return false;
  }

  private setInitialValues() {

    this.alloyMastereForm.controls.price1per.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price2per.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price3per.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price4per.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price5per.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price1Fc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price2Fc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price3Fc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price4Fc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price5Fc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price1Lc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price2Lc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price3Lc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price4Lc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.alloyMastereForm.controls.price5Lc.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
  }



  // priceSchemeValidate(e: any) {
  //   if (this.checkStockCode()) return
  //   this.alloyMastereForm.controls.priceScheme.setValue(e.PRICE_CODE)
  //   let API = 'PriceSchemeMaster/GetPriceSchemeMasterList/' + this.alloyMastereForm.value.priceScheme
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       this.commonService.closeSnackBarMsg()
  //       if (result.response) {
  //         let data = result.response;
  //         this.alloyMastereForm.controls.PRICE1.setValue(data.PRICE1)
  //         this.alloyMastereForm.controls.price2code.setValue(data.PRICE2)
  //         this.alloyMastereForm.controls.price3code.setValue(data.PRICE3)
  //         this.alloyMastereForm.controls.price4code.setValue(data.PRICE4)
  //         this.alloyMastereForm.controls.price5code.setValue(data.PRICE5)
  //       }
  //     }, err => {
  //       this.commonService.closeSnackBarMsg()
  //       this.commonService.toastErrorByMsgId('MSG1531')
  //     })
  //   this.subscriptions.push(Sub)
  // }
  costCenterSelected(e: any) {
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.costCenter.setValue(e.COST_CODE);

  }
  /** checking for same account code selection */
  private isSamepriceCodeSelected(PRICE_CODE: any): boolean {
    return (
      this.alloyMastereForm.value.price1code === PRICE_CODE ||
      this.alloyMastereForm.value.price2code === PRICE_CODE ||
      this.alloyMastereForm.value.price3code === PRICE_CODE ||
      this.alloyMastereForm.value.price4code === PRICE_CODE ||
      this.alloyMastereForm.value.price5code === PRICE_CODE
    );
  }




  handlePriceCodeChange(currentCodeKey: string, controls: { lc: string, fc: string, per: string }, errorMsgId: string) {
    if (this.checkStockCode()) return;

    const formValue = this.alloyMastereForm.value;
    const currentCode = formValue[currentCodeKey];

    // Collect all other price codes except the current one
    const otherPriceCodes = [
      formValue.price1code,
      formValue.price2code,
      formValue.price3code,
      formValue.price4code,
      formValue.price5code
    ].filter(code => code !== currentCode);

    // Check for duplicate price code among the other price codes
    if (otherPriceCodes.includes(currentCode)) {
      this.commonService.toastErrorByMsgId(errorMsgId);
      return;
    }

    // If the current price code is empty, reset the related form controls
    if (currentCode === "") {
      this.alloyMastereForm.controls[controls.lc].reset('');
      this.alloyMastereForm.controls[controls.fc].reset('');
      this.alloyMastereForm.controls[controls.per].reset('');
    }
  }

  checkCode1Price() {
    if (this.alloyMastereForm.value.price1code == '') {
      this.commonService.toastErrorByMsgId('Price 1 code Emty');
      return true;
    }
    return false;
  }

  checkCode2Price() {
    if (this.alloyMastereForm.value.price2code == '') {
      this.commonService.toastErrorByMsgId('Price 2 code Emty');
      return true;
    }
    return false;
  }

  checkCode3Price() {
    if (this.alloyMastereForm.value.price3code == '') {
      this.commonService.toastErrorByMsgId('Price 3 code Emty');
      return true;
    }
    return false;
  }

  checkCode4Price() {
    if (this.alloyMastereForm.value.price4code == '') {
      this.commonService.toastErrorByMsgId('Price 4 code Emty');
      return true;
    }
    return false;
  }

  checkCode5Price() {
    if (this.alloyMastereForm.value.price5code == '') {
      this.commonService.toastErrorByMsgId('Price 5 code Emty');
      return true;
    }
    return false;
  }

  priceCodeOne(e: any) {
    this.handlePriceCodeChange(
      'price1code',
      { lc: 'price1Lc', fc: 'price1Fc', per: 'price1per' },
      'MSG1659'
    );
  }

  priceTwoCode(e: any) {
    this.handlePriceCodeChange(
      'price2code',
      { lc: 'price2Lc', fc: 'price2Fc', per: 'price2per' },
      'MSG1659'
    );
  }

  priceThreeCode(e: any) {

    this.handlePriceCodeChange(
      'price3code',
      { lc: 'price3Lc', fc: 'price3Fc', per: 'price3per' },
      'MSG1659'
    );
  }

  priceFourCode(e: any) {

    this.handlePriceCodeChange(
      'price4code',
      { lc: 'price4Lc', fc: 'price4Fc', per: 'price4per' },
      'MSG1659'
    );
  }

  priceFiveCode(e: any) {
    this.handlePriceCodeChange(
      'price5code',
      { lc: 'price5Lc', fc: 'price5Fc', per: 'price5per' },
      'MSG1659'
    );
  }



  setPriceCodeFromAPI(PRICE_CODE: string, PRICE_FEILD: string) {
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `PriceMaster/GetPriceMasterDetails/${PRICE_CODE?.toUpperCase()}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          if (data) {
            switch (PRICE_FEILD) {
              case 'price1code':
                this.price1Array = []
                this.price1Array.push(data)
                break;
              case 'price2code':
                this.price2Array = []
                this.price2Array.push(data)
                break;
              case 'price3code':
                this.price3Array = []
                this.price3Array.push(data)
                break;
              case 'price4code':
                this.price4Array = []
                this.price4Array.push(data)
                break;
              case 'price5code':
                this.price5Array = []
                this.price5Array.push(data)
                break;
              default:
                break;
            }
            this.validateStockLC()
          }
        }
      })
    this.subscriptions.push(Sub)
  }

  validateStockLC() {
    let form = this.alloyMastereForm.value;
    if (this.commonService.nullToString(form.price1code) != '') {
      if (this.price1Array.length > 0) {
        let LC = this.TagPrice_Calculation(this.price1Array[0])
        console.log(LC);
        this.setValueWithDecimal('price1Lc', LC, 'AMOUNT')
        this.price1LcChange();
      }
    }
    if (this.commonService.nullToString(form.price2code) != '') {
      if (this.price2Array.length > 0) {
        let LC = this.TagPrice_Calculation(this.price2Array[0])
        this.setValueWithDecimal('price2Lc', LC, 'AMOUNT')
        this.price2LcChange();
      }
    }
    if (this.commonService.nullToString(form.price3code) != '') {
      if (this.price3Array.length > 0) {
        let LC = this.TagPrice_Calculation(this.price3Array[0])
        this.setValueWithDecimal('price3Lc', LC, 'AMOUNT')
        this.price3LcChange();
      }
    }
    if (this.commonService.nullToString(form.price4code) != '') {
      if (this.price4Array.length > 0) {
        let LC = this.TagPrice_Calculation(this.price4Array[0])
        this.setValueWithDecimal('price4Lc', LC, 'AMOUNT')
        this.price4LcChange();
      }
    }
    if (this.commonService.nullToString(form.price5code) != '') {
      if (this.price5Array.length > 0) {
        let LC = this.TagPrice_Calculation(this.price5Array[0])
        this.setValueWithDecimal('price5Lc', LC, 'AMOUNT')
        this.price5LcChange();
      }
    }
  }

  priceOneCodeSelected(e: any) {
    if (this.checkCode()) return
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG1659');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price1code.setValue(e.PRICE_CODE);
    this.priceSchemeDetails = [];
    if (this.priceSchemeDetails?.length > 0) {
      this.fillPriceSchemeDetails() //price scheme master API call
    } else {
      this.setPriceCodeFromAPI(e.PRICE_CODE, 'price1code') // price list master API call if scheme is not preset
    }
  }

  priceTwoCodeSelected(e: any) {
    if (this.checkCode()) return

    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG1659');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price2code.setValue(e.PRICE_CODE);
    this.priceSchemeDetails = [];

    if (this.priceSchemeDetails?.length > 0) {
      this.fillPriceSchemeDetails() //price scheme master API call
    } else {
      this.setPriceCodeFromAPI(e.PRICE_CODE, 'price2code')// price list master API call if scheme is not preset
    }
  }

  priceThreeCodeSelected(e: any) {
    if (this.checkCode()) return

    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG1659');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price3code.setValue(e.PRICE_CODE);
    this.priceSchemeDetails = [];

    if (this.priceSchemeDetails?.length > 0) {
      this.fillPriceSchemeDetails() //price scheme master API call
    } else {
      this.setPriceCodeFromAPI(e.PRICE_CODE, 'price3code')// price list master API call if scheme is not preset
    }
  }

  priceFourCodeSelected(e: any) {
    if (this.checkCode()) return

    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG1659');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price4code.setValue(e.PRICE_CODE);
    this.priceSchemeDetails = [];

    if (this.priceSchemeDetails?.length > 0) {
      this.fillPriceSchemeDetails() //price scheme master API call
    } else {
      this.setPriceCodeFromAPI(e.PRICE_CODE, 'price4code')// price list master API call if scheme is not preset
    }

  }
  priceFiveCodeSelected(e: any) {
    if (this.checkCode()) return
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG1659');
      return;
    }
    if (this.checkStockCode()) return
    this.alloyMastereForm.controls.price5code.setValue(e.PRICE_CODE);
    this.priceSchemeDetails = [];

    if (this.priceSchemeDetails?.length > 0) {
      this.fillPriceSchemeDetails() //price scheme master API call
    } else {
      this.setPriceCodeFromAPI(e.PRICE_CODE, 'price5code')// price list master API call if scheme is not preset
    }
  }

  HSNCenterSelected(e: any) {
    console.log(e);
    this.checkStockCode();
    this.alloyMastereForm.controls.hsncode.setValue(e.CODE);
  }
  // set post data to save
  setPostData() {
    let form = this.alloyMastereForm.value;
    let postData = {
      ITEM: 'Y',
      STOCK_CODE: this.commonService.nullToString(form.code.toUpperCase()),
      STOCK_DESCRIPTION: this.commonService.nullToString(form.description.toUpperCase()),
      CURRENCY_CODE: this.commonService.nullToString(form.currency),
      CC_RATE: this.commonService.emptyToZero(form.currencyRate),
      COST_CODE: this.commonService.nullToString(form.costCenter),
      TYPE_CODE: this.commonService.nullToString(form.type),
      CATEGORY_CODE: this.commonService.nullToString(form.category),
      SUBCATEGORY_CODE: this.commonService.nullToString(form.subCategory),
      BRAND_CODE: this.commonService.nullToString(form.brand),
      COUNTRY_CODE: this.commonService.nullToString(form.country),
      SUPPLIER_CODE: this.commonService.nullToString(form.vendor),
      SUPPLIER_REF: this.commonService.nullToString(form.vendorRef),
      DESIGN_CODE: this.commonService.nullToString(form.design),
      SET_REF: this.commonService.nullToString(form.design),
      PICTURE_NAME: this.commonService.nullToString(form.picture_name),
      PICTURE_NAME1: this.commonService.nullToString(form.picturename1),
      STOCK_FCCOST: this.commonService.emptyToZero(form.weightAvgCostFC),
      STOCK_LCCOST: this.commonService.emptyToZero(form.weightAvgCostLC),
      PRICE1PER: this.commonService.nullToString(form.price1code),
      PRICE2PER: this.commonService.nullToString(form.price2code),
      PRICE3PER: this.commonService.nullToString(form.price3code),
      PRICE4PER: this.commonService.nullToString(form.price4code),
      PRICE5PER: this.commonService.nullToString(form.price5code),

      PRICE1FC: this.commonService.emptyToZero(form.price1Fc),
      PRICE2FC: this.commonService.emptyToZero(form.price2Fc),
      PRICE3FC: this.commonService.emptyToZero(form.price3Fc),
      PRICE4FC: this.commonService.emptyToZero(form.price4Fc),
      PRICE5FC: this.commonService.emptyToZero(form.price5Fc),

      PRICE1LC: this.commonService.emptyToZero(form.price1Lc),
      PRICE2LC: this.commonService.emptyToZero(form.price2Lc),
      PRICE3LC: this.commonService.emptyToZero(form.price3Lc),
      PRICE4LC: this.commonService.emptyToZero(form.price4Lc),
      PRICE5LC: this.commonService.emptyToZero(form.price5Lc),

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
      COLOR: this.commonService.nullToString(form.color),
      CLARITY: this.commonService.nullToString(form.clarity),
      SIZE: this.commonService.nullToString(form.size),
      SIEVE: "",
      SHAPE: "",
      GRADE: "",
      FLUOR: this.commonService.nullToString(form.fluorescence),
      FINISH: "",
      CERT_BY: this.commonService.nullToString(form.certificateby),
      CERT_NO: this.commonService.nullToString(form.certificateno),
      CERT_DATE: "",
      GRIDLE: "",
      CULET: "",
      TWIDTH: 0,
      CRHEIGHT: 0,
      PAVDEPTH: 0,
      OVERALL: this.commonService.nullToString(form.overall),
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
      OPENED_ON: this.commonService.formatDateTime(this.currentDate),
      OPENED_BY: this.commonService.nullToString(form.createdBy),
      FIRST_TRN: this.commonService.formatDateTime(form.fristtransaction),
      LAST_TRN: this.commonService.formatDateTime(form.lasttransaction),
      MID: this.content?.MID || 0,
      PRINTED: false,
      PURVOCTYPE_NO: "",
      PURPARTY: "",
      PURDATE: "",
      PURAMOUNT: 0,
      PURBRLOC: "",
      SALVOCTYPE_NO: "",
      SALPARTY: this.commonService.nullToString(form.salesman),
      SALDATE: "",
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
      PCS_PERUNIT: this.commonService.emptyToZero(form.PCSunit),
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
      CERT_PRINTED: false,
      NOQTYCHANGE: false,
      STYLE: this.commonService.nullToString(form.style),
      CUSTOMERSKU: "",
      INITIAL_BRPURVOCTYPE_NO: "",
      STOCK_DESCRIPTION_OTHERS: this.commonService.nullToString(form.otherdesc),
      TIME_CODE: this.commonService.nullToString(form.time),
      RANGE_CODE: this.commonService.nullToString(form.range),
      COMMENTS_CODE: "",
      NOTES: "",
      ASK: "",
      SELL: "",
      CUT: "",
      POLISH: "",
      SYMMETRY: "",
      UDF1: this.commonService.nullToString(form.userdefined_1),
      UDF2: this.commonService.nullToString(form.userdefined_2),
      UDF3: this.commonService.nullToString(form.userdefined_3),
      UDF4: this.commonService.nullToString(form.userdefined_4),
      UDF5: this.commonService.nullToString(form.userdefined_5),
      UDF6: this.commonService.nullToString(form.userdefined_6),
      UDF7: this.commonService.nullToString(form.userdefined_7),
      UDF8: this.commonService.nullToString(form.userdefined_8),
      UDF9: this.commonService.nullToString(form.userdefined_9),
      UDF10: this.commonService.nullToString(form.userdefined_10),
      UDF11: this.commonService.nullToString(form.userdefined_11),
      UDF12: this.commonService.nullToString(form.userdefined_12),
      UDF13: this.commonService.nullToString(form.userdefined_13),
      UDF14: this.commonService.nullToString(form.userdefined_14),
      UDF15: this.commonService.nullToString(form.userdefined_15),
      PROMOTIONALITEM: false,
      EXCLUDEGSTVAT: false,
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
      DIA_PCS: this.commonService.emptyToZero(form.diamondsPcs),
      DIA_CARAT: this.commonService.emptyToZero(form.diamondsCarat),
      DIA_VALUEFC: this.commonService.emptyToZero(form.diamondsFC),
      DIA_VALUECC: this.commonService.emptyToZero(form.diamondsLC),
      COLOR_PCS: this.commonService.emptyToZero(form.colorstonePcs),
      COLOR_CARAT: this.commonService.emptyToZero(form.colorstoneCarat),
      COLOR_VALUEFC: this.commonService.emptyToZero(form.colorstoneFC),
      COLOR_VALUECC: this.commonService.emptyToZero(form.colorstoneLC),
      PEARL_PCS: this.commonService.emptyToZero(form.pearlsPcs),
      PEARL_CARAT: this.commonService.emptyToZero(form.pearlsCarat),
      PEARL_VALUEFC: this.commonService.emptyToZero(form.pearlsFC),
      PEARL_VALUECC: this.commonService.emptyToZero(form.pearlsLC),
      OTSTONES_PCS: this.commonService.emptyToZero(form.otstonesPcs),
      OTSTONES_CARAT: this.commonService.emptyToZero(form.otstonesCarat),
      OTSTONES_VALUEFC: this.commonService.emptyToZero(form.otstonesFC),
      OTSTONES_VALUECC: this.commonService.emptyToZero(form.otstonesLC),
      METAL_GROSSWT: this.commonService.emptyToZero(form.metalGrams),
      METAL_VALUEFC: this.commonService.emptyToZero(form.metalFC),
      METAL_VALUECC: this.commonService.emptyToZero(form.metalLC),
      TOTPCS: this.commonService.emptyToZero(form.totalPcs),
      TOTCARAT: this.commonService.emptyToZero(form.totalCarat),
      TOTGMS: this.commonService.emptyToZero(form.totalGrams),
      TOTVFC: this.commonService.emptyToZero(form.totalFC),
      TOTVLC: this.commonService.emptyToZero(form.totalLC),
      TOTALFC: 0,
      TOTALCC: 0,
      LAST_EDT_BY: this.commonService.nullToString(form.lasteditby),
      LAST_EDT_ON: "",
      UNITCODE: "",
      UNITWT: 0,
      CHKUNIT: false,
      CHKCOMPONENTSUMMARY: "",
      CHKCOMPONENTDETAIL: "",
      CMBNATURE: "",
      CMBTYPE: "",
      RFID_TAG: "",
      SKUDESCRIPTION: "",
      ON_OFF: false,
      NOTFORSALES: 0,
      TRANSFERED_WEB: false,
      CALCULATE_COSTING: false,
      QUALITY_CODE: "",
      PARENTSTOCK_CODE: "",
      PARTNER_CODE: "",
      KPNUMBER: "",
      HSN_CODE: this.commonService.nullToString(form.hsncode),
      ITEM_ONHOLD: false,
      POS_CUST_CODE: this.commonService.nullToString(form.POScus),
      CONSIGNMENT: false,
      POSGROSSWT: this.commonService.emptyToZero(form.grossWt),
      HANDLING_CHARGEFC: 0,
      HANDLING_CHARGELC: 0,
      ORG_COSTFC: 0,
      ORG_COSTLC: 0,
      VATONMARGIN: false,
      SALESPERSON_CODE: "",
      ORDSALESPERSON_CODE: "",
      BATCH_STOCK: false,
      BATCH_PREFIX: "",
      SIEVE_SET: "",
      MODEL_CODE: this.commonService.nullToString(form.modelcode),
      NOOF_PLAT: this.commonService.emptyToZero(form.noofplat),
      PLAT_CHARGESFC: 0,
      PLAT_CHARGESLC: 0,
      CERT_CHARGESLC: 0,
      CERT_CHARGESFC: 0,
      UNFIX_DIAMOND_ITEM: false,
      ALLOW_WITHOUT_RATE: false,
      RRR_STOCK_REF: "",
      MARKETCOSTFC: this.commonService.emptyToZero(form.marketcost),
      MARKETCOSTLC: 0,
      RRR_PRICE_UPDATED: false,
      RRR_PRICE_UPDDATE: "2023-11-27T07:30:26.960Z",
      SALESCODE: 0,
      RRR_PUR_CARAT: 0,
      RRR_PUR_PERCENT: 0,
      RRR_SAL_PERCENT: 0,
      RRR_OTHER_PERCENT: 0,
      SET_PICTURE_NAME: "",
      PACKET_ITEM: false,
      PACKET_WT: 0,
      SALES_TAGLINES: "",
      ALLOW_ZEROPCS: this.onchangeCheckBox(form.allowpcs),
      NOOF_CERT: this.commonService.emptyToZero(form.noofcert),
      ADDITIONAL_RATEFC: 0,
      ADDITIONAL_RATELC: 0,
      WBOXWOUTBOX: 0,
      // ALLOW_NEGATIVE: this.onchangeCheckBox(form.silveralloy),
      ALLOW_NEGATIVE: false, // Discuss with ALS and hadcode as
      EXCLUDE_TRANSFER_WT: this.onchangeCheckBox(form.excludeTransferWt),
      WT_VAR_PER: 0,
      HALLMARKING: this.commonService.nullToString(form.hallmarking),
      WOO_CATEGORY_ID: 0,
      DESIGN_DESC: "",
      COST_CENTER_DESC: "",
      SUPPLIER_DESC: "",
      ORDSALESPERSON_DESC: "",
      COUNTRY_DESC: "",
      TYPE_DESC: this.commonService.nullToString(form.Type),
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
      MANUFACTURE_ITEM: false,
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
    return postData
  }

  checkCodeExists() {
    if (this.alloyMastereForm.value.code.toString() == '') return
    let API = 'DesignMaster/CheckIfDesignCodePresent/' + this.alloyMastereForm.value.code
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Design Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
            }
          });
          this.alloyMastereForm.controls.code.setValue('')
        } else {
          this.prefixCodeValidate()
        }
      }, err => {
        this.alloyMastereForm.controls.code.setValue('')
      })
    // this.validateLookupField(event, this.codeData, 'code');
    this.subscriptions.push(Sub)
  }



  submitValidations(form: any) {
    if (this.commonService.nullToString(form.code) == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.costCenter) == '') {
      this.commonService.toastErrorByMsgId('MSG1150')//"costCenter cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1173')//"currency cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.description) == '') {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return true
    }

    return false;
  }
  setAllInitialValues() {
    if (!this.content?.FLAG) return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `DiamondStockMaster/GetDiamondStockMasterWithMid/${this.content?.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.setFormValues();
          this.alloyMastereForm.controls.price1code.setValue(data.PRICE1PER)
          this.alloyMastereForm.controls.price2code.setValue(data.PRICE2PER)
          this.alloyMastereForm.controls.price3code.setValue(data.PRICE3PER)
          this.alloyMastereForm.controls.price4code.setValue(data.PRICE4PER)
          this.alloyMastereForm.controls.price5code.setValue(data.PRICE5PER)
          this.alloyMastereForm.controls.currency.setValue(data.CURRENCY_CODE)
          // this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE'
          // this.alloyMastereForm.controls.currencyRate.setValue(data.CC_RATE )
          this.alloyMastereForm.controls.currencyRate.setValue(this.commonService.decimalQuantityFormat(data.CC_RATE, "RATE"))
          if (this.commonService.nullToString(data.PRICE1PER) != '') this.setPriceCodeFromAPI(data.PRICE1PER, 'price1code')
          if (this.commonService.nullToString(data.PRICE2PER) != '') this.setPriceCodeFromAPI(data.PRICE2PER, 'price2code')
          if (this.commonService.nullToString(data.PRICE3PER) != '') this.setPriceCodeFromAPI(data.PRICE3PER, 'price3code')
          if (this.commonService.nullToString(data.PRICE4PER) != '') this.setPriceCodeFromAPI(data.PRICE4PER, 'price4code')
          if (this.commonService.nullToString(data.PRICE5PER) != '') this.setPriceCodeFromAPI(data.PRICE5PER, 'price5code')
          //set to main grid
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    // if (this.alloyMastereForm.value.costCenter != 'ALY') {
    //   this.commonService.toastErrorByMsgId('Please enter cost center For CONSUMABLE ITEMS ')
    //   return
    // }



    if (this.submitValidations(this.alloyMastereForm.value)) return;
    let API = "DiamondStockMaster/InsertDiamondStockMaster";
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.updatePrefixMaster()
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2239') || 'Saved Successfully')
        } else if (result.status == "Failed") {
          this.commonService.toastErrorByMsgId('MSG1121')
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }



  updateMeltingType() {
    let API = 'DiamondStockMaster/UpdateDiamondStockMaster/' + this.content.STOCK_CODE;
    let postdata = this.setPostData()
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postdata)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2239') || 'Updated Successfully')
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  afterSave(value: any) {
    if (value) {
      this.alloyMastereForm.reset()
      this.tableData = []
      this.close('reloadMainGrid')
    }
  }
  /**USE: delete worker master from row */
  deleteAlloyMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.STOCK_CODE) {
      this.commonService.toastErrorByMsgId('MSG2347');
      return;
    }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'DiamondStockMaster/DeleteDiamondStockMaster/' + this.alloyMastereForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog(this.content?.STOCK_CODE + ' Deleted successfully');
              } else {
                this.commonService.toastErrorByMsgId('MSG2272');
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');
            }
          }, err => {
            this.commonService.toastErrorByMsgId('MSG1531')
          });
        this.subscriptions.push(Sub);
      }
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

  showDeleteErrorDialog(message: string): void {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
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

  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      // this.afterSave(result.value)
    });
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'code':
        this.overlaycodeSearch.showOverlayPanel(event);
        break;
      case 'costCenter':
        this.overlaycostCenterSearch.showOverlayPanel(event);
        break;
      case 'type':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'subCategory':
        this.overlaysubCategorySearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.overlaybrandSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'currency':
        this.overlaycurrencySearch.showOverlayPanel(event);
        break;
      case 'hsncode':
        this.overlayhsncodeSearch.showOverlayPanel(event);
        break;
      case 'price1code':
        this.overlayprice1codeSearch.showOverlayPanel(event);
        break;
      case 'price2code':
        this.overlayprice2codeSearch.showOverlayPanel(event);
        break;
      case 'price3code':
        this.overlayprice3codeSearch.showOverlayPanel(event);
        break;
      case 'price4code':
        this.overlayprice4codeSearch.showOverlayPanel(event);
        break;
      case 'price5code':
        this.overlayprice5codeSearch.showOverlayPanel(event);
        break;
      case 'vendor':
        this.overlayvendorSearch.showOverlayPanel(event);
        break;
      default:
    }
  }

  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'code') {
  //     this.overlaycodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'costCenter' ) {
  //     this.overlaycostCenterSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'type' ) {
  //     this.overlaytypeSearch.showOverlayPanel(event)
  //   }

  //   if (formControlName == 'category' ) {
  //     this.overlaycategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'subCategory' ) {
  //     this.overlaysubCategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'brand' ) {
  //     this.overlaybrandSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'color' ) {
  //     this.overlaycolorSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'currency' ) {
  //     this.overlaycurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'hsncode' ) {
  //     this.overlayhsncodeSearch.showOverlayPanel(event)
  //   }

  //   if (formControlName == 'price1code' ) {
  //     this.overlayprice1codeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price2code' ) {
  //     this.overlayprice2codeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price3code' ) {
  //     this.overlayprice3codeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price4code' ) {
  //     this.overlayprice4codeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price5code' ) {
  //     this.overlayprice5codeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'vendor' ) {
  //     this.overlayvendorSearch.showOverlayPanel(event)
  //   }
  // }
}
